/* ═══════════════════════════════════════════════════════════════════════════
   زاد — محرّك العشوائية للمكتبة
   ─────────────────────────────────────────────────────────────────────────
   المشكلة: الصفحة الرئيسية كانت تعرض نفس خمسة فيديوهات بترتيب ثابت في كل
   زيارة، فالمستخدم يرى المكتبة وكأنها خمس بطاقات لا أكثر — بينما المكتبة
   تحوي ٨١ بطاقة.

   الحل: خلط حقيقي عند كل تحميل، مع ذاكرة قصيرة (آخر دفعة) حتى لا تتكرر
   نفس البطاقات مرتين متتاليتين. كل الدوال حتمية عند تمرير بذرة، وعشوائية
   عند تركها — وهذا ما يجعلها قابلة للاختبار.
   ═══════════════════════════════════════════════════════════════════════════ */
window.ZadMedia = (function () {
  'use strict';

  var LAST_KEY = 'zad_media_last_batch';

  /* مولد أرقام شبه عشوائي ببذرة (mulberry32) */
  function rng(seed) {
    var a = seed >>> 0;
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function shuffle(list, seed) {
    var out = list.slice();
    var rand = (seed === undefined) ? Math.random : rng(seed);
    for (var i = out.length - 1; i > 0; i--) {
      var j = Math.floor(rand() * (i + 1));
      var tmp = out[i]; out[i] = out[j]; out[j] = tmp;
    }
    return out;
  }

  function videos() {
    return (window.ZAD_VIDEOS || []).filter(function (v) { return v && v.t; });
  }

  function lastBatch() {
    try { return JSON.parse(localStorage.getItem(LAST_KEY) || '[]'); } catch (e) { return []; }
  }

  function remember(ids) {
    try { localStorage.setItem(LAST_KEY, JSON.stringify(ids.slice(0, 40))); } catch (e) {}
  }

  /**
   * عيّنة فيديوهات للمرئيسية.
   * @param {number} n        عدد البطاقات
   * @param {object} [opts]   { seed, prefer: 'yt'|'all', avoidLast: bool, only: 'cat' }
   */
  function pickVideos(n, opts) {
    opts = opts || {};
    var pool = videos();
    if (opts.prefer === 'yt') pool = pool.filter(function (v) { return v.k === 'yt' && v.id; });
    if (opts.only) pool = pool.filter(function (v) { return v.c === opts.only; });
    if (!pool.length) pool = videos();

    if (opts.avoidLast) {
      var seen = lastBatch();
      var fresh = pool.filter(function (v) { return seen.indexOf(v.id || v.t) === -1; });
      if (fresh.length >= n) pool = fresh;
    }

    var out = shuffle(pool, opts.seed).slice(0, n);
    if (opts.remember) remember(out.map(function (v) { return v.id || v.t; }));
    return out;
  }

  /* ── المكتبة الصوتية (بلاي ليستات + إذاعات) ── */
  var LAST_AUDIO = 'zad_media_last_audio';

  function audioPool() {
    return (window.ZAD_AUDIO || []).filter(function (a) { return a && a.t; });
  }

  function lastAudioBatch() {
    try { return JSON.parse(localStorage.getItem(LAST_AUDIO) || '[]'); } catch (e) { return []; }
  }

  /**
   * عيّنة من المكتبة الصوتية — نفس منطق الفيديو:
   * خلط حقيقي + تجنّب آخر دفعة + ضمان حضور كل فئة (minPerKind).
   *
   * مثال: pickAudio(8, { minPerKind: { pl: 2 } }) ⇒ البلاي ليستين دائمًا
   * ظاهرين، و٦ إذاعات متبدّلة، والترتيب النهائي عشوائي في كل مرة.
   */
  function pickAudio(n, opts) {
    opts = opts || {};
    var pool = audioPool();
    if (!pool.length) return [];
    if (opts.only) pool = pool.filter(function (a) { return a.k === opts.only; });
    if (!pool.length) pool = audioPool();

    var seen = opts.avoidLast ? lastAudioBatch() : [];
    var fresh = function (list) { return list.filter(function (a) { return seen.indexOf(a.id) === -1; }); };

    var out = [];

    /* ضمان الحد الأدنى لكل فئة */
    var mins = opts.minPerKind || {};
    Object.keys(mins).forEach(function (kind) {
      var ofKind = pool.filter(function (a) { return a.k === kind; });
      var want = Math.min(mins[kind], ofKind.length);
      var chosen = shuffle(fresh(ofKind), opts.seed).slice(0, want);
      if (chosen.length < want) {
        var fill = shuffle(ofKind, opts.seed).filter(function (a) { return chosen.indexOf(a) === -1; });
        chosen = chosen.concat(fill.slice(0, want - chosen.length));
      }
      chosen.forEach(function (a) { if (out.indexOf(a) === -1) out.push(a); });
    });

    /* الباقي من الكل، مع تفضيل ما لم يظهر في آخر دفعة */
    var restFresh = shuffle(fresh(pool.filter(function (a) { return out.indexOf(a) === -1; })), opts.seed);
    if (restFresh.length < n - out.length) {
      var restAll = shuffle(pool.filter(function (a) { return out.indexOf(a) === -1; }), opts.seed);
      restFresh = restFresh.concat(restAll.filter(function (a) { return restFresh.indexOf(a) === -1; }));
    }

    out = out.concat(restFresh).slice(0, n);
    out = shuffle(out);      /* ترتيب نهائي عشوائي — الحد الأدنى مش شرط يتصدّر */

    if (opts.remember) {
      try { localStorage.setItem(LAST_AUDIO, JSON.stringify(out.map(function (a) { return a.id; }))); } catch (e) {}
    }
    return out;
  }

  function audioStats() {
    var all = audioPool();
    var by = {};
    all.forEach(function (a) { by[a.k] = (by[a.k] || 0) + 1; });
    return { total: all.length, by: by };
  }

  /** كل فيديو يمكن مشاهدته داخل الموقع (له معرّف يوتيوب) */
  function playable() {
    return videos().filter(function (v) { return v.k === 'yt' && v.id; });
  }

  /** بطاقة عشوائية واحدة */
  function randomVideo(excludeId) {
    var pool = playable().filter(function (v) { return v.id !== excludeId; });
    if (!pool.length) pool = playable();
    return pool[Math.floor(Math.random() * pool.length)] || null;
  }

  function byId(id) {
    var hit = videos().filter(function (v) { return v.id === id; });
    return hit.length ? hit[0] : null;
  }

  function stats() {
    var all = videos();
    var yt = all.filter(function (v) { return v.k === 'yt' && v.id; });
    var cats = {};
    all.forEach(function (v) { if (v.c) cats[v.c] = (cats[v.c] || 0) + 1; });
    return { total: all.length, playable: yt.length, external: all.length - yt.length, categories: Object.keys(cats).length, byCat: cats };
  }

  return {
    pickVideos: pickVideos, randomVideo: randomVideo, byId: byId,
    pickAudio: pickAudio, audio: audioPool, audioStats: audioStats,
    playable: playable, videos: videos, shuffle: shuffle, stats: stats
  };
})();
