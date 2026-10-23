/* ══════════════════════════════════════════════════════════
   زاد — Complete i18n System (AR / EN / FR / ID / UR / BN / TR)
   • واجهة المستخدم: ترجمة ثابتة (بدون API، تعمل أوفلاين).
   • الأذكار: ترانزليتريشن + معنى منسوخ يدوياً (لا ترجمة آلية للنص الشرعي).
   • القرآن/الحديث: استخدم تراجم معتمدة عبر API (alquran.cloud) — لا تُترجم آلياً.
   ══════════════════════════════════════════════════════════ */

const TRANSLATIONS = {
ar: {
  /* ─ App shell ─────────────────────────────────────────── */
  'brand.name': 'زاد', 'brand.sub': 'رفيق العبادة والخير',
  'common.darkMode': '🌙 الوضع الداكن', 'common.language': '🌐 اللغة',
  'common.search': 'ابحث في التطبيق...', 'common.noAds': 'يعمل بدون إنترنت 📴',
  'common.done': '✅ تم', 'common.reset': 'إعادة', 'common.save': 'حفظ', 'common.send': 'إرسال',
  /* ─ Nav ────────────────────────────────────────────────── */
  'nav.dashboard':'لوحة التحكم','nav.virtues':'فضائل العشر',
  'nav.worship':'جدول العبادات','nav.mushaf':'الورد القرآني',
  'nav.tasbih':'المُسبِّح والمُكبِّر','nav.adhkar':'الأذكار والدعاء',
  'nav.odhiya':'دليل الأضحية','nav.arafah':'يوم عرفة',
  'nav.sadaqah':'الصدقة والبر','nav.badges':'أوسمتي',
  'nav.hasad':'حصاد العبادات','nav.kids':'وضع الأطفال',
  'nav.tasmee':'تسميع القرآن','nav.ai':'تدبّر بالذكاء',
  'nav.settings':'الإعدادات','nav.report':'بلاغ مشكلة','nav.about':'عن التطبيق',
  /* ─ Index ──────────────────────────────────────────────── */
  'index.title':'زاد اليومي','index.sub':'تابع وردك اليومي وعباداتك ومواسم الخير في مكان واحد',
  'index.install.title':'ثبّت التطبيق','index.install.sub':'يعمل بدون إنترنت في المصلى',
  'index.notif.title':'فعّل تذكيرات الصلاة','index.notif.sub':'لا تفوّت وردك في هذه الأيام المباركة',
  'index.countdown':'العد التنازلي',
  'index.hours':'ساعات','index.mins':'دقائق','index.secs':'ثوانٍ',
  'index.stat.takbeer':'إجمالي التكبيرات','index.stat.juz':'أجزاء من الختمة',
  'index.stat.pray':'صلوات في جماعة','index.stat.wird':'إنجاز الورد',
  'index.start':'ابدأ يومك الآن',
  'index.grid.worship':'ورد اليوم','index.grid.worship.sub':'تابع جدول عباداتك',
  'index.grid.mushaf':'اقرأ القرآن','index.grid.mushaf.sub':'متابعة خطة الختمة',
  'index.grid.tasbih':'كبّر الله','index.grid.tasbih.sub':'عداد التكبير المطلق',
  'index.grid.tasmee':'تسميع القرآن','index.grid.tasmee.sub':'تصحيح التلاوة بالذكاء',
  'index.grid.ai':'تدبّر بالذكاء','index.grid.ai.sub':'اسأل عن آيات وأحكام',
  'index.grid.badges':'أوسمتي','index.grid.badges.sub':'إنجازاتك الروحانية',
  /* ─ Worship ────────────────────────────────────────────── */
  'worship.title':'جدول العبادات اليومي','worship.sub':'الله يرى كل خير تعمله',
  'worship.label':'عبادة',
  'worship.fajr':'صلاة الفجر في جماعة','worship.zuhr':'صلاة الظهر في جماعة',
  'worship.asr':'صلاة العصر في جماعة','worship.maghrib':'صلاة المغرب في جماعة',
  'worship.isha':'صلاة العشاء في جماعة','worship.rawatib':'السنن الرواتب',
  'worship.duha':'صلاة الضحى','worship.qiyam':'قيام الليل',
  'worship.morning':'أذكار الصباح','worship.evening':'أذكار المساء',
  'worship.takbeer':'تكبير','worship.tawbah':'تجديد التوبة والنية',
  'worship.fasting.title':'الأيام التسعة','worship.fasting.sub':'انقر لتسجيل الصيام',
  'worship.save':'حفظ التقدم','worship.notif':'تذكيرات الورد',
  /* ─ Tasbih ─────────────────────────────────────────────── */
  'tasbih.title':'المُسبِّح والمُكبِّر','tasbih.tap':'اضغط للذكر',
  'tasbih.reset.current':'إعادة الحالي','tasbih.reset.all':'إعادة الكل',
  'tasbih.hint1':'المسبحة تعدّ له تلقائياً','tasbih.hint2':'مفتاح المسافة يُسبّح',
  'tasbih.subhan':'سبحان الله','tasbih.hamd':'الحمد لله',
  'tasbih.tahlil':'لا إله إلا الله','tasbih.takbir':'الله أكبر',
  'tasbih.hawqala':'لا حول ولا قوة','tasbih.istigfar':'أستغفر الله',
  'tasbih.salawat':'الصلاة على النبي',
  'tasbih.laps':'إجمالي الدورات',

  /* ─ Index extra ──────────────────────────────────────────── */
  'index.stats':'إحصائيات اليوم',
  'index.days':'أيام','index.hero.heading':'إلى يوم عرفة المبارك',
  'index.hero.sub':'اغتنم ساعات هذه الأيام — فما من أيام العمل الصالح أحبّ إلى الله من هذه الأيام العشر.',
  'index.progress.title':'مؤشر الالتزام الروحاني','index.progress.lbl':'إنجاز',
  'index.progress.heading':'جدول العبادات اليومي',
  'index.progress.li1':'الصلوات الخمس في جماعة','index.progress.li2':'السنن الرواتب والذكر',
  'index.progress.li3':'صيام النهار','index.progress.li4':'التكبير والاستغفار',
  'index.verse.title':'آية اليوم','common.install':'تثبيت',
  /* ─ Fadael ────────────────────────────────────────────────── */
  'fadael.title':'لماذا هذه الأيام؟','fadael.sub':'أدلة الفضل من القرآن والسنة الصحيحة',
  'fadael.q1.src':'سورة الفجر 1-2','fadael.q1.note':'أقسم الله بها — والله لا يُقسم إلا بعظيم.',
  'fadael.q2.src':'سورة الحج — 28','fadael.q2.note':'قال المفسرون: هي عشر ذي الحجة.',
  'fadael.sunnah':'من السنة النبوية',
  'fadael.h1.title':'أحبّ الأيام إلى الله','fadael.h1.src':'رواه البخاري (969)',
  'fadael.h2.title':'يوم النحر أعظم الأيام','fadael.h2.src':'رواه أبو داود (1765) وصححه الألباني',
  'fadael.compare':'مقارنة فقهية',
  'fadael.day.title':'نهار العشر','fadael.day.desc':'أفضل أيام السنة مطلقاً لاجتماع أمهات العبادات.',
  'fadael.day.tag':'الأفضل نهاراً',
  'fadael.night.title':'ليالي رمضان الأواخر','fadael.night.desc':'أفضل ليالي السنة لما فيها من ليلة القدر.',
  'fadael.night.tag':'الأفضل ليلاً',
  'fadael.features':'الخصائص الكبرى',
  'fadael.feat1':'أقسم الله بها في كتابه الكريم.',
  'fadael.feat2':'فيها يوم عرفة — يوم إكمال الدين وإتمام النعمة.',
  'fadael.feat3':'فيها يوم النحر — أعظم الأيام عند الله.',
  'fadael.feat4':'العمل الصالح فيها أحبّ إلى الله حتى من الجهاد.',
  'fadael.feat5':'اجتماع الصلاة والصيام والحج والأضحية لا يكون إلا فيها.',
  'fadael.feat6':'صيام يوم عرفة يكفّر ذنوب سنتين — ماضية وقادمة.',
  /* ─ Worship extra ─────────────────────────────────────────── */
  'worship.obligatory':'الفرائض','worship.sunnah':'السنن والنوافل',
  'worship.dhikr.title':'الذكر والصيام',
  'worship.sub':'اعقد النية وابدأ — الله يرى كل خير تعمله',
  'worship.fajr.meta':'فجر','worship.zuhr.meta':'ظهر','worship.asr.meta':'عصر',
  'worship.maghrib.meta':'مغرب','worship.isha.meta':'عشاء',
  'worship.duha.meta':'4 ركعات','worship.qiyam.meta':'يعدل قيام ليلة القدر',
  'worship.rawatib':'السنن الرواتب — 12 ركعة',
  'worship.takbeer100':'تكبير 100 مرة',
  'worship.fasting.hint':'⭐ = يوم عرفة · انقر لتسجيل الصيام',
  'worship.day':'يوم','worship.arafah.lbl':'عرفة',
  'worship.prog.prefix':'0 من',
  /* ─ Mushaf extra ──────────────────────────────────────────── */
  'mushaf.plans.title':'خطط الختمة','mushaf.wird.title':'ورد اليوم',
  'mushaf.tomorrow.title':'ورد الغد','mushaf.reset.title':'إعادة تعيين',
  /* ─ Tasbih extra ──────────────────────────────────────────── */
  'tasbih.sub':'أحط نفسك بذكر الله في كل لحظة',
  'tasbih.formulas.title':'صيغ التكبير المأثورة',
  'tasbih.daily.title':'أذكار اليوم',
  /* ─ Adhkar ─────────────────────────────────────────────── */
  'adhkar.title':'الأذكار والدعاء','adhkar.sub':'ذكر الله شفاء القلوب',
  'adhkar.tab.morning':'الصباح','adhkar.tab.evening':'المساء',
  'adhkar.tab.ashra':'العشر','adhkar.tab.custom':'مخصص',
  'adhkar.count':'عدّ','adhkar.reset':'إعادة',
  'adhkar.add.title':'أضف ذكراً مخصصاً',
  'adhkar.add.placeholder':'اكتب الذكر بالعربية...',
  'adhkar.add.name':'الاسم','adhkar.add.target':'الهدف',
  'adhkar.add.btn':'إضافة',
  /* ─ Mushaf ─────────────────────────────────────────────── */
  'mushaf.title':'مصحف العشر','mushaf.sub':'انقر على الخطة للاختيار',
  'mushaf.plan.full':'الختمة الكاملة','mushaf.plan.juz':'جزء يومياً',
  'mushaf.plan.pages':'صفحات يومياً',
  'mushaf.complete.btn':'أنهيت وردي اليوم',
  'mushaf.complete.done':'أحسنت — وردك اليوم مكتمل ✅',
  'mushaf.tomorrow':'ورد الغد','mushaf.locked':'يُفتح بعد إتمام ورد اليوم',
  'mushaf.font':'حجم الخط','mushaf.add.juz':'أضف جزءاً مكتملاً',
  /* ─ Arafah ─────────────────────────────────────────────── */
  'arafah.title':'يوم عرفة','arafah.sub':'البرنامج الكامل',
  'arafah.countdown.h':'ساعة','arafah.countdown.m':'دقيقة','arafah.countdown.s':'ثانية',
  'arafah.loading':'جارٍ التحميل','arafah.approx':'تقريبي',
  'arafah.milestones':'المسار الزمني التفاعلي',
  'arafah.dhikr.tap':'انقر للذكر','arafah.done':'محطات مكتملة',
  'arafah.virtue.title':'فضل صيام يوم عرفة',
  'arafah.bonus':'أعمال جانبية مستحبة',
  'arafah.share':'مشاركة إنجاز يوم عرفة',
  /* ─ Odhiya ─────────────────────────────────────────────── */
  'odhiya.title':'دليل الأضحية','odhiya.sub':'أحكام مصوّرة للمضحّي',
  'odhiya.reminder.title':'تذكير المضحّي — أهم نقطة!',
  'odhiya.reminder.btn':'فعّل تذكير عدم القص 🔔',
  'odhiya.guide.title':'خطوات الأضحية — دليل مصوّر',
  'odhiya.step1':'النية والعزم','odhiya.step2':'اختيار الأضحية السليمة',
  'odhiya.step3':'وقت الذبح','odhiya.step4':'دعاء الذبح',
  'odhiya.step5':'توزيع الأضحية','odhiya.age.title':'السن الشرعي للأضحية',
  'odhiya.defects':'العيوب المانعة من الإجزاء',
  /* ─ Sadaqah ────────────────────────────────────────────── */
  'sadaqah.title':'الصدقة والبر','sadaqah.sub':'اختر بابك اليوم',
  'sadaqah.log':'سجّل هذا العمل','sadaqah.done':'تم التسجيل ✅',
  /* ─ Badges ─────────────────────────────────────────────── */
  'badges.title':'أوسمتي والإنجازات','badges.sub':'أعمال البر — الأجر عند الله',
  'badges.earned':'المكتسبة','badges.streak':'يوم متتالي من الالتزام 🔥',
  /* ─ Hasad ──────────────────────────────────────────────── */
  'hasad.title':'حصاد العبادات','hasad.sub':'إحصائيات أدائك والتزامك بالعبادات والطاعات',
  'hasad.zad':'رصيد الزاد','hasad.streak':'الشريط الزمني',
  'hasad.streak.cta':'ابدأ Streak لزيادة نقاطك!',
  'hasad.heatmap':'مسار الأداء والالتزام',
  'hasad.share':'مشاركة الحصاد','hasad.share.btn':'شارك حصادك',
  'hasad.complete':'مكتمل','hasad.days.left':'أيام متبقية',
  /* ─ Kids ───────────────────────────────────────────────── */
  'kids.title':'وضع الأطفال','kids.story':'قصة العشر',
  'kids.prev':'السابقة','kids.next':'التالية',
  'kids.quiz.title':'مسابقة العشر','kids.quiz.sub':'أسئلة ممتعة للصغار',
  'kids.tasbih.title':'تكبيرات للصغار',
  /* ─ Tasmee ─────────────────────────────────────────────── */
  'tasmee.title':'تسميع القرآن','tasmee.sub':'اختر الآية للتسميع',
  'tasmee.start':'اضغط الميكروفون وابدأ التسميع',
  'tasmee.accuracy':'دقة التلاوة',
  'tasmee.tip1.title':'تأكد من إخراج الحروف','tasmee.tip2.title':'بيئة هادئة',
  'tasmee.tip3.title':'الصوت العادي','tasmee.tip4.title':'المتصفح المناسب',
  /* ─ AI ──────────────────────────────────────────────────── */
  'ai.title':'تدبّر بالذكاء','ai.sub':'اسأل عن الآيات والأحكام والعبادات',
  'ai.placeholder':'اكتب سؤالك هنا...','ai.send':'إرسال',
  'ai.greeting':'مرحبًا في مساعد زاد الذكي 🕌',
  'ai.questions.title':'أسئلة مقترحة',
  /* ─ Report ─────────────────────────────────────────────── */
  'report.title':'بلاغ مشكلة','report.sub':'أعنّا على تحسين زادك الروحي',
  'report.type':'نوع البلاغ','report.type.select':'— اختر نوع المشكلة —',
  'report.type.content':'خطأ في المحتوى (ذكر، حديث، آية)',
  'report.type.tech':'مشكلة تقنية (الصفحة لا تفتح، عطل في الأداة)',
  'report.type.ui':'مشكلة في الواجهة (خط، ألوان، تنسيق)',
  'report.type.feature':'اقتراح ميزة جديدة',
  'report.type.perf':'بطء في التحميل أو الأداء',
  'report.type.other':'أخرى',
  'report.page':'أين واجهتك المشكلة؟',
  'report.desc':'وصف المشكلة بالتفصيل',
  'report.screenshot':'لقطة شاشة (اختياري)',
  'report.email':'بريدك الإلكتروني (اختياري)',
  'report.submit':'إرسال التقرير','report.copy':'نسخ التقرير',
  'report.privacy':'الأمانة الرقمية',
  /* ─ Settings ────────────────────────────────────────────── */
  'settings.title':'الإعدادات','settings.sub':'التخصيص لك وحدك',
  'settings.lang':'اللغة / Language','settings.langSub':'اختر لغة التطبيق',
  'settings.theme.title':'المظهر','settings.dark':'الوضع الداكن',
  'settings.dark.sub':'مريح للعين أثناء قيام الليل',
  'settings.oled':'OLED أسود حقيقي','settings.oled.sub':'يوفّر بطارية الشاشات',
  'settings.font.title':'حجم الخط','settings.font.quran':'حجم خط القرآن',
  'settings.notif.toggle':'تفعيل الإشعارات','settings.notif.wird':'تذكير الورد والعبادات',
  'settings.notif.arafah':'تذكير ساعة إجابة عرفة',
  'settings.pwa':'تثبيت التطبيق','settings.pwa.sub':'يعمل بدون إنترنت في المصلى',
  'settings.data.title':'البيانات','settings.data.encrypted':'بياناتك مشفّرة محلياً',
  'settings.data.noads':'صفر إعلانات','settings.data.noads.sub':'خشوع رقمي بلا مشتّتات',
  'settings.data.reset':'مسح جميع البيانات',
  /* ─ About ───────────────────────────────────────────────── */
  'about.title':'عن التطبيق','about.sub':'زاد — رفيقك الذكي في العبادة والخير',
  'about.dev':'مصطفى أبو العزم',
  'about.dev.title':'مصمم واجهات · مطور تطبيقات ويب · مبتكر تجربة المستخدم',
  'about.contact':'تواصل معي','about.social':'تابعني على',
  'about.app.title':'عن زاد','about.sources':'المصادر الشرعية',
  'about.tech':'التقنيات المستخدمة',
  'zh.afterTpl': 'بعد {n} دقيقة · {t}',
  'zh.now': 'الآن — الله أكبر',
  'zh.nextPrayerTpl': 'صلاة {p}',
  'zh.special': 'وضعك الخاص مُفعَّل',
  'zh.specialSub': 'الصلاة والصيام معذورة، ووِردك باقٍ',
  'zh.specialDayTpl': 'اليوم {d} — الصلاة والصيام معذورة، ووِردك باقٍ',
  'zh.morningSub': 'دقيقتان تحفظان يومك',
  'zh.eveningSub': 'قبل أن يغيب النهار',
  'zh.streak': 'ابدأ سلسلتك',
  'zh.streakSub': 'تسليمة واحدة تكفي لتبدأ',
  'zh.complete': 'أكمل صلواتك',
  'zh.completeSubTpl': '{n} من ٥ حتى الآن',
  'zh.wird': 'وردك القرآني',
  'zh.wirdSub': 'صفحة واحدة اليوم تُنير غدك',
  'zh.nowLabel': 'الآن',
},
en: {
  /* ─ App shell ─────────────────────────────────────────── */
  'brand.name': 'Zad', 'brand.sub': 'Worship & Good Deeds Companion',
  'common.darkMode': '🌙 Dark Mode', 'common.language': '🌐 Language',
  'common.search': 'Search the app...', 'common.noAds': 'Works offline 📴',
  'common.done': '✅ Done', 'common.reset': 'Reset', 'common.save': 'Save', 'common.send': 'Send',
  /* ─ Nav ─────────────────────────────────────────────────── */
  'nav.dashboard':'Dashboard','nav.virtues':'Virtues of the 10 Days',
  'nav.worship':'Worship Tracker','nav.mushaf':'Quran Recitation',
  'nav.tasbih':'Tasbih Counter','nav.adhkar':'Dhikr & Supplications',
  'nav.odhiya':'Sacrifice Guide','nav.arafah':'Day of Arafah',
  'nav.sadaqah':'Charity & Giving','nav.badges':'My Badges',
  'nav.hasad':'Worship Harvest','nav.kids':'Kids Mode',
  'nav.tasmee':'Quran Memorization','nav.ai':'AI Reflection',
  'nav.settings':'Settings','nav.report':'Report Issue','nav.about':'About',
  /* ─ Index ──────────────────────────────────────────────── */
  'index.title':'Daily Zad','index.sub':'Track your daily worship, dhikr, and seasons of good — all in one place',
  'index.install.title':'Install App','index.install.sub':'Works offline in the mosque',
  'index.notif.title':'Enable Prayer Reminders','index.notif.sub':'Don\'t miss your daily worship in these blessed days',
  'index.countdown':'Countdown',
  'index.hours':'Hours','index.mins':'Minutes','index.secs':'Seconds',
  'index.stat.takbeer':'Total Takbeer','index.stat.juz':'Juz of Quran',
  'index.stat.pray':'Prayers in Congregation','index.stat.wird':'Daily Wird',
  'index.start':'Start Your Day',
  'index.grid.worship':'Daily Wird','index.grid.worship.sub':'Track your worship schedule',
  'index.grid.mushaf':'Read Quran','index.grid.mushaf.sub':'Follow your completion plan',
  'index.grid.tasbih':'Takbeer','index.grid.tasbih.sub':'Dhikr counter',
  'index.grid.tasmee':'Quran Recitation','index.grid.tasmee.sub':'AI pronunciation check',
  'index.grid.ai':'AI Reflection','index.grid.ai.sub':'Ask about verses & rulings',
  'index.grid.badges':'My Badges','index.grid.badges.sub':'Your spiritual achievements',
  /* ─ Worship ────────────────────────────────────────────── */
  'worship.title':'Daily Worship Tracker','worship.sub':'Allah sees every good deed you do',
  'worship.label':'Worship',
  'worship.fajr':'Fajr Prayer (congregation)','worship.zuhr':'Dhuhr Prayer (congregation)',
  'worship.asr':'Asr Prayer (congregation)','worship.maghrib':'Maghrib Prayer (congregation)',
  'worship.isha':'Isha Prayer (congregation)','worship.rawatib':'Sunnah Prayers (Rawatib)',
  'worship.duha':'Duha Prayer','worship.qiyam':'Night Prayer (Qiyam al-Layl)',
  'worship.morning':'Morning Adhkar','worship.evening':'Evening Adhkar',
  'worship.takbeer':'Takbeer','worship.tawbah':'Renew Intention & Repentance',
  'worship.fasting.title':'The Nine Days','worship.fasting.sub':'Tap to record your fast',
  'worship.save':'Save Progress','worship.notif':'Worship Reminders',
  /* ─ Tasbih ─────────────────────────────────────────────── */
  'tasbih.title':'Tasbih & Takbeer Counter','tasbih.tap':'Tap to count',
  'tasbih.reset.current':'Reset Current','tasbih.reset.all':'Reset All',
  'tasbih.hint1':'Beads count automatically','tasbih.hint2':'Spacebar counts too',
  'tasbih.subhan':'Subhan Allah','tasbih.hamd':'Alhamdulillah',
  'tasbih.tahlil':'La ilaha illa Allah','tasbih.takbir':'Allahu Akbar',
  'tasbih.hawqala':'La hawla wa la quwwata','tasbih.istigfar':'Astaghfirullah',
  'tasbih.salawat':'Salawat on the Prophet ﷺ',
  'tasbih.laps':'Total Rounds',

  /* ─ Index extra ──────────────────────────────────────────── */
  'index.stats':'Today\'s Statistics',
  'index.days':'Days','index.hero.heading':'Until the Blessed Day of Arafah',
  'index.hero.sub':'Seize these precious hours — no days have righteous deeds more beloved to Allah than these Ten Days.',
  'index.progress.title':'Spiritual Commitment Tracker','index.progress.lbl':'Complete',
  'index.progress.heading':'Daily Wird of the Ten Days',
  'index.progress.li1':'Five daily prayers in congregation','index.progress.li2':'Sunnah prayers and dhikr',
  'index.progress.li3':'Fasting during the day','index.progress.li4':'Takbeer and Istighfar',
  'index.verse.title':'Verse of the Day','common.install':'Install',
  /* ─ Fadael ────────────────────────────────────────────────── */
  'fadael.title':'Why These Days?','fadael.sub':'Evidence from the Quran and authentic Sunnah',
  'fadael.q1.src':'Surah Al-Fajr 1-2','fadael.q1.note':'Allah swears by them — and Allah only swears by something great.',
  'fadael.q2.src':'Surah Al-Hajj — 28','fadael.q2.note':'Scholars of tafsir said: these are the Ten Days of Dhul Hijjah.',
  'fadael.sunnah':'From the Prophetic Sunnah',
  'fadael.h1.title':'The Most Beloved Days to Allah','fadael.h1.src':'Narrated by Al-Bukhari (969)',
  'fadael.h2.title':'The Day of Sacrifice is the Greatest','fadael.h2.src':'Narrated by Abu Dawud (1765), authenticated by Al-Albani',
  'fadael.compare':'Scholarly Comparison',
  'fadael.day.title':'Days of the Ten','fadael.day.desc':'The best days of the year absolutely — all pillars of worship converge.',
  'fadael.day.tag':'Best by Day',
  'fadael.night.title':'Last Nights of Ramadan','fadael.night.desc':'The best nights of the year for containing Laylat al-Qadr.',
  'fadael.night.tag':'Best by Night',
  'fadael.features':'The Great Distinctions',
  'fadael.feat1':'Allah swore by them in the Holy Quran.',
  'fadael.feat2':'They contain the Day of Arafah — day when the religion was perfected.',
  'fadael.feat3':'They contain the Day of Sacrifice — the greatest day with Allah.',
  'fadael.feat4':'Good deeds in them are more beloved to Allah than even jihad.',
  'fadael.feat5':'Prayer, fasting, Hajj and sacrifice all converge only in these days.',
  'fadael.feat6':'Fasting the Day of Arafah expiates two years of sins — past and future.',
  /* ─ Worship extra ─────────────────────────────────────────── */
  'worship.obligatory':'Obligatory Prayers','worship.sunnah':'Sunnah & Voluntary Prayers',
  'worship.dhikr.title':'Dhikr & Fasting',
  'worship.sub':'Set your intention and begin — Allah sees every good you do',
  'worship.fajr.meta':'Fajr','worship.zuhr.meta':'Dhuhr','worship.asr.meta':'Asr',
  'worship.maghrib.meta':'Maghrib','worship.isha.meta':'Isha',
  'worship.duha.meta':'4 rak\'ahs','worship.qiyam.meta':'Equals Laylat al-Qadr',
  'worship.rawatib':'Sunnah Rawatib — 12 rak\'ahs',
  'worship.takbeer100':'Takbeer 100 times',
  'worship.fasting.hint':'⭐ = Day of Arafah · Tap to record fast',
  'worship.day':'Day','worship.arafah.lbl':'Arafah',
  'worship.prog.prefix':'0 of',
  /* ─ Mushaf extra ──────────────────────────────────────────── */
  'mushaf.plans.title':'Completion Plans','mushaf.wird.title':'Today\'s Portion',
  'mushaf.tomorrow.title':'Tomorrow\'s Portion','mushaf.reset.title':'Reset',
  /* ─ Tasbih extra ──────────────────────────────────────────── */
  'tasbih.sub':'Surround yourself with the remembrance of Allah in every moment',
  'tasbih.formulas.title':'Authentic Takbeer Formulas',
  'tasbih.daily.title':'Daily Dhikr',
  /* ─ Adhkar ─────────────────────────────────────────────── */
  'adhkar.title':'Dhikr & Supplications','adhkar.sub':'Remembrance of Allah is the cure of hearts',
  'adhkar.tab.morning':'Morning','adhkar.tab.evening':'Evening',
  'adhkar.tab.ashra':'The Ten Days','adhkar.tab.custom':'Custom',
  'adhkar.count':'Count','adhkar.reset':'Reset',
  'adhkar.add.title':'Add Custom Dhikr',
  'adhkar.add.placeholder':'Write the dhikr in Arabic...',
  'adhkar.add.name':'Name','adhkar.add.target':'Target',
  'adhkar.add.btn':'Add',
  /* ─ Mushaf ─────────────────────────────────────────────── */
  'mushaf.title':'Quran Recitation','mushaf.sub':'Select a plan to begin',
  'mushaf.plan.full':'Full Quran','mushaf.plan.juz':'One Juz per Day',
  'mushaf.plan.pages':'Pages per Day',
  'mushaf.complete.btn':'I completed my portion today',
  'mushaf.complete.done':'Well done — today\'s portion complete ✅',
  'mushaf.tomorrow':'Tomorrow\'s Portion','mushaf.locked':'Unlocks after completing today',
  'mushaf.font':'Font Size','mushaf.add.juz':'Add completed Juz',
  /* ─ Arafah ─────────────────────────────────────────────── */
  'arafah.title':'Day of Arafah','arafah.sub':'Your complete program for the promised day',
  'arafah.countdown.h':'hrs','arafah.countdown.m':'min','arafah.countdown.s':'sec',
  'arafah.loading':'Loading','arafah.approx':'approx.',
  'arafah.milestones':'Interactive Timeline',
  'arafah.dhikr.tap':'Tap for Dhikr','arafah.done':'milestones completed',
  'arafah.virtue.title':'Virtue of Fasting Arafah',
  'arafah.bonus':'Recommended Additional Acts',
  'arafah.share':'Share Arafah Achievement',
  /* ─ Odhiya ─────────────────────────────────────────────── */
  'odhiya.title':'Sacrifice Guide','odhiya.sub':'Visual rulings for the udhiya',
  'odhiya.reminder.title':'Important Reminder for the Sacrificer!',
  'odhiya.reminder.btn':'Enable No-Cutting Reminder 🔔',
  'odhiya.guide.title':'Steps of Udhiya — Visual Guide',
  'odhiya.step1':'Intention & Resolve','odhiya.step2':'Choosing a Valid Animal',
  'odhiya.step3':'Time of Slaughter','odhiya.step4':'Prayer at Slaughter',
  'odhiya.step5':'Distribution of Meat','odhiya.age.title':'Minimum Age Requirements',
  'odhiya.defects':'Defects That Invalidate',
  /* ─ Sadaqah ────────────────────────────────────────────── */
  'sadaqah.title':'Charity & Giving','sadaqah.sub':'Choose your act of giving today',
  'sadaqah.log':'Record This Act','sadaqah.done':'Recorded ✅',
  /* ─ Badges ─────────────────────────────────────────────── */
  'badges.title':'My Badges & Achievements','badges.sub':'Righteous deeds — reward with Allah',
  'badges.earned':'Earned','badges.streak':'consecutive days 🔥',
  /* ─ Hasad ──────────────────────────────────────────────── */
  'hasad.title':'Worship Harvest','hasad.sub':'Your daily worship performance and spiritual consistency',
  'hasad.zad':'Zad Balance','hasad.streak':'Streak',
  'hasad.streak.cta':'Start your Streak to earn more points!',
  'hasad.heatmap':'Performance & Consistency Tracker',
  'hasad.share':'Share Harvest','hasad.share.btn':'Share My Harvest',
  'hasad.complete':'Complete','hasad.days.left':'days remaining',
  /* ─ Kids ───────────────────────────────────────────────── */
  'kids.title':'Kids Mode','kids.story':'Story of the Ten Days',
  'kids.prev':'Previous','kids.next':'Next',
  'kids.quiz.title':'Ten Days Quiz','kids.quiz.sub':'Fun questions for kids',
  'kids.tasbih.title':'Takbeer for Kids',
  /* ─ Tasmee ─────────────────────────────────────────────── */
  'tasmee.title':'Quran Memorization Check','tasmee.sub':'Select a verse to recite',
  'tasmee.start':'Press the microphone and begin reciting',
  'tasmee.accuracy':'Recitation Accuracy',
  'tasmee.tip1.title':'Correct pronunciation','tasmee.tip2.title':'Quiet environment',
  'tasmee.tip3.title':'Natural voice','tasmee.tip4.title':'Recommended browser',
  /* ─ AI ──────────────────────────────────────────────────── */
  'ai.title':'AI Reflection','ai.sub':'Ask about verses, dhikr, and Islamic rulings',
  'ai.placeholder':'Ask your question here...','ai.send':'Send',
  'ai.greeting':'Welcome to Zad Assistant 🕌',
  'ai.questions.title':'Suggested Questions',
  /* ─ Report ─────────────────────────────────────────────── */
  'report.title':'Report an Issue','report.sub':'Help us improve your spiritual companion',
  'report.type':'Issue Type','report.type.select':'— Select issue type —',
  'report.type.content':'Content Error (dhikr, hadith, verse)',
  'report.type.tech':'Technical Issue (page won\'t open, broken tool)',
  'report.type.ui':'UI Issue (font, colors, layout)',
  'report.type.feature':'Feature Suggestion',
  'report.type.perf':'Slow loading or performance',
  'report.type.other':'Other',
  'report.page':'Where did you encounter the issue?',
  'report.desc':'Describe the issue in detail',
  'report.screenshot':'Screenshot (optional)',
  'report.email':'Your email (optional)',
  'report.submit':'Submit Report','report.copy':'Copy Report',
  'report.privacy':'Digital Trust',
  /* ─ Settings ────────────────────────────────────────────── */
  'settings.title':'Settings','settings.sub':'Personalized just for you',
  'settings.lang':'Language','settings.langSub':'Choose app language',
  'settings.theme.title':'Theme','settings.dark':'Dark Mode',
  'settings.dark.sub':'Easy on the eyes during night prayer',
  'settings.oled':'True OLED Black','settings.oled.sub':'Saves battery on OLED screens',
  'settings.font.title':'Font Size','settings.font.quran':'Quran Font Size',
  'settings.notif.toggle':'Enable Notifications','settings.notif.wird':'Daily Wird Reminder',
  'settings.notif.arafah':'Arafah Golden Hour Alert',
  'settings.pwa':'Install App','settings.pwa.sub':'Works offline in the mosque',
  'settings.data.title':'Data','settings.data.encrypted':'Data encrypted locally',
  'settings.data.noads':'Zero Ads','settings.data.noads.sub':'Digital khushu\' free from distractions',
  'settings.data.reset':'Clear All Data',
  /* ─ About ───────────────────────────────────────────────── */
  'about.title':'About the App','about.sub':'Zad — Your smart companion in worship and good deeds',
  'about.dev':'Mustafa Abu Al-Azm',
  'about.dev.title':'UI Designer · Web Developer · UX Innovator',
  'about.contact':'Contact Me','about.social':'Follow Me On',
  'about.app.title':'About Zad','about.sources':'Islamic Sources',
  'about.tech':'Technologies Used',
  'zh.afterTpl': 'in {n} min · {t}',
  'zh.now': 'Now — Allahu Akbar',
  'zh.nextPrayerTpl': 'Up next: {p}',
  'zh.special': 'Your special mode is on',
  'zh.specialSub': 'Prayer and fasting are excused; your wird continues',
  'zh.specialDayTpl': 'Day {d} — prayer and fasting are excused; your wird continues',
  'zh.morningSub': 'Two minutes that guard your day',
  'zh.eveningSub': 'Before the daylight fades',
  'zh.streak': 'Start your streak',
  'zh.streakSub': 'One tasleem is enough to begin',
  'zh.complete': 'Complete your prayers',
  'zh.completeSubTpl': '{n} of 5 so far',
  'zh.wird': 'Your Quran wird',
  'zh.wirdSub': 'One page today lights up tomorrow',
  'zh.nowLabel': 'Now',

}
,
fr: {
  /* ─ App shell ─ */
  'brand.name': 'Zad', 'brand.sub': 'Compagnon d’adoration et de bienfaisance',
  'common.darkMode': '🌙 Mode sombre', 'common.language': '🌐 Langue',
  'common.search': "Rechercher dans l'application...", 'common.noAds': 'Fonctionne hors ligne 📴',
  'common.done': '✅ Fait', 'common.reset': 'Réinitialiser', 'common.save': 'Enregistrer', 'common.send': 'Envoyer',
  /* ─ Nav ─ */
  'nav.dashboard':'Tableau de bord','nav.virtues':'Mérites des 10 jours',
  'nav.worship':'Suivi des adorations','nav.mushaf':'Récitation du Coran',
  'nav.tasbih':'Compteur de Tasbih','nav.adhkar':'Dhikr et invocations',
  'nav.odhiya':'Guide du sacrifice','nav.arafah':'Jour de Arafah',
  'nav.sadaqah':'Aumône et bienfaisance','nav.badges':'Mes badges',
  'nav.hasad':'Bilan des adorations','nav.kids':'Mode enfants',
  'nav.tasmee':'Mémorisation du Coran','nav.ai':'Réflexion par IA',
  'nav.settings':'Paramètres','nav.report':'Signaler un problème','nav.about':'À propos',
  /* ─ Index ─ */
  'index.title':'Zad Quotidien','index.sub':'Suivez vos adorations quotidiennes et saisons de bienfaits — au même endroit',
  'index.install.title':"Installer l'application",'index.install.sub':'Fonctionne hors ligne à la mosquée',
  'index.notif.title':'Activer les rappels de prière','index.notif.sub':'Ne manquez pas vos adorations en ces jours bénis',
  'index.countdown':'Compte à rebours',
  'index.hours':'Heures','index.mins':'Minutes','index.secs':'Secondes',
  'index.stat.takbeer':'Total des Takbir','index.stat.juz':'Juz du Coran',
  'index.stat.pray':'Prières en groupe','index.stat.wird':'Wird quotidien',
  'index.start':'Commencez votre journée',
  'index.grid.worship':'Wird quotidien','index.grid.worship.sub':"Suivez votre programme d'adoration",
  'index.grid.mushaf':'Lire le Coran','index.grid.mushaf.sub':'Suivez votre plan de lecture',
  'index.grid.tasbih':'Takbir','index.grid.tasbih.sub':'Compteur de dhikr',
  'index.grid.tasmee':'Récitation du Coran','index.grid.tasmee.sub':'Vérification par IA',
  'index.grid.ai':'Réflexion par IA','index.grid.ai.sub':'Questions sur versets et règles',
  'index.grid.badges':'Mes badges','index.grid.badges.sub':'Vos réalisations spirituelles',
  /* ─ Worship ─ */
  'worship.title':'Suivi des adorations quotidiennes','worship.sub':'Allah voit chaque bonne action que vous accomplissez',
  'worship.label':'Adoration',
  'worship.fajr':'Prière du Fajr (en groupe)','worship.zuhr':'Prière du Dhuhr (en groupe)',
  'worship.asr':'Prière du Asr (en groupe)','worship.maghrib':'Prière du Maghrib (en groupe)',
  'worship.isha':'Prière du Isha (en groupe)','worship.rawatib':'Prières surérogatoires (Rawatib)',
  'worship.duha':'Prière du Duha','worship.qiyam':'Prière de nuit (Qiyam al-Layl)',
  'worship.morning':'Adhkar du matin','worship.evening':'Adhkar du soir',
  'worship.takbeer':'Takbir','worship.tawbah':"Renouveler l'intention et le repentir",
  'worship.fasting.title':'Les neuf jours','worship.fasting.sub':'Touchez pour enregistrer le jeûne',
  'worship.save':'Enregistrer la progression','worship.notif':'Rappels des adorations',
  /* ─ Tasbih ─ */
  'tasbih.title':'Compteur de Tasbih et Takbir','tasbih.tap':'Touchez pour compter',
  'tasbih.reset.current':'Réinitialiser','tasbih.reset.all':'Tout réinitialiser',
  'tasbih.hint1':'Les grains comptent automatiquement','tasbih.hint2':"La barre d'espace compte aussi",
  'tasbih.subhan':'Subhan Allah','tasbih.hamd':'Alhamdulillah',
  'tasbih.tahlil':'La ilaha illa Allah','tasbih.takbir':'Allahu Akbar',
  'tasbih.hawqala':'La hawla wa la quwwata','tasbih.istigfar':'Astaghfirullah',
  'tasbih.salawat':'Salawat sur le Prophète ﷺ',
  'tasbih.laps':'Total des tours',
  /* ─ Index extra ─ */
  'index.stats':"Statistiques d'aujourd'hui",
  'index.days':'Jours','index.hero.heading':'Jusqu’au jour béni de Arafah',
  'index.hero.sub':'Saisissez ces heures précieuses — aucune action vertueuse n’est plus aimée d’Allah que durant ces dix jours.',
  'index.progress.title':"Suivi de l'engagement spirituel",'index.progress.lbl':'Terminé',
  'index.progress.heading':'Wird quotidien des dix jours',
  'index.progress.li1':'Les cinq prières en groupe','index.progress.li2':'Prières surérogatoires et dhikr',
  'index.progress.li3':'Jeûne durant la journée','index.progress.li4':'Takbir et Istighfar',
  'index.verse.title':'Verset du jour','common.install':'Installer',
  /* ─ Fadael ─ */
  'fadael.title':'Pourquoi ces jours ?','fadael.sub':'Preuves du Coran et de la Sunna authentique',
  'fadael.q1.src':'Sourate Al-Fajr 1-2','fadael.q1.note':'Allah jure par eux — et Allah ne jure que par ce qui est grand.',
  'fadael.q2.src':'Sourate Al-Hajj — 28','fadael.q2.note':'Les exégètes ont dit : ce sont les dix jours de Dhul Hijja.',
  'fadael.sunnah':'De la Sunna prophétique',
  'fadael.h1.title':'Les jours les plus aimés d’Allah','fadael.h1.src':'Rapporté par Al-Bukhari (969)',
  'fadael.h2.title':'Le jour du Sacrifice est le plus grand','fadael.h2.src':'Rapporté par Abu Dawud (1765), authentifié par Al-Albani',
  'fadael.compare':'Comparaison savante',
  'fadael.day.title':'Jours des dix','fadael.day.desc':'Les meilleurs jours de l’année — toutes les adorations s’y rejoignent.',
  'fadael.day.tag':'Meilleurs en jours',
  'fadael.night.title':'Dernières nuits du Ramadan','fadael.night.desc':'Les meilleures nuits de l’année car elles contiennent Laylat al-Qadr.',
  'fadael.night.tag':'Meilleures en nuits',
  'fadael.features':'Les grandes distinctions',
  'fadael.feat1':'Allah a juré par eux dans le Saint Coran.',
  'fadael.feat2':'Ils contiennent le jour de Arafah — jour où la religion fut parachevée.',
  'fadael.feat3':'Ils contiennent le jour du Sacrifice — le plus grand jour auprès d’Allah.',
  'fadael.feat4':'Les bonnes actions y sont plus aimées d’Allah que même le jihad.',
  'fadael.feat5':'Prière, jeûne, Hajj et sacrifice ne se rejoignent qu’en ces jours.',
  'fadael.feat6':'Jeûner le jour de Arafah expie deux années de péchés — passée et à venir.',
  /* ─ Worship extra ─ */
  'worship.obligatory':'Prières obligatoires','worship.sunnah':'Prières surérogatoires',
  'worship.dhikr.title':'Dhikr et jeûne',
  'worship.fajr.meta':'Fajr','worship.zuhr.meta':'Dhuhr','worship.asr.meta':'Asr',
  'worship.maghrib.meta':'Maghrib','worship.isha.meta':'Isha',
  'worship.duha.meta':'4 rak\'ahs','worship.qiyam.meta':'Équivaut à Laylat al-Qadr',
  'worship.takbeer100':'Takbir 100 fois',
  'worship.fasting.hint':'⭐ = Jour de Arafah · Touchez pour enregistrer',
  'worship.day':'Jour','worship.arafah.lbl':'Arafah',
  'worship.prog.prefix':'0 sur',
  /* ─ Mushaf extra ─ */
  'mushaf.plans.title':'Plans de lecture','mushaf.wird.title':"Portion d'aujourd'hui",
  'mushaf.tomorrow.title':'Portion de demain','mushaf.reset.title':'Réinitialiser',
  /* ─ Tasbih extra ─ */
  'tasbih.sub':"Entourez-vous du rappel d'Allah à chaque instant",
  'tasbih.formulas.title':'Formules de Takbir authentiques',
  'tasbih.daily.title':'Dhikr quotidien',
  /* ─ Adhkar ─ */
  'adhkar.title':'Dhikr et invocations','adhkar.sub':'Le rappel d’Allah est le remède des cœurs',
  'adhkar.tab.morning':'Matin','adhkar.tab.evening':'Soir',
  'adhkar.tab.ashra':'Les dix jours','adhkar.tab.custom':'Personnalisé',
  'adhkar.count':'Compte','adhkar.reset':'Réinitialiser',
  'adhkar.add.title':'Ajouter un dhikr personnalisé',
  'adhkar.add.placeholder':'Écrivez le dhikr en arabe...',
  'adhkar.add.name':'Nom','adhkar.add.target':'Objectif',
  'adhkar.add.btn':'Ajouter',
  /* ─ Mushaf ─ */
  'mushaf.title':'Récitation du Coran','mushaf.sub':'Choisissez un plan pour commencer',
  'mushaf.plan.full':'Coran complet','mushaf.plan.juz':'Un Juz par jour',
  'mushaf.plan.pages':'Pages par jour',
  'mushaf.complete.btn':"J'ai terminé ma portion aujourd'hui",
  'mushaf.complete.done':'Bravo — portion du jour terminée ✅',
  'mushaf.tomorrow':'Portion de demain','mushaf.locked':"Se débloque après celle d'aujourd'hui",
  'mushaf.font':'Taille de police','mushaf.add.juz':'Ajouter un Juz terminé',
  /* ─ Arafah ─ */
  'arafah.title':'Jour de Arafah','arafah.sub':'Votre programme complet pour le jour promis',
  'arafah.countdown.h':'h','arafah.countdown.m':'min','arafah.countdown.s':'s',
  'arafah.loading':'Chargement','arafah.approx':'env.',
  'arafah.milestones':'Chronologie interactive',
  'arafah.dhikr.tap':'Touchez pour le dhikr','arafah.done':'étapes terminées',
  'arafah.virtue.title':'Mérite du jeûne de Arafah',
  'arafah.bonus':'Actes additionnels recommandés',
  'arafah.share':'Partager la réussite de Arafah',
  /* ─ Odhiya ─ */
  'odhiya.title':'Guide du sacrifice','odhiya.sub':"Règles illustrées de l'Udhiya",
  'odhiya.reminder.title':'Rappel important pour celui qui sacrifie !',
  'odhiya.reminder.btn':'Activer le rappel (ne pas couper) 🔔',
  'odhiya.guide.title':"Étapes de l'Udhiya — guide illustré",
  'odhiya.step1':'Intention et résolution','odhiya.step2':"Choix d'un animal valide",
  'odhiya.step3':'Moment de l’abattage','odhiya.step4':'Invocation lors de l’abattage',
  'odhiya.step5':'Distribution de la viande','odhiya.age.title':'Âge minimum requis',
  'odhiya.defects':'Défauts qui invalident',
  /* ─ Sadaqah ─ */
  'sadaqah.title':'Aumône et bienfaisance','sadaqah.sub':'Choisissez votre acte de don aujourd’hui',
  'sadaqah.log':'Enregistrer cet acte','sadaqah.done':'Enregistré ✅',
  /* ─ Badges ─ */
  'badges.title':'Mes badges et réalisations','badges.sub':'Bonnes actions — récompense auprès d’Allah',
  'badges.earned':'Obtenu','badges.streak':'jours consécutifs 🔥',
  /* ─ Hasad ─ */
  'hasad.title':'Bilan des adorations','hasad.sub':'Votre performance d’adoration quotidienne et constance spirituelle',
  'hasad.zad':'Solde Zad','hasad.streak':'Série',
  'hasad.streak.cta':'Commencez votre série pour gagner plus de points !',
  'hasad.heatmap':'Suivi de la performance et de la constance',
  'hasad.share':'Partager le bilan','hasad.share.btn':'Partager mon bilan',
  'hasad.complete':'Terminé','hasad.days.left':'jours restants',
  /* ─ Kids ─ */
  'kids.title':'Mode enfants','kids.story':'Histoire des dix jours',
  'kids.prev':'Précédent','kids.next':'Suivant',
  'kids.quiz.title':'Quiz des dix jours','kids.quiz.sub':'Questions amusantes pour enfants',
  'kids.tasbih.title':'Takbir pour enfants',
  /* ─ Tasmee ─ */
  'tasmee.title':'Vérification de la mémorisation','tasmee.sub':'Choisissez un verset à réciter',
  'tasmee.start':'Appuyez sur le micro et commencez à réciter',
  'tasmee.accuracy':'Précision de la récitation',
  'tasmee.tip1.title':'Prononciation correcte','tasmee.tip2.title':'Environnement calme',
  'tasmee.tip3.title':'Voix naturelle','tasmee.tip4.title':'Navigateur recommandé',
  /* ─ AI ─ */
  'ai.title':'Réflexion par IA','ai.sub':'Posez des questions sur les versets, invocations et règles',
  'ai.placeholder':'Posez votre question ici...','ai.send':'Envoyer',
  'ai.greeting':'Bienvenue dans l’assistant Zad 🕌',
  'ai.questions.title':'Questions suggérées',
  /* ─ Report ─ */
  'report.title':'Signaler un problème','report.sub':'Aidez-nous à améliorer votre compagnon spirituel',
  'report.type':'Type de problème','report.type.select':'— Choisir le type —',
  'report.type.content':'Erreur de contenu (dhikr, hadith, verset)',
  'report.type.tech':'Problème technique (page, outil cassé)',
  'report.type.ui':'Problème d’affichage (police, couleurs, mise en page)',
  'report.type.feature':'Suggestion de fonctionnalité',
  'report.type.perf':'Lenteur ou performance',
  'report.type.other':'Autre',
  'report.page':'Où avez-vous rencontré le problème ?',
  'report.desc':'Décrivez le problème en détail',
  'report.screenshot':'Capture d’écran (optionnel)',
  'report.email':'Votre e-mail (optionnel)',
  'report.submit':'Envoyer le rapport','report.copy':'Copier le rapport',
  'report.privacy':'Confiance numérique',
  /* ─ Settings ─ */
  'settings.title':'Paramètres','settings.sub':'Personnalisé rien que pour vous',
  'settings.lang':'Langue','settings.langSub':'Choisissez la langue de l’application',
  'settings.theme.title':'Thème','settings.dark':'Mode sombre',
  'settings.dark.sub':'Reposant pour les yeux pendant la prière nocturne',
  'settings.oled':'Noir OLED véritable','settings.oled.sub':'Économise la batterie sur écrans OLED',
  'settings.font.title':'Taille de police','settings.font.quran':'Taille de police du Coran',
  'settings.notif.toggle':'Activer les notifications','settings.notif.wird':'Rappel du Wird quotidien',
  'settings.notif.arafah':'Alerte heure d’or de Arafah',
  'settings.pwa':"Installer l'application",'settings.pwa.sub':'Fonctionne hors ligne à la mosquée',
  'settings.data.title':'Données','settings.data.encrypted':'Données chiffrées localement',
  'settings.data.noads':'Zéro publicité','settings.data.noads.sub':'Khushu’ numérique sans distractions',
  'settings.data.reset':'Effacer toutes les données',
  /* ─ About ─ */
  'about.title':'À propos de l’application','about.sub':'Zad — Votre compagnon intelligent pour les adorations et le bien',
  'about.dev':'Mustafa Abu Al-Azm',
  'about.dev.title':'Designer UI · Développeur web · Innovateur UX',
  'about.contact':'Me contacter','about.social':'Suivez-moi sur',
  'about.app.title':'À propos de Zad','about.sources':'Sources islamiques',
  'about.tech':'Technologies utilisées',  'zh.afterTpl': 'dans {n} min · {t}',
  'zh.now': 'Maintenant — Allahou Akbar',
  'zh.nextPrayerTpl': 'Ensuite : {p}',
  'zh.special': 'Votre mode spécial est activé',
  'zh.specialSub': 'Prière et jeûne sont excusés ; votre wird continue',
  'zh.specialDayTpl': 'Jour {d} — prière et jeûne sont excusés ; votre wird continue',
  'zh.morningSub': 'Deux minutes qui protègent votre journée',
  'zh.eveningSub': 'Avant que le jour ne s’éteigne',
  'zh.streak': 'Lancez votre série',
  'zh.streakSub': 'Une seule salutation suffit pour commencer',
  'zh.complete': 'Complétez vos prières',
  'zh.completeSubTpl': '{n} sur 5 pour l’instant',
  'zh.wird': 'Votre wird coranique',
  'zh.wirdSub': 'Une page aujourd’hui éclaire demain',
  'zh.nowLabel': 'Maintenant',
  'zh.nowLabel': 'Now',
},
  /* ─ ID ─ */
  id: {
    'brand.name': 'Zad',
    'brand.sub': 'Sahabat Ibadah & Kebaikan',
    'common.darkMode': '🌙 Mode Gelap',
    'common.language': '🌐 Bahasa',
    'common.search': 'Cari di aplikasi...',
    'common.noAds': 'Berjalan tanpa internet 📴',
    'common.done': '✅ Selesai',
    'common.reset': 'Atur ulang',
    'common.save': 'Simpan',
    'common.send': 'Kirim',
    'nav.dashboard': 'Dasbor',
    'nav.virtues': 'Keutamaan Sepuluh Hari',
    'nav.worship': 'Jadwal Ibadah',
    'nav.mushaf': 'Mushaf Al-Qur’an',
    'nav.tasbih': 'Tasbih & Takbir',
    'nav.adhkar': 'Zikir & Doa',
    'nav.odhiya': 'Panduan Kurban',
    'nav.arafah': 'Hari Arafah',
    'nav.sadaqah': 'Sedekah & Kebaikan',
    'nav.badges': 'Lencanaku',
    'nav.hasad': 'Panen Ibadah',
    'nav.kids': 'Mode Anak',
    'nav.tasmee': 'Setoran Hafalan',
    'nav.ai': 'Tadabur dengan AI',
    'nav.settings': 'Pengaturan',
    'nav.report': 'Laporkan Masalah',
    'nav.about': 'Tentang Aplikasi',
    'index.title': 'Zad Harian',
    'index.sub': 'Ikuti wird harian, ibadah, dan musim kebaikan di satu tempat',
    'index.install.title': 'Pasang Aplikasi',
    'index.install.sub': 'Berjalan tanpa internet di masjid',
    'index.notif.title': 'Aktifkan Pengingat Salat',
    'index.notif.sub': 'Jangan lewatkan wird di hari-hari berkah ini',
    'index.countdown': 'Hitung Mundur',
    'index.hours': 'Jam',
    'index.mins': 'Menit',
    'index.secs': 'Detik',
    'index.stat.takbeer': 'Total Takbir',
    'index.stat.juz': 'Juz Khatam',
    'index.stat.pray': 'Salat Berjamaah',
    'index.stat.wird': 'Capaian Wird',
    'index.start': 'Mulai Harimu Sekarang',
    'index.grid.worship': 'Wird Hari Ini',
    'index.grid.worship.sub': 'Ikuti jadwal ibadahmu',
    'index.grid.mushaf': 'Baca Al-Quran',
    'index.grid.mushaf.sub': 'Lanjutkan rencana khatam',
    'index.grid.tasbih': 'Bertakbirlah',
    'index.grid.tasbih.sub': 'Penghitung takbir bebas',
    'index.grid.tasmee': 'Setoran Hafalan',
    'index.grid.tasmee.sub': 'Koreksi bacaan dengan AI',
    'index.grid.ai': 'Tadabur dengan AI',
    'index.grid.ai.sub': 'Tanya tentang ayat dan hukum',
    'index.grid.badges': 'Lencanaku',
    'index.grid.badges.sub': 'Pencapaian ruhanimu',
    'worship.title': 'Jadwal Ibadah Harian',
    'worship.sub': 'Allah melihat setiap kebaikan yang kamu lakukan',
    'worship.label': 'Ibadah',
    'worship.fajr': 'Salat Subuh berjamaah',
    'tasbih.title': 'Penghitung Tasbih & Takbir',
    'tasbih.tap': 'Ketuk untuk berzikir',
    'tasbih.reset.current': 'Reset Saat Ini',
    'tasbih.reset.all': 'Reset Semua',
    'tasbih.hint1': 'Tasbih menghitung otomatis',
    'tasbih.hint2': 'Tombol spasi juga menghitung',
    'tasbih.subhan': 'Subhan Allah',
    'tasbih.hamd': 'Alhamdulillah',
    'tasbih.tahlil': 'La ilaha illa Allah',
    'tasbih.takbir': 'Allahu Akbar',
    'tasbih.hawqala': 'La hawla wa la quwwata',
    'tasbih.istigfar': 'Astaghfirullah',
    'tasbih.salawat': 'Salawat untuk Nabi ﷺ',
    'tasbih.laps': 'Total Putaran',
    'tasbih.sub': 'Iringi setiap saat dengan zikir kepada Allah',
    'tasbih.formulas.title': 'Lafal Takbir yang Ma’tsur',
    'tasbih.daily.title': 'Zikir Harian',
  'zh.afterTpl': '{n} menit lagi · {t}',
  'zh.now': 'Sekarang — Allahu Akbar',
  'zh.nextPrayerTpl': 'Berikutnya: {p}',
  'zh.special': 'Mode khususmu aktif',
  'zh.specialSub': 'Salat dan puasa dimaafkan; wirdmu tetap berjalan',
  'zh.specialDayTpl': 'Hari ke-{d} — salat dan puasa dimaafkan; wirdmu tetap berjalan',
  'zh.morningSub': 'Dua menit yang menjaga harimu',
  'zh.eveningSub': 'Sebelum cahaya hari hilang',
  'zh.streak': 'Mulai rentetanmu',
  'zh.streakSub': 'Satu salam sudah cukup untuk memulai',
  'zh.complete': 'Lengkapi salatmu',
  'zh.completeSubTpl': '{n} dari 5 sejauh ini',
  'zh.wird': 'Wird Al-Qur’anmu',
  'zh.wirdSub': 'Satu halaman hari ini menerangi esokmu',
    'zh.nowLabel': 'Sekarang',
  },
  /* ─ UR ─ */
  ur: {
    'brand.name': 'زاد',
    'brand.sub': 'عبادت اور بھلائی کا ساتھی',
    'common.darkMode': '🌙 ڈارک موڈ',
    'common.language': '🌐 زبان',
    'common.search': 'ایپ میں تلاش کریں...',
    'common.noAds': 'انٹرنیٹ کے بغیر چلتا ہے 📴',
    'common.done': '✅ ہو گیا',
    'common.reset': 'ری سیٹ',
    'common.save': 'محفوظ کریں',
    'common.send': 'بھیجیں',
    'nav.dashboard': 'ڈیش بورڈ',
    'nav.virtues': 'عشرہ کے فضائل',
    'nav.worship': 'عبادات کا شیڈول',
    'nav.mushaf': 'مصحف',
    'nav.tasbih': 'تسبیح و تکبیر',
    'nav.adhkar': 'اذکار و دعا',
    'nav.odhiya': 'قربانی کی رہنمائی',
    'nav.arafah': 'عرفہ کا دن',
    'nav.sadaqah': 'صدقہ و نیکی',
    'nav.badges': 'میرے تمغے',
    'nav.hasad': 'عبادات کی کٹائی',
    'nav.kids': 'بچوں کا موڈ',
    'nav.tasmee': 'حفظ کی جانچ',
    'nav.ai': 'اے آئی سے تدبر',
    'nav.settings': 'ترتیبات',
    'nav.report': 'مسئلہ کی اطلاع',
    'nav.about': 'ایپ کے بارے میں',
    'index.title': 'زاد روزانہ',
    'index.sub': 'اپنا روزانہ ورد، عبادات اور خیر کے موسم ایک جگہ دیکھیں',
    'index.install.title': 'ایپ انسٹال کریں',
    'index.install.sub': 'مسجد میں انٹرنیٹ کے بغیر چلتی ہے',
    'index.notif.title': 'نماز کی یاد دہانی فعال کریں',
    'index.notif.sub': 'ان بابرکت دنوں میں اپنا ورد نہ چھوڑیں',
    'index.countdown': 'الٹی گنتی',
    'index.hours': 'گھنٹے',
    'index.mins': 'منٹ',
    'index.secs': 'سیکنڈ',
    'index.stat.takbeer': 'کل تکبیریں',
    'index.stat.juz': 'ختم کے پارے',
    'index.stat.pray': 'جماعت کی نمازیں',
    'index.stat.wird': 'ورد کی تکمیل',
    'index.start': 'اپنا دن ابھی شروع کریں',
    'index.grid.worship': 'آج کا ورد',
    'index.grid.worship.sub': 'اپنی عبادات کا شیڈول دیکھیں',
    'index.grid.mushaf': 'قرآن پڑھیں',
    'index.grid.mushaf.sub': 'ختم کا منصوبہ جاری رکھیں',
    'index.grid.tasbih': 'اللہ اکبر کہیں',
    'index.grid.tasbih.sub': 'مطلق تکبیر کا کاؤنٹر',
    'index.grid.tasmee': 'حفظ کی جانچ',
    'index.grid.tasmee.sub': 'اے آئی سے حفظ کی درستی',
    'index.grid.ai': 'اے آئی سے تدبر',
    'index.grid.ai.sub': 'آیات و احکام کے بارے پوچھیں',
    'index.grid.badges': 'میرے تمغے',
    'index.grid.badges.sub': 'آپ کی روحانی کامیابیاں',
    'worship.title': 'روزانہ عبادات کا شیڈول',
    'worship.sub': 'اللہ ہر نیکی دیکھتا ہے جو تم کرتے ہو',
    'worship.label': 'عبادت',
    'worship.fajr': 'نماز فجر باجماعت',
    'tasbih.title': 'تسبیح و تکبیر کا کاؤنٹر',
    'tasbih.tap': 'ذکر کے لیے دبائیں',
    'tasbih.reset.current': 'موجودہ ری سیٹ',
    'tasbih.reset.all': 'سب ری سیٹ',
    'tasbih.hint1': 'تسبیح خود بخود گنتی کرتی ہے',
    'tasbih.hint2': 'اسپیس بار سے بھی گنتی ہوتی ہے',
    'tasbih.subhan': 'سبحان اللہ',
    'tasbih.hamd': 'الحمد للہ',
    'tasbih.tahlil': 'لا الہ الا اللہ',
    'tasbih.takbir': 'اللہ اکبر',
    'tasbih.hawqala': 'لا حول ولا قوۃ',
    'tasbih.istigfar': 'استغفر اللہ',
    'tasbih.salawat': 'نبی ﷺ پر درود',
    'tasbih.laps': 'کل دور',
    'tasbih.sub': 'ہر لمحہ اللہ کے ذکر میں رہیں',
    'tasbih.formulas.title': 'تکبیر کے مأثور صیغے',
    'tasbih.daily.title': 'آج کے اذکار',
  'zh.afterTpl': '{n} منٹ میں · {t}',
  'zh.now': 'ابھی — اللہ اکبر',
  'zh.nextPrayerTpl': 'اگلی نماز: {p}',
  'zh.special': 'آپ کا خصوصی موڈ فعال ہے',
  'zh.specialSub': 'نماز اور روزہ معذور ہیں، آپ کا ورد جاری ہے',
  'zh.specialDayTpl': 'دن {d} — نماز اور روزہ معذور ہیں، آپ کا ورد جاری ہے',
  'zh.morningSub': 'دو منٹ جو آپ کا دن بچاتے ہیں',
  'zh.eveningSub': 'دن کی روشنی بجھنے سے پہلے',
  'zh.streak': 'اپنی لگاتار عبادت شروع کریں',
  'zh.streakSub': 'شروع کرنے کے لیے ایک سلام کافی ہے',
  'zh.complete': 'اپنی نمازیں مکمل کریں',
  'zh.completeSubTpl': 'اب تک ۵ میں سے {n}',
  'zh.wird': 'آپ کا قرآنی ورد',
  'zh.wirdSub': 'آج کا ایک صفحہ کل کو روشن کرے گا',
    'zh.nowLabel': 'ابھی',
  },
  /* ─ BN ─ */
  bn: {
    'brand.name': 'যাদ',
    'brand.sub': 'ইবাদত ও কল্যাণের সঙ্গী',
    'common.darkMode': '🌙 ডার্ক মোড',
    'common.language': '🌐 ভাষা',
    'common.search': 'অ্যাপে খুঁজুন...',
    'common.noAds': 'ইন্টারনেট ছাড়াই চলে 📴',
    'common.done': '✅ সম্পন্ন',
    'common.reset': 'রিসেট',
    'common.save': 'সংরক্ষণ',
    'common.send': 'পাঠান',
    'nav.dashboard': 'ড্যাশবোর্ড',
    'nav.virtues': 'দশ দিনের ফজিলত',
    'nav.worship': 'ইবাদতের সূচি',
    'nav.mushaf': 'মুসহাফ',
    'nav.tasbih': 'তাসবিহ ও তাকবির',
    'nav.adhkar': 'জিকির ও দুআ',
    'nav.odhiya': 'কুরবানির নির্দেশিকা',
    'nav.arafah': 'আরাফার দিন',
    'nav.sadaqah': 'সদকা ও সৎকর্ম',
    'nav.badges': 'আমার ব্যাজ',
    'nav.hasad': 'ইবাদতের ফসল',
    'nav.kids': 'শিশু মোড',
    'nav.tasmee': 'হিফজ যাচাই',
    'nav.ai': 'এআই দিয়ে তাদাব্বুর',
    'nav.settings': 'সেটিংস',
    'nav.report': 'সমস্যা জানান',
    'nav.about': 'অ্যাপ সম্পর্কে',
    'index.title': 'দৈনিক যাদ',
    'index.sub': 'দৈনিক ওয়ারদ, ইবাদত ও কল্যাণের মৌসুম এক জায়গায়',
    'index.install.title': 'অ্যাপ ইনস্টল করুন',
    'index.install.sub': 'মসজিদে ইন্টারনেট ছাড়াই চলে',
    'index.notif.title': 'নামাজের রিমাইন্ডার চালু করুন',
    'index.notif.sub': 'এই বরকতময় দিনে ওয়ারদ মিস করবেন না',
    'index.countdown': 'কাউন্টডাউন',
    'index.hours': 'ঘণ্টা',
    'index.mins': 'মিনিট',
    'index.secs': 'সেকেন্ড',
    'index.stat.takbeer': 'মোট তাকবির',
    'index.stat.juz': 'খতমের পারা',
    'index.stat.pray': 'জামাতে নামাজ',
    'index.stat.wird': 'ওয়ারদের অগ্রগতি',
    'index.start': 'এখনই দিন শুরু করুন',
    'index.grid.worship': 'আজকের ওয়ারদ',
    'index.grid.worship.sub': 'আপনার ইবাদতের সূচি দেখুন',
    'index.grid.mushaf': 'কুরআন পড়ুন',
    'index.grid.mushaf.sub': 'খতম পরিকল্পনা চালান',
    'index.grid.tasbih': 'আল্লাহু আকবার বলুন',
    'index.grid.tasbih.sub': 'মুতলাক তাকবির কাউন্টার',
    'index.grid.tasmee': 'হিফজ যাচাই',
    'index.grid.tasmee.sub': 'এআই দিয়ে হিফজ যাচাই',
    'index.grid.ai': 'এআই দিয়ে তাদাব্বুর',
    'index.grid.ai.sub': 'আয়াত ও বিধান সম্পর্কে জিজ্ঞাসা',
    'index.grid.badges': 'আমার ব্যাজ',
    'index.grid.badges.sub': 'আপনার আধ্যাত্মিক অর্জন',
    'worship.title': 'দৈনিক ইবাদতের সূচি',
    'worship.sub': 'আল্লাহ আপনার প্রতিটি ভালো কাজ দেখেন',
    'worship.label': 'ইবাদত',
    'worship.fajr': 'ফজরের নামাজ জামাতে',
    'tasbih.title': 'তাসবিহ ও তাকবির কাউন্টার',
    'tasbih.tap': 'জিকির করতে চাপুন',
    'tasbih.reset.current': 'বর্তমান রিসেট',
    'tasbih.reset.all': 'সব রিসেট',
    'tasbih.hint1': 'তাসবিহ নিজেই গণনা করে',
    'tasbih.hint2': 'স্পেসবারেও গণনা হয়',
    'tasbih.subhan': 'সুবহানাল্লাহ',
    'tasbih.hamd': 'আলহামদুলিল্লাহ',
    'tasbih.tahlil': 'লা ইলাহা ইল্লাল্লাহ',
    'tasbih.takbir': 'আল্লাহু আকবার',
    'tasbih.hawqala': 'লা হাওলা ওয়া লা কুওয়াতা',
    'tasbih.istigfar': 'আস্তাগফিরুল্লাহ',
    'tasbih.salawat': 'নবীর ﷺ উপর দরুদ',
    'tasbih.laps': 'মোট চক্র',
    'tasbih.sub': 'প্রতিটি মুহূর্তে আল্লাহর জিকিরে থাকুন',
    'tasbih.formulas.title': 'প্রসিদ্ধ তাকবিরের শব্দ',
    'tasbih.daily.title': 'দৈনিক জিকির',
  'zh.afterTpl': '{n} মিনিট পর · {t}',
  'zh.now': 'এখনই — আল্লাহু আকবার',
  'zh.nextPrayerTpl': 'পরবর্তী: {p}',
  'zh.special': 'আপনার বিশেষ মোড চালু আছে',
  'zh.specialSub': 'নামাজ ও রোজা মাফ; আপনার ওয়ারদ চলছে',
  'zh.specialDayTpl': 'দিন {d} — নামাজ ও রোজা মাফ; আপনার ওয়ারদ চলছে',
  'zh.morningSub': 'দুই মিনিট যা আপনার দিনকে রক্ষা করে',
  'zh.eveningSub': 'দিনের আলো নিভে যাওয়ার আগে',
  'zh.streak': 'আপনার ধারাবাহিকতা শুরু করুন',
  'zh.streakSub': 'শুরু করতে এক সালামই যথেষ্ট',
  'zh.complete': 'আপনার নামাজ পূর্ণ করুন',
  'zh.completeSubTpl': 'এখন পর্যন্ত ৫টির মধ্যে {n}',
  'zh.wird': 'আপনার কুরআন ওয়ারদ',
  'zh.wirdSub': 'আজকের এক পাতা কালকে আলোকিত করে',
    'zh.nowLabel': 'এখন',
  },
  /* ─ TR ─ */
  tr: {
    'brand.name': 'Zad',
    'brand.sub': 'İbadet ve Hayır Arkadaşı',
    'common.darkMode': '🌙 Karanlık Mod',
    'common.language': '🌐 Dil',
    'common.search': 'Uygulamada ara...',
    'common.noAds': 'İnternetsiz çalışır 📴',
    'common.done': '✅ Tamam',
    'common.reset': 'Sıfırla',
    'common.save': 'Kaydet',
    'common.send': 'Gönder',
    'nav.dashboard': 'Panel',
    'nav.virtues': 'On Günün Fazileti',
    'nav.worship': 'İbadet Takvimi',
    'nav.mushaf': 'Mushaf',
    'nav.tasbih': 'Tesbih ve Tekbir',
    'nav.adhkar': 'Zikir ve Dua',
    'nav.odhiya': 'Kurban Rehberi',
    'nav.arafah': 'Arefe Günü',
    'nav.sadaqah': 'Sadaka ve İyilik',
    'nav.badges': 'Rozetlerim',
    'nav.hasad': 'İbadet Hasadı',
    'nav.kids': 'Çocuk Modu',
    'nav.tasmee': 'Ezber Kontrolü',
    'nav.ai': 'Yapay Zekâ ile Tefekkür',
    'nav.settings': 'Ayarlar',
    'nav.report': 'Sorun Bildir',
    'nav.about': 'Uygulama Hakkında',
    'index.title': 'Günlük Zad',
    'index.sub': 'Günlük virdini, ibadetini ve hayır mevsimlerini tek bir yerde takip et',
    'index.install.title': 'Uygulamayı Yükle',
    'index.install.sub': 'Mescitte internetsiz çalışır',
    'index.notif.title': 'Namaz Hatırlatıcılarını Aç',
    'index.notif.sub': 'Bu mübarek günlerde virdini kaçırma',
    'index.countdown': 'Geri Sayım',
    'index.hours': 'Saat',
    'index.mins': 'Dakika',
    'index.secs': 'Saniye',
    'index.stat.takbeer': 'Toplam Tekbir',
    'index.stat.juz': 'Hatim Cüzü',
    'index.stat.pray': 'Cemaatle Namaz',
    'index.stat.wird': 'Vird Tamamlanması',
    'index.start': 'Gününe Şimdi Başla',
    'index.grid.worship': 'Bugünün Virdi',
    'index.grid.worship.sub': 'İbadet takvimini takip et',
    'index.grid.mushaf': 'Kur\'an Oku',
    'index.grid.mushaf.sub': 'Hatim planını sürdür',
    'index.grid.tasbih': 'Tekbir Getir',
    'index.grid.tasbih.sub': 'Sınırsız tekbir sayacı',
    'index.grid.tasmee': 'Ezber Kontrolü',
    'index.grid.tasmee.sub': 'Ezberini yapay zekâ ile kontrol et',
    'index.grid.ai': 'Yapay Zekâ ile Tefekkür',
    'index.grid.ai.sub': 'Ayet ve hükümleri sor',
    'index.grid.badges': 'Rozetlerim',
    'index.grid.badges.sub': 'Manevi başarıların',
    'worship.title': 'Günlük İbadet Takvimi',
    'worship.sub': 'Allah yaptığın her hayrı görür',
    'worship.label': 'İbadet',
    'worship.fajr': 'Cemaatle sabah namazı',
    'tasbih.title': 'Tesbih ve Tekbir Sayacı',
    'tasbih.tap': 'Zikretmek için dokun',
    'tasbih.reset.current': 'Mevcudu Sıfırla',
    'tasbih.reset.all': 'Tümünü Sıfırla',
    'tasbih.hint1': 'Tesbih otomatik sayar',
    'tasbih.hint2': 'Boşluk tuşu da sayar',
    'tasbih.subhan': 'Sübhânallah',
    'tasbih.hamd': 'Elhamdülillah',
    'tasbih.tahlil': 'Lâ ilâhe illallah',
    'tasbih.takbir': 'Allahu Ekber',
    'tasbih.hawqala': 'Lâ havle velâ kuvvete illâ billâh',
    'tasbih.istigfar': 'Estağfirullah',
    'tasbih.salawat': 'Peygamber’e ﷺ salât',
    'tasbih.laps': 'Toplam Tur',
    'tasbih.sub': 'Her an Allah’ı zikret',
    'tasbih.formulas.title': 'Mâsur Tekbir Lafızları',
    'tasbih.daily.title': 'Günün Zikirleri',
  'zh.afterTpl': '{n} dakika sonra · {t}',
  'zh.now': 'Şimdi — Allahu Ekber',
  'zh.nextPrayerTpl': 'Sıradaki: {p}',
  'zh.special': 'Özel modun açık',
  'zh.specialSub': 'Namaz ve oruç mazur sayılır; virdin devam ediyor',
  'zh.specialDayTpl': '{d}. gün — namaz ve oruç mazur sayılır; virdin devam ediyor',
  'zh.morningSub': 'Gününü koruyan iki dakika',
  'zh.eveningSub': 'Günün ışığı sönmeden',
  'zh.streak': 'Serine başla',
  'zh.streakSub': 'Başlamak için tek bir selam yeter',
  'zh.complete': 'Namazlarını tamamla',
  'zh.completeSubTpl': 'Şu ana kadar 5’te {n}',
  'zh.wird': 'Kur’an virdin',
  'zh.wirdSub': 'Bugün bir sayfa yarını aydınlatır',
    'zh.nowLabel': 'Şimdi',
  },
};

/* ── Dhikr transliterations (translit + meaning per language) ─────────── */
const DHIKR_DB = [
  { ar:'سُبْحَانَ اللَّهِ', translit:'Subḥāna Allāh', en:'Glory be to Allah', fr:'Gloire à Allah', id:'Maha Suci Allah', ur:'اللہ پاک ہے', bn:'আল্লাহ পবিত্র', tr:'Allah eksikliklerden uzaktır' },
  { ar:'الْحَمْدُ لِلَّهِ', translit:'Al-Ḥamdu lillāh', en:'All praise is due to Allah', fr:'Louange à Allah', id:'Segala puji bagi Allah', ur:'سب تعریف اللہ کے لیے ہے', bn:'সকল প্রশংসা আল্লাহর', tr:'Hamd Allah’a mahsustur' },
  { ar:'لَا إِلَهَ إِلَّا اللَّهُ', translit:"Lā ilāha illa Allāh", en:'There is no god but Allah', fr:"Il n'y a de divinité qu'Allah" , id:'Tiada tuhan selain Allah', ur:'اللہ کے سوا کوئی معبود نہیں', bn:'আল্লাহ ছাড়া কোনো ইলাহ নেই', tr:'Allah’tan başka ilah yoktur' },
  { ar:'اللَّهُ أَكْبَرُ', translit:'Allāhu Akbar', en:'Allah is the Greatest', fr:'Allah est le plus grand', id:'Allah Maha Besar', ur:'اللہ سب سے بڑا ہے', bn:'আল্লাহ সর্বশ্রেষ্ঠ', tr:'Allah en büyüktür' },
  { ar:'سبحان الله', translit:'Subhan Allah', en:'Glory be to Allah', fr:'Gloire à Allah', id:'Maha Suci Allah', ur:'اللہ پاک ہے', bn:'আল্লাহ পবিত্র', tr:'Allah eksikliklerden uzaktır' },
  { ar:'الحمد لله', translit:'Alhamdulillah', en:'All praise is to Allah', fr:'Louange à Allah', id:'Segala puji bagi Allah', ur:'سب تعریف اللہ کے لیے ہے', bn:'সকল প্রশংসা আল্লাহর', tr:'Hamd Allah’a mahsustur' },
  { ar:'لا إله إلا الله', translit:'La ilaha illa Allah', en:'There is no god but Allah', fr:"Il n'y a de divinité qu'Allah" , id:'Tiada tuhan selain Allah', ur:'اللہ کے سوا کوئی معبود نہیں', bn:'আল্লাহ ছাড়া কোনো ইলাহ নেই', tr:'Allah’tan başka ilah yoktur' },
  { ar:'الله أكبر', translit:'Allahu Akbar', en:'Allah is the Greatest', fr:'Allah est le plus grand', id:'Allah Maha Besar', ur:'اللہ سب سے بڑا ہے', bn:'আল্লাহ সর্বশ্রেষ্ঠ', tr:'Allah en büyüktür' },
  { ar:'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ', translit:'Lā ḥawla wa lā quwwata illā billāh', en:'There is no power except with Allah', fr:"Il n'y a de force ni de puissance qu'en Allah" , id:'Tiada daya dan kekuatan kecuali dengan Allah', ur:'اللہ کے سوا کوئی طاقت و قوت نہیں', bn:'আল্লাহর সাহায্য ছাড়া কোনো শক্তি নেই', tr:'Güç ve kuvvet ancak Allah’tandır' },
  { ar:'أَسْتَغْفِرُ اللَّهَ', translit:'Astaghfiru Allāh', en:'I seek forgiveness from Allah', fr:'Je demande pardon à Allah', id:'Aku memohon ampun kepada Allah', ur:'میں اللہ سے بخشش مانگتا ہوں', bn:'আমি আল্লাহর কাছে ক্ষমা চাই', tr:'Allah’tan bağışlanma dilerim' },
  { ar:'أستغفر الله', translit:'Astaghfirullah', en:'I seek forgiveness from Allah', fr:'Je demande pardon à Allah', id:'Aku memohon ampun kepada Allah', ur:'میں اللہ سے بخشش مانگتا ہوں', bn:'আমি আল্লাহর কাছে ক্ষমা চাই', tr:'Allah’tan bağışlanma dilerim' },
  { ar:'لا حول ولا قوة إلا بالله', translit:'La hawla wa la quwwata illa billah', en:'No power except with Allah', fr:"Pas de puissance sauf en Allah" , id:'Tiada daya dan kekuatan kecuali dengan Allah', ur:'اللہ کے سوا کوئی طاقت و قوت نہیں', bn:'আল্লাহর সাহায্য ছাড়া কোনো শক্তি নেই', tr:'Güç ve kuvvet ancak Allah’tandır' },
  { ar:'بسم الله الرحمن الرحيم', translit:'Bismillāhi r-raḥmāni r-raḥīm', en:'In the name of Allah, the Most Gracious, the Most Merciful', fr:'Au nom d’Allah, le Tout Miséricordieux, le Très Miséricordieux', id:'Dengan nama Allah Yang Maha Pengasih, Maha Penyayang', ur:'اللہ کے نام سے جو رحمٰن و رحیم ہے', bn:'পরম করুণাময় ও অসীম দয়ালু আল্লাহর নামে', tr:'Rahmân ve Rahîm olan Allah’ın adıyla' },
  { ar:'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ', translit:'Subḥāna Allāhi wa biḥamdih', en:'Glory be to Allah and praise be to Him', fr:'Gloire et louange à Allah', id:'Maha Suci Allah dan segala puji bagi-Nya', ur:'اللہ پاک ہے اور اسی کے لیے تعریف ہے', bn:'আল্লাহ পবিত্র ও সকল প্রশংসা তাঁর', tr:'Allah’ı tesbih ve hamd ederim' },
];

/* ── ترتيب اللغات للتدوير: عربي → إنجليزي → فرنسي → عربي ─────────────── */
/* ستّ لغات: العربية (المصدر) + الخمس الأكثر وصولًا للمسلمين:
   الإنجليزية (الهند/نيجيريا/المهجر) · الإندونيسية (٢٤٠م) · الأردية (باكستان ٢٤٠م)
   · البنغالية (بنغلاديش ١٥٠م) · التركية (٨٥م). */
const LANG_CYCLE = ['ar', 'en', 'id', 'ur', 'bn', 'tr'];
const LANG_NEXT_LABEL = { ar:'EN', en:'ID', id:'UR', ur:'BN', bn:'TR', tr:'عربي' };
const LANG_SUBTITLE = {
  ar: 'رفيق العبادة والخير', en: 'Worship Companion', fr: 'Compagnon d’adoration',
  id: 'Sahabat Ibadah', ur: 'عبادت کا ساتھی', bn: 'ইবাদতের সঙ্গী', tr: 'İbadet Yoldaşı'
};
const LANG_INSTALL = {
  ar: '📲 تثبيت / تحميل التطبيق', en: '📲 Install App', fr: "📲 Installer l'application",
  id: '📲 Pasang Aplikasi', ur: '📲 ایپ انسٹال کریں', bn: '📲 অ্যাপ ইনস্টল করুন', tr: '📲 Uygulamayı Yükle'
};

/* ── i18n Engine ─────────────────────────────────────────────── */
const I18N = {
  current: localStorage.getItem('zad_lang') || 'ar',

  t(key) {
    return TRANSLATIONS[this.current]?.[key]
        || TRANSLATIONS['en']?.[key]
        || TRANSLATIONS['ar']?.[key]
        || key;
  },

  /* الأردية تُكتب من اليمين لليسار مثل العربية */
  isRTL() { return this.current === 'ar' || this.current === 'ur'; },

  setLang(lang) {
    if (LANG_CYCLE.indexOf(lang) === -1) lang = 'ar';
    this.current = lang;
    localStorage.setItem('zad_lang', lang);
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', this.isRTL() ? 'rtl' : 'ltr');
    this.apply();
    this._updateButtons(lang);
  },

  _updateButtons(lang) {
    const label = LANG_NEXT_LABEL[lang] || 'EN';
    const tb = document.getElementById('topbar-lang-btn');
    if (tb) tb.textContent = label;
    const sb = document.getElementById('sidebar-lang-val');
    if (sb) sb.textContent = label;
    /* أزرار اختيار صريحة إن وُجدت */
    LANG_CYCLE.forEach(L => {
      const b = document.getElementById('lang-'+L+'-btn');
      if (b) b.classList.toggle('active', lang === L);
    });
  },

  apply() {
    const lang = this.current;
    const isAr = lang === 'ar';
    const rtl = this.isRTL();

    /* 1) عناصر data-i18n */
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const v = this.t(el.dataset.i18n);
      if (v && v !== el.dataset.i18n) el.textContent = v;
    });
    document.querySelectorAll('[data-i18n-ph]').forEach(el => {
      el.placeholder = this.t(el.dataset.i18nPh);
    });

    /* 2) الترانزليتريشن تحت الأذكار العربية (للغات غير العربية) */
    if (!isAr) {
      document.querySelectorAll('.az-arabic,.adhkar-arabic,.tl-dua,.af-ms-dua,.ts-dhikr-text,.dc-arabic').forEach(el => {
        if (el.nextElementSibling?.classList.contains('i18n-translit')) {
          /* حدّث المعنى عند تبديل اللغة */
          const exist = el.nextElementSibling;
          const arTxt = el.textContent.trim();
          const m = DHIKR_DB.find(d => arTxt.includes(d.ar));
          if (m) exist.querySelector('.az-meaning').textContent = (m[lang] || m.en);
          return;
        }
        const arTxt = el.textContent.trim();
        const match = DHIKR_DB.find(d => arTxt.includes(d.ar));
        if (!match) return;
        const t = document.createElement('div');
        t.className = 'i18n-translit';
        t.innerHTML = `<span class="az-translit">${match.translit}</span><span class="az-meaning">${match[lang] || match.en}</span>`;
        el.after(t);
      });
    } else {
      document.querySelectorAll('.i18n-translit').forEach(el => el.remove());
    }

    /* 3) عناصر النصوص العامة عبر UI_MAP (الشريط الجانبي/الأقسام/الأزرار) */
    const swap = (el) => {
      /* لا نلمس عنصرًا فيه أبناء (أيقونة/شارة) — كنا نمحوها */
      if (el.children && el.children.length) return;
      const txt = el.textContent.trim();
      if (!el.dataset.ar) el.dataset.ar = txt;
      if (isAr) { el.textContent = el.dataset.ar; return; }
      const entry = UI_MAP[el.dataset.ar];
      if (entry) el.textContent = (typeof entry === 'string' ? entry : (entry[lang] || entry.en || el.dataset.ar));
    };

    /* العلامة التجارية */
    const bn = document.querySelector('.brand-name');
    const bs = document.querySelector('.brand-sub');
    if (bn) bn.textContent = isAr ? 'زاد' : 'Zad';
    if (bs) bs.textContent = LANG_SUBTITLE[lang] || LANG_SUBTITLE.en;

    /* روابط القائمة + الفواصل */
    document.querySelectorAll('.nav a span:last-child, .nav .nav-sep .sep-txt').forEach(swap);
    /* عناوين الأقسام */
    document.querySelectorAll('.section-title, .kids-title, .zh-card-t, .card h2, .fq-sec h2, .gp-sec-title, .zh-l-n, .gp-sec-title, .section-title *').forEach(el => { if (el.children.length === 0) swap(el); });
    /* الأزرار العامة */
    /* استثناء أزرار محوّل اللغة: swap يكتب textContent فيمحو الأيقونة والاسم والعلامة ✓ */
    document.querySelectorAll('button:not([data-i18n]):not(.hamburger):not(.notif-btn):not(.btn-theme):not(.zad-lang-trigger):not(.zad-lang-opt)').forEach(swap);

    /* 3.5) تعميم على عُقد النصوص داخل المحتوى (مطابقة تامة، بلا لمس النص الشرعي) */
    const SKIP = /(quran|ayah|dhikr|dua|hadith|srs|kh-|wird-card|gp-card|fq-|az-|translit)/i;
    const mainEl = document.querySelector('.main') || document.querySelector('main') || document.getElementById('main-content') || document.body;
    if (mainEl) {
      /* استعادة أي نص عُرِّب سابقًا قبل تطبيق اللغة الجديدة */
      const w2 = document.createTreeWalker(mainEl, NodeFilter.SHOW_TEXT, null);
      const back = []; let nn;
      while ((nn = w2.nextNode())) if (nn.__zadAr) back.push(nn);
      back.forEach(n => { n.nodeValue = n.__zadAr; n.__zadAr = null; });
    }
    if (!isAr && mainEl) {
      const walker = document.createTreeWalker(mainEl, NodeFilter.SHOW_TEXT, {
        acceptNode(n) {
          const pe = n.parentElement;
          if (!pe) return NodeFilter.FILTER_REJECT;
          if (pe.closest('script,style,textarea,select,option,[data-i18n]')) return NodeFilter.FILTER_REJECT;
          if (SKIP.test(pe.className || '')) return NodeFilter.FILTER_REJECT;
          const t = n.nodeValue.trim();
          if (t.length < 2 || t.length > 120) return NodeFilter.FILTER_REJECT;
          return UI_MAP[t] ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
        }
      });
      const hits = [];
      let node;
      while ((node = walker.nextNode())) hits.push(node);
      hits.forEach(n => {
        const key = n.nodeValue.trim();
        const v = UI_MAP[key][lang] || UI_MAP[key].en;
        if (!v) return;
        if (!n.__zadAr) n.__zadAr = n.nodeValue;
        const lead = n.nodeValue.match(/^\s*/)[0];
        const trail = n.nodeValue.match(/\s*$/)[0];
        n.nodeValue = lead + v + trail;
      });
    }

    /* 3.9) أنماط عددية (جلسات/أحاديث/عبادات) + تحويل الأرقام لغير العربية */
    if (!isAr) {
      /* اتجاه السهم: «←» تعني «رجوع» في RTL فتصير «→» في LTR */
      const flipArrow = t => t.replace(/^←\s+/, '→ ').replace(/^→\s+/, '← ');
      const latin = t => t.replace(/[\u0660-\u0669]/g, c => String(c.charCodeAt(0) - 0x0660));
      const loc = t => latin(t).replace(/[0-9]/g, d => {
        if (lang === 'ur') return String.fromCharCode(0x06F0 + (+d));
        if (lang === 'bn') return String.fromCharCode(0x09E6 + (+d));
        return d;
      });
      const PATTERNS = [
        [/^📚\s*([\u0660-\u0669\d]+)\s*حديثًا$/, (n) => ({
          en:`📚 ${n} hadiths`, fr:`📚 ${n} hadiths`, id:`📚 ${n} hadis`,
          ur:`📚 ${n} حدیثیں`, bn:`📚 ${n} হাদিস`, tr:`📚 ${n} hadis` }[lang])],
        [/^([\u0660-\u0669\d]+)\s*من\s*([\u0660-\u0669\d]+)\s*عبادة$/, (a,b) => ({
          en:`${a} of ${b} acts of worship`, fr:`${a} sur ${b} adorations`, id:`${a} dari ${b} ibadah`,
          ur:`${a} از ${b} عبادات`, bn:`${b}-এর মধ্যে ${a} ইবাদত`, tr:`${b} ibadetten ${a}` }[lang])],
        [/^([\u0660-\u0669\d]+)\s*أذكار\s*·\s*(.+)$/, (n,rest) => {
          const R = UI_MAP[rest.trim()] ? (UI_MAP[rest.trim()][lang] || UI_MAP[rest.trim()].en) : rest;
          return { en:`${n} adhkar · ${R}`, fr:`${n} adhkar · ${R}`, id:`${n} zikir · ${R}`,
                   ur:`${n} اذکار · ${R}`, bn:`${n} আযকার · ${R}`, tr:`${n} zikir · ${R}` }[lang];
        }],
        /* «المصحف المرتل/المجود — <اسم القارئ>» */
        [/^(المصحف المرتل|المصحف المجود|🎙️ مصحف مُجوَّد|📖 مصحف مُرتَّل)\s*—\s*(.+)$/, (kind, name) => {
          const isMuj = kind.indexOf('مجود') !== -1;
          const K = { en: isMuj ? 'Mujawwad mushaf' : 'Recited mushaf',
                      fr: isMuj ? 'Moushaf moujawwad' : 'Moushaf récité',
                      id: isMuj ? 'Mushaf mujawwad' : 'Mushaf murattal',
                      ur: isMuj ? 'مجود مصحف' : 'ترتیل مصحف',
                      bn: isMuj ? 'মুজাওয়াদ মুসহাফ' : 'তারতিল মুসহাফ',
                      tr: isMuj ? 'Mücevved mushaf' : 'Tertil mushaf' }[lang];
          return K ? (K + ' — ' + name) : '';
        }],
        /* «٤٢٧٣ حديثًا مشروحًا في ٧ أبواب و٤١ بابًا فرعيًا — بحث يعمل بلا إنترنت» */
        [/^([\u0660-\u0669\d]+)\s*حديثًا مشروحًا في ([\u0660-\u0669\d]+) (?:أبواب|أبوابًا) و([\u0660-\u0669\d]+) بابًا فرعيًا(.*)$/, (n,sec,sub,tail) => {
          const T = {
            en:`${n} explained hadiths across ${sec} sections and ${sub} subsections — search works offline`,
            fr:`${n} hadiths expliqués en ${sec} sections et ${sub} sous-sections — recherche hors ligne`,
            id:`${n} hadis berpenjelasan dalam ${sec} bagian dan ${sub} subbagian — pencarian tanpa internet`,
            ur:`${n} تشریح شدہ احادیث، ${sec} ابواب اور ${sub} ذیلی ابواب میں — تلاش انٹرنیٹ کے بغیر`,
            bn:`${sec} বিভাগ ও ${sub} উপবিভাগে ${n} ব্যাখ্যাকৃত হাদিস — ইন্টারনেট ছাড়াই খোঁজ`,
            tr:`${sec} bölüm ve ${sub} alt bölümde ${n} şerhli hadis — arama internetsiz çalışır`
          }[lang];
          return T || '';
        }],
        [/^([\u0660-\u0669\d]+)\s*حديثًا مشروحًا في (.+)$/, (n,rest) => ({
          en:`${n} explained hadiths in ${rest}`, fr:`${n} hadiths expliqués en ${rest}`, id:`${n} hadis berpenjelasan dalam ${rest}`,
          ur:`${n} تشریح شدہ احادیث ${rest} میں`, bn:`${n} ব্যাখ্যাকৃত হাদিস ${rest}-এ`, tr:`${rest} içinde ${n} şerhli hadis` }[lang])],
        /* «إيه المشكلة في X؟» — سلسلة محاضرات */
        [/^إيه المشكلة في (.+?)\؟(.*)$/, (topic, tail) => {
          const tp = (UI_MAP[topic] && (UI_MAP[topic][lang] || UI_MAP[topic].en)) || '';
          if (!tp) return '';
          const ep = tail.replace(/\(الحلقة (\d+) — الموسم (\d+)\)/, (m, a, b) => ({
            en:`(Episode ${a} — Season ${b})`, fr:`(Épisode ${a} — Saison ${b})`, id:`(Episode ${a} — Musim ${b})`,
            ur:`(قسط ${a} — سیزن ${b})`, bn:`(পর্ব ${a} — সিজন ${b})`, tr:`(Bölüm ${a} — Sezon ${b})` }[lang]));
          return { en:`What’s the problem with ${tp}?`, fr:`Quel est le problème avec ${tp} ?`, id:`Apa masalah dengan ${tp}?`,
                   ur:`${tp} میں کیا مسئلہ ہے؟`, bn:`${tp} নিয়ে সমস্যা কী?`, tr:`${tp} ile sorun ne?` }[lang] + ep;
        }],
      ];
      const w3 = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
        acceptNode(n) {
          const pe = n.parentElement;
          if (!pe) return NodeFilter.FILTER_REJECT;
          if (pe.closest('script,style,textarea,select,option,[data-l10n],[data-i18n]')) return NodeFilter.FILTER_REJECT;
          if (SKIP.test(pe.className || '')) return NodeFilter.FILTER_REJECT;
          const t = n.nodeValue.trim();
          if (!t || t.length > 90) return NodeFilter.FILTER_REJECT;
          if (/^[\u0660-\u0669\d]{1,3}$/.test(t)) return NodeFilter.FILTER_ACCEPT;
          if (!isAr && /^← /.test(t) && t.length < 40 && !/[\u0600-\u06FF]/.test(t.replace(/^← /, ''))) return NodeFilter.FILTER_ACCEPT;
          /* «🕐 نص عربي» — نترجم الباقي إن كان في القاموس */
          const em = t.match(/^([^\u0600-\u06FF\w]{1,4}\s*)(.+)$/);
          if (!isAr && em && UI_MAP[em[2].trim()]) return NodeFilter.FILTER_ACCEPT;
          return PATTERNS.some(([re]) => re.test(t)) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
        }
      });
      const nodes = []; let t3;
      while ((t3 = w3.nextNode())) nodes.push(t3);
      nodes.forEach(n => {
        const raw = n.nodeValue.trim();
        const lead = n.nodeValue.match(/^\s*/)[0];
        const trail = n.nodeValue.match(/\s*$/)[0];
        if (/^[\u0660-\u0669\d]{1,3}$/.test(raw)) { n.nodeValue = lead + loc(raw) + trail; return; }
        if (/^[←→] /.test(raw)) { n.nodeValue = lead + flipArrow(raw) + trail; return; }
        const em2 = raw.match(/^([^\u0600-\u06FF\w]{1,4}\s*)(.+)$/);
        if (em2 && UI_MAP[em2[2].trim()]) {
          const e = UI_MAP[em2[2].trim()];
          const v = e[lang] || e.en;
          if (v) { n.nodeValue = lead + em2[1] + v + trail; return; }
        }
        for (const [re, make] of PATTERNS) {
          const m = raw.match(re);
          if (!m) continue;
          const args = m.slice(1).map(x => loc(x));
          const out = make.apply(null, args);
          if (out) { n.nodeValue = lead + out + trail; }
          break;
        }
      });
    }

    /* 4) عنوان الصفحة (وسط الشريط العلوي) */
    const pageTitleEl = document.querySelector('.page-title');
    if (pageTitleEl && pageTitleEl.childNodes.length) {
      const page = (location.pathname.split('/').pop() || 'index.html');
      const map  = PAGE_TITLES[page];
      if (map) {
        const pair = map[lang] || map.en || map.ar;
        if (pair) {
          if (pageTitleEl.childNodes[0]) pageTitleEl.childNodes[0].textContent = pair[0] + ' ';
          const span = pageTitleEl.querySelector('span');
          if (span && pair[1] != null) span.textContent = pair[1];
        }
      }
    }

    /* 5) زر التثبيت + صف الوضع الداكن */
    const instBtn = document.getElementById('sidebar-install-btn');
    if (instBtn) instBtn.textContent = LANG_INSTALL[lang] || LANG_INSTALL.en;
    document.querySelectorAll('.theme-row span:first-child').forEach(el => {
      if (!el.dataset.ar) el.dataset.ar = el.textContent;
      const dark = { en:'🌙 Dark Mode', fr:'🌙 Mode sombre', id:'🌙 Mode Gelap', ur:'🌙 ڈارک موڈ', bn:'🌙 ডার্ক মোড', tr:'🌙 Karanlık Mod' };
      el.textContent = isAr ? (el.dataset.ar || '🌙 الوضع الداكن') : (dark[lang] || dark.en);
    });

    /* 6) الاتجاه + لغة الصفحة */
    document.documentElement.dir  = rtl ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    document.body && document.body.setAttribute('data-lang', lang);

    /* 6.5) إبلاغ بقية الوحدات (menu.js…) لتحديث نصوصها المُولّدة */
    try { window.dispatchEvent(new CustomEvent('zad:lang', { detail: { lang } })); } catch (e) {}

    /* 7) إعادة رسم بطاقة «الآن» الديناميكية باللغة الجديدة */
    try { if (typeof window.zhNowCard === 'function') window.zhNowCard(); } catch (e) {}
  },

  toggle() {
    const i = LANG_CYCLE.indexOf(this.current);
    this.setLang(LANG_CYCLE[(i + 1) % LANG_CYCLE.length]);
  },

  init() {
    document.documentElement.setAttribute('lang', this.current);
    document.documentElement.setAttribute('dir', this.isRTL() ? 'rtl' : 'ltr');
    document.body && document.body.setAttribute('data-lang', this.current);
    this.apply();
    this._updateButtons(this.current);
    this._watch();
  },

  /* إعادة الترجمة عند إدخال محتوى جديد في الصفحة (بطاقات تُرسم بالجافاسكربت) */
  _watch() {
    if (this._obs || typeof MutationObserver === 'undefined') return;
    let timer = null;
    this._obs = new MutationObserver(() => {
      if (this._applying || this.current === 'ar') return;
      clearTimeout(timer);
      timer = setTimeout(() => {
        this._applying = true;
        try { this.apply(); } catch (e) {}
        this._applying = false;
      }, 250);
    });
    const start = () => { try { this._obs.observe(document.body, { childList: true, subtree: true }); } catch (e) {} };
    if (document.body) start(); else document.addEventListener('DOMContentLoaded', start);
  }
};

window.I18N = I18N;
window.toggleLang = () => I18N.toggle();
document.addEventListener('DOMContentLoaded', () => I18N.init());

/* ════════════════════════════════════════════════════════════
   UI_MAP — نصوص عامة (عربي → {إنجليزي، فرنسي})
   ════════════════════════════════════════════════════════════ */
const UI_MAP = {

  'القرآن الكريم': { en:'The Holy Quran', fr:'Le Saint Coran', ur:'قرآن مجید', id:'Al-Quran', tr:'Kur\'an-ı Kerim', bn:'পবিত্র কুরআন'},
  'المواسم والمناسك': { en:'Worship Seasons & Rites', fr:'Saisons d’adoration et rites', ur:'عبادت کے موسم و مناسک', id:'Musim Ibadah & Manasik', tr:'Mevsimler ve Menasik', bn:'ইবাদতের মৌসুম ও রীতিনীতি'},
  'الزكاة والصدقة': { en:'Zakat & Charity', fr:'Zakat et aumône', ur:'زکوٰۃ و صدقہ', id:'Zakat & Sedekah', tr:'Zekât ve Sadaka', bn:'যাকাত ও দান'},
  'المكتبة والمعرفة': { en:'Library & Knowledge', fr:'Bibliothèque et savoir', ur:'کتب خانہ و علم', id:'Perpustakaan & Ilmu', tr:'Kütüphane ve Bilgi', bn:'লাইব্রেরি ও জ্ঞান'},
  'ركن الأطفال': { en:'Kids Corner', fr:'Espace enfants', ur:'بچوں کا گوشہ', id:'Pojok Anak', tr:'Çocuk Köşesi', bn:'শিশু কর্নার'},
  'ألعاب القرية': { en:'Village Games', fr:'Jeux du village', ur:'گاؤں کے کھیل', id:'Permainan Desa', tr:'Köy Oyunları', bn:'গ্রামের খেলা'},
  'ورش وإبداع': { en:'Workshops & Creativity', fr:'Ateliers et créativité', ur:'ورکشاپ و تخلیق', id:'Lokakarya & Kreativitas', tr:'Atölye ve Yaratıcılık', bn:'কর্মশালা ও সৃজন'},
  'المتابعة والإحصاء': { en:'Tracking & Stats', fr:'Suivi et statistiques', ur:'نگرانی و اعداد و شمار', id:'Pelacakan & Statistik', tr:'Takip ve İstatistik', bn:'ট্র্যাকিং ও পরিসংখ্যান'},
  'العائلة والتربية': { en:'Family & Parenting', fr:'Famille et éducation', ur:'خاندان و تربیت', id:'Keluarga & Parenting', tr:'Aile ve Terbiye', bn:'পরিবার ও লালন-পালন'},
  'الذكر والدعاء': { en:'Dhikr and Dua', fr:'Dhikr et invocations', ur:'ذکر و دعا', id:'Zikir & Doa', tr:'Zikir ve Dua', bn:'জিকির ও দুআ'},
  'وضع خاص': { en:'Special Mode', fr:'Mode spécial', ur:'خصوصی موڈ', id:'Mode Khusus', tr:'Özel Mod', bn:'বিশেষ মোড'},
  'برنامج اليوم': { en:'Daily Program', fr:'Programme du jour', ur:'روز کا پروگرام', id:'Program Harian', tr:'Günlük Program', bn:'দৈনিক কর্মসূচি'},
  'الورد اليومي': { en:'Daily Wird', fr:'Wird quotidien', ur:'روزانہ ورد', id:'Wird Harian', tr:'Günlük Vird', bn:'দৈনিক ওয়ারদ'},
  'الأذكار': { en:'Dhikr', fr:'Invocations', ur:'اذکار', id:'Zikir', tr:'Zikirler', bn:'জিকির'},
  'قيم الدعاء': { en:'Du’a Guide', fr:'Guide de l’invocation', ur:'دعا کی رہنمائی', id:'Panduan Doa', tr:'Dua Rehberi', bn:'দুআর নির্দেশিকা'},
  'السنن المهجورة': { en:'Forgotten Sunnahs', fr:'Sunan oubliées', ur:'بھولی سنتیں', id:'Sunnah yang Terlupakan', tr:'Unutulan Sünnetler', bn:'বিস্মৃত সুন্নাহ'},
  'الرقية الشرعية': { en:'Ruqyah Healing', fr:'Rouqya', ur:'رقیہ شرعیہ', id:'Ruqyah Syar\'iyah', tr:'Şer\'i Rukye', bn:'শরিয়তসম্মত রুকইয়াহ'},
  'مناسك الحج': { en:'Hajj Rites', fr:'Rites du Hajj', ur:'مناسک حج', id:'Manasik Haji', tr:'Hac Menasiki', bn:'হজের রীতিনীতি'},
  'دعاء يوم عرفة': { en:'Arafah Supplication', fr:'Invocation d\'Arafah', ur:'عرفہ کی دعا', id:'Doa Hari Arafah', tr:'Arefe Günü Duası', bn:'আরাফার দিনের দুআ'},
  'لوحة رمضان': { en:'Ramadan Board', fr:'Tableau de Ramadan', ur:'رمضان ڈیش بورڈ', id:'Papan Ramadan', tr:'Ramazan Panosu', bn:'রমজান ড্যাশবোর্ড'},
  'حاسبة الزكاة': { en:'Zakat Calculator', fr:'Calculateur de Zakat', ur:'زکوٰۃ کیلکولیٹر', id:'Kalkulator Zakat', tr:'Zekât Hesaplayıcı', bn:'যাকাত ক্যালকুলেটর'},
  'أحكام الزكاة': { en:'Zakat Rules', fr:'Règles de la Zakat', ur:'زکوٰۃ کے احکام', id:'Hukum Zakat', tr:'Zekât Hükümleri', bn:'যাকাতের বিধান'},
  'أنواع الزكاة وحسابها': { en:'Zakat Types and Calculation', fr:'Types de Zakat et calcul', ur:'زکوٰۃ کی اقسام اور حساب', id:'Jenis Zakat dan Hitungannya', tr:'Zekât Türleri ve Hesabı', bn:'যাকাতের প্রকার ও হিসাব'},
  'المكتبة الصوتية': { en:'Audio Library', fr:'Bibliothèque audio', ur:'صوتی کتب خانہ', id:'Perpustakaan Audio', tr:'Sesli Kütüphane', bn:'অডিও লাইব্রেরি'},
  'المكتبة المرئية': { en:'Video Library', fr:'Bibliothèque vidéo', ur:'بصری کتب خانہ', id:'Perpustakaan Video', tr:'Görsel Kütüphane', bn:'ভিডিও লাইব্রেরি'},
  'المكتبة النصية': { en:'Text Library', fr:'Bibliothèque de textes', ur:'متنی کتب خانہ', id:'Perpustakaan Teks', tr:'Metin Kütüphanesi', bn:'টেক্সট লাইব্রেরি'},
  'ثُريّا — الرئيسية': { en:'Thuraya — Home', fr:'Thuraya — Accueil', ur:'ثریا — مرکزی صفحہ', id:'Thuraya — Beranda', tr:'Thuraya — Ana Sayfa', bn:'থুরাইয়া — হোম'},
  'حكايات القرية': { en:'Village Tales', fr:'Contes du village', ur:'گاؤں کی کہانیاں', id:'Kisah Desa', tr:'Köy Masalları', bn:'গ্রামের গল্প'},
  'غرس — قصص للأطفال': { en:'Ghars — Kids Stories', fr:'Ghars — Histoires pour enfants', ur:'غرس — بچوں کی کہانیاں', id:'Ghars — Cerita Anak', tr:'Ghars — Çocuk Hikâyeleri', bn:'গারস — শিশুদের গল্প'},
  'صحيفة القرية': { en:'Village Gazette', fr:'Gazette du village', ur:'گاؤں کا اخبار', id:'Koran Desa', tr:'Köy Gazetesi', bn:'গ্রামের পত্রিকা'},
  'حكاية حج': { en:'A Hajj Story', fr:'Une histoire de Hajj', ur:'حج کی کہانی', id:'Kisah Haji', tr:'Hac Hikâyesi', bn:'হজের গল্প'},
  'مدرستي الجميلة': { en:'My Beautiful School', fr:'Ma belle école', ur:'میرا خوبصورت اسکول', id:'Sekolahku yang Indah', tr:'Güzel Okulum', bn:'আমার সুন্দর স্কুল'},
  'يومي': { en:'My Day', fr:'Ma journée', ur:'میرا دن', id:'Hariku', tr:'Günüm', bn:'আমার দিন'},
  'محقّق القرية': { en:'Village Detective', fr:'Détective du village', ur:'گاؤں کا تفتیش کار', id:'Detektif Desa', tr:'Köy Dedektifi', bn:'গ্রামের গোয়েন্দা'},
  'مدينة الميزان': { en:'City of Balance', fr:'La cité de la balance', ur:'میزان کا شہر', id:'Kota Keseimbangan', tr:'Denge Şehri', bn:'ভারসাম্যের শহর'},
  'قصر الذاكرة': { en:'Memory Palace', fr:'Le palais de la mémoire', ur:'یادداشت کا محل', id:'Istana Memori', tr:'Hafıza Sarayı', bn:'স্মৃতির প্রাসাদ'},
  'من يكذب؟': { en:'Who Is Lying?', fr:'Qui ment ?', ur:'کون جھوٹ بول رہا ہے؟', id:'Siapa yang Berbohong?', tr:'Kim Yalan Söylüyor?', bn:'কে মিথ্যা বলছে?'},
  'عرين الأبطال': { en:'Heroes’ Den', fr:'L\'antre des héros', ur:'بہادروں کا اڈہ', id:'Sarang Para Pahlawan', tr:'Kahramanlar Yuvası', bn:'বীরদের আস্তানা'},
  'شاشة المرح': { en:'Fun Screen', fr:'Écran de jeux', ur:'تفریح کی اسکرین', id:'Layar Keseruan', tr:'Eğlence Ekranı', bn:'আনন্দের স্ক্রিন'},
  'بستان الذكر': { en:'Dhikr Garden', fr:'Le jardin du dhikr', ur:'ذکر کا باغ', id:'Taman Zikir', tr:'Zikir Bahçesi', bn:'জিকিরের বাগান'},
  'الوصفة': { en:'The Recipe', fr:'La recette', ur:'ترکیب', id:'Resep', tr:'Tarif', bn:'রেসিপি'},
  'الطريق إلى البيت': { en:'The Way Home', fr:'Le chemin de la maison', ur:'گھر کا راستہ', id:'Jalan Pulang', tr:'Eve Giden Yol', bn:'বাড়ির পথ'},
  'التجربة': { en:'The Experiment', fr:'L\'expérience', ur:'تجربہ', id:'Eksperimen', tr:'Deney', bn:'পরীক্ষা'},
  'ترتيب الضيافة': { en:'Hospitality Order', fr:'Ordre de l\'hospitalité', ur:'مہمان نوازی کی ترتیب', id:'Urutan Menjamu', tr:'Misafir Ağırlama Sırası', bn:'আপ্যায়নের ক্রম'},
  'نادي الإبداع': { en:'Creativity Club', fr:'Club de créativité', ur:'تخلیقی کلب', id:'Klub Kreativitas', tr:'Yaratıcılık Kulübü', bn:'সৃজন ক্লাব'},
  'حصاد الشهر': { en:'Monthly Harvest', fr:'Bilan mensuel', ur:'مہینے کا حاصل', id:'Panen Bulanan', tr:'Aylık Hasat', bn:'মাসিক ফসল'},
  'المجموعات والمنافسة': { en:'Groups and Competition', fr:'Groupes et compétition', ur:'گروپ اور مقابلہ', id:'Grup & Kompetisi', tr:'Gruplar ve Yarışma', bn:'দল ও প্রতিযোগিতা'},
  'دليل المربي': { en:'Parent Guide', fr:'Guide des parents', ur:'مربی کے لیے رہنما', id:'Panduan Orang Tua', tr:'Ebeveyn Rehberi', bn:'অভিভাবক নির্দেশিকা'},
  'الخصوصية وكيف يعمل': { en:'Privacy and How It Works', fr:'Confidentialité et fonctionnement', ur:'رازداری اور طریقہ کار', id:'Privasi & Cara Kerja', tr:'Gizlilik ve Nasıl Çalışır', bn:'গোপনীয়তা ও কার্যপদ্ধতি'},
  'زهرة — رفيقةُ العذر': { en:'Zahra — Your Cycle Companion', fr:'Zahra — Compagne du cycle', ur:'زہرہ — ایامِ عذر میں ساتھی', id:'Zahra — Pendamping Uzur', tr:'Zehra — Özel Gün Yoldaşı', bn:'জাহরা — ওজরের সঙ্গী'},
  'حواء — عبادتي في عذري': { en:'Hawwa — My Worship During Menses', fr:'Hawwa — Mon adoration pendant les règles', ur:'حوا — عذر کے دنوں میں میری عبادت', id:'Hawa — Ibadah Saat Uzur', tr:'Havva — Özel Günlerde İbadetim', bn:'হাওয়া — ওজরে আমার ইবাদত'},
  'عن المطوّر': { en:'About the Developer', fr:'À propos du développeur', ur:'ڈویلپر کے بارے میں', id:'Tentang Pengembang', tr:'Geliştirici Hakkında', bn:'ডেভেলপার সম্পর্কে'},
  /* روابط القائمة */
  'لوحة التحكم': { en:'Dashboard', fr:'Tableau de bord', ur:'ڈیش بورڈ', id:'Dasbor', tr:'Panel', bn:'ড্যাশবোর্ড'},
  'مواقيت الصلاة': { en:'Prayer Times', fr:'Heures de prière', ur:'نماز کے اوقات', id:'Waktu Salat', tr:'Namaz Vakitleri', bn:'নামাজের সময়'},
  'اتجاه القبلة': { en:'Qibla Direction', fr:'Direction de la Qibla', ur:'قبلہ کی سمت', id:'Arah Kiblat', tr:'Kıble Yönü', bn:'কিবলার দিক'},
  'التقويم الهجري': { en:'Hijri Calendar', fr:'Calendrier Hégirien', ur:'ہجری کیلنڈر', id:'Kalender Hijriah', tr:'Hicri Takvim', bn:'হিজরি ক্যালেন্ডার'},
  'ورد العشر': { en:'Wird of the Ten Days', fr:'Wird des dix jours', ur:'عشرہ کا ورد', id:'Wird Sepuluh Hari', tr:'On Günlük Vird', bn:'দশ দিনের ওয়ারদ'},
  'الورد القرآني': { en:'Daily Quran Wird', fr:'Wird quotidien du Coran', ur:'قرآنی ورد', id:'Wird Al-Quran', tr:'Kur\'an Virdi', bn:'কুরআনের ওয়ারদ'},
  'المصحف الشريف': { en:'Holy Quran', fr:'Le Moushaf', ur:'مصحف شریف', id:'Mushaf Suci', tr:'Kur\'an-ı Kerim', bn:'পবিত্র মুসহাফ'},
  'تسميع القرآن': { en:'Quran Memorization Check', fr:'Vérification de la mémorisation', ur:'حفظ کی جانچ', id:'Setoran Hafalan', tr:'Ezber Kontrolü', bn:'হিফজ যাচাই'},
  'إذاعات القرآن': { en:'Quran Radio', fr:'Radios du Coran', ur:'قرآنی ریڈیو', id:'Radio Quran', tr:'Kur\'an Radyoları', bn:'কুরআন রেডিও'},
  'المسبحة': { en:'Tasbih Counter', fr:'Compteur de Tasbih', ur:'تسبیح کاؤنٹر', id:'Tasbih', tr:'Tesbih', bn:'তাসবিহ'},
  'الأذكار والدعاء': { en:'Dhikr & Supplications', fr:'Dhikr et invocations', ur:'اذکار و دعا', id:'Zikir & Doa', tr:'Zikir ve Dua', bn:'জিকির ও দুআ'},
  'الأربعون النووية': { en:'The Forty Hadiths of Nawawi', fr:'Les Quarante Hadiths de Nawawi', ur:'نووی کی چالیس حدیثیں', id:'Arbain Nawawi', tr:'Nevevi Kırk Hadis', bn:'নববীর চল্লিশ হাদিস'},
  'الأدعية': { en:'Supplications', fr:'Invocations', ur:'دعائیں', id:'Doa-doa', tr:'Dualar', bn:'দুআসমূহ'},
  'جدول العبادات': { en:'Worship Tracker', fr:'Suivi des adorations', ur:'عبادات کا شیڈول', id:'Jadwal Ibadah', tr:'İbadet Takvimi', bn:'ইবাদতের সূচি'},
  'فضائل العشر': { en:'Virtues of the 10 Days', fr:'Mérites des 10 jours', ur:'عشرہ کے فضائل', id:'Keutamaan Sepuluh Hari', tr:'On Günün Fazileti', bn:'দশ দিনের ফজিলত'},
  'يوم عرفة': { en:'Day of Arafah', fr:'Jour de Arafah', ur:'عرفہ کا دن', id:'Hari Arafah', tr:'Arefe Günü', bn:'আরাফার দিন'},
  'دليل الأضحية': { en:'Sacrifice Guide', fr:'Guide du sacrifice', ur:'قربانی کی رہنمائی', id:'Panduan Kurban', tr:'Kurban Rehberi', bn:'কুরবানির নির্দেশিকা'},
  'صدقة العشر': { en:'Charity of the Ten Days', fr:'Aumône des dix jours', ur:'عشرہ کا صدقہ', id:'Sedekah Sepuluh Hari', tr:'On Gün Sadakası', bn:'দশ দিনের সদকা'},
  'الصدقة والبر': { en:'Charity & Giving', fr:'Aumône et bienfaisance', ur:'صدقہ و نیکی', id:'Sedekah & Kebaikan', tr:'Sadaka ve İyilik', bn:'সদকা ও সৎকর্ম'},
  'حصاد العشر': { en:'Ten-Day Harvest', fr:'Bilan des dix jours', ur:'عشرہ کا حاصل', id:'Panen Sepuluh Hari', tr:'On Gün Hasadı', bn:'দশ দিনের ফসল'},
  'حصاد العبادات': { en:'Worship Harvest', fr:'Bilan des adorations', ur:'عبادات کا حاصل', id:'Panen Ibadah', tr:'İbadet Hasadı', bn:'ইবাদতের ফসল'},
  'إحصاء العشر': { en:'Ten-Day Summary', fr:'Récapitulatif des dix jours', ur:'عشرہ کا خلاصہ', id:'Ringkasan Sepuluh Hari', tr:'On Gün Özeti', bn:'দশ দিনের সারসংক্ষেপ'},
  'إحصاء العبادات': { en:'Worship Summary', fr:'Récapitulatif des adorations', ur:'عبادات کا خلاصہ', id:'Ringkasan Ibadah', tr:'İbadet Özeti', bn:'ইবাদতের সারসংক্ষেপ'},
  'أوسمتي': { en:'My Badges', fr:'Mes badges', ur:'میرے تمغے', id:'Lencanaku', tr:'Rozetlerim', bn:'আমার ব্যাজ'},
  'محاضرات العشر': { en:'Lectures of the 10 Days', fr:'Conférences des 10 jours', ur:'عشرہ کے بیانات', id:'Ceramah Sepuluh Hari', tr:'On Gün Sohbetleri', bn:'দশ দিনের বক্তৃতা'},
  'المرئيات والمحاضرات': { en:'Videos & Lectures', fr:'Vidéos et conférences', ur:'ویڈیوز و بیانات', id:'Video & Ceramah', tr:'Videolar ve Sohbetler', bn:'ভিডিও ও বক্তৃতা'},
  'قائمة التشغيل': { en:'Playlist', fr:'Liste de lecture', ur:'پلے لسٹ', id:'Daftar Putar', tr:'Oynatma Listesi', bn:'প্লেলিস্ট'},
  'ثُريّا — وضع الأطفال': { en:'Thuraya — Kids Mode', fr:'Thuraya — Mode enfants', ur:'ثریا — بچوں کا موڈ', id:'Thuraya — Mode Anak', tr:'Thuraya — Çocuk Modu', bn:'থুরাইয়া — শিশু মোড'},
  'غرس — رحلة الحج': { en:'Ghars — Hajj Journey', fr:'Ghars — Voyage du Hajj', ur:'غرس — حج کا سفر', id:'Ghars — Perjalanan Haji', tr:'Ghars — Hac Yolculuğu', bn:'গারস — হজের সফর'},
  'أسماء الله الحسنى': { en:'The 99 Names of Allah', fr:'Les 99 noms d’Allah', ur:'اللہ کے حسین نام', id:'Asmaul Husna', tr:'Allah\'ın Güzel İsimleri', bn:'আল্লাহর সুন্দর নামসমূহ'},
  'تدبّر بالذكاء': { en:'AI Reflection', fr:'Réflexion par IA', ur:'اے آئی سے تدبر', id:'Tadabur dengan AI', tr:'Yapay Zekâ ile Tefekkür', bn:'এআই দিয়ে তাদাব্বুর'},
  'حسابي': { en:'My Account', fr:'Mon compte', ur:'میرا حساب', id:'Akun Saya', tr:'Hesabım', bn:'আমার অ্যাকাউন্ট'},
  'الإعدادات': { en:'Settings', fr:'Paramètres', ur:'ترتیبات', id:'Pengaturan', tr:'Ayarlar', bn:'সেটিংস'},
  'بلاغ مشكلة': { en:'Report Issue', fr:'Signaler un problème', ur:'مسئلہ کی اطلاع', id:'Laporkan Masalah', tr:'Sorun Bildir', bn:'সমস্যা জানান'},
  'عن التطبيق': { en:'About', fr:'À propos', ur:'ایپ کے بارے میں', id:'Tentang Aplikasi', tr:'Uygulama Hakkında', bn:'অ্যাপ সম্পর্কে'},
  /* فواصل الأقسام */
  'الصلاة والتقويم': { en:'Prayer & Calendar', fr:'Prière et calendrier', ur:'نماز و کیلنڈر', id:'Salat & Kalender', tr:'Namaz ve Takvim', bn:'নামাজ ও ক্যালেন্ডার'},
  'القرآن والعبادة': { en:'Quran & Worship', fr:'Coran et adoration', ur:'قرآن و عبادت', id:'Quran & Ibadah', tr:'Kur\'an ve İbadet', bn:'কুরআন ও ইবাদত'},
  'الحج والمناسك': { en:'Hajj & Rites', fr:'Hajj et rites', ur:'حج و مناسک', id:'Haji & Manasik', tr:'Hac ve Menasik', bn:'হজ ও রীতিনীতি'},
  'المتابعة': { en:'Tracking', fr:'Suivi', ur:'نگرانی', id:'Pelacakan', tr:'Takip', bn:'ট্র্যাকিং'},
  'التعلم والترفيه': { en:'Learning & Entertainment', fr:'Apprentissage et loisirs', ur:'سیکھنا اور تفریح', id:'Belajar & Hiburan', tr:'Öğrenme ve Eğlence', bn:'শেখা ও বিনোদন'},
  'التعلّم والترفيه': { en:'Learning & Entertainment', fr:'Apprentissage et loisirs', ur:'سیکھنا اور تفریح', id:'Belajar & Hiburan', tr:'Öğrenme ve Eğlence', bn:'শেখা ও বিনোদন'},
  /* عامة */
  'الوضع الداكن': { en:'Dark Mode', fr:'Mode sombre', ur:'ڈارک موڈ', id:'Mode Gelap', tr:'Karanlık Mod', bn:'ডার্ক মোড'},
  'تثبيت / تحميل التطبيق': { en:'Install App', fr:"Installer l'application", ur:'ایپ انسٹال کریں', id:'Pasang Aplikasi', tr:'Uygulamayı Yükle', bn:'অ্যাপ ইনস্টল করুন'},
  /* عناوين أقسام */
  'ابدأ يومك الآن': { en:'Start Your Day Now', fr:'Commencez votre journée', ur:'اپنا دن شروع کریں', id:'Mulai Harimu', tr:'Gününe Başla', bn:'আপনার দিন শুরু করুন'},
  'مؤشر الالتزام الروحاني': { en:'Spiritual Commitment Index', fr:'Indice d’engagement spirituel', ur:'روحانی استقامت کا اشاریہ', id:'Indeks Komitmen Spiritual', tr:'Manevi Bağlılık Endeksi', bn:'আধ্যাত্মিক নিষ্ঠার সূচক'},
  '📖 آية اليوم': { en:'📖 Verse of the Day', fr:'📖 Verset du jour', ur:'📖 آج کی آیت', id:'📖 Ayat Hari Ini', tr:'📖 Günün Ayeti', bn:'📖 আজকের আয়াত'},
  '⚡ عبادات سريعة': { en:'⚡ Quick Worship', fr:'⚡ Adorations rapides', ur:'⚡ فوری عبادات', id:'⚡ Ibadah Cepat', tr:'⚡ Hızlı İbadetler', bn:'⚡ দ্রুত ইবাদত'},
  '🕌 الفرائض': { en:'🕌 Obligatory Prayers', fr:'🕌 Prières obligatoires', ur:'🕌 فرض نمازیں', id:'🕌 Salat Wajib', tr:'🕌 Farz Namazlar', bn:'🕌 ফরজ নামাজ'},
  '⭐ السنن والنوافل': { en:'⭐ Sunnah & Optional Prayers', fr:'⭐ Prières surérogatoires', ur:'⭐ سنتیں و نفل', id:'⭐ Sunnah & Nafilah', tr:'⭐ Sünnet ve Nafile', bn:'⭐ সুন্নাহ ও নফল'},
  '📿 الذكر والاستغفار': { en:'📿 Dhikr & Repentance', fr:'📿 Dhikr et repentir', ur:'📿 ذکر و استغفار', id:'📿 Zikir & Istigfar', tr:'📿 Zikir ve İstiğfar', bn:'📿 জিকির ও ইস্তিগফার'},
  '🌙 الصيام والعطاء': { en:'🌙 Fasting & Giving', fr:'🌙 Jeûne et don', ur:'🌙 روزہ و عطیہ', id:'🌙 Puasa & Berbagi', tr:'🌙 Oruç ve İnfak', bn:'🌙 রোজা ও দান'},
  '📅 تتبع الصيام — الأيام التسعة': { en:'📅 Fasting Tracker — Nine Days', fr:'📅 Suivi du jeûne — neuf jours', ur:'📅 روزوں کی نگرانی — نو دن', id:'📅 Pelacak Puasa — Sembilan Hari', tr:'📅 Oruç Takibi — Dokuz Gün', bn:'📅 রোজার হিসাব — নয় দিন'},
  '📖 خطة الختمة — 10 أيام': { en:'📖 Quran Completion Plan — 10 Days', fr:'📖 Plan de lecture — 10 jours', ur:'📖 ختمِ قرآن کا منصوبہ — ۱۰ دن', id:'📖 Rencana Khatam — 10 Hari', tr:'📖 Hatim Planı — 10 Gün', bn:'📖 খতম পরিকল্পনা — ১০ দিন'},
  '🤲 تحدي الدعاء والعطاء': { en:'🤲 Dua & Giving Challenge', fr:'🤲 Défi invocation et don', ur:'🤲 دعا و عطیہ چیلنج', id:'🤲 Tantangan Doa & Berbagi', tr:'🤲 Dua ve İnfak Meydan Okuması', bn:'🤲 দুআ ও দানের চ্যালেঞ্জ'},
  '✨ إحياء السنن اليومية': { en:'✨ Daily Sunnah Revival', fr:'✨ Raviver les sunnas quotidiennes', ur:'✨ روزانہ سنتیں زندہ کریں', id:'✨ Menghidupkan Sunnah Harian', tr:'✨ Günlük Sünnetleri İhya', bn:'✨ দৈনিক সুন্নাহ পুনর্জীবন'},
  '🚫 لصوص العشر': { en:'🚫 Time Thieves', fr:'🚫 Les voleurs de temps', ur:'🚫 عشرہ کے چور', id:'🚫 Pencuri Waktu', tr:'🚫 Zaman Hırsızları', bn:'🚫 সময়ের চোরেরা'},
  '📊 إحصائيات اليوم': { en:"📊 Today's Stats", fr:'📊 Statistiques du jour', ur:'📊 آج کے اعداد و شمار', id:'📊 Statistik Hari Ini', tr:'📊 Günün İstatistikleri', bn:'📊 আজকের পরিসংখ্যান'},
  '🏅 أوسمتي': { en:'🏅 My Badges', fr:'🏅 Mes badges', ur:'🏅 میرے تمغے', id:'🏅 Lencanaku', tr:'🏅 Rozetlerim', bn:'🏅 আমার ব্যাজ'},
  '🎬 محاضرات العشر': { en:'🎬 Lectures of the 10 Days', fr:'🎬 Conférences des 10 jours', ur:'🎬 عشرہ کے لیکچر', id:'🎬 Ceramah Sepuluh Hari', tr:'🎬 On Gün Sohbetleri', bn:'🎬 দশ দিনের বক্তৃতা'},
  /* أزرار */
  'تفعيل': { en:'Activate', fr:'Activer', ur:'فعال کریں', id:'Aktifkan', tr:'Etkinleştir', bn:'চালু করুন'},
  'مشاركة': { en:'Share', fr:'Partager', ur:'شیئر', id:'Bagikan', tr:'Paylaş', bn:'শেয়ার'},
  'تحميل': { en:'Download', fr:'Télécharger', ur:'ڈاؤن لوڈ', id:'Unduh', tr:'İndir', bn:'ডাউনলোড'},
  'تثبيت': { en:'Install', fr:'Installer', ur:'انسٹال', id:'Pasang', tr:'Yükle', bn:'ইনস্টল'},
  'إرسال': { en:'Send', fr:'Envoyer', ur:'بھیجیں', id:'Kirim', tr:'Gönder', bn:'পাঠান'},
  'إغلاق': { en:'Close', fr:'Fermer', ur:'بند کریں', id:'Tutup', tr:'Kapat', bn:'বন্ধ করুন'},
  'عرض الكل ←': { en:'View all →', fr:'Voir tout →', ur:'سب دیکھیں ←', id:'Lihat semua →', tr:'Tümünü gör →', bn:'সব দেখুন →'},
  'ملخص العشر ←': { en:'Summary →', fr:'Récapitulatif →', ur:'خلاصہ ←', id:'Ringkasan →', tr:'Özet →', bn:'সারসংক্ষেপ →'},
  'ملخص العبادات ←': { en:'Summary →', fr:'Récapitulatif →', ur:'خلاصہ ←', id:'Ringkasan →', tr:'Özet →', bn:'সারসংক্ষেপ →'},
  'تذكيرات': { en:'Reminders', fr:'Rappels', ur:'یاد دہانیاں', id:'Pengingat', tr:'Hatırlatıcılar', bn:'রিমাইন্ডার'},
  'تغيير': { en:'Change', fr:'Changer', ur:'تبدیل کریں', id:'Ubah', tr:'Değiştir', bn:'পরিবর্তন'},
  /* أيام/أوقات */
  'يتجدد في': { en:'Resets in', fr:'Réinitialisation dans', ur:'تجدید ہونے میں', id:'Diperbarui dalam', tr:'Yenilenme:', bn:'নবায়ন হতে বাকি'},
  'صفحة': { en:'Page', fr:'Page', ur:'صفحہ', id:'Halaman', tr:'Sayfa', bn:'পৃষ্ঠা'},
  'الجزء': { en:'Juz', fr:'Juz', ur:'پارہ', id:'Juz', tr:'Cüz', bn:'পারা'},
  'آية': { en:'Verse', fr:'Verset', ur:'آیت', id:'Ayat', tr:'Ayet', bn:'আয়াত'},
  'مرحبًا': { en:'Welcome', fr:'Bienvenue', id:'Selamat datang', ur:'خوش آمدید', bn:'স্বাগতম', tr:'Hoş geldiniz' },
  'الصلاة القادمة': { en:'Next prayer', fr:'Prochaine prière', id:'Salat berikutnya', ur:'اگلی نماز', bn:'পরবর্তী নামাজ', tr:'Sıradaki namaz' },
  'بعد': { en:'in', fr:'dans', id:'lagi', ur:'بعد', bn:'পরে', tr:'sonra' },
  'حدّد موقعك لعرض مواقيتك على القوس': { en:'Set your location to show your prayer times on the arc', fr:'Définissez votre position pour afficher vos horaires sur l’arc', id:'Atur lokasi untuk menampilkan waktu salat di busur', ur:'اپنا مقام مقرر کریں تاکہ اوقاتِ نماز قوس پر نظر آئیں', bn:'আপনার অবস্থান নির্ধারণ করুন — সময়গুলো বৃত্তচাপে দেখা যাবে', tr:'Vakitlerin yayda görünmesi için konumunu belirle' },
  'ورد اليوم': { en:'Today’s wird', fr:'Wird du jour', id:'Wird hari ini', ur:'آج کا ورد', bn:'আজকের ওয়ারদ', tr:'Bugünün virdi' },
  '🔥 يوم متتالٍ': { en:'🔥 Day Streak', fr:'🔥 jours d’affilée', id:'🔥 hari berturut-turut', ur:'🔥 لگاتار دن', bn:'🔥 ধারাবাহিক দিন', tr:'🔥 gün serisi' },
  '🏅 وسام': { en:'🏅 Badge', fr:'🏅 Insigne', id:'🏅 Lencana', ur:'🏅 تمغہ', bn:'🏅 ব্যাজ', tr:'🏅 Rozet' },
  'الآن': { en:'Now', fr:'Maintenant', id:'Sekarang', ur:'اب', bn:'এখন', tr:'Şimdi' },
  'افتح وردك': { en:'Open your wird', fr:'Ouvrir votre wird', id:'Buka wird-mu', ur:'اپنا ورد کھولیں', bn:'আপনার ওয়ারদ খুলুন', tr:'Virdini aç' },
  'خطوة واحدة تكفي اليوم': { en:'One step is enough today', fr:'Une étape suffit aujourd’hui', id:'Satu langkah cukup hari ini', ur:'آج ایک قدم کافی ہے', bn:'আজ এক ধাপই যথেষ্ট', tr:'Bugün bir adım yeter' },
  '📖 وردك القرآني': { en:'📖 Your Quran wird', fr:'📖 Votre wird coranique', id:'📖 Wird Al-Quranmu', ur:'📖 آپ کا قرآنی ورد', bn:'📖 আপনার কুরআন ওয়ারদ', tr:'📖 Kur’an virdin' },
  '🤲 أذكار الوقت': { en:'🤲 Dhikr of the hour', fr:'🤲 Dhikr du moment', id:'🤲 Zikir waktu', ur:'🤲 وقت کے اذکار', bn:'🤲 সময়ের জিকির', tr:'🤲 Vakit zikri' },
  '📿 سبّح': { en:'Count Tasbih', fr:'Compteur de tasbih', id:'📿 Bertasbih', ur:'📿 تسبیح کریں', bn:'📿 তাসবিহ করুন', tr:'Tesbih çek' },
  'التفاصيل ←': { en:'Details →', fr:'Détails →', id:'Detail →', ur:'تفصیلات ←', bn:'বিস্তারিত →', tr:'Detaylar →' },
  'من 12 عبادة': { en:'of 12 acts of worship', fr:'sur 12 actes d’adoration', id:'dari 12 ibadah', ur:'۱۲ عبادات میں سے', bn:'১২ ইবাদতের মধ্যে', tr:'12 ibadetten' },
  'الفجر': { en:'Fajr', fr:'Fajr', id:'Subuh', ur:'فجر', bn:'ফজর', tr:'Sabah' },
  'الشروق': { en:'Sunrise', fr:'Lever du soleil', id:'Terbit', ur:'طلوعِ آفتاب', bn:'সূর্যোদয়', tr:'Güneş doğumu' },
  'الظهر': { en:'Dhuhr', fr:'Dhohr', id:'Zuhur', ur:'ظہر', bn:'যোহর', tr:'Öğle' },
  'العصر': { en:'Asr', fr:'Asr', id:'Asar', ur:'عصر', bn:'আসর', tr:'İkindi' },
  'المغرب': { en:'Maghrib', fr:'Maghreb', id:'Magrib', ur:'مغرب', bn:'মাগরিব', tr:'Akşam' },
  'العشاء': { en:'Isha', fr:'Icha', id:'Isya', ur:'عشاء', bn:'এশা', tr:'Yatsı' },
  'السنن الرواتب': { en:'Sunnah rawatib', fr:'Sunan rawatib', id:'Sunnah rawatib', ur:'سنن رواتب', bn:'সুন্নত রাওয়াতিব', tr:'Revâtip sünnetler' },
  'صلاة الضحى': { en:'Duha prayer', fr:'Prière du Duha', id:'Salat Duha', ur:'نماز چاشت', bn:'দুহা নামাজ', tr:'Kuşluk namazı' },
  'قيام الليل': { en:'Night prayer', fr:'Prière de la nuit', id:'Salat malam', ur:'تہجد', bn:'রাতের নামাজ', tr:'Gece namazı' },
  'أذكار الصباح': { en:'Morning dhikr', fr:'Dhikr du matin', id:'Zikir pagi', ur:'صبح کے اذکار', bn:'সকালের জিকির', tr:'Sabah zikri' },
  'أذكار المساء': { en:'Evening dhikr', fr:'Dhikr du soir', id:'Zikir petang', ur:'شام کے اذکار', bn:'সন্ধ্যার জিকির', tr:'Akşam zikri' },
  '١٠٠ تكبيرة': { en:'100 takbirs', fr:'100 takbirs', id:'100 takbir', ur:'۱۰۰ تکبیر', bn:'১০০ তাকবির', tr:'100 tekbir' },
  'استغفار وتوبة': { en:'Istighfar & repentance', fr:'Istighfar et repentir', id:'Istigfar & tobat', ur:'استغفار و توبہ', bn:'ইস্তিগফার ও তওবা', tr:'İstiğfar ve tevbe' },
  '☀️ آية الصباح': { en:'☀️ Morning verse', fr:'☀️ Verset du matin', id:'☀️ Ayat pagi', ur:'☀️ صبح کی آیت', bn:'☀️ সকালের আয়াত', tr:'☀️ Sabah ayeti' },
  'أرقام اليوم': { en:'Today’s numbers', fr:'Les chiffres du jour', id:'Angka hari ini', ur:'آج کے اعداد', bn:'আজকের সংখ্যা', tr:'Bugünün sayıları' },
  'الملخص ←': { en:'Summary →', fr:'Récapitulatif →', id:'Ringkasan →', ur:'خلاصہ ←', bn:'সারসংক্ষেপ →', tr:'Özet →' },
  'تكبيرة': { en:'Takbir', fr:'Takbir', id:'Takbir', ur:'تکبیر', bn:'তাকবির', tr:'Tekbir' },
  'جزء من الختمة': { en:'Juz of the khatma', fr:'Juz de la khatma', id:'Juz khatam', ur:'ختم کا پارہ', bn:'খতমের পারা', tr:'Hatim cüzü' },
  'صلوات': { en:'Prayers', fr:'Prières', id:'Salat', ur:'نمازیں', bn:'নামাজ', tr:'Namazlar' },
  'إنجاز الورد': { en:'Wird progress', fr:'Progression du wird', id:'Capaian wird', ur:'ورد کی پیش رفت', bn:'ওয়ারদের অগ্রগতি', tr:'Vird ilerlemesi' },
  'الكل ←': { en:'All →', fr:'Tout →', id:'Semua →', ur:'سب ←', bn:'সব →', tr:'Tümü →' },
  'اذهب إلى': { en:'Go to', fr:'Aller à', id:'Buka', ur:'جائیں', bn:'যান', tr:'Git' },
  'صباح ومساء': { en:'Morning & evening', fr:'Matin et soir', id:'Pagi & petang', ur:'صبح و شام', bn:'সকাল ও সন্ধ্যা', tr:'Sabah ve akşam' },
  'تكبير وذكر': { en:'Takbir & dhikr', fr:'Takbir et dhikr', id:'Takbir & zikir', ur:'تکبیر و ذکر', bn:'তাকবির ও জিকির', tr:'Tekbir ve zikir' },
  'حكايات وألعاب': { en:'Stories & games', fr:'Histoires et jeux', id:'Kisah & permainan', ur:'کہانیاں و کھیل', bn:'গল্প ও খেলা', tr:'Hikâyeler ve oyunlar' },
  'فرائض بدقّة': { en:'Precise shares', fr:'Parts précises', id:'Hitungan presisi', ur:'دقیق حصے', bn:'নিখুঁত হিসাব', tr:'Hassas paylar' },
  'عدّاد القضاء': { en:'Missed-prayer counter', fr:'Compteur de rattrapage', id:'Penghitung qada', ur:'قضا کا شمار', bn:'কাজা কাউন্টার', tr:'Kaza sayacı' },
  'شخصان لا أكثر': { en:'Only two people', fr:'Deux personnes seulement', id:'Hanya dua orang', ur:'صرف دو لوگ', bn:'মাত্র দুই জন', tr:'Yalnızca iki kişi' },
  'أسهم وكريبتو': { en:'Stocks & crypto', fr:'Actions et crypto', id:'Saham & kripto', ur:'اسٹاک و کریپٹو', bn:'স্টক ও ক্রিপ্টো', tr:'Hisse ve kripto' },
  '🎧 استمع': { en:'🎧 Listen', fr:'🎧 Écouter', id:'🎧 Dengarkan', ur:'🎧 سنیں', bn:'🎧 শুনুন', tr:'🎧 Dinle' },
  'المكتبة الكاملة': { en:'Full library', fr:'Bibliothèque complète', id:'Perpustakaan lengkap', ur:'مکمل کتب خانہ', bn:'সম্পূর্ণ লাইব্রেরি', tr:'Tüm kütüphane' },
  'ثبّت زاد على هاتفك': { en:'Install Zad on your phone', fr:'Installez Zad sur votre téléphone', id:'Pasang Zad di ponselmu', ur:'زاد کو اپنے فون پر نصب کریں', bn:'ফোনে যাদ ইনস্টল করুন', tr:'Zad’ı telefonuna yükle' },
  'يعمل بدون إنترنت — في المصلى والمسجد': { en:'Works offline — in the prayer room and the mosque', fr:'Fonctionne hors ligne — à la salle de prière et à la mosquée', id:'Berjalan tanpa internet — di musala dan masjid', ur:'انٹرنیٹ کے بغیر چلتا ہے — مصلیٰ اور مسجد میں', bn:'ইন্টারনেট ছাড়াই চলে — নামাজের ঘরে ও মসজিদে', tr:'İnternetsiz çalışır — mescit ve camide' },
  'انتقل للمحتوى الرئيسي': { en:'Skip to main content', fr:'Aller au contenu principal', id:'Lompat ke konten utama', ur:'مرکزی مواد پر جائیں', bn:'মূল কনটেন্টে যান', tr:'Ana içeriğe geç' },
  'شارك هذه الصفحة مع أحبابك — الدالّ على الخير كفاعله': { en:'Share this page with your loved ones — whoever guides to good has the reward of the doer', fr:'Partagez cette page avec vos proches — celui qui guide vers le bien a la récompense de celui qui le fait', id:'Bagikan halaman ini kepada orang tercinta — yang menunjukkan kebaikan mendapat pahala seperti pelakunya', ur:'یہ صفحہ اپنوں سے شیئر کریں — نیکی کی راہ دکھانے والے کو کرنے والے جیسا اجر ملتا ہے', bn:'এই পৃষ্ঠাটি প্রিয়জনদের সঙ্গে শেয়ার করুন — ভালোর পথ দেখানো ব্যক্তি করার সমান প্রতিদান পান', tr:'Bu sayfayı sevdiklerinle paylaş — hayra vesile olan, yapan gibi sevap kazanır' },
  'مشاركة الصفحة': { en:'Share page', fr:'Partager la page', id:'Bagikan halaman', ur:'صفحہ شیئر کریں', bn:'পৃষ্ঠা শেয়ার করুন', tr:'Sayfayı paylaş' },
  'الفقه واللحظات': { en:'Fiqh & Life Moments', fr:'Fiqh et moments de vie', id:'Fikih & Momen Hidup', ur:'فقہ اور مواقع', bn:'ফিকহ ও জীবনের মুহূর্ত', tr:'Fıkıh ve Hayat Anları' },
  'التقويم السنوي': { en:'Yearly Calendar', fr:'Calendrier annuel', id:'Kalender Tahunan', ur:'سالانہ کیلنڈر', bn:'বার্ষিক ক্যালেন্ডার', tr:'Yıllık Takvim' },
  'حصن المسلم': { en:'Fortress of the Muslim', fr:'La Citadelle du musulman', id:'Benteng Muslim', ur:'حصن المسلم', bn:'হিসনুল মুসলিম', tr:'Hisnü’l-Müslim' },
  'رفيق الورد': { en:'Wird Companion', fr:'Compagnon du wird', id:'Sahabat Wird', ur:'ورد کا ساتھی', bn:'ওয়ারদ সঙ্গী', tr:'Vird Arkadaşı' },
  'القرآن': { en:'Quran', fr:'Coran', id:'Al-Qur’an', ur:'قرآن', bn:'কুরআন', tr:'Kur’an' },
  'وردك وختمتك': { en:'Your wird and khatma', fr:'Votre wird et khatma', id:'Wird dan khatamamu', ur:'آپ کا ورد اور ختم', bn:'আপনার ওয়ারদ ও খতম', tr:'Virdin ve hatmin' },
  'المواقيت': { en:'Prayer times', fr:'Horaires de prière', id:'Waktu salat', ur:'اوقاتِ نماز', bn:'নামাজের সময়', tr:'Namaz vakitleri' },
  'والقبلة': { en:'and Qibla', fr:'et Qibla', id:'dan kiblat', ur:'اور قبلہ', bn:'ও কিবলা', tr:'ve kıble' },
  'الأطفال': { en:'Kids', fr:'Enfants', id:'Anak', ur:'بچے', bn:'শিশু', tr:'Çocuklar' },
  'حصادي': { en:'My harvest', fr:'Ma récolte', id:'Panenku', ur:'میرا حاصل', bn:'আমার ফসল', tr:'Hasadım' },
  'ملخص العبادات': { en:'Worship summary', fr:'Résumé des adorations', id:'Ringkasan ibadah', ur:'عبادات کا خلاصہ', bn:'ইবাদতের সারসংক্ষেপ', tr:'İbadet özeti' },
  'الميراث': { en:'Inheritance', fr:'Héritage', id:'Warisan', ur:'میراث', bn:'উত্তরাধিকার', tr:'Miras' },
  'الفوائت': { en:'Missed prayers', fr:'Prières manquées', id:'Salat terlewat', ur:'قضا نمازیں', bn:'কাজা নামাজ', tr:'Kaza namazları' },
  'زكاة المال الجديد': { en:'Zakat on new wealth', fr:'Zakat sur les nouveaux biens', id:'Zakat harta baru', ur:'نئی دولت کی زکوٰۃ', bn:'নতুন সম্পদের যাকাত', tr:'Yeni malın zekâtı' },
  '🎬 محاضرات مرئية': { en:'🎬 Video lectures', fr:'🎬 Conférences vidéo', id:'🎬 Ceramah video', ur:'🎬 ویڈیو بیانات', bn:'🎬 ভিডিও বক্তৃতা', tr:'🎬 Video sohbetler' },
  '🎲 فيديوهات أخرى': { en:'🎲 More videos', fr:'🎲 Autres vidéos', id:'🎲 Video lainnya', ur:'🎲 مزید ویڈیوز', bn:'🎲 আরও ভিডিও', tr:'🎲 Diğer videolar' },
  '🎧 سلسلة صوتية': { en:'🎧 Audio series', fr:'🎧 Série audio', id:'🎧 Seri audio', ur:'🎧 آڈیو سلسلہ', bn:'🎧 অডিও সিরিজ', tr:'🎧 Sesli seri' },
  '📻 بث مباشر': { en:'📻 Live stream', fr:'📻 Direct', id:'📻 Siaran langsung', ur:'📻 براہِ راست نشر', bn:'📻 লাইভ স্ট্রিম', tr:'📻 Canlı yayın' },
  '📖 مصحف مُرتَّل': { en:'📖 Recited mushaf', fr:'📖 Moushaf récité', id:'📖 Mushaf murattal', ur:'📖 ترتیل شدہ مصحف', bn:'📖 তিলাওয়াতকৃত মুসহাফ', tr:'📖 Tilavetli mushaf' },
  '🎵 بلاي ليست': { en:'🎵 Playlist', fr:'🎵 Liste de lecture', id:'🎵 Daftar putar', ur:'🎵 پلے لسٹ', bn:'🎵 প্লেলিস্ট', tr:'🎵 Çalma listesi' },
  '🎲 استماع آخر': { en:'🎲 More listening', fr:'🎲 Autres écoutes', id:'🎲 Dengarkan lainnya', ur:'🎲 مزید سماع', bn:'🎲 আরও শুনুন', tr:'🎲 Daha fazla dinle' },
  'مختارات صوتية': { en:'Audio picks', fr:'Sélection audio', id:'Pilihan audio', ur:'منتخب آڈیو', bn:'নির্বাচিত অডিও', tr:'Seçme sesler' },
  'مجموعة مسموعة مختارة': { en:'A curated listening set', fr:'Une sélection à écouter', id:'Kumpulan audio pilihan', ur:'منتخب سماعی مجموعہ', bn:'নির্বাচিত শ্রবণসম্ভার', tr:'Seçme dinleme seti' },
  'العظماء': { en:'The Greats', fr:'Les grands', id:'Para Ulama', ur:'عظیم شخصیات', bn:'মহান ব্যক্তিরা', tr:'Büyükler' },
  'سلسلة قصص العظماء — مصطفى أبو العزم': { en:'Stories of the Greats — Mustafa Abu Al-Azm', fr:'Récits des grands — Mustafa Abu Al-Azm', id:'Kisah Para Ulama — Mustafa Abu Al-Azm', ur:'عظیم شخصیات کی کہانیاں — مصطفیٰ ابو العزم', bn:'মহানদের গল্প — মুস্তাফা আবু আল-আজম', tr:'Büyüklerin Kıssaları — Mustafa Ebu’l-Azm' },
  '+ عدّ': { en:'+ Count', fr:'+ Compter', id:'+ Hitung', ur:'+ گنیں', bn:'+ গণনা', tr:'+ Say' },
  'صار وقت الصلاة': { en:'Prayer time has come', fr:'L’heure de la prière est venue', id:'Waktu salat tiba', ur:'نماز کا وقت آ گیا', bn:'নামাজের সময় হয়েছে', tr:'Namaz vakti geldi' },
  '🔔 الإشعارات': { en:'🔔 Notifications', fr:'🔔 Notifications', id:'🔔 Notifikasi', ur:'🔔 اطلاعات', bn:'🔔 নোটিফিকেশন', tr:'🔔 Bildirimler' },
  'لا توجد إشعارات': { en:'No notifications', fr:'Aucune notification', id:'Tidak ada notifikasi', ur:'کوئی اطلاع نہیں', bn:'কোনো নোটিফিকেশন নেই', tr:'Bildirim yok' },
  'مسح الكل': { en:'Clear all', fr:'Tout effacer', id:'Hapus semua', ur:'سب صاف کریں', bn:'সব মুছুন', tr:'Tümünü temizle' },
  'تفعيل التنبيهات': { en:'Enable alerts', fr:'Activer les alertes', id:'Aktifkan pengingat', ur:'اطلاعات فعال کریں', bn:'সতর্কতা চালু করুন', tr:'Bildirimleri aç' },
  'ابدأ يومك': { en:'Start your day', fr:'Commencez votre journée', id:'Mulai harimu', ur:'اپنا دن شروع کریں', bn:'আপনার দিন শুরু করুন', tr:'Gününe başla' },
  'تحديد الموقع لعرض المواقيت': { en:'Set your location for prayer times', fr:'Définissez votre position pour les horaires', id:'Tetapkan lokasi untuk waktu salat', ur:'مواقیت کے لیے اپنا مقام مقرر کریں', bn:'নামাজের সময়ের জন্য অবস্থান নির্ধারণ করুন', tr:'Namaz vakitleri için konumunu belirle' },
  'اختر طريقة تحديد موقعك لعرض مواقيت الصلاة الدقيقة لمدينتك': { en:'Choose how to set your location to see accurate prayer times for your city', fr:'Choisissez comment définir votre position pour des horaires précis dans votre ville', id:'Pilih cara menetapkan lokasi untuk waktu salat akurat di kotamu', ur:'اپنے شہر کے درست اوقاتِ نماز کے لیے مقام مقرر کرنے کا طریقہ چنیں', bn:'আপনার শহরের সঠিক নামাজের সময় দেখতে অবস্থান নির্ধারণের পদ্ধতি বাছুন', tr:'Şehrin için doğru namaz vakitlerini görmek üzere konum belirleme yöntemini seç' },
  'تحديد تلقائي (GPS)': { en:'Automatic (GPS)', fr:'Automatique (GPS)', id:'Otomatis (GPS)', ur:'خودکار (GPS)', bn:'স্বয়ংক্রিয় (GPS)', tr:'Otomatik (GPS)' },
  'الأدق — يحتاج إذن الموقع': { en:'Most accurate — needs location permission', fr:'Le plus précis — nécessite l’autorisation de localisation', id:'Paling akurat — perlu izin lokasi', ur:'سب سے درست — مقام کی اجازت درکار', bn:'সবচেয়ে নির্ভুল — অবস্থানের অনুমতি লাগে', tr:'En doğru — konum izni gerekir' },
  'البحث عن مدينة': { en:'Search for a city', fr:'Rechercher une ville', id:'Cari kota', ur:'شہر تلاش کریں', bn:'শহর খুঁজুন', tr:'Şehir ara' },
  'اكتب اسم مدينتك في أي بلد': { en:'Type your city name in any country', fr:'Saisissez le nom de votre ville, dans n’importe quel pays', id:'Ketik nama kotamu di negara mana pun', ur:'کسی بھی ملک میں اپنے شہر کا نام لکھیں', bn:'যেকোনো দেশে আপনার শহরের নাম লিখুন', tr:'Hangi ülkede olursa olsun şehir adını yaz' },
  'اختيار من قائمة المدن': { en:'Pick from the city list', fr:'Choisir dans la liste des villes', id:'Pilih dari daftar kota', ur:'شہروں کی فہرست سے چنیں', bn:'শহরের তালিকা থেকে বাছুন', tr:'Şehir listesinden seç' },
  'أبرز المدن العربية والإسلامية': { en:'Major Arab and Muslim cities', fr:'Principales villes arabes et musulmanes', id:'Kota-kota besar Arab dan Muslim', ur:'نمایاں عرب و اسلامی شہر', bn:'প্রধান আরব ও মুসলিম শহর', tr:'Öne çıkan Arap ve İslam şehirleri' },
  'إدخال إحداثيات يدوياً': { en:'Enter coordinates manually', fr:'Saisir les coordonnées manuellement', id:'Masukkan koordinat manual', ur:'متناسقات دستی طور پر درج کریں', bn:'স্থানাঙ্ক হাতে লিখুন', tr:'Koordinatları elle gir' },
  'خط العرض والطول': { en:'Latitude and longitude', fr:'Latitude et longitude', id:'Lintang dan bujur', ur:'عرض بلد اور طول بلد', bn:'অক্ষাংশ ও দ্রাঘিমাংশ', tr:'Enlem ve boylam' },
  'كل الأذكار': { en:'All adhkar', fr:'Tous les adhkar', id:'Semua zikir', ur:'تمام اذکار', bn:'সব আযকার', tr:'Tüm zikirler' },
  'أذكار بعد الصلاة المفروضة': { en:'Adhkar after the obligatory prayer', fr:'Adhkar après la prière obligatoire', id:'Zikir setelah salat wajib', ur:'فرض نماز کے بعد کے اذکار', bn:'ফরজ নামাজের পরের আযকার', tr:'Farz namazdan sonraki zikirler' },
  'أذكار النوم': { en:'Adhkar before sleep', fr:'Adhkar avant de dormir', id:'Zikir sebelum tidur', ur:'سونے کے اذکار', bn:'ঘুমানোর আযকার', tr:'Uyku zikirleri' },
  'أذكار الاستيقاظ': { en:'Adhkar on waking', fr:'Adhkar au réveil', id:'Zikir saat bangun', ur:'جاگنے کے اذکار', bn:'জাগার আযকার', tr:'Uyanma zikirleri' },
  'أذكار الصلاة': { en:'Adhkar of the prayer', fr:'Adhkar de la prière', id:'Zikir dalam salat', ur:'نماز کے اذکار', bn:'নামাজের আযকার', tr:'Namaz zikirleri' },
  'أذكار الوضوء': { en:'Adhkar of wudu', fr:'Adhkar des ablutions', id:'Zikir wudu', ur:'وضو کے اذکار', bn:'ওজুর আযকার', tr:'Abdest zikirleri' },
  'أذكار المسجد': { en:'Adhkar of the mosque', fr:'Adhkar de la mosquée', id:'Zikir masjid', ur:'مسجد کے اذکار', bn:'মসজিদের আযকার', tr:'Cami zikirleri' },
  'أذكار الطعام': { en:'Adhkar of food', fr:'Adhkar des repas', id:'Zikir makan', ur:'کھانے کے اذکار', bn:'খাবারের আযকার', tr:'Yemek zikirleri' },
  'أذكار المنزل': { en:'Adhkar of the home', fr:'Adhkar de la maison', id:'Zikir rumah', ur:'گھر کے اذکار', bn:'ঘরের আযকার', tr:'Ev zikirleri' },
  'أذكار الخلاء': { en:'Adhkar of the toilet', fr:'Adhkar des toilettes', id:'Zikir toilet', ur:'بیت الخلا کے اذکار', bn:'শৌচাগারের আযকার', tr:'Tuvalet zikirleri' },
  'أذكار السفر': { en:'Adhkar of travel', fr:'Adhkar du voyage', id:'Zikir perjalanan', ur:'سفر کے اذکار', bn:'ভ্রমণের আযকার', tr:'Yolculuk zikirleri' },
  'أذكار متفرقة': { en:'Miscellaneous adhkar', fr:'Adhkar divers', id:'Zikir lainnya', ur:'متفرق اذکار', bn:'বিবিধ আযকার', tr:'Muhtelif zikirler' },
  'تسابيح وأذكار عظيمة': { en:'Tasbih and great adhkar', fr:'Tasbih et adhkar précieux', id:'Tasbih dan zikir agung', ur:'تسبیحات اور عظیم اذکار', bn:'তাসবিহ ও মহান আযকার', tr:'Tesbihler ve büyük zikirler' },
  'أدعية يوم عرفة المباركة': { en:'Duas of the blessed day of Arafah', fr:'Invocations du jour béni d’Arafat', id:'Doa hari Arafah yang penuh berkah', ur:'یومِ عرفہ مبارک کی دعائیں', bn:'বরকতময় আরাফার দিনের দুআ', tr:'Mübarek Arefe günü duaları' },
  'آية الكرسي': { en:'Ayat al-Kursi', fr:'Verset du Trône', id:'Ayat Kursi', ur:'آیۃ الکرسی', bn:'আয়াতুল কুরসি', tr:'Ayetel Kürsi' },
  'سورة الإخلاص': { en:'Surah al-Ikhlas', fr:'Sourate al-Ikhlas', id:'Surah Al-Ikhlas', ur:'سورۃ الاخلاص', bn:'সূরা আল-ইখলাস', tr:'İhlas Suresi' },
  'سورة الفلق': { en:'Surah al-Falaq', fr:'Sourate al-Falaq', id:'Surah Al-Falaq', ur:'سورۃ الفلق', bn:'সূরা আল-ফালাক', tr:'Felak Suresi' },
  'سورة الناس': { en:'Surah an-Nas', fr:'Sourate an-Nas', id:'Surah An-Nas', ur:'سورۃ الناس', bn:'সূরা আন-নাস', tr:'Nas Suresi' },
  'سيد الاستغفار': { en:'The master of seeking forgiveness', fr:'Le maître de la demande de pardon', id:'Penghulu istigfar', ur:'سید الاستغفار', bn:'সাইয়িদুল ইস্তিগফার', tr:'İstiğfarın efendisi' },
  'ألا بذكر الله تطمئن القلوب': { en:'Truly, in the remembrance of Allah hearts find rest', fr:'Certes, c’est par l’évocation d’Allah que les cœurs trouvent la quiétude', id:'Ingatlah, hanya dengan mengingat Allah hati menjadi tenang', ur:'سنو! اللہ کے ذکر ہی سے دلوں کو سکون ملتا ہے', bn:'জেনে রাখো, আল্লাহর স্মরণেই হৃদয় শান্তি পায়', tr:'Bilesin ki kalpler ancak Allah’ı anmakla huzur bulur' },
  'خير الدعاء دعاء يوم عرفة — اضغط للأدعية المنظّمة ←': { en:'The best of dua is the dua of Arafah — tap for the organised duas ←', fr:'La meilleure invocation est celle d’Arafat — appuyez pour les invocations classées ←', id:'Doa terbaik adalah doa hari Arafah — ketuk untuk doa tertata ←', ur:'بہترین دعا یومِ عرفہ کی دعا ہے — منظم دعاؤں کے لیے دبائیں ←', bn:'সেরা দুআ আরাফার দিনের দুআ — সাজানো দুআ দেখতে ট্যাপ করুন ←', tr:'Duaların en hayırlısı Arefe günü duasıdır — düzenli dualar için dokun ←' },
  'قسماً موثّقاً — اضغط أي قسم لعرض أذكاره كاملة': { en:'Sections with sources — tap any section to see its adhkar in full', fr:'Des sections sourcées — appuyez sur une section pour voir ses adhkar en entier', id:'Bagian bersumber — ketuk bagian mana pun untuk melihat zikirnya lengkap', ur:'حوالہ جات کے ساتھ اقسام — کسی بھی قسم پر دبائیں اور اس کے تمام اذکار دیکھیں', bn:'সূত্রসহ বিভাগ — যেকোনো বিভাগে ট্যাপ করে সব আযকার দেখুন', tr:'Kaynaklı bölümler — zikirlerin tamamı için bir bölüme dokun' },
  '⭐ يوم عرفة': { en:'⭐ Day of Arafah', fr:'⭐ Jour d’Arafat', id:'⭐ Hari Arafah', ur:'⭐ یومِ عرفہ', bn:'⭐ আরাফার দিন', tr:'⭐ Arefe günü' },
  '☁️ المزامنة السحابية': { en:'☁️ Cloud sync', fr:'☁️ Synchronisation cloud', id:'☁️ Sinkronisasi cloud', ur:'☁️ کلاؤڈ مطابقت', bn:'☁️ ক্লাউড সিঙ্ক', tr:'☁️ Bulut senkronizasyonu' },
  'المزامنة السحابية': { en:'Cloud sync', fr:'Synchronisation cloud', id:'Sinkronisasi cloud', ur:'کلاؤڈ مطابقت', bn:'ক্লাউড সিঙ্ক', tr:'Bulut senkronizasyonu' },
  'معطّلة — بياناتك على هذا الجهاز فقط': { en:'Off — your data stays on this device only', fr:'Désactivée — vos données restent uniquement sur cet appareil', id:'Nonaktif — data hanya di perangkat ini', ur:'بند — آپ کا ڈیٹا صرف اسی ڈیوائس پر ہے', bn:'বন্ধ — আপনার ডেটা শুধু এই ডিভাইসে', tr:'Kapalı — verileriniz yalnızca bu cihazda' },
  'المزامنة': { en:'Sync', fr:'Synchronisation', id:'Sinkronisasi', ur:'مطابقت', bn:'সিঙ্ক', tr:'Senkronizasyon' },
  'اختيارية تماماً': { en:'Completely optional', fr:'Entièrement facultative', id:'Sepenuhnya opsional', ur:'بالکل اختیاری', bn:'সম্পূর্ণ ঐচ্ছিক', tr:'Tamamen isteğe bağlı' },
  'الخصوصية:': { en:'Privacy:', fr:'Confidentialité :', id:'Privasi:', ur:'رازداری:', bn:'গোপনীয়তা:', tr:'Gizlilik:' },
  'إعداداتك الشخصية وملفك الشخصي يبقيان على جهازك ولا يُرفعان.': { en:'Your settings and profile stay on your device and are never uploaded.', fr:'Vos réglages et votre profil restent sur votre appareil et ne sont jamais envoyés.', id:'Pengaturan dan profilmu tetap di perangkatmu dan tidak diunggah.', ur:'آپ کی ترتیبات اور پروفائل آپ ہی کی ڈیوائس پر رہتے ہیں، اپ لوڈ نہیں ہوتے۔', bn:'আপনার সেটিংস ও প্রোফাইল আপনার ডিভাইসেই থাকে, আপলোড হয় না।', tr:'Ayarların ve profilin cihazında kalır, hiçbir yere yüklenmez.' },
  'ما يُزامَن:': { en:'What syncs:', fr:'Ce qui est synchronisé :', id:'Yang disinkronkan:', ur:'کیا مطابقت پذیر ہوتا ہے:', bn:'যা সিঙ্ক হয়:', tr:'Senkronize olanlar:' },
  'سجل العبادات · التكبير · الختمة · الصيام · الأوسمة · حسابات الزكاة': { en:'Worship log · Takbeer · Khatma · Fasting · Badges · Zakat calculations', fr:'Journal d’adoration · Takbir · Khatma · Jeûne · Badges · Calculs de zakat', id:'Catatan ibadah · Takbir · Khatam · Puasa · Lencana · Hitungan zakat', ur:'عبادات کا ریکارڈ · تکبیر · ختم · روزے · بیجز · زکوٰۃ کے حساب', bn:'ইবাদতের লগ · তাকবির · খতম · রোজা · ব্যাজ · যাকাতের হিসাব', tr:'İbadet kaydı · Tekbir · Hatim · Oruç · Rozetler · Zekât hesapları' },
  'تفعيل المزامنة بين الأجهزة': { en:'Turn on sync across devices', fr:'Activer la synchronisation entre appareils', id:'Aktifkan sinkronisasi antarperangkat', ur:'آلات کے درمیان مطابقت فعال کریں', bn:'ডিভাইসগুলোর মধ্যে সিঙ্ক চালু করুন', tr:'Cihazlar arası senkronizasyonu aç' },
  '👤 الملف الشخصي': { en:'👤 Profile', fr:'👤 Profil', id:'👤 Profil', ur:'👤 پروفائل', bn:'👤 প্রোফাইল', tr:'👤 Profil' },
  'صورة الحساب': { en:'Profile picture', fr:'Photo de profil', id:'Foto profil', ur:'پروفائل تصویر', bn:'প্রোফাইল ছবি', tr:'Profil resmi' },
  'محفوظة على جهازك فقط — لا تُرفع لأيِّ خادم.': { en:'Stored on your device only — never sent to any server.', fr:'Stockée uniquement sur votre appareil — jamais envoyée à un serveur.', id:'Hanya disimpan di perangkatmu — tidak pernah dikirim ke server mana pun.', ur:'صرف آپ کی ڈیوائس پر محفوظ — کسی سرور پر نہیں بھیجی جاتی۔', bn:'শুধু আপনার ডিভাইসে সংরক্ষিত — কোনো সার্ভারে যায় না।', tr:'Yalnızca cihazında saklanır — hiçbir sunucuya gönderilmez.' },
  '📷 اختيار صورة': { en:'📷 Choose a photo', fr:'📷 Choisir une photo', id:'📷 Pilih foto', ur:'📷 تصویر منتخب کریں', bn:'📷 ছবি বাছুন', tr:'📷 Fotoğraf seç' },
  '🎨 المظهر': { en:'🎨 Appearance', fr:'🎨 Apparence', id:'🎨 Tampilan', ur:'🎨 ظاہری شکل', bn:'🎨 চেহারা', tr:'🎨 Görünüm' },
  'المظهر': { en:'Appearance', fr:'Apparence', id:'Tampilan', ur:'ظاہری شکل', bn:'চেহারা', tr:'Görünüm' },
  'اختر وضع العرض': { en:'Choose display mode', fr:'Choisissez le mode d’affichage', id:'Pilih mode tampilan', ur:'ڈسپلے موڈ منتخب کریں', bn:'ডিসপ্লে মোড বাছুন', tr:'Görüntüleme modunu seç' },
  'فاتح': { en:'Light', fr:'Clair', id:'Terang', ur:'روشن', bn:'উজ্জ্বল', tr:'Açık' },
  'داكن': { en:'Dark', fr:'Sombre', id:'Gelap', ur:'تاریک', bn:'অন্ধকার', tr:'Koyu' },
  'OLED — أسود كامل لتوفير البطارية': { en:'OLED — pure black to save battery', fr:'OLED — noir absolu pour économiser la batterie', id:'OLED — hitam murni untuk menghemat baterai', ur:'OLED — بیٹری بچانے کے لیے مکمل سیاہ', bn:'OLED — ব্যাটারি বাঁচাতে সম্পূর্ণ কালো', tr:'OLED — pil tasarrufu için tam siyah' },
  'حجم الخط — تلقائي': { en:'Font size — auto', fr:'Taille du texte — auto', id:'Ukuran font — otomatis', ur:'فونٹ سائز — خودکار', bn:'ফন্ট সাইজ — স্বয়ংক্রিয়', tr:'Yazı boyutu — otomatik' },
  'يتبع إعدادات حجم الخط في جهازك تلقائياً': { en:'Follows your device font size automatically', fr:'Suit automatiquement la taille de police de votre appareil', id:'Mengikuti ukuran font perangkatmu secara otomatis', ur:'خودکار طور پر آپ کے ڈیوائس کے فونٹ سائز کی پیروی کرتا ہے', bn:'স্বয়ংক্রিয়ভাবে আপনার ডিভাইসের ফন্ট সাইজ অনুসরণ করে', tr:'Cihazının yazı boyutunu otomatik izler' },
  'متوسط': { en:'Medium', fr:'Moyen', id:'Sedang', ur:'درمیانہ', bn:'মাঝারি', tr:'Orta' },
  'لتغيير الحجم: إعدادات الجهاز ← إمكانية الوصول ← حجم الخط': { en:'To change it: device Settings ← Accessibility ← Font size', fr:'Pour le changer : Réglages ← Accessibilité ← Taille du texte', id:'Untuk mengubahnya: Pengaturan perangkat ← Aksesibilitas ← Ukuran font', ur:'تبدیل کے لیے: ڈیوائس کی ترتیبات ← رسائی ← فونٹ سائز', bn:'বদলাতে: ডিভাইস সেটিংস ← অ্যাক্সেসিবিলিটি ← ফন্ট সাইজ', tr:'Değiştirmek için: Cihaz ayarları ← Erişilebilirlik ← Yazı boyutu' },
  '🔔 الإشعارات والتذكيرات': { en:'🔔 Notifications and reminders', fr:'🔔 Notifications et rappels', id:'🔔 Notifikasi dan pengingat', ur:'🔔 اطلاعات اور یاد دہانیاں', bn:'🔔 নোটিফিকেশন ও রিমাইন্ডার', tr:'🔔 Bildirimler ve hatırlatmalar' },
  'تفعيل الإشعارات': { en:'Enable notifications', fr:'Activer les notifications', id:'Aktifkan notifikasi', ur:'اطلاعات فعال کریں', bn:'নোটিফিকেশন চালু করুন', tr:'Bildirimleri aç' },
  'لتلقي التذكيرات': { en:'to receive reminders', fr:'pour recevoir les rappels', id:'untuk menerima pengingat', ur:'یاد دہانیاں حاصل کرنے کے لیے', bn:'রিমাইন্ডার পেতে', tr:'hatırlatmaları almak için' },
  '📿 ورد الصباح': { en:'📿 Morning wird', fr:'📿 Wird du matin', id:'📿 Wird pagi', ur:'📿 صبح کا ورد', bn:'📿 সকালের ওয়ারদ', tr:'📿 Sabah virdi' },
  '5:30 صباحاً': { en:'5:30 am', fr:'5 h 30', id:'05.30 pagi', ur:'صبح 5:30', bn:'সকাল ৫:৩০', tr:'05.30' },
  '🌙 ورد المساء': { en:'🌙 Evening wird', fr:'🌙 Wird du soir', id:'🌙 Wird petang', ur:'🌙 شام کا ورد', bn:'🌙 সন্ধ্যার ওয়ারদ', tr:'🌙 Akşam virdi' },
  '5:00 مساءً': { en:'5:00 pm', fr:'17 h 00', id:'17.00', ur:'شام 5:00', bn:'বিকাল ৫:০০', tr:'17.00' },
  '☀️ أذكار الصباح': { en:'☀️ Morning adhkar', fr:'☀️ Adhkar du matin', id:'☀️ Zikir pagi', ur:'☀️ صبح کے اذکار', bn:'☀️ সকালের আযকার', tr:'☀️ Sabah zikirleri' },
  'بعد الفجر': { en:'After Fajr', fr:'Après Fajr', id:'Setelah Subuh', ur:'فجر کے بعد', bn:'ফজরের পরে', tr:'Sabah namazından sonra' },
  '🌆 أذكار المساء': { en:'🌆 Evening adhkar', fr:'🌆 Adhkar du soir', id:'🌆 Zikir petang', ur:'🌆 شام کے اذکار', bn:'🌆 সন্ধ্যার আযকার', tr:'🌆 Akşam zikirleri' },
  'بعد العصر': { en:'After Asr', fr:'Après Asr', id:'Setelah Asar', ur:'عصر کے بعد', bn:'আসরের পরে', tr:'İkindi sonrası' },
  '9 ذو الحجة · ١٥ مايو ٢٠٢٧': { en:'9 Dhu al-Hijjah · 15 May 2027', fr:'9 Dhou al-hijja · 15 mai 2027', id:'9 Zulhijah · 15 Mei 2027', ur:'9 ذو الحجہ · 15 مئی 2027', bn:'৯ জিলহজ · ১৫ মে ২০২৭', tr:'9 Zilhicce · 15 Mayıs 2027' },
  '🎬 فيديو أسبوعي': { en:'🎬 Weekly video', fr:'🎬 Vidéo hebdomadaire', id:'🎬 Video mingguan', ur:'🎬 ہفتہ وار ویڈیو', bn:'🎬 সাপ্তাহিক ভিডিও', tr:'🎬 Haftalık video' },
  'كل جمعة مساءً': { en:'Every Friday evening', fr:'Chaque vendredi soir', id:'Setiap Jumat malam', ur:'ہر جمعہ شام', bn:'প্রতি শুক্রবার সন্ধ্যায়', tr:'Her Cuma akşamı' },
  'تنبيه الأذان': { en:'Adhan alert', fr:'Alerte adhan', id:'Pengingat azan', ur:'اذان کی اطلاع', bn:'আজানের সতর্কতা', tr:'Ezan uyarısı' },
  'إشعار عند دخول وقت كل صلاة في القاهرة — يُحسب على الجهاز بلا إنترنت': { en:'Alert when each prayer time begins in Cairo — computed on-device, no internet', fr:'Alerte à l’entrée de chaque prière au Caire — calculée sur l’appareil, sans internet', id:'Pengingat saat waktu salat tiba di Kairo — dihitung di perangkat, tanpa internet', ur:'قاہرہ میں ہر نماز کے وقت پر اطلاع — ڈیوائس پر حساب، انٹرنیٹ کے بغیر', bn:'কায়রোতে প্রতিটি নামাজের সময় শুরু হলে সতর্কতা — ডিভাইসেই হিসাব, ইন্টারনেট ছাড়া', tr:'Kahire’de her namaz vakti girdiğinde uyarı — cihazda hesaplanır, internet gerekmez' },
  '📲 التطبيق': { en:'📲 App', fr:'📲 L’application', id:'📲 Aplikasi', ur:'📲 ایپ', bn:'📲 অ্যাপ', tr:'📲 Uygulama' },
  'تثبيت التطبيق': { en:'Install the app', fr:'Installer l’application', id:'Pasang aplikasi', ur:'ایپ انسٹال کریں', bn:'অ্যাপ ইনস্টল করুন', tr:'Uygulamayı yükle' },
  'يعمل بدون إنترنت': { en:'Works offline', fr:'Fonctionne hors ligne', id:'Bekerja tanpa internet', ur:'انٹرنیٹ کے بغیر چلتی ہے', bn:'ইন্টারনেট ছাড়াই চলে', tr:'İnternetsiz çalışır' },
  'مشاركة التطبيق': { en:'Share the app', fr:'Partager l’application', id:'Bagikan aplikasi', ur:'ایپ شیئر کریں', bn:'অ্যাপ শেয়ার করুন', tr:'Uygulamayı paylaş' },
  'شارك مع أهلك': { en:'Share with your family', fr:'Partagez avec vos proches', id:'Bagikan ke keluargamu', ur:'اپنے گھر والوں سے شیئر کریں', bn:'পরিবারের সঙ্গে শেয়ার করুন', tr:'Ailenle paylaş' },
  'تحميل التطبيق': { en:'Download the app', fr:'Télécharger l’application', id:'Unduh aplikasi', ur:'ایپ ڈاؤن لوڈ کریں', bn:'অ্যাপ ডাউনলোড করুন', tr:'Uygulamayı indir' },
  'دليل التثبيت': { en:'Install guide', fr:'Guide d’installation', id:'Panduan pemasangan', ur:'انسٹال گائیڈ', bn:'ইনস্টল গাইড', tr:'Kurulum rehberi' },
  '🕐 نظام الساعة': { en:'🕐 Clock format', fr:'🕐 Format de l’heure', id:'🕐 Format jam', ur:'🕐 گھڑی کا نظام', bn:'🕐 ঘড়ির ফরম্যাট', tr:'🕐 Saat biçimi' },
  'يؤثر على مواقيت الصلاة في كل الصفحات': { en:'Affects prayer times on every page', fr:'Affecte les horaires de prière sur toutes les pages', id:'Memengaruhi waktu salat di semua halaman', ur:'ہر صفحے پر اوقاتِ نماز پر اثر ڈالتا ہے', bn:'সব পৃষ্ঠায় নামাজের সময়ে প্রভাব ফেলে', tr:'Tüm sayfalarda namaz vakitlerini etkiler' },
  '24 ساعة': { en:'24-hour', fr:'24 heures', id:'24 jam', ur:'24 گھنٹے', bn:'২৪ ঘণ্টা', tr:'24 saat' },
  'النظام الدولي': { en:'International', fr:'International', id:'Internasional', ur:'بین الاقوامی', bn:'আন্তর্জাতিক', tr:'Uluslararası' },
  '4:35 م': { en:'4:35 pm', fr:'16 h 35', id:'16.35', ur:'4:35 شام', bn:'বিকাল ৪:৩৫', tr:'16.35' },
  '12 ساعة': { en:'12-hour', fr:'12 heures', id:'12 jam', ur:'12 گھنٹے', bn:'১২ ঘণ্টা', tr:'12 saat' },
  'ص / م': { en:'am / pm', fr:'am / pm', id:'am / pm', ur:'صبح / شام', bn:'পূর্বাহ্ণ / অপরাহ্ণ', tr:'ÖÖ / ÖS' },
  '🌐 اللغة': { en:'🌐 Language', fr:'🌐 Langue', id:'🌐 Bahasa', ur:'🌐 زبان', bn:'🌐 ভাষা', tr:'🌐 Dil' },
  'لغة التطبيق': { en:'App language', fr:'Langue de l’application', id:'Bahasa aplikasi', ur:'ایپ کی زبان', bn:'অ্যাপের ভাষা', tr:'Uygulama dili' },
  '♿ الوصول والقراءة': { en:'♿ Access and reading', fr:'♿ Accessibilité et lecture', id:'♿ Akses dan membaca', ur:'♿ رسائی اور مطالعہ', bn:'♿ অ্যাক্সেস ও পাঠ', tr:'♿ Erişim ve okuma' },
  '🔎 واجهة أكبر': { en:'🔎 Larger interface', fr:'🔎 Interface agrandie', id:'🔎 Antarmuka lebih besar', ur:'🔎 بڑا انٹرفیس', bn:'🔎 বড় ইন্টারফেস', tr:'🔎 Daha büyük arayüz' },
  'تكبير النصوص والأزرار والمسافات — مفيد على الشاشات الصغيرة وفي الشمس': { en:'Bigger text, buttons and spacing — handy on small screens and in sunlight', fr:'Textes, boutons et espacements agrandis — pratique sur petit écran et au soleil', id:'Teks, tombol, dan jarak lebih besar — berguna di layar kecil dan saat matahari terang', ur:'بڑا متن، بٹن اور فاصلے — چھوٹی اسکرین اور دھوپ میں مفید', bn:'বড় লেখা, বোতাম ও ফাঁক — ছোট স্ক্রিনে ও রোদে কাজে লাগে', tr:'Daha büyük yazı, düğme ve boşluklar — küçük ekranda ve güneşte işe yarar' },
  '📖 قراءة ميسّرة': { en:'📖 Easy reading', fr:'📖 Lecture facilitée', id:'📖 Bacaan mudah', ur:'📖 آسان مطالعہ', bn:'📖 সহজ পাঠ', tr:'📖 Kolay okuma' },
  'تباعد أوسع بين الأسطر والحروف، وأسطر أقصر — مساعدة لعسر القراءة': { en:'Wider line and letter spacing, shorter lines — a help for dyslexia', fr:'Interlignes et espacement des lettres plus larges, lignes plus courtes — une aide pour la dyslexie', id:'Jarak baris dan huruf lebih lebar, baris lebih pendek — bantuan untuk disleksia', ur:'سطروں اور حروف میں زیادہ فاصلہ، چھوٹی سطریں — ڈسلیکسیا میں مدد', bn:'লাইন ও অক্ষরের বেশি ফাঁক, ছোট লাইন — ডিসলেক্সিয়ায় সহায়ক', tr:'Daha geniş satır ve harf aralığı, kısa satırlar — disleksi için kolaylık' },
  'نصّ المصحف لا يتغيّر حجمه في «واجهة أكبر» حتى لا تختلّ الصفحة.': { en:'Mushaf text doesn’t grow in “Larger interface”, so the page stays intact.', fr:'Le texte du moushaf ne grossit pas en « interface agrandie », pour ne pas casser la page.', id:'Teks mushaf tidak membesar di “Antarmuka lebih besar”, agar halaman tetap rapi.', ur:'«بڑا انٹرفیس» میں مصحف کا متن نہیں بڑھتا تاکہ صفحہ بگڑے نہیں۔', bn:'“বড় ইন্টারফেস”-এ মুসহাফের লেখা বড় হয় না, যাতে পৃষ্ঠা ঠিক থাকে।', tr:'“Daha büyük arayüz”de mushaf metni büyümez, böylece sayfa bozulmaz.' },
  '💾 البيانات': { en:'💾 Data', fr:'💾 Données', id:'💾 Data', ur:'💾 ڈیٹا', bn:'💾 ডেটা', tr:'💾 Veriler' },
  'تصدير البيانات': { en:'Export data', fr:'Exporter les données', id:'Ekspor data', ur:'ڈیٹا برآمد کریں', bn:'ডেটা এক্সপোর্ট করুন', tr:'Verileri dışa aktar' },
  'حفظ نسخة احتياطية JSON': { en:'Save a JSON backup', fr:'Enregistrer une sauvegarde JSON', id:'Simpan cadangan JSON', ur:'JSON بیک اپ محفوظ کریں', bn:'JSON ব্যাকআপ সংরক্ষণ করুন', tr:'JSON yedeği al' },
  '📤 تصدير': { en:'📤 Export', fr:'📤 Exporter', id:'📤 Ekspor', ur:'📤 برآمد', bn:'📤 এক্সপোর্ট', tr:'📤 Dışa aktar' },
  'استيراد نسخة احتياطية': { en:'Import a backup', fr:'Importer une sauvegarde', id:'Impor cadangan', ur:'بیک اپ درآمد کریں', bn:'ব্যাকআপ ইমপোর্ট করুন', tr:'Yedek içe aktar' },
  'استعادة بياناتك من ملف JSON': { en:'Restore your data from a JSON file', fr:'Restaurer vos données depuis un fichier JSON', id:'Pulihkan datamu dari berkas JSON', ur:'JSON فائل سے اپنا ڈیٹا بحال کریں', bn:'JSON ফাইল থেকে ডেটা ফিরিয়ে আনুন', tr:'Verilerini bir JSON dosyasından geri yükle' },
  '📥 استيراد': { en:'📥 Import', fr:'📥 Importer', id:'📥 Impor', ur:'📥 درآمد', bn:'📥 ইমপোর্ট', tr:'📥 İçe aktar' },
  'مسح البيانات': { en:'Clear data', fr:'Effacer les données', id:'Hapus data', ur:'ڈیٹا صاف کریں', bn:'ডেটা মুছুন', tr:'Verileri temizle' },
  'يمسح كل التقدم': { en:'erases all progress', fr:'efface toute la progression', id:'menghapus semua kemajuan', ur:'تمام پیش رفت مٹا دیتا ہے', bn:'সব অগ্রগতি মুছে যায়', tr:'tüm ilerlemeyi siler' },
  '🎛️ تخصيص العبادة والمظهر': { en:'🎛️ Worship and look', fr:'🎛️ Adoration et apparence', id:'🎛️ Ibadah dan tampilan', ur:'🎛️ عبادت اور ظاہری شکل', bn:'🎛️ ইবাদত ও রূপ', tr:'🎛️ İbadet ve görünüm' },
  '📖 تجربة القرآن': { en:'📖 Quran experience', fr:'📖 Expérience du Coran', id:'📖 Pengalaman Al-Qur’an', ur:'📖 قرآن کا تجربہ', bn:'📖 কুরআনের অভিজ্ঞতা', tr:'📖 Kur’an deneyimi' },
  'هدف الورد اليومي': { en:'Daily wird goal', fr:'Objectif du wird quotidien', id:'Target wird harian', ur:'روزانہ ورد کا ہدف', bn:'দৈনিক ওয়ারদ লক্ষ্য', tr:'Günlük vird hedefi' },
  'ختمة/10 أيام (60)': { en:'Khatma in 10 days (60)', fr:'Khatma en 10 jours (60)', id:'Khatam 10 hari (60)', ur:'ختم 10 دن میں (60)', bn:'১০ দিনে খতম (৬০)', tr:'10 günde hatim (60)' },
  'ختمة/30 (30)': { en:'Khatma in 30 days (30)', fr:'Khatma en 30 jours (30)', id:'Khatam 30 hari (30)', ur:'ختم 30 دن میں (30)', bn:'৩০ দিনে খতম (৩০)', tr:'30 günde hatim (30)' },
  'ختمة/60 (10)': { en:'Khatma in 60 days (10)', fr:'Khatma en 60 jours (10)', id:'Khatam 60 hari (10)', ur:'ختم 60 دن میں (10)', bn:'৬০ দিনে খতম (১০)', tr:'60 günde hatim (10)' },
  'معجم الجذور (Word-by-Word)': { en:'Root lexicon (word by word)', fr:'Lexique des racines (mot à mot)', id:'Leksikon akar kata (kata demi kata)', ur:'جذروں کا معجم (لفظ بلفظ)', bn:'মূল শব্দকোষ (শব্দে শব্দে)', tr:'Kök sözlüğü (kelime kelime)' },
  'الضغط المطوّل على كلمةٍ يفتح بطاقة جذرها': { en:'Long-press a word to open its root card', fr:'Un appui long sur un mot ouvre sa fiche de racine', id:'Tekan lama sebuah kata untuk membuka kartu akarnya', ur:'کسی لفظ کو دیر تک دبائیں تو اس کے جذر کا کارڈ کھلتا ہے', bn:'কোনো শব্দে দীর্ঘ চাপ দিলে তার মূল কার্ড খোলে', tr:'Bir kelimeye uzun basmak kök kartını açar' },
  'وضع الحفظ': { en:'Memorisation mode', fr:'Mode mémorisation', id:'Mode hafalan', ur:'حفظ کا موڈ', bn:'মুখস্থ মোড', tr:'Ezber modu' },
  'إخفاء الآيات وكشفُها للمراجعة الذاتية': { en:'Hide verses, then reveal them for self-review', fr:'Masquer les versets puis les révéler pour s’auto-évaluer', id:'Sembunyikan ayat lalu buka untuk menguji diri', ur:'آیات چھپائیں اور خود جانچنے کے لیے کھولیں', bn:'আয়াত লুকিয়ে নিজে যাচাইয়ের জন্য খুলুন', tr:'Ayetleri gizle, kendini sınamak için aç' },
  '🤚 الحواس والصوت': { en:'🤚 Senses and sound', fr:'🤚 Sens et son', id:'🤚 Indra dan suara', ur:'🤚 حواس اور آواز', bn:'🤚 ইন্দ্রিয় ও শব্দ', tr:'🤚 Duyular ve ses' },
  'شدة الاهتزاز': { en:'Vibration strength', fr:'Intensité des vibrations', id:'Kekuatan getar', ur:'کمپن کی شدت', bn:'কম্পনের তীব্রতা', tr:'Titreşim gücü' },
  'إيقاف': { en:'Off', fr:'Désactivé', id:'Mati', ur:'بند', bn:'বন্ধ', tr:'Kapalı' },
  'خفيف': { en:'Light', fr:'Léger', id:'Ringan', ur:'ہلکا', bn:'হালকা', tr:'Hafif' },
  'قوي': { en:'Strong', fr:'Fort', id:'Kuat', ur:'مضبوط', bn:'জোরালো', tr:'Güçlü' },
  'صوت التكبير': { en:'Takbeer sound', fr:'Son du takbir', id:'Suara takbir', ur:'تکبیر کی آواز', bn:'তাকবিরের শব্দ', tr:'Tekbir sesi' },
  'نغمةٌ قصيرةٌ مع كل دورة تكبير': { en:'A short tone on every takbeer round', fr:'Une courte note à chaque cycle de takbir', id:'Nada pendek tiap putaran takbir', ur:'ہر تکبیر دورانیے پر مختصر سُر', bn:'প্রতিটি তাকবির চক্রে ছোট সুর', tr:'Her tekbir turunda kısa bir ton' },
  'لون السمة': { en:'Accent colour', fr:'Couleur d’accent', id:'Warna aksen', ur:'تھیم کا رنگ', bn:'অ্যাকসেন্ট রং', tr:'Vurgu rengi' },
  'تأثير الزجاج (Glassmorphism)': { en:'Glass effect (glassmorphism)', fr:'Effet verre (glassmorphism)', id:'Efek kaca (glassmorphism)', ur:'شیشے کا اثر (Glassmorphism)', bn:'গ্লাস ইফেক্ট (গ্লাসমরফিজম)', tr:'Cam efekti (glassmorphism)' },
  'عمقٌ بصريٌّ خفيف خلف البطاقات': { en:'A subtle visual depth behind cards', fr:'Une légère profondeur visuelle derrière les cartes', id:'Kedalaman visual halus di balik kartu', ur:'کارڈز کے پیچھے ہلکی بصری گہرائی', bn:'কার্ডের পেছনে হালকা ভিজ্যুয়াল গভীরতা', tr:'Kartların arkasında hafif görsel derinlik' },
  'زاد · الإصدار 2.0 · 1447هـ': { en:'Zad · v2.0 · 1447 AH', fr:'Zad · v2.0 · 1447 H', id:'Zad · v2.0 · 1447 H', ur:'زاد · ورژن 2.0 · 1447ھ', bn:'জাদ · সংস্করণ ২.০ · ১৪৪৭ হিজরি', tr:'Zad · sürüm 2.0 · 1447 H' },
  'عن التطبيق والمطور': { en:'About the app and the developer', fr:'À propos de l’application et du développeur', id:'Tentang aplikasi dan pengembang', ur:'ایپ اور ڈویلپر کے بارے میں', bn:'অ্যাপ ও ডেভেলপার সম্পর্কে', tr:'Uygulama ve geliştirici hakkında' },
  'مسح': { en:'Clear', fr:'Effacer', id:'Hapus', ur:'صاف کریں', bn:'মুছুন', tr:'Temizle' },
  'من الفجر إلى طلوع الشمس': { en:'from Fajr until sunrise', fr:'de Fajr au lever du soleil', id:'dari Subuh hingga terbit matahari', ur:'فجر سے طلوعِ آفتاب تک', bn:'ফজর থেকে সূর্যোদয় পর্যন্ত', tr:'Sabah namazından güneş doğana dek' },
  'من العصر إلى المغرب': { en:'from Asr to Maghrib', fr:'de Asr à Maghrib', id:'dari Asar sampai Magrib', ur:'عصر سے مغرب تک', bn:'আসর থেকে মাগরিব পর্যন্ত', tr:'İkindiden akşama dek' },
  'عقب كل صلاة مكتوبة': { en:'after every obligatory prayer', fr:'après chaque prière obligatoire', id:'setelah setiap salat wajib', ur:'ہر فرض نماز کے بعد', bn:'প্রতিটি ফরজ নামাজের পরে', tr:'her farz namazdan sonra' },
  'يُستحب الإكثار منها': { en:'recommended to say often', fr:'recommandés à répéter souvent', id:'dianjurkan diperbanyak', ur:'کثرت سے پڑھنا مستحب ہے', bn:'বেশি বেশি পড়া মুস্তাহাব', tr:'çokça okunması müstehap' },
  'عند الإيواء إلى الفراش': { en:'when going to bed', fr:'au moment de se coucher', id:'saat akan tidur', ur:'بستر پر جانے کے وقت', bn:'বিছানায় যাওয়ার সময়', tr:'yatağa girerken' },
  'عند الاستيقاظ من النوم': { en:'on waking from sleep', fr:'au réveil', id:'saat bangun tidur', ur:'نیند سے بیدار ہونے پر', bn:'ঘুম থেকে জাগলে', tr:'uykudan uyanınca' },
  'في أثناء الصلاة': { en:'during the prayer', fr:'pendant la prière', id:'saat salat', ur:'نماز کے دوران', bn:'নামাজের মধ্যে', tr:'namaz esnasında' },
  'قبل الطعام وبعده': { en:'before and after eating', fr:'avant et après le repas', id:'sebelum dan sesudah makan', ur:'کھانے سے پہلے اور بعد', bn:'খাওয়ার আগে ও পরে', tr:'yemekten önce ve sonra' },
  'قبل الوضوء وبعده': { en:'before and after wudu', fr:'avant et après les ablutions', id:'sebelum dan sesudah wudu', ur:'وضو سے پہلے اور بعد', bn:'ওজুর আগে ও পরে', tr:'abdestten önce ve sonra' },
  'دخول الخلاء والخروج': { en:'entering and leaving the toilet', fr:'entrer et sortir des toilettes', id:'masuk dan keluar toilet', ur:'بیت الخلا میں داخلہ و خروج', bn:'শৌচাগারে প্রবেশ ও প্রস্থান', tr:'tuvalete girerken ve çıkarken' },
  'دخول المسجد والخروج منه': { en:'entering and leaving the mosque', fr:'entrer et sortir de la mosquée', id:'masuk dan keluar masjid', ur:'مسجد میں داخلہ و خروج', bn:'মসজিদে প্রবেশ ও প্রস্থান', tr:'camiye girerken ve çıkarken' },
  'الخروج والدخول': { en:'leaving and entering', fr:'sortir et entrer', id:'keluar dan masuk', ur:'خروج و دخول', bn:'প্রস্থান ও প্রবেশ', tr:'çıkarken ve girerken' },
  'الركوب والسفر': { en:'riding and travelling', fr:'monter et voyager', id:'naik kendaraan dan bepergian', ur:'سواری اور سفر', bn:'যানে ওঠা ও ভ্রমণ', tr:'binek ve yolculuk' },
  'مواقف متنوعة': { en:'various situations', fr:'situations diverses', id:'berbagai situasi', ur:'متنوع مواقع', bn:'বিভিন্ন পরিস্থিতি', tr:'çeşitli durumlar' },
  'زاد — يومك مع العبادة والذكر': { en:'Zad — your day with worship and remembrance', fr:'Zad — votre journée avec l’adoration et l’évocation', id:'Zad — harimu bersama ibadah dan zikir', ur:'زاد — عبادت اور ذکر کے ساتھ آپ کا دن', bn:'জাদ — ইবাদত ও যিকিরে আপনার দিন', tr:'Zad — ibadet ve zikirle günün' },
  '🌙 آية المساء': { en:'🌙 Evening verse', fr:'🌙 Verset du soir', id:'🌙 Ayat petang', ur:'🌙 شام کی آیت', bn:'🌙 সন্ধ্যার আয়াত', tr:'🌙 Akşam ayeti' },
  'مصاحف مرتّلة · إذاعات قرآنية · سلاسل صوتية —': { en:'Recited mushafs · Quran radio · audio series —', fr:'Moushafs récités · radios coraniques · séries audio —', id:'Mushaf murattal · radio Qur’an · seri audio —', ur:'ترتیل مصاحف · قرآنی ریڈیو · آڈیو سلسلے —', bn:'তিলাওয়াতকৃত মুসহাফ · কুরআন রেডিও · অডিও সিরিজ —', tr:'Tilavetli mushaflar · Kur’an radyosu · sesli seriler —' },
  'مادة تتبدّل عند كل فتح': { en:'Content that changes on every visit', fr:'Un contenu qui change à chaque visite', id:'Materi yang berganti tiap dibuka', ur:'ہر بار کھلنے پر بدلنے والا مواد', bn:'প্রতিবার খুললে বদলে যাওয়া কনটেন্ট', tr:'Her açılışta değişen içerik' },
  '📖 المكتبة النصية': { en:'📖 Text library', fr:'📖 Bibliothèque de textes', id:'📖 Perpustakaan teks', ur:'📖 متنی کتب خانہ', bn:'📖 পাঠগ্রন্থাগার', tr:'📖 Metin kütüphanesi' },
  '🎲 أبواب أخرى': { en:'🎲 More sections', fr:'🎲 Autres rubriques', id:'🎲 Bagian lain', ur:'🎲 دیگر ابواب', bn:'🎲 আরও বিভাগ', tr:'🎲 Diğer bölümler' },
  'مباحث عامة في السنة': { en:'General topics in the Sunnah', fr:'Thèmes généraux de la Sunna', id:'Topik umum dalam Sunnah', ur:'سنت کے عمومی مباحث', bn:'সুন্নাহর সাধারণ বিষয়', tr:'Sünnette genel konular' },
  'الحديث وعلومه': { en:'Hadith and its sciences', fr:'Le hadith et ses sciences', id:'Hadis dan ilmunya', ur:'حدیث اور اس کے علوم', bn:'হাদিস ও তার বিজ্ঞান', tr:'Hadis ve ilimleri' },
  'آل البيت': { en:'The Prophet’s family', fr:'La famille du Prophète', id:'Keluarga Nabi', ur:'اہلِ بیت', bn:'আহলে বাইত', tr:'Ehl-i Beyt' },
  'العقيدة': { en:'Creed', fr:'Croyance', id:'Akidah', ur:'عقیدہ', bn:'আকিদা', tr:'Akaid' },
  'الأمر بالمعروف والنهي عن المنكر': { en:'Enjoining good and forbidding wrong', fr:'Ordonner le bien et interdire le mal', id:'Menyuruh kebaikan dan mencegah kemungkaran', ur:'امر بالمعروف و نہی عن المنکر', bn:'সৎকর্মের আদেশ ও অসৎকর্মে নিষেধ', tr:'İyiliği emretmek, kötülüğü yasaklamak' },
  'الدعوة والحسبة': { en:'Dawah and hisbah', fr:'Prédication et hisba', id:'Dakwah dan hisbah', ur:'دعوت اور حسبہ', bn:'দাওয়াহ ও হিসবা', tr:'Davet ve hisbe' },
  'فقه الأسرة': { en:'Family fiqh', fr:'Fiqh de la famille', id:'Fikih keluarga', ur:'فقہِ خاندان', bn:'পরিবার বিষয়ক ফিকহ', tr:'Aile fıkhı' },
  'الفقه وأصوله': { en:'Fiqh and its principles', fr:'Fiqh et ses fondements', id:'Fikih dan usulnya', ur:'فقہ اور اصولِ فقہ', bn:'ফিকহ ও উসুল', tr:'Fıkıh ve usulü' },
  'السيرة النبوية': { en:'Prophetic biography', fr:'Biographie du Prophète', id:'Sirah Nabawiyah', ur:'سیرتِ نبویؐ', bn:'নবীর জীবনী', tr:'Siyer-i Nebi' },
  'السيرة والتاريخ': { en:'Biography and history', fr:'Biographie et histoire', id:'Sirah dan sejarah', ur:'سیرت و تاریخ', bn:'জীবনী ও ইতিহাস', tr:'Siyer ve tarih' },
  'أهل السنة والجماعة': { en:'Ahl al-Sunnah wa al-Jama‘ah', fr:'Gens de la Sunna et du consensus', id:'Ahlussunnah wal Jamaah', ur:'اہلِ سنت و الجماعت', bn:'আহলে সুন্নাহ ওয়াল জামাআত', tr:'Ehl-i Sünnet ve’l-Cemaat' },
  'الطب والتداوي والرقية الشرعية': { en:'Medicine, treatment and ruqyah', fr:'Médecine, soins et roqya', id:'Kedokteran, pengobatan dan rukyah', ur:'طب، علاج اور رقیہ شرعیہ', bn:'চিকিৎসা ও শরিয়তসম্মত রুকইয়াহ', tr:'Tıp, tedavi ve şer‘î rukye' },
  'الآداب الشرعية': { en:'Islamic manners', fr:'Bonnes manières islamiques', id:'Adab Islami', ur:'شرعی آداب', bn:'ইসলামি আদব', tr:'İslami edepler' },
  'الفضائل والآداب': { en:'Virtues and manners', fr:'Vertus et bonnes manières', id:'Keutamaan dan adab', ur:'فضائل و آداب', bn:'ফজিলত ও আদব', tr:'Faziletler ve edepler' },
  'إمام الحرم المكي — تلاوة مرتلة بصوت الشيخ سعود الشريم.': { en:'Imam of the Grand Mosque — measured recitation by Sheikh Saud Al-Shuraim.', fr:'Imam de la Grande Mosquée — récitation posée du cheikh Saoud al-Chouraïm.', id:'Imam Masjidil Haram — tilawah tartil Syaikh Saud Asy-Syuraim.', ur:'امام حرم مکی — شیخ سعود الشريم کی ترتیل تلاوت۔', bn:'মক্কার গ্র্যান্ড মসজিদের ইমাম — শায়খ সাউদ আশ-শুরাইমের তারতিল তিলাওয়াত।', tr:'Mescid-i Haram imamı — Şeyh Suud eş-Şureym’den ağır tilavet.' },
  'تلاوات خاشعة بصوت الشيخ مشاري راشد العفاسي على مدار الساعة.': { en:'Humble recitations by Sheikh Mishary Rashid Alafasy, around the clock.', fr:'Récitations recueillies du cheikh Michari Rachid al-Afassy, en continu.', id:'Tilawah khusyuk Syaikh Misyari Rasyid Alafasy, sepanjang waktu.', ur:'شیخ مشاری راشد العفاسی کی خشوع بھری تلاوتیں، چوبیس گھنٹے۔', bn:'শায়খ মিশারি রাশিদ আলাফাসির বিনীত তিলাওয়াত, দিনরাত।', tr:'Şeyh Mişari Raşid el-Afasi’den gün boyu huşulu tilavetler.' },
  'إمام الحرم المكي الشريف — تلاوات مؤثّرة بصوت الشيخ السديس.': { en:'Imam of the Holy Sanctuary — moving recitations by Sheikh Al-Sudais.', fr:'Imam du Saint Sanctuaire — récitations émouvantes du cheikh al-Soudaïs.', id:'Imam Masjidil Haram — tilawah menyentuh Syaikh As-Sudais.', ur:'امام حرم مکی شریف — شیخ السدیس کی مؤثر تلاوتیں۔', bn:'পবিত্র হারামের ইমাম — শায়খ সুদাইসের হৃদয়স্পর্শী তিলাওয়াত।', tr:'Mescid-i Haram imamı — Şeyh Sudays’tan etkileyici tilavetler.' },
  'المصحف المرتل — محمد صديق المنشاوي': { en:'Recited mushaf — Muhammad Siddiq Al-Minshawi', fr:'Moushaf récité — Mohamed Siddiq al-Minchawi', id:'Mushaf murattal — Muhammad Shiddiq Al-Minsyawi', ur:'ترتیل مصحف — محمد صدیق المنشاوی', bn:'তিলাওয়াতকৃত মুসহাফ — মুহাম্মদ সিদ্দিক আল-মিনশাবি', tr:'Tilavetli mushaf — Muhammed Sıddık el-Minşavi' },
  'القرآن الكريم كاملاً برواية حفص عن عاصم بصوت الشيخ المنشاوي.': { en:'The complete Quran in Hafs ‘an Asim, recited by Sheikh Al-Minshawi.', fr:'Le Coran complet selon Hafs d’après Asim, récité par le cheikh al-Minchawi.', id:'Al-Qur’an lengkap riwayat Hafs dari Ashim, dibacakan Syaikh Al-Minsyawi.', ur:'مکمل قرآن، حفص عن عاصم کی روایت میں، شیخ المنشاوی کی آواز میں۔', bn:'সম্পূর্ণ কুরআন, হাফস আন আসিম রেওয়ায়েতে, শায়খ আল-মিনশাবির কণ্ঠে।', tr:'Tam Kur’an, Hafs an Asım rivayetinde, Şeyh el-Minşavi’nin sesinden.' },
  'إذاعة القرآن الكريم السعودية': { en:'Saudi Quran Radio', fr:'Radio coranique saoudienne', id:'Radio Qur’an Saudi', ur:'سعودی قرآن ریڈیو', bn:'সৌদি কুরআন রেডিও', tr:'Suudi Kur’an Radyosu' },
  'إذاعة القرآن الكريم من القاهرة': { en:'Quran Radio from Cairo', fr:'Radio coranique du Caire', id:'Radio Qur’an Kairo', ur:'قاہرہ سے قرآن ریڈیو', bn:'কায়রো থেকে কুরআন রেডিও', tr:'Kahire Kur’an Radyosu' },
  'سعود الشريم': { en:'Saud Al-Shuraim', fr:'Saoud al-Chouraïm', id:'Saud Asy-Syuraim', ur:'سعود الشريم', bn:'সাউদ আশ-শুরাইম', tr:'Saud eş-Şureym' },
  'مشاري راشد العفاسي': { en:'Mishary Rashid Alafasy', fr:'Michari Rachid al-Afassy', id:'Misyari Rasyid Alafasy', ur:'مشاری راشد العفاسی', bn:'মিশারি রাশিদ আলাফাসি', tr:'Mişari Raşid el-Afasi' },
  'عبد الرحمن السديس': { en:'Abdulrahman Al-Sudais', fr:'Abdoulrahman al-Soudaïs', id:'Abdurrahman As-Sudais', ur:'عبدالرحمٰن السدیس', bn:'আবদুর রহমান সুদাইস', tr:'Abdurrahman es-Sudays' },
  'المبكّر': { en:'Early riser', fr:'Lève-tôt', id:'Si awal', ur:'پہلے اٹھنے والا', bn:'প্রভাত-উত্থিত', tr:'Erken kalkan' },
  'الذاكرون': { en:'Those who remember', fr:'Ceux qui évoquent', id:'Ahli zikir', ur:'ذکر کرنے والے', bn:'যিকিরকারীরা', tr:'Zikredenler' },
  'الصائمون': { en:'Those who fast', fr:'Ceux qui jeûnent', id:'Ahli puasa', ur:'روزہ دار', bn:'রোজাদার', tr:'Oruç tutanlar' },
  'الخاتمون': { en:'Those who complete the Quran', fr:'Ceux qui terminent le Coran', id:'Ahli khatam', ur:'ختم کرنے والے', bn:'খতমকারীরা', tr:'Hatim yapanlar' },
  'المسارعون': { en:'Those who race to good', fr:'Ceux qui rivalisent de bien', id:'Ahli fastabiq', ur:'نیکی میں سبقت کرنے والے', bn:'সৎকর্মে অগ্রগামীরা', tr:'Hayırda yarışanlar' },
  'المكبّرون': { en:'Those who say takbeer', fr:'Ceux qui prononcent le takbir', id:'Ahli takbir', ur:'تکبیر کہنے والے', bn:'তাকবিরকারীরা', tr:'Tekbir getirenler' },
  'المتصدقون': { en:'Those who give charity', fr:'Ceux qui donnent en aumône', id:'Ahli sedekah', ur:'صدقہ دینے والے', bn:'দানকারীরা', tr:'Sadaka verenler' },
  'السابقة': { en:'The forerunners', fr:'Les devanciers', id:'Yang terdepan', ur:'سبقت کرنے والے', bn:'অগ্রগামীরা', tr:'Öncüler' },
  'عرفة': { en:'Arafah', fr:'Arafat', id:'Arafah', ur:'عرفہ', bn:'আরাফাহ', tr:'Arefe' },
  '☀️ فاتح': { en:'☀️ Light', fr:'☀️ Clair', id:'☀️ Terang', ur:'☀️ روشن', bn:'☀️ উজ্জ্বল', tr:'☀️ Açık' },
  '🌙 داكن': { en:'🌙 Dark', fr:'🌙 Sombre', id:'🌙 Gelap', ur:'🌙 تاریک', bn:'🌙 অন্ধকার', tr:'🌙 Koyu' },
  'زاد 2026 · بدون إعلانات 📴': { en:'Zad 2026 · no ads 📴', fr:'Zad 2026 · sans publicité 📴', id:'Zad 2026 · tanpa iklan 📴', ur:'زاد 2026 · اشتہارات کے بغیر 📴', bn:'জাদ ২০২৬ · বিজ্ঞাপনহীন 📴', tr:'Zad 2026 · reklamsız 📴' },
  'قرآن': { en:'Quran', fr:'Coran', id:'Al-Qur’an', ur:'قرآن', bn:'কুরআন', tr:'Kur’an' },
  '🎬 مكتبة المحتوى': { en:'🎬 Content library', fr:'🎬 Bibliothèque de contenus', id:'🎬 Pustaka konten', ur:'🎬 مواد کا کتب خانہ', bn:'🎬 কনটেন্ট লাইব্রেরি', tr:'🎬 İçerik kütüphanesi' },
  'محاضرات ومقاطع مختارة': { en:'Selected lectures and clips', fr:'Conférences et extraits choisis', id:'Ceramah dan klip pilihan', ur:'منتخب بیانات اور کلپس', bn:'নির্বাচিত বক্তৃতা ও ক্লিপ', tr:'Seçme sohbetler ve klipler' },
  'محاضرة': { en:'Lecture', fr:'Conférence', id:'Ceramah', ur:'بیان', bn:'বক্তৃতা', tr:'Sohbet' },
  'علماء ومقدمون': { en:'Scholars and presenters', fr:'Savants et présentateurs', id:'Ulama dan pemateri', ur:'علماء اور مقررین', bn:'আলিম ও উপস্থাপক', tr:'Alimler ve sunucular' },
  'نقطة علمية': { en:'Quick benefit', fr:'Point bénéfique', id:'Poin ilmu', ur:'علمی نکتہ', bn:'জ্ঞানগর্ভ পয়েন্ট', tr:'Kısa fayda' },
  'قائمة المحاضرات': { en:'Lectures list', fr:'Liste des conférences', id:'Daftar ceramah', ur:'بیانات کی فہرست', bn:'বক্তৃতার তালিকা', tr:'Sohbet listesi' },
  'الكل': { en:'All', fr:'Tout', id:'Semua', ur:'سب', bn:'সব', tr:'Tümü' },
  '🕋 عشر ذي الحجة': { en:'🕋 First ten of Dhul-Hijjah', fr:'🕋 Les dix premiers de Dhou al-hijja', id:'🕋 Sepuluh hari Zulhijah', ur:'🕋 ذوالحجہ کے پہلے عشرے', bn:'🕋 জিলহজের প্রথম দশক', tr:'🕋 Zilhicce’nin ilk onu' },
  '💚 التزكية والإيمان': { en:'💚 Purification and faith', fr:'💚 Purification et foi', id:'💚 Tazkiyah dan iman', ur:'💚 تزکیہ اور ایمان', bn:'💚 তাযকিয়া ও ঈমান', tr:'💚 Arınma ve iman' },
  '📜 السيرة النبوية': { en:'📜 Prophetic biography', fr:'📜 Biographie du Prophète', id:'📜 Sirah Nabawiyah', ur:'📜 سیرتِ نبویؐ', bn:'📜 নবীর জীবনী', tr:'📜 Siyer-i Nebi' },
  '🧭 سلسلة الصحابة': { en:'🧭 Companions series', fr:'🧭 Série des Compagnons', id:'🧭 Seri Sahabat', ur:'🧭 صحابہ کا سلسلہ', bn:'🧭 সাহাবিদের সিরিজ', tr:'🧭 Sahabeler serisi' },
  '📖 قصص وعبر': { en:'📖 Stories and lessons', fr:'📖 Récits et leçons', id:'📖 Kisah dan pelajaran', ur:'📖 کہانیاں اور سبق', bn:'📖 গল্প ও শিক্ষা', tr:'📖 Kıssalar ve dersler' },
  '🎙️ بودكاست وحوارات': { en:'🎙️ Podcasts and talks', fr:'🎙️ Podcasts et entretiens', id:'🎙️ Podcast dan dialog', ur:'🎙️ پوڈکاسٹ اور گفتگو', bn:'🎙️ পডকাস্ট ও আলাপ', tr:'🎙️ Podcast ve söyleşiler' },
  '🌙 رمضان': { en:'🌙 Ramadan', fr:'🌙 Ramadan', id:'🌙 Ramadan', ur:'🌙 رمضان', bn:'🌙 রমজান', tr:'🌙 Ramazan' },
  '📅 محرم وعاشوراء': { en:'📅 Muharram and Ashura', fr:'📅 Muharram et Achoura', id:'📅 Muharam dan Asyura', ur:'📅 محرم اور عاشورہ', bn:'📅 মুহাররম ও আশুরা', tr:'📅 Muharrem ve Aşure' },
  '⚖️ الفقه والأحكام': { en:'⚖️ Fiqh and rulings', fr:'⚖️ Fiqh et règles', id:'⚖️ Fikih dan hukum', ur:'⚖️ فقہ اور احکام', bn:'⚖️ ফিকহ ও বিধান', tr:'⚖️ Fıkıh ve hükümler' },
  '🧒 للأطفال': { en:'🧒 For children', fr:'🧒 Pour les enfants', id:'🧒 Untuk anak', ur:'🧒 بچوں کے لیے', bn:'🧒 শিশুদের জন্য', tr:'🧒 Çocuklar için' },
  '⏱️ المدة:': { en:'⏱️ Duration:', fr:'⏱️ Durée :', id:'⏱️ Durasi:', ur:'⏱️ دورانیہ:', bn:'⏱️ সময়কাল:', tr:'⏱️ Süre:' },
  'أقل من 30 دقيقة': { en:'Under 30 minutes', fr:'Moins de 30 minutes', id:'Kurang dari 30 menit', ur:'30 منٹ سے کم', bn:'৩০ মিনিটের কম', tr:'30 dakikadan az' },
  'من 30 إلى 60 دقيقة': { en:'30 to 60 minutes', fr:'De 30 à 60 minutes', id:'30 sampai 60 menit', ur:'30 سے 60 منٹ', bn:'৩০ থেকে ৬০ মিনিট', tr:'30 ila 60 dakika' },
  'من ساعة إلى ساعة ونصف': { en:'1 to 1.5 hours', fr:'De 1 h à 1 h 30', id:'1 sampai 1,5 jam', ur:'1 سے 1.5 گھنٹے', bn:'১ থেকে দেড় ঘণ্টা', tr:'1 ila 1,5 saat' },
  'أكثر من ساعة ونصف': { en:'Over 1.5 hours', fr:'Plus de 1 h 30', id:'Lebih dari 1,5 jam', ur:'1.5 گھنٹے سے زیادہ', bn:'দেড় ঘণ্টার বেশি', tr:'1,5 saatten fazla' },
  '🎤 الشيخ أو المقدم:': { en:'🎤 Scholar or presenter:', fr:'🎤 Savant ou présentateur :', id:'🎤 Ulama atau pemateri:', ur:'🎤 عالم یا مقرر:', bn:'🎤 আলিম বা উপস্থাপক:', tr:'🎤 Alim veya sunucu:' },
  '🎲 خلط': { en:'🎲 Shuffle', fr:'🎲 Mélanger', id:'🎲 Acak', ur:'🎲 خلط ملط', bn:'🎲 এলোমেলো', tr:'🎲 Karıştır' },
  '⭐ مميز': { en:'⭐ Featured', fr:'⭐ En vedette', id:'⭐ Unggulan', ur:'⭐ نمایاں', bn:'⭐ নির্বাচিত', tr:'⭐ Öne çıkan' },
  '🆕 جديد': { en:'🆕 New', fr:'🆕 Nouveau', id:'🆕 Baru', ur:'🆕 نیا', bn:'🆕 নতুন', tr:'🆕 Yeni' },
  '🔥 مهم': { en:'🔥 Important', fr:'🔥 Important', id:'🔥 Penting', ur:'🔥 اہم', bn:'🔥 গুরুত্বপূর্ণ', tr:'🔥 Önemli' },
  'عشر ذي الحجة — التخطيط العملي': { en:'The first ten of Dhul-Hijjah — a practical plan', fr:'Les dix premiers de Dhou al-hijja — un plan pratique', id:'Sepuluh hari Zulhijah — rencana praktis', ur:'ذوالحجہ کے عشرے — عملی منصوبہ', bn:'জিলহজের প্রথম দশক — বাস্তব পরিকল্পনা', tr:'Zilhiccenin ilk onu — pratik plan' },
  'لا تدخل العشر قبل مشاهدة هذا المقطع': { en:'Don’t enter the ten days without watching this', fr:'N’entrez pas dans les dix jours sans voir cette vidéo', id:'Jangan masuki sepuluh hari ini sebelum menonton', ur:'یہ کلپ دیکھے بغیر عشرے میں نہ جائیں', bn:'এই ক্লিপ না দেখে দশকে ঢুকবেন না', tr:'Bu klibi izlemeden on güne girmeyin' },
  'العَشر الأُوَل من ذي الحِجَّة': { en:'The first ten days of Dhul-Hijjah', fr:'Les dix premiers jours de Dhou al-hijja', id:'Sepuluh hari pertama Zulhijah', ur:'ذوالحجہ کے پہلے دس دن', bn:'জিলহজের প্রথম দশ দিন', tr:'Zilhiccenin ilk on günü' },
  'أوائل ذي الحجة | أفضل أيام الدهر': { en:'Start of Dhul-Hijjah | the best days of the year', fr:'Début de Dhou al-hijja | les meilleurs jours de l’année', id:'Awal Zulhijah | hari terbaik sepanjang tahun', ur:'ذوالحجہ کا آغاز | سال کے بہترین دن', bn:'জিলহজের শুরু | বছরের সেরা দিন', tr:'Zilhiccenin başı | yılın en hayırlı günleri' },
  'الغيرة': { en:'jealousy', fr:'la jalousie', id:'kecemburuan', ur:'رشک', bn:'ঈর্ষা', tr:'kıskançlık' },
  'الكذب': { en:'lying', fr:'le mensonge', id:'kebohongan', ur:'جھوٹ', bn:'মিথ্যা', tr:'yalan' },
  'الطلاق': { en:'divorce', fr:'le divorce', id:'perceraian', ur:'طلاق', bn:'তালাক', tr:'boşanma' },
  'الموضة': { en:'fashion', fr:'la mode', id:'mode', ur:'فیشن', bn:'ফ্যাশন', tr:'moda' },
  'التشتت': { en:'distraction', fr:'la dispersion', id:'gangguan fokus', ur:'بکھراؤ', bn:'মনোযোগহীনতা', tr:'dağınık zihin' },
  'التوكل': { en:'tawakkul', fr:'la confiance en Allah', id:'tawakal', ur:'توکل', bn:'তাওয়াক্কুল', tr:'tevekkül' },
  'اتباع الهوى': { en:'following desires', fr:'suivre ses passions', id:'mengikuti hawa nafsu', ur:'خواہشات کی پیروی', bn:'খেয়াল-খুশির অনুসরণ', tr:'hevese uymak' },
  'التفاهة': { en:'triviality', fr:'la futilité', id:'kesia-siaan', ur:'ہلکا پن', bn:'তুচ্ছতা', tr:'boş işler' },
  'الأحداث الجارية': { en:'current events', fr:'l’actualité', id:'peristiwa terkini', ur:'موجودہ واقعات', bn:'চলমান ঘটনা', tr:'güncel olaylar' },
  'الانضباط وضياع الوقت': { en:'discipline and wasting time', fr:'la discipline et la perte de temps', id:'kedisiplinan dan membuang waktu', ur:'نظم و ضبط اور وقت کا ضیاع', bn:'শৃঙ্খলা ও সময় নষ্ট', tr:'disiplin ve zaman kaybı' },
  'حب الظهور': { en:'seeking attention', fr:'la recherche de visibilité', id:'mencari perhatian', ur:'شہرت کی چاہت', bn:'প্রদর্শনেচ্ছা', tr:'gösteriş sevdası' },
  'السوشيال ميديا': { en:'social media', fr:'les réseaux sociaux', id:'media sosial', ur:'سوشل میڈیا', bn:'সোশ্যাল মিডিয়া', tr:'sosyal medya' },
  'الصحاب': { en:'choosing friends', fr:'le choix des amis', id:'memilih teman', ur:'سنگت کا انتخاب', bn:'বন্ধু নির্বাচন', tr:'arkadaş seçimi' },
  'القرآن الكريم وعلومه': { en:'The Quran and its sciences', fr:'Le Coran et ses sciences', id:'Al-Qur’an dan ilmunya', ur:'قرآن مجید اور اس کے علوم', bn:'কুরআন ও তার বিজ্ঞান', tr:'Kur’an ve ilimleri' },
  'نزول القرآن وجمعه': { en:'Revelation and compilation of the Quran', fr:'Révélation et compilation du Coran', id:'Turunnya Al-Qur’an dan pengumpulannya', ur:'قرآن کے نزول اور جمع', bn:'কুরআনের অবতরণ ও সংকলন', tr:'Kur’an’ın nüzulü ve cem‘i' },
  'القراءات والتجويد': { en:'Recitations and tajweed', fr:'Lectures et tajwid', id:'Qira’at dan tajwid', ur:'قراءات اور تجوید', bn:'কারাআত ও তাজবিদ', tr:'Kıraatler ve tecvid' },
  'تفسير القرآن': { en:'Quranic exegesis', fr:'Exégèse du Coran', id:'Tafsir Al-Qur’an', ur:'تفسیرِ قرآن', bn:'কুরআনের তাফসির', tr:'Kur’an tefsiri' },
  'مباحث قرآنية عامة': { en:'General Quranic topics', fr:'Thèmes coraniques généraux', id:'Topik umum Al-Qur’an', ur:'عمومی قرآنی مباحث', bn:'সাধারণ কুরআনিক বিষয়', tr:'Genel Kur’an konuları' },
  'فضائل القرآن': { en:'Virtues of the Quran', fr:'Mérites du Coran', id:'Keutamaan Al-Qur’an', ur:'فضائلِ قرآن', bn:'কুরআনের ফজিলত', tr:'Kur’an’ın faziletleri' },
  'الإيمان بالله عز وجل': { en:'Belief in Allah, Mighty and Majestic', fr:'Foi en Allah, puissant et majestueux', id:'Iman kepada Allah Azza wa Jalla', ur:'اللہ عزوجل پر ایمان', bn:'আল্লাহ তা‘আলার প্রতি ঈমান', tr:'Allah’a (cc) iman' },
  'الإيمان بالملائكة': { en:'Belief in the angels', fr:'Foi aux anges', id:'Iman kepada malaikat', ur:'فرشتوں پر ایمان', bn:'ফেরেশতাদের প্রতি ঈমান', tr:'Meleklere iman' },
  'الإيمان بالكتب': { en:'Belief in the revealed books', fr:'Foi aux livres révélés', id:'Iman kepada kitab-kitab', ur:'نازل شدہ کتابوں پر ایمان', bn:'আসমানি কিতাবসমূহে ঈমান', tr:'Kitaplara iman' },
  'الإيمان بالرسل': { en:'Belief in the messengers', fr:'Foi aux messagers', id:'Iman kepada para rasul', ur:'رسولوں پر ایمان', bn:'রাসূলগণের প্রতি ঈমান', tr:'Peygamberlere iman' },
  'الإيمان باليوم الآخر': { en:'Belief in the Last Day', fr:'Foi au Jour dernier', id:'Iman kepada hari akhir', ur:'آخرت کے دن پر ایمان', bn:'আখিরাতের প্রতি ঈমান', tr:'Ahiret gününe iman' },
  'الإيمان بالقضاء والقدر': { en:'Belief in divine decree', fr:'Foi au décret divin', id:'Iman kepada qada dan qadar', ur:'تقدیر پر ایمان', bn:'তাকদিরে ঈমান', tr:'Kader ve kazaya iman' },
  'الأسماء والأحكام': { en:'Names and rulings', fr:'Noms et jugements', id:'Nama dan hukum', ur:'اسماء و احکام', bn:'নাম ও বিধান', tr:'İsimler ve hükümler' },
  'الصحابة': { en:'The Companions', fr:'Les Compagnons', id:'Para sahabat', ur:'صحابہ کرام', bn:'সাহাবিগণ', tr:'Sahabeler' },
  'الولاء والبراء': { en:'Loyalty and disavowal', fr:'Alliance et désaveu', id:'Loyalitas dan berlepas diri', ur:'الولاء والبراء', bn:'আনুগত্য ও মুক্তির সম্পর্ক', tr:'Velâ ve berâ' },
  'الملل والأديان': { en:'Religions and creeds', fr:'Religions et croyances', id:'Agama dan keyakinan', ur:'ملل و ادیان', bn:'ধর্ম ও মতবাদ', tr:'Dinler ve inançlar' },
  'الفرق والمذاهب': { en:'Sects and schools', fr:'Sectes et écoles', id:'Sekte dan mazhab', ur:'فرقے اور مذاہب', bn:'বিভিন্ন দল ও মাজহাব', tr:'Fırkalar ve mezhepler' },
  'فقه العبادات': { en:'Fiqh of worship', fr:'Fiqh de l’adoration', id:'Fikih ibadah', ur:'فقہِ عبادات', bn:'ইবাদতের ফিকহ', tr:'İbadet fıkhı' },
  'فقه المعاملات': { en:'Fiqh of transactions', fr:'Fiqh des transactions', id:'Fikih muamalah', ur:'فقہِ معاملات', bn:'লেনদেনের ফিকহ', tr:'Muamelat fıkhı' },
  'الفرائض': { en:'Inheritance shares', fr:'Parts successorales', id:'Faraid (warisan)', ur:'فرائض (وراثت)', bn:'ফরায়েজ (উত্তরাধিকার)', tr:'Ferâiz (miras)' },
  'الأطعمة والأشربة': { en:'Food and drink', fr:'Aliments et boissons', id:'Makanan dan minuman', ur:'کھانے پینے کے احکام', bn:'খাদ্য ও পানীয়', tr:'Yiyecek ve içecekler' },
  'الجنايات': { en:'Criminal offences', fr:'Infractions pénales', id:'Jinayah (tindak pidana)', ur:'جنایات', bn:'অপরাধ', tr:'Cinayetler' },
  'الحدود': { en:'Prescribed punishments', fr:'Peines légales', id:'Hudud', ur:'حدود', bn:'হুদুদ', tr:'Hudud' },
  'القضاء': { en:'Judiciary', fr:'Justice', id:'Peradilan', ur:'قضاء (فیصلے)', bn:'বিচারব্যবস্থা', tr:'Kaza (yargı)' },
  'الفضائل': { en:'Virtues', fr:'Mérites', id:'Keutamaan', ur:'فضائل', bn:'ফজিলত', tr:'Faziletler' },
  'فقه الأخلاق': { en:'Fiqh of character', fr:'Fiqh du comportement', id:'Fikih akhlak', ur:'فقہِ اخلاق', bn:'নৈতিকতার ফিকহ', tr:'Ahlak fıkhı' },
  'فقه الأدعية والأذكار': { en:'Fiqh of dua and adhkar', fr:'Fiqh des invocations et adhkar', id:'Fikih doa dan zikir', ur:'دعا و اذکار کی فقہ', bn:'দুআ ও আযকারের ফিকহ', tr:'Dua ve zikir fıkhı' },
  'الرقائق والمواعظ': { en:'Heart-softeners and admonitions', fr:'Attendrissements et exhortations', id:'Pelembut hati dan nasihat', ur:'رقائق و مواعظ', bn:'হৃদয়কোমলকারী নসিহত', tr:'Rikâk ve nasihatler' },
  'الدعوة إلى الله': { en:'Calling to Allah', fr:'Appel à Allah', id:'Dakwah kepada Allah', ur:'اللہ کی طرف دعوت', bn:'আল্লাহর পথে দাওয়াত', tr:'Allah’a davet' },
  'السياسة الشرعية': { en:'Islamic governance', fr:'Gouvernance islamique', id:'Siyasah syar‘iyyah', ur:'سیاستِ شرعیہ', bn:'শরিয়তসম্মত শাসনব্যবস্থা', tr:'Şer‘î siyaset' },
  'الثقافة الإسلامية': { en:'Islamic culture', fr:'Culture islamique', id:'Budaya Islam', ur:'اسلامی ثقافت', bn:'ইসলামি সংস্কৃতি', tr:'İslam kültürü' },
  'التاريخ': { en:'History', fr:'Histoire', id:'Sejarah', ur:'تاریخ', bn:'ইতিহাস', tr:'Tarih' },
  'دنيا': { en:'Worldly life', fr:'La vie d’ici-bas', id:'Kehidupan dunia', ur:'دنیا', bn:'দুনিয়া', tr:'Dünya' },
  '📡 إذاعة': { en:'📡 Radio', fr:'📡 Radio', id:'📡 Radio', ur:'📡 ریڈیو', bn:'📡 রেডিও', tr:'📡 Radyo' },
  '🎙️ مصحف مُجوَّد': { en:'🎙️ Mujawwad mushaf', fr:'🎙️ Moushaf moujawwad', id:'🎙️ Mushaf mujawwad', ur:'🎙️ مجود مصحف', bn:'🎙️ মুজাওয়াদ মুসহাফ', tr:'🎙️ Mücevved mushaf' },
  'إذاعة تفسير القرآن': { en:'Quran tafsir radio', fr:'Radio du tafsir', id:'Radio tafsir Al-Qur’an', ur:'تفسیرِ قرآن ریڈیو', bn:'কুরআন তাফসির রেডিও', tr:'Kur’an tefsiri radyosu' },
  'تفسير وخواطر حول آيات القرآن الكريم على مدار الساعة.': { en:'Tafsir and reflections on the verses of the Quran, around the clock.', fr:'Tafsir et réflexions sur les versets du Coran, en continu.', id:'Tafsir dan renungan atas ayat Al-Qur’an, sepanjang waktu.', ur:'قرآن کریم کی آیات کی تفسیر اور خواطر، چوبیس گھنٹے۔', bn:'কুরআনের আয়াতের তাফসির ও অনুভূতি, দিনরাত।', tr:'Kur’an ayetlerinin tefsiri ve tefekkürü, gün boyu.' },
  'البث المباشر الرسمي لإذاعة القرآن الكريم من جمهورية مصر العربية منذ 1964.': { en:'The official live stream of the Holy Quran Radio of Egypt, on air since 1964.', fr:'Le direct officiel de la Radio du Saint Coran d’Égypte, depuis 1964.', id:'Siaran langsung resmi Radio Al-Qur’an Mesir sejak 1964.', ur:'مصر کی قرآن ریڈیو کی سرکاری براہِ راست نشریات، 1964 سے۔', bn:'মিশরের কুরআন রেডিওর সরকারি লাইভ সম্প্রচার, ১৯৬৪ থেকে।', tr:'Mısır Kur’an Radyosu’nun 1964’ten beri resmî canlı yayını.' },
  'تلاوات خاشعة بصوت الشيخ ناصر القطامي.': { en:'Humble recitations by Sheikh Nasser Al-Qatami.', fr:'Récitations recueillies du cheikh Nasser al-Qatami.', id:'Tilawah khusyuk Syaikh Nasser Al-Qathami.', ur:'شیخ ناصر القطامی کی خشوع بھری تلاوتیں۔', bn:'শায়খ নাসির আল-কাতামির বিনীত তিলাওয়াত।', tr:'Şeyh Nasır el-Katamî’den huşulu tilavetler.' },
  'المصحف المجود — عبد الباسط عبد الصمد': { en:'Mujawwad mushaf — Abdulbasit Abdulsamad', fr:'Moushaf moujawwad — Abdelbasset Abdessamad', id:'Mushaf mujawwad — Abdulbasit Abdussamad', ur:'مجود مصحف — عبدالباسط عبدالصمد', bn:'মুজাওয়াদ মুসহাফ — আবদুল বাসিত আবদুস সামাদ', tr:'Mücevved mushaf — Abdülbasit Abdüssamed' },
  'التلاوة المجودة الكاملة بصوت الشيخ عبد الباسط عبد الصمد.': { en:'The complete mujawwad recitation by Sheikh Abdulbasit Abdulsamad.', fr:'La récitation moujawwad complète du cheikh Abdelbasset Abdessamad.', id:'Tilawah mujawwad lengkap oleh Syaikh Abdulbasit Abdussamad.', ur:'شیخ عبدالباسط عبدالصمد کی مکمل مجود تلاوت۔', bn:'শায়খ আবদুল বাসিত আবদুস সামাদের সম্পূর্ণ মুজাওয়াদ তিলাওয়াত।', tr:'Şeyh Abdülbasit Abdüssamed’den tam mücevved tilavet.' },
  'المصحف المجود — محمود خليل الحصري': { en:'Mujawwad mushaf — Mahmoud Khalil Al-Husary', fr:'Moushaf moujawwad — Mahmoud Khalil al-Housari', id:'Mushaf mujawwad — Mahmoud Khalil Al-Hushari', ur:'مجود مصحف — محمود خلیل الحصری', bn:'মুজাওয়াদ মুসহাফ — মাহমুদ খলিল আল-হুসারি', tr:'Mücevved mushaf — Mahmud Halil el-Husarî' },
  'التلاوة المجودة المتقنة بصوت الشيخ محمود خليل الحصري.': { en:'The masterful mujawwad recitation by Sheikh Mahmoud Khalil Al-Husary.', fr:'La récitation moujawwad maîtrisée du cheikh Mahmoud Khalil al-Housari.', id:'Tilawah mujawwad yang sangat baik oleh Syaikh Mahmoud Khalil Al-Hushari.', ur:'شیخ محمود خلیل الحصری کی بہترین مجود تلاوت۔', bn:'শায়খ মাহমুদ খলিল আল-হুসারির নিখুঁত মুজাওয়াদ তিলাওয়াত।', tr:'Şeyh Mahmud Halil el-Husarî’den ustaca mücevved tilavet.' },
  'تلاوات مرتلة هادئة بصوت الشيخ سعد الغامدي.': { en:'Calm, measured recitations by Sheikh Saad Al-Ghamdi.', fr:'Récitations posées et apaisées du cheikh Saad al-Ghamdi.', id:'Tilawah tartil tenang Syaikh Saad Al-Ghamdi.', ur:'شیخ سعد الغامدی کی پرسکون ترتیل تلاوتیں۔', bn:'শায়খ সাদ আল-গামদির শান্ত তারতিল তিলাওয়াত।', tr:'Şeyh Saad el-Gamdi’den sakin tertil tilavetler.' },
  'المصحف المرتل — محمود خليل الحصري': { en:'Recited mushaf — Mahmoud Khalil Al-Husary', fr:'Moushaf récité — Mahmoud Khalil al-Housari', id:'Mushaf murattal — Mahmoud Khalil Al-Hushari', ur:'ترتیل مصحف — محمود خلیل الحصری', bn:'তারতিল মুসহাফ — মাহমুদ খলিল আল-হুসারি', tr:'Tertil mushaf — Mahmud Halil el-Husarî' },
  'التلاوة المتقنة المجودة لشيخ عموم المقارئ المصرية — الحصري.': { en:'The masterful mujawwad recitation by the head of Egypt’s Quran reciters — Al-Husary.', fr:'La récitation moujawwad maîtrisée du chef des récitateurs d’Égypte — al-Housari.', id:'Tilawah mujawwad yang sangat baik dari syaikh qurra Mesir — Al-Hushari.', ur:'مصر کے شیخ العموم القراء کی بہترین مجود تلاوت — الحصری۔', bn:'মিশরের প্রধান কারিদের মুজাওয়াদ তিলাওয়াত — আল-হুসারি।', tr:'Mısır kurrâsının reisinden ustaca mücevved tilavet — el-Husarî.' },
  'بثٌّ متواصل لتفسير آيات القرآن الكريم وبيان معانيها.': { en:'Continuous tafsir of the Quran’s verses and their meanings.', fr:'Tafsir continu des versets du Coran et de leurs sens.', id:'Tafsir berkelanjutan atas ayat Al-Qur’an dan maknanya.', ur:'قرآن کریم کی آیات کی مسلسل تفسیر اور معانی کا بیان۔', bn:'কুরআনের আয়াতের নিরবচ্ছিন্ন তাফসির ও অর্থ।', tr:'Kur’an ayetlerinin ve anlamlarının kesintisiz tefsiri.' },
  'المصحف المرتل — ماهر المعيقلي': { en:'Recited mushaf — Maher Al-Muaiqly', fr:'Moushaf récité — Maher al-Mouaiqly', id:'Mushaf murattal — Maher Al-Muaiqly', ur:'ترتیل مصحف — ماہر المعیقلی', bn:'তারতিল মুসহাফ — মাহের আল-মুয়াইকিলি', tr:'Tertil mushaf — Mahir el-Muaykılî' },
  'تلاوات الحرم المكي بصوت الشيخ ماهر بن حمد المعيقلي.': { en:'Recitations from the Grand Mosque by Sheikh Maher bin Hamad Al-Muaiqly.', fr:'Récitations de la Grande Mosquée par le cheikh Maher ibn Hamad al-Mouaiqly.', id:'Tilawah dari Masjidil Haram oleh Syaikh Maher bin Hamad Al-Muaiqly.', ur:'حرم مکی کی تلاوتیں، شیخ ماہر بن حمد المعیقلی کی آواز میں۔', bn:'মসজিদুল হারামের তিলাওয়াত, শায়খ মাহের বিন হামাদ আল-মুয়াইকিলির কণ্ঠে।', tr:'Mescid-i Haram tilavetleri, Şeyh Mahir b. Hamad el-Muaykılî’den.' },
  '📤 شارك حصادك': { en:'📤 Share your harvest', fr:'📤 Partagez votre récolte', id:'📤 Bagikan panenmu', ur:'📤 اپنا حاصل شیئر کریں', bn:'📤 আপনার ফসল শেয়ার করুন', tr:'📤 Hasadını paylaş' },
  'متوسط الالتزام اليومي': { en:'Average daily consistency', fr:'Assiduité quotidienne moyenne', id:'Rata-rata konsistensi harian', ur:'روزانہ اوسط پابندی', bn:'দৈনিক গড় নিষ্ঠা', tr:'Günlük ortalama istikrar' },
  '0 من 10 أيام مسجّلة': { en:'0 of 10 days logged', fr:'0 jour sur 10 enregistré', id:'0 dari 10 hari tercatat', ur:'10 میں سے 0 دن درج', bn:'১০-এর মধ্যে ০ দিন নথিভুক্ত', tr:'10 günün 0’ı kayıtlı' },
  'رصيد الزاد': { en:'Zad balance', fr:'Solde Zad', id:'Saldo Zad', ur:'زاد بیلنس', bn:'জাদ ব্যালান্স', tr:'Zad bakiyesi' },
  'ابدأ شريطاً لزيادة نقاطك!': { en:'Start a streak to raise your points!', fr:'Commencez une série pour gagner des points !', id:'Mulai runtutan untuk menambah poin!', ur:'پوائنٹس بڑھانے کے لیے سلسلہ شروع کریں!', bn:'পয়েন্ট বাড়াতে ধারা শুরু করুন!', tr:'Puanını artırmak için seriye başla!' },
  'أيام متتالية': { en:'Consecutive days', fr:'Jours consécutifs', id:'Hari berturut-turut', ur:'مسلسل دن', bn:'টানা দিন', tr:'Ardışık günler' },
  '📅 سجل الأيام ومتابعة الأداء': { en:'📅 Day log and performance tracking', fr:'📅 Journal des jours et suivi', id:'📅 Catatan hari dan pemantauan', ur:'📅 دنوں کا ریکارڈ اور کارکردگی', bn:'📅 দিনের লগ ও অগ্রগতি', tr:'📅 Gün kaydı ve takip' },
  'التروية': { en:'Tarwiyah', fr:'Tarwiya', id:'Tarwiyah', ur:'ترویہ', bn:'তারবিয়া', tr:'Tarviye' },
  'عرفة ⭐': { en:'Arafah ⭐', fr:'Arafat ⭐', id:'Arafah ⭐', ur:'عرفہ ⭐', bn:'আরাফাহ ⭐', tr:'Arefe ⭐' },
  'العيد 🎉': { en:'Eid 🎉', fr:'Aïd 🎉', id:'Idul Adha 🎉', ur:'عید 🎉', bn:'ঈদ 🎉', tr:'Bayram 🎉' },
  'لم يُسجل': { en:'Not logged', fr:'Non enregistré', id:'Belum tercatat', ur:'درج نہیں', bn:'নথিভুক্ত নয়', tr:'Kayıtlı değil' },
  'مكتمل 🏆': { en:'Complete 🏆', fr:'Terminé 🏆', id:'Selesai 🏆', ur:'مکمل 🏆', bn:'সম্পূর্ণ 🏆', tr:'Tamamlandı 🏆' },
  '🏆 إجمالي الطاعات': { en:'🏆 Total acts of worship', fr:'🏆 Total des adorations', id:'🏆 Total ibadah', ur:'🏆 کل عبادات', bn:'🏆 মোট ইবাদত', tr:'🏆 Toplam ibadet' },
  'جزء قرآن': { en:'Quran juz', fr:'Juz du Coran', id:'Juz Al-Qur’an', ur:'قرآن کا پارہ', bn:'কুরআনের জুজ', tr:'Kur’an cüzü' },
  'يوم صيام': { en:'Fasting day', fr:'Jour de jeûne', id:'Hari puasa', ur:'روزے کا دن', bn:'রোজার দিন', tr:'Oruç günü' },
  'أطول شريط': { en:'Longest streak', fr:'Plus longue série', id:'Runtutan terpanjang', ur:'طویل ترین سلسلہ', bn:'দীর্ঘতম ধারা', tr:'En uzun seri' },
  'صلاة جماعة': { en:'Congregational prayer', fr:'Prière en groupe', id:'Salat berjamaah', ur:'نماز باجماعت', bn:'জামাতে নামাজ', tr:'Cemaatle namaz' },
  'وسام مكتسب': { en:'Badges earned', fr:'Badges obtenus', id:'Lencana diraih', ur:'حاصل شدہ بیجز', bn:'অর্জিত ব্যাজ', tr:'Kazanılan rozetler' },
  '📋 تفصيل الأداء': { en:'📋 Performance breakdown', fr:'📋 Détail des performances', id:'📋 Rincian kinerja', ur:'📋 کارکردگی کی تفصیل', bn:'📋 পারফরম্যান্সের বিবরণ', tr:'📋 Performans dökümü' },
  'الصلوات': { en:'Prayers', fr:'Prières', id:'Salat', ur:'نمازیں', bn:'নামাজ', tr:'Namazlar' },
  'الصيام': { en:'Fasting', fr:'Jeûne', id:'Puasa', ur:'روزے', bn:'রোজা', tr:'Oruç' },
  'التكبير': { en:'Takbeer', fr:'Takbir', id:'Takbir', ur:'تکبیر', bn:'তাকবির', tr:'Tekbir' },
  '📊 منحنى الأداء والالتزام': { en:'📊 Performance and consistency curve', fr:'📊 Courbe de performance et d’assiduité', id:'📊 Kurva kinerja dan konsistensi', ur:'📊 کارکردگی اور پابندی کا منحنی', bn:'📊 পারফরম্যান্স ও নিষ্ঠার রেখাচিত্র', tr:'📊 Performans ve istikrar eğrisi' },
  '🕸️ مؤشر التوازن الإيماني': { en:'🕸️ Faith balance index', fr:'🕸️ Indice d’équilibre de la foi', id:'🕸️ Indeks keseimbangan iman', ur:'🕸️ ایمانی توازن کا اشاریہ', bn:'🕸️ ঈমানি ভারসাম্যের সূচক', tr:'🕸️ İman dengesi göstergesi' },
  'يوضّح توازن عباداتك بين المحاور الخمسة — كلما اتّسعت الشبكة كان أداؤك أكثر توازناً 🌿': { en:'Shows how your worship balances across the five axes — the wider the web, the more balanced you are 🌿', fr:'Montre l’équilibre de vos adorations sur les cinq axes — plus la toile s’élargit, plus vous êtes équilibré 🌿', id:'Menunjukkan keseimbangan ibadahmu pada lima poros — makin lebar jaringnya, makin seimbang 🌿', ur:'آپ کی عبادات کا پانچ محوروں پر توازن دکھاتا ہے — جال جتنا پھیلے گا، توازن اتنا بہتر 🌿', bn:'পাঁচ অক্ষে আপনার ইবাদতের ভারসাম্য দেখায় — জাল যত প্রশস্ত, ভারসাম্য তত ভালো 🌿', tr:'İbadetlerinin beş eksende dengesini gösterir — ağ genişledikçe denge artar 🌿' },
  '✨ أقوى محاورك:': { en:'✨ Your strongest axes:', fr:'✨ Vos axes les plus forts :', id:'✨ Poros terkuatmu:', ur:'✨ آپ کے مضبوط ترین محور:', bn:'✨ আপনার সবচেয়ে শক্তিশালী অক্ষ:', tr:'✨ En güçlü eksenlerin:' },
  '— وأكثرها حاجةً لعنايتك:': { en:'— and the ones needing your care most:', fr:'— et ceux qui ont le plus besoin de vous :', id:'— dan yang paling perlu perhatianmu:', ur:'— اور جنہیں آپ کی توجہ سب سے زیادہ چاہیے:', bn:'— এবং যেগুলোর যত্ন সবচেয়ে বেশি দরকার:', tr:'— ve en çok ilgi isteyenler:' },
  '💡 رؤى مخصصة لأدائك': { en:'💡 Insights tailored to you', fr:'💡 Aperçus adaptés à vous', id:'💡 Wawasan khusus untukmu', ur:'💡 آپ کی کارکردگی کے لیے خاص بصیرت', bn:'💡 আপনার জন্য বিশেষ অন্তর্দৃষ্টি', tr:'💡 Sana özel içgörüler' },
  '💡 فرص التحسين': { en:'💡 Room to improve', fr:'💡 Pistes d’amélioration', id:'💡 Peluang perbaikan', ur:'💡 بہتری کے مواقع', bn:'💡 উন্নতির সুযোগ', tr:'💡 İyileştirme fırsatları' },
  '🌙 قيام الليل لم يُسجل — استثمره الليلة': { en:'🌙 Night prayer isn’t logged — make it count tonight', fr:'🌙 La prière de nuit n’est pas enregistrée — rattrapez-la ce soir', id:'🌙 Salat malam belum tercatat — manfaatkan malam ini', ur:'🌙 تہجد درج نہیں — آج رات اسے غنیمت جانیں', bn:'🌙 তাহাজ্জুদ নথিভুক্ত নয় — আজ রাতে কাজে লাগান', tr:'🌙 Gece namazı kayıtlı değil — bu gece değerlendir' },
  '📿 التكبير قليل — أكثر منه في كل لحظة': { en:'📿 Takbeer is low — say more of it every moment', fr:'📿 Le takbir est faible — multipliez-le à chaque instant', id:'📿 Takbir masih sedikit — perbanyak setiap saat', ur:'📿 تکبیر کم ہے — ہر لمحہ زیادہ کریں', bn:'📿 তাকবির কম — প্রতিটি মুহূর্তে বাড়ান', tr:'📿 Tekbir az — her an çoğalt' },
  '📖 تقدم القراءة بطيء — ابدأ بنصف جزء يومياً': { en:'📖 Reading is slow — start with half a juz a day', fr:'📖 La lecture avance lentement — commencez par un demi-juz par jour', id:'📖 Bacaan lambat — mulai setengah juz sehari', ur:'📖 پڑھائی سست ہے — روزانہ آدھا پارہ شروع کریں', bn:'📖 পাঠ ধীর — দিনে আধা জুজ দিয়ে শুরু করুন', tr:'📖 Okuma yavaş — günde yarım cüzle başla' },
  '🌙 الصيام فرصتك في العشر — لا تفوّتها': { en:'🌙 Fasting is your chance in these ten days — don’t miss it', fr:'🌙 Le jeûne est votre chance ces dix jours — ne la manquez pas', id:'🌙 Puasa adalah peluangmu di sepuluh hari ini — jangan lewatkan', ur:'🌙 روزہ ان دس دنوں میں آپ کا موقع ہے — مت چھوڑیں', bn:'🌙 এই দশকে রোজা আপনার সুযোগ — হাতছাড়া করবেন না', tr:'🌙 Bu on günde oruç fırsatın — kaçırma' },
  '🌅 أذكار الصباح لم تُسجل اليوم': { en:'🌅 Morning adhkar aren’t logged today', fr:'🌅 Les adhkar du matin ne sont pas enregistrés aujourd’hui', id:'🌅 Zikir pagi belum tercatat hari ini', ur:'🌅 آج صبح کے اذکار درج نہیں', bn:'🌅 আজ সকালের আযকার নথিভুক্ত নয়', tr:'🌅 Sabah zikirleri bugün kayıtlı değil' },
  '🏅 خزانة الأوسمة': { en:'🏅 Badge cabinet', fr:'🏅 Vitrine des badges', id:'🏅 Lemari lencana', ur:'🏅 بیجز کی الماری', bn:'🏅 ব্যাজের আলমারি', tr:'🏅 Rozet dolabı' },
  'الفجر في جماعة': { en:'Fajr in congregation', fr:'Fajr en groupe', id:'Subuh berjamaah', ur:'فجر باجماعت', bn:'ফজরে জামাত', tr:'Sabah cemaatle' },
  '100 تكبيرة': { en:'100 takbeers', fr:'100 takbirs', id:'100 takbir', ur:'100 تکبیریں', bn:'১০০ তাকবির', tr:'100 tekbir' },
  'صيام 3 أيام': { en:'3 days of fasting', fr:'3 jours de jeûne', id:'Puasa 3 hari', ur:'3 دن کے روزے', bn:'৩ দিন রোজা', tr:'3 gün oruç' },
  'ختمة كاملة': { en:'A full khatma', fr:'Une khatma complète', id:'Khatam penuh', ur:'مکمل ختم', bn:'পূর্ণ খতম', tr:'Tam hatim' },
  'الصلوات الخمس جماعة': { en:'The five prayers in congregation', fr:'Les cinq prières en groupe', id:'Lima salat berjamaah', ur:'پانچوں نمازیں باجماعت', bn:'পাঁচ ওয়াক্ত জামাতে', tr:'Beş vakit cemaatle' },
  'المُكبِّرون': { en:'The Takbeer keepers', fr:'Ceux du takbir', id:'Para pembaca takbir', ur:'تکبیر کہنے والے', bn:'তাকবিরকারীরা', tr:'Tekbir ehli' },
  '1000 تكبيرة': { en:'1000 takbeers', fr:'1000 takbirs', id:'1000 takbir', ur:'1000 تکبیریں', bn:'১০০০ তাকবির', tr:'1000 tekbir' },
  '3 أعمال بر': { en:'3 acts of kindness', fr:'3 actes de bonté', id:'3 amal kebaikan', ur:'3 نیکی کے کام', bn:'৩টি সৎকর্ম', tr:'3 iyilik' },
  'جامع الخير': { en:'Gatherer of good', fr:'Rassembleur de bien', id:'Pengumpul kebaikan', ur:'خیر جمع کرنے والا', bn:'কল্যাণ সংগ্রাহক', tr:'Hayır toplayıcı' },
  '5 أيام متتالية': { en:'5 consecutive days', fr:'5 jours consécutifs', id:'5 hari berturut-turut', ur:'5 مسلسل دن', bn:'৫ টানা দিন', tr:'5 ardışık gün' },
  'فجر العشر': { en:'Fajr of the ten days', fr:'Le Fajr des dix jours', id:'Subuh sepuluh hari', ur:'عشرے کی فجر', bn:'দশকের ফজর', tr:'On günün sabahı' },
  '5 أيام Streak': { en:'5-day streak', fr:'Série de 5 jours', id:'Runtutan 5 hari', ur:'5 دن کا سلسلہ', bn:'৫ দিনের ধারা', tr:'5 günlük seri' },
  'السابق': { en:'Previous', fr:'Précédent', id:'Sebelumnya', ur:'پچھلا', bn:'পূর্ববর্তী', tr:'Önceki' },
  'جدول عرفة كاملاً': { en:'The full Arafah schedule', fr:'Le programme complet d’Arafat', id:'Jadwal Arafah lengkap', ur:'عرفہ کا مکمل شیڈول', bn:'আরাফার সম্পূর্ণ সময়সূচি', tr:'Tam Arefe programı' },
  'لسان ذاكر': { en:'A remembering tongue', fr:'Une langue qui évoque', id:'Lisan yang berzikir', ur:'ذکر کرنے والی زبان', bn:'যিকিরকারী জিহ্বা', tr:'Zikreden dil' },
  '1000 تسبيحة': { en:'1000 tasbihs', fr:'1000 tasbih', id:'1000 tasbih', ur:'1000 تسبیحات', bn:'১০০০ তাসবিহ', tr:'1000 tesbih' },
  'الراسخون': { en:'The firmly grounded', fr:'Les bien ancrés', id:'Yang kokoh', ur:'ثابت قدم', bn:'দৃঢ়প্রতিষ্ঠ', tr:'Sağlam duranlar' },
  '15 جزء قرآن': { en:'15 juz of Quran', fr:'15 juz du Coran', id:'15 juz Al-Qur’an', ur:'15 پارے قرآن', bn:'১৫ জুজ কুরআন', tr:'15 cüz Kur’an' },
  'الواصلون': { en:'Those who arrive', fr:'Ceux qui parviennent', id:'Yang sampai', ur:'منزل تک پہنچنے والے', bn:'যাঁরা পৌঁছেছেন', tr:'Ulaşanlar' },
  '5 أعمال خير': { en:'5 good deeds', fr:'5 bonnes actions', id:'5 amal kebaikan', ur:'5 نیک کام', bn:'৫টি সৎকর্ম', tr:'5 hayır işi' },
  '🌟 شارك حصادك': { en:'🌟 Share your harvest', fr:'🌟 Partagez votre récolte', id:'🌟 Bagikan panenmu', ur:'🌟 اپنا حاصل شیئر کریں', bn:'🌟 আপনার ফসল শেয়ার করুন', tr:'🌟 Hasadını paylaş' },
  'ألهم أحبابك بمسيرتك في طاعة الله وذكره': { en:'Inspire your loved ones with your journey in obeying and remembering Allah', fr:'Inspirez vos proches avec votre parcours dans l’obéissance et l’évocation d’Allah', id:'Inspirasi orang tercinta dengan perjalananmu dalam taat dan zikir kepada Allah', ur:'اللہ کی اطاعت و ذکر میں اپنے سفر سے اپنوں کو تحریک دیں', bn:'আল্লাহর আনুগত্য ও যিকিরে আপনার পথচলা দিয়ে প্রিয়জনকে অনুপ্রাণিত করুন', tr:'Allah’a kulluk ve zikir yolculuğunla sevdiklerine ilham ver' },
  '📤 مشاركة الحصاد': { en:'📤 Share harvest', fr:'📤 Partager la récolte', id:'📤 Bagikan panen', ur:'📤 حاصل شیئر کریں', bn:'📤 ফসল শেয়ার', tr:'📤 Hasadı paylaş' },
  'رصيد الزاد = الأعمال الصالحة × مضاعف الشريط · الأجر الحقيقي عند الله وحده ❤️': { en:'Zad balance = good deeds × streak multiplier · the real reward is with Allah alone ❤️', fr:'Solde Zad = bonnes actions × multiplicateur de série · la vraie récompense est auprès d’Allah seul ❤️', id:'Saldo Zad = amal saleh × pengali runtutan · pahala sejati hanya di sisi Allah ❤️', ur:'زاد بیلنس = نیک اعمال × سلسلہ ضرب · حقیقی اجر صرف اللہ کے پاس ہے ❤️', bn:'জাদ ব্যালান্স = সৎকর্ম × ধারা গুণক · প্রকৃত প্রতিদান কেবল আল্লাহর কাছে ❤️', tr:'Zad bakiyesi = salih ameller × seri çarpanı · gerçek karşılık yalnız Allah katında ❤️' },
  'عدّ': { en:'Count', fr:'Compter', id:'Hitung', ur:'گنیں', bn:'গণনা', tr:'Say' },
  '← كل الأذكار': { en:'← All adhkar', fr:'← Tous les adhkar', id:'← Semua zikir', ur:'← تمام اذکار', bn:'← সব আযকার', tr:'← Tüm zikirler' },
  'من طلوع الفجر إلى طلوع الشمس': { en:'From dawn to sunrise', fr:'De l’aube au lever du soleil', id:'Dari fajar sampai terbit matahari', ur:'فجر سے طلوعِ آفتاب تک', bn:'ভোর থেকে সূর্যোদয়', tr:'Fecirden güneş doğana dek' },
  'انشر التطبيق': { en:'Share the app', fr:'Partager l’app', id:'Bagikan aplikasi', ur:'ایپ شیئر کریں', bn:'অ্যাপ শেয়ার করুন', tr:'Uygulamayı paylaş' },
};

/* ── خريطة عناوين الصفحات (عربي/إنجليزي/فرنسي) ─────────────── */
const PAGE_TITLES = {
  'index.html':       { ar:['زاد','اليومي'], en:['Daily','Zad'], fr:['Zad','Quotidien'], ur:['روزانہ', 'زاد'], id:['Harian', 'Zad'], tr:['Günlük', 'Zad'], bn:['দৈনিক', 'যাদ'] },
  'prayers.html':     { ar:['مواقيت','الصلاة'], en:['Prayer','Times'], fr:['Heures de','prière'], ur:['نماز کے', 'اوقات'], id:['Waktu', 'Salat'], tr:['Namaz', 'Vakitleri'], bn:['নামাজের', 'সময়'] },
  'worship.html':     { ar:['جدول','العبادات'], en:['Worship','Tracker'], fr:['Suivi des','adorations'], ur:['عبادات', 'شیڈول'], id:['Jadwal', 'Ibadah'], tr:['İbadet', 'Takvimi'], bn:['ইবাদতের', 'সূচি'] },
  'adhkar.html':      { ar:['الأذكار','والدعاء'], en:['Dhikr &','Supplications'], fr:['Dhikr et','invocations'], ur:['اذکار', 'و دعا'], id:['Zikir &', 'Doa'], tr:['Zikir ve', 'Dua'], bn:['জিকির ও', 'দুআ'] },
  'fadael.html':      { ar:['فضائل','العشر'], en:['Virtues of the','10 Days'], fr:['Mérites des','10 jours'], ur:['عشرہ کے', 'فضائل'], id:['Keutamaan', '10 Hari'], tr:['On Günün', 'Fazileti'], bn:['দশ দিনের', 'ফজিলত'] },
  'hasad.html':       { ar:['حصاد','العبادات'], en:['Worship','Harvest'], fr:['Bilan des','adorations'], ur:['عبادات کی', 'کٹائی'], id:['Panen', 'Ibadah'], tr:['İbadet', 'Hasadı'], bn:['ইবাদতের', 'ফসল'] },
  'summary.html':     { ar:['ملخص','العبادات'], en:['Worship','Summary'], fr:['Récapitulatif','adorations'], ur:['عبادات کا', 'خلاصہ'], id:['Ringkasan', 'Ibadah'], tr:['İbadet', 'Özeti'], bn:['ইবাদতের', 'সারসংক্ষেপ'] },
  'badges.html':      { ar:['أوسمتي',''], en:['My','Badges'], fr:['Mes','badges'], ur:['', 'میرے تمغے'], id:['', 'Lencanaku'], tr:['', 'Rozetlerim'], bn:['', 'আমার ব্যাজ'] },
  'ai.html':          { ar:['تدبّر','بالذكاء'], en:['AI','Reflection'], fr:['Réflexion','par IA'], ur:['ذہانت سے', 'تدبر'], id:['Tadabur', 'AI'], tr:['Yapay Zekâ', 'Tefekkür'], bn:['এআই', 'তাদাব্বুর'] },
  'videos.html':      { ar:['المرئيات','والمحاضرات'], en:['Islamic','Lectures'], fr:['Conférences','islamiques'], ur:['ویڈیوز', 'و لیکچر'], id:['Video &', 'Ceramah'], tr:['Videolar ve', 'Sohbetler'], bn:['ভিডিও ও', 'বক্তৃতা'] },
  'settings.html':    { ar:['الإعدادات',''], en:['','Settings'], fr:['','Paramètres'], ur:['', 'ترتیبات'], id:['', 'Pengaturan'], tr:['', 'Ayarlar'], bn:['', 'সেটিংস'] },
  'about.html':       { ar:['عن','التطبيق'], en:['About','the App'], fr:['À propos de','l’app'], ur:['ایپ کے', 'بارے میں'], id:['Tentang', 'Aplikasi'], tr:['Uygulama', 'Hakkında'], bn:['অ্যাপ', 'সম্পর্কে'] },
  'mushaf.html':      { ar:['الورد','القرآني'], en:['Daily','Wird'], fr:['Wird','quotidien'], ur:['روزانہ', 'ورد'], id:['Wird', 'Harian'], tr:['Günlük', 'Vird'], bn:['দৈনিক', 'ওয়ারদ'] },
  'takbeer.html':     { ar:['المسبحة',''], en:['','Tasbih'], fr:['','Tasbih'], ur:['', 'تسبیح'], id:['', 'Tasbih'], tr:['', 'Tesbih'], bn:['', 'তাসবিহ'] },
  'mushaf-quran.html':{ ar:['المصحف','الشريف'], en:['Holy','Quran'], fr:['Saint','Coran'], ur:['قرآن', 'مجید'], id:['Mushaf', 'Suci'], tr:['Kur\'an-ı', 'Kerim'], bn:['পবিত্র', 'মুসহাফ'] },
  'arafah.html':      { ar:['يوم','عرفة'], en:['Day of','Arafah'], fr:['Jour de','Arafah'], ur:['عرفہ', 'کا دن'], id:['Hari', 'Arafah'], tr:['Arefe', 'Günü'], bn:['আরাফার', 'দিন'] },
  'odhiya.html':      { ar:['دليل','الأضحية'], en:['Sacrifice','Guide'], fr:['Guide du','sacrifice'], ur:['قربانی کی', 'رہنمائی'], id:['Panduan', 'Kurban'], tr:['Kurban', 'Rehberi'], bn:['কুরবানির', 'নির্দেশিকা'] },
  'sadaqah.html':     { ar:['الصدقة','والبر'], en:['Charity &','Giving'], fr:['Aumône et','bien'], ur:['صدقہ و', 'نیکی'], id:['Sedekah &', 'Kebaikan'], tr:['Sadaka ve', 'İyilik'], bn:['সদকা ও', 'সৎকর্ম'] },
  'hijri.html':       { ar:['التقويم','الهجري'], en:['Hijri','Calendar'], fr:['Calendrier','Hégirien'], ur:['ہجری', 'کیلنڈر'], id:['Kalender', 'Hijriah'], tr:['Hicri', 'Takvim'], bn:['হিজরি', 'ক্যালেন্ডার'] },
  'kids.html':        { ar:['ثُريّا',''], en:['','Thuraya'], fr:['','Thuraya'], ur:['', 'ثریا'], id:['', 'Thuraya'], tr:['', 'Thuraya'], bn:['', 'থুরাইয়া'] },
  'ghars.html':       { ar:['غرس',''], en:['','Ghars'], fr:['','Ghars'], ur:['', 'غرس'], id:['', 'Ghars'], tr:['', 'Ghars'], bn:['', 'গারস'] },
  'report.html':      { ar:['بلاغ','مشكلة'], en:['Report','Issue'], fr:['Signaler un','problème'], ur:['مسئلہ کی', 'اطلاع'], id:['Laporkan', 'Masalah'], tr:['Sorun', 'Bildir'], bn:['সমস্যা', 'জানান'] },
  'profile.html':     { ar:['حسابي','وبياناتي'], en:['My','Account'], fr:['Mon','compte'], ur:['میرا', 'اکاؤنٹ'], id:['Akun', 'Saya'], tr:['', 'Hesabım'], bn:['আমার', 'অ্যাকাউন্ট'] },
  'tasmee.html': { ar:['تسميع', 'القرآن'], en:['Quran', 'Memorization'], fr:['Mémorisation', 'du Coran'], ur:['حفظ کی', 'جانچ'], id:['Setoran', 'Hafalan'], tr:['Ezber', 'Kontrolü'], bn:['হিফজ', 'যাচাই'] },
  'wird.html': { ar:['رفيق', 'الورد'], en:['Wird', 'Companion'], fr:['Compagnon', 'du wird'], ur:['رفیق', 'ورد'], id:['Sahabat', 'Wird'], tr:['Vird', 'Arkadaşı'], bn:['ওয়ারদ', 'সঙ্গী'] },
  'zakat.html': { ar:['حاسبة', 'الزكاة'], en:['Zakat', 'Calculator'], fr:['Calcul', 'de la Zakat'], ur:['زکوٰۃ', 'کیلکولیٹر'], id:['Kalkulator', 'Zakat'], tr:['Zekât', 'Hesaplayıcı'], bn:['যাকাত', 'ক্যালকুলেটর'] },
  'zakat-2026.html': { ar:['زكاة', 'المال الجديد'], en:['Zakat on', 'New Wealth'], fr:['Zakat sur', 'les nouveaux biens'], ur:['نئی دولت', 'کی زکوٰۃ'], id:['Zakat Harta', 'Baru'], tr:['Yeni Malın', 'Zekâtı'], bn:['নতুন সম্পদের', 'যাকাত'] },
  'zakat-ahkam.html': { ar:['أحكام', 'الزكاة'], en:['Zakat', 'Rules'], fr:['Règles de', 'la Zakat'], ur:['زکوٰۃ کے', 'احکام'], id:['Hukum', 'Zakat'], tr:['Zekât', 'Hükümleri'], bn:['যাকাতের', 'বিধান'] },
  'zakat-anwa.html': { ar:['أنواع الزكاة', 'وحسابها'], en:['Zakat', 'Types'], fr:['Types de', 'Zakat'], ur:['زکوٰۃ کی', 'اقسام'], id:['Jenis', 'Zakat'], tr:['Zekât', 'Türleri'], bn:['যাকাতের', 'প্রকার'] },
  'mirath.html': { ar:['حاسبة', 'الميراث'], en:['Inheritance', 'Calculator'], fr:['Calcul', 'de l’héritage'], ur:['میراث', 'کیلکولیٹر'], id:['Kalkulator', 'Warisan'], tr:['Miras', 'Hesaplayıcı'], bn:['উত্তরাধিকার', 'হিসাব'] },
  'wasiyya.html': { ar:['الوصية', 'والثلث'], en:['Will &', 'One-Third'], fr:['Testament', 'et tiers'], ur:['وصیت', 'و ثلث'], id:['Wasiat', '& Sepertiga'], tr:['Vasiyet', 've Üçte Bir'], bn:['ওয়াসিয়াত', 'ও এক-তৃতীয়াংশ'] },
  'janaza.html': { ar:['أحكام', 'الجنازة'], en:['Funeral', 'Rulings'], fr:['Règles', 'funéraires'], ur:['جنازہ کے', 'احکام'], id:['Hukum', 'Jenazah'], tr:['Cenaze', 'Hükümleri'], bn:['জানাজার', 'বিধান'] },
  'qada.html': { ar:['قضاء', 'الفوائت'], en:['Missed', 'Prayers'], fr:['Prières', 'manquées'], ur:['قضا', 'فوائت'], id:['Qada', 'Salat'], tr:['Kaza', 'Namaz'], bn:['কাজা', 'নামাজ'] },
  'musafir.html': { ar:['وضع', 'السفر'], en:['Travel', 'Rulings'], fr:['Règles du', 'voyage'], ur:['سفر کے', 'احکام'], id:['Hukum', 'Safar'], tr:['Yolculuk', 'Hükümleri'], bn:['সফরের', 'বিধান'] },
  'new-muslim.html': { ar:['المسلم', 'الجديد'], en:['New', 'Muslim'], fr:['Nouveau', 'musulman'], ur:['نیا', 'مسلمان'], id:['Muslim', 'Baru'], tr:['Yeni', 'Müslüman'], bn:['নতুন', 'মুসলিম'] },
  'groups.html': { ar:['التنافس', 'العائلي'], en:['Groups &', 'Competition'], fr:['Groupes et', 'compétition'], ur:['گروپ اور', 'مقابلہ'], id:['Grup &', 'Kompetisi'], tr:['Gruplar ve', 'Yarışma'], bn:['দল ও', 'প্রতিযোগিতা'] },
  'privacy.html': { ar:['صندوق', 'الخصوصية'], en:['Privacy &', 'How It Works'], fr:['Confidentialité', 'et fonctionnement'], ur:['رازداری', 'و طریقہ کار'], id:['Privasi &', 'Cara Kerja'], tr:['Gizlilik', 've İşleyiş'], bn:['গোপনীয়তা', 'ও কার্যপদ্ধতি'] },
  'du\'a.html': { ar:['الأدعية', 'المأثورة'], en:['', 'Duas'], fr:['', 'Invocations'], ur:['', 'دعائیں'], id:['', 'Doa'], tr:['', 'Dualar'], bn:['', 'দুআ'] },
  'asma.html': { ar:['أسماء الله', 'الحسنى'], en:['99 Names', 'of Allah'], fr:['Les 99 noms', 'd’Allah'], ur:['اللہ کے', 'حسین نام'], id:['Asmaul', 'Husna'], tr:['Esmaül', 'Hüsna'], bn:['আল্লাহর', 'সুন্দর নাম'] },
  'nawawi.html': { ar:['الأربعون', 'النووية'], en:['Forty', 'Hadith'], fr:['Quarante', 'hadiths'], ur:['چالیس', 'حدیثیں'], id:['Arbain', 'Nawawi'], tr:['Kırk', 'Hadis'], bn:['চল্লিশ', 'হাদিস'] },
  'ramadan.html': { ar:['لوحة', 'رمضان'], en:['Ramadan', 'Board'], fr:['Tableau de', 'Ramadan'], ur:['رمضان', 'ڈیش بورڈ'], id:['Papan', 'Ramadan'], tr:['Ramazan', 'Panosu'], bn:['রমজান', 'ড্যাশবোর্ড'] },
  'taqweem.html': { ar:['التقويم', 'الهجري'], en:['Yearly', 'Calendar'], fr:['Calendrier', 'annuel'], ur:['سالانہ', 'کیلنڈر'], id:['Kalender', 'Tahunan'], tr:['Yıllık', 'Takvim'], bn:['বার্ষিক', 'ক্যালেন্ডার'] },
  'barnamaj.html': { ar:['برنامج', 'اليوم'], en:['Daily', 'Program'], fr:['Programme', 'du jour'], ur:['روز کا', 'پروگرام'], id:['Program', 'Harian'], tr:['Günlük', 'Program'], bn:['দৈনিক', 'কর্মসূচি'] },
  'qibla.html': { ar:['اتجاه', 'القبلة'], en:['Qibla', 'Direction'], fr:['Direction', 'de la Qibla'], ur:['قبلہ کی', 'سمت'], id:['Arah', 'Kiblat'], tr:['Kıble', 'Yönü'], bn:['কিবলার', 'দিক'] },
  'adhkar-categories.html': { ar:['الأذكار', 'والدعاء'], en:['Dhikr &', 'Supplications'], fr:['Dhikr et', 'invocations'], ur:['اذکار', 'و دعا'], id:['Zikir &', 'Doa'], tr:['Zikir ve', 'Dua'], bn:['জিকির ও', 'দুআ'] },
  'arafah-dua.html': { ar:['دعاء', 'عرفة'], en:['Arafah', 'Du’a'], fr:['Invocation', 'd’Arafah'], ur:['عرفہ کی', 'دعا'], id:['Doa', 'Arafah'], tr:['Arefe', 'Duası'], bn:['আরাফার', 'দুআ'] },
  'developer.html': { ar:['عن', 'المطوّر'], en:['About the', 'Developer'], fr:['À propos', 'du développeur'], ur:['ڈویلپر کے', 'بارے میں'], id:['Tentang', 'Pengembang'], tr:['Geliştirici', 'Hakkında'], bn:['ডেভেলপার', 'সম্পর্কে'] },
  'dua-guide.html': { ar:['قِيَم', 'الدعاء'], en:['Du’a', 'Guide'], fr:['Guide de', 'l’invocation'], ur:['دعا کی', 'رہنمائی'], id:['Panduan', 'Doa'], tr:['Dua', 'Rehberi'], bn:['দুআর', 'নির্দেশিকা'] },
  'group-board.html': { ar:['لوحة', 'الصدارة'], en:['Leaderboard', ''], fr:['Classement', ''], ur:['لیڈر', 'بورڈ'], id:['Papan', 'Peringkat'], tr:['Liderlik', 'Tablosu'], bn:['লিডারবোর্ড', ''] },
  'groups-privacy.html': { ar:['الخصوصية', 'وكيف يعمل'], en:['Privacy and', 'How It Works'], fr:['Confidentialité', 'et fonctionnement'], ur:['رازداری', 'اور طریقہ کار'], id:['Privasi', '& Cara Kerja'], tr:['Gizlilik', 've Nasıl Çalışır'], bn:['গোপনীয়তা', 'ও কার্যপদ্ধতি'] },
  'hasad-month.html': { ar:['حصاد', 'الشهر'], en:['Monthly', 'Harvest'], fr:['Bilan', 'mensuel'], ur:['مہینے کا', 'حاصل'], id:['Panen', 'Bulanan'], tr:['Aylık', 'Hasat'], bn:['মাসিক', 'ফসল'] },
  'hasn.html': { ar:['حصن', 'المسلم'], en:['Fortress of', 'the Muslim'], fr:['La Citadelle', 'du musulman'], ur:['حصن', 'المسلم'], id:['Benteng', 'Muslim'], tr:['Hisnü’l-Müslim', ''], bn:['হিসনুল', 'মুসলিম'] },
  'hawwa.html': { ar:['🌙 حواء', ''], en:['🌙 Hawwa', ''], fr:['🌙 Hawwa', ''], ur:['🌙 حوا', ''], id:['🌙 Hawa', ''], tr:['🌙 Havva', ''], bn:['🌙 হাওয়া', ''] },
  'hikayat-hajj.html': { ar:['حكاية', 'حج'], en:['A Hajj', 'Story'], fr:['Une histoire', 'de Hajj'], ur:['حج کی', 'کہانی'], id:['Kisah', 'Haji'], tr:['Hac', 'Hikâyesi'], bn:['হজের', 'গল্প'] },
  'kids-academy.html': { ar:['أكاديمية', 'زاد'], en:['Little Zad', 'Academy'], fr:['Petite académie', 'Zad'], ur:['چھوٹی زاد', 'اکیڈمی'], id:['Akademi Kecil', 'Zad'], tr:['Küçük Zad', 'Akademisi'], bn:['ছোট্ট যাদ', 'একাডেমি'] },
  'kids-city.html': { ar:['مدينة', 'الميزان'], en:['City of', 'Balance'], fr:['La cité de', 'la balance'], ur:['میزان کا', 'شہر'], id:['Kota', 'Keseimbangan'], tr:['Denge', 'Şehri'], bn:['ভারসাম্যের', 'শহর'] },
  'kids-compass.html': { ar:['الطريق إلى', 'البيت'], en:['The Way', 'Home'], fr:['Le chemin de', 'la maison'], ur:['گھر کا', 'راستہ'], id:['Jalan', 'Pulang'], tr:['Eve Giden', 'Yol'], bn:['বাড়ির', 'পথ'] },
  'kids-creativity.html': { ar:['نادي', 'الإبداع'], en:['Creativity', 'Club'], fr:['Club de', 'créativité'], ur:['تخلیقی', 'کلب'], id:['Klub', 'Kreativitas'], tr:['Yaratıcılık', 'Kulübü'], bn:['সৃজন', 'ক্লাব'] },
  'kids-day.html': { ar:['', 'يومي'], en:['My', 'Day'], fr:['Ma', 'journée'], ur:['میرا', 'دن'], id:['Hariku', ''], tr:['Günüm', ''], bn:['আমার', 'দিন'] },
  'kids-detectives.html': { ar:['محقّق', 'القرية'], en:['Village', 'Detective'], fr:['Détective du', 'village'], ur:['گاؤں کا', 'تفتیش کار'], id:['Detektif', 'Desa'], tr:['Köy', 'Dedektifi'], bn:['গ্রামের', 'গোয়েন্দা'] },
  'kids-fun.html': { ar:['شاشة', 'المرح'], en:['Fun', 'Screen'], fr:['Écran de', 'jeux'], ur:['تفریح کی', 'اسکرین'], id:['Layar', 'Keseruan'], tr:['Eğlence', 'Ekranı'], bn:['আনন্দের', 'স্ক্রিন'] },
  'kids-garden.html': { ar:['بستان', 'الذكر'], en:['Dhikr', 'Garden'], fr:['Le jardin', 'du dhikr'], ur:['ذکر کا', 'باغ'], id:['Taman', 'Zikir'], tr:['Zikir', 'Bahçesi'], bn:['জিকিরের', 'বাগান'] },
  'kids-gazette.html': { ar:['صحيفة', 'القرية'], en:['Village', 'Gazette'], fr:['Gazette du', 'village'], ur:['گاؤں کا', 'اخبار'], id:['Koran', 'Desa'], tr:['Köy', 'Gazetesi'], bn:['গ্রামের', 'পত্রিকা'] },
  'kids-heroes.html': { ar:['عرين', 'الأبطال'], en:['Heroes’', 'Den'], fr:['L\'antre des', 'héros'], ur:['بہادروں کا', 'اڈہ'], id:['Sarang Para', 'Pahlawan'], tr:['Kahramanlar', 'Yuvası'], bn:['বীরদের', 'আস্তানা'] },
  'kids-hospitality.html': { ar:['ترتيب', 'الضيافة'], en:['Hospitality', 'Order'], fr:['Ordre de', 'l\'hospitalité'], ur:['مہمان نوازی', 'کی ترتیب'], id:['Urutan', 'Menjamu'], tr:['Misafir Ağırlama', 'Sırası'], bn:['আপ্যায়নের', 'ক্রম'] },
  'kids-lab.html': { ar:['', 'التجربة'], en:['The', 'Experiment'], fr:['L\'expérience', ''], ur:['تجربہ', ''], id:['Eksperimen', ''], tr:['Deney', ''], bn:['পরীক্ষা', ''] },
  'kids-liars.html': { ar:['من', 'يكذب؟'], en:['Who Is', 'Lying?'], fr:['Qui', 'ment ?'], ur:['کون جھوٹ بول', 'رہا ہے؟'], id:['Siapa yang', 'Berbohong?'], tr:['Kim Yalan', 'Söylüyor?'], bn:['কে মিথ্যা', 'বলছে?'] },
  'kids-memory.html': { ar:['قصر', 'الذاكرة'], en:['Memory', 'Palace'], fr:['Le palais de', 'la mémoire'], ur:['یادداشت کا', 'محل'], id:['Istana', 'Memori'], tr:['Hafıza', 'Sarayı'], bn:['স্মৃতির', 'প্রাসাদ'] },
  'kids-parents.html': { ar:['دليل', 'المربي'], en:['Parent', 'Guide'], fr:['Guide des', 'parents'], ur:['مربی کے', 'لیے رہنما'], id:['Panduan Orang', 'Tua'], tr:['Ebeveyn', 'Rehberi'], bn:['অভিভাবক', 'নির্দেশিকা'] },
  'kids-recipe.html': { ar:['', 'الوصفة'], en:['The', 'Recipe'], fr:['La', 'recette'], ur:['ترکیب', ''], id:['Resep', ''], tr:['Tarif', ''], bn:['রেসিপি', ''] },
  'kids-school.html': { ar:['مدرستي', 'الجميلة'], en:['My Beautiful', 'School'], fr:['Ma belle', 'école'], ur:['میرا خوبصورت', 'اسکول'], id:['Sekolahku yang', 'Indah'], tr:['Güzel', 'Okulum'], bn:['আমার সুন্দর', 'স্কুল'] },
  'kids-tales.html': { ar:['حكايات', 'القرية'], en:['Village', 'Tales'], fr:['Contes du', 'village'], ur:['گاؤں کی', 'کہانیاں'], id:['Kisah', 'Desa'], tr:['Köy', 'Masalları'], bn:['গ্রামের', 'গল্প'] },
  'maktaba-nassiya.html': { ar:['المكتبة', 'النصية'], en:['Text', 'Library'], fr:['Bibliothèque de', 'textes'], ur:['متنی', 'کتب خانہ'], id:['Perpustakaan', 'Teks'], tr:['Metin', 'Kütüphanesi'], bn:['টেক্সট', 'লাইব্রেরি'] },
  'manasik.html': { ar:['مناسك', 'الحج'], en:['Hajj', 'Rites'], fr:['Rites du', 'Hajj'], ur:['مناسک', 'حج'], id:['Manasik', 'Haji'], tr:['Hac', 'Menasiki'], bn:['হজের', 'রীতিনীতি'] },
  'playlist.html': { ar:['🎵', 'العظماء'], en:['🎵 The', 'Greats'], fr:['🎵 Les grands', 'savants'], ur:['🎵 عظیم', 'شخصیات'], id:['🎵 Para', 'Ulama'], tr:['🎵 Büyük', 'Âlimler'], bn:['🎵 মহান', 'ব্যক্তিরা'] },
  'ruqyah.html': { ar:['الرقية', 'الشرعية'], en:['Ruqyah', 'Healing'], fr:['Rouqya', ''], ur:['رقیہ', 'شرعیہ'], id:['Ruqyah', 'Syar\'iyah'], tr:['Şer\'i', 'Rukye'], bn:['শরিয়তসম্মত', 'রুকইয়াহ'] },
  'sunan.html': { ar:['السنن', 'المهجورة'], en:['Forgotten', 'Sunnahs'], fr:['Sunan', 'oubliées'], ur:['بھولی', 'سنتیں'], id:['Sunnah yang', 'Terlupakan'], tr:['Unutulan', 'Sünnetler'], bn:['বিস্মৃত', 'সুন্নাহ'] },
  'zahra.html': { ar:['🌸 زهرة', ''], en:['🌸 Zahra', ''], fr:['🌸 Zahra', ''], ur:['🌸 زہرہ', ''], id:['🌸 Zahra', ''], tr:['🌸 Zehra', ''], bn:['🌸 জাহরা', ''] },
};

/* ── CSS لتعديلات اتجاه LTR (إنجليزي + فرنسي) ──────────────── */
(function(){
  const style = document.createElement('style');
  style.id = 'i18n-ltr-css';
  style.textContent = `
    body[data-lang="en"], body[data-lang="fr"], body[data-lang="id"],
    body[data-lang="bn"], body[data-lang="tr"] { direction: ltr; text-align: left; }
    /* الخطوط: بنغالي/أردو/تركي — النظام يرسم العربية تلقائيًا كبديل عند غياب المحرف */
    body[data-lang="bn"] { font-family:'Noto Sans Bengali','Nirmala UI','Vrinda','SolaimanLipi',system-ui,sans-serif; }
    body[data-lang="ur"] { font-family:'Noto Naskh Arabic','Noto Nastaliq Urdu','Jameel Noori Nastaleeq',system-ui,sans-serif; }
    body[data-lang="tr"] { font-family:'Segoe UI','IBM Plex Sans Arabic',Tahoma,system-ui,sans-serif; }
    body[data-lang="id"] { font-family:'Segoe UI','IBM Plex Sans Arabic',Tahoma,system-ui,sans-serif; }
    body[data-lang="ur"] .page-title, body[data-lang="bn"] .page-title { font-family:inherit; }
    /* الشريط الجانبي وقائمة الإشعارات بيستخدموا inset-inline-start/الفلكس
       المنطقي فعليًا في css/style.css — كانا هنا بقيم left/right ثابتة من
       زمن direction:rtl كان متجبر على html,body (اتصلح ده مؤخرًا)، فكانا
       بيلغوا التموضع الصحيح ويخفوا الشريط الجانبي تمامًا في وضعي EN/FR على
       الديسكتوب (زر الفتح hamburger نفسه مخفي على الديسكتوب، فمفيش طريقة
       لإرجاعه). شيلتهم بدل ما أعمل patch فوق patch. */
    body[data-lang="en"] .nav a, body[data-lang="fr"] .nav a,
    body[data-lang="id"] .nav a, body[data-lang="bn"] .nav a,
    body[data-lang="tr"] .nav a { flex-direction: row-reverse; justify-content: flex-end; }
    body[data-lang="en"] .hijri-bar, body[data-lang="fr"] .hijri-bar,
    body[data-lang="id"] .hijri-bar, body[data-lang="bn"] .hijri-bar,
    body[data-lang="tr"] .hijri-bar { direction: ltr; }
    body[data-lang="en"] .quran-text, body[data-lang="fr"] .quran-text,
    body[data-lang="id"] .quran-text, body[data-lang="bn"] .quran-text, body[data-lang="tr"] .quran-text,
    body[data-lang="en"] .ts-ayah-text, body[data-lang="fr"] .ts-ayah-text,
    body[data-lang="id"] .ts-ayah-text, body[data-lang="bn"] .ts-ayah-text, body[data-lang="tr"] .ts-ayah-text,
    body[data-lang="en"] .basmala-txt, body[data-lang="fr"] .basmala-txt,
    body[data-lang="id"] .basmala-txt, body[data-lang="bn"] .basmala-txt, body[data-lang="tr"] .basmala-txt { direction: rtl !important; }
    .i18n-translit { margin-top:4px; line-height:1.5 }
    .i18n-translit .az-translit { display:block; font-style:italic; color:var(--gold-dark,#9a7b2e); font-size:.92em }
    .i18n-translit .az-meaning  { display:block; color:var(--muted); font-size:.9em }
  `;
  document.head.appendChild(style);
  const setBodyLang = () => {
    const L = localStorage.getItem('zad_lang') || 'ar';
    if (document.body) document.body.setAttribute('data-lang', L);
  };
  setBodyLang();
  document.addEventListener('DOMContentLoaded', setBodyLang);
})();

/* خريطة النصوص العامة متاحة للصفحات (لبطاقة «الآن» الديناميكية) */

/* ══════════════════════════════════════════════════════════
   TOASTS — ترجمة رسائل التنبيه (كانت عربية فقط في كل الواجهات)
   ══════════════════════════════════════════════════════════ */
const TOASTS = {
  'أحسنت! جزاك الله خيراً ✅': { en:'Well done! May Allah reward you ✅', fr:'Bravo ! Qu’Allah te récompense ✅', id:'Bagus! Semoga Allah membalas kebaikanmu ✅', ur:'بہت خوب! اللہ آپ کو بہتر بدلہ دے ✅', bn:'চমৎকার! আল্লাহ আপনাকে উত্তম প্রতিদান দিন ✅', tr:'Aferin! Allah seni hayırla mükâfatlandırsın ✅' },
  'اختر ملف صورة': { en:'Choose an image file', fr:'Choisissez un fichier image', id:'Pilih berkas gambar', ur:'تصویر کی فائل منتخب کریں', bn:'একটি ছবির ফাইল বাছুন', tr:'Bir görsel dosyası seç' },
  'التفسير المختصر متاح أعلاه': { en:'The brief tafsir is shown above', fr:'Le tafsir abrégé est affiché ci-dessus', id:'Tafsir ringkas tampil di atas', ur:'مختصر تفسیر اوپر موجود ہے', bn:'সংক্ষিপ্ত তাফসির উপরে দেওয়া আছে', tr:'Kısa tefsir yukarıda gösteriliyor' },
  'التفسير غير متاح حالياً': { en:'Tafsir is not available right now', fr:'Le tafsir n’est pas disponible pour le moment', id:'Tafsir belum tersedia saat ini', ur:'تفسیر اس وقت دستیاب نہیں', bn:'তাফসির এখন পাওয়া যাচ্ছে না', tr:'Tefsir şu anda mevcut değil' },
  'اللهم تقبل منا ومنكم صالح الأعمال 🌸': { en:'O Allah, accept our good deeds 🌸', fr:'Ô Allah, accepte nos bonnes œuvres 🌸', id:'Ya Allah, terimalah amal baik kami 🌸', ur:'اے اللہ، ہماری نیک اعمال قبول فرما 🌸', bn:'হে আল্লাহ, আমাদের নেক আমল কবুল করুন 🌸', tr:'Allah’ım, salih amellerimizi kabul et 🌸' },
  'انسخ الرابط وشاركه': { en:'Copy the link and share it', fr:'Copiez le lien et partagez-le', id:'Salin tautan lalu bagikan', ur:'لنک کاپی کریں اور شیئر کریں', bn:'লিংক কপি করে শেয়ার করুন', tr:'Bağlantıyı kopyalayıp paylaş' },
  'انسخ النص يدوياً': { en:'Copy the text manually', fr:'Copiez le texte manuellement', id:'Salin teksnya secara manual', ur:'متن خود کاپی کریں', bn:'লেখাটি নিজে কপি করুন', tr:'Metni elle kopyala' },
  'تذكير: بر الوالدين من أحب الأعمال إلى الله ❤️': { en:'Reminder: honouring parents is among the deeds Allah loves most ❤️', fr:'Rappel : la bonté envers les parents est parmi les actes les plus aimés d’Allah ❤️', id:'Pengingat: berbakti kepada orang tua adalah amal yang paling dicintai Allah ❤️', ur:'یاد دہانی: والدین کی خدمت اللہ کو سب سے زیادہ پسند ہے ❤️', bn:'স্মরণ: পিতা-মাতার সেবা আল্লাহর সবচেয়ে প্রিয় কাজ ❤️', tr:'Hatırlatma: anne babaya iyilik, Allah’ın en sevdiği amellerdendir ❤️' },
  'تعذّر الحفظ': { en:'Could not save', fr:'Enregistrement impossible', id:'Gagal menyimpan', ur:'محفوظ نہیں ہو سکا', bn:'সংরক্ষণ করা যায়নি', tr:'Kaydedilemedi' },
  'تعذّر جلب التفسير — تحقق من الاتصال': { en:'Could not load the tafsir — check your connection', fr:'Impossible de charger le tafsir — vérifiez la connexion', id:'Gagal memuat tafsir — periksa koneksi', ur:'تفسیر حاصل نہیں ہو سکی — رابطہ چیک کریں', bn:'তাফসির আনা যায়নি — সংযোগ পরীক্ষা করুন', tr:'Tefsir yüklenemedi — bağlantını kontrol et' },
  'تعذّرت الطباعة من هذا المتصفح': { en:'Printing is not supported in this browser', fr:'L’impression n’est pas prise en charge par ce navigateur', id:'Pencetakan tidak didukung di peramban ini', ur:'اس براؤزر میں پرنٹ ممکن نہیں', bn:'এই ব্রাউজারে প্রিন্ট করা যাবে না', tr:'Bu tarayıcıda yazdırma desteklenmiyor' },
  'تم اختيار الخطة ✅': { en:'Plan selected ✅', fr:'Plan sélectionné ✅', id:'Rencana dipilih ✅', ur:'منصوبہ منتخب ہو گیا ✅', bn:'পরিকল্পনা নির্বাচিত ✅', tr:'Plan seçildi ✅' },
  'تم النسخ 📋': { en:'Copied 📋', fr:'Copié 📋', id:'Disalin 📋', ur:'کاپی ہو گیا 📋', bn:'কপি হয়েছে 📋', tr:'Kopyalandı 📋' },
  'تم تحديث إعداد التذكير ✅': { en:'Reminder setting updated ✅', fr:'Réglage du rappel mis à jour ✅', id:'Pengaturan pengingat diperbarui ✅', ur:'یاد دہانی کی ترتیب اپ ڈیٹ ہو گئی ✅', bn:'রিমাইন্ডার সেটিং হালনাগাদ হয়েছে ✅', tr:'Hatırlatma ayarı güncellendi ✅' },
  'تم تحديث الصورة 🌙': { en:'Image updated 🌙', fr:'Image mise à jour 🌙', id:'Gambar diperbarui 🌙', ur:'تصویر اپ ڈیٹ ہو گئی 🌙', bn:'ছবি হালনাগাদ হয়েছে 🌙', tr:'Görsel güncellendi 🌙' },
  'تم تحديد البطاقة — جاهزة للمشاركة 📤': { en:'Card ready — you can share it 📤', fr:'Carte prête — vous pouvez la partager 📤', id:'Kartu siap — bisa langsung dibagikan 📤', ur:'کارڈ تیار ہے — شیئر کریں 📤', bn:'কার্ড প্রস্তুত — শেয়ার করুন 📤', tr:'Kart hazır — paylaşabilirsin 📤' },
  'تم حفظ الإعداد ✅': { en:'Setting saved ✅', fr:'Réglage enregistré ✅', id:'Pengaturan disimpan ✅', ur:'ترتیب محفوظ ہو گئی ✅', bn:'সেটিং সংরক্ষিত ✅', tr:'Ayar kaydedildi ✅' },
  'تمت إعادة العداد 🔄': { en:'Counter reset 🔄', fr:'Compteur réinitialisé 🔄', id:'Penghitung direset 🔄', ur:'کاؤنٹر ری سیٹ ہو گیا 🔄', bn:'কাউন্টার রিসেট হয়েছে 🔄', tr:'Sayaç sıfırlandı 🔄' },
  'تهنئة العيد تجدد المحبة 🌙': { en:'Eid greetings renew love 🌙', fr:'Les vœux de l’Aïd renouvellent l’affection 🌙', id:'Ucapan Idul Fitri menyegarkan kasih sayang 🌙', ur:'عید کی مبارکباد محبت تازہ کرتی ہے 🌙', bn:'ঈদের শুভেচ্ছা ভালোবাসা নতুন করে 🌙', tr:'Bayram tebriği sevgiyi tazeler 🌙' },
  'جارٍ تجهيز الصورة…': { en:'Preparing the image…', fr:'Préparation de l’image…', id:'Menyiapkan gambar…', ur:'تصویر تیار ہو رہی ہے…', bn:'ছবি তৈরি হচ্ছে…', tr:'Görsel hazırlanıyor…' },
  'حفظ الله أخوتك ورزقكم المحبة 💚': { en:'May Allah preserve your brotherhood and grant you love 💚', fr:'Qu’Allah préserve votre fraternité et vous accorde l’affection 💚', id:'Semoga Allah menjaga ukhuwah dan mengaruniakan kasih sayang 💚', ur:'اللہ آپ کی بھائی چارہ قائم رکھے اور محبت عطا فرمائے 💚', bn:'আল্লাহ আপনার ভ্রাতৃত্ব রক্ষা করুন ও ভালোবাসা দিন 💚', tr:'Allah kardeşliğinizi korusun ve size sevgi versin 💚' },
  'سجّلت هذا العمل بالفعل ✅': { en:'You already logged this deed ✅', fr:'Vous avez déjà enregistré cet acte ✅', id:'Amal ini sudah kamu catat ✅', ur:'یہ عمل پہلے ہی درج ہے ✅', bn:'এই আমলটি আগেই লিপিবদ্ধ হয়েছে ✅', tr:'Bu ameli zaten kaydettin ✅' },
  'سيتم توجيهك لمنصة التبرع الموثوقة 🌟': { en:'You’ll be taken to the trusted donation platform 🌟', fr:'Vous serez redirigé vers la plateforme de dons de confiance 🌟', id:'Kamu akan diarahkan ke platform donasi terpercaya 🌟', ur:'آپ کو قابلِ اعتماد عطیہ پلیٹ فارم پر بھیجا جائے گا 🌟', bn:'আপনাকে নির্ভরযোগ্য দান প্ল্যাটফর্মে নেওয়া হবে 🌟', tr:'Güvenilir bağış platformuna yönlendirileceksin 🌟' },
  'صلة الرحم تزيد العمر والرزق 🌟': { en:'Keeping family ties increases lifespan and provision 🌟', fr:'Maintenir les liens familiaux allonge la vie et la subsistance 🌟', id:'Menyambung silaturahmi memanjangkan umur dan rezeki 🌟', ur:'صلہ رحمی عمر اور رزق میں اضافہ کرتی ہے 🌟', bn:'আত্মীয়তার বন্ধন আয়ু ও রিজিক বাড়ায় 🌟', tr:'Akrabalık bağını korumak ömrü ve rızkı artırır 🌟' },
  'لقد سجّلت هذا العمل بالفعل ✅': { en:'You have already logged this deed ✅', fr:'Vous avez déjà enregistré cet acte ✅', id:'Amal ini sudah pernah kamu catat ✅', ur:'آپ یہ عمل پہلے درج کر چکے ہیں ✅', bn:'আপনি এই আমলটি আগেই লিপিবদ্ধ করেছেন ✅', tr:'Bu ameli daha önce kaydettin ✅' },
  'ما شاء الله! أتممت الختمة كاملة 🏆': { en:'MashaAllah! You completed the whole khatma 🏆', fr:'MâchâAllah ! Vous avez terminé toute la khatma 🏆', id:'Masyaallah! Kamu menuntaskan khataman penuh 🏆', ur:'ما شاء اللہ! آپ نے پوری ختم مکمل کر لی 🏆', bn:'মাশাআল্লাহ! আপনি পুরো খতম সম্পন্ন করেছেন 🏆', tr:'Mâşâallah! Hatmin tamamını bitirdin 🏆' },
  'هذا الهدف مُضاف بالفعل': { en:'This goal is already added', fr:'Cet objectif est déjà ajouté', id:'Target ini sudah ditambahkan', ur:'یہ ہدف پہلے ہی شامل ہے', bn:'এই লক্ষ্য আগেই যোগ করা হয়েছে', tr:'Bu hedef zaten eklendi' },
  'وضع بلا ميكروفون — اقرأ الآية ثم قيّم نفسك': { en:'No-microphone mode — recite the verse, then assess yourself', fr:'Mode sans micro — récitez le verset, puis évaluez-vous', id:'Mode tanpa mikrofon — baca ayatnya, lalu nilai dirimu', ur:'بغیر مائیک موڈ — آیت پڑھیں پھر خود جانچیں', bn:'মাইক ছাড়া মোড — আয়াত পড়ে নিজেকে মূল্যায়ন করুন', tr:'Mikrofonsuz mod — ayeti oku, sonra kendini değerlendir' },
  '⏳ جارٍ تجهيز الصورة...': { en:'Preparing the image…', fr:'Préparation de l’image…', id:'Menyiapkan gambar…', ur:'تصویر تیار ہو رہی ہے…', bn:'ছবি তৈরি হচ্ছে…', tr:'Görsel hazırlanıyor…' },
  '▶️ اضغط مرة أخرى للتشغيل': { en:'Tap once more to play', fr:'Appuyez encore une fois pour lire', id:'Ketuk sekali lagi untuk memutar', ur:'چلانے کے لیے دوبارہ دبائیں', bn:'চালাতে আরেকবার চাপুন', tr:'Oynatmak için bir kez daha dokun' },
  '⚠️ أدخل سعر جرام الذهب أولاً': { en:'Enter the gold price per gram first', fr:'Saisissez d’abord le prix du gramme d’or', id:'Masukkan dulu harga emas per gram', ur:'پہلے سونے کی فی گرام قیمت درج کریں', bn:'আগে প্রতি গ্রাম সোনার দাম লিখুন', tr:'Önce gram altın fiyatını gir' },
  '⚠️ إنشاء الصورة يحتاج اتصالاً بالإنترنت أول مرة': { en:'Creating the image needs internet the first time', fr:'La création de l’image nécessite Internet la première fois', id:'Pembuatan gambar butuh internet pada kali pertama', ur:'پہلی بار تصویر بنانے کے لیے انٹرنیٹ درکار ہے', bn:'প্রথমবার ছবি তৈরি করতে ইন্টারনেট দরকার', tr:'Görseli ilk kez oluşturmak için internet gerekir' },
  '⚠️ اختر إجابة أولاً': { en:'Choose an answer first', fr:'Choisissez d’abord une réponse', id:'Pilih jawaban dulu', ur:'پہلے جواب منتخب کریں', bn:'আগে একটি উত্তর বাছুন', tr:'Önce bir cevap seç' },
  '⚠️ المتصفح لا يدعم الإشعارات': { en:'This browser doesn’t support notifications', fr:'Ce navigateur ne prend pas en charge les notifications', id:'Peramban ini tidak mendukung notifikasi', ur:'یہ براؤزر اطلاعات کی اجازت نہیں دیتا', bn:'এই ব্রাউজার নোটিফিকেশন সমর্থন করে না', tr:'Bu tarayıcı bildirimleri desteklemiyor' },
  '⚠️ تعذّر إنشاء الصورة': { en:'Could not create the image', fr:'Impossible de créer l’image', id:'Gagal membuat gambar', ur:'تصویر بنائی نہیں جا سکی', bn:'ছবি তৈরি করা যায়নি', tr:'Görsel oluşturulamadı' },
  '⚠️ جرّب مجدداً': { en:'Try again', fr:'Réessayez', id:'Coba lagi', ur:'دوبارہ کوشش کریں', bn:'আবার চেষ্টা করুন', tr:'Tekrar dene' },
  '⚠️ فات الحج — راجع حالتك': { en:'Hajj has passed — check your status', fr:'Le Hajj est passé — vérifiez votre situation', id:'Haji sudah lewat — periksa statusmu', ur:'حج رہ گیا — اپنی حالت دیکھیں', bn:'হজ ছুটে গেছে — আপনার অবস্থা দেখুন', tr:'Hac geçti — durumunu gözden geçir' },
  '⚠️ فعّل الإشعارات أولًا من الأعلى': { en:'Enable notifications first from the top', fr:'Activez d’abord les notifications en haut', id:'Aktifkan notifikasi dulu di bagian atas', ur:'پہلے اوپر سے اطلاعات فعال کریں', bn:'আগে উপরে থেকে নোটিফিকেশন চালু করুন', tr:'Önce üstten bildirimleri aç' },
  '⚠️ وحدة الإشعارات غير محمّلة — أعد تحميل الصفحة': { en:'Notifications module isn’t loaded — reload the page', fr:'Le module de notifications n’est pas chargé — rechargez la page', id:'Modul notifikasi belum termuat — muat ulang halaman', ur:'اطلاعات ماڈیول لوڈ نہیں ہوا — صفحہ دوبارہ کھولیں', bn:'নোটিফিকেশন মডিউল লোড হয়নি — পেজ রিলোড করুন', tr:'Bildirim modülü yüklenmedi — sayfayı yenile' },
  '✅ أحسنت! هذا النشاط مكتمل بالفعل': { en:'Well done! This activity is already complete', fr:'Bravo ! Cette activité est déjà terminée', id:'Bagus! Aktivitas ini sudah selesai', ur:'بہت خوب! یہ سرگرمی پہلے ہی مکمل ہے', bn:'চমৎকার! এই কার্যক্রম আগেই সম্পন্ন', tr:'Aferin! Bu etkinlik zaten tamamlandı' },
  '✅ تم اختيار الخطة': { en:'Plan selected', fr:'Plan sélectionné', id:'Rencana dipilih', ur:'منصوبہ منتخب ہو گیا', bn:'পরিকল্পনা নির্বাচিত', tr:'Plan seçildi' },
  '✅ تم المشاركة!': { en:'Shared!', fr:'Partagé !', id:'Dibagikan!', ur:'شیئر ہو گیا!', bn:'শেয়ার হয়েছে!', tr:'Paylaşıldı!' },
  '✅ تم النسخ': { en:'Copied', fr:'Copié', id:'Disalin', ur:'کاپی ہو گیا', bn:'কপি হয়েছে', tr:'Kopyalandı' },
  '✅ تم تثبيت التطبيق!': { en:'App installed!', fr:'Application installée !', id:'Aplikasi terpasang!', ur:'ایپ انسٹال ہو گئی!', bn:'অ্যাপ ইনস্টল হয়েছে!', tr:'Uygulama yüklendi!' },
  '✅ تم تحديث الورد المخصص': { en:'Custom wird updated', fr:'Wird personnalisé mis à jour', id:'Wird khusus diperbarui', ur:'حسبِ ضرورت ورد اپ ڈیٹ ہو گیا', bn:'কাস্টম ওয়ারদ হালনাগাদ হয়েছে', tr:'Özel vird güncellendi' },
  '✅ تم تصدير البيانات': { en:'Data exported', fr:'Données exportées', id:'Data diekspor', ur:'ڈیٹا برآمد ہو گیا', bn:'ডেটা এক্সপোর্ট হয়েছে', tr:'Veriler dışa aktarıldı' },
  '✅ تم تفعيل الإشعارات!': { en:'Notifications enabled!', fr:'Notifications activées !', id:'Notifikasi diaktifkan!', ur:'اطلاعات فعال ہو گئیں!', bn:'নোটিফিকেশন চালু হয়েছে!', tr:'Bildirimler açıldı!' },
  '✅ تم حفظ الصورة — شاركها مع أحبابك': { en:'Image saved — share it with your loved ones', fr:'Image enregistrée — partagez-la avec vos proches', id:'Gambar tersimpan — bagikan ke orang tercinta', ur:'تصویر محفوظ ہو گئی — اپنوں سے شیئر کریں', bn:'ছবি সংরক্ষিত — প্রিয়জনদের সঙ্গে শেয়ার করুন', tr:'Görsel kaydedildi — sevdiklerinle paylaş' },
  '✅ تم حفظ صورة الحساب': { en:'Profile image saved', fr:'Image de profil enregistrée', id:'Gambar profil tersimpan', ur:'پروفائل تصویر محفوظ ہو گئی', bn:'প্রোফাইল ছবি সংরক্ষিত', tr:'Profil görseli kaydedildi' },
  '✅ تم نسخ الاسم': { en:'Name copied', fr:'Nom copié', id:'Nama disalin', ur:'نام کاپی ہو گیا', bn:'নাম কপি হয়েছে', tr:'İsim kopyalandı' },
  '✅ تم نسخ التقدم': { en:'Progress copied', fr:'Progression copiée', id:'Kemajuan disalin', ur:'پیش رفت کاپی ہو گئی', bn:'অগ্রগতি কপি হয়েছে', tr:'İlerleme kopyalandı' },
  '✅ تم نسخ الدعاء': { en:'Du’a copied', fr:'Invocation copiée', id:'Doa disalin', ur:'دعا کاپی ہو گئی', bn:'দুআ কপি হয়েছে', tr:'Dua kopyalandı' },
  '✅ تم نسخ الرابط': { en:'Link copied', fr:'Lien copié', id:'Tautan disalin', ur:'لنک کاپی ہو گیا', bn:'লিংক কপি হয়েছে', tr:'Bağlantı kopyalandı' },
  '✅ تم نسخ رابط التطبيق': { en:'App link copied', fr:'Lien de l’application copié', id:'Tautan aplikasi disalin', ur:'ایپ کا لنک کاپی ہو گیا', bn:'অ্যাপের লিংক কপি হয়েছে', tr:'Uygulama bağlantısı kopyalandı' },
  '✅ تمّ — تقبّل الله': { en:'Done — may Allah accept', fr:'Terminé — qu’Allah l’accepte', id:'Selesai — semoga Allah menerima', ur:'ہو گیا — اللہ قبول فرمائے', bn:'সম্পন্ন — আল্লাহ কবুল করুন', tr:'Tamam — Allah kabul etsin' },
  '✅ جاهزة للمشاركة': { en:'Ready to share', fr:'Prêt à partager', id:'Siap dibagikan', ur:'شیئر کرنے کے لیے تیار', bn:'শেয়ারের জন্য প্রস্তুত', tr:'Paylaşmaya hazır' },
  '✅ صحيح! أحسنت': { en:'Correct! Well done', fr:'Correct ! Bravo', id:'Benar! Bagus', ur:'درست! بہت خوب', bn:'সঠিক! চমৎকার', tr:'Doğru! Aferin' },
  '✅ صحيح! ✨ +5 نور': { en:'Correct! ✨ +5 light', fr:'Correct ! ✨ +5 lumières', id:'Benar! ✨ +5 cahaya', ur:'درست! ✨ +5 نور', bn:'সঠিক! ✨ +৫ নূর', tr:'Doğru! ✨ +5 nur' },
  '✅ عاد الاتصال بالإنترنت': { en:'Back online', fr:'Connexion rétablie', id:'Kembali online', ur:'انٹرنیٹ دوبارہ جڑ گیا', bn:'ইন্টারনেট আবার চালু', tr:'İnternet geri geldi' },
  '✅ مكتمل — بارك الله فيك': { en:'Complete — may Allah reward you', fr:'Terminé — qu’Allah te récompense', id:'Selesai — semoga Allah membalasmu', ur:'مکمل — اللہ آپ کو جزائے خیر دے', bn:'সম্পন্ন — আল্লাহ আপনাকে প্রতিদান দিন', tr:'Tamamlandı — Allah razı olsun' },
  '✓ شكراً — سيساعدنا بلاغك في تحسين المساعد': { en:'Thanks — your report helps us improve the assistant', fr:'Merci — votre signalement nous aide à améliorer l’assistant', id:'Terima kasih — laporanmu membantu kami memperbaiki asisten', ur:'شکریہ — آپ کی اطلاع اسسٹنٹ بہتر بنانے میں مدد دے گی', bn:'ধন্যবাদ — আপনার রিপোর্ট সহায়কটিকে উন্নত করতে সাহায্য করবে', tr:'Teşekkürler — bildirimin asistanı geliştirmemize yardımcı olur' },
  '✨ +10 نور! أحسنت يا بطل': { en:'✨ +10 light! Well done, champion', fr:'✨ +10 lumières ! Bravo, champion', id:'✨ +10 cahaya! Hebat, jagoan', ur:'✨ +10 نور! شاباش چیمپئن', bn:'✨ +১০ নূর! চমৎকার, চ্যাম্পিয়ন', tr:'✨ +10 nur! Aferin, şampiyon' },
  '✨ +10 نور! بطلٌ صالح 💚': { en:'✨ +10 light! A righteous champion 💚', fr:'✨ +10 lumières ! Un champion vertueux 💚', id:'✨ +10 cahaya! Jagoan yang saleh 💚', ur:'✨ +10 نور! نیک چیمپئن 💚', bn:'✨ +১০ নূর! নেক চ্যাম্পিয়ন 💚', tr:'✨ +10 nur! Salih bir şampiyon 💚' },
  '❌ الملف غير صحيح — تأكد أنه ملف JSON من زاد': { en:'Invalid file — make sure it’s a Zad JSON file', fr:'Fichier invalide — vérifiez qu’il s’agit d’un JSON de Zad', id:'Berkas tidak valid — pastikan ini JSON dari Zad', ur:'فائل درست نہیں — یقینی بنائیں یہ زاد کی JSON ہے', bn:'ফাইল সঠিক নয় — নিশ্চিত করুন এটি যাদ-এর JSON', tr:'Dosya geçersiz — Zad JSON dosyası olduğundan emin ol' },
  '❌ خطأ في التصدير': { en:'Export failed', fr:'Échec de l’exportation', id:'Ekspor gagal', ur:'برآمدگی میں خرابی', bn:'এক্সপোর্ট ব্যর্থ', tr:'Dışa aktarma başarısız' },
  '❌ فعّلها من إعدادات المتصفح': { en:'Enable it from your browser settings', fr:'Activez-la dans les réglages du navigateur', id:'Aktifkan dari pengaturan peramban', ur:'براؤزر کی ترتیبات سے فعال کریں', bn:'ব্রাউজারের সেটিংস থেকে চালু করুন', tr:'Tarayıcı ayarlarından aç' },
  '❤️ أُضيفت لمفضّلتك': { en:'Added to your favourites', fr:'Ajouté à vos favoris', id:'Ditambahkan ke favoritmu', ur:'پسندیدہ میں شامل ہو گیا', bn:'প্রিয় তালিকায় যোগ হয়েছে', tr:'Favorilerine eklendi' },
  '❤️ تمت الإضافة للمفضلة': { en:'Added to favourites', fr:'Ajouté aux favoris', id:'Ditambahkan ke favorit', ur:'پسندیدہ میں شامل ہو گیا', bn:'প্রিয় তালিকায় যোগ হয়েছে', tr:'Favorilere eklendi' },
  '⬇️ تم تنزيل النسخة الاحتياطية': { en:'Backup downloaded', fr:'Sauvegarde téléchargée', id:'Cadangan diunduh', ur:'بیک اپ ڈاؤن لوڈ ہو گیا', bn:'ব্যাকআপ ডাউনলোড হয়েছে', tr:'Yedek indirildi' },
  '⬇️ تم تنزيل نسخة بياناتك': { en:'Your data copy was downloaded', fr:'La copie de vos données a été téléchargée', id:'Salinan datamu sudah diunduh', ur:'آپ کے ڈیٹا کی نقل ڈاؤن لوڈ ہو گئی', bn:'আপনার ডেটার কপি ডাউনলোড হয়েছে', tr:'Veri kopyan indirildi' },
  '⭐ أحسنت! +نجمة': { en:'Well done! +1 star', fr:'Bravo ! +1 étoile', id:'Bagus! +1 bintang', ur:'بہت خوب! +1 ستارہ', bn:'চমৎকার! +১ তারা', tr:'Aferin! +1 yıldız' },
  '⭐ نجمة جديدة! فهمت خطوة الحج': { en:'New star! You understood a Hajj step', fr:'Nouvelle étoile ! Vous avez compris une étape du Hajj', id:'Bintang baru! Kamu paham satu tahap haji', ur:'نیا ستارہ! آپ نے حج کا ایک مرحلہ سمجھا', bn:'নতুন তারা! হজের একটি ধাপ বুঝেছেন', tr:'Yeni yıldız! Hac adımlarından birini anladın' },
  '🌐 الترجمة إلى هذه اللغة قيد الإضافة قريباً': { en:'Translation into this language is coming soon', fr:'La traduction dans cette langue arrive bientôt', id:'Terjemahan ke bahasa ini segera hadir', ur:'اس زبان میں ترجمہ جلد شامل ہو گا', bn:'এই ভাষায় অনুবাদ শীঘ্রই আসছে', tr:'Bu dile çeviri yakında geliyor' },
  '🌟 أهلاً بك أيها البطل! بطاقتُك جاهزة': { en:'Welcome, champion! Your card is ready', fr:'Bienvenue, champion ! Ta carte est prête', id:'Selamat datang, jagoan! Kartumu siap', ur:'خوش آمدید چیمپئن! آپ کا کارڈ تیار ہے', bn:'স্বাগতম, চ্যাম্পিয়ন! আপনার কার্ড প্রস্তুত', tr:'Hoş geldin şampiyon! Kartın hazır' },
  '🌸 معذورة اليوم — لا تُكتب عليكِ ولا تُحسب لكِ': { en:'Excused today — nothing is recorded for or against you', fr:'Excusée aujourd’hui — rien n’est compté pour ou contre toi', id:'Dimaklumi hari ini — tidak ada yang dicatat untukmu maupun atasmu', ur:'آج معذور ہیں — نہ کچھ لکھا جاتا ہے نہ شمار', bn:'আজ মাফ — আপনার পক্ষে বা বিপক্ষে কিছু লেখা হয় না', tr:'Bugün mazur sayılırsın — lehine de aleyhine de bir şey yazılmaz' },
  '🌸 مفكّرةٌ جديدةٌ ليومكِ': { en:'A fresh journal page for your day', fr:'Une nouvelle page de journal pour ta journée', id:'Halaman jurnal baru untuk harimu', ur:'آپ کے دن کے لیے نیا صفحہ', bn:'আপনার দিনের জন্য নতুন পাতা', tr:'Günün için yeni bir sayfa' },
  '🎉 أنجزت 100 تكبيرة! ما شاء الله عليك!': { en:'You reached 100 takbirs! MashaAllah!', fr:'100 takbîr atteints ! MâchâAllah !', id:'Kamu mencapai 100 takbir! Masyaallah!', ur:'آپ نے 100 تکبیریں مکمل کیں! ما شاء اللہ!', bn:'আপনি ১০০ তাকবির পূর্ণ করেছেন! মাশাআল্লাহ!', tr:'100 tekbire ulaştın! Mâşâallah!' },
  '🎉 ترتيب صحيح!': { en:'Correct order!', fr:'Bon ordre !', id:'Urutan benar!', ur:'ترتیب درست ہے!', bn:'ক্রম সঠিক!', tr:'Doğru sıra!' },
  '🎉 ما شاء الله — تقبّل الله منك': { en:'MashaAllah — may Allah accept from you', fr:'MâchâAllah — qu’Allah l’accepte de toi', id:'Masyaallah — semoga Allah menerimanya', ur:'ما شاء اللہ — اللہ آپ سے قبول فرمائے', bn:'মাশাআল্লাহ — আল্লাহ আপনার পক্ষ থেকে কবুল করুন', tr:'Mâşâallah — Allah senden kabul etsin' },
  '🎉 ما شاء الله! أتممت الورد اليومي كاملاً': { en:'MashaAllah! You finished today’s wird', fr:'MâchâAllah ! Tu as terminé le wird du jour', id:'Masyaallah! Kamu menuntaskan wird hari ini', ur:'ما شاء اللہ! آپ نے آج کا ورد مکمل کیا', bn:'মাশাআল্লাহ! আজকের ওয়ারদ সম্পূর্ণ করেছেন', tr:'Mâşâallah! Günün virdini bitirdin' },
  '🎉 ورد اليوم مكتمل! جزاك الله خيراً 🌟': { en:'Today’s wird is complete! May Allah reward you 🌟', fr:'Le wird du jour est terminé ! Qu’Allah te récompense 🌟', id:'Wird hari ini selesai! Semoga Allah membalasmu 🌟', ur:'آج کا ورد مکمل! اللہ جزائے خیر دے 🌟', bn:'আজকের ওয়ারদ সম্পূর্ণ! আল্লাহ প্রতিদান দিন 🌟', tr:'Günün virdi tamam! Allah razı olsun 🌟' },
  '🎨 رائع! أكملت النشاط وكسبت نجمة ⭐': { en:'Great! Activity complete — you earned a star ⭐', fr:'Génial ! Activité terminée — une étoile gagnée ⭐', id:'Keren! Aktivitas selesai — dapat satu bintang ⭐', ur:'زبردست! سرگرمی مکمل — ایک ستارہ ملا ⭐', bn:'দারুণ! কার্যক্রম শেষ — একটি তারা পেলেন ⭐', tr:'Harika! Etkinlik tamam — bir yıldız kazandın ⭐' },
  '🎵 فتح على SoundCloud للتحميل': { en:'Opened on SoundCloud to download', fr:'Ouvert sur SoundCloud pour le téléchargement', id:'Dibuka di SoundCloud untuk diunduh', ur:'ڈاؤن لوڈ کے لیے SoundCloud پر کھل گیا', bn:'ডাউনলোডের জন্য SoundCloud-এ খোলা হয়েছে', tr:'İndirmek için SoundCloud’da açıldı' },
  '🎵 قريباً: عيد الأضحى': { en:'Coming soon: Eid al-Adha', fr:'Bientôt : Aïd al-Adha', id:'Segera: Idul Adha', ur:'جلد آ رہا ہے: عید الاضحیٰ', bn:'শীঘ্রই: ঈদুল আজহা', tr:'Yakında: Kurban Bayramı' },
  '🎵 قريباً: لبيك اللهم لبيك': { en:'Coming soon: Labbayk Allahumma Labbayk', fr:'Bientôt : Labbayk Allahumma Labbayk', id:'Segera: Labbaik Allahumma Labbaik', ur:'جلد آ رہا ہے: لبیک اللھم لبیک', bn:'শীঘ্রই: লাব্বাইক আল্লাহুম্মা লাব্বাইক', tr:'Yakında: Lebbeyk Allahümme Lebbeyk' },
  '🎵 قريباً: يا كعبتي': { en:'Coming soon: Ya Ka‘bati', fr:'Bientôt : Yâ Ka‘batî', id:'Segera: Ya Ka’bati', ur:'جلد آ رہا ہے: یا کعبتی', bn:'শীঘ্রই: ইয়া কাব্বাতি', tr:'Yakında: Yâ Kâbe’ti' },
  '🏆 ما شاء الله! أتممت الختمة كاملة!': { en:'MashaAllah! You completed the whole khatma!', fr:'MâchâAllah ! Tu as terminé toute la khatma !', id:'Masyaallah! Khatamanmu tuntas!', ur:'ما شاء اللہ! آپ نے پوری ختم مکمل کی!', bn:'মাশাআল্লাহ! পুরো খতম সম্পন্ন!', tr:'Mâşâallah! Hatmin tamamını bitirdin!' },
  '💾 تم الحفظ': { en:'Saved', fr:'Enregistré', id:'Disimpan', ur:'محفوظ ہو گیا', bn:'সংরক্ষিত', tr:'Kaydedildi' },
  '💾 تم حفظ حساب الزكاة': { en:'Zakat calculation saved', fr:'Calcul de la zakat enregistré', id:'Perhitungan zakat disimpan', ur:'زکوٰۃ کا حساب محفوظ ہو گیا', bn:'যাকাতের হিসাব সংরক্ষিত', tr:'Zekât hesabı kaydedildi' },
  '💾 تم حفظ ملاحظتك': { en:'Your note was saved', fr:'Votre note a été enregistrée', id:'Catatanmu tersimpan', ur:'آپ کا نوٹ محفوظ ہو گیا', bn:'আপনার নোট সংরক্ষিত হয়েছে', tr:'Notun kaydedildi' },
  '📋 تم النسخ': { en:'Copied', fr:'Copié', id:'Disalin', ur:'کاپی ہو گیا', bn:'কপি হয়েছে', tr:'Kopyalandı' },
  '📋 تم نسخ التقرير — يمكنك إرساله مباشرةً': { en:'Report copied — you can send it right away', fr:'Rapport copié — tu peux l’envoyer directement', id:'Laporan disalin — bisa langsung dikirim', ur:'رپورٹ کاپی ہو گئی — ابھی بھیج سکتے ہیں', bn:'রিপোর্ট কপি হয়েছে — এখনই পাঠাতে পারেন', tr:'Rapor kopyalandı — hemen gönderebilirsin' },
  '📋 تم نسخ الدعاء': { en:'Du’a copied', fr:'Invocation copiée', id:'Doa disalin', ur:'دعا کاپی ہو گئی', bn:'দুআ কপি হয়েছে', tr:'Dua kopyalandı' },
  '📋 تم نسخ الرابط': { en:'Link copied', fr:'Lien copié', id:'Tautan disalin', ur:'لنک کاپی ہو گیا', bn:'লিংক কপি হয়েছে', tr:'Bağlantı kopyalandı' },
  '📋 تم نسخ القصّة': { en:'Story copied', fr:'Histoire copiée', id:'Kisah disalin', ur:'کہانی کاپی ہو گئی', bn:'গল্প কপি হয়েছে', tr:'Hikâye kopyalandı' },
  '📋 تم نسخ المتن': { en:'Text copied', fr:'Texte copié', id:'Teks disalin', ur:'متن کاپی ہو گیا', bn:'লেখা কপি হয়েছে', tr:'Metin kopyalandı' },
  '📋 تم نسخ الملخص': { en:'Summary copied', fr:'Résumé copié', id:'Ringkasan disalin', ur:'خلاصہ کاپی ہو گیا', bn:'সারসংক্ষেপ কপি হয়েছে', tr:'Özet kopyalandı' },
  '📋 تم نسخ الملخص للحافظة': { en:'Summary copied to clipboard', fr:'Résumé copié dans le presse-papiers', id:'Ringkasan disalin ke papan klip', ur:'خلاصہ کلپ بورڈ میں کاپی ہو گیا', bn:'সারসংক্ষেপ ক্লিপবোর্ডে কপি হয়েছে', tr:'Özet panoya kopyalandı' },
  '📋 تم نسخ النص': { en:'Text copied', fr:'Texte copié', id:'Teks disalin', ur:'متن کاپی ہو گیا', bn:'লেখা কপি হয়েছে', tr:'Metin kopyalandı' },
  '📡 الفيديو يحتاج اتصالاً بالإنترنت': { en:'The video needs an internet connection', fr:'La vidéo nécessite une connexion Internet', id:'Video ini membutuhkan koneksi internet', ur:'ویڈیو کے لیے انٹرنیٹ درکار ہے', bn:'ভিডিওটির জন্য ইন্টারনেট দরকার', tr:'Video için internet bağlantısı gerekir' },
  '📥 تم تحميل البطاقة!': { en:'Card downloaded!', fr:'Carte téléchargée !', id:'Kartu terunduh!', ur:'کارڈ ڈاؤن لوڈ ہو گیا!', bn:'কার্ড ডাউনলোড হয়েছে!', tr:'Kart indirildi!' },
  '📥 تم تحميل مفكّرتكِ': { en:'Your journal was downloaded', fr:'Ton journal a été téléchargé', id:'Jurnalmu sudah diunduh', ur:'آپ کی ڈائری ڈاؤن لوڈ ہو گئی', bn:'আপনার ডায়েরি ডাউনলোড হয়েছে', tr:'Günlüğün indirildi' },
  '📴 أنت غير متصل — يعمل وضع عدم الاتصال': { en:'You’re offline — offline mode is active', fr:'Vous êtes hors ligne — le mode hors ligne est actif', id:'Kamu offline — mode luring aktif', ur:'آپ آف لائن ہیں — آف لائن موڈ فعال', bn:'আপনি অফলাইন — অফলাইন মোড চালু', tr:'Çevrimdışısın — çevrimdışı mod etkin' },
  '🔄 الإجابة الصحيحة ظاهرةٌ بالأخضر': { en:'The correct answer is shown in green', fr:'La bonne réponse est en vert', id:'Jawaban benar ditandai hijau', ur:'درست جواب سبز رنگ میں ہے', bn:'সঠিক উত্তর সবুজে দেখানো হয়েছে', tr:'Doğru cevap yeşil gösterilir' },
  '🔄 تمت إعادة التعيين': { en:'Reset done', fr:'Réinitialisation effectuée', id:'Reset selesai', ur:'ری سیٹ ہو گیا', bn:'রিসেট সম্পন্ন', tr:'Sıfırlama tamamlandı' },
  '🔄 تمت إعادة تعيين الأذكار': { en:'Adhkar reset', fr:'Adhkâr réinitialisés', id:'Zikir direset', ur:'اذکار ری سیٹ ہو گئے', bn:'জিকির রিসেট হয়েছে', tr:'Zikirler sıfırlandı' },
  '🔄 جارٍ تحديث التطبيق لأحدث نسخة...': { en:'Updating the app to the latest version…', fr:'Mise à jour de l’application…', id:'Memperbarui aplikasi ke versi terbaru…', ur:'ایپ کو تازہ ترین ورژن میں اپ ڈیٹ کیا جا رہا ہے…', bn:'অ্যাপকে সর্বশেষ সংস্করণে হালনাগাদ করা হচ্ছে…', tr:'Uygulama en son sürüme güncelleniyor…' },
  '🔄 جرّب تاني! تذكّر: وجه ← يدين ← رأس ← قدم': { en:'Try again! Remember: face ← hands ← head ← feet', fr:'Réessaie ! Rappel : visage ← mains ← tête ← pieds', id:'Coba lagi! Ingat: wajah ← tangan ← kepala ← kaki', ur:'دوبارہ کوشش کریں! یاد رکھیں: چہرہ ← ہاتھ ← سر ← پاؤں', bn:'আবার চেষ্টা করুন! মনে রাখুন: মুখ ← হাত ← মাথা ← পা', tr:'Tekrar dene! Hatırla: yüz ← eller ← baş ← ayaklar' },
  '🔔 الإشعارات قيد التفعيل': { en:'Enabling notifications', fr:'Activation des notifications', id:'Mengaktifkan notifikasi', ur:'اطلاعات فعال کی جا رہی ہیں', bn:'নোটিফিকেশন চালু হচ্ছে', tr:'Bildirimler açılıyor' },
  '🔔 تم تفعيل الإشعارات بنجاح!': { en:'Notifications enabled successfully!', fr:'Notifications activées avec succès !', id:'Notifikasi berhasil diaktifkan!', ur:'اطلاعات کامیابی سے فعال ہو گئیں!', bn:'নোটিফিকেশন সফলভাবে চালু হয়েছে!', tr:'Bildirimler başarıyla açıldı!' },
  '🔕 تم إيقاف تنبيه الأذان': { en:'Adhan alert turned off', fr:'Alerte de l’adhan désactivée', id:'Peringatan azan dimatikan', ur:'اذان کی اطلاع بند کر دی گئی', bn:'আজানের নোটিফিকেশন বন্ধ', tr:'Ezan bildirimi kapatıldı' },
  '🔕 تم رفض الإشعارات': { en:'Notifications were declined', fr:'Notifications refusées', id:'Notifikasi ditolak', ur:'اطلاعات مسترد کر دی گئیں', bn:'নোটিফিকেশন প্রত্যাখ্যাত', tr:'Bildirimler reddedildi' },
  '🔗 تم نسخ الرابط': { en:'Link copied', fr:'Lien copié', id:'Tautan disalin', ur:'لنک کاپی ہو گیا', bn:'লিংক কপি হয়েছে', tr:'Bağlantı kopyalandı' },
  '🗑️ أُزيلت من المفضلة': { en:'Removed from favourites', fr:'Retiré des favoris', id:'Dihapus dari favorit', ur:'پسندیدہ سے ہٹا دیا گیا', bn:'প্রিয় তালিকা থেকে সরানো হয়েছে', tr:'Favorilerden kaldırıldı' },
  '🗑️ تم حذف الملاحظة': { en:'Note deleted', fr:'Note supprimée', id:'Catatan dihapus', ur:'نوٹ حذف ہو گیا', bn:'নোট মুছে ফেলা হয়েছে', tr:'Not silindi' },
  '🗑️ تم مسح البيانات': { en:'Data cleared', fr:'Données effacées', id:'Data dihapus', ur:'ڈیٹا صاف ہو گیا', bn:'ডেটা মুছে ফেলা হয়েছে', tr:'Veriler temizlendi' },
  '🗑️ تمت الإزالة من المفضلة': { en:'Removed from favourites', fr:'Retiré des favoris', id:'Dihapus dari favorit', ur:'پسندیدہ سے ہٹا دیا گیا', bn:'প্রিয় তালিকা থেকে সরানো হয়েছে', tr:'Favorilerden kaldırıldı' },
  '🤲 بارك الله فيك، تم حفظ التدبر': { en:'May Allah reward you — your reflection was saved', fr:'Qu’Allah te récompense — ta méditation est enregistrée', id:'Semoga Allah membalasmu — tadaburmu tersimpan', ur:'اللہ آپ کو جزا دے — تدبر محفوظ ہو گیا', bn:'আল্লাহ আপনাকে প্রতিদান দিন — তাদাব্বুর সংরক্ষিত', tr:'Allah razı olsun — tefekkürün kaydedildi' },
  '🧠 أنهيت الاختبار! كسبت 3 نجوم ⭐⭐⭐': { en:'You finished the quiz! 3 stars earned ⭐⭐⭐', fr:'Quiz terminé ! 3 étoiles gagnées ⭐⭐⭐', id:'Kuis selesai! 3 bintang didapat ⭐⭐⭐', ur:'آپ نے کوئز مکمل کیا! 3 ستارے ملے ⭐⭐⭐', bn:'কুইজ শেষ! ৩ তারা পেলেন ⭐⭐⭐', tr:'Testi bitirdin! 3 yıldız kazandın ⭐⭐⭐' },
  '🧭 البوصلة غير معايرة — حرّك الهاتف على شكل ٨ ثم أعد المحاولة': { en:'Compass not calibrated — move your phone in a figure-8, then try again', fr:'Boussole non calibrée — déplacez le téléphone en forme de 8, puis réessayez', id:'Kompas belum terkalibrasi — gerakkan ponsel membentuk angka 8, lalu coba lagi', ur:'قطب نما کیلیبریٹ نہیں — فون کو 8 کی شکل میں گھمائیں پھر کوشش کریں', bn:'কম্পাস ক্যালিব্রেট হয়নি — ফোনটি ৮ আকৃতিতে ঘুরিয়ে আবার চেষ্টা করুন', tr:'Pusula kalibre değil — telefonu 8 şeklinde hareket ettirip tekrar dene' },
  '📲 افتح القائمة ← «إضافة للشاشة الرئيسية»': { en:'Open the menu → “Add to Home Screen”', fr:'Ouvrez le menu → « Ajouter à l’écran d’accueil »', id:'Buka menu → “Tambahkan ke Layar Utama”', ur:'مینو کھولیں → «ہوم اسکرین پر شامل کریں»', bn:'মেনু খুলুন → “হোম স্ক্রিনে যোগ করুন”', tr:'Menüyü aç → “Ana ekrana ekle”' },
  '📖 ممتاز! قرأت القصة وكسبت نجمة ⭐': { en:'Excellent! You read the story and earned a star ⭐', fr:'Excellent ! Histoire lue, une étoile gagnée ⭐', id:'Hebat! Kamu membaca kisahnya dan dapat bintang ⭐', ur:'زبردست! کہانی پڑھی اور ستارہ ملا ⭐', bn:'দারুণ! গল্প পড়ে একটি তারা পেলেন ⭐', tr:'Harika! Hikâyeyi okudun, bir yıldız kazandın ⭐' },
  'اللَّهُ أَكْبَرُ اللَّهُ أَكْبَرُ وَلِلَّهِ الْحَمْدُ 🎵': { en:'Allahu Akbar, Allahu Akbar, wa lillahi al-hamd 🎵', fr:'Allahou Akbar, Allahou Akbar, wa lillâhi al-hamd 🎵', id:'Allahu Akbar, Allahu Akbar, wa lillahil hamd 🎵', ur:'اللہ اکبر، اللہ اکبر، وللہ الحمد 🎵', bn:'আল্লাহু আকবার, আল্লাহু আকবার, ওয়া লিল্লাহিল হামদ 🎵', tr:'Allahu Ekber, Allahu Ekber, ve lillâhil hamd 🎵' },
  'الآن': { en:'Now', fr:'Maintenant', id:'Sekarang', ur:'ابھی', bn:'এখন', tr:'Şimdi' },
};

/* قوالب بمتغيّرات — {n} {name} {label} {title} */
const TOAST_TPL = {
  'الهدف الجديد: {n} تسبيحة 🎯': { en:'New target: {n} tasbihs 🎯', fr:'Nouvel objectif : {n} tasbîh 🎯', id:'Target baru: {n} tasbih 🎯', ur:'نیا ہدف: {n} تسبیحیں 🎯', bn:'নতুন লক্ষ্য: {n} তাসবিহ 🎯', tr:'Yeni hedef: {n} tesbih 🎯' },
  '✅ {n} — دورة مكتملة': { en:'{n} — round complete', fr:'{n} — tour terminé', id:'{n} — putaran selesai', ur:'{n} — دور مکمل', bn:'{n} — চক্র সম্পন্ন', tr:'{n} — tur tamamlandı' },
  '✅ {label} — دورة مكتملة! (×{n})': { en:'{label} — round complete! (×{n})', fr:'{label} — tour terminé ! (×{n})', id:'{label} — putaran selesai! (×{n})', ur:'{label} — دور مکمل! (×{n})', bn:'{label} — চক্র সম্পন্ন! (×{n})', tr:'{label} — tur tamamlandı! (×{n})' },
  '✅ الحديث {n} — تم التعليم': { en:'Hadith {n} marked as learned', fr:'Hadith {n} marqué comme appris', id:'Hadis {n} ditandai sudah dipelajari', ur:'حدیث {n} — تعلیم مکمل', bn:'হাদিস {n} — শেখা হয়েছে', tr:'{n}. hadis öğrenildi' },
  '✅ تم اختيار: {name}': { en:'Selected: {name}', fr:'Sélectionné : {name}', id:'Dipilih: {name}', ur:'منتخب کیا: {name}', bn:'নির্বাচিত: {name}', tr:'Seçildi: {name}' },
  '✅ تم استيراد {n} عنصر — جارٍ التحديث': { en:'Imported {n} items — refreshing', fr:'{n} éléments importés — actualisation', id:'{n} item diimpor — menyegarkan', ur:'{n} عناصر درآمد ہوئے — اپ ڈیٹ ہو رہا ہے', bn:'{n} আইটেম আমদানি হয়েছে — হালনাগাদ হচ্ছে', tr:'{n} öğe içe aktarıldı — yenileniyor' },
  '🎉 أتممت {title} كاملة — بارك الله فيك': { en:'You completed {title} — may Allah reward you', fr:'Tu as terminé {title} — qu’Allah te récompense', id:'Kamu menuntaskan {title} — semoga Allah membalasmu', ur:'آپ نے {title} مکمل کیا — اللہ جزا دے', bn:'আপনি {title} সম্পূর্ণ করেছেন — আল্লাহ প্রতিদান দিন', tr:'{title} tamamlandı — Allah razı olsun' },
  '🎉 ما شاء الله! أتممت {n} تسبيحة': { en:'MashaAllah! You completed {n} tasbihs', fr:'MâchâAllah ! {n} tasbîh accomplis', id:'Masyaallah! {n} tasbih selesai', ur:'ما شاء اللہ! {n} تسبیحیں مکمل', bn:'মাশাআল্লাহ! {n} তাসবিহ সম্পন্ন', tr:'Mâşâallah! {n} tesbih tamamlandı' },
  '🎯 أُضيف هدف: {title}': { en:'Goal added: {title}', fr:'Objectif ajouté : {title}', id:'Target ditambahkan: {title}', ur:'ہدف شامل ہو گیا: {title}', bn:'লক্ষ্য যোগ হয়েছে: {title}', tr:'Hedef eklendi: {title}' },
  '🎵 {title}': { en:'{title}', fr:'{title}', id:'{title}', ur:'{title}', bn:'{title}', tr:'{title}' },
  '🎵 قريباً: {title}': { en:'Coming soon: {title}', fr:'Bientôt : {title}', id:'Segera: {title}', ur:'جلد آ رہا ہے: {title}', bn:'শীঘ্রই: {title}', tr:'Yakında: {title}' },
  '🏅 وسام جديد: {label}': { en:'New badge: {label}', fr:'Nouveau badge : {label}', id:'Lencana baru: {label}', ur:'نیا تمغہ: {label}', bn:'নতুন ব্যাজ: {label}', tr:'Yeni rozet: {label}' },
  '💝 بارك الله فيك — {title}': { en:'May Allah reward you — {title}', fr:'Qu’Allah te récompense — {title}', id:'Semoga Allah membalasmu — {title}', ur:'اللہ آپ کو جزا دے — {title}', bn:'আল্লাহ আপনাকে প্রতিদান দিন — {title}', tr:'Allah razı olsun — {title}' },
  '💾 تم حفظ {n} تسبيحة': { en:'{n} tasbihs saved', fr:'{n} tasbîh enregistrés', id:'{n} tasbih disimpan', ur:'{n} تسبیحیں محفوظ ہو گئیں', bn:'{n} তাসবিহ সংরক্ষিত', tr:'{n} tesbih kaydedildi' },
  '📍 تم اختيار {name}': { en:'Selected: {name}', fr:'Sélectionné : {name}', id:'Dipilih: {name}', ur:'منتخب کیا: {name}', bn:'নির্বাচিত: {name}', tr:'Seçildi: {name}' },
  '📖 جزء {n} مكتمل — بارك الله فيك': { en:'Juz {n} complete — may Allah reward you', fr:'Juz {n} terminé — qu’Allah te récompense', id:'Juz {n} selesai — semoga Allah membalasmu', ur:'پارہ {n} مکمل — اللہ جزا دے', bn:'পারা {n} সম্পূর্ণ — আল্লাহ প্রতিদান দিন', tr:'{n}. cüz tamam — Allah razı olsun' },
  '🔊 {n} تكبيرة — ما شاء الله!': { en:'{n} takbirs — MashaAllah!', fr:'{n} takbîr — MâchâAllah !', id:'{n} takbir — Masyaallah!', ur:'{n} تکبیریں — ما شاء اللہ!', bn:'{n} তাকবির — মাশাআল্লাহ!', tr:'{n} tekbir — Mâşâallah!' },
  '🔔 تنبيه الأذان مفعّل — {n} إشعارات مجدولة': { en:'Adhan alert on — {n} notifications scheduled', fr:'Alerte adhan activée — {n} notifications programmées', id:'Peringatan azan aktif — {n} notifikasi dijadwalkan', ur:'اذان کی اطلاع فعال — {n} اطلاعات شیڈول ہوئیں', bn:'আজানের নোটিফিকেশন চালু — {n} নোটিফিকেশন নির্ধারিত', tr:'Ezan bildirimi açık — {n} bildirim planlandı' },
  '🎉 مبروك! حصلت على {name}': { en:'Congrats! You earned {name}', fr:'Bravo ! Tu as gagné {name}', id:'Selamat! Kamu mendapat {name}', ur:'مبارک ہو! آپ نے {name} حاصل کیا', bn:'অভিনন্দন! আপনি {name} পেয়েছেন', tr:'Tebrikler! {name} kazandın' },
  '🌱 نبتةُ «{name}» كبرت! ✨ +5 نور': { en:'The “{name}” plant grew! ✨ +5 light', fr:'La plante « {name} » a grandi ! ✨ +5 lumières', id:'Tanaman “{name}” tumbuh! ✨ +5 cahaya', ur:'«{name}» کا پودا بڑھ گیا! ✨ +5 نور', bn:'“{name}” গাছটি বেড়েছে! ✨ +৫ নূর', tr:'“{name}” fidanı büyüdü! ✨ +5 nur' },
  '🌳 «{name}» مثمرةٌ بالكامل، ما شاء الله!': { en:'“{name}” is fully fruitful — MashaAllah!', fr:'« {name} » est pleinement fructueux — MâchâAllah !', id:'“{name}” berbuah penuh — Masyaallah!', ur:'«{name}» پوری طرح پھل دار ہے — ما شاء اللہ!', bn:'“{name}” পুরোপুরি ফলবান — মাশাআল্লাহ!', tr:'“{name}” tam meyveli — Mâşâallah!' },
};

/* ZT(msg) — تُرجم رسالة تنبيه عربية إلى اللغة الحالية.
   المطابقة تامة أولًا، ثم قوالب بمتغيّرات (أطول قالب أولًا)، وإلا يُعاد النص كما هو. */
/* تُرجم الأجزاء المتغيّرة داخل الرسالة إن كانت في UI_MAP (اسم شارة/قسم…) */
const ZT_PARTS = {
  'المبكّر': { en:'Early Bird', fr:'Lève-tôt', id:'Si Awal', ur:'ابتدائی', bn:'প্রভাতী', tr:'Erkenci' },
  'الذاكرون': { en:'The Rememberers', fr:'Les invocateurs', id:'Para Pezikir', ur:'ذاکرین', bn:'যিকিরকারীরা', tr:'Zikredenler' },
  'الصائمون': { en:'The Fasters', fr:'Les jeûneurs', id:'Para Puasa', ur:'روزہ دار', bn:'রোজাদাররা', tr:'Oruç Tutanlar' },
  'الخاتمون': { en:'Khatma Completers', fr:'Ceux qui achèvent', id:'Penuntaskan Khatam', ur:'ختم کرنے والے', bn:'খতম সম্পন্নকারীরা', tr:'Hatmi Bitirenler' },
  'المسارعون': { en:'The Swift', fr:'Les empressés', id:'Para Cepat', ur:'سبقت لینے والے', bn:'দ্রুতগামীরা', tr:'Yarışanlar' },
  'المكبّرون': { en:'The Takbir Voices', fr:'Ceux du takbîr', id:'Para Takbir', ur:'تکبیر کہنے والے', bn:'তাকবিরকারীরা', tr:'Tekbir Getirenler' },
  'المتصدقون': { en:'The Givers', fr:'Les donateurs', id:'Para Pemberi', ur:'صدقہ دینے والے', bn:'দানকারীরা', tr:'Sadaka Verenler' },
  'السابقة': { en:'Streaker', fr:'Série', id:'Rentetan', ur:'لگاتار', bn:'ধারাবাহিক', tr:'Seri' },
  'عرفة': { en:'Arafah', fr:'Arafah', id:'Arafah', ur:'عرفہ', bn:'আরাফাহ', tr:'Arefe' }
};
function ztPart(v, lang) {
  const hit = ZT_PARTS[v] || (window.ZAD_UI_MAP && window.ZAD_UI_MAP[v]);
  if (!hit) return v;
  return hit[lang] || hit.en || v;
}

function ZT(msg) {
  if (msg == null) return msg;
  const s = String(msg);
  let lang = 'ar';
  try { lang = (window.I18N && I18N.current) || 'ar'; } catch (e) {}
  if (!lang || lang === 'ar') return s;
  const exact = TOASTS[s] || TOASTS[s.trim()];
  if (exact) return exact[lang] || exact.en || s;

  /* قوالب: نحوّل {x} إلى مجموعة التقاط */
  const keys = Object.keys(TOAST_TPL).sort((a, b) => b.length - a.length);
  for (const key of keys) {
    const ph = [];
    const rx = new RegExp('^' + key.replace(/[.*+?^$()|[\]\\]/g, '\\$&')
      .replace(/\{[a-z]+\}/gi, (m) => { ph.push(m.slice(1, -1)); return '(.+?)'; }) + '$');
    const hit = rx.exec(s.trim());
    if (!hit) continue;
    let tplStr = TOAST_TPL[key][lang] || TOAST_TPL[key].en;
    ph.forEach((name, i) => { tplStr = tplStr.split('{' + name + '}').join(ztPart(hit[i + 1], lang)); });
    return tplStr;
  }
  return s;
}
window.ZT = ZT;

/* ════════════════════════════════════════════════════════════
   تنسيق التاريخ الهجري باللغة الحالية — مصدر واحد لكل الصفحات
   (كان مكتوبًا بالعربية في app.js و calendar.js و index.html)
   ════════════════════════════════════════════════════════════ */
const ZAD_HIJRI_MONTHS = ['محرّم','صفر','ربيع الأول','ربيع الآخر','جمادى الأولى','جمادى الآخرة','رجب','شعبان','رمضان','شوال','ذو القعدة','ذو الحجة'];
const ZAD_LOCALES = { ar:'ar-EG', en:'en-GB', fr:'fr-FR', id:'id-ID', ur:'ur-PK', bn:'bn-BD', tr:'tr-TR' };
function zadLangNow() {
  try { return (window.I18N && window.I18N.current) || localStorage.getItem('zad_lang') || 'ar'; } catch (e) { return 'ar'; }
}
function ZadFmtHijri(day, month, year, date) {
  const L = zadLangNow();
  const d = date || new Date();
  const suffix = { ar:'هـ', ur:'ہجری', bn:'হিজরি', en:'AH', fr:'H', id:'H', tr:'H' }[L] || 'AH';
  if (L === 'ar') return `${day} ${ZAD_HIJRI_MONTHS[month - 1]} ${year} ${suffix}`;
  try {
    const parts = new Intl.DateTimeFormat(ZAD_LOCALES[L] + '-u-ca-islamic-umalqura',
      { day:'numeric', month:'long', year:'numeric' }).formatToParts(d);
    const pick = t => (parts.find(p => p.type === t) || {}).value || '';
    if (pick('day') && pick('month') && pick('year')) return `${pick('day')} ${pick('month')} ${pick('year')} ${suffix}`;
  } catch (e) {}
  return `${day} ${ZAD_HIJRI_MONTHS[month - 1]} ${year} ${suffix}`;
}
function ZadFmtGreg(date) {
  const L = zadLangNow();
  const d = date || new Date();
  const arabic = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
  if (L === 'ar') return `${d.getDate()} ${arabic[d.getMonth()]} ${d.getFullYear()} م`;
  try { return new Intl.DateTimeFormat(ZAD_LOCALES[L], { day:'numeric', month:'long', year:'numeric' }).format(d); }
  catch (e) { return `${d.getDate()} ${arabic[d.getMonth()]} ${d.getFullYear()}`; }
}
/* «N من M عبادة» حسب اللغة — تستخدمها app.js عند رسم شريط التقدم */
function ZadWorshipProgress(done, total) {
  const L = zadLangNow();
  const out = {
    ar: `${done} من ${total} عبادة`,
    en: `${done} of ${total} acts of worship`,
    fr: `${done} sur ${total} adorations`,
    id: `${done} dari ${total} ibadah`,
    ur: `${done} از ${total} عبادات`,
    bn: `${total}-এর মধ্যে ${done} ইবাদত`,
    tr: `${total} ibadetten ${done}`
  }[L] || `${done} من ${total} عبادة`;
  return out;
}
window.ZadWorshipProgress = ZadWorshipProgress;
window.ZadFmtHijri = ZadFmtHijri;
window.ZadFmtGreg = ZadFmtGreg;

window.ZAD_UI_MAP = UI_MAP;
