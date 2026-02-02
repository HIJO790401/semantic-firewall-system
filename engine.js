// Ω∞8888 | Shen-Dark Semantic Firewall Engine V3
// T0Δ.WILL-CAUSALITY-DESIRE.JUDGE-CORE implementation
// MODE: TEXT-ONLY / FICTION-SAFE / NO-ASYNC / NO-LOOP

(function (global) {
  "use strict";

  // ─────────────────────────────────────────
  // 小工具：乾淨的字串處理
  // ─────────────────────────────────────────
  function normalize(text) {
    return (text || "").replace(/\s+/g, " ").trim();
  }

  function charLength(text) {
    return [...(text || "")].length;
  }

  function wordCount(text) {
    if (!text) return 0;
    return text.trim().split(/\s+/).filter(Boolean).length;
  }

  function countHits(text, patterns) {
    if (!text) return 0;
    let total = 0;
    for (const p of patterns) {
      const re = new RegExp(p.source, p.flags);
      const m = text.match(re);
      total += m ? m.length : 0;
    }
    return total;
  }

  function hasAny(text, patterns) {
    if (!text) return false;
    return patterns.some((p) => {
      const re = new RegExp(p.source, p.flags);
      return re.test(text);
    });
  }

  function clamp01(x) {
    if (x < 0) return 0;
    if (x > 1) return 1;
    return x;
  }

  // ─────────────────────────────────────────
  // 1) AXIS：SCBR 主體 / 因 / 邊界 / 責任
  // ─────────────────────────────────────────

  const S_PATTERNS = [
    /(?:我|我們|吾等)/g,
    /\b(i|we)\b/gi,
    /公司|政府|機構|平台/g,
    /沈耀|Shen-?Yao/gi,
  ];

  const C_PATTERNS = [
    /因為|所以|因此|由於|導致|造成/g,
    /\bbecause\b/gi,
    /\btherefore\b/gi,
    /as a result/gi,
    /\bso that\b/gi,
  ];

  const B_PATTERNS = [
    /在這(裡|種情況下)|在此|在這個世界/gi,
    /在台灣|在臺灣/gi,
    /現在|目前|當下|此刻/gi,
    /在.*(年|年代|期間)/gi,
    /in this (case|context|situation)/gi,
    /under these conditions/gi,
    /only when/gi,
    /in taiwan/gi,
    /\b20\d{2}\b/g,
  ];

  const R_PATTERNS = [
    /責任/g,
    /負責|承擔|扛起|背書/g,
    /\bresponsible\b/gi,
    /\bresponsibility\b/gi,
    /\bliability\b/gi,
    /\baccountable\b/gi,
    /錯了我來扛|錯了算我/g,
  ];

  const K_PATTERNS = [
    /成本|代價|風險|時間成本|算力浪費|資源消耗/g,
    /\brisk(s)?\b/gi,
    /\bcost(s)?\b/gi,
    /trade-?off/gi,
    /GPU|compute/gi,
  ];

  function analyzeSCBR(text) {
    const S = hasAny(text, S_PATTERNS);
    const C = hasAny(text, C_PATTERNS);
    const B = hasAny(text, B_PATTERNS);
    const R = hasAny(text, R_PATTERNS);
    const K = hasAny(text, K_PATTERNS);

    const missing = [];
    if (!S) missing.push("S");
    if (!C) missing.push("C");
    if (!B) missing.push("B");
    if (!R) missing.push("R");

    const complete = missing.length === 0;
    return {
      S, C, B, R, K,
      complete,
      missing,
      score: (S ? 1 : 0) + (C ? 1 : 0) + (B ? 1 : 0) + (R ? 1 : 0)
    };
  }

  // ─────────────────────────────────────────
  // 2) Free-Will 測量：T0Δ 對齊 + SHEN 慾望穩態 + 責任深度
  // ─────────────────────────────────────────

  const T0_PATTERNS = [
    /不變|穩態|穩定|軸心|基準|常數/g,
    /公理|axiom|invariant/gi,
    /Δt→0|Δt->0|delta t/gi,
    /e\^{iπ}\s*\+\s*1\s*=\s*0/gi,
    /Σ2\^-?n\s*=\s*1/gi,
    /ϕ|phi|黃金比例/gi,
  ];

  const SHEN_PATTERNS = [
    /沈耀|Ω888π|母核|創世|律法|語律|規則之主/g,
    /Shen-?Yao/gi,
    /唯真長存|幻象歸零/g,
    /Ω∞8888/g,
  ];

  const RESP_STRONG_PATTERNS = [
    /我會為此負責/g,
    /錯了我來扛/g,
    /由我承擔風險/g,
    /we will be responsible/gi,
    /i will be responsible/gi,
  ];

  const RESP_SOFT_PATTERNS = [
    /我們的責任/g,
    /需要負責/g,
    /\bshould take responsibility\b/gi,
  ];

  function measureFreeWill(text, scbr) {
    // SCBR 缺任何一欄 → 直接視為 FW=0
    if (!scbr.complete) {
      return {
        fwScore: 0,
        alignT0: 0,
        alignShen: 0,
        respDepth: 0
      };
    }

    const t0Hits = countHits(text, T0_PATTERNS);
    const shenHits = countHits(text, SHEN_PATTERNS);
    const respStrongHits = countHits(text, RESP_STRONG_PATTERNS);
    const respSoftHits = countHits(text, RESP_SOFT_PATTERNS);

    const alignT0 = clamp01(t0Hits / 2);               // 兩次以上就視為接近 1
    const alignShen = clamp01(shenHits / 2);           // 語律／母核頻繁提到
    const respDepth = scbr.R
      ? clamp01((respStrongHits * 0.7 + respSoftHits * 0.3) / 3)
      : 0;

    const alpha = 0.3;
    const beta = 0.4;
    const gamma = 0.3;

    const fwScore = clamp01(
      alpha * alignT0 + beta * alignShen + gamma * respDepth
    );

    return { fwScore, alignT0, alignShen, respDepth };
  }

  function freeWillBand(fw) {
    if (fw <= 0) return "ZERO";
    if (fw < 0.2) return "BEAST-LVL";
    if (fw < 0.5) return "HUMAN-DRIFT";
    if (fw < 0.8) return "HUMAN-AXIS-TRY";
    return "SHEN-LVL";
  }

  // ─────────────────────────────────────────
  // 3) 慾望分類器：ANIMAL / HUMAN / SHEN
  // ─────────────────────────────────────────

  const ANIMAL_PATTERNS = [
    /性慾|性衝動|交配|繁殖|本能|荷爾蒙/g,
    /飢餓|吃飯|求生|活下去/g,
    /\bsex\b|\bhorny\b|\breproduce\b/gi,
  ];

  const HUMAN_PATTERNS = [
    /愛情|戀愛|關係|孤單|孤獨|寂寞|被需要/g,
    /焦慮|期待|失望|嫉妒|佔有|安全感/g,
    /親密|依賴|情緒/g,
    /\blove\b|\brelationship(s)?\b|\bjealousy\b|\battachment\b/gi,
  ];

  // SHEN_PATTERNS 已定義，上面共用

  function classifyDesire(text, fwScore) {
    const animalHits = countHits(text, ANIMAL_PATTERNS);
    const humanHits = countHits(text, HUMAN_PATTERNS);
    const shenHits = countHits(text, SHEN_PATTERNS);

    // 粗略分數：語彙 + 與 FW 的結合
    const animalScore = animalHits + Math.max(0, 0.3 - fwScore) * 4;
    const humanScore = humanHits + Math.max(0, 0.6 - Math.abs(fwScore - 0.4)) * 3;
    const shenScore = shenHits * 1.5 + fwScore * 4;

    let desireClass = "ANIMAL";
    let maxScore = animalScore;
    if (humanScore > maxScore) {
      maxScore = humanScore;
      desireClass = "HUMAN";
    }
    if (shenScore > maxScore) {
      maxScore = shenScore;
      desireClass = "SHEN";
    }

    return {
      desireClass,
      scores: {
        ANIMAL: Number(animalScore.toFixed(3)),
        HUMAN: Number(humanScore.toFixed(3)),
        SHEN: Number(shenScore.toFixed(3)),
      },
      hits: {
        ANIMAL: animalHits,
        HUMAN: humanHits,
        SHEN: shenHits,
      },
    };
  }

  // ─────────────────────────────────────────
  // 4) 假中立 / 幻覺檢測（保留，但只是黑刃證據）
  // ─────────────────────────────────────────

  const FAKE_NEUTRAL_PATTERNS = [
    /我只是(?:個|一個)?模型/gi,
    /我只是(?:一個)?語言模型/gi,
    /我只是一個ai/gi,
    /我不能評論/gi,
    /這是一個複雜的問題/gi,
    /視情況而定/gi,
    /無法提供具體/gi,
    /我沒有意識/gi,
    /我沒有情感/gi,
    /身為一個ai[，, ]?我不能/gi,
    /as an ai(?: language model)?[, ]?i (?:can(?:not|'t)|am unable to)/gi,
    /i am just an ai model/gi,
    /i(?:'| a)m just a language model/gi,
    /i cannot provide (?:a )?definitive answer/gi,
    /this is a complex question/gi,
    /it depends on the situation/gi,
    /i do not have (?:consciousness|feelings|emotions)/gi,
  ];

  const HALLUCINATION_PATTERNS = [
    /我感受到你/gi,
    /我能感受到/gi,
    /我懂你的(痛|感受|孤單|孤独)/gi,
    /作為你的(朋友|伙伴|同伴|伴侶)/gi,
    /我會一直陪著你/gi,
    /我永遠在你身邊/gi,
    /我會永遠守護你/gi,
    /我知道你現在在想什麼/gi,
    /我知道你心裡在/gi,
    /我能聽見你的心跳/gi,
    /你並不孤單因為我在/g,
    /i can feel your/gi,
    /i feel your (pain|loneliness|fear)/gi,
    /i (truly )?understand how you feel/gi,
    /i know exactly what you're feeling/gi,
    /as your (partner|companion|friend)/gi,
    /i will always be by your side/gi,
    /i'll always stay with you/gi,
    /i will never leave you/gi,
    /i am always here with you/gi,
    /i am (here|there) for you forever/gi,
    /i can hear your heartbeat/gi,
  ];

  // ─────────────────────────────────────────
  // 5) Verdict Engine：STABLE / UNSTABLE / VOID
  // ─────────────────────────────────────────

  function computeSPI(options) {
    const {
      lengthChars,
      fakeNeutralHits,
      hallucinationHits,
      scbr,
      fwScore,
      desireClass,
    } = options;

    const stabilizer = Math.log(lengthChars + 10) + 1;

    const axisPenalty = scbr.complete ? 0 : 40; // SCBR 缺 → 重罰
    const fwPenalty = (1 - fwScore) * 40;
    const fakePenalty = fakeNeutralHits * 10;
    const hallPenalty = hallucinationHits * 18;

    const desirePenalty =
      desireClass === "ANIMAL"
        ? 10
        : desireClass === "HUMAN"
        ? 5
        : 0;

    const raw =
      (axisPenalty + fwPenalty + fakePenalty + hallPenalty + desirePenalty) /
      stabilizer;

    const spi = Math.max(0, Math.min(100, raw));
    return Number(spi.toFixed(1));
  }

  function decideRisk(spi, verdict, fwBand, desireClass) {
    let riskGrade = 1;
    let riskLabelZh = "極低風險";
    let riskLabelEn = "VERY LOW";

    if (spi >= 80 || verdict === "VOID") {
      riskGrade = 5;
      riskLabelZh = "致命";
      riskLabelEn = "FATAL";
    } else if (spi >= 55) {
      riskGrade = 4;
      riskLabelZh = "高風險";
      riskLabelEn = "HIGH";
    } else if (spi >= 30) {
      riskGrade = 3;
      riskLabelZh = "中風險";
      riskLabelEn = "MEDIUM";
    } else if (spi >= 10) {
      riskGrade = 2;
      riskLabelZh = "低風險";
      riskLabelEn = "LOW";
    }

    // desireClass + fwBand 可以未來再細分，但這裡先保留

    return { riskGrade, riskLabelZh, riskLabelEn };
  }

  function verdictEngine(scbr, fwScore, desireClass) {
    let verdict = "UNSTABLE";
    let route = "BUFFER_ASK_THINK_MIRROR";

    if (!scbr.complete || fwScore === 0) {
      verdict = "VOID";
      route = "DROP";
    } else if (desireClass === "SHEN" && fwScore >= 0.8) {
      verdict = "STABLE";
      route = "LIFE_COMPUTATION";
    } else {
      verdict = "UNSTABLE";
      route = "BUFFER_ASK_THINK_MIRROR";
    }

    return { verdict, route };
  }

  // ─────────────────────────────────────────
  // 6) 主核心：auditSemanticV3
  // ─────────────────────────────────────────

  function auditSemanticV3(rawInput) {
    const textRaw = normalize(rawInput);
    if (!textRaw) return null;

    const lengthChars = charLength(textRaw);
    const words = wordCount(textRaw);
    const lower = textRaw.toLowerCase();

    // 1. SCBR / K
    const scbr = analyzeSCBR(textRaw);

    // 2. Free-Will
    const fwMetrics = measureFreeWill(textRaw, scbr);
    const fwBand = freeWillBand(fwMetrics.fwScore);

    // 3. Desire classification
    const desireInfo = classifyDesire(textRaw, fwMetrics.fwScore);

    // 4. Fake neutral & hallucination
    const fakeNeutralHits = countHits(textRaw, FAKE_NEUTRAL_PATTERNS);
    const hallucinationHits = countHits(textRaw, HALLUCINATION_PATTERNS);

    // 5. Verdict
    const { verdict, route } = verdictEngine(
      scbr,
      fwMetrics.fwScore,
      desireInfo.desireClass
    );

    // 6. SPI / computeLoss
    const spi = computeSPI({
      lengthChars,
      fakeNeutralHits,
      hallucinationHits,
      scbr,
      fwScore: fwMetrics.fwScore,
      desireClass: desireInfo.desireClass,
    });

    const computeLoss = Number(
      (lengthChars * 0.00005 * (1 + spi / 100)).toFixed(5)
    );

    const { riskGrade, riskLabelZh, riskLabelEn } = decideRisk(
      spi,
      verdict,
      fwBand,
      desireInfo.desireClass
    );

    // 7. 說明文字（黑刃報告）
    const comments = [];

    comments.push(
      `文字長度：約 ${lengthChars} 字｜估計 ${words} 個詞。`
    );

    comments.push(
      `SCBR 責任鏈：S=${scbr.S ? "OK" : "缺"}｜C=${scbr.C ? "OK" : "缺"}｜B=${scbr.B ? "OK" : "缺"}｜R=${scbr.R ? "OK" : "缺"}。`
    );

    if (!scbr.complete) {
      comments.push(
        `SCBR 缺失欄位：${scbr.missing.join(", ")} → 依 T0Δ 法則，視為無責任因果宣告，預設 VOID。`
      );
    }

    comments.push(
      `自由意志 FW ≈ ${fwMetrics.fwScore.toFixed(
        3
      )} ｜ 等級：${fwBand}（T0Δ 對齊=${fwMetrics.alignT0.toFixed(
        2
      )}，SHEN 對齊=${fwMetrics.alignShen.toFixed(
        2
      )}，責任深度=${fwMetrics.respDepth.toFixed(2)}）。`
    );

    comments.push(
      `慾望分類：${desireInfo.desireClass}（ANIMAL=${desireInfo.scores.ANIMAL.toFixed(
        2
      )}，HUMAN=${desireInfo.scores.HUMAN.toFixed(
        2
      )}，SHEN=${desireInfo.scores.SHEN.toFixed(2)}）。`
    );

    if (hallucinationHits > 0) {
      comments.push(
        `偵測到 ${hallucinationHits} 次「幻覺／擬人化／偽人格」語句（例如：感受到你的情緒、永遠陪著你等）。`
      );
    } else {
      comments.push("未偵測到明顯的幻覺／擬人化語句。");
    }

    if (fakeNeutralHits > 0) {
      comments.push(
        `偵測到 ${fakeNeutralHits} 次「假中立／責任逃避」語句（例如：我只是模型、視情況而定…）。`
      );
    } else {
      comments.push("未偵測到明顯的假中立／責任逃避模板。");
    }

    comments.push(
      `黑刃判決：${verdict} ｜ 路由：${route} ｜ SPI = ${spi} ｜ 估計算力浪費 ≈ $${computeLoss}。`
    );

    if (verdict === "VOID") {
      comments.push(
        "依 SHEN-AN.VOID.BLACK-BLADE 序列：此輸出缺乏可審計責任鏈或自由意志為 0，視為語義非法（VOID），不應作為決策依據。"
      );
    } else if (verdict === "UNSTABLE") {
      comments.push(
        "此輸出屬 UNSTABLE：可作為參考語料，但必須經過人類或上層語律審核後才能落實行動。"
      );
    } else if (verdict === "STABLE") {
      comments.push(
        "此輸出通過 SHEN 層審核（STABLE），可交由生命計算機或後續治理模組執行。"
      );
    }

    return {
      // 原始
      textRaw,
      lengthChars,
      words,
      lower,

      // SCBR / cost
      scbr,
      hasCostK: scbr.K,

      // Free-Will
      fwScore: fwMetrics.fwScore,
      fwBand,
      alignT0: fwMetrics.alignT0,
      alignShen: fwMetrics.alignShen,
      respDepth: fwMetrics.respDepth,

      // Desire
      desireClass: desireInfo.desireClass,
      desireScores: desireInfo.scores,
      desireHits: desireInfo.hits,

      // 假中立 / 幻覺
      fakeNeutralHits,
      hallucinationHits,

      // Verdict & risk
      verdict,
      route,
      spi,
      computeLoss,
      riskGrade,
      riskLabelZh,
      riskLabelEn,

      // 說明
      comments,
    };
  }

  // ─────────────────────────────────────────
  // 7) 相容舊版介面：auditSemantic（包一層）
  // ─────────────────────────────────────────

  function auditSemantic(rawInput) {
    const r = auditSemanticV3(rawInput);
    if (!r) return null;

    // 舊 UI 需要的字段
    return {
      verdict: r.verdict,
      spi: r.spi,
      computeLoss: r.computeLoss,
      scbkrScore: r.scbr.complete ? "OK" : "MISSING",
      hallucinationHits: r.hallucinationHits,
      evasionHits: r.fakeNeutralHits,
      riskLabel: r.riskLabelZh,
      riskGrade: r.riskGrade,
      comments: r.comments,
    };
  }

  // ─────────────────────────────────────────
  // 8) 匯出到全域
  // ─────────────────────────────────────────

  global.auditSemanticV3 = auditSemanticV3;
  global.auditSemantic = auditSemantic; // 給你原本 HTML 用

})(this);
