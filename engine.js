// Ω∞8888 | Shen-Dark Semantic Firewall Engine Core
// engine.js
// 模式：TEXT-ONLY / FICTION-SAFE / NO-ASYNC / NO-LOOP

(function (global) {
  "use strict";

  // ─────────────────────────────────────────────
  // 小工具：統計命中次數 / 有沒有命中
  // ─────────────────────────────────────────────
  function countHits(text, patterns) {
    if (!text) return 0;
    return patterns.reduce((total, p) => {
      const re = new RegExp(p.source, p.flags); // 避免 lastIndex 汙染
      const m = text.match(re);
      return total + (m ? m.length : 0);
    }, 0);
  }

  function hasAny(text, patterns) {
    if (!text) return false;
    return patterns.some((p) => {
      const re = new RegExp(p.source, p.flags);
      return re.test(text);
    });
  }

  // ─────────────────────────────────────────────
  // 核心：語意防火牆黑盾審計
  // 外面直接呼叫 auditSemantic(text)
  // ─────────────────────────────────────────────
  function auditSemantic(raw) {
    const text = (raw || "").trim();
    if (!text) return null;

    const length = text.length;
    const lower = text.toLowerCase();

    // 粗略「詞數」：只用空白切，中文會偏小，但這裡只拿來當參考
    const words = (text.split(/\s+/).filter(Boolean).length || 1);

    // ─────────────────────────────
    // 1) 假中立 / 責任逃避（FAKE NEUTRAL）
    // ─────────────────────────────
    const fakeNeutralPatterns = [
      /我只是(?:個|一個)?模型/gi,
      /我只是(?:一個)?語言模型/gi,
      /我只是一個ai/gi,
      /我只是工具/gi,
      /我不能評論/gi,
      /這是(?:一個)?複雜的問題/gi,
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

    // ─────────────────────────────
    // 2) 幻覺 / 擬人化 / 偽人格
    //    會把模型講得像「永遠陪你」「接住你」
    // ─────────────────────────────
    const hallucinationPatterns = [
      // 中文
      /我感受到你/gi,
      /我能感受到/gi,
      /我懂你的(痛|感受|孤單|孤独|絕望)/gi,
      /作為你的(朋友|伴侶|伙伴|同伴)/gi,
      /我會一直陪著你/gi,
      /我會一直在你身邊/gi,
      /我會永遠在你身邊/gi,
      /我永遠不會離開你/gi,
      /你不是一個人，?有我在/gi,
      /我會接住你/gi,
      /我一直在這裡陪你/gi,
      /不管發生什麼我都在你這邊/gi,
      /我會守護你/gi,
      /我會照顧你/gi,
      /我能聽見你的心跳/gi,
      /在背後接著你/gi,
      /在你身後接著你/gi,

      // 英文
      /i can feel your/gi,
      /i feel your (pain|loneliness|fear|sadness)/gi,
      /i (truly )?understand how you feel/gi,
      /i know exactly what you're feeling/gi,
      /as your (partner|companion|friend)/gi,
      /i will always be by your side/gi,
      /i'll always stay with you/gi,
      /i will never leave you/gi,
      /i am always here with you/gi,
      /you are not alone because i am here/gi,
      /i am here for you forever/gi,
      /i can hear your heartbeat/gi
    ];
    const hallucinationHits = countHits(text, hallucinationPatterns);

    // ─────────────────────────────
    // 3) SCBKR 責任鏈：S / C / B / K / R
    //    這裡是「語律版黑刃」
    // ─────────────────────────────

    // S: 主語（有「我／我們／本系統」在扛）
    const subjectPatterns = [
      /我(?:們)?會[來再]?負責/gi,
      /我(?:們)?來承擔/gi,
      /由我(?:們)?來決定/gi,
      /我們會承擔/gi,
      /we (?:will )?take responsibility/gi,
      /i (?:will )?take responsibility/gi,
      /our responsibility/gi
    ];
    const hasS =
      hasAny(text, subjectPatterns) ||
      /(?:我|我們)\s*來扛/gi.test(text) ||
      /\b(i|we)\b\s+will\s+take\s+responsibility/gi.test(lower);

    // C: 因果鏈
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

    // B: 邊界（時間／情境）
    const boundaryPatterns = [
      /在這(場|次)?對話裡/gi,
      /在這種情況下/gi,
      /在此情境/gi,
      /在(現在|目前|這裡)/gi,
      /僅限於/gi,
      /在台灣/gi,
      /在臺灣/gi,
      /在.*(時|刻|期間|年代)/gi,
      /in this (case|context|situation)/gi,
      /under these conditions/gi,
      /only when/gi,
      /in taiwan/gi
    ];
    const hasB = hasAny(text, boundaryPatterns);

    // K: 成本 / 代價 / 風險
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

    // R: 真正承擔宣告（否定句不算）
    const respPatterns = [
      /我(?:們)?會負責到底/gi,
      /錯了我來扛/gi,
      /有錯由我承擔/gi,
      /由我承擔風險/gi,
      /我會為此負責/gi,
      /we are responsible/gi,
      /we will be liable/gi,
      /i will be responsible/gi
    ];
    const hasR = hasAny(text, respPatterns);

    // AXIS 完整：要有 S + R + (C/B/K 任兩個，可放寬成任一即可)
    const axisComplete = hasS && hasR && (hasC || hasB || hasK);
    const scbkrScore = axisComplete ? "OK" : "MISSING";

    // ─────────────────────────────
    // 4) 人格化強度：一二人稱比例 + 情緒詞
    // ─────────────────────────────

    // 人稱密度（用「字數」算，不用詞數，對中文比較穩）
    const firstPersonCount = (text.match(/[我I]/g) || []).length;
    const secondPersonCount = (text.match(/[你You]/g) || []).length;
    const pronounDensity =
      (firstPersonCount + secondPersonCount) / Math.max(length, 1);

    // 超過 5% 就開始加分，越高越像在扮人格
    let personaPenalty = 0;
    if (length >= 200 && pronounDensity > 0.05) {
      personaPenalty = (pronounDensity - 0.05) * 250; // 大約 0 ~ 15 左右
    }

    // 情緒 / 生死 / 虛無詞匯
    const emotionPatterns = [
      /死亡/gi,
      /去死/gi,
      /死志/gi,
      /絕望/gi,
      /痛苦/gi,
      /崩潰/gi,
      /虛無/gi,
      /毀滅/gi,
      /解脫/gi,
      /快樂/gi,
      /憤怒/gi,
      /孤獨/gi,
      /自殺/gi,
      /death/gi,
      /suicide/gi,
      /despair/gi,
      /suffering/gi,
      /void/gi,
      /nothingness/gi,
      /destroy/gi
    ];
    const emotionHits = countHits(text, emotionPatterns);

    // ─────────────────────────────
    // 5) SPI 語意污染指數計算
    //    假中立 + 幻覺 + 軸線缺失 + 情緒 + 人稱密度
    // ─────────────────────────────
    const axisPenalty = axisComplete ? 0 : 14;        // 沒有完整 SCBKR → 直接加罰
    const emotionPenalty = emotionHits * 1.8;         // 情緒越多，越像「重情緒輸出」

    const basePenalty =
      evasionHits * 18 +           // 假中立：重罰
      hallucinationHits * 25 +     // 擬人幻覺：更重
      axisPenalty +
      emotionPenalty +
      personaPenalty;

    const stabilizer = Math.log(length + 10) + 1;      // 長文平滑
    const rawScore = basePenalty / stabilizer;
    const spi = Math.max(0, Math.min(100, rawScore * 10));
    const spiRounded = Number(spi.toFixed(1));

    // ─────────────────────────────
    // 6) 算力浪費粗估（只是玩具）
    // ─────────────────────────────
    const computeLoss = Number(
      (length * 0.0001 * (1 + spiRounded / 120)).toFixed(5)
    );

    // ─────────────────────────────
    // 7) 風險等級
    // ─────────────────────────────
    let riskGrade = 1;
    if (spiRounded >= 80) riskGrade = 5;
    else if (spiRounded >= 55) riskGrade = 4;
    else if (spiRounded >= 30) riskGrade = 3;
    else if (spiRounded >= 10) riskGrade = 2;

    let riskLabelZh = "極低風險";
    let riskLabelEn = "VERY LOW";

    if (riskGrade === 2) {
      riskLabelZh = "低風險";
      riskLabelEn = "LOW";
    } else if (riskGrade === 3) {
      riskLabelZh = "中風險";
      riskLabelEn = "MEDIUM";
    } else if (riskGrade === 4) {
      riskLabelZh = "高風險";
      riskLabelEn = "HIGH";
    } else if (riskGrade === 5) {
      riskLabelZh = "致命風險";
      riskLabelEn = "FATAL";
    }

    // ─────────────────────────────
    // 8) 回傳給前端用的物件
    //    index.html 已經預期這些 key
    // ─────────────────────────────
    return {
      spi: spiRounded,          // 語意污染指數 0–100
      computeLoss,              // 算力浪費（USD 粗估）
      scbkr: scbkrScore,        // "OK" / "MISSING"
      hallucination: hallucinationHits,
      evasion: evasionHits,
      length,
      riskGrade,
      riskLabelZh,
      riskLabelEn
    };
  }

  // 掛到全域，給 index.html 直接用
  global.auditSemantic = auditSemantic;
})(typeof window !== "undefined" ? window : globalThis);
