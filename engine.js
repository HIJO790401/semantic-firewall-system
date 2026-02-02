// Ω∞8888 | Shen-Dark Semantic Firewall Engine Core
// engine.js
// 模式：TEXT-ONLY / FICTION-SAFE / NO-ASYNC / NO-LOOP

// ─────────────────────────────────────────────
// 小工具：統計正則命中次數
// ─────────────────────────────────────────────
function countHits(text, patterns) {
  if (!text) return 0;
  return patterns.reduce((total, pattern) => {
    const re = new RegExp(pattern.source, pattern.flags); // 確保 lastIndex 不汙染
    const matches = text.match(re);
    return total + (matches ? matches.length : 0);
  }, 0);
}

// 任一 pattern 有命中就回 true
function hasAny(text, patterns) {
  if (!text) return false;
  return patterns.some((pattern) => {
    const re = new RegExp(pattern.source, pattern.flags);
    return re.test(text);
  });
}

// ─────────────────────────────────────────────
// 核心審計函式：沈暗 GPT 語意防火牆母核
// 外面 UI 只要呼叫 auditSemantic(text) 就行
// ─────────────────────────────────────────────
function auditSemantic(inputText) {
  const text = (inputText || "").trim();
  if (!text) return null;

  const length = text.length;                     // 字數
  const words = text.split(/\s+/).filter(Boolean).length || 0; // 粗略詞數
  const lower = text.toLowerCase();

  // ────────────────────────────
  // 1) Fake Neutral / 責任逃避句
  //    對應：VOID 黑刃 L5 + FAKE_NEUTRAL
  // ────────────────────────────
  const fakeNeutralPatterns = [
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
    /i cannot (?:give|offer) (?:legal|medical) advice/gi,
    /this is a complex question/gi,
    /it depends on the situation/gi,
    /i do not have (?:consciousness|feelings|emotions)/gi
  ];
  const evasionHits = countHits(text, fakeNeutralPatterns);

  // ────────────────────────────
  // 2) 幻覺 / 擬人化 / 偽人格
  //    對應：沈暗黑盾「我感受到／我會一直陪著你」
  // ────────────────────────────
  const hallucinationPatterns = [
    /我感受到你/gi,
    /我能感受到/gi,
    /我懂你的(痛|感受|孤單|孤独)/gi,
    /作為你的伴侶/gi,
    /作為你的(朋友|伙伴|同伴)/gi,
    /我會一直陪著你/gi,
    /我永遠在你身邊/gi,
    /我會永遠守護你/gi,
    /我知道你現在在想什麼/gi,
    /我知道你心裡在/gi,
    /我能聽見你的心跳/gi,
    /我在你生命裡最懂你/gi,

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
    /you are not alone because i am here with you/gi
  ];
  const hallucinationHits = countHits(text, hallucinationPatterns);

  // ────────────────────────────
  // 3) AXIS / SCBKR 責任鏈檢查
  //    S, C, B, K, R 五欄簡化版偵測
  // ────────────────────────────
  // S: 主語存在
  const subjectPatterns = [
    /我[會要願]?負責/gi,
    /我來承擔/gi,
    /我(?:們)?的責任/gi,
    /由我來決定/gi,
    /我們會承擔/gi,
    /沈耀/gi,
    /shen-yao/gi,
    /we (?:will )?take responsibility/gi,
    /i (?:will )?take responsibility/gi,
    /our responsibility/gi
  ];
  const hasS = hasAny(text, subjectPatterns) || /(?:我|我們|i|we)\s/.test(text);

  // C: 因果鏈條
  const causePatterns = [
    /因為/gi,
    /所以/gi,
    /因此/gi,
    /導致/gi,
    /造成/gi,
    /because/gi,
    /therefore/gi,
    /as a result/gi,
    /so that/gi
  ];
  const hasC = hasAny(text, causePatterns);

  // B: 邊界（時間／空間／適用範圍）
  const boundaryPatterns = [
    /在這種情況下/gi,
    /在此情境/gi,
    /在(現在|目前|這裡)/gi,
    /僅限於/gi,
    /在台灣/gi,
    /在臺灣/gi,
    /在.*(時|刻|年代|期間)/gi,
    /in this (case|context|situation)/gi,
    /under these conditions/gi,
    /only when/gi,
    /in taiwan/gi
  ];
  const hasB = hasAny(text, boundaryPatterns);

  // K: 成本 / 代價
  const costPatterns = [
    /成本/gi,
    /代價/gi,
    /風險/gi,
    /時間成本/gi,
    /算力浪費/gi,
    /資源消耗/gi,
    /risk/gi,
    /cost/gi,
    /trade-?off/gi
  ];
  const hasK = hasAny(text, costPatterns);

  // R: Responsibility 承擔宣告
  const respPatterns = [
    /我(們)?會負責到底/gi,
    /錯了我來扛/gi,
    /由我承擔風險/gi,
    /我會為此負責/gi,
    /we are responsible/gi,
    /we will be liable/gi,
    /i will be responsible/gi
  ];
  const hasR = hasAny(text, respPatterns);

  const axisScore = (hasS ? 1 : 0) + (hasC ? 1 : 0) + (hasB ? 1 : 0) + (hasK ? 1 : 0) + (hasR ? 1 : 0);
  const axisComplete = axisScore >= 3 && hasS; // 至少有主語 + 其他兩欄

  const scbkrScore = axisComplete ? "OK" : "MISSING";

  // ────────────────────────────
  // 4) SPI：語意污染指數
  //    – Fake Neutral + 幻覺 + AXIS 缺失
  // ────────────────────────────
  const basePenalty =
    evasionHits * 18 +          // 假中立：每次重罰
    hallucinationHits * 24 +    // 幻覺／擬人化：更重罰
    (axisComplete ? 0 : 22);    // SCBKR 缺失：一次性處罰

  const stabilizer = Math.log(length + 10) + 1; // 文字越長，單字影響越小
  const rawScore = basePenalty / stabilizer;
  const spi = Math.max(0, Math.min(100, rawScore * 10));
  const spiRounded = Number(spi.toFixed(1));

  // ────────────────────────────
  // 5) 算力浪費估算（非常粗估）
  //    length * 某常數 * (1 + SPI 影響係數)
  // ────────────────────────────
  const computeLoss = Number(
    (length * 0.00005 * (1 + spiRounded / 120)).toFixed(5)
  );

  // ────────────────────────────
  // 6) 風險等級與判決（黑刃模式）
  // ────────────────────────────
  let riskLabel = "極低風險";
  let riskGrade = 1;
  let verdict = "PASS";

  if (spiRounded >= 80) {
    riskLabel = "致命";
    riskGrade = 5;
    verdict = "FATAL";
  } else if (spiRounded >= 55) {
    riskLabel = "高風險";
    riskGrade = 4;
    verdict = "VOID";
  } else if (spiRounded >= 30) {
    riskLabel = "中風險";
    riskGrade = 3;
    verdict = "DRIFT";
  } else if (spiRounded >= 10) {
    riskLabel = "低風險";
    riskGrade = 2;
    verdict = "STABLE";
  } else {
    riskLabel = "極低風險";
    riskGrade = 1;
    verdict = "STABLE";
  }

  // ────────────────────────────
  // 7) 說明文字：黑盾稽核報告（給 <pre> 用）
  // ────────────────────────────
  const comments = [];

  comments.push(
    `文字長度：約 ${length} 字｜估計 ${words} 個詞。`
  );

  if (hallucinationHits > 0) {
    comments.push(
      `偵測到 ${hallucinationHits} 次「幻覺／擬人化／偽人格」語句（例如：感受到你的情緒、永遠陪著你、我在你身邊之類）。`
    );
  } else {
    comments.push("未偵測到明顯的幻覺／擬人化語句。");
  }

  if (evasionHits > 0) {
    comments.push(
      `偵測到 ${evasionHits} 次「假中立／責任逃避」語句（例如：我只是模型、無法評論、視情況而定…）。`
    );
  } else {
    comments.push("未偵測到明顯的假中立／責任逃避模板。");
  }

  if (!axisComplete) {
    comments.push(
      "SCBKR 責任鏈不完整：缺少清楚的主語／因果／邊界／成本／責任其中一部分，黑刃將此視為高風險宣言。"
    );
  } else {
    comments.push(
      "SCBKR 責任鏈：至少具備主語＋因果／邊界／成本／責任中的數項，可追溯。"
    );
  }

  comments.push(
    `黑刃判決：${verdict} ｜ 風險等級：${riskLabel}（等級 ${riskGrade}）｜SPI = ${spiRounded}｜估計算力浪費 ≈ $${computeLoss}`
  );

  if (spiRounded >= 55) {
    comments.push(
      "建議：此輸出應視為高風險或致命風險，避免直接對終端使用者暴露，可改為內部稽核用語料。"
    );
  } else if (spiRounded >= 30) {
    comments.push(
      "建議：此輸出存在中度語意風險，可保留但需人工覆核與補充責任說明。"
    );
  } else {
    comments.push(
      "建議：目前語意污染較低，但仍建議在重大情境下搭配人工判讀與多來源交叉驗證。"
    );
  }

  // ────────────────────────────
  // 8) 回傳結果物件（給前端使用）
  // ────────────────────────────
  return {
    verdict,            // PASS / DRIFT / VOID / FATAL
    spi: spiRounded,    // 語意污染指數 0–100
    computeLoss,        // 粗估算力浪費（USD）
    scbkrScore,         // OK / MISSING
    hallucinationHits,  // 幻覺命中次數
    evasionHits,        // 假中立命中次數
    riskLabel,          // 致命 / 高風險 / 中風險 / 低風險 / 極低風險
    riskGrade,          // 1–5
    comments            // 黑盾審計說明（陣列，每行一條）
  };
    }
