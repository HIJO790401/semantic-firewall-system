// UI controller for Shen-Yao Semantic Firewall System
// 引擎已用 <script> 載入，這裡直接呼叫 auditSemantic()

document.getElementById("analyzeBtn").addEventListener("click", () => {
  const text = document.getElementById("inputBox").value.trim();

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

  // 審判文字（多行）
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

  document.getElementById("verdictText").textContent =
    verdictLines.join("\n");

  // 顯示結果區塊
  document.getElementById("resultBox").classList.remove("hidden");
});
