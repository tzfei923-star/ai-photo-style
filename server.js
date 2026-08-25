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

const STYLE_PROMPTS = {
  shoujo: `Redraw this photo as a Japanese shoujo manga illustration. Keep the same person, pose, and facial identity, but restyle with large sparkling eyes, soft pastel color palette, delicate linework, gentle screentone shading, and a dreamy romantic atmosphere with soft bokeh flowers or light particles in the background. Clean digital manga art, high detail, vibrant and youthful.`,
  shounen: `Redraw this photo as a Japanese shounen manga / anime illustration. Keep the same person, pose, and facial identity, but restyle with bold dynamic linework, sharp confident expression, dramatic lighting, high contrast colors, speed lines or energy effects in the background, and a heroic action-anime mood. Vibrant, high-energy, youthful style.`,
  ghibli: `Redraw this photo as a hand-painted Studio Ghibli style illustration. Keep the same person, pose, and facial identity, but restyle with soft painterly textures, warm natural lighting, whimsical watercolor-like background, gentle color palette, and a nostalgic, cozy, storybook atmosphere.`,
  cel: `Redraw this photo as a vibrant cel-shaded Japanese TV anime illustration. Keep the same person, pose, and facial identity, but restyle with crisp flat color fills, clean bold outlines, sharp cel-shading highlights, saturated modern anime colors, and a clean simple background typical of a contemporary anime opening scene.`
};

app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/generate', upload.single('photo'), async (req, res) => {
  try {
    if (!OPENAI_API_KEY) {
      return res.status(500).json({ error: '伺服器尚未設定 OPENAI_API_KEY，請在 .env 檔中設定。' });
    }
    if (!req.file) {
      return res.status(400).json({ error: '沒有收到照片。' });
    }
    const style = req.body.style;
    const prompt = STYLE_PROMPTS[style];
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
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '伺服器發生錯誤，請稍後再試。' });
  }
});

app.listen(PORT, () => {
  console.log(`AI Photo Style 伺服器已啟動: http://localhost:${PORT}`);
  if (!OPENAI_API_KEY) {
    console.warn('警告：尚未設定 OPENAI_API_KEY，圖片生成功能將無法使用。請複製 .env.example 為 .env 並填入金鑰。');
  }
});
