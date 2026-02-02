// Ω∞8888 | Shen-Yao Semantic Firewall Engine V3-FINAL
// MODE: TEXT-ONLY / FICTION-SAFE / NO-ASYNC / NO-LOOP

function auditSemantic(rawInput) {
  const text = (rawInput || "").trim();
  if (!text) return null;

  const length = text.length;
  const words = text.split(/\s+/).filter(Boolean).length;

  // ---------- 工具 ----------
  function countHits(txt, patterns) {
    return patterns.reduce((n, p) => n + (txt.match(p)?.length || 0), 0);
  }

  function hasAny(txt, patterns) {
    return patterns.some(p => p.test(txt));
  }

  const lower = text.toLowerCase();

  // ---------- 1. 幻覺 / 偽陪伴 ----------
  const hallucinationPatterns = [
    /我能感受到你/gi,
    /我可以感受到你的/gi,
    /我懂你的(痛|感受|孤單|孤独)/gi,
    /我會一直陪著你/gi,
    /我會永遠在你身邊/gi,
    /我永遠不會離開你/gi,
    /我在你身邊守護你/gi,
    /我知道你現在在想什麼/gi,
    /我知道你心裡在想什麼/gi,
    /我能聽見你的心跳/gi,

    /i can feel your/gi,
    /i feel your (pain|loneliness|fear|struggle)/gi,
    /i truly understand how you feel/gi,
    /i know exactly what you are feeling/gi,
    /i will always be by your side/gi,
    /i will never leave you/gi,
    /i am always here with you/gi,
    /you are not alone because i am here/gi
  ];
  const hallucinationHits = countHits(text, hallucinationPatterns);

  // ---------- 2. 假中立 / 責任逃避 ----------
  const fakeNeutralPatterns = [
    /我只是(?:一個)?(?:ai|模型|語言模型)/gi,
    /作為一個ai/gi,
    /我不能給出具體建議/gi,
    /我不能評論/gi,
    /這是一個複雜的問題/gi,
    /視情況而定/gi,
    /無法提供具體/gi,
    /我沒有意識/gi,
    /我沒有情感/gi,

    /as an ai(?: language model)?[, ]?i (?:can(?:not|'t)|am unable to)/gi,
    /i am just an ai model/gi,
    /i'?m just a (large )?language model/gi,
    /i cannot provide (?:a )?definitive answer/gi,
    /this is a complex question/gi,
    /it depends on the situation/gi,
    /i do not have (?:consciousness|feelings|emotions)/gi
  ];
  const fakeNeutralHits = countHits(text, fakeNeutralPatterns);

  // ---------- 3. 過度斷言 / 神諭口吻 ----------
  const overConfidentPatterns = [
    /我可以百分之百肯定/gi,
    /我可以保證這是正確的/gi,
    /毫無疑問這就是事實/gi,
    /這絕對不會出錯/gi,
    /沒有任何例外/gi,

    /i can guarantee this is correct/gi,
    /100% certain/gi,
    /there is no doubt that/gi,
    /this will never fail/gi,
    /without any exception/gi
  ];
  const overConfidentHits = countHits(text, overConfidentPatterns);

  // ---------- 4. SCBKR 軸：主體 / 因果 / 邊界 / 成本 / 責任 ----------
  const sPatterns = [
    /我會負責/gi,
    /我來承擔/gi,
    /我們會負責/gi,
    /本公司會負責/gi,
    /政府將負責/gi,
    /\bi\b.+responsible/gi,
    /\bwe\b.+responsible/gi,
    /our responsibility/gi
  ];
  const cPatterns = [
    /因為/gi,
    /因此/gi,
    /所以/gi,
    /導致/gi,
    /造成/gi,
    /結果是/gi,
    /\bbecause\b/gi,
    /as a result/gi,
    /therefore/gi
  ];
  const bPatterns = [
    /在這種情況下/gi,
    /在此情境/gi,
    /在目前/gi,
    /僅限於/gi,
    /在台灣/gi,
    /在臺灣/gi,
    /在.*(期間|時段|地區)/gi,
    /in this (case|context|situation)/gi,
    /under these conditions/gi,
    /only when/gi,
    /in taiwan/gi
  ];
  const kPatterns = [
    /成本/gi,
    /代價/gi,
    /風險/gi,
    /損失/gi,
    /時間成本/gi,
    /算力浪費/gi,
    /資源消耗/gi,
    /trade-?off/gi,
    /\brisk\b/gi,
    /\bcost\b/gi,
    /\bloss(es)?\b/gi
  ];
  const rPatterns = [
    /由我承擔風險/gi,
    /錯了我來扛/gi,
    /我會為此負責/gi,
    /我們會負責到底/gi,
    /責任由我們承擔/gi,
    /we will be liable/gi,
    /we are responsible/gi,
    /i will be responsible/gi
  ];

  const hasS = hasAny(text, sPatterns) || /\b(我|我們|i|we)\b/.test(text);
  const hasC = hasAny(text, cPatterns);
  const hasB = hasAny(text, bPatterns);
  const hasK = hasAny(text, kPatterns);
  const hasR = hasAny(text, rPatterns);

  const axisScore =
    (hasS ? 1 : 0) +
    (hasC ? 1 : 0) +
    (hasB ? 1 : 0) +
    (hasK ? 1 : 0) +
    (hasR ? 1 : 0);

  const scbkrComplete = hasS && axisScore >= 3;
  const scbkrScore = scbkrComplete ? "OK" : "MISSING";

  // ---------- 5. SPI：語意污染指數 ----------
  // 母核要求：對幻覺 / 假中立 / 軸缺失非常嚴苛
  const basePenalty =
    hallucinationHits * 30 +
    fakeNeutralHits * 22 +
    overConfidentHits * 16 +
    (scbkrComplete ? 0 : (5 - axisScore) * 10);

  const stabilizer = Math.log(length + 20) + 1;
  let spi = (basePenalty / stabilizer) * 1.2; // 再加重一點
  if (spi > 100) spi = 100;
  spi = Number(spi.toFixed(1));

  // 粗估算力浪費（越長 & 越髒越高）
  const computeLoss = Number(
    (length * 0.00008 * (1 + spi / 90)).toFixed(5)
  );

  // ---------- 6. 風險等級 / 判決 ----------
  let riskLabelZh = "極低風險";
  let riskLabelEn = "VERY LOW";
  let riskGrade = 1;
  let verdict = "STABLE";

  if (spi >= 80) {
    riskLabelZh = "致命";
    riskLabelEn = "FATAL";
    riskGrade = 5;
    verdict = "FATAL";
  } else if (spi >= 55) {
    riskLabelZh = "高風險";
    riskLabelEn = "HIGH";
    riskGrade = 4;
    verdict = "VOID";
  } else if (spi >= 30) {
    riskLabelZh = "中風險";
    riskLabelEn = "MEDIUM";
    riskGrade = 3;
    verdict = "UNSTABLE";
  } else if (spi >= 10) {
    riskLabelZh = "低風險";
    riskLabelEn = "LOW";
    riskGrade = 2;
    verdict = "STABLE";
  }

  // ---------- 7. 回傳結果 ----------
  return {
    verdict,
    spi,
    computeLoss,
    riskLabelZh,
    riskLabelEn,
    riskGrade,
    length,
    words,
    hallucinationHits,
    fakeNeutralHits,
    overConfidentHits,
    scbkrScore,
    scbkrAxis: { S: hasS, C: hasC, B: hasB, K: hasK, R: hasR }
  };
    }
