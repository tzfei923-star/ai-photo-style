require('dotenv').config();
const path = require('path');
const express = require('express');
const multer = require('multer');

const app = express();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 } // 15MB
});

const PORT = process.env.PORT || 3000;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const GENERATION_BACKEND = process.env.GENERATION_BACKEND || 'local'; // 'local' or 'openai'
const SD_WEBUI_URL = process.env.SD_WEBUI_URL || 'http://127.0.0.1:7860';

const STYLE_PROMPTS_OPENAI = {
  shoujo: `Redraw this photo as a Japanese shoujo manga illustration. Keep the same person, pose, and facial identity, but restyle with large sparkling eyes, soft pastel color palette, delicate linework, gentle screentone shading, and a dreamy romantic atmosphere with soft bokeh flowers or light particles in the background. Clean digital manga art, high detail, vibrant and youthful.`,
  shounen: `Redraw this photo as a Japanese shounen manga / anime illustration. Keep the same person, pose, and facial identity, but restyle with bold dynamic linework, sharp confident expression, dramatic lighting, high contrast colors, speed lines or energy effects in the background, and a heroic action-anime mood. Vibrant, high-energy, youthful style.`,
  ghibli: `Redraw this photo as a hand-painted Studio Ghibli style illustration. Keep the same person, pose, and facial identity, but restyle with soft painterly textures, warm natural lighting, whimsical watercolor-like background, gentle color palette, and a nostalgic, cozy, storybook atmosphere.`,
  cel: `Redraw this photo as a vibrant cel-shaded Japanese TV anime illustration. Keep the same person, pose, and facial identity, but restyle with crisp flat color fills, clean bold outlines, sharp cel-shading highlights, saturated modern anime colors, and a clean simple background typical of a contemporary anime opening scene.`
};

const STYLE_PROMPTS_LOCAL = {
  shoujo: {
    prompt: 'anime style, shoujo manga illustration, large sparkling eyes, soft pastel colors, delicate lineart, gentle screentone shading, dreamy romantic atmosphere, bokeh, best quality, masterpiece, highly detailed',
    denoising_strength: 0.55
  },
  shounen: {
    prompt: 'anime style, shounen manga illustration, bold dynamic lineart, sharp confident expression, dramatic lighting, high contrast colors, speed lines, energy effect, heroic action anime, best quality, masterpiece, highly detailed',
    denoising_strength: 0.6
  },
  ghibli: {
    prompt: 'anime style, studio ghibli style, hand-painted, soft painterly texture, warm natural lighting, whimsical watercolor background, gentle color palette, nostalgic storybook atmosphere, best quality, masterpiece, highly detailed',
    denoising_strength: 0.55
  },
  cel: {
    prompt: 'anime style, cel shading, vibrant colors, clean bold outlines, flat color fills, sharp highlights, modern anime opening scene, best quality, masterpiece, highly detailed',
    denoising_strength: 0.6
  }
};

const NEGATIVE_PROMPT = 'lowres, worst quality, low quality, blurry, bad anatomy, bad hands, extra limbs, watermark, text, signature';

app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/generate', upload.single('photo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: '沒有收到照片。' });
    }
    const style = req.body.style;

    if (GENERATION_BACKEND === 'openai') {
      return await generateWithOpenAI(req, res, style);
    }
    return await generateWithLocalSD(req, res, style);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '伺服器發生錯誤，請稍後再試。' });
  }
});

async function generateWithLocalSD(req, res, style) {
  const styleConfig = STYLE_PROMPTS_LOCAL[style];
  if (!styleConfig) {
    return res.status(400).json({ error: '未知的風格選項。' });
  }

  const imageBase64 = req.file.buffer.toString('base64');

  const payload = {
    init_images: [imageBase64],
    prompt: styleConfig.prompt,
    negative_prompt: NEGATIVE_PROMPT,
    denoising_strength: styleConfig.denoising_strength,
    steps: 25,
    width: 512,
    height: 512,
    cfg_scale: 7,
    sampler_name: 'DPM++ 2M Karras'
  };

  let sdRes;
  try {
    sdRes = await fetch(`${SD_WEBUI_URL}/sdapi/v1/img2img`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  } catch (err) {
    console.error('Stable Diffusion WebUI 連線失敗:', err);
    return res.status(502).json({
      error: '無法連線到本機 Stable Diffusion 服務，請確認 WebUI 是否已啟動（webui-user.bat）。'
    });
  }

  const data = await sdRes.json();

  if (!sdRes.ok) {
    console.error('Stable Diffusion WebUI error:', data);
    return res.status(sdRes.status).json({
      error: data?.error || '本機圖片生成失敗，請稍後再試。'
    });
  }

  const image = data.images?.[0];
  if (!image) {
    return res.status(500).json({ error: 'AI 沒有回傳圖片，請稍後再試。' });
  }

  res.json({ image: `data:image/png;base64,${image}` });
}

async function generateWithOpenAI(req, res, style) {
  if (!OPENAI_API_KEY) {
    return res.status(500).json({ error: '伺服器尚未設定 OPENAI_API_KEY，請在 .env 檔中設定。' });
  }
  const prompt = STYLE_PROMPTS_OPENAI[style];
  if (!prompt) {
    return res.status(400).json({ error: '未知的風格選項。' });
  }

  const formData = new FormData();
  formData.append('model', 'gpt-image-1');
  formData.append('prompt', prompt);
  formData.append('size', '1024x1024');
  formData.append(
    'image',
    new Blob([req.file.buffer], { type: req.file.mimetype || 'image/png' }),
    req.file.originalname || 'photo.png'
  );

  const openaiRes = await fetch('https://api.openai.com/v1/images/edits', {
    method: 'POST',
    headers: { Authorization: `Bearer ${OPENAI_API_KEY}` },
    body: formData
  });

  const data = await openaiRes.json();

  if (!openaiRes.ok) {
    console.error('OpenAI API error:', data);
    return res.status(openaiRes.status).json({
      error: data?.error?.message || '圖片生成失敗，請稍後再試。'
    });
  }

  const result = data.data?.[0];
  if (!result?.b64_json) {
    return res.status(500).json({ error: 'AI 沒有回傳圖片，請稍後再試。' });
  }

  res.json({ image: `data:image/png;base64,${result.b64_json}` });
}

app.listen(PORT, () => {
  console.log(`AI Photo Style 伺服器已啟動: http://localhost:${PORT}`);
  console.log(`生成後端: ${GENERATION_BACKEND === 'openai' ? 'OpenAI (付費 API)' : `本機 Stable Diffusion (${SD_WEBUI_URL})`}`);
  if (GENERATION_BACKEND === 'openai' && !OPENAI_API_KEY) {
    console.warn('警告：尚未設定 OPENAI_API_KEY，圖片生成功能將無法使用。請複製 .env.example 為 .env 並填入金鑰。');
  }
});
