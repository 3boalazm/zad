# تقرير تنفيذ — نظام التصميم (زاد)

**تاريخ:** 2026-08-23
**نطاق العمل:** جولتان متتاليتان — (أ) إصلاح P0/P1 من مراجعة حقيقية للـrepository، ثم (ب) بناء فعلي لنظام توكنز/مكوّنات موحَّد بمعنى حرفي (مصدر واحد للحقيقة، عقد component-level، z-index موحَّد، مكوّن Input، حل تعارض الخطوط، حذف كود ميت، إتاحة كل الحوارات المنبثقة الوصولة). كل تعديل في الجولتين تم التحقق منه حيّاً في متصفح (تعيين الثيم فعلياً، فرض reflow، قراءة `getComputedStyle` الفعلية) — لا اعتماد على قراءة الكود وحدها.
**نقطة الرجوع (rollback point):** `2511250d8ef5811741d6c5bcbf22f744b7c192c4` — آخر commit قبل بدء أي من الجولتين. `git revert` لكل commit بالاسم أفضل من `reset --hard` لوجود عمل متزامن من جلسة أخرى على نفس الريبو (انظر §11).

---

## 0. تصحيح مهم سبق الجولة الأولى

الـaudit الذي وصلني قبل بدء العمل كان تحليلاً لصفحة توثيقية ثابتة (`zad-design-system.html`) وليس لتطبيق زاد الحقيقي. كل ما ورد فيه عن انهيار `setTheme()`، غياب الحفظ، غياب bootstrap قبل الرسم، وعدم إمكانية الوصول لـOLED/Excuse — **غير صحيح عن التطبيق الفعلي**. تحقّقت من هذا مباشرة بقراءة الكود الحقيقي قبل تنفيذ أي تعديل.

---

## 1. ملخص تنفيذي

**الجولة الأولى (P0/P1):** Workflow بـ١٤ وكيلاً، إصلاحات تباين ونقاط عمياء متفرقة. ٧ commits.
**الجولة الثانية (النظام الكامل):** بناء مباشر + Workflow بـ٤ وكلاء إضافيين + ترحيل RTL. ١٤ commit.

**الإجمالي: ٢١ commit، ٣٥+ ملفاً معدَّلاً، ٢ ملف محذوف (كود ميت مؤكَّد)، صفر أخطاء syntax، 37/37 اختبار خلفية ناجح طوال الوقت.**

---

## 2. الجولة الأولى — ملخص (تفاصيل كاملة كانت هنا سابقاً، الآن مختصرة)

إصلاح فلاش اللون بعد التحميل، إصلاحات تباين نصّية لتوكنز `--zad-purple/--zad-coral/--zad-gold-700` (لم تكن مغطاة بالوضع الداكن)، تغطية OLED ناقصة في `zad_al_ashr.html`/`tasmee.html`/`kids.html`/`ghars.html`، تحويل نافذة الملف الشخصي إلى dialog حقيقي، زر Escape للقائمة الجانبية، مزامنة مؤشّري الثيم في `settings.html`، حذف `sidebar_overlay_fix.js` الميت. كل هذا مُفصَّل بالـcommits `9137dd6` حتى `4fad628`.

---

## 3. الجولة الثانية — نظام التصميم الحرفي

### 3.1 طبقة الـPrimitives (مصدر واحد للحقيقة)

**المشكلة:** `--zad-green-900/700/500/100` و`--zad-gold-700/500/100` (في `js/design-system.js`) كانت قيماً خاماً مكرَّرة يدوياً، منفصلة تماماً عن نظام `css/style.css`، رغم أن أغلبها نفس اللون بالضبط. هذا بالضبط ما سبَّب أغلب أخطاء الأسبوع الماضي — نسخة تُصلَح والأخرى تُنسى.

**الحل:** أُضيفت طبقة primitives صريحة وموثَّقة في `css/style.css` (`--primitive-green-900/700/500/100`, `--primitive-gold-700/500/100`) — **ثابتة عمداً بلا أي تفاعل مع الثيم**، لأنها تُستخدَم كخلفيات صلبة مع نص أبيض (أزرار/badges)؛ لو صارت متغيّرة مع الثيم لانكسر التباين (تحقَّق: أبيض فوق الأخضر الساطع لوضع الداكن ≈1.85:1). `js/design-system.js` الآن يستعير هذه القيم بدل إعادة كتابتها (`--zad-green-900: var(--primitive-green-900, #0e3b2e)`)، فمصدر التعديل صار واحداً.

`--zad-amber/--zad-coral/--zad-purple` (بلا أي استخدام كخلفية في كل نقاط الاستهلاك المعروفة) استُعيرت مباشرة من توكنز دلالية متوافقة مع الثيم أصلاً (`--sys-orange/--sys-red/--sys-purple`) — أي استخدام جديد لها يرث التوافق مع الداكن/OLED تلقائياً.

**قرار متعمَّد:** توكنز `zad_al_ashr.html`/`kids.html`/`ghars.html` المحلية **لم تُوحَّد** مع هذه الـprimitives — قيمها قريبة لكن غير متطابقة بالضبط (مثال: `#0D3B24` مقابل `#0e3b2e`)، وتقرأ كهوية فرعية مقصودة لكل ميزة، لا انجرافاً عرضياً. توحيدها كان سيغيّر الألوان بصرياً بلا داعٍ حقيقي (مشكلتها الحقيقية — تغطية الثيم — أُصلحت الأسبوع الماضي بالفعل).

### 3.2 عقد Component Tokens (Button/Card/Badge/Progress)

أُضيفت طبقة توكنز على مستوى المكوّن (`--button-primary-bg`, `--card-bg`, `--card-border`, `--progress-fill-from`, إلخ)، وحُوِّلت `.btn-primary/-gold/-ghost/-danger`, `.card`, `.badge`, `.progress` لاستهلاكها بدل قراءة توكنز دلالية مباشرة. كل توكن مكوّن = alias لنفس القيمة القديمة بالضبط — **صفر تغيير بصري** (تحقَّق حيّاً: نفس القيم بالضبط فاتح/داكن قبل وبعد). الفائدة الحقيقية: أي زر/بطاقة one-off مستقبلي يقدر يستهلك نفس العقد بدل إعادة اختراع لونه.

طُبِّق هذا فعلياً على `.scroll-top-btn` (كان يكرر `--green-deep`/`#fff` + override منفصل للداكن/OLED — الآن يستهلك `--button-primary-bg/text` مباشرة، فتغطية الثيم تجيه تلقائياً).

### 3.3 مكوّن Input

لم يكن هناك أي كلاس `.input`/`.field` مشترك في كل الموقع — كل حقل نص كان مكتوباً من الصفر. أُضيف `.input` (منقول من النمط الوحيد الصحيح فعلاً، `.az-add-field input`)، مع `:focus` حقيقي بـCSS بدل `onfocus`/`onblur` JS يدوي. **الاستخدام الفعلي الوحيد المهاجَر:** حقل الاسم في نافذة الملف الشخصي (`js/app.js`) كان مكتوباً بالكامل بـ`style="..."` inline بلا أي كلاس — الآن `class="input"`، سلوك `oninput` محفوظ، تحقَّق حيّاً padding/radius/background/border متطابقة تماماً.

### 3.4 توكينة Z-index (الطبقات المشتركة فقط)

٢٠٢ قيمة z-index متفرقة بالريبو كله — ترحيلها كلها كان بلا فائدة حقيقية (أغلبها محلي لصفحة واحدة ويعمل بلا مشاكل). اقتصر العمل على الطبقات **المشتركة فعلياً** في `css/style.css` حيث حدث تصادم حقيقي مؤكَّد (الملف المحذوف `sidebar_overlay_fix.js` كان يتصادم مع `.sidebar`): السايدبار، الأوفرلاي، التوست، الشريط العلوي على الموبايل، `.fab-ai`، `.search-overlay`، `.notif-dropdown`، `.reading-progress-bar`. نفس القيم الرقمية بالضبط، الآن بأسماء (`--z-sidebar`, `--z-toast`, إلخ).

### 3.5 حل تعارض الخط (h1/h2/h3)

`css/style.css` و`css/premium-ui.css` كان لكل منهما قاعدة `!important` لـ`h1,h2,h3` (زائد `.page-title`/`.section-title`) بخطّين مختلفين — `premium-ui.css` كان يفوز دائماً لأنه يُحمَّل ثانياً، بغضّ النظر عن تعليق "FONT SYSTEM — FINAL" في الملف الأول. أُزيلت القاعدة الخاسرة (الخمسة عناصر المتداخلة فقط) من `style.css` — H4-H6 والعناصر المركَّبة الأخرى (`.hero h1`, `.card h3`) غير متأثرة أصلاً فتُركت كما هي. تحقَّق حيّاً: h1 لا يزال ThmanyahDisplay، h4 لا يزال ThmanyahSans — **صفر تغيير بصري**، فقط توقّف الصراع الصامت.

بالمناسبة اكتُشف: أربعة ملفات خط (`.otf`) كانت تُحمَّل على كل صفحة بلا أي استخدام فعلي إطلاقاً (`ThmanyahSerifDisplay` في style.css، `ThmanyahText` في premium-ui.css) — حُذفت تعريفاتها (`@font-face`) والتوكن اليتيم `--font-display` معها.

### 3.6 حذف الكود الميت

`ZadDesign.Components` (`js/ui/design-tokens.js`) — نظام كامل لبناء `.zd-card`/`.zd-btn`/`.zd-badge`/`.zd-modal` عبر JS، مُحمَّل على ~٥٠ صفحة، **بلا أي استدعاء واحد في كل الريبو** (تحقَّق مرتين — مرة في الجولة الأولى كـfinding، ومرة إعادة تحقّق مستقلة قبل الحذف الفعلي). حُذف الـbuilder فقط (٥٨ سطر)؛ `TOKENS`, `applyTokens()`, `watchTheme()`, `A11y` — كلها لا تزال تعمل بلا تغيير (تحقَّق حيّاً: `ZadDesign.applyTokens('dark')` لا يزال يغيّر `--bg` بشكل صحيح).

**غير مكتمل عمداً:** `injectComponentCSS()` (تولّد CSS الـ`.zd-*` نفسه) لم تُحذف — أصبحت الآن كوداً بلا أي استهلاك حتى من JS، لكنها خارج نطاق هذا التعديل تحديداً؛ حذفها تنظيف صغير منفصل متبقٍّ.

### 3.7 إتاحة كل الحوارات المنبثقة الوصولة

بعد نافذة الملف الشخصي (الجولة الأولى)، أُضيفت نفس المعاملة (Escape / نقر الخلفية / استرجاع التركيز) لكل حوار حقيقي آخر وصول بالموقع:
- `.zt-card` (نافذة التكبير السريعة، `menu.js` — مشتركة عبر كل صفحة تحمّل menu.js)
- `.jr-box` (`kids-school.html`), `.hs-box` و`.hc-box` (`kids-heroes.html`)

`.hc-box` تحديداً قرار دقيق: تفتح تلقائياً بلا زر تشغيل، وزرّها الوحيد "أتعهّد" فعل غير آمن للتركيز التلقائي عليه (قد يُفعَّل بالخطأ بـEnter) — فالتركيز عند الإغلاق بـEscape/الخلفية يذهب للصندوق نفسه لا للزر، والإغلاق بغير زر التعهّد **لا يسجّل الموافقة**، مطابقاً للسلوك الأصلي.

### 3.8 قرارات "لا تغيير" موثَّقة (لا إهمال)

- **`sync.html`'s `.btn-danger`**: الصفحة لا تحمّل نظام التصميم المشترك إطلاقاً — لها توكنز ومكوّنات خاصة بها بالكامل (نمط GitHub-dark)، و`.btn-danger` هنا عضو متّسق من عائلة `.badge.ok/.warn/.fail` بنفس الصيغة. **لا تضارب حقيقي، تُركت كما هي.**
- **`profile.html`'s `.pf-btn-danger`**: عائلة أزرار كاملة خاصة بالصفحة (`.pf-btn-primary/-ghost/-danger`) بشكل مربّع متّسق مع بقية عناصر الصفحة، مختلف عمداً عن شكل `.btn` الدائري المشترك. تحويلها كان سيكسر الاتساق مع الأزرار المجاورة لها مباشرة. تباينها في الداكن/OLED (المُصلَح الأسبوع الماضي) أُعيد التحقّق منه حيّاً: 5.44:1 (فاتح), 6.68:1 (داكن), 7.63:1 (OLED) — كلها تتجاوز AA بهامش مريح.

### 3.9 ترحيل RTL لـ logical properties — بدأ فعلياً (لم يكن مؤجَّلاً بعد الآن)

**اكتشاف جذري أثناء التحويل:** `css/style.css`'s `html,body{...}` كان يفرض `direction:rtl` مباشرة بـCSS، بمعزل تام عن attribute الـ`dir`. النتيجة: تبديل اللغة للإنجليزية/الفرنسية عبر `lang.js` (اللي بيغيّر `document.documentElement.dir='ltr'` بشكل صحيح) **ما كانش بيغيّر خاصية `direction` الفعلية إطلاقاً** — القيمة كانت تفضل `rtl` دايماً بغض النظر عن الـattribute. ده بالظبط سبب وجود override يدوي بـpixel فعلي (`left`/`right`) للقائمة الجانبية على الموبايل بدل الاعتماد على logical properties من الأساس — المطوّر الأصلي كان مضطر لكده لأن `direction` نفسها كانت "مكسورة". اتحذف الفرض (`<html dir="rtl">` أصلاً موجودة بشكل افتراضي بكل الصفحات فمفيش داعي لتكرارها بـCSS)، واتحقق حيّاً إن `direction` بقت فعلاً بتتبع الـattribute صح في الاتجاهين.

بعد الإصلاح ده، اتحوّلت أول دفعة من القيم الفعلية (`left`/`right`/`margin-left`/`margin-right`/`border-right`/`padding-right`) لـlogical properties (`inset-inline-*`, `margin-inline-*`, `border-inline-*`, `padding-inline-*`) — القائمة الجانبية والمحتوى الرئيسي (كان بدون أي دعم LTR على الديسكتوب إطلاقاً قبل كده!)، `.scroll-top-btn` (توحيد override كان موجود بالفعل)، وأنماط "الشريط الجانبي الملوّن" المتكرّرة (`.timeline`, `.rules li`, `.az-meaning`, `.summary-block`, `.drop-cap`)، بالإضافة لتوحيدات رمزية (`inset-inline` بدل `left`+`right` منفصلين لعناصر متماثلة أصلاً).

كل تحويل اتحقق منه **باتجاهين فعليين حيّاً** (`dir="rtl"` ثم `dir="ltr"` على نفس العنصر، قراءة `getComputedStyle` بعد كل تبديل) — مش قراءة كود بس. القيم في RTL طابقت السلوك الأصلي تماماً؛ في LTR القائمة الجانبية والمحتوى بقوا فعلاً بينعكسوا لأول مرة على الديسكتوب.

**استُثنيت عمداً** (موثَّقة، مش منسية): `.fast-day.arafah`'s شارة النجمة، `.notif-dot`، `.fab-ai` (ركن ثابت يبدو مقصوداً)، مثلث ▶ التشغيل في `.dhikr-card` (رمز اتجاهي عالمي، عادة ثابت بغض النظر عن اتجاه اللغة)، علامة الاقتباس الزخرفية في `.key-quote`، بسملة الخلفية في `.hijri-bar`، وشريط `.pyramid-lead` (تعقيد إضافي بسبب زوايا border-radius غير المتماثلة). كل دول قرارات تصميمية غامضة تحتاج فحصاً بصرياً حقيقي (لقطة شاشة مقارنة) قبل التحويل، ولم يتوفّر لي وسيلة تصوير موثوقة لمقارنة RTL/LTR بصرياً هذه الجلسة — الاعتماد كان على `getComputedStyle` فقط.

---

## 4. ما تبقّى مؤجَّلاً عمداً (بعد الجولتين)

| البند | لماذا |
|---|---|
| توحيد الأزرار/الشارات/الـprogress "one-off" المتبقية (~١٤ كلاساً: `.az-btn-count`, `.wird-complete-btn`, `.dc-day-task-btn`, `.vid-action-btn`, إلخ) | كلها مُصلَحة تباينياً بالفعل من تمريرات سابقة (تحقَّق فردي لكل واحد وقتها) — الترحيل لعقد المكوّن الآن قيمته معمارية بحتة، بلا فائدة إصلاح خلل فعلي، وبمخاطرة تعديل ١٤ موضعاً بلا أداة visual-regression. |
| باقي ترحيل RTL لـlogical properties (٧ حالات متبقية زخرفية: شارة نجمة `.fast-day.arafah`, `.notif-dot`, `.fab-ai`, مثلث ▶ التشغيل، علامة الاقتباس الزخرفية، بسملة الخلفية، شريط `.pyramid-lead`) | **بدأ فعلياً هذه الجلسة (§3.9)** — الحالات الواضحة (٢٢ منها، بما فيها اكتشاف واكتشاف/إصلاح جذري لخلل `direction:rtl`) اتحوّلت واتحقّق منها حيّاً باتجاهين. المتبقّي حالات زخرفية غامضة (ركن ثابت مقصود؟ أو يجب أن ينعكس؟) تحتاج فحصاً بصرياً حقيقي (لقطة شاشة) لا رقمياً فقط — لم يتوفّر لي وسيلة تصوير موثوقة هذه الجلسة. |
| حذف `injectComponentCSS()` نفسها (باقي كود `.zd-*` الميت في `js/ui/design-tokens.js`) | تنظيف صغير متبقٍّ، خارج نطاق §3.6 كما نُفِّذت. |
| ربط زر "زهرة/العذر" من صفحة الإعدادات | قرار منتج، ليس تقنياً. |
| `/api/gemini` بلا route | موثَّق بالكامل في `QA-FINDINGS-2026-08-23.md`، يحتاج قرار بنية تحتية. |

---

## 5. الاختبارات ونتائجها (بعد الجولتين معاً)

- **Syntax/brace check** على كل ملفات CSS/JS المعدَّلة: **PASS** بلا استثناء (أُعيد تشغيله بعد كل commit تقريباً، ومرة أخيرة شاملة في نهاية الجلسة).
- **اختبارات الباك-إند** (`npm test`): **37/37 PASS** ثابتة طوال الجلسة (لا لمس لأي كود خلفي في أي من الجولتين).
- **تحقق حيّ بالمتصفح**: كل تعديل (توكن، مكوّن، z-index، خط، حوار) تحقَّق منه فعلياً بـ`getComputedStyle` بعد فرض reflow — فاتح/داكن/OLED حسب الحالة. عدة تعديلات (Escape، نقر الخلفية، التركيز) اختُبرت وظيفياً حيّاً (فتح فعلي، ضغط مفتاح فعلي، تأكيد النتيجة) لا افتراضاً.
- **لم يُشغَّل:** build (لا يوجد لهذا الموقع الثابت)، lint (لا إعداد موجود بالريبو)، screenshot/visual-regression تلقائي (لا أداة مثبَّتة).

---

## 6. UNKNOWN / عناصر متبقية

- التأثير البصري الدقيق لتوحيد الأزرار المتبقية غير المُرحَّلة (§4) لم يُقيَّم — حكم هندسي بناءً على أنها مُصلَحة تباينياً بالفعل، لا فحص شامل جديد.
- z-index خارج الطبقات المشتركة (كل الـ٢٠٢ ناقص الـ١١ المُرحَّلة) لم يُفحص فردياً لتصادمات محتملة — افتراض معقول لا يقين كامل.

---

## 7. افتراضات اتُّخذت بدل الأسئلة

- طبقة الـprimitives الجديدة سُمِّيت `--primitive-*` بدل أي اسم علامة تجارية — قرار تسمية محايد، موثَّق داخل الكود نفسه.
- عند تعارض الخط، اعتُبر `premium-ui.css` (الأحدث تاريخياً حسب `git log`، الأحمّل ثانياً، الفائز الفعلي دائماً) هو النيّة الحالية الصحيحة، لا `style.css`'s "FINAL" الأقدم زمنياً والمُتجاوَز فعلياً.
- `.hc-box`'s سلوك التركيز عند الإغلاق غير المُشغَّل بزر (يذهب للصندوق لا لعنصر body) قرار متعمَّد لتفادي submit عرضي، موثَّق في §3.7.

---

## 8. Rollback strategy

كل commit مستقل ومنفصل الاهتمام. قائمة الجولة الثانية بالترتيب:

```
807eb80  Start canonical token architecture: single-source primitives for the brand green/gold family
efd7ff9  Add a Button/Card/Badge/Progress component-token contract
fe3b953  Tokenize the shared z-index stacking layers
46a8e17  Add a canonical .input component, migrate the profile modal off inline styles
14cacb4  Resolve the h1/h2/h3 font !important conflict, drop 4 unused @font-face downloads
f677517  Migrate .scroll-top-btn onto the button component-token contract
48c7d04  Remove the dead ZadDesign.Components builder
f29ceca  Add focus management to kids-school.html/kids-heroes.html's dialogs
d19d556  Make the shared quick-takbeer popup an accessible dialog
4f59d62  Start RTL logical-properties migration, fix a direction:rtl hardcode that silently broke LTR mode site-wide
```
(الجولة الأولى: `9137dd6` حتى `4fad628`، مذكورة بالتقرير الأصلي أعلاه في §2. commits `8bfcfe7`/`07418c2`/`ef24961` المتفرقة بين هذه — عمل جلسة متزامنة منفصلة على نفس الريبو، WCAG audit، غير مرتبط بهذا العمل.)

---

## 9. الثقة في النتائج

| الاستنتاج | الثقة |
|---|---|
| طبقة الـprimitives الجديدة صفر تغيير بصري | عالية جداً — تحقَّق حيّاً بقيم رقمية مطابقة تماماً قبل/بعد |
| عقد component tokens صفر تغيير بصري | عالية جداً — نفس المنهجية |
| حل تعارض الخط صفر تغيير بصري | عالية — تحقَّق حيّاً على h1 وh4 |
| كل حوار مُصلَح فعلاً accessible (Escape/تركيز) | عالية — اختبار وظيفي حيّ لكل واحد، لا افتراض |
| حذف الكود الميت لا يكسر شيئاً | عالية — إعادة تحقّق مستقلة قبل الحذف + اختبار حيّ بعده |
| لا يوجد تراجع (regression) في أي سلوك | عالية — 37/37 اختبار خلفي ثابت، syntax نظيف، لا تعارض ملفات مع الجلسة المتزامنة (تحقَّق بـ`git status`/`git diff` قبل كل commit) |
| تحويلات RTL logical properties صحيحة باتجاهين | عالية — كل تحويل تحقَّق منه فعلياً بـ`dir="rtl"` ثم `dir="ltr"` على نفس العنصر، مش قراءة كود بس (اكتُشف بسبب هذا التحقق نفسه أن `direction:rtl` كان مفروضاً بـCSS بمعزل عن الـattribute) |
| الحالات الزخرفية المتبقية (٧) المؤجَّلة صح تصنيفها | متوسطة — حكم هندسي بلا فحص بصري فعلي (لقطة شاشة)، الاعتماد كان على المنطق فقط |

---

```
IMPLEMENTATION STATUS:
- Code changes: COMPLETE for scoped items (canonical primitive/component/z-index token layers, Input component, typography conflict, dead-code removal, full dialog accessibility coverage, direction:rtl root-cause fix + first RTL logical-properties pass) — PARTIAL overall (7 decorative RTL cases and full one-off-component migration deliberately deferred, see §4)
- Build: N/A (no build step for this static site)
- Tests: PASS (37/37 backend, 0 changed across all rounds; all touched CSS/JS syntax-clean)
- Theme matrix: PASS for every token/component touched (light/dark/oled verified live); PARTIAL overall (no automated cross-page matrix exists)
- Accessibility: Every reachable real dialog in the app (profile modal, quick-takbeer popup, 3 kids-page dialogs) now has role/aria-modal/Escape/backdrop-click/focus-restore — Input component gap closed for its one concrete instance; broader one-off component migration still PARTIAL
- RTL/LTR: direction:rtl hardcode removed (was silently defeating language-switch on every page); sidebar+main now correctly mirror in LTR on desktop for the first time; verified live in both directions, not just RTL
- Remaining blockers: /api/gemini has no backend route (infra/product decision, pre-existing, documented in QA-FINDINGS-2026-08-23.md)
- Rollback point: 2511250d8ef5811741d6c5bcbf22f744b7c192c4
```
