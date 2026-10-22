/* ══════════════════════════════════════════════════════════════════════════
   زاد — وضع الوصول (B8): واجهة أكبر + قراءة ميسّرة
   ──────────────────────────────────────────────────────────────────────────
   • يُحفظ في localStorage تحت zad_a11y_v1 ويُطبَّق قبل الرسم (لا وميض).
   • «واجهة أكبر»: تكبير الواجهة والخطوط وأهداف اللمس.
   • «قراءة ميسّرة»: تباعد أسطر وحروف أوسع، وأرقام/حروف أوضح — مساعدة
     لذوي عسر القراءة (ديسلكسيا) ولمن يقرأ على شاشة صغيرة في الشمس.
   • لا يدّعي استعمال خط OpenDyslexic؛ يشرح ما يفعله بالضبط.
   ══════════════════════════════════════════════════════════════════════════ */
(function (g) {
  'use strict';
  if (g.ZadA11y) return;

  var KEY = 'zad_a11y_v1';
  var CSS_ID = 'zad-a11y-css';

  function read() {
    try { return JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) { return {}; }
  }
  function write(o) {
    try { localStorage.setItem(KEY, JSON.stringify(o)); } catch (e) {}
    apply(o);
    try { g.dispatchEvent(new CustomEvent('zad:a11y', { detail: o })); } catch (e) {}
  }

  function css() {
    if (document.getElementById(CSS_ID)) return;
    var st = document.createElement('style');
    st.id = CSS_ID;
    st.textContent = [
      /* واجهة أكبر */
      'html.ui-large .main{zoom:1.09}',
      'html.ui-large .sidebar{zoom:1.04}',
      'html.ui-large .nav a{min-height:46px}',
      'html.ui-large button,html.ui-large .btn,html.ui-large .zk-btn{min-height:44px}',
      '@supports not (zoom: 1){html.ui-large body{font-size:117%}}',
      /* قراءة ميسّرة */
      'html.font-easy body{letter-spacing:.015em;word-spacing:.07em;line-height:1.95}',
      'html.font-easy .main p,html.font-easy .main li,html.font-easy .main td,html.font-easy .main th{line-height:2.05}',
      'html.font-easy .main p{max-width:72ch}',
      'html.font-easy .main{--fq-line:2.05}',
      'html.font-easy .quran-text,html.font-easy .fq-ar,html.font-easy [class*="arabic"]{letter-spacing:0}',
      /* احترام تفضيل تقليل الحركة */
      '@media (prefers-reduced-motion: reduce){html.ui-large *{scroll-behavior:auto}}',
      /* لا نضخّم المصحف نفسه */
      'html.ui-large .mq-page,html.ui-large .mushaf-canvas{zoom:1}'
    ].join('\n');
    document.head.appendChild(st);
  }

  function apply(o) {
    o = o || read();
    css();
    var h = document.documentElement;
    h.classList.toggle('ui-large', !!o.large);
    h.classList.toggle('font-easy', !!o.easy);
  }

  function row(id, on, title, sub, icon) {
    return '<label class="zad-a11y-row" for="' + id + '" style="display:flex;align-items:center;gap:12px;padding:13px 2px;cursor:pointer">' +
      '<span style="font-size:20px;width:26px;text-align:center">' + icon + '</span>' +
      '<span style="flex:1;min-width:0">' +
        '<span style="display:block;font-size:13.5px;font-weight:800;color:var(--ink)">' + title + '</span>' +
        '<span style="display:block;font-size:11.5px;color:var(--muted);margin-top:2px;line-height:1.7">' + sub + '</span>' +
      '</span>' +
      '<input type="checkbox" id="' + id + '" ' + (on ? 'checked' : '') + ' style="width:22px;height:22px;accent-color:var(--green-deep,#0e3b2e);flex:none">' +
      '</label>';
  }

  function mount(el) {
    if (!el) return;
    var o = read();
    el.innerHTML =
      row('zad-a11y-large', o.large, '🔎 واجهة أكبر',
          'تكبير النصوص والأزرار والمسافات — مفيد على الشاشات الصغيرة وفي الشمس', '🔎') +
      row('zad-a11y-easy', o.easy, '📖 قراءة ميسّرة',
          'تباعد أوسع بين الأسطر والحروف، وأسطر أقصر — مساعدة لعسر القراءة', '📖') +
      '<div style="font-size:11px;color:var(--muted);line-height:1.8;border-top:1px solid var(--border);padding-top:10px;margin-top:4px">' +
      'التفضيل يُحفظ في هذا الجهاز ويعمل في كل الصفحات، ويمكن إطفاؤه في أي وقت.<br>' +
      'نصّ المصحف لا يتغيّر حجمه في «واجهة أكبر» حتى لا تختلّ الصفحة.' +
      '</div>';
    var L = el.querySelector('#zad-a11y-large');
    var E = el.querySelector('#zad-a11y-easy');
    if (L) L.onchange = function () { var s = read(); s.large = L.checked; write(s); };
    if (E) E.onchange = function () { var s = read(); s.easy = E.checked; write(s); };
  }

  /* التطبيق فورًا — السكربت في نهاية الصفحة لكن قبل الرسم الكامل */
  apply(read());

  g.ZadA11y = {
    read: read,
    set: function (k, v) { var o = read(); o[k] = !!v; write(o); return o; },
    mount: mount,
    reset: function () { try { localStorage.removeItem(KEY); } catch (e) {} apply({}); }
  };
})(typeof window !== 'undefined' ? window : this);
