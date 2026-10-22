/* ══════════════════════════════════════════════════════════════════════════
   زاد — رفيق الورد والحلقة (شخصان، لا فيد عام)
   ──────────────────────────────────────────────────────────────────────────
   • لا خادم، لا حساب، لا اجتماع. البطاقة تنتقل بينكما يدويًا (رابط/نص).
   • الخصوصية: لا يُرسَل إلا ما تُكتبه أنت: الاسم المستعار، الهدف، عدد أيام
     الالتزام، وملاحظة قصيرة. لا آياتك ولا صفحاتك ولا تفاصيل عبادتك.
   • الدور: peer (رفيقان) | teacher | student (حلقة).

   الواجهة العامة (window.ZadWird):
     create({role, name, goal})     → يبدأ حلقة/رفقة على هذا الجهاز
     card()                         → نص البطاقة القابل للمشاركة
     accept(text)                   → يستقبل بطاقة الطرف الآخر
     markDone()                     → يسجّل وردك اليوم
     setGoal(amount, unit)          → يغيّر الورد اليومي
     stats()                        → {streak, done7, partner}
     mount(el, opts)                → يرسم البطاقة
     reset()                        → يمسح كل شيء
   ══════════════════════════════════════════════════════════════════════════ */
(function (global) {
  'use strict';
  if (global.ZadWird) return;

  var KEY = 'zad_wird_v1';
  var UNITS = { ayah: 'آية', page: 'صفحة', minute: 'دقيقة', juz: 'جزء' };
  var ROLES = {
    peer:    { me: 'أنا',     other: 'رفيق الورد', icon: '🤝' },
    teacher: { me: 'المعلّم', other: 'الطالب',     icon: '🧑‍🏫' },
    student: { me: 'الطالب',  other: 'المعلّم',    icon: '🧑‍🎓' }
  };

  /* ── أدوات ─────────────────────────────────────────────────────── */
  function today() { var d = new Date(); return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function dayOffset(k) { var d = new Date(); d.setDate(d.getDate() - k); return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function initial() {
    return { role: null, name: '', goal: { amount: 5, unit: 'ayah' }, partner: null, log: {}, notes: [] };
  }
  function read() {
    var s;
    try { s = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { s = null; }
    if (!s || typeof s !== 'object') s = initial();
    if (!s.log || typeof s.log !== 'object') s.log = {};
    if (!s.goal) s.goal = { amount: 5, unit: 'ayah' };
    if (!s.notes) s.notes = [];
    return s;
  }
  function write(s) {
    try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {}
    try { if (global.dispatchEvent) global.dispatchEvent(new CustomEvent('zad:wird', { detail: s })); } catch (e) {}
  }
  function streakOf(log, who) {
    var n = 0;
    for (var i = 0; i < 400; i++) {
      var d = dayOffset(i), e = log[d];
      if (e && e[who]) n++; else if (i === 0) continue; else break;
    }
    return n;
  }
  function ar(n) { return String(n).replace(/[0-9]/g, function (d) { return '٠١٢٣٤٥٦٧٨٩'[+d]; }); }
  var WD = ['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س']; /* أحد … سبت */
  function agoText(at) {
    if (!at) return '—';
    var days = Math.floor((Date.now() - at) / 86400000);
    if (days <= 0) return 'اليوم';
    if (days === 1) return 'أمس';
    if (days === 2) return 'قبل يومين';
    return 'قبل ' + ar(days) + ' أيام';
  }
  function dayLabel(offset) { var d = new Date(); d.setDate(d.getDate() - offset); return WD[d.getDay()]; }
  function goalText(g) {
    g = g || { amount: 5, unit: 'ayah' };
    var u = UNITS[g.unit] || 'آية';
    return ar(g.amount) + ' ' + (g.amount === 1 ? u : (u === 'آية' ? 'آيات' : u === 'صفحة' ? 'صفحات' : u === 'دقيقة' ? 'دقائق' : 'أجزاء'));
  }
  function esc(t) { return String(t == null ? '' : t).replace(/[&<>"']/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]; }); }

  /* ── ترميز البطاقة: ZADW1.<base64url(JSON)> ──────────────────────── */
  function b64e(str) {
    try { return btoa(unescape(encodeURIComponent(str))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); }
    catch (e) { return ''; }
  }
  function b64d(str) {
    try {
      str = str.replace(/-/g, '+').replace(/_/g, '/');
      while (str.length % 4) str += '=';
      return decodeURIComponent(escape(atob(str)));
    } catch (e) { return ''; }
  }
  function makeCard(s) {
    var payload = {
      v: 1, n: (s.name || '').slice(0, 24), r: s.role, g: s.goal,
      st: streakOf(s.log, 'me'), d: (s.log[today()] && s.log[today()].me) ? 1 : 0,
      note: (s.partner && s.partner.note) ? String(s.partner.note).slice(0, 120) : ''
    };
    return 'ZADW1.' + b64e(JSON.stringify(payload));
  }
  function parseCard(text) {
    var m = String(text || '').replace(/\s+/g, ' ').trim().match(/ZADW1\.[A-Za-z0-9_-]+/);
    if (!m) return null;
    var j = b64d(m[0].slice(6));
    if (!j) return null;
    try {
      var o = JSON.parse(j);
      if (!o || !o.n) return null;
      return o;
    } catch (e) { return null; }
  }

  /* ── التنفيذ ────────────────────────────────────────────────────── */
  var API = {
    read: read,

    create: function (opts) {
      var s = read();
      s.role = (opts && opts.role) || 'peer';
      s.name = String((opts && opts.name) || '').trim().slice(0, 24) || 'أنا';
      if (opts && opts.goal) s.goal = opts.goal;
      s.partner = null; s.notice = '';
      write(s);
      return s;
    },

    setGoal: function (amount, unit) {
      var s = read();
      amount = Math.max(1, Math.min(604, parseInt(amount, 10) || 5));
      s.goal = { amount: amount, unit: UNITS[unit] ? unit : 'ayah' };
      write(s);
      return s;
    },

    markDone: function () {
      var s = read();
      var d = today();
      s.log[d] = s.log[d] || {};
      s.log[d].me = true;
      write(s);
      return s;
    },

    unmarkDone: function () {
      var s = read();
      var d = today();
      if (s.log[d]) delete s.log[d].me;
      write(s);
      return s;
    },

    card: function () { return makeCard(read()); },

    invite: function () {
      var s = read();
      var base = location.origin + location.pathname.replace(/[^/]*$/, '') + 'wird.html';
      return base + '?w=' + encodeURIComponent(makeCard(s));
    },

    accept: function (text) {
      var o = parseCard(text);
      if (!o) return null;
      var s = read();
      s.partner = {
        name: o.n, role: o.r || 'peer', goal: o.g || null,
        streak: o.st || 0, doneToday: !!o.d, note: o.note || '',
        at: Date.now()
      };
      /* أول بطاقة تستلمها تحدد دورك المقابل؛ بعدها يبقى دورك كما اخترته */
      s.notice = 'وصلتك دعوة من ' + o.n + ' — اسمك لم يُرسل بعد، أكمل بياناتك ثم أرسل بطاقتك.';
      if (!s.role || !s.partner || s.partner.name !== o.n) {
        if (!s.role) s.role = o.r === 'teacher' ? 'student' : o.r === 'student' ? 'teacher' : 'peer';
      }
      write(s);
      return s.partner;
    },

    note: function (txt) {
      var s = read();
      s.partner = s.partner || {};
      s.partner.note = String(txt || '').slice(0, 120);
      write(s);
      return s;
    },

    stats: function () {
      var s = read();
      var done7 = 0;
      for (var i = 0; i < 7; i++) { var e = s.log[dayOffset(i)]; if (e && e.me) done7++; }
      return { streak: streakOf(s.log, 'me'), done7: done7, role: s.role, partner: s.partner };
    },

    reset: function () { try { localStorage.removeItem(KEY); } catch (e) {} write(initial()); },

    _today: today,
    _streak: function (who) { return streakOf(read().log, who || 'me'); }
  };

  /* ══ واجهة الرسم ═══════════════════════════════════════════════════ */
  function css() {
    if (document.getElementById('zad-wird-css')) return;
    var st = document.createElement('style');
    st.id = 'zad-wird-css';
    st.textContent = [
      '.wird-card{background:var(--card,#fff);border:1px solid var(--border,#e5e0d5);border-radius:18px;padding:16px 15px;margin:14px 0;box-shadow:0 2px 10px rgba(0,0,0,.04)}',
      'html[data-theme="dark"] .wird-card,html[data-theme="oled"] .wird-card{background:#161a17;border-color:#2a302c}',
      '.wd-h{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:4px}',
      '.wd-h b{font-size:15px;font-weight:900;color:var(--ink,#16302a)}',
      '.wd-h span{font-size:10.5px;color:var(--muted,#7a8a84);font-weight:700}',
      '.wd-sub{font-size:11.5px;color:var(--muted,#7a8a84);line-height:1.85;margin:0 0 12px}',
      '.wd-roles{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin:10px 0}',
      '.wd-role{border:1.5px solid var(--border,#e5e0d5);background:var(--sand,#faf7f0);border-radius:14px;padding:13px 10px;cursor:pointer;text-align:center;transition:.15s;font-family:inherit}',
      '.wd-role:hover{border-color:var(--green-soft,#7fb6a0)}',
      '.wd-role.on{border-color:var(--green-deep,#0e3b2e);background:rgba(14,59,46,.07)}',
      '.wd-role .i{font-size:22px;display:block;margin-bottom:5px}',
      '.wd-role .n{font-size:12.5px;font-weight:900;color:var(--ink,#16302a);display:block}',
      '.wd-role .s{font-size:10px;color:var(--muted,#7a8a84);display:block;margin-top:2px}',
      '.wd-fld{display:flex;gap:8px;margin:9px 0;align-items:center}',
      '.wd-inp{flex:1;min-width:0;border:1.5px solid var(--border,#e5e0d5);border-radius:11px;padding:10px 12px;font-family:inherit;font-size:13px;background:var(--card,#fff);color:var(--ink,#16302a)}',
      '.wd-inp:focus{outline:none;border-color:var(--green-soft,#7fb6a0)}',
      '.wd-num{width:76px;text-align:center;flex:none}',
      '.wd-sel{border:1.5px solid var(--border,#e5e0d5);border-radius:11px;padding:10px 8px;font-family:inherit;font-size:12.5px;background:var(--card,#fff);color:var(--ink,#16302a)}',
      '.wd-btn{border:none;border-radius:11px;padding:11px 16px;font-family:inherit;font-size:12.5px;font-weight:900;cursor:pointer;background:var(--sand,#faf7f0);color:var(--ink,#16302a);border:1px solid var(--border,#e5e0d5);transition:.15s;white-space:nowrap}',
      '.wd-btn:hover{filter:brightness(.97)}',
      '.wd-btn.p{background:var(--green-deep,#0e3b2e);color:#fff;border-color:transparent}',
      '.wd-btn.g{background:rgba(42,122,95,.12);color:var(--green-deep,#0e3b2e);border-color:transparent}',
      'html[data-theme="dark"] .wd-btn.g,html[data-theme="oled"] .wd-btn.g{color:#7fd8b4}',
      '.wd-btn.full{width:100%;display:block}',
      '.wd-btn:disabled{opacity:.45;cursor:default}',
      '.wd-lanes{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin:12px 0}',
      '.wd-lane{border:1px solid var(--border,#e5e0d5);border-radius:14px;padding:11px 10px;background:var(--sand,#faf7f0);text-align:center}',
      '.wd-lane .w{font-size:10px;color:var(--muted,#7a8a84);font-weight:800;margin-bottom:4px}',
      '.wd-lane .n{font-size:13px;font-weight:900;color:var(--ink,#16302a);margin-bottom:3px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
      '.wd-lane .st{font-size:11px;font-weight:800}',
      '.wd-lane .st.ok{color:#1f7a55}.wd-lane .st.no{color:#a85a2a}',
      '.wd-lane .sk{font-size:10px;color:var(--muted,#7a8a84);margin-top:3px}',
      '.wd-lane.empty{border-style:dashed}',
      '.wd-goal{background:linear-gradient(135deg,rgba(14,59,46,.06),rgba(201,161,74,.10));border:1px solid rgba(14,59,46,.14);border-radius:14px;padding:13px;margin:10px 0;text-align:center}',
      '.wd-goal .l{font-size:10.5px;color:var(--muted,#7a8a84);font-weight:800;margin-bottom:3px}',
      '.wd-goal .v{font-size:18px;font-weight:900;color:var(--green-deep,#0e3b2e)}',
      'html[data-theme="dark"] .wd-goal .v,html[data-theme="oled"] .wd-goal .v{color:#7fd8b4}',
      '.wd-dots{display:flex;gap:5px;justify-content:center;margin:10px 0 4px}',
      '.wd-dot{width:26px;height:26px;border-radius:8px;display:grid;place-items:center;font-size:10px;font-weight:900;background:var(--sand,#faf7f0);border:1px solid var(--border,#e5e0d5);color:var(--muted,#7a8a84)}',
      '.wd-dot.on{background:var(--green-deep,#0e3b2e);border-color:transparent;color:#fff}',
      '.wd-card-txt{width:100%;box-sizing:border-box;border:1.5px solid var(--border,#e5e0d5);border-radius:11px;padding:10px;font-family:ui-monospace,monospace;font-size:10.5px;direction:ltr;text-align:left;min-height:56px;resize:vertical;background:var(--sand,#faf7f0);color:var(--ink,#16302a)}',
      '.wd-note{font-size:10.5px;color:var(--muted,#7a8a84);line-height:1.8;margin-top:8px;display:flex;gap:6px;align-items:flex-start}',
      '.wd-adv{border:1px solid var(--border,#e5e0d5);border-left:3px solid var(--gold,#c9a14a);border-radius:11px;padding:10px 12px;margin:9px 0;background:var(--sand,#faf7f0);font-size:11.5px;line-height:1.9;color:var(--ink,#16302a)}',
      '.wd-adv b{color:var(--green-deep,#0e3b2e)}html[data-theme="dark"] .wd-adv b{color:#7fd8b4}',
      '.wd-ok{font-size:11px;color:#1f7a55;font-weight:800;margin-top:6px}',
      '.wd-err{font-size:11px;color:#b0453a;font-weight:800;margin-top:6px}'
    ].join('\n');
    document.head.appendChild(st);
  }

  function mount(el, opts) {
    if (!el) return;
    opts = opts || {};
    css();
    el.classList.add('wird-card');
    var s = read();
    var r = ROLES[s.role || 'peer'];
    var st = API.stats();
    var doneToday = !!(s.log[today()] && s.log[today()].me);
    var html = '';

    if (s.notice) html += '<div class="wd-adv" style="border-left-width:3px">' + esc(s.notice) + '</div>';
    html += '<div class="wd-h"><b>' + (s.role ? r.icon + ' ' + (s.role === 'teacher' ? 'حلقة: ' + esc(s.name) : 'رفيق الورد') : '🤝 رفيق الورد والحلقة') + '</b><span>بلا فيد عام</span></div>';
    html += '<p class="wd-sub">' + (s.role
      ? 'شخصٌ واحد يعرف وردك — لا شبكة اجتماعية، لا متابعين. البطاقة تنتقل بينكما أنتما.'
      : 'شخصان يتذاكران الورد، أو معلّم وطالب. لا حساب، لا خادم، لا أحد يرى غيركما.') + '</p>';

    if (!s.role && opts.compact) {
      el.innerHTML = html +
        '<div class="wd-lanes">' +
        '<div class="wd-lane"><div class="w">أنت</div><div class="n">—</div><div class="st no">لم تبدأ بعد</div></div>' +
        '<div class="wd-lane empty"><div class="w">رفيقك</div><div class="n">بانتظارك</div><div class="st no">شخصٌ واحد فقط</div></div>' +
        '</div>' +
        '<a class="wd-btn p full" href="wird.html" style="text-align:center;text-decoration:none;box-sizing:border-box">ابدأ رفيق الورد ←</a>' +
        '<div class="wd-note"><span>🔒</span><span>لا فيد عام: البطاقة تنتقل بينكما أنتما، ولا يرى أحدٌ غيركما.</span></div>';
      return el;
    }
    if (!s.role) {
      /* ── شاشة البداية ── */
      html += '<div class="wd-roles" data-wd="roles">' +
        '<button type="button" class="wd-role on" data-role="peer"><span class="i">🤝</span><span class="n">رفيق ورد</span><span class="s">شخصان — كلٌّ يقرأ وحده</span></button>' +
        '<button type="button" class="wd-role" data-role="teacher"><span class="i">🧑‍🏫</span><span class="n">حلقة</span><span class="s">معلّم وطالب — توجيه</span></button>' +
        '</div>' +
        '<div class="wd-fld"><input class="wd-inp" id="wd-name" maxlength="24" placeholder="اسمك المستعار (يظهر لرفيقك فقط)" value="' + esc(s.name) + '"></div>' +
        '<div class="wd-fld"><span style="font-size:12px;font-weight:800;color:var(--ink,#16302a)">وردي اليومي</span>' +
        '<input class="wd-inp wd-num" id="wd-amt" type="number" inputmode="numeric" min="1" max="604" value="' + (s.goal.amount || 5) + '">' +
        '<select class="wd-sel" id="wd-unit"><option value="ayah">آيات</option><option value="page">صفحات</option><option value="juz">أجزاء</option><option value="minute">دقائق</option></select>' +
        '</div>' +
        '<button type="button" class="wd-btn p full" data-wd="start">ابدأ الرفقة</button>' +
        '<div class="wd-note"><span>🔒</span><span>لا يُرسَل شيء تلقائيًا. أنت من ينسخ البطاقة ويرسلها بنفسه.</span></div>';
    } else {
      /* ── البطاقة المزدوجة ── */
      if (!s.name) {
        html += '<div class="wd-fld"><input class="wd-inp" id="wd-myname" maxlength="24" placeholder="اسمك المستعار لرفيقك"><button type="button" class="wd-btn p" data-wd="save-name">حفظ</button></div>';
      }
      html += '<div class="wd-lanes">' +
        '<div class="wd-lane"><div class="w">' + (s.role === 'teacher' ? 'المعلّم' : 'أنا') + '</div>' +
          '<div class="n">' + esc(s.name || 'أنا') + '</div>' +
          '<div class="st ' + (doneToday ? 'ok' : 'no') + '">' + (doneToday ? '✓ أتممت اليوم' : '— لم تسجّل بعد') + '</div>' +
          '<div class="sk">' + (st.streak ? '🔥 ' + ar(st.streak) + ' يوم' : 'ابدأ سلسلتك') + '</div></div>' +
        (s.partner
          ? '<div class="wd-lane"><div class="w">' + (s.role === 'teacher' ? 'الطالب' : s.role === 'student' ? 'المعلّم' : 'رفيقي') + '</div>' +
            '<div class="n">' + esc(s.partner.name) + '</div>' +
            '<div class="st ' + (s.partner.doneToday ? 'ok' : 'no') + '">' + (s.partner.doneToday ? '✓ أتمّ اليوم' : '— لم يُسجّل') + '</div>' +
            '<div class="sk">' + (s.partner.streak ? '🔥 ' + ar(s.partner.streak) + ' يوم' : 'آخر بطاقة: ' + agoText(s.partner.at)) + '</div></div>'
          : '<div class="wd-lane empty"><div class="w">' + r.other + '</div><div class="n">لم ينضم بعد</div><div class="st no">أرسل له البطاقة ↓</div></div>') +
        '</div>';

      html += '<div class="wd-goal"><div class="l">ورد اليوم</div><div class="v">' + goalText(s.goal) + '</div></div>';
      if (s.partner && s.partner.goal && goalText(s.partner.goal) !== goalText(s.goal)) {
        html += '<button type="button" class="wd-btn" style="width:100%;margin-top:7px;font-size:11.5px" data-wd="match">↔ ' + (s.role === 'peer' ? 'خُذ هدف رفيقك: ' : 'ورد الحلقة: ') + goalText(s.partner.goal) + '</button>';
      }
      html += '<button type="button" class="wd-btn ' + (doneToday ? 'g' : 'p') + ' full" data-wd="done">' + (doneToday ? '↺ تراجع عن تسجيل اليوم' : '✓ أتممت وردي اليوم') + '</button>';

      /* سلسلة آخر ٧ أيام */
      var dots = '';
      for (var i = 6; i >= 0; i--) {
        var d = dayOffset(i), e = s.log[d] || {};
        dots += '<div class="wd-dot ' + (e.me ? 'on' : '') + '" title="' + d + '">' + (e.me ? '✓' : dayLabel(i)) + '</div>';
      }
      html += '<div class="wd-dots">' + dots + '</div>';
      if (!opts.compact) {
      html += '<div style="display:flex;gap:8px;margin-top:10px">' +
        '<button type="button" class="wd-btn" style="flex:1" data-wd="copy">📤 بطاقتي</button>' +
        '<button type="button" class="wd-btn" style="flex:1" data-wd="paste">📥 استقبل بطاقة</button>' +
        '</div>';

      html += '<div id="wd-exchange" hidden style="margin-top:10px">' +
        '<textarea class="wd-card-txt" id="wd-txt" placeholder="ZADW1.…"></textarea>' +
        '<div style="display:flex;gap:8px;margin-top:8px">' +
        '<button type="button" class="wd-btn p" style="flex:1" data-wd="do-copy">انسخ</button>' +
        '<button type="button" class="wd-btn g" style="flex:1" data-wd="do-accept">اقرأ البطاقة</button>' +
        '</div><div id="wd-msg"></div></div>';
      }

      if (s.role === 'teacher' || s.role === 'student') {
        html += '<div class="wd-adv"><b>' + (s.role === 'teacher' ? 'توجيه المعلّم' : 'ملاحظة للطالب') + ':</b> ' +
          (s.partner && s.partner.note ? esc(s.partner.note) : (s.role === 'teacher' ? 'اكتب توجيهك أسفل البطاقة قبل أن تنسخها.' : 'سترى ملاحظة معلّمك بعد أن ترسل بطاقتك.')) + '</div>';
        if (!opts.compact) html += '<div class="wd-fld"><input class="wd-inp" id="wd-note" maxlength="120" placeholder="ملاحظة قصيرة تُرسَل مع بطاقتك" value="' + esc(s.partner && s.partner.note ? s.partner.note : '') + '"></div>' +
          '<button type="button" class="wd-btn full" data-wd="save-note">احفظ الملاحظة</button>';
      }

      if (!opts.compact) html += '<div class="wd-note"><span>⚠️</span><span>بلا خادم: آخر ما يعرفه جهازك عن رفيقك هو آخر بطاقة استلمتها. لا مزامنة لحظية — وهذا ثمن أن لا يرى أحدٌ غيركما.</span></div>';
      if (opts.compact) html += '<div style="margin-top:8px"><a href="wird.html" style="font-size:11.5px;font-weight:800;color:var(--green-deep,#0e3b2e)">افتح صفحة الرفيق ←</a></div>';
    }

    el.innerHTML = html;
    bind(el);
    return el;
  }

  function bind(el) {
    var s = read();
    function msg(t, ok) {
      var m = el.querySelector('#wd-msg');
      if (m) m.innerHTML = '<div class="' + (ok ? 'wd-ok' : 'wd-err') + '">' + esc(t) + '</div>';
    }

    /* شاشة البداية */
    el.querySelectorAll('.wd-role').forEach(function (b) {
      b.addEventListener('click', function () {
        el.querySelectorAll('.wd-role').forEach(function (x) { x.classList.remove('on'); });
        b.classList.add('on');
      });
    });
    var start = el.querySelector('[data-wd="start"]');
    if (start) start.addEventListener('click', function () {
      var role = (el.querySelector('.wd-role.on') || {}).dataset ? el.querySelector('.wd-role.on').dataset.role : 'peer';
      var name = (el.querySelector('#wd-name') || {}).value || '';
      var amt = (el.querySelector('#wd-amt') || {}).value || 5;
      var unit = (el.querySelector('#wd-unit') || {}).value || 'ayah';
      API.create({ role: role, name: name, goal: { amount: parseInt(amt, 10) || 5, unit: unit } });
      mount(el);
    });

    /* البطاقة */
    var doneBtn = el.querySelector('[data-wd="done"]');
    if (doneBtn) doneBtn.addEventListener('click', function () {
      if (s.log[today()] && s.log[today()].me) API.unmarkDone(); else API.markDone();
      mount(el);
    });

    var snm = el.querySelector('[data-wd="save-name"]');
    if (snm) snm.addEventListener('click', function () {
      var v = (el.querySelector('#wd-myname') || {}).value || '';
      var s2 = read(); s2.name = String(v).trim().slice(0, 24) || 'أنا'; s2.notice = ''; write(s2);
      mount(el);
    });

    var matchBtn = el.querySelector('[data-wd="match"]');
    if (matchBtn) matchBtn.addEventListener('click', function () {
      var p = read().partner;
      if (p && p.goal) API.setGoal(p.goal.amount, p.goal.unit);
      mount(el);
    });

    var copyBtn = el.querySelector('[data-wd="copy"]');
    var pasteBtn = el.querySelector('[data-wd="paste"]');
    var ex = el.querySelector('#wd-exchange');
    if (copyBtn) copyBtn.addEventListener('click', function () {
      ex.hidden = false;
      var txt = API.card();
      el.querySelector('#wd-txt').value = txt;
      doCopy(txt);
    });
    if (pasteBtn) pasteBtn.addEventListener('click', function () {
      ex.hidden = false;
      el.querySelector('#wd-txt').value = '';
      el.querySelector('#wd-txt').focus();
      msg('الصق البطاقة التي أرسلها لك رفيقك ثم اضغط «اقرأ البطاقة».', true);
    });

    function doCopy(txt) {
      try {
        if (navigator.share) {
          navigator.share({ text: txt }).catch(function () {});
          msg('بطاقتك جاهزة — أرسلها لرفيقك.', true);
          return;
        }
      } catch (e) {}
      try {
        navigator.clipboard.writeText(txt).then(function () { msg('نُسخت البطاقة. أرسلها بالواتساب أو أي تطبيق.', true); },
          function () { msg('انسخ النص من الصندوق يدويًا.', true); });
      } catch (e) { msg('انسخ النص من الصندوق يدويًا.', true); }
    }
    var dc = el.querySelector('[data-wd="do-copy"]');
    if (dc) dc.addEventListener('click', function () { doCopy(el.querySelector('#wd-txt').value || API.card()); });
    var acc = el.querySelector('[data-wd="do-accept"]');
    if (acc) acc.addEventListener('click', function () {
      var p = API.accept(el.querySelector('#wd-txt').value);
      if (p) { mount(el); var m2 = el.querySelector('#wd-msg'); if (m2) m2.innerHTML = '<div class="wd-ok">✓ تمّ — الآن تعرف آخر وردٍ لـ' + esc(p.name) + '.</div>'; }
      else msg('هذه ليست بطاقة صالحة. تأكد أنك نسختها كاملة (تبدأ بـ ZADW1).', false);
    });

    var sn = el.querySelector('[data-wd="save-note"]');
    if (sn) sn.addEventListener('click', function () {
      API.note((el.querySelector('#wd-note') || {}).value || '');
      var m3 = el.querySelector('#wd-msg');
      if (m3) m3.innerHTML = '<div class="wd-ok">✓ حُفظت الملاحظة — ستنتقل مع بطاقتك التالية.</div>';
    });
  }

  global.ZadWird = API;
  global.ZadWird.mount = mount;
})(typeof window !== 'undefined' ? window : this);
