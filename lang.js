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
    const mainEl = document.querySelector('.main');
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
          if (t.length < 2 || t.length > 60) return NodeFilter.FILTER_REJECT;
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
window.ZAD_UI_MAP = UI_MAP;
