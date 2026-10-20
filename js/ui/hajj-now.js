/* ═══════════════════════════════════════════════════════════════════════════
   زاد — «أين أنا في الحجّ الآن؟» (js/ui/hajj-now.js)
   ─────────────────────────────────────────────────────────────────────────
   يحدّد موضعك في العشر الأولى من ذي الحجة اعتمادًا على التقويم الهجري
   المحسوب محليًا (Intl — يعمل بلا شبكة)، ويُعطي كل صفحة:
     • ZadHajj.phase()            → { inSeason, day, label, hint, stage[] }
     • ZadHajj.dhulDay()          → 1..13 أو null
     • ZadHajj.nextGreg(12, 9)    → تاريخ أقرب عرفة قادمة
     • ZadHajj.nextArafah()/nextNahr()
     • ZadHajj.daysTo(date)       → عدد الأيام (تقويم ميلادي)
     • ZadHajj.hijriOf(date)      → { y, m, d }

   لا يعتمد على app.js ولا على أي ملف آخر، ولا يلمس التخزين.
   ═══════════════════════════════════════════════════════════════════════════ */
(function (global) {
  'use strict';

  const DHUL = 12;

  function hijriOf(date) {
    try {
      const f = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', {
        day: 'numeric', month: 'numeric', year: 'numeric',
      });
      const p = f.formatToParts(date || new Date());
      const g = t => parseInt(p.find(x => x.type === t).value, 10);
      const out = { y: g('year'), m: g('month'), d: g('day') };
      return (out.y && out.m && out.d) ? out : null;
    } catch (e) { return null; }
  }

  function startOfDay(d) {
    const x = new Date(d || new Date());
    x.setHours(0, 0, 0, 0);
    return x;
  }

  function daysTo(date) {
    if (!date) return null;
    return Math.round((startOfDay(date) - startOfDay(new Date())) / 86400000);
  }

  /* أقرب يوم هجري (شهر/يوم) ابتداءً من اليوم — بحثٌ أمامي حتى 400 يوم */
  function nextGreg(month, day) {
    const base = startOfDay(new Date());
    for (let i = 0; i <= 420; i++) {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      const h = hijriOf(d);
      if (h && h.m === month && h.d === day) return d;
    }
    return null;
  }

  const nextArafah = () => nextGreg(DHUL, 9);
  const nextNahr = () => nextGreg(DHUL, 10);

  /* خريطة اليوم → المراحل المرشّحة في مناسك الحج */
  const STAGE_FOR = {
    8: ['t_hajj_ihram', 'tarwiyah'],
    9: ['arafah'],
    10: ['t_nahr', 'q_nahr', 'i_nahr'],
    11: ['tashreeq', 'jamarat'],
    12: ['tashreeq', 'jamarat'],
    13: ['tashreeq', 'jamarat'],
  };

  const PHASE = {
    1: { label: 'غرة ذي الحجة', hint: 'بدأت العشر — اجعلها خيرَ عشرٍ في عامك.' },
    2: { label: 'اليوم الثاني', hint: 'أكثِر من التكبير والتهليل والتحميد.' },
    3: { label: 'اليوم الثالث', hint: 'صم وصدّق — العملُ فيها مضاعف.' },
    4: { label: 'اليوم الرابع', hint: 'جدّد النية وتقرّب إلى الله بصدقةٍ خفية.' },
    5: { label: 'اليوم الخامس', hint: 'راجع أحكام مناسكك قبل السفر.' },
    6: { label: 'اليوم السادس', hint: 'أضِف وردًا من القرآن قبل الازدحام.' },
    7: { label: 'اليوم السابع', hint: 'غدًا التروية — جهّز إحرامك وحاجتك.' },
    8: { label: 'يوم التروية', hint: 'الإحرام بالحج والانطلاق إلى منى — قصرٌ بلا جمع.' },
    9: { label: 'يوم عرفة', hint: 'الركن الأعظم — تفرّغ للدعاء من الزوال إلى الغروب.' },
    10: { label: 'يوم النحر', hint: 'رمي جمرة العقبة، هَدي، حلق، طواف الإفاضة.' },
    11: { label: 'أول أيام التشريق', hint: 'الرمي بعد الزوال: الصغرى فالوسطى فالكبرى.' },
    12: { label: 'ثاني أيام التشريق', hint: 'الرمي بعد الزوال — ومن تعجّل نفَر قبل الغروب.' },
    13: { label: 'آخر أيام التشريق', hint: 'آخر وقتٍ للرمي — ثم طواف الوداع.' },
  };

  function phase() {
    const h = hijriOf(new Date());
    if (!h) return { ok: false, inSeason: false };
    const day = (h.m === DHUL && h.d >= 1 && h.d <= 13) ? h.d : null;
    if (day) {
      const p = PHASE[day] || {};
      return {
        ok: true, inSeason: true, day, year: h.y, hijri: h,
        label: p.label || 'أيام ذي الحجة',
        hint: p.hint || '',
        stages: STAGE_FOR[day] || [],
        arafahIn: 9 - day,
        isArafah: day === 9,
        isNahr: day === 10,
      };
    }
    /* خارج العشر: أقرب عرفة قادمة */
    const arafah = nextArafah();
    const nahr = nextNahr();
    const first = arafah ? new Date(arafah) : null;
    if (first) first.setDate(first.getDate() - 8); /* 1 ذو الحجة */
    return {
      ok: true, inSeason: false, hijri: h,
      arafah, nahr,
      daysToArafah: daysTo(arafah),
      daysToDhul: daysTo(first),
      label: 'لسنا في أيام الحج الآن',
      hint: 'يبدأ موسم العشر مع أول ذي الحجة — استعدّ من الآن.',
    };
  }

  function dhulDay() {
    const h = hijriOf(new Date());
    return (h && h.m === DHUL && h.d >= 1 && h.d <= 13) ? h.d : null;
  }

  global.ZadHajj = {
    DHUL, hijriOf, startOfDay, daysTo, nextGreg, nextArafah, nextNahr,
    phase, dhulDay, STAGE_FOR,
  };
})(typeof window !== 'undefined' ? window : globalThis);
