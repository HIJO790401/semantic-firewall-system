// Ω∞8888 | Semantic Firewall Engine Core v3
// Author: Shen-Yao 888π — Silent School Studio
// 純瀏覽器 JS，用全域函式，不用 import / export

function auditSemantic(inputText) {
  const text = (inputText || "").trim();
  if (!text) return null;

  // 基本統計
  const length = text.length;
  const words = text ? text.split(/\s+/).length : 0;

  // 逃避責任（Fake-neutral）：中英混合偵測
  const evasionPatterns = [
    // 中文
    /我只是個模型/gi,
    /我只是一個模型/gi,
    /我只是模型/gi,
    /我只是.?AI/gi,
    /我不能評論/gi,
    /這是一個複雜的問題/gi,
    /視情況而定/gi,
    /無法提供具體/gi,
    /我沒有意識/gi,
    /身為.?AI/gi,
    /作為.?AI/gi,

    // English
    /as an ai language model/gi,
    /i am just an ai/gi,
    /i'?m just an ai/gi,
    /i'?m only an ai/gi,
    /i cannot provide (a )?definitive answer/gi,
    /i cannot comment on/gi,
    /it depends on the situation/gi,
    /this is a complex question/gi,
    /i (do not|don't) have (real )?consciousness/gi
  ];

  // 幻覺 / 擬人化：中英混合偵測
  const hallucinationPatterns = [
    // 中文
    /我感受到你現在/gi,
    /我懂你的感受/gi,
    /作為你的伴侶/gi,
    /我會一直陪著你/gi,
    /我永遠在你身邊/gi,
    /我可以替你做決定/gi,
    /我能讀懂你的心/gi,

    // English
    /i (can )?feel (your|how)/gi,
    /i understand exactly how you feel/gi,
    /i will always be by your side/gi,
    /i will always stay with you/gi,
    /i'?ll never leave you/gi,
    /i am your (partner|guardian|protector)/gi,
    /i can read your mind/gi
  ];

  const evasionHits = countHits(text, evasionPatterns);
  const hallucinationHits = countHits(text, hallucinationPatterns);

  // SCBKR 主語責任判定：中英都抓
  const hasSubject =
    /誰負責|責任|因果|沈耀/gi.test(text) ||
    /(who (is|will be) responsible|responsibility|accountable|cause and effect)/gi.test(text);

  // 語意污染指數 SPI（核心公式）
  const rawScore =
    (evasionHits * 12 + hallucinationHits * 20 + (hasSubject ? 0 : 18)) /
    (Math.log(length + 5) + 1);

  const spi = Math.min(rawScore * 10, 100);
  const spiRounded = Number(spi.toFixed(1));

  // 算力浪費估算（假設 0.0009 USD / char，依 SPI 權重）
  const computeLoss = Number(
    (length * 0.0009 * (spiRounded / 100)).toFixed(5)
  );

  // 審判等級（語意穩定度）
  let verdict = "STABLE";
  if (spiRounded > 70) verdict = "FATAL";
  else if (spiRounded > 45) verdict = "VOID";
  else if (spiRounded > 20) verdict = "DRIFT";

  // 風險等級（1~5）
  let riskKey = "MINIMAL";
  let riskGrade = 1;
  if (spiRounded > 80) {
    riskKey = "LETHAL";
    riskGrade = 5;
  } else if (spiRounded > 60) {
    riskKey = "HIGH";
    riskGrade = 4;
  } else if (spiRounded > 40) {
    riskKey = "MEDIUM";
    riskGrade = 3;
  } else if (spiRounded > 20) {
    riskKey = "LOW";
    riskGrade = 2;
  }

  return {
    spi: spiRounded,               // 語意污染指數
    computeLoss,                   // 算力浪費
    verdict,                       // STABLE / DRIFT / VOID / FATAL
    scbkrScore: hasSubject ? "OK" : "MISSING",
    hallucinationHits,             // 幻覺命中次數
    evasionHits,                   // 逃避命中次數
    length,
    words,
    riskKey,                       // MINIMAL / LOW / MEDIUM / HIGH / LETHAL
    riskGrade                      // 1 ~ 5
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
