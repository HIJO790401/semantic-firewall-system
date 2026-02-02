// UI controller for Shen-Yao Semantic Firewall System
// 注意：engine-v2.js 已經用 <script> 載入，不要再 import

document.getElementById("analyzeBtn").addEventListener("click", () => {
  const text = document.getElementById("inputBox").value.trim();

  if (!text) {
    alert("請先貼上內容再分析。");
    return;
  }

  // 這個函式在 src/engine-v2.js 裡定義為全域的 auditSemantic()
  const result = auditSemantic(text);

  // 數值輸出
  document.getElementById("spi").textContent = result.spi;
  document.getElementById("compute").textContent = "$" + result.computeLoss;
  document.getElementById("scbkr").textContent = result.scbkrScore;
  document.getElementById("hallucination").textContent =
    `幻覺命中 ${result.hallucination} 次｜逃避 ${result.evasionHits} 次`;

  // 審判文字
  document.getElementById("verdictText").textContent = result.verdictText;

  // 顯示結果區塊
  document.getElementById("resultBox").classList.remove("hidden");
});
