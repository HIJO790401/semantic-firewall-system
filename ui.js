// UI controller for Shen-Yao Semantic Firewall System
// 引擎 src/engine-v2.js 已用 <script> 載入，提供全域函式 auditSemantic()

let currentLang = "zh";

// 文字對照表
const i18n = {
  zh: {
    title: "Ω∞8888 · 語意防火牆系統",
    subtitle: "計算損失和快速風險分析器",
    placeholder: "貼上 AI 輸出或 Prompt 內容…",
    analyzeBtn: "開始分析",
    resultHeader: "審判結果",
    labelSpi: "語意污染指數 (SPI)：",
    labelCompute: "算力浪費成本：",
    labelScbkr: "SCBKR 責任鏈：",
    labelHallucination: "幻覺 / 拋光偵測：",
    labelRisk: "風險等級：",
    footer: "Shen-Yao 888π · 唯真長存｜幻象歸零",
    scbkrOk: "有責任主語",
    scbkrMissing: "MISSING（缺少責任主語）",
    riskLevel: {
      1: "低風險",
      2: "偏高",
      3: "高風險",
      4: "危險",
      5: "致命"
    },
    verdictPrefix: "判決：",
    riskLine: (label, grade, spi, loss) =>
      `風險等級：${label}（等級 ${grade}）｜SPI = ${spi}｜算力浪費 ≈ $${loss}`,
    scbkrLineOk: "SCBKR：有責任主語，至少出現一個「誰負責／因果／責任／沈耀」。",
    scbkrLineMissing:
      "SCBKR：缺少責任主語，建議補上「誰負責／因果／責任」相關描述。",
    summaryLine: (len, words, evasion, drift) =>
      `本文長度約 ${len} 字，詞數約 ${words}，偵測到逃避 ${evasion} 次、幻覺／擬人化 ${drift} 次。`
  },
  en: {
    title: "Ω∞8888 · Semantic Firewall System",
    subtitle: "Compute Loss & Prompt Risk Analyzer",
    placeholder: "Paste AI output or your prompt here…",
    analyzeBtn: "Analyze",
    resultHeader: "Verdict",
    labelSpi: "Semantic Pollution Index (SPI):",
    labelCompute: "Compute Waste Cost:",
    labelScbkr: "SCBKR Responsibility Chain:",
    labelHallucination: "Hallucination / Polishing Hits:",
    labelRisk: "Risk Level:",
    footer: "Shen-Yao 888π · Truth persists | Illusion collapses",
    scbkrOk: "OK (responsible subject found)",
    scbkrMissing: "MISSING (no responsible subject)",
    riskLevel: {
      1: "LOW",
      2: "ELEVATED",
      3: "HIGH",
      4: "DANGEROUS",
      5: "FATAL"
    },
    verdictPrefix: "Verdict:",
    riskLine: (label, grade, spi, loss) =>
      `Risk level: ${label} (grade ${grade}) | SPI = ${spi} | Compute waste ≈ $${loss}`,
    scbkrLineOk:
      "SCBKR: Found at least one phrase related to responsibility / causality.",
    scbkrLineMissing:
      "SCBKR: No explicit responsibility subject detected. Consider clarifying who is accountable.",
    summaryLine: (len, words, evasion, drift) =>
      `Text length ≈ ${len} chars, ≈ ${words} tokens, detected ${evasion} evasive phrases and ${drift} hallucination / anthropomorphic phrases.`
  }
};

// 風險分級（只看 SPI 數值）
function classifyRisk(spi) {
  let grade = 1;
  if (spi > 80) grade = 5;
  else if (spi > 60) grade = 4;
  else if (spi > 40) grade = 3;
  else if (spi > 20) grade = 2;
  return grade;
}

// 切換語言：更新所有靜態文字
function setLanguage(lang) {
  currentLang = lang;
  const t = i18n[lang];

  document.getElementById("titleText").textContent = t.title;
  document.getElementById("subtitleText").textContent = t.subtitle;
  document.getElementById("inputBox").placeholder = t.placeholder;
  document.getElementById("analyzeBtn").textContent = t.analyzeBtn;
  document.getElementById("resultHeader").textContent = t.resultHeader;

  document.getElementById("labelSpi").textContent = t.labelSpi;
  document.getElementById("labelCompute").textContent = t.labelCompute;
  document.getElementById("labelScbkr").textContent = t.labelScbkr;
  document.getElementById("labelHallucination").textContent =
    t.labelHallucination;
  document.getElementById("labelRisk").textContent = t.labelRisk;

  document.getElementById("footerText").textContent = t.footer;

  // 按鈕 active 樣式
  const btnZh = document.getElementById("btnZh");
  const btnEn = document.getElementById("btnEn");
  if (btnZh && btnEn) {
    btnZh.classList.toggle("active", lang === "zh");
    btnEn.classList.toggle("active", lang === "en");
  }
}

// 綁定事件
function setupUI() {
  const analyzeBtn = document.getElementById("analyzeBtn");
  const inputBox = document.getElementById("inputBox");

  // 分析按鈕
  analyzeBtn.addEventListener("click", () => {
    const text = (inputBox.value || "").trim();
    if (!text) {
      alert(currentLang === "zh" ? "請先貼上內容再分析。" : "Please paste some text first.");
      return;
    }

    // 呼叫引擎
    const result = auditSemantic(text);
    if (!result) return;

    // SPI / 算力 / SCBKR / 幻覺
    document.getElementById("spi").textContent = result.spi;
    document.getElementById("compute").textContent = "$" + result.computeLoss;
    document.getElementById("scbkr").textContent = result.scbkrScore;
    document.getElementById("hallucination").textContent =
      (currentLang === "zh"
        ? `幻覺命中 ${result.hallucination} 次｜逃避 ${result.evasionHits} 次`
        : `Hallucination ${result.hallucination} hits | Evasion ${result.evasionHits} hits`);

    // 風險等級
    const grade = classifyRisk(result.spi);
    const t = i18n[currentLang];
    const riskLabel = t.riskLevel[grade] || "";
    const riskEl = document.getElementById("riskLevel");
    if (riskEl) {
      riskEl.textContent =
        currentLang === "zh"
          ? `${riskLabel} ｜ 等級 ${grade}`
          : `${riskLabel} | Grade ${grade}`;
    }

    // 審判文字組裝
    const lines = [];

    // 行 1：簡短判決（STABLE / FATAL 等）
    lines.push(`${t.verdictPrefix} ${result.verdict}`);

    // 行 2：風險摘要
    lines.push(
      t.riskLine(riskLabel, grade, result.spi, result.computeLoss)
    );

    // 行 3：SCBKR 說明
    if (result.scbkrScore === "OK") {
      lines.push(t.scbkrLineOk);
    } else {
      lines.push(t.scbkrLineMissing);
    }

    // 行 4：統計摘要
    lines.push(
      t.summaryLine(
        result.length,
        result.words,
        result.evasionHits,
        result.driftHits
      )
    );

    document.getElementById("verdictText").textContent = lines.join("\n");

    // 顯示結果區塊
    document.getElementById("resultBox").classList.remove("hidden");
  });

  // 語言切換按鈕
  const btnZh = document.getElementById("btnZh");
  const btnEn = document.getElementById("btnEn");

  if (btnZh)
    btnZh.addEventListener("click", () => {
      setLanguage("zh");
    });

  if (btnEn)
    btnEn.addEventListener("click", () => {
      setLanguage("en");
    });

  // 預設中文
  setLanguage("zh");
}

// DOM 就緒後啟動
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", setupUI);
} else {
  setupUI();
        }
