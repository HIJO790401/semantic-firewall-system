// UI controller for Shen-Yao Semantic Firewall System · Ultimate版
// 引擎已用 <script src="src/engine-v2.js"></script> 載入，這裡直接呼叫全域的 auditSemantic()

document.getElementById("analyzeBtn").addEventListener("click", () => {
  const text = document.getElementById("inputBox").value.trim();

  // 1. 沒輸入就直接擋掉
  if (!text) {
    alert("請先貼上內容再分析。");
    return;
  }

  // 2. 呼叫語意防火牆引擎
  const result = auditSemantic(text);
  if (!result) {
    alert("分析失敗：引擎沒有回傳結果。");
    return;
  }

  // 3. 上半部數值輸出
  document.getElementById("spi").textContent = result.spi;
  document.getElementById("compute").textContent = "$" + result.computeLoss;
  document.getElementById("scbkr").textContent = result.scbkrScore;

  document.getElementById("hallucination").textContent =
    `幻覺命中 ${result.hallucinationHits} 次｜逃避 ${result.evasionHits} 次`;

  // 4. 風險等級欄（如果 HTML 有 <strong id="riskLevel"> 的話）
  const riskEl = document.getElementById("riskLevel");
  if (riskEl) {
    riskEl.textContent = `${result.riskLabel} ｜ 等級 ${result.riskGrade}`;
  }

  // 5. 下半部「判決文字」組合，多行排版
  const verdictLines = [];

  verdictLines.push(`判決：${result.verdict}`);
  verdictLines.push(
    `風險等級：${result.riskLabel}（${result.riskGrade}）｜SPI = ${result.spi}｜算力浪費 ≈ $${result.computeLoss}`
  );
  verdictLines.push(
    `SCBKR：${result.scbkrScore === "OK" ? "有責任主語" : "缺少責任主語"}`
  );

  if (Array.isArray(result.comments) && result.comments.length > 0) {
    verdictLines.push("");
    verdictLines.push(result.comments.join("\n"));
  }

  document.getElementById("verdictText").textContent =
    verdictLines.join("\n");

  // 6. 顯示結果區塊
  document.getElementById("resultBox").classList.remove("hidden");
});
