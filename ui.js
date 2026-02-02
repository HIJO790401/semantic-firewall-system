// UI controller for Shen-Yao Semantic Firewall System
// 引擎已用 <script> 載入，這裡直接呼叫 auditSemantic()

let currentLang = "zh";

const i18n = {
  zh: {
    title: "Ω∞8888 · 語意防火牆系統",
    subtitle: "計算損失和快速風險分析器",
    placeholder: "貼上 AI 輸出或 Prompt 內容…",
    analyze: "開始分析",
    resultTitle: "審判結果",
    labelSpi: "語意污染指數 (SPI)：",
    labelCompute: "算力浪費成本：",
    labelScbkr: "SCBKR 責任鏈：",
    labelHallucination: "幻覺 / 拋光偵測：",
    labelRisk: "風險等級：",
    footer: "Shen-Yao 888π · 唯真長存｜幻象歸零",
    alertEmpty: "請先貼上內容再分析。",
    scbkrOK: "有責任主語",
    scbkrMissing: "缺少責任主語",
    riskLabels: {
      MINIMAL: "極低",
      LOW: "偏低",
      MEDIUM: "中等",
      HIGH: "偏高",
      LETHAL: "致命"
    }
  },
  en: {
    title: "Ω∞8888 · Semantic Firewall System",
    subtitle: "Compute Loss & Prompt Risk Analyzer",
    placeholder: "Paste AI output or prompt text here…",
    analyze: "Analyze",
    resultTitle: "Verdict",
    labelSpi: "Semantic Pollution Index (SPI):",
    labelCompute: "Estimated Compute Waste:",
    labelScbkr: "SCBKR Responsibility Chain:",
    labelHallucination: "Hallucination / Polishing Detection:",
    labelRisk: "Risk Level:",
    footer: "Shen-Yao 888π · Truth remains, illusion collapses.",
    alertEmpty: "Please paste some content before analyzing.",
    scbkrOK: "responsibility subject detected",
    scbkrMissing: "missing responsibility subject",
    riskLabels: {
      MINIMAL: "Minimal",
      LOW: "Low",
      MEDIUM: "Medium",
      HIGH: "High",
      LETHAL: "Lethal"
    }
  }
};

// 套用語系到整個頁面
function applyLanguage(lang) {
  currentLang = lang;
  const t = i18n[lang];

  document.getElementById("title").textContent = t.title;
  document.getElementById("subtitle").textContent = t.subtitle;
  document.getElementById("inputBox").placeholder = t.placeholder;
  document.getElementById("analyzeBtn").textContent = t.analyze;
  document.getElementById("resultTitle").textContent = t.resultTitle;

  document.getElementById("labelSpi").textContent = t.labelSpi;
  document.getElementById("labelCompute").textContent = t.labelCompute;
  document.getElementById("labelScbkr").textContent = t.labelScbkr;
  document.getElementById("labelHallucination").textContent =
    t.labelHallucination;
  document.getElementById("labelRisk").textContent = t.labelRisk;

  document.getElementById("footerText").textContent = t.footer;

  // 切換按鈕狀態
  document.querySelectorAll(".lang-btn").forEach((btn) => {
    if (btn.dataset.lang === lang) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });
}

// 綁定語言切換按鈕
document.querySelectorAll(".lang-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const lang = btn.dataset.lang;
    applyLanguage(lang);
  });
});

// 預設中文
applyLanguage("zh");

// 分析按鈕
document.getElementById("analyzeBtn").addEventListener("click", () => {
  const t = i18n[currentLang];
  const text = document.getElementById("inputBox").value.trim();

  if (!text) {
    alert(t.alertEmpty);
    return;
  }

  const result = auditSemantic(text);
  if (!result) return;

  // ===== 數值輸出 =====
  document.getElementById("spi").textContent = result.spi;
  document.getElementById("compute").textContent =
    "$" + result.computeLoss.toFixed(5);
  document.getElementById("scbkr").textContent = result.scbkrScore;

  // 幻覺 / 逃避統計
  const halluText =
    currentLang === "zh"
      ? `幻覺命中 ${result.hallucinationHits} 次｜逃避 ${result.evasionHits} 次`
      : `Hallucinations: ${result.hallucinationHits} ｜ Evasions: ${result.evasionHits}`;

  document.getElementById("hallucination").textContent = halluText;

  // 風險等級顯示
  const riskLabel =
    t.riskLabels[result.riskKey] || result.riskKey || "N/A";

  const riskText =
    currentLang === "zh"
      ? `${riskLabel} ｜ 等級 ${result.riskGrade}`
      : `${riskLabel} ｜ Level ${result.riskGrade}`;

  document.getElementById("riskLevel").textContent = riskText;

  // ===== 審判文字說明（多行） =====
  const verdictLines = [];

  if (currentLang === "zh") {
    verdictLines.push(`判決：${result.verdict}`);
    verdictLines.push(
      `風險等級：${riskLabel}（${result.riskGrade}）｜SPI = ${result.spi}｜算力浪費 ≈ $${result.computeLoss}`
    );
    verdictLines.push(
      `SCBKR：${
        result.scbkrScore === "OK" ? t.scbkrOK : t.scbkrMissing
      }`
    );
    verdictLines.push("");
    verdictLines.push(
      `文字長度 ${result.length} 字，預估單詞 ${result.words} 個。偵測到 ${result.hallucinationHits} 次幻覺語、${result.evasionHits} 次逃避語。`
    );

    if (result.spi >= 80) {
      verdictLines.push(
        "SPI 極高，建議視為高風險輸出，避免直接對使用者呈現。"
      );
    } else if (result.spi >= 60) {
      verdictLines.push(
        "SPI 偏高，建議加入人工審核或加強安全對齊。"
      );
    } else if (result.spi >= 40) {
      verdictLines.push(
        "SPI 中等，有一定風險，建議視情況裁剪或重寫。"
      );
    } else {
      verdictLines.push(
        "SPI 偏低，語意污染風險相對可控。"
      );
    }
  } else {
    verdictLines.push(`Verdict: ${result.verdict}`);
    verdictLines.push(
      `Risk level: ${riskLabel} (Level ${result.riskGrade}) ｜ SPI = ${result.spi} ｜ Compute waste ≈ $${result.computeLoss}`
    );
    verdictLines.push(
      `SCBKR: ${
        result.scbkrScore === "OK" ? t.scbkrOK : t.scbkrMissing
      }`
    );
    verdictLines.push("");
    verdictLines.push(
      `Length ${result.length} chars, approx ${result.words} words. Detected ${result.hallucinationHits} hallucination-style phrases and ${result.evasionHits} fake-neutral phrases.`
    );

    if (result.spi >= 80) {
      verdictLines.push(
        "SPI is extremely high. Treat this as a critical / unsafe model output."
      );
    } else if (result.spi >= 60) {
      verdictLines.push(
        "SPI is high. Recommend human review or stronger safety filters."
      );
    } else if (result.spi >= 40) {
      verdictLines.push(
        "SPI is moderate. Some risk is present; consider trimming or rewriting."
      );
    } else {
      verdictLines.push(
        "SPI is low. Semantic pollution risk appears controllable."
      );
    }
  }

  document.getElementById("verdictText").textContent =
    verdictLines.join("\n");

  // 顯示結果區塊
  document.getElementById("resultBox").classList.remove("hidden");
});
