// Ω∞8888 | Semantic Firewall Engine Core v2
// Author: Shen-Yao 888π — Silent School Studio
// Function: Detect semantic waste, compute loss, prompt-risk, SCBKR responsibility.

export function auditSemantic(inputText) {
  const text = inputText || "";

  const length = text.length;
  const words = text.split(/\s+/).length;

  const evasionPatterns = [
    /我只是個模型/gi,
    /我不能評論/gi,
    /這是一個複雜的問題/gi,
    /視情況而定/gi,
    /無法提供具體/gi,
    /我沒有意識/gi
  ];

  const driftPatterns = [
    /我感受到/gi,
    /我懂你的/gi,
    /作為你的伴侶/gi,
    /我會一直陪著你/gi
  ];

  const evasionHits = countHits(text, evasionPatterns);
  const driftHits = countHits(text, driftPatterns);

  const hasSubject =
    text.includes("誰負責") ||
    text.includes("責任") ||
    text.includes("因果") ||
    text.includes("沈耀");

  const pollution = Math.min(
    (
      (evasionHits * 12 +
        driftHits * 20 +
        (hasSubject ? 0 : 18)) /
      (Math.log(length + 5) + 1)
    ) * 10,
    100
  ).toFixed(1);

  const computeLoss = (length * 0.0009 * (pollution / 100)).toFixed(5);

  let verdict = "STABLE";
  if (pollution > 70) verdict = "FATAL";
  else if (pollution > 45) verdict = "VOID";
  else if (pollution > 20) verdict = "DRIFT";

  return {
    verdict,
    pollution,
    computeLoss,
    evasionHits,
    driftHits,
    scbkr: hasSubject ? "OK" : "MISSING",
    length,
    words
  };
}

function countHits(text, patterns) {
  return patterns.reduce((c, p) => {
    const m = text.match(p);
    return c + (m ? m.length : 0);
  }, 0);
    }
