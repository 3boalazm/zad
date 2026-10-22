# استوديو المشاركة — أمثلة

صور مُولَّدة من `js/ui/share-studio.js` نفسه (نفس المحرّك الذي يعمل في المتصفح)
عبر `@napi-rs/canvas`، ثم مصغّرة إلى **٥٤٠ بيكسل** من أصل ١٠٨٠ (JPEG · جودة ٨٢).

| الملف | القالب | اللوحة | المقاس | النقش |
|---|---|---|---|---|
| `01-verse-emerald.jpg` | آية (محراب + ۞) | زمردي | بورتريه ٤:٥ | نجوم إسلامية |
| `02-dua-ivory.jpg` | دعاء | ورقي | بورتريه ٤:٥ | موج |
| `03-hadith-midnight.jpg` | اقتباس/حديث | ليلي | مربع | شبكة |
| `04-achievement-sand.jpg` | إنجاز (شبكة أرقام) | رملي | بورتريه ٤:٥ | نقاط |
| `05-dua-arcs-ink.jpg` | دعاء | حِبري | بورتريه ٤:٥ | أقواس |

## النقوش الخلفية

`prefs.pattern` بياخد واحدة من: `none` · `stars` (إسلامي، الافتراضي) · `dots` · `arcs` · `waves` · `grid`.
كلها تُرسم بأشكال أوليّة (خطوط/دوائر) لا بـ`createPattern(canvas)` — فبتشتغل على كل المتصفحات
وعلى `@napi-rs/canvas` المستخدم في توليد الصور دي.

## المعاينة السريعة

`tools/studio-preview.html` صفحة أدوات (noindex، غير مربوطة بالتطبيق) بتفتح البانل تلقائيًا:

```bash
python3 -m http.server 8080 --bind 0.0.0.0 --directory .
# ثم افتح /tools/studio-preview.html
```

لتوليد صور جديدة بنفس الجودة داخل المتصفح:

```js
ZadStudio.open({ kind: 'verse', eyebrow: 'آية اليوم', body: '…', source: '…' });
// أو بلا واجهة:
const blob = await ZadStudio.toBlob({ kind: 'dua', title: 'دعاء', body: '…' });
ZadStudio.patterns; // ['none','stars','dots','arcs','waves','grid']
```
