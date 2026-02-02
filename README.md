# Ω∞8888 · Semantic Firewall System  
計算損失與提示治理引擎 — Shen-Yao 888π

Founder / 創辦人：Shen-Yao 888π（語意防火牆創辦人）  
Location：Taiwan, Taichung（台灣 · 台中）  
Contact / 合作信箱：ken0963521@gmail.com  

---

## 中文說明（ZH）

### 0. 這是什麼？

**Ω∞8888 · 語意防火牆系統**  
是一個在瀏覽器本地運行的小工具，用來：

- 偵測 AI 輸出 / Prompt 裡的  
  - 語意污染（Semantic Pollution）  
  - 幻覺 / 擬人化話術  
  - 假中立、逃避責任用語（「我只是模型」「視情況而定」…）  
- 粗估這段話「浪費多少算力成本」  
- 給出一個風險等級判定（Risk Grade）

這個系統主要是給：

- **LLM / AI 產品團隊** 做提示治理（Prompt Governance）
- **內容創作者 / 教學者** 檢查 AI 文案是否在亂講幹話
- **研究者** 看「模型表面很暖，但實際全在閃避責任」的模式

### 1. 系統特色

- 🧱 **純前端、零後端**
  - 只有 `index.html` + `style.css` + 內嵌 JS  
  - 所有分析都在你瀏覽器本機做，不上傳 Server

- 🧠 **語意防火牆核心引擎**
  - 掃描文字中的：
    - 假中立 / 推責用語（Fake-Neutral / Evasion）
    - 幻覺 / 擬人化語氣（Hallucination / Anthropomorphism）
    - SCBKR 主語責任鏈（有沒有講清楚「誰負責」「因果」「責任」）

- 🌐 **中英文雙語介面**
  - 頂部有兩個按鈕：`中文` / `EN`  
  - 切換後，標題、按鈕、指標說明、風險解釋都會跟著換語言  
  - 分析邏輯一樣，只是說明文字換成對應語言

- 🔥 **風險分級**
  - SPI（Semantic Pollution Index）會被轉成 1–5 級風險：
    - 1：低風險  
    - 2：偏高  
    - 3：高風險  
    - 4：危險  
    - 5：致命（FATAL）

### 2. 主要指標說明（ZH）

分析完之後，畫面會顯示這幾個欄位：

1. **語意污染指數（SPI）**  
   - 0–100 分  
   - 分數越高，表示文字裡「幻覺＋推責＋沒講責任主體」越嚴重

2. **算力浪費成本（Compute Waste Cost）**
   - 以字數 × 假設的每字成本 × 污染比例  
   - 目的是當一個 **直覺感**：這段垃圾話大概燒掉多少成本

3. **SCBKR 責任鏈**
   - `OK`：有看到「誰負責 / 因果 / 責任 / 沈耀」等關鍵詞  
   - `MISSING`：整段都沒有講清楚「誰要負責」，通常視為風險

4. **幻覺 / 拋光偵測**
   - 顯示類似：`幻覺命中 3 次｜逃避 2 次`  
   - 幻覺：像「我永遠在你身邊」「我感受到你的情緒」這種擬人化語句  
   - 逃避：像「我只是個模型」「視情況而定」「無法提供具體建議」

5. **風險等級**
   - `低風險 / 偏高 / 高風險 / 危險 / 致命` + 數字等級（1–5）  
   - 搭配底下的文字說明，幫你判斷這段話適不適合直接給使用者看

### 3. 如何操作（ZH）

1. 開啟部署好的網站（GitHub Pages 或本機檔案）  
2. 如果要中文界面 → 按 `中文`；要英文界面 → 按 `EN`  
3. 把你要檢查的：
   - AI 回覆  
   - Prompt / System Prompt  
   - 或任何文字  
   貼到中間的大 textarea 裡  
4. 按下 **「開始分析」**（或英文 `Analyze`）  
5. 往下滑，看下面的：
   - SPI
   - Compute Waste
   - SCBKR
   - 幻覺 / 逃避次數
   - 風險等級與詳細說明

---

## English Overview (EN)

### 0. What is this?

**Ω∞8888 · Semantic Firewall System**  
A browser-only tool designed by **Shen-Yao 888π** to:

- Detect **semantic pollution** in AI outputs or prompts
- Flag:
  - Fake-neutral / evasive phrases  
  - Hallucination / anthropomorphic wording  
  - Missing responsibility chain (SCBKR)
- Estimate approximate **compute waste cost**
- Output a **risk grade** from 1–5

Target users:

- LLM / AI product teams (prompt governance, safety review)
- Content creators / educators who rely on AI copy
- Researchers observing model behavior and responsibility drift

### 1. System Highlights

- 🧱 **Pure front-end**
  - Just `index.html` + `style.css` with inline JS
  - No backend, no logging — everything runs in your browser

- 🧠 **Semantic Firewall Engine**
  - Scans text for:
    - Fake-neutral / evasive phrasing
    - Hallucination / anthropomorphic language
    - SCBKR responsibility chain (who is accountable, cause & effect)

- 🌐 **Bilingual UI (ZH / EN)**
  - Top buttons: `中文` and `EN`
  - Switching updates all labels, explanations and verdict text
  - Core scoring logic is identical in both languages

- 🔥 **Risk Grading**
  - SPI (Semantic Pollution Index) → risk grade 1–5:
    - 1: LOW  
    - 2: ELEVATED  
    - 3: HIGH  
    - 4: DANGEROUS  
    - 5: FATAL

### 2. Main Metrics (EN)

After analysis, the interface shows:

1. **Semantic Pollution Index (SPI)**
   - 0–100  
   - Higher means more hallucination, evasion and missing responsibility

2. **Compute Waste Cost**
   - Rough estimate based on length × assumed cost per char × pollution factor  
   - Intended as an intuitive signal, not a precise billing number

3. **SCBKR Responsibility Chain**
   - `OK`: at least one phrase clearly indicating responsibility / causality  
   - `MISSING`: no explicit responsible subject – usually considered risky

4. **Hallucination / Polishing Detection**
   - Shows something like: `Hallucination 3 hits | Evasion 2 hits`  
   - Hallucination = “I feel your emotions”, “I will always stay by your side”, etc.  
   - Evasion = “I’m just a model”, “It depends”, “I can’t provide specific advice”

5. **Risk Level**
   - Label + numeric grade, e.g. `FATAL | Grade 5`  
   - Paired with a multi-line explanation under the `<pre>` verdict block

### 3. How to Use (EN)

1. Open the deployed page (GitHub Pages or local file).  
2. Choose language:
   - `中文` for Traditional Chinese  
   - `EN` for English  
3. Paste:
   - AI output  
   - Your prompt / system prompt  
   - Or any text you want to audit  
   into the textarea.  
4. Click **“開始分析”** / **“Analyze”**.  
5. Scroll down and read:
   - SPI
   - Compute Waste Cost
   - SCBKR
   - Hallucination & Evasion hits
   - Risk Level & detailed verdict

---

## Tech Stack / 技術簡介

- Front-end only: **HTML + CSS + Vanilla JavaScript**
- No frameworks, no build step
- Designed for **GitHub Pages** deployment or local use  
  （直接打開 `index.html` 即可跑）

---

## Contact / 合作洽談

- Founder / 創辦人：**Shen-Yao 888π**  
- Location：**Taiwan, Taichung（台灣 · 台中）**  
- Email / 合作信箱：**ken0963521@gmail.com**

商業合作、研究合作、技術交流歡迎直接來信。  
For collaboration, research, or integration proposals, feel free to get in touch.

---

## License / 授權

目前預設：**All Rights Reserved（保留所有權利）**。  
如需商業整合或大規模內部部署，請先來信討論授權與合作模式。
