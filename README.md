# 動漫變身鏡 AI Photo Style

拍照或上傳照片，選擇動漫風格（少女漫畫 / 熱血少年 / 吉卜力 / 賽璐璐動畫），
用 OpenAI 圖片生成 API 產生風格化圖片。

## 設定

1. 安裝套件：
   ```
   npm install
   ```
2. 複製 `.env.example` 為 `.env`，填入你的 OpenAI API 金鑰：
   ```
   OPENAI_API_KEY=sk-xxxxxxxx
   ```
3. 啟動伺服器：
   ```
   npm start
   ```
4. 開啟瀏覽器 http://localhost:3000

## 峽谷選角機（激鬥峽谷選角分析）

`public/wildrift/` 是一個獨立的像素風靜態頁面，點選五路（上路 / 打野 / 中路 / 下路 / 輔助）
就能看到目前版本最強的角色與各分級名單。

- 啟動伺服器後開 http://localhost:3000/wildrift/ ，或直接用瀏覽器打開 `public/wildrift/index.html`。
- 分級資料整理自 [WildRiftFire Tier List](https://www.wildriftfire.com/tier-list)，
  版本、日期與名單都放在 `public/wildrift/data.js`，改那個檔就能更新。

## 注意事項

- 拍照功能需要瀏覽器相機權限，且必須在 `localhost` 或 HTTPS 環境下才能使用。
- 若要部署到手機可用的公開網址，需要 HTTPS（例如用 ngrok、Vercel、或有 SSL 憑證的正式主機），否則手機瀏覽器會擋掉相機權限。
- 圖片生成使用 OpenAI `gpt-image-1` 的 `/v1/images/edits`，每次生成都會消耗你的 OpenAI 額度，請留意用量與費用。
