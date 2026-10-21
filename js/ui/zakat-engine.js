/* ═══════════════════════════════════════════════════════════════════════════
   زاد — محرّك الزكاة الموحّد (js/ui/zakat-engine.js)
   ─────────────────────────────────────────────────────────────────────────
   كل حسابات الزكاة في التطبيق تمرّ من هنا: دالّات نقيّة (بلا DOM) + تخزين
   محلي بلا أي اعتماد على شبكة أو CDN. يعمل أوفلاين من أول ثانية.

   المرجعيات الشرعية المستخدمة:
   • نصاب الذهب 85 جم (20 مثقالاً × 4.25 جم) — نصاب الفضة 595 جم (200 درهم).
   • المقدار ربع العشر = 2.5% للسنة الهجرية، و2.577% للسنة الشمسية (تصحيح
     فرق 365/354) — قولٌ معتبر عند من يزكّي حسب السنة الميلادية.
   • نصاب الزروع 5 أوسق = 300 صاع ≈ 653 كجم، والعشر أو نصفه بحسب كلفة السقي.
   • زكاة الفطر صاعٌ من غالب قوت البلد ≈ 2.5 كجم للفرد (تقديرٌ فقهي شائع).

   واجهة الاستخدام:
     ZadZakat.pool(assets)      → { goldVal, silverVal, gross, net }
     ZadZakat.nisab({...})      → { gold, silver, value, basis }
     ZadZakat.due({...})        → { meets, due, rate }
     ZadZakat.hawl('2026-03-01')→ { endISO, daysLeft, passed, ... }
     ZadZakat.fitr(5, 60)       → { kg, amount }
     ZadZakat.crops(1200, true) → { rate, dueKg, meets }
     ZadZakat.livestock('sheep', 45) → { due, desc }
     ZadZakat.load() / save(patch) / addHistory(entry) / history()
     ZadZakat.ics({...})        → نص ملف تقويم لتنزيل تذكير الحول
   ═══════════════════════════════════════════════════════════════════════════ */
(function (global) {
  'use strict';

  const CONST = {
    GOLD_NISAB_G: 85,
    SILVER_NISAB_G: 595,
    RATE_LUNAR: 2.5,
    RATE_SOLAR: 2.577,
    CROPS_NISAB_KG: 653,
    FITR_KG: 2.5,
    STORE_KEY: 'zad_zakat_v3',
    LEGACY_KEY: 'zad_v2',
  };

  const ASSET_KEYS = ['gold', 'silver', 'cash', 'stocks', 'funds', 'trade'];
  const FIELD_IDS = ['gold-g', 'gold-p', 'silver-g', 'silver-p', 'cash', 'stocks', 'funds', 'trade', 'debts'];

  function n(v) {
    const x = parseFloat(v);
    return isFinite(x) && x > 0 ? x : 0;
  }

  /* ── 1. الوعاء الزكوي ─────────────────────────────────────────────────── */
  function pool(a) {
    a = a || {};
    const goldVal = n(a.goldG) * n(a.goldP);
    const silverVal = n(a.silverG) * n(a.silverP);
    const cash = n(a.cash), stocks = n(a.stocks), funds = n(a.funds), trade = n(a.trade);
    const gross = goldVal + silverVal + cash + stocks + funds + trade;
    const net = Math.max(0, gross - n(a.debts));
    return { goldVal, silverVal, gross, net };
  }

  /* ── 2. النصاب ────────────────────────────────────────────────────────────
     الأدنى من نصاب الذهب والفضة أرفق بالفقراء وهو المعتمد عند الجمهور
     (لأن نصاب الفضة — 595 جم — أقلّ قيمةً من نصاب الذهب في العادة). */
  function nisab(o) {
    o = o || {};
    const goldP = n(o.goldPrice), silverP = n(o.silverPrice);
    const gold = goldP ? CONST.GOLD_NISAB_G * goldP : null;
    const silver = silverP ? CONST.SILVER_NISAB_G * silverP : null;
    let value = null, basis = o.basis || 'lower';
    if (basis === 'gold' && gold != null) value = gold;
    else if (basis === 'silver' && silver != null) value = silver;
    else if (gold != null && silver != null) { value = Math.min(gold, silver); basis = gold <= silver ? 'gold' : 'silver'; }
    else if (gold != null) { value = gold; basis = 'gold'; }
    else if (silver != null) { value = silver; basis = 'silver'; }
    else { value = null; basis = null; }
    return { gold, silver, value, basis };
  }

  /* ── 3. الزكاة المستحقة ───────────────────────────────────────────────── */
  function due(o) {
    o = o || {};
    const p = n(o.pool), nisabV = o.nisab == null ? null : n(o.nisab);
    const rate = o.rate === CONST.RATE_SOLAR ? CONST.RATE_SOLAR : CONST.RATE_LUNAR;
    const hasHawl = o.hawlPassed !== false; /* undefined = لا تُحجب افتراضًا */
    const meets = nisabV != null && p >= nisabV && p > 0;
    return {
      meets,
      rate,
      due: meets && hasHawl ? p * (rate / 100) : 0,
      owesButHawl: meets && !hasHawl,
      short: nisabV != null ? Math.max(0, nisabV - p) : 0,
    };
  }

  /* ── 4. الحول (سنة هجرية كاملة) ────────────────────────────────────────── */
  function hijriParts(date) {
    try {
      const f = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', {
        day: 'numeric', month: 'numeric', year: 'numeric', timeZone: 'UTC',
      });
      const p = f.formatToParts(date);
      const g = t => parseInt(p.find(x => x.type === t).value, 10);
      const out = { y: g('year'), m: g('month'), d: g('day') };
      return (out.y && out.m && out.d) ? out : null;
    } catch (e) { return null; }
  }

  /* تحويل هجري → ميلادي بالبحث حول تقدير أوّلي (±45 يومًا) */
  function hijriToGreg(y, m, d) {
    const est = Date.UTC(2026, 4, 18) + Math.round(((y - 1447) * 354.367 + (m - 12) * 29.53 + (d - 1)) * 86400000);
    for (let off = -45; off <= 45; off++) {
      const dt = new Date(est + off * 86400000);
      const h = hijriParts(dt);
      if (h && h.y === y && h.m === m && h.d === d) return dt;
    }
    return new Date(est);
  }

  function parseISO(s) {
    if (!s) return null;
    const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(s));
    if (!m) return null;
    const d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
    return isNaN(d) ? null : d;
  }
  function toISO(d) { return d ? d.toISOString().slice(0, 10) : null; }

  function hawl(startISO, todayISO) {
    const start = parseISO(startISO);
    if (!start) return { ok: false, endISO: null, daysLeft: null, passed: false };
    const today = parseISO(todayISO) || parseISO(toISO(new Date()));
    let end;
    const h = hijriParts(start);
    if (h) end = hijriToGreg(h.y + 1, h.m, h.d);
    else { end = new Date(start); end.setUTCDate(end.getUTCDate() + 354); }
    const daysLeft = Math.ceil((end - today) / 86400000);
    return {
      ok: true,
      startISO: toISO(start),
      endISO: toISO(end),
      hijriStart: h,
      hijriEnd: hijriParts(end),
      daysLeft,
      passed: daysLeft <= 0,
      pct: Math.max(0, Math.min(100, Math.round((1 - daysLeft / 354) * 100))),
    };
  }

  /* ── 5. زكاة الفطر ────────────────────────────────────────────────────── */
  function fitr(heads, pricePerKg, kgPerSa) {
    const h = Math.max(0, parseInt(heads, 10) || 0);
    const kg = n(kgPerSa) || CONST.FITR_KG;
    const price = n(pricePerKg);
    return { heads: h, kgPerHead: kg, totalKg: h * kg, amount: h * kg * price };
  }

  /* ── 6. الزروع والثمار ────────────────────────────────────────────────── */
  function crops(kg, irrigated) {
    const w = n(kg);
    const rate = irrigated ? 5 : 10;
    const meets = w >= CONST.CROPS_NISAB_KG;
    return {
      kg: w, rate, meets,
      dueKg: meets ? w * (rate / 100) : 0,
      shortKg: Math.max(0, CONST.CROPS_NISAB_KG - w),
      nisabKg: CONST.CROPS_NISAB_KG,
    };
  }

  /* ── 7. الأنعام (جداول مختصرة حتى 120) ────────────────────────────────── */
  const LIVESTOCK = {
    sheep: {
      name: 'الغنم (شياه/ماعز)',
      rows: [
        [40, 120, 1, 'شاة'], [121, 200, 2, 'شاتان'], [201, 399, 3, 'ثلاث شياه'],
      ],
      rule: c => c >= 400 ? Math.floor(c / 100) + ' شياه (شاةٌ لكل مئة)' : null,
      unit: 'شاة',
    },
    cow: {
      name: 'البقر',
      rows: [
        [30, 39, 1, 'تبيع'], [40, 59, 1, 'مسنة'], [60, 69, 2, 'تبيعان'],
        [70, 79, 2, 'تبيع + مسنة'], [80, 89, 2, 'مسنتان'], [90, 99, 3, 'ثلاثة تبايع'],
        [100, 119, 3, 'تبيع + مسنتان'], [120, 120, 4, 'تبيعان + مسنتان'],
      ],
      rule: null,
      unit: '',
    },
    camel: {
      name: 'الإبل',
      rows: [
        [5, 24, 1, 'شاة'], [25, 35, 1, 'بنت مخاض'], [36, 45, 1, 'بنت لبون'],
        [46, 60, 1, 'حقة'], [61, 75, 1, 'جذعة'], [76, 90, 2, 'بنتا لبون'],
        [91, 120, 2, 'حقتان'],
      ],
      rule: null,
      unit: '',
    },
  };

  function livestock(kind, count) {
    const t = LIVESTOCK[kind];
    const c = Math.max(0, parseInt(count, 10) || 0);
    if (!t) return { ok: false, due: 0, desc: 'نوع غير معروف' };
    if (c <= 0) return { ok: true, due: 0, desc: 'أدخِل عدد الأنعام', unit: t.unit };
    for (const [lo, hi, qty, label] of t.rows) {
      if (c >= lo && c <= hi) return { ok: true, due: qty, desc: 'فيها ' + label, unit: t.unit, kind: t.name };
    }
    if (t.rule) {
      const r = t.rule(c);
      if (r) return { ok: true, due: null, desc: r, unit: t.unit, kind: t.name };
    }
    return {
      ok: true, due: 0, kind: t.name, unit: t.unit,
      desc: c < t.rows[0][0] ? 'دون النصاب — لا زكاة' : 'فوق الجدول المختصر — يُراجع فيه أهل العلم',
    };
  }

  /* ── 8. التخزين المحلي (أوفلاين دائمًا) ───────────────────────────────── */
  function readRaw() {
    try { return JSON.parse(global.localStorage.getItem(CONST.STORE_KEY) || '{}') || {}; }
    catch (e) { return {}; }
  }
  function writeRaw(o) {
    try { global.localStorage.setItem(CONST.STORE_KEY, JSON.stringify(o)); return true; }
    catch (e) { return false; }
  }

  function defaults() {
    return {
      cur: 'ج.م', rate: CONST.RATE_LUNAR, basis: 'lower',
      assets: { goldG: '', goldP: '', silverG: '', silverP: '', cash: '', stocks: '', funds: '', trade: '', debts: '' },
      hawlStart: '', fitrHeads: '', fitrPrice: '', history: [], updatedAt: 0,
    };
  }

  /* ترحيل لطيف من zad_v2.zakat القديم حتى لا يفقد المستخدم أرقامه */
  function migrate() {
    try {
      const legacy = JSON.parse(global.localStorage.getItem(CONST.LEGACY_KEY) || '{}');
      const z = legacy && legacy.zakat;
      if (!z) return null;
      const a = {};
      a.goldG = z['gold-g'] || ''; a.goldP = z['gold-p'] || '';
      a.silverG = z['silver-g'] || ''; a.silverP = z['silver-p'] || '';
      a.cash = z.cash || ''; a.stocks = z.stocks || ''; a.funds = z.funds || '';
      a.trade = z.trade || ''; a.debts = z.debts || '';
      const rate = parseFloat(z.rate) === CONST.RATE_SOLAR ? CONST.RATE_SOLAR : CONST.RATE_LUNAR;
      return { cur: z.cur || 'ج.م', rate, assets: a };
    } catch (e) { return null; }
  }

  function load() {
    const d = defaults();
    const raw = readRaw();
    const out = Object.assign(d, raw);
    out.assets = Object.assign(d.assets, raw.assets || {});
    out.history = Array.isArray(raw.history) ? raw.history : [];
    if (!raw.updatedAt) {
      const mig = migrate();
      if (mig) {
        out.cur = mig.cur; out.rate = mig.rate; out.assets = Object.assign(d.assets, mig.assets);
        out.migrated = true;
      }
    }
    return out;
  }

  function save(patch) {
    const cur = load();
    const next = Object.assign({}, cur, patch || {}, { updatedAt: Date.now() });
    if (patch && patch.assets) next.assets = Object.assign({}, cur.assets, patch.assets);
    writeRaw(next);
    return next;
  }

  function reset() {
    try { global.localStorage.removeItem(CONST.STORE_KEY); } catch (e) {}
  }

  function addHistory(entry) {
    const st = load();
    const row = Object.assign({
      id: 'z' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      date: toISO(new Date()),
      ts: Date.now(),
    }, entry || {});
    const hist = [row].concat(st.history).slice(0, 20);
    writeRaw(Object.assign({}, st, { history: hist, updatedAt: Date.now() }));
    return row;
  }

  function history() { return load().history || []; }

  function clearHistory() {
    const st = load();
    writeRaw(Object.assign({}, st, { history: [], updatedAt: Date.now() }));
  }

  /* ── 9. تنسيق + ملف تقويم (تذكير الحول) ───────────────────────────────── */
  function fmt(v, cur) {
    const num = Math.round((+v || 0) * 100) / 100;
    try {
      return num.toLocaleString('ar-EG', { maximumFractionDigits: 2 }) + (cur ? ' ' + cur : '');
    } catch (e) { return String(num) + (cur ? ' ' + cur : ''); }
  }

  function ics(o) {
    o = o || {};
    const date = (o.dateISO || toISO(new Date())).replace(/-/g, '');
    const summary = o.title || 'زكاة مالي — انتهى الحول';
    const desc = (o.desc || 'مرّ عام هجري على مالك البالغ النصاب — أخرج زكاتك.').replace(/\n/g, '\\n');
    const stamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    return [
      'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//ZAD//Zakat//AR',
      'CALSCALE:GREGORIAN', 'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      'UID:zad-zakat-' + date + '-' + Math.random().toString(36).slice(2, 8) + '@zad',
      'DTSTAMP:' + stamp,
      'DTSTART;VALUE=DATE:' + date,
      'DTEND;VALUE=DATE:' + date,
      'SUMMARY:' + summary,
      'DESCRIPTION:' + desc,
      'BEGIN:VALARM', 'TRIGGER:-P1D', 'ACTION:DISPLAY', 'DESCRIPTION:' + summary, 'END:VALARM',
      'END:VEVENT', 'END:VCALENDAR',
    ].join('\r\n');
  }

  global.ZadZakat = {
    CONST, ASSET_KEYS, FIELD_IDS,
    pool, nisab, due, hawl, fitr, crops, livestock,
    LIVESTOCK,
    load, save, reset, addHistory, history, clearHistory, migrate,
    fmt, ics, hijriParts, hijriToGreg,
    _n: n,
  };
})(typeof window !== 'undefined' ? window : globalThis);
