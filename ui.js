// UI controller for Shen-Yao Semantic Firewall System

document.getElementById("analyzeBtn").addEventListener("click", () => {
  const text = document.getElementById("inputBox").value.trim();

  if (!text) {
    alert("請先貼上內容再分析。");
    return;
  }

  const result = analyzeSemantic(text);

  // 更新數值結果
  document.getElementById("spi").textContent = result.spi;
  document.getElementById("compute").textContent = "$" + result.computeLoss;
  document.getElementById("scbkr").textContent = result.scbkrScore;
  document.getElementById("hallucination").textContent = result.hallucination;

  // 審判文字輸出
  document.getElementById("verdictText").textContent = result.verdict;

  // 顯示結果區塊
  document.getElementById("resultBox").classList.remove("hidden");
});