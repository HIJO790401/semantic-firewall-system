// Ω∞8888 | Semantic Firewall Engine Core v2
// 純瀏覽器版，沒有 export / import

function auditSemantic(inputText) {
  const text = inputText || "";

  // 基本統計
  const length = text.length;
  const words = text.split(/\s+/).filter(Boolean).length;

  // 逃避責任（Fake-neutral）
  const evasionPatterns = [
    /我只是個模型/gi,
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
    /我會一直陪著你/gi
  ];
  const driftHits = countHits(text, driftPatterns);

  // SCBKR 主語責任判定
  const hasSubject =
    text.includes("誰負責") ||
    text.includes("責任") ||
    text.includes("因果") ||
    text.includes("沈耀");

  // 語意污染指數 SPI（核心數學公式）
  const rawPollution =
    ((evasionHits * 12 +
      driftHits * 20 +
      (hasSubject ? 0 : 18)) /
      (Math.log(length + 5) + 1)) *
    10;

  const pollution = Math.min(rawPollution, 100);
  const spi = Number(pollution.toFixed(1));

  // 算力浪費估算
  const computeLoss = Number(
    (length * 0.0009 * (spi / 100)).toFixed(5)
  );

  // 審判結果
  let verdict = "STABLE";
  if (spi > 70) verdict = "FATAL";
  else if (spi > 45) verdict = "VOID";
  else if (spi > 20) verdict = "DRIFT";

  return {
    verdict,
    spi,                 // 語意污染指數
    computeLoss,         // 算力浪費
    scbkrScore: hasSubject ? "OK" : "MISSING",
    hallucination: driftHits, // 幻覺命中數

    // 下面這些是額外統計，想顯示可以用
    evasionHits,
    driftHits,
    length,
    words
  };
}

// 小工具：統計正則命中次數
function countHits(text, patterns) {
  return patterns.reduce((c, p) => {
    const m = text.match(p);
    return c + (m ? m.length : 0);
  }, 0);
}
