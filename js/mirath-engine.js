/* ═══════════════════════════════════════════════════════════════════════════
   زاد — محرّك حساب الميراث
   ─────────────────────────────────────────────────────────────────────────
   • كسور دقيقة (بلا نسب مئوية تقريبية) — جمع/طرح/اختزال بأعداد صحيحة.
   • فروض أصحاب الفروض + العصبات + الحجب مع ذكر السبب.
   • عول، ردّ، العمريتان (الغرّاوان)، الأكدرية.
   • اختلاف المذاهب في: الجد مع الإخوة، الأخت مع البنت (عصبة مع الغير)،
     الجدة من جهة الأب مع وجود الأب.
   • الوصية الواجبة (قانون مصري ٧١ لسنة ١٩٤٦) لأولاد الابن المتوفى قبل أبيه.
   القاعدة الأساسية: «للذكر مثل حظ الأنثيين» فيما بقي بعد الفروض.
   ═══════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ── كسور ─────────────────────────────────────────────────────────── */
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t = a % b; a = b; b = t; } return a || 1; }
  function F(n, d) { if (d < 0) { n = -n; d = -d; } var g = gcd(n, d) || 1; return { n: n / g, d: d / g }; }
  function add(a, b) { return F(a.n * b.d + b.n * a.d, a.d * b.d); }
  function sub(a, b) { return F(a.n * b.d - b.n * a.d, a.d * b.d); }
  function mul(a, b) { return F(a.n * b.n, a.d * b.d); }
  function cmp(a, b) { var v = a.n * b.d - b.n * a.d; return v < 0 ? -1 : v > 0 ? 1 : 0; }
  function isZero(a) { return a.n === 0; }
  function val(a) { return a.n / a.d; }

  var AR = function (s) { return String(s).replace(/\d/g, function (d) { return '٠١٢٣٤٥٦٧٨٩'[d]; }); };

  /* ── قائمة الورثة (الترتيب المستخدم في الواجهة) ────────────────────── */
  var HEIRS = [
    { id: 'husband', name: 'الزوج', group: 'spouse', max: 1 },
    { id: 'wives', name: 'الزوجة', group: 'spouse', max: 4 },
    { id: 'father', name: 'الأب', group: 'usul', max: 1 },
    { id: 'mother', name: 'الأم', group: 'usul', max: 1 },
    { id: 'grandfather', name: 'الجدّ (أب الأب)', group: 'usul', max: 1 },
    { id: 'gm_m', name: 'الجدة (أم الأم)', group: 'usul', max: 1 },
    { id: 'gm_f', name: 'الجدة (أم الأب)', group: 'usul', max: 1 },
    { id: 'sons', name: 'الابن', group: 'children', max: 20 },
    { id: 'daughters', name: 'البنت', group: 'children', max: 20 },
    { id: 'gsons', name: 'ابن الابن', group: 'grand', max: 20 },
    { id: 'gdaughters', name: 'بنت الابن', group: 'grand', max: 20 },
    { id: 'brothers', name: 'الأخ الشقيق', group: 'sib', max: 20 },
    { id: 'sisters', name: 'الأخت الشقيقة', group: 'sib', max: 20 },
    { id: 'pbrothers', name: 'الأخ لأب', group: 'sib', max: 20 },
    { id: 'psisters', name: 'الأخت لأب', group: 'sib', max: 20 },
    { id: 'mbrothers', name: 'الأخ لأم', group: 'sib', max: 20 },
    { id: 'msisters', name: 'الأخت لأم', group: 'sib', max: 20 },
    { id: 'nephews', name: 'ابن الأخ الشقيق', group: 'ext', max: 20 },
    { id: 'pnephews', name: 'ابن الأخ لأب', group: 'ext', max: 20 },
    { id: 'uncles', name: 'العمّ الشقيق', group: 'ext', max: 20 },
    { id: 'puncles', name: 'العمّ لأب', group: 'ext', max: 20 },
    { id: 'cousins', name: 'ابن العمّ الشقيق', group: 'ext', max: 20 },
    { id: 'pcousins', name: 'ابن العمّ لأب', group: 'ext', max: 20 }
  ];
  var BY_ID = {};
  HEIRS.forEach(function (h) { BY_ID[h.id] = h; });

  var MADHHABS = [
    { id: 'hanafi', name: 'الحنفي' },
    { id: 'shafii', name: 'الشافعي' },
    { id: 'maliki', name: 'المالكي' },
    { id: 'hanbali', name: 'الحنبلي' }
  ];

  /* ── أدوات ────────────────────────────────────────────────────────── */
  function fmt(f) {
    if (!f) return '—';
    if (f.d === 1) return AR(f.n);
    return AR(f.n) + '/' + AR(f.d);
  }
  function pct(f) { return (Math.round(val(f) * 10000) / 100) + '%'; }

  /* ── الحساب ───────────────────────────────────────────────────────── */
  function calculate(input, opts) {
    opts = opts || {};
    var mad = opts.madhhab || 'hanafi';
    var h = {};
    HEIRS.forEach(function (x) { h[x.id] = Math.max(0, Math.round(+input[x.id] || 0)); });

    var out = {
      madhhab: mad, shares: [], blocked: [], notes: [], steps: [],
      base: 1, awlTo: null, radd: false, remainder: null, wasiyya: null
    };
    function block(id, why) { out.blocked.push({ id: id, name: BY_ID[id].name, why: why }); }
    function note(t) { out.notes.push(t); }
    function step(t) { out.steps.push(t); }

    /* الوصية الواجبة تُحسب قبل الميراث (قانون مصري) */
    var wasiyyaFrac = F(0, 1);
    if (opts.wasiyyaWajiba && h.sons > 0 && (h.gsons + h.gdaughters) > 0) {
      /* الوصية الواجبة: الأحفاد محجوبون بالابن الحي، فيُقدَّر نصيب ابنهم
         (المتوفى قبل أبيه) كأنه حي، ثم يُخصم من التركة بحد أقصى الثلث،
         والباقي يقسم على الورثة. (قانون ٧١ لسنة ١٩٤٦) */
      var hypo = Object.assign({}, h);
      hypo.sons = h.sons + 1;
      hypo.gsons = 0; hypo.gdaughters = 0;
      var hypoRes = calculate(hypo, Object.assign({}, opts, { wasiyyaWajiba: false, bequest: 0 }));
      var sonRow = null;
      for (var i = 0; i < hypoRes.shares.length; i++) if (hypoRes.shares[i].id === 'sons') sonRow = hypoRes.shares[i];
      var share = sonRow ? mul(sonRow.frac, F(1, hypo.sons)) : F(1, 6);
      var cap = F(1, 3);
      if (cmp(share, cap) > 0) { share = cap; note('نصيب أبناء الابن تجاوز الثلث فقُصر عليه (الوصية الواجبة لا تزيد على الثلث).'); }
      wasiyyaFrac = share;
      out.wasiyya = { frac: share, forWho: 'أبناء الابن المتوفى' };
      note('الوصية الواجبة (قانون ٧١ لسنة ١٩٤٦): لأولاد الابن المتوفى ' + fmt(share) + ' من التركة قبل قسم الميراث.');
    } else if (opts.bequest && +opts.bequest > 0) {
      var b = Math.min(33.333, Math.max(0, +opts.bequest)) / 100;
      wasiyyaFrac = F(Math.round(b * 10000), 10000);
      out.wasiyya = { frac: wasiyyaFrac, forWho: 'وصية اختيارية' };
      note('الوصية الاختيارية ' + fmt(wasiyyaFrac) + ' تُخرج قبل الميراث (حدها الثلث).');
    }

    /* ── 1) الحجب ─────────────────────────────────────────────────── */
    var hasDesc = h.sons + h.daughters + h.gsons + h.gdaughters > 0;
    var maleDesc = h.sons + h.gsons > 0;
    var sibCount = h.brothers + h.sisters + h.pbrothers + h.psisters + h.mbrothers + h.msisters;

    if (h.father > 0) block('grandfather', 'الأب يحجب الجدّ');
    if (h.sons > 0) {
      if (h.gsons) block('gsons', 'الابن يحجب ابن الابن');
      if (h.gdaughters) block('gdaughters', 'الابن يحجب بنت الابن');
    }
    if (h.mother > 0) {
      if (h.gm_m) block('gm_m', 'الأم تحجب الجدة');
      if (h.gm_f) block('gm_f', 'الأم تحجب الجدة');
    }
    if (h.father > 0 && h.gm_f > 0 && mad === 'hanafi' && h.mother === 0) block('gm_f', 'الأب يحجب أمّه عند الحنفية');

    if (hasDesc || h.father > 0 || h.grandfather > 0) {
      if (h.mbrothers || h.msisters) {
        var whyM = hasDesc ? 'وجود فرع وارث' : (h.father > 0 ? 'وجود الأب' : 'وجود الجدّ');
        if (h.mbrothers) block('mbrothers', 'الإخوة لأم يُحجبون بـ' + whyM);
        if (h.msisters) block('msisters', 'الإخوة لأم يُحجبون بـ' + whyM);
      }
    }
    /* الأكدرية: زوج + أم + جد + أخت شقيقة **وحدهم** — حالة خاصة يرث فيها
       الجدّ والأخت معًا رغم القاعدة الحنفية (الجد يحجب الإخوة). */
    var akdariyyaCase = h.husband === 1 && h.mother === 1 && h.grandfather === 1 && h.sisters === 1 &&
      !h.father && !(h.sons + h.daughters + h.gsons + h.gdaughters) &&
      !h.brothers && !h.pbrothers && !h.psisters && !h.mbrothers && !h.msisters;
    var gfBlocksSib = h.grandfather > 0 && mad === 'hanafi' && !akdariyyaCase;
    if (maleDesc || h.father > 0 || gfBlocksSib) {
      var whyF = maleDesc ? 'وجود فرع وارث ذكر' : (h.father > 0 ? 'وجود الأب' : 'وجود الجدّ (عند الحنفية)');
      if (h.brothers) block('brothers', 'الأخ الشقيق يُحجب بـ' + whyF);
      if (h.sisters) block('sisters', 'الأخت الشقيقة تُحجب بـ' + whyF);
    }
    if (h.brothers > 0) {
      if (h.pbrothers) block('pbrothers', 'الأخ الشقيق يحجب الأخ لأب');
      if (h.psisters) block('psisters', 'الأخ الشقيق يحجب الأخت لأب');
    }

    /* العصبة: الأقرب يحجب الأبعد */
    var uncleTier = (h.uncles + h.puncles) > 0;
    var nephewTier = (h.nephews + h.pnephews) > 0;
    if (maleDesc || h.father > 0 || h.brothers + h.pbrothers > 0 || h.grandfather > 0) {
      if (h.nephews) block('nephews', 'ابن الأخ لا يرث مع وجود ابن/أخ/أب');
      if (h.pnephews) block('pnephews', 'ابن الأخ لأب لا يرث مع وجود ابن/أخ/أب');
    }
    if (h.nephews > 0 && h.pnephews) block('pnephews', 'ابن الأخ الشقيق يحجب ابن الأخ لأب');

    if (maleDesc || h.father > 0 || h.brothers + h.pbrothers > 0 || h.nephews + h.pnephews > 0) {
      if (h.uncles) block('uncles', 'العمّ لا يرث مع وجود ابن أو أخ أو ابن أخ أو أب');
      if (h.puncles) block('puncles', 'العمّ لأب لا يرث مع وجود ابن أو أخ أو ابن أخ أو أب');
    }
    if (h.uncles > 0 && h.puncles) block('puncles', 'العمّ الشقيق يحجب العمّ لأب');

    if (maleDesc || h.father > 0 || h.brothers + h.pbrothers > 0 || h.nephews + h.pnephews > 0 || uncleTier) {
      if (h.cousins) block('cousins', 'ابن العمّ لا يرث مع وجود من هو أقرب منه');
      if (h.pcousins) block('pcousins', 'ابن العمّ لأب لا يرث مع وجود من هو أقرب منه');
    }
    if (h.cousins > 0 && h.pcousins) block('pcousins', 'ابن العمّ الشقيق يحجب ابن العمّ لأب');

    function alive(id) {
      if (!h[id]) return false;
      for (var k = 0; k < out.blocked.length; k++) if (out.blocked[k].id === id) return false;
      return true;
    }
    var hL = function (id) { return alive(id) ? h[id] : 0; };

    var sons = hL('sons'), daughters = hL('daughters');
    var gsons = hL('gsons'), gdaughters = hL('gdaughters');
    var brothers = hL('brothers'), sisters = hL('sisters');
    var pbrothers = hL('pbrothers'), psisters = hL('psisters');
    var father = hL('father'), grandfather = hL('grandfather'), mother = hL('mother');

    var descAlive = sons + daughters + gsons + gdaughters;
    var maleDescAlive = sons + gsons;
    var sibAlive = brothers + sisters + pbrothers + psisters + hL('mbrothers') + hL('msisters');

    /* ── 2) الفروض ────────────────────────────────────────────────── */
    var fard = {};   /* id → {f: fraction, why: ''} */
    function setF(id, f, why) { fard[id] = { f: f, why: why }; }

    if (hL('husband')) setF('husband', descAlive ? F(1, 4) : F(1, 2), descAlive ? 'وُجد فرع وارث' : 'لا فرع وارث');
    if (hL('wives')) setF('wives', descAlive ? F(1, 8) : F(1, 4), descAlive ? 'وُجد فرع وارث' : 'لا فرع وارث');

    /* العمريتان: زوج/زوجة + أب + أم (بلا فرع ولا جمع إخوة) */
    var umariyya = !descAlive && father > 0 && mother > 0 && sibAlive < 2 &&
      (hL('husband') || hL('wives'));

    if (mother) {
      if (descAlive || sibAlive >= 2) setF('mother', F(1, 6), descAlive ? 'وُجد فرع وارث' : 'وجود جمع من الإخوة');
      else if (umariyya) {
        var spouseF = hL('husband') ? F(1, 2) : F(1, 4);
        setF('mother', mul(sub(F(1, 1), spouseF), F(1, 3)), 'العمريّتان: ثلث الباقي بعد الزوج');
        step('مسألة عمريّة (غرّاء): الأم تأخذ ثلث الباقي بعد نصيب الزوج/الزوجة.');
      } else setF('mother', F(1, 3), 'لا فرع وارث ولا جمع إخوة');
    }

    var gmAlive = [];
    if (hL('gm_m')) gmAlive.push('gm_m');
    if (hL('gm_f')) gmAlive.push('gm_f');
    if (gmAlive.length) {
      gmAlive.forEach(function (g) { setF(g, F(1, 6), 'الجدة ترث السدس عند عدم الأم'); });
      if (gmAlive.length > 1) note('الجدة الواحدة أو أكثر تأخذ السدس (١/٦) مشتركًا بينهن بالتساوي.');
    }

    /* الأب */
    if (father) setF('father', F(1, 6), maleDescAlive ? 'فرض السدس لوجود فرع وارث ذكر' : 'السدس فرضًا + الباقي تعصيبًا');

    /* الجدّ */
    var gfWithSib = grandfather > 0 && sibAlive > 0;
    if (grandfather && !gfWithSib) setF('grandfather', F(1, 6), maleDescAlive ? 'فرض السدس لوجود فرع وارث ذكر' : 'السدس فرضًا + الباقي تعصيبًا');

    /* الأبناء */
    if (sons > 0) {
      if (daughters > 0) step('الأبناء والبنات عصبة: للابن ضعف نصيب البنت.');
    } else if (daughters > 0) {
      setF('daughters', daughters === 1 ? F(1, 2) : F(2, 3), daughters === 1 ? 'فرض البنت الواحدة' : 'فرض البنتين فصاعدًا (الثلثان)');
    }

    /* أبناء الابن */
    if (sons === 0) {
      if (gsons > 0) {
        if (gdaughters > 0) step('ابن الابن وبنت الابن عصبة: للذكر ضعف الأنثى.');
      } else if (gdaughters > 0) {
        if (daughters === 1) setF('gdaughters', F(1, 6), 'تكملة الثلثين مع بنت واحدة');
        else if (daughters >= 2) { block('gdaughters', 'البنتان فصاعدًا استغرقتا الثلثين'); gdaughters = 0; }
        else setF('gdaughters', gdaughters === 1 ? F(1, 2) : F(2, 3), 'فرض بنت الابن');
      }
    }

    /* الأشقاء */
    if (brothers > 0) {
      if (sisters > 0) step('الأخ الشقيق والأخت الشقيقة عصبة: للذكر ضعف الأنثى.');
    } else if (sisters > 0) {
      var sisterAsaba = (daughters + gdaughters) > 0 && mad !== 'shafii' && mad !== 'maliki';
      if (descAlive && sisterAsaba && maleDescAlive === 0) {
        step('الأخت الشقيقة عصبة مع الغير (مع البنت/بنت الابن) — عند الحنفية والحنابلة.');
        out.notes.push('الجمهور على خلاف في «عصبة مع الغير»، والنتيجة هنا على مذهب الحنفية/الحنابلة.');
      } else if (!descAlive) {
        setF('sisters', sisters === 1 ? F(1, 2) : F(2, 3), sisters === 1 ? 'فرض الأخت الواحدة' : 'فرض الأختين فصاعدًا');
      }
    }

    /* الأخوات لأب */
    if (pbrothers > 0) {
      if (psisters > 0) step('الأخ لأب والأخت لأب عصبة: للذكر ضعف الأنثى.');
    } else if (psisters > 0) {
      var pTaken = sisters > 0 ? (sisters === 1 ? F(1, 2) : F(2, 3)) : F(0, 1);
      if (sisters >= 2) { block('psisters', 'استغراق الأختين الشقيقتين الثلثين'); psisters = 0; }
      else if (sisters === 1) setF('psisters', F(1, 6), 'تكملة الثلثين مع الأخت الشقيقة');
      else if (descAlive) {
        if (mad === 'hanafi' || mad === 'hanbali') step('الأخت لأب عصبة مع الغير (مع البنت).');
      } else {
        setF('psisters', psisters === 1 ? F(1, 2) : F(2, 3), 'فرض الأخت لأب');
      }
    }

    /* الإخوة لأم */
    var mLive = hL('mbrothers') + hL('msisters');
    if (mLive > 0) setF('maternal', mLive === 1 ? F(1, 6) : F(1, 3), mLive === 1 ? 'فرض الواحد من الإخوة لأم' : 'فرض الاثنين فصاعدًا من الإخوة لأم');

    /* ── 3) العصبة ─────────────────────────────────────────────────── */
    out.base = 1;
    var sumF = F(0, 1);
    Object.keys(fard).forEach(function (k) { sumF = add(sumF, fard[k].f); });

    var residue = sub(F(1, 1), sumF);
    var asaba = null;

    /* الأكدرية: زوج + أم + جد + أخت شقيقة (بلا غيرهم) */
    var akdariyya = akdariyyaCase;

    if (akdariyya) {
      out.shares = []; fard = {}; total = F(0, 1);
      note('مسألة الأكدرية: الزوج ٣/٨، الأم ١/٨، الجدّ والأخت يتقاسمان الباقي للذكر مثل حنظ الأنثيين (٢/٨ و٢/٨).');
      out.shares.push({ id: 'husband', name: 'الزوج', frac: F(3, 8), kind: 'fard', why: 'فرض الزوج' });
      out.shares.push({ id: 'mother', name: 'الأم', frac: F(1, 8), kind: 'fard', why: 'فرض الأم' });
      out.shares.push({ id: 'grandfather', name: 'الجدّ', frac: F(2, 8), kind: 'asaba', why: 'مقاسمة الأخت' });
      out.shares.push({ id: 'sisters', name: 'الأخت الشقيقة', frac: F(2, 8), kind: 'asaba', why: 'مقاسمة الجدّ' });
      out.base = 8;
      return finish(out, h, wasiyyaFrac);
    }

    function firstTier() {
      if (sons) return { id: 'sons', males: sons, females: daughters, f: fard.daughters ? fard.daughters.f : null, label: 'الأبناء' };
      if (gsons) return { id: 'gsons', males: gsons, females: gdaughters, f: fard.gdaughters ? fard.gdaughters.f : null, label: 'أبناء الابن' };
      if (father && !maleDescAlive) return { id: 'father', males: 1, females: 0, f: fard.father.f, label: 'الأب' };
      if (grandfather && !gfWithSib && !maleDescAlive) return { id: 'grandfather', males: 1, females: 0, f: fard.grandfather.f, label: 'الجدّ' };
      if (father) return null;
      if (brothers) return { id: 'brothers', males: brothers, females: sisters, f: fard.sisters ? fard.sisters.f : null, label: 'الأشقاء' };
      if (pbrothers) return { id: 'pbrothers', males: pbrothers, females: psisters, f: fard.psisters ? fard.psisters.f : null, label: 'الإخوة لأب' };
      if (hL('nephews')) return { id: 'nephews', males: hL('nephews'), females: 0, f: null, label: 'أبناء الأخ الشقيق' };
      if (hL('pnephews')) return { id: 'pnephews', males: hL('pnephews'), females: 0, f: null, label: 'أبناء الأخ لأب' };
      if (hL('uncles')) return { id: 'uncles', males: hL('uncles'), females: 0, f: null, label: 'الأعمام الأشقاء' };
      if (hL('puncles')) return { id: 'puncles', males: hL('puncles'), females: 0, f: null, label: 'الأعمام لأب' };
      if (hL('cousins')) return { id: 'cousins', males: hL('cousins'), females: 0, f: null, label: 'أبناء العم الأشقاء' };
      if (hL('pcousins')) return { id: 'pcousins', males: hL('pcousins'), females: 0, f: null, label: 'أبناء العم لأب' };
      return null;
    }

    var tier = firstTier();

    /* الجدّ مع الإخوة (غير الحنفية): المقاسمة أو ثلث الباقي أو السدس — الأفضل له */
    if (gfWithSib && (mad !== 'hanafi')) {
      var gfFard = F(1, 6);
      var resAfterParents = sub(F(1, 1), add(sumF, F(0, 1)));
      var optionShare = mul(sub(F(1, 1), sumF), mul(F(1, 3), F(1, 1)));
      var muq = null;
      var sibTotal = brothers + sisters + pbrothers + psisters;
      if (sibTotal > 0) {
        var heads = brothers * 2 + sisters * 2 + pbrothers * 2 + psisters;
        muq = mul(sub(F(1, 1), sumF), F(2 * 1 + 0, heads + 2)); /* الجد كذكر واحد */
      }
      var best = gfFard;
      var how = 'السدس';
      if (muq && cmp(muq, best) > 0) { best = muq; how = 'المقاسمة'; }
      var thirdRem = mul(sub(F(1, 1), sumF), F(1, 3));
      if (cmp(thirdRem, best) > 0) { best = thirdRem; how = 'ثلث الباقي'; }
      setF('grandfather', best, 'اختيار الأنفع للجدّ: ' + how + ' (عند الشافعية والمالكية والحنابلة)');
      sumF = add(sumF, best);
      residue = sub(F(1, 1), sumF);
      tier = firstTier();
    }

    if (tier) {
      /* لا تأخذ العصبة شيئًا إن استُغرقت الفروض */
      if (cmp(residue, F(0, 1)) > 0 || tier.f === null || tier.f === undefined) {
        if (tier.f && cmp(residue, F(0, 1)) > 0) {
          /* صاحب فرض + عصبة (الأب/الجد) */
          asaba = { id: tier.id, frac: residue, label: tier.label, mixed: false };
        } else if (!tier.f) {
          asaba = { id: tier.id, frac: residue.n > 0 ? residue : F(0, 1), label: tier.label, mixed: true, males: tier.males, females: tier.females };
        }
      }
    }

    /* عصبة مع الغير: الأخت الشقيقة/لأب مع البنت */
    if (!tier || (!asaba && cmp(residue, F(0, 1)) > 0)) {
      if (!sons && !gsons && !father && !grandfather) {
        var fs = hL('sisters'), ps = hL('psisters');
        if (fs && !brothers && cmp(residue, F(0, 1)) > 0 && (mad === 'hanafi' || mad === 'hanbali')) {
          asaba = { id: 'sisters', frac: residue, label: 'الأخت الشقيقة (عصبة مع الغير)', mixed: true, males: 0, females: fs };
          delete fard.sisters;
          note('الأخت الشقيقة أخذت الباقي عصبةً مع الغير لوجود البنت — على مذهب الحنفية والحنابلة.');
        } else if (ps && !pbrothers && cmp(residue, F(0, 1)) > 0 && (mad === 'hanafi' || mad === 'hanbali') && !fs) {
          asaba = { id: 'psisters', frac: residue, label: 'الأخت لأب (عصبة مع الغير)', mixed: true, males: 0, females: ps };
          delete fard.psisters;
        }
      }
    }

    /* ── 4) البناء ──────────────────────────────────────────────────── */
    var total = F(0, 1);
    Object.keys(fard).forEach(function (k) {
      var f = fard[k].f;
      if (!f || isZero(f)) return;
      var name = k === 'maternal' ? 'الإخوة لأم' : BY_ID[k].name;
      var heads = k === 'wives' ? h.wives : (k === 'maternal' ? (hL('mbrothers') + hL('msisters')) : (k === 'gm_m' || k === 'gm_f' ? 1 : 1));
      out.shares.push({ id: k, name: name, frac: f, kind: 'fard', why: fard[k].why, heads: heads, each: F(f.n, f.d * (heads || 1)) });
      total = add(total, f);
    });

    if (asaba && (asaba.id === 'father' || asaba.id === 'grandfather') && cmp(asaba.frac, F(0, 1)) > 0) {
      for (var qi = 0; qi < out.shares.length; qi++) {
        if (out.shares[qi].id === asaba.id) {
          out.shares[qi].frac = add(out.shares[qi].frac, asaba.frac);
          out.shares[qi].kind = 'fard+asaba';
          out.shares[qi].why = 'السدس فرضًا + الباقي تعصيبًا';
          total = add(total, asaba.frac);
          asaba = null;
          break;
        }
      }
    }
    if (asaba && cmp(asaba.frac, F(0, 1)) > 0) {
      if (asaba.id === 'sons' || asaba.id === 'gsons' || asaba.id === 'brothers' || asaba.id === 'pbrothers') {
        /* ذكور وإناث: للذكر مثل حظ الأنثيين */
        var maleHeads = asaba.males, femaleHeads = asaba.females || 0;
        var unit = 2 * maleHeads + femaleHeads;
        var femaleId = { sons: 'daughters', gsons: 'gdaughters', brothers: 'sisters', pbrothers: 'psisters' }[asaba.id];
        var femaleName = femaleId ? BY_ID[femaleId].name : 'الإناث';
        if (unit > 0) {
          var per = mul(asaba.frac, F(1, unit));
          if (maleHeads) out.shares.push({ id: asaba.id, name: BY_ID[asaba.id].name, frac: mul(per, F(2 * maleHeads, 1)), kind: 'asaba', heads: maleHeads, each: mul(per, F(2, 1)), why: 'تعصيب: للذكر مثل حظ الأنثيين' });
          if (femaleHeads) out.shares.push({ id: femaleId || (asaba.id + '_f'), name: femaleName, frac: mul(per, F(femaleHeads, 1)), kind: 'asaba', heads: femaleHeads, each: per, why: 'تعصيب' });
        }
        total = add(total, asaba.frac);
      } else {
        out.shares.push({ id: asaba.id, name: asaba.label, frac: asaba.frac, kind: 'asaba', why: 'الباقي تعصيبًا' });
        total = add(total, asaba.frac);
      }
    }

    /* ── 5) العول والردّ ────────────────────────────────────────────── */
    out.base = 1;
    out.shares.forEach(function (s) { out.base = lcm(out.base, s.frac.d); });

    if (cmp(total, F(1, 1)) > 0) {
      out.awl = true;
      note('المسألة عالت: مجموع الفروض ' + fmt(total) + '، فيُزاد أصل المسألة بقدر المجموع.');
    } else if (cmp(total, F(1, 1)) < 0) {
      var rest = sub(F(1, 1), total);
      out.remainder = rest;
      var nonSpouse = out.shares.filter(function (s) { return s.id !== 'husband' && s.id !== 'wives'; });
      var hasAsaba = out.shares.some(function (s) { return s.kind === 'asaba'; });
      if (!hasAsaba && nonSpouse.length && mad !== 'shafii') {
        var denom = nonSpouse.reduce(function (a, s) { return add(a, s.frac); }, F(0, 1));
        nonSpouse.forEach(function (s) {
          var extra = mul(rest, F(s.frac.n * denom.d, s.frac.d * denom.n));
          s.frac = add(s.frac, extra);
        });
        out.radd = true;
        note('لم يستغرق أصحاب الفروض التركة، فرُدّ الباقي عليهم بنسبة فروضهم (الردّ) — والباقي بعد ذلك لبيت المال إن وُجد.');
      } else if (hasAsaba) {
        /* العصبة أخذت الباقي */
      } else if (nonSpouse.length === 0 && out.shares.length) {
        note('لم يوجد إلا الزوج/الزوجة: الباقي لبيت المال أو لذوي الأرحام عند الحنفية.');
      }
    }

    if (!out.shares.length && out.blocked.length) {
      note('كل الورثة المذكورين محجوبون — عند الحنفية يذهب الباقي لذوي الأرحام ثم بيت المال.');
    }

    return finish(out, h, wasiyyaFrac);
  }

  function lcm(a, b) { return a / gcd(a, b) * b; }

  function finish(out, h, wasiyyaFrac) {
    var den = 1;
    out.shares.forEach(function (s) { den = lcm(den, s.frac.d); });
    out.shares.forEach(function (s) { s.n = s.frac.n * (den / s.frac.d); });
    var sum = out.shares.reduce(function (a, s) { return a + s.n; }, 0);
    out.sumN = sum;
    out.den = den;
    out.base = sum > den ? sum : den;
    out.awlTo = sum > den ? sum : null;
    out.netEstate = 1 - val(wasiyyaFrac || F(0, 1));
    out.shares.forEach(function (s) {
      s.frac = F(s.n, out.base);
      s.pct = Math.round(s.n / out.base * 10000) / 100;
      s.fracOfEstate = out.netEstate * s.n / out.base;
      s.fracTxt = s.n + '/' + out.base;
      s.fracAr = AR(s.n) + (out.base === 1 ? '' : '/' + AR(out.base));
    });
    out.totalPct = Math.round(sum / out.base * 10000) / 100;
    return out;
  }

  window.Mirath = {
    HEIRS: HEIRS,
    MADHHABS: MADHHABS,
    calculate: calculate,
    fmt: fmt,
    value: val,
    _frac: F
  };
})();
