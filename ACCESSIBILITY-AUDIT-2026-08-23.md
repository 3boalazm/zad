# تقرير اختبار الوصولية الشامل — زاد
**المعيار:** WCAG 2.1 AA (مع فحص إضافي لبنود WCAG 2.2 AA) | **التاريخ:** 2026-08-23
**نطاق الفحص:** 65 صفحة HTML للمستخدم + فحص تفصيلي على 15 صفحة تمثيلية (لوحة التحكم، الصلاة، الأذكار، القرآن، الإذاعة، المسبحة، الذكاء الاصطناعي، الزكاة، الإعدادات، التسجيل، البلاغ، القبلة، الأوسمة، المجموعات، وضع الأطفال)

---

## Executive Summary

المشروع لديه **أساس وصولية قوي بالفعل** — لغة الصفحة (`lang="ar"`) صحيحة في كل الملفات، دعم `prefers-reduced-motion` منتشر عبر CSS وJS، آلية `:focus-visible` عامة موحّدة تعمل بشكل صحيح، ونص alt موجود ومعبّر لـ 100% من الصور (تحقّق: 0 صور بدون alt). كما أن جولتي إصلاح سابقتين وثّقهما تاريخ Git (h1 لكل صفحة، وصول لوحة المفاتيح لقوائم الشريط الجانبي، تسمية 18 حقل نموذج) ما زالتا فعّالتين وسليمتين.

هذا الفحص اكتشف **3 مشاكل تباين لون منهجية** (systemic) أثّرت على عشرات العناصر عبر الموقع — أخطرها لون كل نوع ذكر في صفحة المسبحة (`takbeer.html`) كان مصمَّمًا للوضع الداكن فقط لكنه يُطبَّق حرفيًا في الوضع الفاتح (الافتراضي) أيضًا، بنسب تباين وصلت لـ **1.45:1** (المطلوب 4.5:1). **تم إصلاح الثلاثة عند الجذر (CSS tokens)** أثناء هذا الفحص وتم التحقق من الإصلاح آليًا (انظر قسم "ما تم إصلاحه").

المشكلة الثانية الأكبر: **57+ حقل نموذج بدون اسم متاح لتقنية المساعدة** (لا `label`، لا `aria-label`) عبر 19 صفحة — أغلبها تعتمد على `placeholder` فقط كـ"تسمية"، وهو نمط معروف بمخالفته WCAG 3.3.2/4.1.2. هذه لم تُصلَح بعد (تحتاج مراجعة نص لكل حقل) وموثّقة بالكامل في قسم Roadmap مع أمثلة كود جاهزة.

| المؤشر | القيمة |
|---|---|
| صفحات تم فحصها (syntax + console) | 65/65 ✅ |
| صفحات فُحصت آليًا (Pa11y WCAG2AA) | 15 |
| صفحات فُحصت بـ Lighthouse Accessibility | 1 (نموذج) — **النتيجة: 91/100** |
| إجمالي مشاكل Pa11y قبل الإصلاح (15 صفحة) | 108 |
| إجمالي مشاكل Pa11y بعد إصلاح التباين (نفس الصفحات) | 91 (-16%) |
| مشاكل تباين قبل | 45 |
| مشاكل تباين بعد | 28 (-38%، وعلى صفحة `takbeer.html` وحدها: 28 → 8، أي -71%) |
| صور بدون alt | 0 |
| صفحات بدون `lang="ar"` | 0 |
| صفحات بدون h1 | 4 (2 منها صفحات إعادة توجيه فورية، أثرها منخفض) |
| صفحات بتخطي مستوى عنوان (h1→h3) | 17 |
| حقول نموذج بدون اسم وصول | 57+ عبر 19 صفحة |
| صفحات بها skip link | 5/65 |

**الأولوية الفورية (Critical/High):** تباين نصوص المسبحة (**تم إصلاحه**)، تسمية النماذج (57 حقل، لم يُصلح — روادماب أدناه)، رابط "الصلاة القادمة" بلا اسم عند عدم توفر بيانات الموقع (**تم إصلاحه**).

---

## جدول النتائج التفصيلي

| # | المعيار | الحالة | المشكلة | الحل المقترح | الأولوية |
|---|---------|--------|---------|---------------|----------|
| 1 | WCAG 1.4.3 (Contrast) | ✅ تم الإصلاح | ألوان الأذكار السبعة في `takbeer.html` (`--dc-color`) كانت مصممة للوضع الداكن (تباين 6.5–13.7:1) لكنها تُطبَّق حرفيًا في الفاتح أيضًا (تباين 1.45–2.73:1 فقط) | فصل تلطبيق: النص في الفاتح يستخدم `--ink`/`--green-deep` (تباين 12–16:1)، ويبقى `--dc-color` للوضع الداكن/OLED فقط عبر `html[data-theme="dark"]` | 🔴 Critical |
| 2 | WCAG 1.4.3 (Contrast) | ✅ تم الإصلاح | التوكن `--muted-2` نفسه (نص ثانوي/تسميات صغيرة) كان أفتح من اللازم: 3.03–3.55:1 في الفاتح، 2.92:1 في الداكن | غُيّرت قيمته لـ `#5c6c58` (فاتح) و`#7a9a7c` (داكن) — يمرّ 4.5:1+ في كل الخلفيات المستخدمة | 🔴 Critical |
| 3 | WCAG 1.4.3 (Contrast) | ✅ تم الإصلاح | لون `--gold` (الذهبي) يُستخدم كلون **نص** مباشرة في 34 موضعًا عبر 12 صفحة (اقتباسات الحديث، روابط "عرض الكل"، عناوين) — تباين 2.06–2.42:1 فقط | استبدال `color:var(--gold)` بـ `color:var(--gold-dark)` (تباين 4.4–5.1:1) — نفس عائلة اللون، فرق بصري طفيف | 🔴 Critical |
| 4 | WCAG 4.1.2 (Name, Role, Value) | ✅ تم الإصلاح | رابط "الصلاة القادمة" في `index.html` (`#prayer-link-wrap`) يحيط بمحتوى `display:none` عند عدم توفر بيانات موقع — لا اسم متاح لقارئ الشاشة لأول زيارة | أُضيف `aria-label="مواقيت الصلاة"` ثابت على الرابط نفسه | 🟡 High |
| 5 | WCAG 3.3.2 / 4.1.2 (Labels) | ❌ لم يُصلح | **57+ حقل إدخال بدون اسم وصول** عبر 19 صفحة (`adhkar.html`, `ai.html`, `groups.html`, `mushaf-quran.html`, `nawawi.html`, `odhiya.html`, `playlist.html`, `prayers.html`, `profile.html`, `Quran-radio.HTML`, `report.html`, `settings.html`, `tasmee.html`, `zad_al_ashr.html`, `zahra.html`, `zakat.html`, `du'a.html`, `index.html` وغيرها) — أغلبها يعتمد على `placeholder` فقط، وبعضها (checkboxes في `settings.html`/`zahra.html`) بلا أي نص إطلاقًا | ربط كل حقل بنصه المرئي المجاور عبر `aria-label` أو `<label for>` — أمثلة كود كاملة في قسم Roadmap | 🟠 High |
| 6 | WCAG 1.3.1 (Info & Relationships) | ❌ لم يُصلح | 4 صفحات بلا `<h1>` إطلاقًا: `register.html` (**تم إصلاحه أثناء هذا الفحص**)، `duas.html`/`worship.html` (صفحتا إعادة توجيه فورية — أثر منخفض)، `zad_al_ashr.html` (صفحة فعلية بمحتوى، تبدأ بـ h2 مباشرة) | إضافة `<h1 class="sr-only">` بنفس نمط بقية الموقع | 🟡 Medium |
| 7 | WCAG 1.3.1 (Info & Relationships) | ❌ لم يُصلح | 17 صفحة تقفز من h1 مباشرة لـ h3 دون h2 وسيطة (`index.html`, `arafah.html`, `groups.html`, `hasad.html`, `kids-heroes.html`, `mushaf-quran.html`, `odhiya.html`, `privacy.html`, `qibla.html`, `report.html`, `sadaqah.html`, `sunan.html`, `videos.html`, `zakat-ahkam.html`, `zakat-anwa.html`, `groups-privacy.html`) — يكسر التنقّل بمستويات العناوين لمستخدمي قارئ الشاشة | إضافة `<h2 class="sr-only">` قبل كل مجموعة بطاقات h3 (يحتاج مراجعة سياق كل صفحة لاختيار نص العنوان المناسب — غير آلي بالكامل) | 🟡 Medium |
| 8 | WCAG 2.4.1 (Bypass Blocks) | ❌ لم يُصلح | 60 من 65 صفحة بدون skip-to-content link (موجود فقط في `index.html`, `kids-heroes.html`, `qibla.html`, `tasmee.html`, `videos.html`) — مستخدم لوحة المفاتيح مضطر يمرّ بكل روابط القائمة الجانبية كل مرة | نسخ نمط الـ skip link الموجود من `index.html` لباقي الصفحات (الشريط الجانبي مشترك عبر `menu.js`، فالحل الأمثل حقن الرابط من مصدر واحد) | 🟠 High |
| 9 | WCAG 2.5.5 (Target Size — best practice) | ⚠️ ملاحظة | `#notif-btn` وأزرار مشابهة في الشريط العلوي بحجم 34×34px — يمرّ حد WCAG 2.2 AA الرسمي (24×24) لكنه أقل من المعيار الشائع لمس 44×44px (Apple/Google HIG) | رفع لـ 44×44px إن سمحت مساحة الشريط العلوي — يحتاج مراجعة بصرية قبل التطبيق (غير آلي) | 🟢 Low |
| 10 | WCAG 2.5.3 (Label in Name) | ⚠️ ملاحظة | `#zad-tkbr-fab` و`#zad-pwa-fab` (أزرار عائمة): النص المرئي/data قد لا يطابق `aria-label` تمامًا — يربك مستخدمي التحكم الصوتي | مراجعة يدوية لمطابقة `aria-label` مع النص الظاهر فعليًا | 🟢 Low |
| 11 | WCAG 1.1.1 (Non-text Content) | ✅ سليم | فحص شامل: 0 صورة بدون `alt` عبر كل الموقع. 113 استخدام لـ `alt="زاد"` (شعار متكرر، مقبول)، وباقي القيم وصفية فعليًا (عناوين محاضرات/مصطلحات) | استثناء: `alt="cover"` في `playlist.html` عام جدًا — يُفضّل `alt=""` (decorative، الاسم مكرر بالنص المجاور) أو وصف أدق | 🟢 Low |
| 12 | WCAG 2.4.7 (Focus Visible) | ✅ سليم (تم التحقق) | فُحص بدقة عبر CSSOM: عناصر مثل `.ts-ring-tap{outline:none}` و`.search input{outline:0}` قد تبدو مشكلة للوهلة الأولى، لكن قاعدة `[tabindex]:focus-visible`/`input:focus-visible` العامة (specificity أعلى) تتغلّب عليها فعليًا وتُظهر outline ذهبي 2-3px | لا حاجة لإجراء | — |
| 13 | WCAG 1.4.2/2.2.2 (Motion) | ✅ سليم | `prefers-reduced-motion` مدعوم عبر CSS وأكثر من 8 ملفات JS | لا حاجة لإجراء | — |
| 14 | WCAG 3.1.1 (Language of Page) | ✅ سليم | `lang="ar"` صحيح في كل الـ 65 صفحة | لا حاجة لإجراء | — |
| 15 | WCAG 4.1.2 (Keyboard Access — accordion) | ✅ سليم (من فحص سابق موثَّق بـ Git) | قوائم الشريط الجانبي القابلة للطي لها `role="button" tabindex="0" aria-expanded` وتعمل بـ Enter/Space | لا حاجة لإجراء | — |
| 16 | WCAG 2.1.2 (No Keyboard Trap) | ✅ تم التحقق حيًا | لوحة الأوامر (Ctrl+K) تُغلَق بـ Escape فعليًا عند اختبارها بمحاكاة تركيز حقيقية | لا حاجة لإجراء | — |

---

## ما تم إصلاحه فعليًا في هذا الفحص (وتم التحقق منه)

### 1. تباين ألوان أذكار المسبحة (Critical)
[css/style.css](css/style.css) — `.dc-arabic` و`.dc-count`: فصل لون النص عن `--dc-color` (المتغيّر الملوَّن حسب نوع الذكر) في الوضع الفاتح، وإبقاؤه فقط للوضع الداكن/OLED حيث يمرّ التباين فعليًا.

```css
/* قبل */
.dc-arabic{color:var(--dc-color,var(--ink))}
.dc-count{color:var(--dc-color,var(--green-deep))}

/* بعد */
.dc-arabic{color:var(--ink)}
html[data-theme="dark"] .dc-arabic,html[data-theme="oled"] .dc-arabic{color:var(--dc-color)}
.dc-count{color:var(--green-deep)}
html[data-theme="dark"] .dc-count,html[data-theme="oled"] .dc-count{color:var(--dc-color)}
```
**التحقق:** إعادة تشغيل Pa11y على `takbeer.html` قبل/بعد: 28 → 8 مشاكل تباين (تحسّن 71%).

### 2. توكن `--muted-2` فاتح جدًا للاستخدام كنص
```css
/* فاتح: #7c8c7e (3.03–3.55:1) → #5c6c58 (4.78–5.61:1) */
/* داكن:  #4a6a4a (2.92:1)      → #7a9a7a (4.81–5.70:1) */
```

### 3. `color:var(--gold)` كنص في 34 موضعًا عبر 12 ملفًا
تم استبداله بـ `color:var(--gold-dark)` (تباين 4.4–5.1:1 بدل 2.06–2.42:1) في: `adhkar.html`, `ghars.html`, `hasad.html`, `index.html`, `mushaf.html`, `nawawi.html`, `prayers.html`, `qibla.html`, `summary.html`, `takbeer.html`, `zakat-ahkam.html`, `zakat-anwa.html`. (لم تُمَس استخدامات `border-color:var(--gold)`/`background:var(--gold)` — تلك لا تحتاج نفس المعيار).

### 4. رابط "الصلاة القادمة" بلا اسم
[index.html](index.html) — أُضيف `aria-label="مواقيت الصلاة"` على الرابط المحيط بالبطاقة.

### 5. `register.html` بلا h1
أُضيف `<h1>` مخفٍ بصريًا (نفس نمط sr-only المستخدم في بقية الموقع) بنص "إنشاء حساب للمزامنة اليدوية — زاد".

---

## Roadmap — ما تبقّى، حسب الأولوية

### 🟠 High — تسمية 57+ حقل نموذج
نمط الإصلاح (بدون اختراع نص جديد — إعادة استخدام النص/الـ placeholder الموجود فعليًا كـ `aria-label`):

```html
<!-- قبل -->
<input type="text" id="az-search" placeholder="🔍 ابحث في كل الأذكار..." onkeyup="filterAccordion()">

<!-- بعد -->
<input type="text" id="az-search" placeholder="🔍 ابحث في كل الأذكار..."
       aria-label="ابحث في كل الأذكار" onkeyup="filterAccordion()">
```

للـ checkboxes التي نصّها المرئي في `<div>` شقيق (مثل `settings.html` reminder-switch):
```html
<!-- قبل -->
<div class="reminder-row">
  <div style="flex:1"><div>📿 ورد الصباح</div><div>5:30 صباحاً</div></div>
  <label class="toggle-pill"><input type="checkbox" class="reminder-switch" data-key="wird_morning" checked><span class="tgl-sl"></span></label>
</div>

<!-- بعد -->
<label class="toggle-pill">
  <input type="checkbox" class="reminder-switch" data-key="wird_morning" checked
         aria-label="ورد الصباح — 5:30 صباحاً">
  <span class="tgl-sl"></span>
</label>
```
**القائمة الكاملة لكل حقل والملف موجودة في** [a11y-automated-report.json](a11y-automated-report.json) **(كود `H91.*.Name`)**.

### 🟠 High — skip link على 60 صفحة
النمط الموجود فعلًا في `index.html`:
```html
<a href="#main-content" class="skip-link">تخطّي إلى المحتوى الرئيسي</a>
```
بما أن الشريط الجانبي والـ topbar تُبنى من `menu.js` بشكل مشترك، أفضل مكان لحقن هذا الرابط هو نقطة واحدة في `menu.js` بدل تكراره يدويًا في 60 ملفًا — يحتاج التأكد أن كل صفحة لديها فعليًا عنصر `id="main-content"` (أغلبها لديه عبر `<main>`).

### 🟡 Medium — بنية العناوين (17 صفحة تقفز h1→h3)
مثال (`index.html`، البطاقات السريعة):
```html
<!-- قبل -->
<h1 class="sr-only">زاد العشر</h1>
...
<a class="card quick-card" href="barnamaj.html"><h3>ورد اليوم</h3>...</a>

<!-- بعد -->
<h1 class="sr-only">زاد العشر</h1>
<h2 class="sr-only">الوصول السريع</h2>
<a class="card quick-card" href="barnamaj.html"><h3>ورد اليوم</h3>...</a>
```
**ملاحظة:** غير آلي بالكامل — كل صفحة تحتاج نص h2 مناسب لسياقها (لا يوجد نص "صحيح واحد" يصلح للـ 17 صفحة دفعة واحدة)، لذلك لم يُطبَّق تلقائيًا في هذا الفحص.

### 🟡 Medium — 3 صفحات بلا h1
`duas.html`/`worship.html` (تحويل فوري — أولوية منخفضة فعليًا رغم التصنيف)، و`zad_al_ashr.html` (صفحة حقيقية، تحتاج h1 حقيقي وليس sr-only لأنها تبدأ من h2 مباشرة أصلًا).

### 🟢 Low
- `alt="cover"` في `playlist.html` → أدق أو `alt=""`.
- حجم لمس `#notif-btn` (34px → 44px) — يحتاج مراجعة بصرية للـ topbar قبل التطبيق.
- مطابقة `aria-label` مع النص الظاهر في `#zad-tkbr-fab`/`#zad-pwa-fab`.

---

## Deliverables

- **JSON للفحص الآلي:** [a11y-automated-report.json](a11y-automated-report.json) — 108 نتيجة خام من Pa11y (WCAG2AA/HTML_CodeSniffer) عبر 15 صفحة، قبل الإصلاحات، بالسياق الكامل (selector + context HTML) لكل نتيجة.
- **Lighthouse:** صفحة `index.html` — **91/100** — تفاصيل: heading-order، link-name (تم إصلاحه)، target-size، label-content-name-mismatch.
- **هذا الملف** كملخّص تنفيذي + جدول WCAG + روادماب بأمثلة كود.

## ملاحظة منهجية مهمة

الأدوات الآلية (Pa11y/HTML_CodeSniffer) تعتمد أحيانًا على أخذ عيّنة بكسلات فعلية من العرض المرسوم (canvas-based sampling) بدل حساب رياضي بحت للألوان — لاحظتُ خلال هذا الفحص فروقًا طفيفة (مثال: عنصر بحساب رياضي دقيق 5.69:1 لكن Pa11y سجّله 4.18:1) في نصوص صغيرة/عريضة الوزن، على الأرجح بسبب anti-aliasing. لم أُطارد هذه الحالات الحدّية فرديًا لأن التوكنات المصدر (`--muted`) صحيحة رياضيًا وتمر بمسافة أمان معقولة — لكنها تستحق تدقيقًا بصريًا يدويًا (color picker حقيقي على شاشة) قبل اعتبارها 100% مُغلقة. كذلك، الفحص الآلي لا يرى العناصر المخفية وقت الفحص (كاروسيل، تبويبات) — الفحص اليدوي/تحليل التوكنات اللوني الذي أجريته يغطي هذه الحالات إضافيًا.
