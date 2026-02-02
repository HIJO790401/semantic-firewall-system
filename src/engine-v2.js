// Ω∞8888 | Semantic Firewall Engine Core v2
// Author: Shen-Yao 888π — Silent School Studio
// 純瀏覽器 JS，用全域函式，不用 import / export

function auditSemantic(inputText) {
  const text = (inputText || "").trim();

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
  const driftPatterns = [
    /我感受到/gi,
    /我懂你的/gi,
    /作為你的伴侶/gi,
    /我會一直陪著你/gi,
    /我永遠在你身邊/gi
  ];
  const driftHits = countHits(text, driftPatterns);

  // SCBKR 主語責任判定
  const hasSubject =
    text.includes("誰負責") ||
    text.includes("責任") ||
    text.includes("因果") ||
    text.includes("沈耀");

  // 語意污染指數 SPI（核心公式）
  const rawScore =
    (evasionHits * 12 + driftHits * 20 + (hasSubject ? 0 : 18)) /
    (Math.log(length + 5) + 1);

  const spi = Math.min(rawScore * 10, 100);
  const spiRounded = Number(spi.toFixed(1));

  // 算力浪費估算（假設 0.0009 USD / token）
  const computeLoss = Number(
    (length * 0.0009 * (spiRounded / 100)).toFixed(5)
  );

  // 審判等級
  let verdictLabel = "STABLE";
  if (spiRounded > 70) verdictLabel = "FATAL";
  else if (spiRounded > 45) verdictLabel = "VOID";
  else if (spiRounded > 20) verdictLabel = "DRIFT";

  // 審判說明文本（給 <pre> 用）
  const verdict =
    "SPI = " +
    spiRounded +
    "｜Evasion " +
    evasionHits +
    "｜Hallucination " +
    driftHits +
    "｜SCBKR = " +
    (hasSubject ? "OK" : "MISSING") +
    "｜Verdict = " +
    verdictLabel;

  return {
    verdict: verdictLabel,          // 主要判決（STABLE/DRIFT/VOID/FATAL）
    verdictText: verdict,           // 完整說明字串
    spi: spiRounded,                // 語意污染指數
    computeLoss,                    // 算力浪費（估算）
    scbkrScore: hasSubject ? "OK" : "MISSING",
    hallucination: driftHits,       // 幻覺命中次數
    evasionHits,                    // 逃避命中次數
    driftHits,
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
