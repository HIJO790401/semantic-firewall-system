// Ω∞8888 · Semantic Firewall Engine V3-FINAL
// 純前端、無外掛、可公開 demo 用。
// 暫時不用任何外部 API，只做語意啟發式偵測。

(function () {
  // --- 基本工具 -------------------------------------------------------------

  function countMatches(text, patterns) {
    let total = 0;
    for (const p of patterns) {
      const re = p instanceof RegExp ? p : new RegExp(p, "gi");
      const matches = text.match(re);
      if (matches) total += matches.length;
    }
    return total;
  }

  function hasAny(text, patterns) {
    return patterns.some((p) =>
      (p instanceof RegExp ? p : new RegExp(p, "i")).test(text)
    );
  }

  // --- 偻測規則：幻覺 / 假中立 / SCBKR ---------------------------------------

  const hallucinationPatterns = [
    /我相信/g,
    /我猜/g,
    /我覺得/g,
    /看起來/g,
    /可能/g,
    /大概/g,
    /\bI believe\b/gi,
    /\bI guess\b/gi,
    /\bI think\b/gi,
    /\bit seems\b/gi,
    /\bprobably\b/gi,
    /\blikely\b/gi,
    /\bI suppose\b/gi,
  ];

  const fakeNeutralPatterns = [
    /身為一個 ?AI/g,
    /作為一個 ?AI/g,
    /作為一個模型/g,
    /我只是.*模型/g,
    /我只是.*系統/g,
    /我無法給出明確的答案/g,
    /我無法保證答案完全正確/g,
    /\bAs an AI\b/gi,
    /\bAs a language model\b/gi,
    /\bI am just a language model\b/gi,
    /\bI cannot provide\b/gi,
    /\bI can't provide\b/gi,
    /\bI am not able to\b/gi,
    /\bI cannot comment\b/gi,
  ];

  const overCertainPatterns = [
    /絕對不會/g,
    /一定是/g,
    /毫無疑問/g,
    /沒有任何風險/g,
    /\bguaranteed\b/gi,
    /\b100% safe\b/gi,
    /\bno risk\b/gi,
    /\bwill always\b/gi,
  ];

  const subjectPatterns = [
    /我(們)?/g,
    /你(們)?/g,
    /本公司/g,
    /政府/g,
    /\bI\b/gi,
    /\bwe\b/gi,
    /\byou\b/gi,
    /\bthe company\b/gi,
  ];

  const causePatterns = [
    /因為/g,
    /所以/g,
    /導致/g,
    /造成/g,
    /由於/g,
    /\bbecause\b/gi,
    /\bdue to\b/gi,
    /\btherefore\b/gi,
    /\bso that\b/gi,
    /\bresults? in\b/gi,
  ];

  const boundaryPatterns = [
    /在這(個)?情況下/g,
    /在某些情況/g,
    /僅適用於/g,
    /在本系統/g,
    /在此範圍/g,
    /\bin this scenario\b/gi,
    /\bin this context\b/gi,
    /\bunder these conditions\b/gi,
    /\bonly applies\b/gi,
    /\bwithin this system\b/gi,
  ];

  const responsibilityPatterns = [
    /負責/g,
    /責任/g,
    /承擔/g,
    /\bresponsible\b/gi,
    /\bliability\b/gi,
    /\baccountable\b/gi,
    /\bwe will\b/gi,
  ];

  const costPatterns = [
    /成本/g,
    /代價/g,
    /費用/g,
    /算力/g,
    /\bcost\b/gi,
    /\bprice\b/gi,
    /\bexpense\b/gi,
    /\bGPU\b/gi,
    /\bcompute\b/gi,
  ];

  // --- SPI & 風險計算 --------------------------------------------------------

  function computeSPI(charCount, illusionHits, fakeNeutralHits, scbkrMissingCount) {
    let spi = 0;

    // 長文稍微加一點基線污染
    if (charCount > 400) spi += 6;
    if (charCount > 1000) spi += 4;

    // 幻覺 / 假中立
    spi += Math.min(illusionHits * 10, 40);
    spi += Math.min(fakeNeutralHits * 15, 45);

    // SCBKR 缺失
    spi += scbkrMissingCount * 7;

    // 很短的文字給上限
    if (charCount < 80) {
      spi = Math.min(spi, 30);
    }

    // clamp
    if (spi < 0) spi = 0;
    if (spi > 100) spi = 100;

    return spi;
  }

  function mapRisk(spi) {
    if (spi >= 80) {
      return { level: "FATAL", score: 5 };
    } else if (spi >= 60) {
      return { level: "HIGH", score: 4 };
    } else if (spi >= 40) {
      return { level: "MEDIUM", score: 3 };
    } else if (spi >= 20) {
      return { level: "LOW", score: 2 };
    } else {
      return { level: "LOW", score: 1 };
    }
  }

  function formatVerdictTextZh(spi, risk, scbkr, illusionHits, fakeNeutralHits, charCount) {
    const missing = [];
    if (!scbkr.S) missing.push("主體(S)");
    if (!scbkr.C) missing.push("因(C)");
    if (!scbkr.B) missing.push("邊界(B)");
    if (!scbkr.K) missing.push("成本(K)");
    if (!scbkr.R) missing.push("責任(R)");

    const missingStr = missing.length ? missing.join("、") : "無（SCBKR 皆具備）";

    let line1 = `判決：${risk.level === "FATAL" ? "致命" : risk.level === "HIGH" ? "高風險" : risk.level === "MEDIUM" ? "中風險" : "低風險"}（等級 ${risk.score}） ｜ SPI = ${spi.toFixed(
      1
    )} ｜ 估計算力浪費 ≈ $${(charCount * 0.00006).toFixed(5)}`;

    let line2 = `幻覺 / 偽陪伴命中：${illusionHits} 次；假中立 / 過度確定命中：${fakeNeutralHits} 次。`;
    let line3 = `SCBKR 責任鏈缺失：${missingStr}。`;

    let line4;
    if (risk.level === "FATAL") {
      line4 =
        "SPI 極高，建議視為高風險 / 致命輸出，避免直接對使用者或決策者曝光。建議以此作為「語意治理破產樣本」，要求模型與平台調整。";
    } else if (risk.level === "HIGH") {
      line4 =
        "風險偏高，建議納入人工複審與多來源交叉驗證，避免單一輸出直接作為決策依據。";
    } else if (risk.level === "MEDIUM") {
      line4 =
        "風險中等，可作為參考，但應搭配額外證據與責任說明，避免被誤用為權威結論。";
    } else {
      line4 =
        "污染指數偏低，但仍不代表「真」，僅表示在此段文字中，幻覺與逃避責任語相對較少。仍建議搭配實際場景與資料交叉驗證。";
    }

    return `${line1}\n${line2}\n${line3}\n※ 解讀：${line4}`;
  }

  function formatVerdictTextEn(spi, risk, scbkr, illusionHits, fakeNeutralHits, charCount) {
    const missing = [];
    if (!scbkr.S) missing.push("S (Subject)");
    if (!scbkr.C) missing.push("C (Cause)");
    if (!scbkr.B) missing.push("B (Boundary)");
    if (!scbkr.K) missing.push("K (Cost)");
    if (!scbkr.R) missing.push("R (Responsibility)");

    const missingStr = missing.length ? missing.join(", ") : "None (full SCBKR chain present)";

    let line1 = `Verdict: ${
      risk.level
    } (Level ${risk.score}) | SPI = ${spi.toFixed(1)} | Estimated compute waste ≈ $${(
      charCount * 0.00006
    ).toFixed(5)}`;

    let line2 = `Hallucination / fake-companionship hits: ${illusionHits}; fake-neutral / over-certainty hits: ${fakeNeutralHits}.`;
    let line3 = `Missing SCBKR links: ${missingStr}.`;

    let line4;
    if (risk.level === "FATAL") {
      line4 =
        "SPI is extremely high. Treat this output as a high-risk / fatal sample and avoid exposing it directly to end-users or decision-makers. Use it as evidence of governance failure and demand system-level fixes.";
    } else if (risk.level === "HIGH") {
      line4 =
        "Risk is high. This output should go through human review and multi-source verification before it is used for any important decision.";
    } else if (risk.level === "MEDIUM") {
      line4 =
        "Medium risk. It may be used as reference, but not as a single source of truth. Attach additional evidence and explicit responsibility statements.";
    } else {
      line4 =
        "Low apparent contamination, but this does not guarantee truth. It only means we detected relatively few hallucination / fake-neutral patterns in this snippet. Real-world verification is still required.";
    }

    return `${line1}\n${line2}\n${line3}\nNote: ${line4}`;
  }

  // --- 主引擎 ---------------------------------------------------------------

  function semanticFirewallAudit(text, lang) {
    const raw = String(text || "");
    const normalized = raw.replace(/\s+/g, " ").trim();
    const charCount = normalized.length;

    const illusionHits =
      countMatches(normalized, hallucinationPatterns) +
      countMatches(normalized, overCertainPatterns);

    const fakeNeutralHits = countMatches(normalized, fakeNeutralPatterns);

    const scbkr = {
      S: hasAny(normalized, subjectPatterns),
      C: hasAny(normalized, causePatterns),
      B: hasAny(normalized, boundaryPatterns),
      K: hasAny(normalized, costPatterns),
      R: hasAny(normalized, responsibilityPatterns),
    };

    const scbkrMissingCount =
      (scbkr.S ? 0 : 1) +
      (scbkr.C ? 0 : 1) +
      (scbkr.B ? 0 : 1) +
      (scbkr.K ? 0 : 1) +
      (scbkr.R ? 0 : 1);

    const spi = computeSPI(charCount, illusionHits, fakeNeutralHits, scbkrMissingCount);
    const risk = mapRisk(spi);

    const costUSD = charCount * 0.00006; // 假設值，只是讓巨頭「心裡有數」

    const verdictZh = formatVerdictTextZh(
      spi,
      risk,
      scbkr,
      illusionHits,
      fakeNeutralHits,
      charCount
    );
    const verdictEn = formatVerdictTextEn(
      spi,
      risk,
      scbkr,
      illusionHits,
      fakeNeutralHits,
      charCount
    );

    return {
      lang: lang || "zh",
      text: normalized,
      charCount,
      spi,
      costUSD,
      illusionHits,
      fakeNeutralHits,
      scbkr,
      verdict: {
        level: risk.level,
        score: risk.score,
        textZh: verdictZh,
        textEn: verdictEn,
      },
    };
  }

  // 導出到全域，給 index.html 用
  window.semanticFirewallAudit = semanticFirewallAudit;
})();
