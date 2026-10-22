/* ═══════════════════════════════════════════════════════════════════════════
   زاد — طبقة بيانات القرآن (محليّة بالكامل)
   ─────────────────────────────────────────────────────────────────────────
   كل نصّ القرآن + التفسير بيتحمّلوا من ملفات ثابتة داخل الموقع، لا API ولا
   شبكة بعد أول تحميل. التخزين ثلاثي الطبقات:

     1) الذاكرة        — فوري داخل الجلسة.
     2) IndexedDB      — يبقى بعد الإغلاق، ويشتغل أوفلاين.
     3) الشبكة/الـSW    — أول تحميل فقط (وSW بيحفظه Cache-First).

   واجهة الاستخدام:
     QuranStore.meta()              → بيانات السور (اسم/نوع/عدد آيات/صفحة/جزء)
     QuranStore.page(n)             → آيات الصفحة n (1..604)
     QuranStore.juz(n)              → آيات الجزء n
     QuranStore.surahMeta(n)        → بيانات سورة
     QuranStore.tafsir(n)           → { intro, a:{ayah:text} }
     QuranStore.searchIndex()       → فهرس البحث الكامل [s,a,p,text]
     QuranStore.download('text'|'tafsir', onProgress)
     QuranStore.stats()             → { juz, tafsir, bytes }
     QuranStore.clear()
   ═══════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var DB_NAME = 'zad_quran';
  var DB_VER = 1;
  var STORES = ['juz', 'tafsir', 'misc'];
  var BASE = 'js/data/';

  var MEM = { juz: new Map(), tafsir: new Map(), misc: new Map() };
  var _db = null, _dbPromise = null, _inflight = new Map();

  /* ── IndexedDB ───────────────────────────────────────────────────────── */
  function openDB() {
    if (_dbPromise) return _dbPromise;
    _dbPromise = new Promise(function (resolve) {
      if (typeof indexedDB === 'undefined') return resolve(null);
      var req;
      try { req = indexedDB.open(DB_NAME, DB_VER); } catch (e) { return resolve(null); }
      req.onupgradeneeded = function () {
        var db = req.result;
        STORES.forEach(function (s) {
          if (!db.objectStoreNames.contains(s)) db.createObjectStore(s);
        });
      };
      req.onsuccess = function () { _db = req.result; resolve(_db); };
      req.onerror = function () { resolve(null); };
      req.onblocked = function () { resolve(null); };
    });
    return _dbPromise;
  }

  function idbGet(store, key) {
    if (MEM[store].has(key)) return Promise.resolve(MEM[store].get(key));
    return openDB().then(function (db) {
      if (!db) return null;
      return new Promise(function (resolve) {
        try {
          var r = db.transaction(store, 'readonly').objectStore(store).get(key);
          r.onsuccess = function () {
            var v = r.result == null ? null : r.result;
            if (v != null) MEM[store].set(key, v);
            resolve(v);
          };
          r.onerror = function () { resolve(null); };
        } catch (e) { resolve(null); }
      });
    });
  }

  function idbPut(store, key, val) {
    MEM[store].set(key, val);
    return openDB().then(function (db) {
      if (!db) return false;
      return new Promise(function (resolve) {
        try {
          var t = db.transaction(store, 'readwrite');
          t.objectStore(store).put(val, key);
          t.oncomplete = function () { resolve(true); };
          t.onerror = function () { resolve(false); };
          t.onabort = function () { resolve(false); };
        } catch (e) { resolve(false); }
      });
    });
  }

  function idbCount(store) {
    return openDB().then(function (db) {
      if (!db) return MEM[store].size;
      return new Promise(function (resolve) {
        try {
          var r = db.transaction(store, 'readonly').objectStore(store).count();
          r.onsuccess = function () { resolve(r.result || 0); };
          r.onerror = function () { resolve(0); };
        } catch (e) { resolve(0); }
      });
    });
  }

  function idbClear(store) {
    MEM[store].clear();
    return openDB().then(function (db) {
      if (!db) return true;
      return new Promise(function (resolve) {
        try {
          var t = db.transaction(store, 'readwrite');
          t.objectStore(store).clear();
          t.oncomplete = function () { resolve(true); };
          t.onerror = function () { resolve(false); };
        } catch (e) { resolve(false); }
      });
    });
  }

  /* ── تحميل JSON ──────────────────────────────────────────────────────── */
  function getJSON(url) {
    if (_inflight.has(url)) return _inflight.get(url);
    var ctl = new AbortController();
    var timer = setTimeout(function () { ctl.abort(); }, 15000);
    var p = fetch(url, { signal: ctl.signal })
      .then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      })
      .finally(function () { clearTimeout(timer); _inflight.delete(url); });
    _inflight.set(url, p);
    return p;
  }

  var _meta = null;
  function meta() {
    if (_meta) return Promise.resolve(_meta);
    return idbGet('misc', 'meta').then(function (cached) {
      if (cached) { _meta = cached; return cached; }
      return getJSON(BASE + 'quran/surahs.json').then(function (m) {
        _meta = m;
        idbPut('misc', 'meta', m);
        return m;
      });
    });
  }

  function juz(n) {
    n = Math.max(1, Math.min(30, parseInt(n, 10) || 1));
    return idbGet('juz', n).then(function (v) {
      if (v) return v;
      return getJSON(BASE + 'quran/juz/' + (n < 10 ? '0' + n : n) + '.json')
        .then(function (d) { idbPut('juz', n, d); return d; });
    });
  }

  function tafsir(s) {
    s = Math.max(1, Math.min(114, parseInt(s, 10) || 1));
    return idbGet('tafsir', s).then(function (v) {
      if (v) return v;
      var key = ('00' + s).slice(-3);
      return getJSON(BASE + 'tafsir/' + key + '.json')
        .then(function (d) { idbPut('tafsir', s, d); return d; });
    });
  }

  function page(n) {
    n = Math.max(1, Math.min(604, parseInt(n, 10) || 1));
    return meta().then(function (m) {
      var j = m.pageJuz[n - 1] || 1;
      return juz(j).then(function (d) {
        var rows = [];
        for (var i = 0; i < d.ayahs.length; i++) {
          if (d.ayahs[i][2] === n) rows.push(d.ayahs[i]);
        }
        return { page: n, juz: j, ayahs: rows, meta: m };
      });
    });
  }

  function surahMeta(n) {
    return meta().then(function (m) { return m.surahs[n - 1]; });
  }

  /* الصفحة اللي فيها آية معيّنة — بدون تحميل فهرس البحث */
  function pageOfAyah(s, a) {
    return meta().then(function (m) {
      var start = (m.surahs[s - 1] || {}).juz || 1;
      var tries = 0;
      function step(j) {
        if (j > 30 || tries > 3) return null;
        tries++;
        return juz(j).then(function (d) {
          for (var i = 0; i < d.ayahs.length; i++) {
            var r = d.ayahs[i];
            if (r[0] === s && r[1] === +a) return r[2];
          }
          return step(j + 1);
        });
      }
      return step(start);
    });
  }

  var _searchIdx = null;
  function searchIndex() {
    if (_searchIdx) return Promise.resolve(_searchIdx);
    return idbGet('misc', 'search').then(function (cached) {
      if (cached) { _searchIdx = cached; return cached; }
      return getJSON(BASE + 'quran/search.json').then(function (arr) {
        _searchIdx = arr;
        /* لا نحفظ ١.٤ م.ب داخل IndexedDB — الملف نفسه يبقى في كاش الـSW */
        return arr;
      });
    });
  }

  /* ── التحميل الكامل ──────────────────────────────────────────────────── */
  function download(kind, onProgress) {
    var total = kind === 'tafsir' ? 114 : 30;
    var done = 0;
    var failed = [];
    var seq = [];
    for (var i = 1; i <= total; i++) seq.push(i);

    function one(n) {
      var p = kind === 'tafsir' ? tafsir(n) : juz(n);
      return p.then(function () {
        done++;
        if (onProgress) onProgress(done, total);
      }).catch(function () {
        failed.push(n);
        done++;
        if (onProgress) onProgress(done, total);
      });
    }

    /* ٣ طلبات متوازية — أسرع من التسلسل وأخفّ من الانفجار */
    return new Promise(function (resolve) {
      var idx = 0, active = 0;
      function pump() {
        while (active < 3 && idx < seq.length) {
          active++;
          one(seq[idx++]).then(function () {
            active--;
            if (idx >= seq.length && active === 0) resolve({ ok: failed.length === 0, failed: failed });
            else pump();
          });
        }
      }
      pump();
    });
  }

  function stats() {
    return Promise.all([idbCount('juz'), idbCount('tafsir'), meta().catch(function () { return null; })]).then(function (r) {
      var juzN = r[0], tafN = r[1], m = r[2];
      var bytes = 0;
      if (m && m.juzBytes) {
        for (var i = 0; i < juzN; i++) bytes += m.juzBytes[i] || 46000;
      }
      return { juz: juzN, tafsir: tafN, bytes: bytes };
    });
  }

  function clear() {
    return Promise.all([idbClear('juz'), idbClear('tafsir')]).then(function () { return true; });
  }

  window.QuranStore = {
    meta: meta,
    page: page,
    juz: juz,
    tafsir: tafsir,
    surahMeta: surahMeta,
    pageOfAyah: pageOfAyah,
    searchIndex: searchIndex,
    download: download,
    stats: stats,
    clear: clear,
    BASE: BASE
  };
})();
