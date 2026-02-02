// UI controller for Shen-Yao Semantic Firewall System
// 依賴 src/engine-v2.js 提供的全域函式 auditSemantic()

window.addEventListener("DOMContentLoaded", function () {
  let currentLang = "zh";

  // 文字對照
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
      riskLine: function (label, grade, spi, loss) {
        return "風險等級：" + label + "（等級 " + grade + "）｜SPI = " +
          spi + "｜算力浪費 ≈ $" + loss;
      },
      scbkrLineOk:
        "SCBKR：有責任主語，至少出現一個「誰負責／因果／責任／沈耀」。",
      scbkrLineMissing:
        "SCBKR：缺少責任主語，建議補上「誰負責／因果／責任」相關描述。",
      summaryLine: function (len, words, evasion, drift) {
        return "本文長度約 " + len + " 字，詞數約 " + words +
          "，偵測到逃避 " + evasion + " 次、幻覺／擬人化 " + drift + " 次。";
      }
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
      riskLine: function (label, grade, spi, loss) {
        return "Risk level: " + label + " (grade " + grade +
          ") | SPI = " + spi + " | Compute waste ≈ $" + loss;
      },
      scbkrLineOk:
        "SCBKR: Found at least one phrase related to responsibility / causality.",
      scbkrLineMissing:
        "SCBKR: No explicit responsibility subject detected. Consider clarifying who is accountable.",
      summaryLine: function (len, words, evasion, drift) {
        return "Text length ≈ " + len + " chars, ≈ " + words +
          " tokens, detected " + evasion +
          " evasive phrases and " + drift +
          " hallucination / anthropomorphic phrases.";
      }
    }
  };

  function classifyRisk(spi) {
    var grade = 1;
    if (spi > 80) grade = 5;
    else if (spi > 60) grade = 4;
    else if (spi > 40) grade = 3;
    else if (spi > 20) grade = 2;
    return grade;
  }

  function applyLanguage(lang) {
    currentLang = lang;
    var t = i18n[lang];

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

    var btnZh = document.getElementById("btnZh");
    var btnEn = document.getElementById("btnEn");
    if (btnZh && btnEn) {
      if (lang === "zh") {
        btnZh.classList.add("active");
        btnEn.classList.remove("active");
      } else {
        btnEn.classList.add("active");
        btnZh.classList.remove("active");
      }
    }
  }

  // 綁定按鈕
  var btnZh = document.getElementById("btnZh");
  var btnEn = document.getElementById("btnEn");
  var analyzeBtn = document.getElementById("analyzeBtn");
  var inputBox = document.getElementById("inputBox");

  if (btnZh) {
    btnZh.addEventListener("click", function () {
      applyLanguage("zh");
    });
  }

  if (btnEn) {
    btnEn.addEventListener("click", function () {
      applyLanguage("en");
    });
  }

  if (analyzeBtn) {
    analyzeBtn.addEventListener("click", function () {
      var text = (inputBox.value || "").trim();
      if (!text) {
        alert(currentLang === "zh"
          ? "請先貼上內容再分析。"
          : "Please paste some text first.");
        return;
      }

      if (typeof auditSemantic !== "function") {
        alert("Engine not loaded (auditSemantic missing).");
        return;
      }

      var result = auditSemantic(text);
      if (!result) return;

      document.getElementById("spi").textContent = result.spi;
      document.getElementById("compute").textContent =
        "$" + result.computeLoss;
      document.getElementById("scbkr").textContent = result.scbkrScore;

      document.getElementById("hallucination").textContent =
        (currentLang === "zh"
          ? "幻覺命中 " + result.hallucination +
            " 次｜逃避 " + result.evasionHits + " 次"
          : "Hallucination " + result.hallucination +
            " hits | Evasion " + result.evasionHits + " hits");

      var grade = classifyRisk(result.spi);
      var t = i18n[currentLang];
      var riskLabel = t.riskLevel[grade] || "";
      var riskEl = document.getElementById("riskLevel");
      if (riskEl) {
        riskEl.textContent =
          (currentLang === "zh"
            ? riskLabel + " ｜ 等級 " + grade
            : riskLabel + " | Grade " + grade);
      }

      var lines = [];
      lines.push(t.verdictPrefix + " " + result.verdict);
      lines.push(
        t.riskLine(riskLabel, grade, result.spi, result.computeLoss)
      );

      if (result.scbkrScore === "OK") {
        lines.push(t.scbkrLineOk);
      } else {
        lines.push(t.scbkrLineMissing);
      }

      lines.push(
        t.summaryLine(
          result.length,
          result.words,
          result.evasionHits,
          result.driftHits
        )
      );

      document.getElementById("verdictText").textContent =
        lines.join("\n");

      document.getElementById("resultBox").classList.remove("hidden");
    });
  }

  // 預設載入中文
  applyLanguage("zh");
});
