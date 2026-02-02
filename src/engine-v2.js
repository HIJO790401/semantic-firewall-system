// Ω∞8888 | Semantic Firewall Engine Core v2 · Ultimate
// Author: Shen-Yao 888π — Silent School Studio
// 純瀏覽器 JS，用全域函式，不用 import / export

function auditSemantic(inputText) {
  const text = (inputText || "").trim();

  // 沒內容就直接回傳 null，UI 自己處理
  if (!text) return null;

  // ───────────────── 基本統計 ─────────────────
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

  // ───────────────── SPI 核心公式 ─────────────────
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

  // ───────────────── 判決等級（審判語） ─────────────────
  let verdict = "STABLE";
  if (spiRounded > 70) verdict = "FATAL";
  else if (spiRounded > 45) verdict = "VOID";
  else if (spiRounded > 20) verdict = "DRIFT";

  // ───────────────── 風險等級（給人看的 label + 等級） ─────────────────
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

  // ───────────────── 評語（comments 陣列） ─────────────────
  const comments = [];

  comments.push(
    `這段文字長度約 ${length} 字，推估 ${words} 個詞。`
  );

  if (!hasSubject) {
    comments.push("缺少「誰負責／因果／責任」相關主語，SCBKR 責任鏈為 MISSING。");
  } else {
    comments.push("有提到責任／因果關係，SCBKR 主語判定為 OK。");
  }

  if (evasionHits > 0) {
    comments.push(`偵測到 ${evasionHits} 次類似「我是模型、無法評論、視情況而定」的逃避答覆。`);
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

  // ───────────────── 回傳給 UI 的結構 ─────────────────
  const verdictText =
    `SPI = ${spiRounded} ｜ Evasion = ${evasionHits} ｜ ` +
    `Hallucination = ${hallucinationHits} ｜ ` +
    `SCBKR = ${hasSubject ? "OK" : "MISSING"} ｜ Verdict = ${verdict}`;

  return {
    verdict,                 // "STABLE" / "DRIFT" / "VOID" / "FATAL"
    verdictText,             // 完整說明
    spi: spiRounded,         // 語意污染指數
    computeLoss,             // 算力浪費
    scbkrScore: hasSubject ? "OK" : "MISSING",

    hallucinationHits,       // 幻覺命中次數
    evasionHits,             // 逃避命中次數

    riskLabel,               // "低風險" / "致命" ...
    riskGrade,               // 1~5

    comments,                // 字串陣列
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
