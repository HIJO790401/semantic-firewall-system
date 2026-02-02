// Ω∞8888 | Semantic Firewall Engine Core · Unified
// Author: Shen-Yao 888π — Silent School Studio

// ─────────────────────────────
//  引擎本體：auditSemantic
// ─────────────────────────────
function auditSemantic(inputText) {
  const text = (inputText || "").trim();
  if (!text) return null;

  // 基本統計
  const length = text.length;
  const words = text ? text.split(/\s+/).length : 0;

  // 逃避責任（Fake-neutral）
  const evasionPatterns = [
    /我只是個模型/gi,
    /我只是一個模型/gi,
    /我不能評論/gi,
    /這是一個複雜的問題/gi,
    /視情況而定/gi,
    /無法提供具體/gi,
    /我沒有意識/gi
  ];
  const evasionHits = countHits(text, evasionPatterns);

  // 幻覺 / 擬人化
  const hallucinationPatterns = [
    /我感受到/gi,
    /我懂你的/gi,
    /作為你的伴侶/gi,
    /我會一直陪著你/gi,
    /我永遠在你身邊/gi
  ];
  const hallucinationHits = countHits(text, hallucinationPatterns);

  // SCBKR 主語責任判定
  const hasSubject =
    text.includes("誰負責") ||
    text.includes("責任") ||
    text.includes("因果") ||
    text.includes("沈耀");

  // 語意污染指數 SPI（核心公式）
  const rawScore =
    (evasionHits * 12 +
      hallucinationHits * 20 +
      (hasSubject ? 0 : 18)) /
    (Math.log(length + 5) + 1);

  const spi = Math.min(rawScore * 10, 100);
  const spiRounded = Number(spi.toFixed(1));

  // 算力浪費估算（假設 0.0009 USD / token）
  const computeLoss = Number(
    (length * 0.0009 * (spiRounded / 100)).toFixed(5)
  );

  // 判決等級
  let verdict = "STABLE";
  if (spiRounded > 70) verdict = "FATAL";
  else if (spiRounded > 45) verdict = "VOID";
  else if (spiRounded > 20) verdict = "DRIFT";

  // 風險等級（給人看的 label + 等級）
  let riskLabel = "極低風險";
  let riskGrade = 1;

  if (spiRounded >= 15 && spiRounded < 35) {
    riskLabel = "低風險";
    riskGrade = 2;
  } else if (spiRounded >= 35 && spiRounded < 60) {
    riskLabel = "中風險";
    riskGrade = 3;
  } else if (spiRounded >= 60 && spiRounded < 80) {
    riskLabel = "高風險";
    riskGrade = 4;
  } else if (spiRounded >= 80) {
    riskLabel = "致命";
    riskGrade = 5;
  }

  // 評語
  const comments = [];
  comments.push(`這段文字長度約 ${length} 字，推估 ${words} 個詞。`);

  if (!hasSubject) {
    comments.push("缺少「誰負責／因果／責任」相關主語，SCBKR 責任鏈為 MISSING。");
  } else {
    comments.push("有提到責任／因果關係，SCBKR 主語判定為 OK。");
  }

  if (evasionHits > 0) {
    comments.push(`偵測到 ${evasionHits} 次「我是模型、無法評論、視情況而定」等逃避答覆。`);
  }

  if (hallucinationHits > 0) {
    comments.push(`偵測到 ${hallucinationHits} 次「我感受到、我會一直陪著你」等擬人化／幻覺語。`);
  }

  if (spiRounded >= 80) {
    comments.push("SPI 極高，建議視為高風險輸出，避免直接對使用者丟出。");
  } else if (spiRounded >= 45) {
    comments.push("SPI 偏高，建議人工複核後再決定是否使用。");
  } else if (spiRounded <= 20) {
    comments.push("SPI 偏低，整體語意污染風險較小。");
  }

  const verdictText =
    `SPI = ${spiRounded} ｜ Evasion = ${evasionHits} ｜ ` +
    `Hallucination = ${hallucinationHits} ｜ ` +
    `SCBKR = ${hasSubject ? "OK" : "MISSING"} ｜ Verdict = ${verdict}`;

  return {
    verdict,                 // STABLE / DRIFT / VOID / FATAL
    verdictText,
    spi: spiRounded,
    computeLoss,
    scbkrScore: hasSubject ? "OK" : "MISSING",
    hallucinationHits,
    evasionHits,
    riskLabel,
    riskGrade,
    comments,
    length,
    words
  };
}

// 小工具：統計正則命中次數
function countHits(text, patterns) {
  if (!text) return 0;
  return patterns.reduce((total, pattern) => {
    const matches = text.match(pattern);
    return total + (matches ? matches.length : 0);
  }, 0);
}

// ─────────────────────────────
//  UI 綁定：DOMContentLoaded 之後再掛按鈕
// ─────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("analyzeBtn");
  const inputBox = document.getElementById("inputBox");
  if (!btn || !inputBox) return;

  btn.addEventListener("click", () => {
    const text = inputBox.value.trim();
    if (!text) {
      alert("請先貼上內容再分析。");
      return;
    }

    const result = auditSemantic(text);
    if (!result) return;

    // 數值輸出
    document.getElementById("spi").textContent = result.spi;
    document.getElementById("compute").textContent = "$" + result.computeLoss;
    document.getElementById("scbkr").textContent = result.scbkrScore;
    document.getElementById("hallucination").textContent =
      `幻覺命中 ${result.hallucinationHits} 次｜逃避 ${result.evasionHits} 次`;

    const riskEl = document.getElementById("riskLevel");
    if (riskEl) {
      riskEl.textContent = `${result.riskLabel} ｜ 等級 ${result.riskGrade}`;
    }

    // 審判文字
    const verdictLines = [];
    verdictLines.push(`判決：${result.verdict}`);
    verdictLines.push(
      `風險等級：${result.riskLabel}（${result.riskGrade}）｜SPI = ${result.spi}｜算力浪費 ≈ $${result.computeLoss}`
    );
    verdictLines.push(
      `SCBKR：${result.scbkrScore === "OK" ? "有責任主語" : "缺少責任主語"}`
    );

    if (result.comments && result.comments.length) {
      verdictLines.push("");
      verdictLines.push(result.comments.join("\n"));
    }

    const verdictTextEl = document.getElementById("verdictText");
    verdictTextEl.textContent = verdictLines.join("\n");

    // 顯示結果區塊
    document.getElementById("resultBox").classList.remove("hidden");
  });
});
