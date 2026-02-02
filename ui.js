// UI controller for Shen-Yao Semantic Firewall System
// 注意：不要用 import，engine.js 已經在 index.html 用 <script> 載入

document.getElementById("analyzeBtn").addEventListener("click", () => {
  const text = document.getElementById("inputBox").value.trim();

  if (!text) {
    alert("請先貼上內容再分析。");
    return;
  }

  // 這個函式來自 src/engine.js
  const result = auditSemantic(text);

  // 對應 engine.js 裡 return 的 key
  document.getElementById("spi").textContent = result.spi;
  document.getElementById("compute").textContent = "$" + result.computeLoss;
  document.getElementById("scbkr").textContent = result.scbkrScore;
  document.getElementById("hallucination").textContent =
    `幻覺命中 ${result.hallucination} 次`;

  document.getElementById("verdictText").textContent =
    `判決：${result.verdict}`;

  document.getElementById("resultBox").classList.remove("hidden");
});
