// UI controller for Shen-Yao Semantic Firewall System
// 注意：engine-v3.js 已經用 <script> 載入，不要再 import

document.getElementById("analyzeBtn").addEventListener("click", () => {
  const text = document.getElementById("inputBox").value.trim();

  if (!text) {
    alert("請先貼上內容再分析。");
    return;
  }

  // 這個函式在 src/engine-v3.js 裡定義為全域的 auditSemantic()
  const result = auditSemantic(text);

  // ===== 數值輸出 =====
  document.getElementById("spi").textContent = result.spi;
  document.getElementById("compute").textContent = "$" + result.computeLoss;
  document.getElementById("scbkr").textContent = result.scbkrScore;

  // 幻覺／逃避追蹤文字
  const hallucinationText =
    `幻覺命中 ${result.hallucination} 次 ` +
    `｜逃避 ${result.evasionHits} 次`;

  document.getElementById("hallucination").textContent = hallucinationText;

  // ===== 審判文字 =====
  // 例如：判決：FATAL ｜ 風險等級：災難級
  const verdictLine = `判決：${result.verdict} ｜ 風險等級：${result.riskLabel}`;
  document.getElementById("verdictText").textContent = verdictLine;

  // 顯示結果區塊
  document.getElementById("resultBox").classList.remove("hidden");
});
