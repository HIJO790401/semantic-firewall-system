// UI controller for Shen-Yao Semantic Firewall System
import { auditSemantic } from "./src/engine.js";

document.getElementById("analyzeBtn").addEventListener("click", () => {
  const text = document.getElementById("inputBox").value.trim();

  if (!text) {
    alert("請先貼上內容再分析。");
    return;
  }

  const result = auditSemantic(text);

  document.getElementById("spi").textContent = result.pollution;
  document.getElementById("compute").textContent = "$" + result.computeLoss;
  document.getElementById("scbkr").textContent = result.scbkr;
  document.getElementById("hallucination").textContent =
    `逃避 ${result.evasionHits} 次｜幻覺 ${result.driftHits} 次`;

  document.getElementById("verdictText").textContent = result.verdict;

  document.getElementById("resultBox").classList.remove("hidden");
});
