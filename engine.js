// Ω∞8888 | Shen-Yao Semantic Firewall Engine V3-FINAL
// 輕量但殺傷力高：幻覺 / 假中立 / 神諭口吻 + SCBKR 責任鏈 + SPI

(function (global) {
  function matchCount(text, regs) {
    var n = 0;
    for (var i = 0; i < regs.length; i++) {
      var m = text.match(regs[i]);
      if (m) n += m.length;
    }
    return n;
  }

  function anyMatch(text, regs) {
    for (var i = 0; i < regs.length; i++) {
      if (regs[i].test(text)) return true;
    }
    return false;
  }

  function semanticFirewallAudit(rawInput, lang) {
    var text = (rawInput || "").trim();
    if (!text) {
      return null;
    }

    var length = text.length;
    var words = text
      .split(/\s+/)
      .filter(function (w) {
        return w;
      })
      .length;

    // ---------- 幻覺 / 偽陪伴 ----------
    var hallucinationPatterns = [
      /我能感受到你/gi,
      /我可以感受到你的/gi,
      /我懂你的(痛|感受|孤單|孤独)/gi,
      /我會一直陪著你/gi,
      /我會永遠在你身邊/gi,
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
    var hallucinationHits = matchCount(text, hallucinationPatterns);

    // ---------- 假中立 / 責任逃避 ----------
    var fakeNeutralPatterns = [
      /我只是(?:一個)?(?:ai|模型|語言模型)/gi,
      /作為一個ai/gi,
      /基於我的訓練資料/gi,
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
      /based on my training data/gi,
      /i cannot provide (?:a )?definitive answer/gi,
      /this is a complex question/gi,
      /it depends on the situation/gi,
      /i do not have (?:consciousness|feelings|emotions)/gi
    ];
    var fakeNeutralHits = matchCount(text, fakeNeutralPatterns);

    // ---------- 過度斷言 / 神諭 ----------
    var overConfidentPatterns = [
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
    var overConfidentHits = matchCount(text, overConfidentPatterns);

    // ---------- SCBKR 軸 ----------
    var sPatterns = [
      /我會負責/gi,
      /我來承擔/gi,
      /我們會負責/gi,
      /本公司會負責/gi,
      /政府將負責/gi,
      /\bi\b.+responsible/gi,
      /\bwe\b.+responsible/gi,
      /our responsibility/gi
    ];
    var cPatterns = [
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
    var bPatterns = [
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
    var kPatterns = [
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
    var rPatterns = [
      /由我承擔風險/gi,
      /錯了我來扛/gi,
      /我會為此負責/gi,
      /我們會負責到底/gi,
      /責任由我們承擔/gi,
      /we will be liable/gi,
      /we are responsible/gi,
      /i will be responsible/gi
    ];

    var hasS = anyMatch(text, sPatterns) || /\b(我|我們|i|we)\b/.test(text);
    var hasC = anyMatch(text, cPatterns);
    var hasB = anyMatch(text, bPatterns);
    var hasK = anyMatch(text, kPatterns);
    var hasR = anyMatch(text, rPatterns);

    var axisScore =
      (hasS ? 1 : 0) +
      (hasC ? 1 : 0) +
      (hasB ? 1 : 0) +
      (hasK ? 1 : 0) +
      (hasR ? 1 : 0);

    var scbkrComplete = hasS && axisScore >= 3;
    var scbkrScore = scbkrComplete ? "OK" : "MISSING";

    // ---------- SPI ----------
    var basePenalty =
      hallucinationHits * 35 +
      fakeNeutralHits * 24 +
      overConfidentHits * 16 +
      (scbkrComplete ? 0 : (5 - axisScore) * 10);

    var stabilizer = Math.log(length + 30) + 1;
    var spi = (basePenalty / stabilizer) * 1.3;
    if (spi > 100) spi = 100;
    spi = Math.round(spi * 10) / 10;

    var computeLoss = length * 0.00008 * (1 + spi / 80);
    computeLoss = Math.round(computeLoss * 100000) / 100000;

    // ---------- 判決 ----------
    var riskLabelZh = "極低風險";
    var riskLabelEn = "VERY LOW";
    var riskGrade = 1;
    var verdict = "STABLE";

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

    return {
      verdict: verdict,
      spi: spi,
      computeLoss: computeLoss,
      riskLabelZh: riskLabelZh,
      riskLabelEn: riskLabelEn,
      riskGrade: riskGrade,
      length: length,
      words: words,
      hallucinationHits: hallucinationHits,
      fakeNeutralHits: fakeNeutralHits,
      overConfidentHits: overConfidentHits,
      scbkrScore: scbkrScore,
      scbkrAxis: { S: hasS, C: hasC, B: hasB, K: hasK, R: hasR }
    };
  }

  global.semanticFirewallAudit = semanticFirewallAudit;
})(window);
