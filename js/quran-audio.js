/* ═══════════════════════════════════════════════════════════════════════
   زاد · محرّك التلاوة
   ─────────────────────────────────────────────────────────────────────
   • تلاوة آية/آية مع تشغيل متصل وتكرار.
   • مصدران بالتتابع: everyayah.com ثم cdn.islamic.network (لو الأول وقع).
   • الكاش: كل آية تُشغَّل تُحفظ في Cache API، فتُعاد بلا إنترنت.
   • بلا مكتبات، بلا مفاتيح، بلا تتبّع.
   ═══════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var CACHE = 'zad-quran-audio-v1';
  var RKEY = 'zad_quran_reciter';

  var RECITERS = [
    { id: 'alafasy', name: 'مشاري العفاسي', ev: 'Alafasy_128kbps', ic: 'ar.alafasy' },
    { id: 'husary', name: 'محمود خليل الحصري', ev: 'Husary_128kbps', ic: 'ar.husary' },
    { id: 'minshawy', name: 'المنشاوي · مرتّل', ev: 'Minshawy_Murattal_128kbps', ic: 'ar.minshawy_murattal' },
    { id: 'basit', name: 'عبد الباسط · مرتّل', ev: 'Abdul_Basit_Murattal_192kbps', ic: 'ar.abdulbasitmurattal' },
    { id: 'sudais', name: 'عبد الرحمن السديس', ev: 'Abdurrahmaan_As-Sudais_192kbps', ic: 'ar.abdurrahmaansudais' },
    { id: 'shaatree', name: 'أبو بكر الشاطري', ev: 'Abu_Bakr_Ash-Shaatree_128kbps', ic: 'ar.shaatree' }
  ];

  var el = null, blobURL = null, cachedSrc = '';
  var st = {
    rec: localStorage.getItem(RKEY) || 'alafasy',
    loop: false,
    list: [],
    i: -1,
    playing: false,
    loading: false,
    srcIdx: 0,
    offsets: null,
    cur: '',
    active: false
  };
  var cbs = {};
  function emit(k, v) { if (cbs[k]) { try { cbs[k](v); } catch (e) {} } }

  function reciter() {
    for (var i = 0; i < RECITERS.length; i++) if (RECITERS[i].id === st.rec) return RECITERS[i];
    return RECITERS[0];
  }
  function pad(n) { return ('00' + n).slice(-3); }
  function globalAyah(s, a) {
    if (!st.offsets) return 0;
    var off = st.offsets[s - 1];
    return off ? off + a : 0;
  }
  function urls(s, a) {
    var r = reciter(), out = [];
    out.push('https://everyayah.com/data/' + r.ev + '/' + pad(s) + pad(a) + '.mp3');
    var g = globalAyah(s, a);
    if (g) out.push('https://cdn.islamic.network/quran/audio/128/' + r.ic + '/' + g + '.mp3');
    return out;
  }
  function openCache() {
    return (window.caches ? caches.open(CACHE) : Promise.reject(new Error('no-cache')));
  }

  function ensureEl() {
    if (el) return el;
    el = document.createElement('audio');
    el.preload = 'none';
    el.setAttribute('playsinline', '');
    el.addEventListener('playing', function () { st.playing = true; st.loading = false; emit('state', api()); });
    el.addEventListener('pause', function () { st.playing = false; emit('state', api()); });
    el.addEventListener('waiting', function () { st.loading = true; emit('state', api()); });
    el.addEventListener('timeupdate', function () {
      if (el.duration) emit('progress', el.currentTime / el.duration);
    });
    el.addEventListener('ended', function () { onEnded(); });
    el.addEventListener('error', function () { onError(); });
    document.body.appendChild(el);
    return el;
  }

  function playURL(url) {
    var a = ensureEl();
    if (blobURL) { try { URL.revokeObjectURL(blobURL); } catch (e) {} blobURL = null; }
    a.src = url;
    st.cur = url;
    st.loading = true;
    emit('state', api());
    var p = a.play();
    if (p && p.catch) p.catch(function () { st.loading = false; st.playing = false; emit('state', api()); });
  }

  function loadAt(i, opts) {
    if (!st.list.length) return stop();
    if (i < 0) i = 0;
    if (i >= st.list.length) i = st.list.length - 1;
    st.i = i;
    var item = st.list[i];
    st.loading = true;
    emit('state', api());
    emit('ayah', { s: item[0], a: item[1], index: i, list: st.list });
    if (opts && opts.fromCacheOnly) { /* noop — kept for API symmetry */ }

    /* نمرّر الرابط كما هو: الـService Worker هو اللي يخدمه من الكاش لو
       محفوظ، وإلا من الشبكة. لا نحوّله لـblob لأن الاستجابة قد تكون opaque. */
    var list = urls(item[0], item[1]);
    var picked = list[Math.min(st.srcIdx, list.length - 1)];
    playURL(picked);
  }

  function onError() {
    var item = st.list[st.i];
    if (item) {
      var list = urls(item[0], item[1]);
      if (st.srcIdx < list.length - 1) {
        st.srcIdx += 1;
        loadAt(st.i);
        return;
      }
    }
    st.playing = false; st.loading = false;
    emit('state', api());
    emit('error', { s: item && item[0], a: item && item[1] });
  }

  function onEnded() {
    if (st.loop) { loadAt(st.i); return; }
    if (st.i + 1 < st.list.length) { loadAt(st.i + 1); return; }
    st.playing = false;
    emit('state', api());
    emit('end', {});
  }

  function api() {
    var item = st.list[st.i] || null;
    return {
      reciter: st.rec,
      reciterName: reciter().name,
      playing: st.playing,
      loading: st.loading,
      loop: st.loop,
      s: item ? item[0] : 0,
      a: item ? item[1] : 0,
      index: st.i,
      count: st.list.length,
      active: st.active
    };
  }

  function play(s, a, list) {
    st.active = true;
    if (list && list.length) st.list = list.slice();
    else st.list = [[s, a]];
    var idx = 0;
    for (var i = 0; i < st.list.length; i++) if (st.list[i][0] === s && st.list[i][1] === a) { idx = i; break; }
    st.srcIdx = 0;
    loadAt(idx);
  }

  function playList(list) {
    if (!list || !list.length) return;
    st.active = true;
    st.list = list.slice();
    st.srcIdx = 0;
    loadAt(0);
  }

  function toggle() {
    if (!el || !el.src) { if (st.list.length) loadAt(Math.max(st.i, 0)); return; }
    if (el.paused) { var p = el.play(); if (p && p.catch) p.catch(function () {}); }
    else el.pause();
  }

  function next() { if (st.i + 1 < st.list.length) loadAt(st.i + 1); }
  function prev() { if (st.i > 0) loadAt(st.i - 1); }

  function stop() {
    if (el) { try { el.pause(); } catch (e) {} el.removeAttribute('src'); try { el.load(); } catch (e) {} }
    if (blobURL) { try { URL.revokeObjectURL(blobURL); } catch (e) {} blobURL = null; }
    st.playing = false; st.loading = false; st.cur = ''; st.active = false;
    emit('state', api());
  }

  function setLoop(v) { st.loop = !!v; emit('state', api()); }
  function setReciter(id) {
    for (var i = 0; i < RECITERS.length; i++) if (RECITERS[i].id === id) {
      st.rec = id;
      try { localStorage.setItem(RKEY, id); } catch (e) {}
      st.srcIdx = 0; cachedSrc = '';
      var cur = st.list[st.i];
      if (cur) loadAt(st.i);
      emit('state', api());
      return true;
    }
    return false;
  }
  function setMeta(meta) {
    if (!meta || !meta.surahs) return;
    var off = 0;
    st.offsets = meta.surahs.map(function (s) { var o = off; off += s.ayahs; return o; });
  }

  /* يحمّل صوت مجموعة آيات للاستماع بلا إنترنت — عبر الـService Worker
     (الوسم الصوتي لا يحتاج CORS، بينما fetch من الصفحة يحتاجه). */
  function cacheList(list, onProgress) {
    var sw = navigator.serviceWorker;
    if (!sw || !sw.controller) return Promise.resolve({ ok: 0, failed: list, noSW: true });

    var urlsList = list.map(function (it) { return urls(it[0], it[1])[0]; });
    return new Promise(function (resolve) {
      var settled = false;
      var timer = setTimeout(function () { finish({ ok: 0, failed: list, timeout: true }); }, 120000);

      function onMsg(e) {
        var d = e.data || {};
        if (d.type === 'cache-audio-progress') { if (onProgress) onProgress(d.done, d.total); return; }
        if (d.type !== 'cache-audio-done') return;
        finish({ ok: d.ok || 0, failed: list.slice(d.ok || 0) });
      }
      function finish(res) {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        sw.removeEventListener('message', onMsg);
        resolve(res);
      }
      sw.addEventListener('message', onMsg);
      sw.controller.postMessage({ type: 'cache-audio', urls: urlsList });
      if (onProgress) onProgress(0, urlsList.length);
    });
  }

  function stats() {
    if (!window.caches) return Promise.resolve({ count: 0, bytes: 0 });
    return caches.open(CACHE).then(function (c) {
      return c.keys().then(function (keys) {
        return Promise.all(keys.map(function (k) {
          return c.match(k).then(function (r) { return r ? r.blob() : null; })
            .then(function (b) { return b ? b.size : 0; })
            .catch(function () { return 0; });
        })).then(function (sizes) {
          return { count: keys.length, bytes: sizes.reduce(function (a, b) { return a + b; }, 0) };
        });
      });
    }).catch(function () { return { count: 0, bytes: 0 }; });
  }

  function clear() {
    if (!window.caches) return Promise.resolve(false);
    return caches.delete(CACHE).then(function () { return true; }, function () { return false; });
  }

  window.QuranAudio = {
    RECITERS: RECITERS,
    /* يقبل {onState,onAyah,onProgress,onEnd,onError} أو أسماء الأحداث مباشرة
       ({state,ayah,...}) — القديم كان يخزّن onState ثم يبحث عن state فلا يعمل. */
    init: function (callbacks) {
      cbs = {};
      if (callbacks) {
        for (var k in callbacks) {
          if (typeof callbacks[k] !== 'function') continue;
          cbs[k.indexOf('on') === 0 ? k.slice(2).toLowerCase() : k] = callbacks[k];
        }
      }
      ensureEl();
      emit('state', api());
      return api();
    },
    state: api,
    play: play,
    playList: playList,
    toggle: toggle,
    next: next,
    prev: prev,
    stop: stop,
    setLoop: setLoop,
    setReciter: setReciter,
    setMeta: setMeta,
    cacheList: cacheList,
    stats: stats,
    clear: clear,
    current: function () { return st.list[st.i] || null; },
    isPlaying: function () { return !!(el && !el.paused && el.src); }
  };
})();
