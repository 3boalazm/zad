# تقرير أوديت قسمَي «القرآن الكريم» و«الذكر والدعاء» — زاد

**التاريخ:** 2026-10-20 | **الفرع:** `arena/c5cf3eff-zad` | **المنهج:** قراءة كود مباشرة + إثبات تجريبي في sandbox لكل خلل رقمي + مسح مراجع DOM آلي + مقارنة بسوق التطبيقات 2026 — لا تخمين

**نطاق الفحص:** القسمان الثاني والثالث في القائمة (`sec-quran` و`sec-dhikr` في `menu.js:24-45`) — **11 صفحة، 626 KB**:

| القسم | الصفحة | الدور | الحجم | الأسطر |
|---|---|---|---|---|
| `sec-quran` | `mushaf.html` | الورد اليومي | 54.8 KB | 976 |
| `sec-quran` | `mushaf-quran.html` | المصحف الشريف | 41.3 KB | 743 |
| `sec-quran` | `Quran-radio.HTML` | إذاعات القرآن | 97.1 KB | 2183 |
| `sec-quran` | `takbeer.html` | المسبحة | 22.3 KB | 308 |
| `sec-dhikr` | `adhkar.html` | الأذكار والدعاء | 34.5 KB | 707 |
| `sec-dhikr` | `nawawi.html` | الأربعون النووية | 106.4 KB | 898 |
| `sec-dhikr` | `du'a.html` | الأدعية | 70.0 KB | 939 |
| `sec-dhikr` | `dua-guide.html` | آداب الدعاء | 29.5 KB | 409 |
| `sec-dhikr` | `ruqyah.html` | الرقية الشرعية | 48.9 KB | 530 |
| `sec-dhikr` | `sunan.html` | السنن المهجورة | 49.4 KB | 644 |
| `sec-dhikr` | `asma.html` | أسماء الله الحسنى | 69.2 KB | 748 |

**الملفات المساندة الداخلة في النطاق** (لأنها تحمل منطق هاتين المجموعتين فعلًا): `js/app.js` (`initMushaf`, `initTasbih`, `countTasbih`, `applyQuranFont`, `cycleTheme`), `js/core/state-manager.js` (`ZadState` — المخطط والحفظ والتصيير اليومي), `profile.js` (النسخ الاحتياطي ومفاتيح التقدّم), `js/adhkar-azkar.js` (بيانات الأذكار), `sw.js`.

---

## Executive Summary

القسمان **أسلم بنيويًا بكثير من قسم الصلاة والتقويم**: صفر ملف `script` مفقود، صفر `id` مكرر، صفر معالج أحداث غير معرَّف (من 82 معالجًا)، و`console.log` شبه معدوم (2 فقط في 11 صفحة). صفحات المحتوى (`ruqyah`, `dua-guide`, `du'a`, `nawawi`, `sunan`, `asma`) سليمة ولا تحمل منطقًا قابلًا للكسر.

لكن الفحص كشف **خللين حرجين يُفسدان بيانات المستخدم نفسها** — وكلاهما في الصفحتين التفاعليتين الرئيستين:

1. **المسبحة تعدّ مضاعفًا** (`takbeer.html`): كل ضغطة على «↺ إعادة الكل» تُراكِم مستمع `click` إضافيًا على حلقة العدّ، فتصير النقرة الواحدة = 6 زيادات بعد 5 إعادات، والعدد الفاسد **يُحفَظ** في `zad_v2`. مُثبَت تجريبيًا.
2. **محرك المصادر البديلة في الراديو معطَّل بالكامل** (`Quran-radio.HTML`): معالجا `error` و`play().catch` يستدعيان `tryNextUrl()` معًا للخطأ الواحد، فتقفز `currentUrlIdx` من 0 إلى 2 — والمحطات لها مصدران فقط ⇒ **المصدر البديل لا يُجرَّب إطلاقًا** وتظهر لافتة «البث غير متاح» رغم وجود مرآة صالحة.

ثم **علّة نظامية واحدة تتكرر بأشكال مختلفة عبر القسمين**: *الحالة تُكتب في مكان وتُقرأ من آخر*. مظاهره: حلقة تقدّم الختمة لا تتحدث بعد «+ أضف جزءاً» لأن `app.js` ما زال يستهدف `m-prog-bar` المحذوف؛ الزيادات اليدوية لا تُسجَّل كورد اليوم؛ عدّادات الأذكار **أبدية لا يومية**؛ حجم خط المصحف يُكتب في مفتاحين ويُقرأ من مفتاح واحد فالتزامن **أحادي الاتجاه**؛ والنسخ الاحتياطي **يُسقِط 12 مفتاحًا** فيها كل تقدّم القسمين تقريبًا.

وأخطر ما في القسمين من ناحية الوصولية: **7 من 11 صفحة تتجاهل خيار «حجم الخط» العام** — وأثقلها قراءةً بالضبط (`ruqyah.html` التي تُقرأ جهارًا، `nawawi.html` بنصّها الطويل، `du'a.html`، `asma.html`).

| الخطورة | العدد | الطبيعة |
|---|---|---|
| 🔴 P0 حرج | 2 | بيانات عدّ تُفسَد وتُحفَظ + ميزة صمود معطّلة |
| 🟠 P1 عالٍ | 6 | حالة مكتوبة/مقروءة من مكانين + وصولية + فقدان بيانات |
| 🟡 P2 متوسط | 6 | ميزات مبنية لا تُعرض + مزامنة أحادية + استثناءات صامتة |
| ⚪ P3 ملاحظات | 8 | كود ميت + مخطط حالة ميت + تسمية مفاتيح |

> **منهجية مُسجَّلة:** كل خلل رقمي في هذا التقرير أُثبِت **بتشغيل الكود الحقيقي** المستخرج من الملفات، لا بمراجعته بصريًا. وثلاثة «اكتشافات» أولية **سُحبت بعد التحقق** لأنها كانت خاطئة — وهي مُدرجة صراحةً في ملحق «ما سُحِب» في نهاية التقرير، لأن معرفة ما ليس خللًا تمنع «إصلاح» كود سليم.

---

# 🔴 P0 — أخطاء حرجة تُفسِد بيانات المستخدم

## P0-Q1 · المسبحة تعدّ مضاعفًا بعد كل «إعادة الكل» — والعدد الفاسد يُحفَظ

**الموقع:** `js/app.js:2135` (`initTasbih`) + `js/app.js:2173-2183` (معالج `#ts-reset-all`) + `takbeer.html:127` (`#ts-ring`)

**السبب الجذري — ثلاثة أشياء تتضافر:**

1. `initTasbih()` تربط حلقة العدّ بـ**`addEventListener`** (التراكمي) لا بـ`onclick` (الاستبدالي):

```js
/* js/app.js:2165-2169 */
const ring = document.getElementById('ts-ring');
if (ring) {
  ring.addEventListener('click', () => window.countTasbih());        /* ← تراكمي */
  ring.setAttribute('tabindex', '0');
  ring.addEventListener('keydown', e => { … window.countTasbih(); }); /* ← تراكمي */
}
```

2. معالج «↺ إعادة الكل» **يُنادي `initTasbih()` مرة أخرى**:

```js
/* js/app.js:2173-2183 */
if (resetAll) resetAll.onclick = () => {
  if (confirm('إعادة تعيين جميع الأذكار؟')) {
    DHIKR_LIST.forEach(d => { STATE.tasbih[d.id] = 0; });
    STATE.tasbih.sessions = {};
    saveState();
    const wrap = document.getElementById('tasbih-cards');
    if (wrap) { wrap.innerHTML = ''; initTasbih(); }   /* ← السطر 2179: إعادة الربط */
    …
```

3. **`#ts-ring` لا يُدمَّر** مع البطاقات: هو عنصر SVG `<g>` عند `takbeer.html:127`، بينما `#tasbih-cards` حاوية منفصلة عند `takbeer.html:155`. فـ`wrap.innerHTML = ''` يمسح البطاقات (التي تُعاد إنشاؤها نظيفة) ويُبقي الحلقة **بكل مستمعيها المتراكمة**.

**الأثر:** بعد *n* ضغطة على «إعادة الكل»، النقرة الواحدة على الحلقة تُنفِّذ `countTasbih()` عدد *n+1* مرة. والزيادة تُحفَظ عبر `saveState()` ⇒ **فساد دائم في `zad_v2.tasbih`**، لا مجرد عرض خاطئ. وكذلك اختصار المسافة (`takbeer.html:291-297` + مستمع `keydown` على الحلقة) يتضاعف.

**الإثبات التجريبي** (`/home/user/test-takbeer.js` — يستخرج `initTasbih` و`DHIKR_LIST` الحقيقيين من `js/app.js` ويعدّ تسجيلات المستمعين على DOM مُجسَّم):

```
بعد initTasbih() الأولى : click=1  keydown=1
بعد إعادة #1            : click=2  keydown=2
بعد إعادة #2            : click=3  keydown=3
بعد إعادة #3            : click=4  keydown=4
بعد إعادة #4            : click=5  keydown=5
بعد إعادة #5            : click=6  keydown=6
نقرة واحدة على الحلقة   : 6 استدعاءات لـcountTasbih
قيمة الذكر «subhan» بعد نقرة واحدة : 6     ← الصحيح 1
```

**لماذا لا تتراكم بقية العناصر؟** لأن `resetBtn.onclick` و`resetAll.onclick` (`app.js:2171`, `2173`) استخدام **خصيصة** (استبدالي)، والبطاقات تُعاد إنشاؤها من الصفر (`createElement` + `appendChild`) فيموت مستمعوها القديمة معها. الحلقة وحدها هي الناجية الوحيدة التي يُعاد ربطها — وهذا ما يجعل الخلل دقيقًا وغير ظاهر.

**الإصلاح المقترح:** استبدال `addEventListener` بـ`onclick`/`onkeydown` على الحلقة (سطران)، **أو** — وهو الأفضل معماريًا — فصل الربط عن العرض: `initTasbih()` تُعرض البطاقات فقط، وربط الحلقة/الأزرار يُنقل إلى `initTasbihControls()` تُنادى مرة واحدة. الخيار الأول إصلاح فوري آمن؛ الثاني يمنع تكرار النمط.

---

## P0-Q2 · محرك المصادر البديلة في الراديو معطَّل: أول فشل يتخطّى المصدرين معًا

**الموقع:** `Quran-radio.HTML:1742` (مستمع `error`) و`Quran-radio.HTML:1628` (`play().catch`) — كلاهما يستدعي `tryNextUrl()` (`:1624`)

الصفحة تُعلن عن نفسها بالتعليق `PLAYBACK — multi-URL fallback engine`، ولكل محطة مصدران. لكن فشل مصدر واحد يُطلق **مسارين** في آن:

```js
/* :1614-1632 */
audio.play().then(…).catch(err => { …; tryNextUrl(); });   /* ← المسار الأول */

/* :1742-1751 */
audio.addEventListener('error', (e) => {
  if (!current) return;
  …
  tryNextUrl();                                            /* ← المسار الثاني */
});
```

عند فشل `src` يُطلِق العنصر حدث `error` **ويرفض** `play()` بـ`NotSupportedError` — فلا يوجد أي علمٍ لمنع التكرار (dedupe flag) ولا حارسٌ في أيٍّ من المعالجين.

**التتبّع الدقيق** (محطة بمصدرين، `currentUrlIdx = 0`):

| الخطوة | `currentUrlIdx` | النتيجة |
|---|---|---|
| `loadAndPlay()` → `audio.src = urls[0]` | 0 | فشل |
| حدث `error` → `tryNextUrl()` | **1** | `1 < 2` ⇒ جدولة `setTimeout(loadAndPlay, 800)` |
| `play().catch` → `tryNextUrl()` | **2** | `2 < 2` **خطأ** ⇒ `showStreamError()` |
| بعد 800ms: `loadAndPlay()` | 2 | `currentStreamUrl()` = `urls[2]` = **`undefined`** ⇒ `if (!url) { showStreamError(); return; }` |

⇒ **`urls[1]` (المصدر البديل) لا يُحمَّل أبدًا.** المستخدم يرى «البث غير متاح حالياً» ولافتة الخطأ رغم وجود مرآة صالحة — أي أن ميزة الصمود الوحيدة في الصفحة مُحبَطة بفعل معالج مكرر.

**تفاقم:** `tryNextUrl()` تقرأ `current.urls.length` **بلا حارس عدم-وجود** (`:1625-1626`)، فلو صار `current = null` أثناء مهلة الـ800ms (محطة أُوقفت، صفحة غادرت) رُمي `TypeError`.

**الإصلاح المقترح:** علم واحد لكل محاولة — `let _urlAttempted = -1;` وتُتجاهل أي `tryNextUrl()` لا تتقدّم بالفهرس، أو إزالة `tryNextUrl()` من مستمع `error` والاكتفاء برفض `play()` (وهو المسار الذي يملك رسالة الخطر أصلًا). مع إضافة `if (!current) return;` في أعلى `tryNextUrl()`.

---

# 🟠 P1 — علل عالية (حالة، وصولية، فقدان بيانات)

## P1-Q3 · حلقة تقدّم الختمة تتجمّد عند «+ أضف جزءاً» — `app.js` ما زال يستهدف عناصر محذوفة

**الموقع:** `js/app.js:452-464` مقابل `mushaf.html:454-458`

أُعيد تصميم `mushaf.html` فصار التقدّم يُعرض عبر `ph-ring` / `ph-bar` / `ph-sub` (`mushaf.html:454-458`) وتُحدّثها `updateProgress()` (`mushaf.html:799`). لكن `initMushaf()` في `js/app.js` ما زالت تستهدف **المعرّفات القديمة**:

```js
/* js/app.js:452-453 — وكلا المعرّفين غير موجود في mushaf.html */
const progBar = document.getElementById('m-prog-bar');   /* 0 ورود في mushaf.html */
const progTxt = document.getElementById('m-prog-txt');   /* 0 ورود في mushaf.html */
/* js/app.js:459-464 */
function updateMushafUI() {
  const j = STATE.mushaf.juz;
  const pct = Math.round((j / 30) * 100);
  if (progBar) progBar.style.width = pct + '%';      /* ← لا شيء */
  if (progTxt) progTxt.textContent = …;              /* ← لا شيء */
  if (addBtn) addBtn.disabled = j >= 30;             /* ← هذا وحده يعمل */
}
```

وزرّا `#m-add-juz` / `#m-reset` (`mushaf.html:462-463`) **لا يربطهما أحد غير `initMushaf()`** — تحقّق: صفر ورود لـ`m-add-juz` في `mushaf.html` خارج وسم الزر نفسه.

**الأثر:** المستخدم يضغط «+ أضف جزءاً» ⇒ `STATE.mushaf.juz++` ✅، `saveState()` ✅، `checkBadges()` ✅، وتنبيه «📖 جزء 5 مكتمل» ✅ — **بينما الحلقة الكبيرة ما زالت تعرض `0%` و«0 جزء من 30»** حتى إعادة تحميل الصفحة. `updateProgress()` تُنادى فقط من `renderWird()` (`mushaf.html:748`)، و`renderWird()` تُنادى من `completeWird()`/`applyCustomPlan()`/`DOMContentLoaded`/بطاقات الخطط — **ولا مرة من زرّ «أضف جزءاً»**.

**ملحوظة:** `mushaf.html:811` محاولة ميتة ثانية لنفس المعرّف:
```js
document.getElementById('m-prog-bar') && (document.getElementById('m-prog-bar').style.width = pct + '%');
```
محروسة فلا ترمي، لكنها كود ميت يوثّق نفس الانجراف.

**الإصلاح:** أن تُنادي `initMushaf()` دالة الصفحة (`updateProgress?.()` أو `renderWird?.()`) بدل `updateMushafUI()` الخاصة بها، أو تصحيح المعرّفات إلى `ph-*`. الخيار الأول أفضل لأنه يزيل التكرار لا يعالجه.

---

## P1-Q4 · الزيادات اليدوية لا تُحتسب وردًا لليوم ولا تُغذّي السلسلة

**الموقع:** `mushaf.html:752-771` (`completeWird`) مقابل `js/app.js:466-475` (`#m-add-juz`)

في الصفحة مساران متوازيان لزيادة الأجزاء، يكتب كلٌّ منهما أشياء مختلفة:

| | `completeWird()` (`mushaf.html:752`) | `#m-add-juz` (`js/app.js:466`) |
|---|---|---|
| مقدار الزيادة | `P.juzPerDay` **حسب الخطة المختارة** | `1` ثابتة، **تتجاهل الخطة** |
| `STATE.mushaf.completedDates[today]` | ✅ يُكتب | ❌ |
| `STATE.worship.mushaf_daily` | ✅ `true` | ❌ |
| `recordDailyProgress()` | ✅ | ❌ |
| `triggerConfetti()` | ✅ | ❌ |

**الأثر:** من يقرأ جزءًا ويضغط «+ أضف جزءاً» يدويًا — وهو السلوك الطبيعي — لا يُسجَّل له ورد اليوم، فلا يظهر في `worship` ولا في حصاد اليوم ولا في السلسلة، رغم أن العدّاد زاد. وعلى خطة «جواهر القرآن» (`mushaf.html:567-568`، `juzPerDay: 0` لأنها خطة **صفحات** لا أجزاء) تكون زيادة الجزء بلا معنى أصلًا ومع ذلك يُسمح بها.

هذا هو نفس نمط P0-Q3: منطق مكرَّر في `app.js` والصفحة، تفرّقا بعد إعادة التصميم.

---

## P1-Q5 · عدّادات الأذكار أبدية لا يومية — الصفحة تتوقف عن كونها متتبّعًا

**الموقع:** `js/core/state-manager.js:107-117` + `adhkar.html:513-519`

`ZadState.init()` يُصفِّر يوميًا **حقلين فقط**:

```js
/* js/core/state-manager.js:107-117 */
if (_state.day !== todayStr()) {
  …
  _state.day = todayStr();
  _state.lastActive = todayStr();
  _state.worship = {};          /* ✅ يُصفَّر */
  _state.charityDone = [];      /* ✅ يُصفَّر */
  save();                       /* ❌ adhkar لا يُصفَّر */
}
```

و`adhkar.html` ليس فيه أي تصفير يومي — التحقّق: صفر ورود لـ`todayStr`/`toDateString`/`lastDay` في الصفحة؛ التصفير الوحيد هو اليدوي لكل ذكر على حدة عبر `resetOne()` (`adhkar.html:613`) وزرّ `↺` (`:536`).

**الأثر:** أذكار الصباح والمساء **ممارسة يومية** بالتعريف. بعد اليوم الأول تعرض كل بطاقة `33 / 33 (×N)` مع حالة `afs-done` ✅ **بشكل دائم**، فلا تستطيع الصفحة أن تجيب عن السؤال الوحيد المطلوب منها: *هل قلت أذكار اليوم؟* ولإعادة الضبط يجب نقر `↺` على كل ذكر من عشرات الأذكار واحدًا واحدًا — لا يوجد «تصفير الكل لليوم».

**دلالة مهمة:** رياضيات `lap`/`laps` في `adhkar.html:524-525` و`596` (`next % tgt`, `Math.floor(next/tgt)`) **صُمِّمت للعدّ التراكمي**، فالنية الأصلية ملتبسة. لكن وجود `_state.worship = {}` اليومي يثبت أن التطبيق يملك **مفهوم التصفير اليومي** وأنه ببساطة لم يُمدَّد إلى `adhkar`.

**دعم من السوق (2026):** التطبيقات المنافسة تذكر هذه الميزة صراحةً كخيار: «Daily adhkar reminders & **optional auto-reset each day**» [14]، و«Resume unfinished sessions where you left off» مع تتبّع سلسلة يومي [13]، و«Track your daily progress» [8]. أي أن الحل الصحيح ليس اختيارًا واحدًا بل **خيارًا**: تصفير يومي للأذكار الموقوتة (صباح/مساء/بعد الصلاة/نوم) مع إبقاء التراكمي للأذكار المطلقة (استغفار/صلوات).

---

## P1-Q6 · النسخ الاحتياطي يُسقِط 12 مفتاحًا — أي كل تقدّم القسمين تقريبًا

**الموقع:** `profile.js:19-24`

```js
const BACKUP_KEYS = [
  'zad_profile', 'zad_v2', 'zad_font_size',
  'zad_lat', 'zad_lng', 'zad_city',
  'zad_radio_favs', 'zad_ten_days_method', 'zad_sound_on',
  'zad_profile_skipped',
];
```

**جرد كامل لمفاتيح القسمين** (مستخرج من الثوابت لا من السلاسل النصية فقط — `ZKEY`, `NW_KEY`, `KEY_FAV`, `KEY_REFLECT`, `BM_KEY`, `PAGE_KEY`, `CACHE_KEY`, `LAST_PAGE_KEY`):

| المفتاح | الصفحة | المحتوى | في `BACKUP_KEYS`؟ |
|---|---|---|---|
| `asma_reflected` | `asma.html:540` | الأسماء المتدبَّرة (**تقدّم**) | ❌ |
| `asma_fav` | `asma.html:541` | الأسماء المفضّلة | ❌ |
| `zad_badges_asma` | `asma.html:611` | **أوسمة مكتسَبة** | ❌ |
| `nw_read` | `nawawi.html:259` | أحاديث النووية المقروءة (**تقدّم**) | ❌ |
| `zad_mushaf_bm` | `mushaf-quran.html` | **العلامات المرجعية** | ❌ |
| `zad_mushaf_page` | `mushaf-quran.html` | آخر موضع قراءة | ❌ |
| `zad_mushaf_last_page` | `mushaf-quran.html` | آخر صفحة محفوظة («تابع القراءة») | ❌ |
| `zad_mfont` | `mushaf-quran.html:392` | حجم خط المصحف | ❌ |
| `zad_custom_from` / `zad_custom_to` | `mushaf.html` | نطاق الورد المخصّص | ❌ |
| `zad_radio_bgplay` | `Quran-radio.HTML` | تفضيل التشغيل بالخلفية | ❌ |
| `zad_radio_last` | `Quran-radio.HTML` | آخر محطة | ❌ |
| `zad_mpage_cache` | `mushaf-quran.html` | كاش صفحات | ❌ *(مقبول — كاش)* |

**الأثر:** «صدّر بياناتي» / «استعد» في `profile.js:70` و`importData` يمرّان على `BACKUP_KEYS` فقط ⇒ المستخدم الذي ينقل بياناته إلى جهاز جديد **يفقد**: علاماته المرجعية في المصحف، آخر موضع قراءة، الأحاديث التي قرأها من الأربعين النووية، الأسماء التي تدبّرها، **وأوسمته المكتسَبة**. وهذه بالضبط البيانات التي لا يمكن إعادة إنشائها.

**السبب الأرجح (قابل للتحقق):** المفاتيح الثلاثة `asma_fav`, `asma_reflected`, `nw_read` **تفتقد بادئة `zad_`** التي تحملها بقية مفاتيح المشروع — فمن جمع القائمة على نمط `zad_*` فاته كل ما خرج عن النمط. هذا يجعل P3-Q19 (تسمية المفاتيح) سببًا جذريًا لـP1 وليس مجرد ملاحظة نظافة.

---

## P1-Q7 · «حذف كل بياناتي» لا يحذف كل البيانات — أثر خصوصية

**الموقع:** `profile.js:112` (`resetAll`)

`resetAll()` تمسح `BACKUP_KEYS` + مفتاحين إضافيين فقط (`zad_prayer_today`, `zad_ten_days_table`). فيبقى بعد «الحذف الكامل»:

- الـ12 مفتاحًا من P1-Q6 (تقدّم القراءة، الأوسمة، المفضلات، التدبّر)
- `zad_prayer_method_id`, `zad_prayer_method` (اختيار طريقة الحساب)
- `zad_prayer_notif`, `zad_prayer_notif_last` (إعدادات الإشعارات وسجلّ الإطلاق)
- `zad_hijri_offset` (الإزاحة الهجرية اليدوية)
- `zad_month_table_*` (جداول شهرية مخزَّنة — تحوي إحداثيات المدينة ضمناً)
- `zad_hijri_anchor_*`, `zad_theme`

**الأثر:** وعد الخصوصية («احذف بياناتي») لا يتحقّق. على جهاز مشترك أو عند إعادة بيع الجهاز، يبقى تقدّم المستخدم الديني — وهو من أخصّ البيانات — مخزَّنًا بعد طلب حذفه صراحةً.

**الإصلاح:** اشتقاق قائمة الحذف من **تعداد فعلي** لمفاتيح `localStorage` بدل قائمة مكتوبة يدويًا:
```js
function resetAll(){ for (let i = localStorage.length - 1; i >= 0; i--) {
  const k = localStorage.key(i); if (k && k.startsWith('zad_')) localStorage.removeItem(k); } … }
```
مع استثناءات صريحة (لا مفاتيح ضمنية). ويتطلّب ذلك توحيد البادئة أولًا (P3-Q19) كي لا يفلت `asma_fav` و`nw_read`.

---

## P1-Q8 · 7 من 11 صفحة تتجاهل خيار «حجم الخط» العام — وأثقلها قراءةً

**الموقع:** مُحمِّل `--font-scale` (سطر واحد مكرَّر في 45 صفحة) مقابل قاعدة الاستهلاك `body{font-size:calc(1rem * var(--font-scale))}`

الإعدادات تعرض خيار حجم الخط وتكتب `zad_font_size` (`settings.html:726`, `740-744`). المُحمِّل يحسب معامل القياس (ويتضمّن فحصًا DOM يقيس حجم جذر الخط عبر عنصر مخفي!) ويضبط `--font-scale`. لكن **المتغيّر لا أثر له إلا في الصفحات التي تحمل قاعدة الاستهلاك**.

**قياس على صفحات النطاق** (ضابط = `setProperty('--font-scale')`، مستهلك = `var(--font-scale)`):

| الصفحة | تضبطه | تستهلكه | النتيجة |
|---|---|---|---|
| `mushaf.html` | 1 | 1 | ✅ يعمل (`:217`) |
| `mushaf-quran.html` | 1 | 1 | ✅ يعمل (`:177`) |
| `takbeer.html` | 1 | 1 | ✅ يعمل |
| `adhkar.html` | 1 | 1 | ✅ يعمل (`:216`) |
| `nawawi.html` | 1 | **0** | ❌ تضبطه ولا يستهلكه أحد |
| `du'a.html` | 1 | **0** | ❌ |
| `sunan.html` | 1 | **0** | ❌ |
| `asma.html` | 1 | **0** | ❌ |
| `Quran-radio.HTML` | **0** | **0** | ❌ غائب كليًا |
| `dua-guide.html` | **0** | **0** | ❌ غائب كليًا |
| `ruqyah.html` | **0** | **0** | ❌ غائب كليًا |

**على مستوى الموقع:** **45 صفحة تضبط** المتغيّر، **31 تستهلكه** ⇒ 14 صفحة تضبطه عبثًا، والباقي بلا مُحمِّل أصلًا.

**لماذا هذا P1 لا P2:** الصفحات السبع المتأثرة هي **الأكثر اعتمادًا على القراءة** في القسمين: `ruqyah.html` (الرقية الشرعية — نصّ يُقرأ جهرًا، وغالبًا من مستخدم مريض أو مضطرب أو كبير سنّ)، `nawawi.html` (106 KB من نصّ الحديث المتصل)، `du'a.html` (70 KB من الأدعية)، `asma.html` (أسماء الله الحسنى مع التدبّر)، `sunan.html`. هذه بالضبط الشريحة التي تحتاج تكبير الخط، وهي الوحيدة التي لا تستجيب.

**الإصلاح:** سطر CSS واحد + المُحمِّل في الصفحات السبع. ولأن المُحمِّل مكرَّر حرفيًا في 45 صفحة، فالإصلاح الجذري نقله إلى `css/style.min.css` مع `js/app.js` (أو ملف `js/font-scale.min.js` صغير يُحمَّل غير مؤجَّل) وحذف 45 نسخة — وهذا يمنع تكرار الانجراف مستقبلًا.

---

# 🟡 P2 — متوسط

## P2-Q9 · «جواهر القرآن» مبنية بالكامل في ثلاثة مواضع ولا تُعرض أبدًا

`renderGems()` (`mushaf.html:823`) تبني أربع بطاقات آيات مختارة بروابط إلى المصحف، ثم تعود فورًا:

```js
function renderGems() {
  const cont = document.getElementById('gems-container');   /* ← غير موجود في mushaf.html */
  if (!cont) return;
  cont.innerHTML = GEMS.map(g => `…`).join('');
}
```

الميزة مكتملة في **ثلاثة** مواضع أخرى: تنسيق CSS كامل `.gems-verse` و`.gems-verse:hover` (`mushaf.html:173-178`)، وبطاقة خطة `data-plan="gems"` معنونة «جواهر القرآن» (`:353-355`)، وتعريف خطة `PLANS['gems']` بنطاقات صفحات (`:567-575`). **نقطة التركيب وحدها غائبة** ⇒ المحتوى لا يُعرض في أي مكان.

## P2-Q10 · مزامنة حجم خط المصحف أحادية الاتجاه

| | يكتب | يقرأ |
|---|---|---|
| `mushaf-quran.html` | `zad_mfont` **و** `zad_v2.quranFontSize` (`:564`, `:566`) | `zad_mfont` (`:392`) |
| `mushaf.html` → `applyQuranFont()` (`js/app.js:206-214`) | `zad_v2.quranFontSize` + `--qf-size` **فقط** | — |

ونصّ الآيات يأخذ حجمه **inline** — `mushaf-quran.html:517`:
```js
html += `<div class="quran-text" style="font-size:${_fontSize}px">`;
```
والنمط inline **يتغلّب** على قاعدة CSS `font-size:var(--qf-size,24px)` (`:85`) ⇒ `--qf-size` ميت بالنسبة لنصّ الآيات.

**الأثر:** تغيير حجم الخط من `mushaf.html` (أو من أي مسار يستخدم `applyQuranFont`) **لا يظهر** في `mushaf-quran.html`. الاتجاه المعاكس يعمل لأن الصفحة تكتب المفتاحين.

**تفاقم صغير:** نطاقا التقييد مختلفان — `Math.max(16, Math.min(36, …))` في `mushaf.html:789` مقابل `Math.max(18, Math.min(36, …))` في `mushaf-quran.html:563` ⇒ تفضيل 16px يتحول إلى 18 عند الانتقال.

## P2-Q11 · `bb-vol-slider` غير موجود: `oninput` يرمي استثناءً مع كل حركة منزلق

```html
<!-- Quran-radio.HTML:1305-1307 -->
<input type="range" id="vol-slider-popup" min="0" max="100" value="80"
  oninput="setVolume(this.value);document.getElementById('bb-vol-slider').value=this.value">
```

المعرّف الموجود في DOM هو `vol-slider` (`:1173`) و`vol-slider-popup` (`:1305`) — **لا `bb-vol-slider`**. فـ`getElementById` يُرجع `null` والسطر يرمي `TypeError: Cannot set properties of null` **مع كل حدث `input`** (أي عشرات المرات أثناء سحب المنزلق). `setVolume()` تنجح أولًا فالصوت يتغيّر فعلًا، لكن:
- الاستثناء يُغرق سجلّ الأخطاء ويقطع أي كود لاحق في المعالج
- `setVolume()` نفسها تستهدف `['vol-slider','bb-vol-slider']` (`:1773`) ⇒ المنزلقان **لا يتزامنان أبدًا**، فيبقى منزلق الشريط السفلي على قيمته القديمة بينما الصوت تغيّر

**ملاحظة منهجية:** هذا الخلل **لم يكشفه المسح الأول** لأنه كان يفحص `<script>` الداخلي فقط؛ توسيع المسح ليشمل معالجات سمات HTML (`oninput=`/`onclick=`) هو ما أظهره.

## P2-Q12 · إحصاءات الجلسات تبقى قديمة بعد «إعادة الكل»

معالج التصفير (`js/app.js:2173-2183`) يمسح الحالة (`STATE.tasbih.sessions = {}`) ويعيد رسم البطاقات، لكنه **لا ينادي `updateAllStats()`** المعرَّفة في `takbeer.html:266` — فالبلاطات الثمانية `tss-subhan`…`tss-salawat` و`tss-total` تبقى تعرض أرقام ما قبل التصفير حتى النقرة التالية (لأن `takbeer.html:283-287` رقّعت `window.countTasbih` لتناديها).

**الأثر:** «↺ إعادة الكل» ⇒ كل البطاقات صفر + تنبيه «🔄 تمت إعادة تعيين الأذكار»، بينما لوحة «إجمالي الجلسات المكتملة» ما زالت تعرض أرقامًا غير صفرية.

## P2-Q13 · حراسة غير متسقة للحالة في `adhkar.html` — القراءة آمنة والكتابة تقتل المعالج

```js
/* adhkar.html:513 — محروسة بالكامل */
function getCount(sec, id){ return (window.STATE?.adhkar?.[sec]?.[id]) || 0; }

/* adhkar.html:514-519 — بلا حراسة */
function setCount(sec, id, val){
  if(!STATE.adhkar) STATE.adhkar = {};        /* ← STATE عارية */
  …
  if(typeof saveState === 'function') saveState();
}
```

`setCount()` تُنادى في **أول** سطر من `window.tap` (`adhkar.html:590`) وكود تحديث الواجهة يأتي بعدها (`:594-608`). فلو تعذّرت طبقة الحالة، ترمي `setCount` قبل أي تحديث ⇒ **الزرّ يبدو ميتًا تمامًا**: لا رقم، لا اهتزاز، لا شريط تقدّم — بينما `getCount` كانت ستهبط إلى 0 بأمان. نفس التناقض في `toggleSec` (`:585`).

**السياق الأوسع:** `ZadState.save()` **مُرجَأ بهامش 200ms بلا حدّ أقصى للانتظار** (`state-manager.js:96-101`): `clearTimeout(_saveTimer); _saveTimer = setTimeout(…, 200)`. على عدّاد يُنقر عليه بسرعة (33/100 مرة) تُصفَّر المهلة مع كل نقرة، فلا يُكتب شيء حتى تهدأ النقرات 200ms. التخفيف موجود (`pagehide` + `visibilitychange` ⇒ `flush()` في `:104-105`) وهو يغطي قفل الشاشة وتصغير التطبيق، لكنه لا يغطي القتل القسري من النظام. **الأثر محدود** (نافذة الفقد ضيقة) فسُجِّل P2 لا P1 — والإصلاح المقترح إضافة `maxWait` أو `flush()` كل *n* نقرة.

## P2-Q14 · `zad_v2` يُكتب من ثلاث طبقات متنافسة

| الطبقة | الطريقة |
|---|---|
| `ZadState` | `save()` مُرجَأ، يكتب `_state` كاملًا (`state-manager.js:96-101`) |
| `mushaf-quran.html:566` | `localStorage.setItem('zad_v2', …)` مباشر بعد `JSON.parse` |
| `mushaf.html:793` | نفس النمط (فرع `else` عند غياب `applyQuranFont`) |
| `Quran-radio.HTML:1567` | نفس النمط (داخل `toggleTheme` الميتة) |
| `mushaf.html:866-873` | IIFE مستقلة بمفتاحها الخاص `ZKEY='zad_v2'` و`load()`/`save()` خاصَّين |

الكتابة المباشرة **غير مرئية** لـ`ZadState._state` المقيم في الذاكرة، فأي `save()` لاحق (من أي نقرة في أي مكان) **يستبدلها** بالنسخة القديمة. كما أن `load()` في IIFE `mushaf.html:869` تُرجع `{}` عند فشل `JSON.parse` ثم `save(s)` تكتب كائنًا شبه فارغ ⇒ **مسار نظري لمحو الحالة كلها** إن وصلت `zad_v2` تالفةً. (`ZadState.load()` (`:88-93`) يملك نفس نمط `catch → DEFAULT()` لكنه أضيق أثرًا.)

**الإصلاح:** منع الكتابة المباشرة لـ`zad_v2` خارج `ZadState` — `ZadState.patch({…})` موجود أصلًا (`state-manager.js:170-179`) ويُطلِق المشتركين.

---

# ⚪ P3 — ملاحظات كود ميت وتسمية

| # | الملاحظة | الموقع | الأثر |
|---|---|---|---|
| P3-Q15 | **`reconnectCount` ميت**: يُسنَد `0` في 7 مواضع (`1547`, `1602`, `1629`, `1679`, `1705`, `1764`, `2017`) ولا **يُزاد أبدًا** | `Quran-radio.HTML` | لا يوجد منطق إعادة اتصال رغم ما يوحي به الاسم؛ البث المنقطع في منتصف التشغيل لا يُستأنف إلا عبر حدث `online` (`:2012`) |
| P3-Q16 | **~20 سطرًا ميتًا**: `toggleTheme()` الداخلية (`:1559-1573`) تُظلَّل بـ`window.toggleTheme` من `app.min.js` (مؤجَّل، `:2177`؛ `js/app.js:204-205` ⇒ `cycleTheme()` يدور على `['light','dark','oled']`). الفرع الميت يكتب `zad_theme` (`:1569`) — **مفتاح لا يقرأه أحد في المستودع** — ويزامن `#dark-switch` (`:1571` وIIFE `:1576-1581`) — **معرّف غير موجود** | `Quran-radio.HTML` | **سلوك السمة المرئي سليم** لأن `app.js` يفوز (ويدور على ثلاث سمات). الميوع في الكود لا في الوظيفة — لكن `zad_theme` مفتاح مُضلِّل لمن يقرأ المصدر |
| P3-Q17 | **حقلان ميتان في مخطط الحالة**: `adhkarProgress: {}` (`:32`) و`tasbih7: {}` (`:41`) — مُعلَنان ويُرحَّلان في `MIGRATIONS[2]` (`:52`) ولا يقرؤهما أو يكتبهما **أي** ملف | `js/core/state-manager.js` | حقلان يُرحَّلان للأبد بلا مستهلك؛ دليل على تصميمَي تتبّع بُدئا ثم تُركا |
| P3-Q18 | **`prayerMethod: 4` في المخطط** (`state-manager.js:33`) يناقض الافتراضي الموحَّد **مصر (5)** من P1-1، و**لا يقرأه أحد**. ومفتاح رابع `zad_ten_days_method` (`profile.js:47`, `:64`) يُقرأ ويُكتب من `profile.js` وحده ⇒ **اختيار طريقة الصلاة في البروفايل لا أثر له في أي مكان** | `state-manager.js` + `profile.js` | فخّ كامن: أي كود مستقبلي يقرأ `ZadState.get('prayerMethod')` سيُعيد أم القرى لمستخدم مصري. الأثر الحالي صفر |
| P3-Q18b | **ثلاث تسميات مبدَّلة لطرق الصلاة** في `profile.js:28-29` — `'1':'كاليفورنيا'` (الصحيح كراتشي)، `'2':'رابطة العالم الإسلامي'` (الصحيح ISNA/أمريكا الشمالية)، `'3':'كراتشي'` (الصحيح رابطة العالم الإسلامي). مُتحقَّق مقابل `js/calendar.js:183` المشتقّ من جدول aladhan الرسمي. **نفس صنف P0-1 المُصلَح في `prayers.html`، باقٍ في `profile.js` و`profile.min.js`** (والصفحة تُحمّل `.min` عند `profile.html:302`) | `profile.js:28-29` | الأثر محدود لأن المفتاح معزول (P3-Q18)، لكن القائمة **معروضة للمستخدم** ومضلِّلة |
| P3-Q19 | **تسمية مفاتيح غير متسقة**: `asma_fav`, `asma_reflected`, `nw_read` بلا بادئة `zad_` التي تحملها كل مفاتيح المشروع الأخرى | `asma.html:540-541`, `nawawi.html:259` | **سبب جذري لـP1-Q6** — من جمع `BACKUP_KEYS` على نمط `zad_*` فاته كل ما خرج عنه |
| P3-Q20 | **`safeToggleTheme` مُشار إليها في 11 صفحة ومعرَّفة في صفر** — `onclick="safeToggleTheme?.()||toggleTheme?.()"` (`du'a.html:226` وغيرها) | 11 صفحة | **سليم اليوم**: `?.()` على غير معرَّف ⇒ `undefined` ⇒ `\|\|` يسقط إلى `toggleTheme()` الصحيحة. لكنه **فخّ حيّ**: لحظة تعريف `safeToggleTheme` كدالة `void` (وهو المرجّح من اسمها) يُنفَّذ التبديل **مرتين** فينقلب إلى نفسه ويبدو الزرّ معطَّلًا في 11 صفحة |
| P3-Q21 | **ثلاث صفحات لا تحتفظ بأي حالة**: `du'a.html`, `ruqyah.html`, `dua-guide.html` — صفر `localStorage.setItem` | — | لا تقدّم قراءة، لا مفضلات، لا تذكّر آخر موضع. مقبول للمحتوى المرجعي، لكنه يترك `du'a.html` (939 سطرًا من الأدعية المصنّفة في تبويبات) بلا مفضلات بينما `asma.html` و`nawawi.html` تملكانها — توقّع المستخدم غير متّسق داخل القسم الواحد |

---

# ✅ ما هو سليم ويجب الحفاظ عليه

- **البنية صلبة**: في 11 صفحة — صفر ملف `script` مفقود (كل الـ82 مرجعًا موجود)، صفر `id` مكرر، **صفر معالج أحداث غير معرَّف من 82 معالجًا**، و`console.log` = 2 فقط (كلاهما في `Quran-radio.HTML`)
- **`mushaf-quran.html` أحسن صفحات القسمين هندسةً**: `AbortSignal.timeout(8000)` على `fetch` (`:483`) — أي أن نمط P1-3 مُطبَّق هنا أصلًا؛ مساعد قراءة آمن من JSON التالف مع تحذير صريح (`:208-211`)؛ كاش صفحات في `localStorage` (`:446`)؛ **جلب استباقي** للصفحات المجاورة (`:539`)؛ علامات مرجعية (`:573`)؛ وحفظ مزدوج لموضع القراءة
- **`Quran-radio.HTML`**: بنية محطات بمصدرين لكلٍّ منها (فكرة صحيحة — التنفيذ هو P0-Q2)، `MediaSession` لأزرار النظام (`:1962-1978`)، معالجة `online`/`offline` صريحة (`:2012-2028`)، موقّت نوم، تفضيل تشغيل بالخلفية، ومفضلات محفوظة
- **`takbeer.html`**: حارس `return` في `:263` يمنع التهيئة المزدوجة (صحيح في الوضع الحالي لأن `initTasbih` ليست ضمن قائمة تهيئة `app.js:898-936`)؛ `updateAllStats` مُرقَّعة على `countTasbih` بنمط proxy نظيف (`:283-287`)؛ واختصار لوحة المفاتيح محروس ضد `input,textarea,button,details,summary` (`:292`)
- **`asma.html`**: `checkBadges(arr.length)` تُنادى **بمعامل صحيح** (`:603`)؛ و`toggleFav` (`:625-631`) يبدو معكوس الرسالة لكنه **صحيح** لأن `arr.includes(idx)` تُقيَّم **بعد** التعديل
- **`nawawi.html`**: `zadSafeParse`-style حماية، وفصل نظيف بين «مقروء» و«مفضّل»
- **`sunan.html`**: `window.STATE.sunan = map` (`:474`) محروس بـ`typeof === 'object'`، و`sn-toast` يُنشأ عند الغياب بنمط صحيح
- **الصفحات المرجعية** (`ruqyah`, `dua-guide`, `du'a`): محتوى ثابت، تبويبات، بلا منطق قابل للكسر — وهذا قرار صحيح لا نقص
- **`js/core/state-manager.js`**: يملك `subscribe()` (`:181-185`) و`patch()` بدمج عميق (`:170-179`) و`transaction()` و`flush()` على `pagehide`/`visibilitychange` — **أي أن P1-5 من تقرير الصلاة (وحدة حالة واحدة مع `subscribe`) مبنيٌّ فعلًا**، ومشكلته أن 57 صفحة تُحمِّله و**صفر صفحة تستخدمه** مباشرة

---

# 💡 مقترحات مضافة — من مسح السوق (2026)

## الشريحة الأولى — تُغلق فجوات تنافسية مباشرة وتبني على ما هو موجود

1. **تصفير يومي اختياري للأذكار** (يغلق P1-Q5). التطبيقات المنافسة تذكره صراحةً: «Daily adhkar reminders & **optional auto-reset each day**» [14]. التطبيق الصحيح: تصفير يومي للأذكار **الموقوتة** (صباح/مساء/بعد الصلاة/قبل النوم) مع إبقاء **التراكمي** للمطلقة (استغفار/صلوات) — لأن `adhkar.html` تملك بالفعل رياضيات `lap`/`laps` التراكمية (`:524-525`) فلا يُهدر ذلك العمل. `ZadState` يملك آلية التصفير اليومي جاهزة (`state-manager.js:107-117`)؛ المطلوب إضافة `adhkar` إليها بشرط `timed`.

2. **تذكيرات الأذكار محاذية للمواقيت** — «reminders that can **auto-align to your local Fajr, Asr and Isha**» [6]. هذا **أرخص مقترح في القائمة** لأن البنية التحتية بُنيت في الجولة الثالثة: `js/prayer-notifications.js` تحسب المواقيت على الجهاز وتجدول على اللحظة المطلقة. المطلوب إضافة وسمين (`zad-adhkar-morning` بعد الفجر، `zad-adhkar-evening` قبل المغرب) إلى نفس الجدولة.

3. **تراجع عن نقرة واحدة (Undo)** — «Undo an accidental tap» [18]، «manual complete button **with undo**» [20]. `adhkar.html` و`takbeer.html` تملكان `resetOne`/`ts-reset` (تصفير كامل) ولا تملكان ما بينهما. النقرة العرضية على عدّاد التسبيح تكلف المستخدم 33 نقرة.

4. **تاريخ الجلسات وإحصاءات أسبوعية/شهرية** — «full session history, weekly and monthly statistics» [3]، «daily, weekly, and monthly charts» [27]، «View your total repetitions, completed sessions, this week's activity, and longest streak» [13]. `zad_v2.tasbih.sessions` موجود أصلًا لكنه **عدد إجمالي فقط** (`takbeer.html:271`) — بلا طابع زمني فلا يمكن رسم أي تاريخ.

5. **سلسلة (streak) لكل ذكر لا للتطبيق كله** — «Streak tracking **for every dhikr and group**, including current streak and best streak» + «motivational messages when you beat your previous streak record» [20]، و«streak freeze» [17] و«streak urgency warnings» [20]. `ZadState.streak` الحالي (`state-manager.js:110-111`) عامٌّ للتطبيق كله ويُصفَّر بقسوة عند انقطاع يوم.

6. **مرجع/تخريج ظاهر مع كل ذكر** — «Each entry includes the Arabic text, transliteration, English meaning, and **the Hadith reference so you can verify the source yourself**» [4]، «a dedicated **Sources** screen listing every dhikr's Qur'an or hadith reference in one place» [6]، و«narrations graded weak were **deliberately excluded**» [6]. `adhkar.html` يملك حقل `virtue` اختياريًا (`:527`) — أي أن المخطط يدعمه والبيانات ناقصة.

7. **وضع الحفظ (Memorise mode) مقابل وضع القائمة** — «Memorise mode — learn your adhkar by heart. Or switch to List mode» [6]. يُخفي النص تدريجيًا. قيمة تعليمية عالية وتكلفة منخفضة لأن النص موجود في `window.AZ_SECTIONS`.

## الشريحة الثانية — المصحف: الفجوة الحقيقية أمام المنافسين

8. **تخطيط مصحفي مقفول الأسطر (15 سطرًا، طبعة المدينة)** — «Hifz students **lock pages of the Mushaf to memory; a layout that reflows breaks visual recall**. The 15-line Madinah print is the standard» [13]. `mushaf-quran.html` يعرض نصًّا **متدفقًا** من `api.alquran.cloud` (`:381`, `:517`) فيتغيّر موضع الآية بتغيّر حجم الخط والعرض — وهذا **يمنع الحفظ البصري**. المنافسون يوفّرون صفحات مصوَّرة («Scanned Mushaf pages», Ayat/KSU [3]) أو تخطيطًا مقفولًا. هذا أعمق فرق بنيوي بين `zad` والسوق.

9. **تكرار على مستوى الآية للحفظ** — «Loop a single verse, a half-verse, or a custom range, with **adjustable repeat count and pause between repeats**. **Many apps fail this basic test**» [13].

10. **طابور مراجعة يومي (spaced revision)** — «Daily revision queue» [17]، «Scheduled revision: Yes» [10][12]، والفكرة كاملةً في «Quran Revision App: Stop Losing Memorized Surahs» [12]. يُبنى طبيعيًا على `zad_mushaf_bm` (العلامات المرجعية الموجودة) + `mushaf.completedDates`.

11. **أوفلاين حقيقي للمصحف** — «Offline mode … Audio downloaded ahead of time is **non-negotiable**» [13]، وكل التطبيقات في كل المقارنات تدعمه [1][3][7]. `mushaf-quran.html` تملك كاش صفحات مُجتلَبة (`:446`) وجلبًا استباقيًا (`:539`) — أي **الأساس موجود**؛ المطلوب توسيعه إلى «نزّل الجزء/السورة» صراحةً وإدراج `api.alquran.cloud` في استراتيجية `sw.js` (تحقّق: هل هو في BYPASS مثل `cdn.jsdelivr.net` كان؟ إن كان فالنمط P1-2 يتكرر هنا).

12. **تلاوة متزامنة مع تظليل الآية** — «Audio recitations … **synchronized highlighting**» [21]، «Listen to recitations … with **current ayah highlighting**» [24]. `Quran-radio.HTML` تملك مشغّل صوت ناضجًا (MediaSession، مصادر بديلة، موقّت نوم) — دمجه مع `mushaf-quran.html` أرخص من بنائه مرتين.

13. **مصحف ملوَّن أحكام التجويد (KFGQPC)** — صار ميزة قياسية في **كل** التطبيقات المقارنة [1][6][22] بلا استثناء.

14. **حفظ موضع القراءة والاستئناف** — «Save your reading position and **resume anytime**» [24]. المفاتيح موجودة (`zad_mushaf_last_page`) لكنها **غير مشمولة في النسخ الاحتياطي** (P1-Q6) ولا يظهر لها «تابع القراءة» في لوحة التحكم.

## الشريحة الثالثة — عداد التسبيح وطبقة العادة

15. **العدّ بلا شاشة** — «Count using **volume buttons** or customize vibration patterns for specific targets (33, 66, 99) **so you never have to look at the screen**» [27]، «volume button counter … or activate the **auto counter** for continuous hands-free zikr» [23]. `takbeer.html` تملك اهتزازًا (`navigator.vibrate`) وحلقة قابلة للنقر — إضافة `keydown` على مفاتيح الصوت (أو `AudioContext`-free volume hook) صغيرة الأثر كبيرة الفائدة (العدّ في الصلاة/المشي).

16. **أهداف قابلة للضبط + تبديل تلقائي** — «preset targets (33, 100, 313, 1000), and custom goal options» [16]، «Auto-switch between counters when a target is reached» [14]، «Follow multi-step routines that **automatically guide you from one dhikr to the next**» [13]. `DHIKR_LIST` تملك `target` لكل ذكر بالفعل — فالانتقال التلقائي عند بلوغ الهدف سطر واحد.

17. **أذكار مخصّصة / ورد خاص** — «Create custom presets with your own Arabic text, transliteration, and target count» [13]، «10 custom azkaar slots» [4]، «Write your own supplications with custom targets» [7].

18. **طبقة العادة هي الفارق لا النص** — في مقارنة مُقيَّمة: «Building a daily reading habit» سجّلت **10/10** مقابل **5/10** لـQuran.com رغم أن الأخير «Best for Deep study» [9]. و«Gentle streaks» مقابل «Aggressive» صارت معيار مقارنة [8]. `zad` تملك `streak` و`badges` — المطلوب **ربطهما** بالقسمين (وسام «٣٠ يوم ورد» بدل وسام «٣٠ جزء» فقط).

19. **الخصوصية كميزة معلَنة** — «No account required: Zero signup», «Privacy-first (no tracking): Zero data» [8]، «Offline & Private: All your Zikr progress stays safely on your device with **no sign-in required**» [16]. `zad` **local-first فعلًا** (`profile.js` تصدير/استيراد بملف بلا خادم) — وهذه ميزة تنافسية حقيقية **غير معلَنة** في الواجهة. أرخص مقترح تسويقي في القائمة: سطر واحد في `profile.html` و`privacy.html`.

20. **مشاركة الذكر كبطاقة مصمَّمة** — «Share any dhikr as a **styled card** with family and friends» [12].

---

# 🛠 خارطة الطريق المقترحة

## أ) إصلاحات فورية (ساعات، بلا تغيير معماري)

1. `js/app.js:2166,2168` — `addEventListener` → `onclick`/`onkeydown` على `#ts-ring` — **P0-Q1** (الأكبر أثرًا/الأصغر حجمًا في التقرير كله)
2. `Quran-radio.HTML:1742` — إزالة `tryNextUrl()` من مستمع `error` (أو علم منع تكرار) + حارس `if (!current) return;` في `tryNextUrl()` — **P0-Q2**
3. `Quran-radio.HTML:1307` — `bb-vol-slider` → `vol-slider`؛ و`:1773` كذلك — **P2-Q11**
4. `js/app.js:466-475` — مناداة `updateProgress?.()` بعد زيادة الجزء — **P1-Q3**
5. `profile.js:19-24` — إضافة المفاتيح الـ12 إلى `BACKUP_KEYS` (وتوحيد أسماء `asma_*`/`nw_read` ببادئة `zad_`) — **P1-Q6 + P3-Q19**
6. `profile.js:28-29` — تصحيح التسميات الثلاث من جدول `js/calendar.js:183` — **P3-Q18b**
7. سطر CSS + المُحمِّل في الصفحات السبع — **P1-Q8**
8. `<div id="gems-container">` في `mushaf.html` — **P2-Q9**
9. `profile.js:112` — `resetAll()` بتعداد فعلي للمفاتيح — **P1-Q7**

## ب) جولة معمارية (أيام)

10. **توحيد طبقة الحالة**: منع الكتابة المباشرة لـ`zad_v2` خارج `ZadState` (P2-Q14)، ونقل منطق `initMushaf`/`initTasbih` المكرَّر من `app.js` إلى صفحاته أو العكس — لا كليهما (P1-Q3, P1-Q4, P2-Q12). `ZadState.subscribe()` موجود وجاهز، فاستبدال رقعة `countTasbih` proxy في `takbeer.html:283` باشتراك يزيل صنفًا كاملًا من هذا الخلل.
11. **فصل الربط عن العرض** في `app.js`: `initX()` تعرض، و`bindXControls()` تربط مرة واحدة — يمنع تكرار P0-Q1 في أي وحدة مستقبلية.
12. **مُحمِّل `--font-scale` موحَّد** في ملف واحد بدل 45 نسخة حرفية (P1-Q8).
13. **تصفير يومي للأذكار الموقوتة** (P1-Q5) + ربط `worship` بمسار «+ أضف جزءاً» (P1-Q4).
14. **حذف الكود الميت**: `reconnectCount` أو تطبيقه فعلًا (P3-Q15)، `toggleTheme`/`zad_theme`/`dark-switch` في الراديو (P3-Q16)، `adhkarProgress`/`tasbih7`/`prayerMethod` من المخطط أو توثيق سبب بقائها (P3-Q17, P3-Q18).

## ج) جولة المنتج (بعد استقرار الأساس)

15. تذكيرات الأذكار محاذية للمواقيت عبر `js/prayer-notifications.js` الموجود (المقترح 2)
16. Undo + تاريخ جلسات + سلسلة لكل ذكر (المقترحات 3، 4، 5)
17. التخريج الظاهر ووضع الحفظ (المقترحات 6، 7)
18. المصحف: تخطيط مقفول الأسطر + تكرار الآية + طابور مراجعة + أوفلاين صريح (المقترحات 8-11) — **أكبر فجوة تنافسية**

---

# ملحق · أوامر التحقق المستخدمة

```bash
# نطاق القسمين من القائمة
sed -n '17,80p' menu.js

# مسح آلي: مفاتيح DOM الميتة (سكربتات + سمات HTML معًا)، المعالجات غير المعرَّفة،
# ids المكررة، ملفات script المفقودة، المضيفون الخارجيون، مفاتيح التخزين
python3 scan-sections.py          # 11 صفحة → JSON

# المرجع الميت الذي كشفه توسيع المسح لسمات HTML (P2-Q11)
grep -rn "getElementById('bb-vol-slider')" Quran-radio.HTML   # موجود في oninput= لا في <script>

# من يضبط --font-scale ومن يستهلكه (P1-Q8)
grep -rl "setProperty('--font-scale'" --include=*.html .  | wc -l   # → 45
grep -rl 'var(--font-scale)'          --include=*.html .  | wc -l   # → 31

# جرد مفاتيح التخزين المبنية من ثوابت لا من سلاسل نصية (P1-Q6)
grep -o "[A-Z_]*KEY[A-Z_]* *= *'[a-z_0-9]*'" *.html

# إثبات P0-Q1 تجريبيًا
node test-takbeer.js     # → 6 زيادات من نقرة واحدة بعد 5 إعادات

# تأكيد أن initTasbih ليست ضمن قائمة تهيئة app.js (فحارس takbeer.html:263 يمرّ)
grep -n "initTasbih" js/app.js          # → 2135 (تعريف)، 2179 (من resetAll)، 2185 (تصدير)
sed -n '898,936p' js/app.js | grep Tasbih   # → initTakbeer فقط، لا initTasbih

# من يستهلك zad_theme / prayerMethod / adhkarProgress / tasbih7 (كلها: لا أحد)
grep -rn "zad_theme"       --include=*.js --include=*.html . | grep -v '\.min\.js'
grep -rn "prayerMethod"    --include=*.js --include=*.html . | grep -v '\.min\.js'
grep -rn "adhkarProgress\|tasbih7" --include=*.js --include=*.html . | grep -v '\.min\.js'
```

---

# ملحق · ما سُحِب بعد التحقق (ليس خللًا)

ثلاثة «اكتشافات» أولية ثبت خطؤها بالفحص، وتُسجَّل هنا لأن معرفة ما **ليس** خللًا تمنع إفساد كود سليم:

| المسودة | لماذا سُحبت |
|---|---|
| **`getVolume()` في الراديو تُحوّل الصفر إلى 80%** لأن `el.value \|\| 80` | **خاطئ**: قيمة `input[type=range]` **سلسلة نصية**، و`'0'` سلسلة **صادقة** في جافاسكربت ⇒ `'0' \|\| 80` → `'0'` → `0/100 = 0`. السلوك صحيح؛ الـ`\|\|` هنا يسقط فقط عند غياب العنصر (وهو المقصود) |
| **`window.STATE` غير موجود أبدًا** لأن `js/app.js:162` يُعلِنه `let` (فلا يصير خاصية لـ`window`) | **خاطئ**: `js/core/state-manager.js` يُسنده صراحةً في أربعة مواضع (`:119`, `:153`, `:177`, `:188`). وتحقّق إضافي: `run()` في `mushaf.html:866` مؤجَّلة عبر `DOMContentLoaded` (`:975-976`) الذي يُطلَق **بعد** السكربتات المؤجَّلة ⇒ `window.STATE` متاح فعلًا وقت التنفيذ |
| **رسالة `toggleFav` في `asma.html:625-631` معكوسة** (تقول «أُضيف» عند الإزالة) | **خاطئ**: `arr.includes(idx)` تُقيَّم **بعد** `splice`/`push`، فالفرع المختار يطابق الحالة الجديدة دائمًا. الكود مُربك لكنه صحيح |
| **`toggleTheme` في الراديو تفقد سمة OLED** | **خاطئ كأثر مرئي**: الدالة الداخلية ميتة أصلًا (P3-Q16) لأن `window.toggleTheme` من `app.js:204` يدور على السمات الثلاث. السلوك الفعلي سليم؛ الباقي كود ميت فقط |
| **`checkBadges()` في `asma.html` تُنادى بلا معامل ⇒ لا وسام يُمنح أبدًا** | **خاطئ**: `asma.html:603` تُناديها `checkBadges(arr.length)` بمعامل صحيح |

---

# ملحق · مصادر مسح السوق (2026)

الإحالات `[n]` في قسم «مقترحات مضافة» تعود إلى هذه المصادر. الأرقام مطابقة لترقيم نتائج البحث،
وقد استُخدمت كما وردت دون إعادة ترقيم حتى تبقى قابلة للتتبع.

**أرقام مفقودة في الترتيب** (لم يُستشهد بها لأن محتواها كان تسويقيًا بحتًا أو مكررًا):
`[2]`, `[5]`, `[11]`, `[15]`, `[19]`, `[22]`, `[25]`, `[26]`, `[28]`, `[29]`, `[30]` من القائمة الأولى
(تطبيقات القرآن)، و`[2]`, `[5]`, `[22]`, `[24]`, `[25]`, `[26]`, `[28]`, `[29]` من الثانية (تطبيقات الذكر).

## تطبيقات القرآن والمصحف

| # | المصدر | ما استُخدم منه |
|---|---|---|
| [1] | recitid.ai/guides/best-quran-apps — «5 Best Quran Apps in 2026: Tested & Compared» (2026-10-09) | جدول مقارنة المزايا؛ التجويد الملوَّن ميزة قياسية في الخمسة كلها؛ «Always download the content you need before travelling» |
| [3] | dralirajabi.com/best-quran-apps-2026 — «10 Best Quran Apps [2026]» (2026-08-09) | «Scanned Mushaf pages» في Ayat/KSU؛ «Verse looping and pause controls» في Quran Explorer؛ دعم الأوفلاين في العشرة كلها |
| [6] | qariai.app/quran-app-comparison-2026 (2026-04-15) | «Tajweed Color Mushaf (KFGQPC)»؛ أن Quran.com وMuslim Pro بلا تتبّع حفظ ولا تحليل تجويد |
| [7] | qurangate.app/blog/best-quran-app-android (2026-07-15) | جدول مزايا أندرويد؛ «Offline reading ✅» في السبعة كلها |
| [8] | fiveprayer.app/blog/best-muslim-apps-2026 (2026-05-18) | «No account required: Zero signup» و«Privacy-first (no tracking): Zero data» كمعيارَي مقارنة؛ «Streak tracking: Gentle vs Aggressive»؛ «Offline mode: 30 days» |
| [9] | qurangate.app/blog/best-app-for-reading-quran (2026-07-15) | عمود «Habit Score»: بناء عادة القراءة اليومية 10/10 مقابل Quran.com 5/10 رغم تفوّقه الدراسي؛ «Structured khatm plans» |
| [10] | get-sabr.com/blog/alternatives-to-muslim-pro-better-hifz-apps (2026-06-25) | «Scheduled revision: Yes» و«Ayah-level repetition: Yes» كأعمدة مقارنة |
| [12] | get-sabr.com/blog/quran-revision-app-how-to-stop-losing-memorized-surahs (2026-06-13) | «Dedicated revision scheduler» و«Ayah-by-ayah memorization loop»؛ أن Quran.com وMuslim Pro بلا مراجعة مجدولة |
| [13] | quranicma.com/best-quran-memorization-apps-2026 (2026-09-27) | **أهم مصدر للمقترحات 8-11**: «a layout that reflows breaks visual recall. The 15-line Madinah print is the standard»؛ «adjustable repeat count and pause between repeats. Many apps fail this basic test»؛ «Audio downloaded ahead of time is non-negotiable» |
| [14] | get-sabr.com/blog/best-quran-memorization-apps-for-kids-and-teens (2026-06-19) | «Structured learning path» و«Configurable ayah repetition (≈20 default)» و«Daily revision queue» |
| [16] | bestforandroid.com/quran-apps (2026-05-20) | «Arabic text is small and downloads quickly; recitation audio is larger, so download the reciters you want over Wi-Fi first» |
| [17] | get-sabr.com/blog/sabr-vs-muslim-pro-hifz (2026-06-23) | «Daily revision queue: Muslim Pro ✗ / Quran.com ✗» — أي أن الفجوة في السوق لا في `zad` وحده |
| [18] | getnafs.com/blog/best-quran-recitation-apps (2026-04-23) | مقارنة عمق القرّاء والأوفلاين |
| [20] | unstar.app/blog/muslim-pro-quran-majeed-athan-pillars-tarteel-quran-prayer-apps-ranked-2026 (2026-06-21) | Muslim Pro «over 100 million downloads» كمقياس للسوق |
| [21] | elm.academy/blog/best-quran-apps-for-ipad (2025-09-21) | «Audio Recitation: 25+ reciters; **synchronized highlighting**» |
| [23] | apps.apple.com — Muslim Pro: Quran & Athan (2026-09-21) | «Prayer & Fasting Tracker: Log your five daily prayers … Visible streaks and gently timed reminders turn a daily intention into an actual habit» |
| [24] | apps.apple.com — Astaghfirullah: Dhikr, Quran (2026) | «Listen to recitations … with **current ayah highlighting**»؛ «**Save your reading position and resume anytime**»؛ «Live Quran radio stations» |

## تطبيقات الذكر والأذكار والتسبيح

| # | المصدر | ما استُخدم منه |
|---|---|---|
| [1] | nurpaths.com/blog/best-dhikr-apps-2026 (2026-04-10) | جدول مقارنة عدادات الذكر؛ «Quran & hadith references for each dhikr» كميزة فارقة |
| [3] | zikar.app/blog/best-dhikr-apps-2026 (2026-06-20) | «realistic bead animation, vibration and sound feedback, target goals (33, 99, 100, custom), infinity mode, **full session history**, custom dhikr lists with personal targets, **weekly and monthly statistics**»؛ «the cue–behaviour–reward loop» |
| [4] | zikar.app (الصفحة الرئيسية) | «10 custom azkaar slots»؛ «**Each entry includes the Arabic text, transliteration, English meaning, and the Hadith reference so you can verify the source yourself**» |
| [6] | apkcombo.com — Daily Adhkar: Duas & Qur'an (2026-09-26) | «reminders that can **auto-align to your local Fajr, Asr and Isha**»؛ «narrations graded weak were deliberately excluded»؛ «**Memorise mode** — learn your adhkar by heart. Or switch to List mode»؛ «a dedicated **Sources** screen»؛ «back up your progress to a file» |
| [7] | play.google.com — Tathkeer: Tasbih, Dua & Azkar | «**Write your own supplications with custom targets**»؛ «a full year of statistics instead of 30 days»؛ «PDF and CSV export of your records» |
| [8] | play.google.com — Adhkar Muslim أذكار المسلم (2026-07-22) | «Track your **daily** progress with an intuitive tap counter and full tasbih history» |
| [9] | play.google.com — Tasbih Counter: Dhikr Azkar (2026-07-05) | «Track **laps** during each session»؛ «Focus Mode»؛ «built-in timer for each session»؛ «session history and totals over time» |
| [10] | play.google.com — Azkar: Dhikr, Dua & Tasbih (2026-08-30) | «Every dhikr shows **how many times to repeat it, its source from the Sunnah, and an explanation of its meaning**»؛ «Streaks, points and badges» |
| [11] | play.google.com — Dhikr Counter: Digital Tasbeeh | «**Counts are stored automatically, so nothing is lost when you close the app**»؛ «Multiple counters at the same time» |
| [12] | apps.apple.com — Adhkar: Morning & Evening | «Interactive misbaha — tap to count **remaining**»؛ «**Share any dhikr as a styled card**»؛ «Streaks, calendar, and simple stats» |
| [13] | play.google.com — Dhikr: Tasbeeh & Zikr Counter | «**Resume unfinished sessions** where you left off»؛ «total repetitions, completed sessions, this week's activity, and **longest streak**»؛ «Follow **multi-step routines** that automatically guide you from one dhikr to the next» |
| [14] | play.google.com — My Tasbeeh App: Dhikr Counter | «**Daily adhkar reminders & optional auto-reset each day**» — **الدليل المباشر على P1-Q5**؛ «Auto-switch between counters when a target is reached» |
| [15] | play.google.com — Thikr Home: Dhikr Player (2026-05-17) | «Set repetition count for each track»؛ قوائم تشغيل للرقية وأذكار الصباح |
| [16] | play.google.com — Zikar Tasbih: Accurate Counter (2026-03-01) | «preset targets (33, 100, **313, 1000**), and custom goal options»؛ «**Offline & Private:** All your Zikar progress stays safely on your device with **no sign-in required**»؛ «Lifetime Target Charts & Analytics» |
| [17] | apps.apple.com — Dhikr: Dua, Athkar & Tasbih | «Activate a **Streak Freeze** to protect your streak»؛ «Goal Statistics — switch between Day, Week, Month and Year»؛ «AI Mic — count dhikr with your voice … hands-free» |
| [18] | apps.apple.com — Tasbih: Dhikr Counter Pro | «**Undo an accidental tap**»؛ «Leave today and return tomorrow **without starting again**»؛ «Turn sound feedback on or off» |
| [20] | play.google.com — Daily Dhikr | «**Streak tracking for every dhikr and group**, including current streak and best streak»؛ «Motivational messages when you beat your previous streak record»؛ «Optional **streak reminder before your streak is lost**»؛ «manual complete button **with undo**» |
| [21] | play.google.com — Tasbih Counter & Dhikr (2026-04-28) | «Preset counters (33, 99, or custom targets)»؛ «**Reset and undo** options»؛ «99 Names of Allah — Learn and reflect» |
| [23] | apps.apple.com — Digital Tasbih Counter & Dhikr (2026-05-25) | «use the **volume button counter** to count without touching the display, or activate the **auto counter** for continuous hands-free zikr»؛ «session timer, new stats graph» |
| [27] | play.google.com — Tasbih Counter: Dhikr & Prayer (2025-08-11) | «Count using **volume buttons** or customize vibration patterns for specific targets (33, 66, 99) **so you never have to look at the screen**»؛ «daily, weekly, and monthly charts»؛ «Secure Cloud Backup» |

---

**حالة التقرير:** findings مُكتملة ومُتحقَّقة. **لم يُنفَّذ أي إصلاح من هذا التقرير بعد** — الجولة الأولى (الشريحة «أ»، 9 بنود) جاهزة للتنفيذ عند الطلب.
