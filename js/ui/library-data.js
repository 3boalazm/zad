/* ═══════════════════════════════════════════════════════════════════════════
   زاد — طبقة بيانات المكتبة النصية
   ─────────────────────────────────────────────────────────────────────────
   المصدر: موسوعة الأحاديث النبوية المترجمة (HadeethEnc.com) — واجهة عامة
   بلا مفتاح ولا تسجيل. ثلاث طبقات بالترتيب:

     ١) `/api/v1/library/...`  — وسيط داخل نفس النطاق: لا CORS، ويُخزَّن على
        حافة الشبكة فيصل أسرع ويعمل حين تحجب الشبكة الطرفية المواقعَ الخارجية.
     ٢) `https://hadeethenc.com/api/v1/...` مباشرة — إن لم يكن الوسيط منشورًا.
     ٣) البذرة المحلية (js/data/maktaba.js) — ١٥٠ حديثًا تعمل بلا إنترنت إطلاقًا.

   ولا تُعرض واجهة فارغة أبدًا: إن فشل كل شيء تظهر البذرة مع تنبيه صريح.
   ═══════════════════════════════════════════════════════════════════════════ */
window.ZadLibrary = (function () {
  'use strict';

  var SEED = (window.ZAD_MAKTABA || { tree: [], seed: [] });
  var API_SAME = '/api/v1/library';
  var API_DOOR = 'https://hadeethenc.com/api/v1';
  var TIMEOUT = 9000;
  var CACHE_KEY = 'zad_lib_cache_v1';

  var state = { online: null, source: 'seed', lastError: '' };

  /* ── أدوات ───────────────────────────────────────────────────────────── */

  function timeout(ms) {
    var ctrl = new AbortController();
    var t = setTimeout(function () { ctrl.abort(); }, ms);
    return { signal: ctrl.signal, done: function () { clearTimeout(t); } };
  }

  function getJSON(url) {
    var guard = timeout(TIMEOUT);
    return fetch(url, { signal: guard.signal, headers: { Accept: 'application/json' } })
      .then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      })
      .finally(guard.done);
  }

  /* الذاكرة القصيرة: أقل طلبات وأسرع تنقّل */
  var mem = {};
  function memo(key, producer) {
    if (mem[key]) return Promise.resolve(mem[key]);
    return producer().then(function (v) { mem[key] = v; return v; });
  }

  /* ── الأقسام ─────────────────────────────────────────────────────────── */
  function roots() { return SEED.tree || []; }

  function subcategories(rootId) {
    var r = roots().filter(function (x) { return String(x.id) === String(rootId); })[0];
    return r ? r.k : [];
  }

  function categoryName(id) {
    var all = [];
    roots().forEach(function (r) { all.push({ id: r.id, t: r.t }); r.k.forEach(function (k) { all.push(k); }); });
    var hit = all.filter(function (c) { return String(c.id) === String(id); })[0];
    return hit ? hit.t : '';
  }

  function counts() {
    return {
      hadiths: roots().reduce(function (s, r) { return s + (r.n || 0); }, 0),
      categories: roots().length,
      subcategories: roots().reduce(function (s, r) { return s + r.k.length; }, 0),
      seed: (SEED.seed || []).length
    };
  }

  /* ── الأحاديث ─────────────────────────────────────────────────────────── */
  function normalise(h) {
    return {
      id: String(h.id != null ? h.id : h.i),
      title: h.title || h.t || '',
      text: h.hadeeth || h.h || '',
      intro: h.hadeeth_intro || '',
      attribution: h.attribution || h.a || '',
      grade: h.grade || h.g || '',
      explanation: h.explanation || h.e || '',
      hints: h.hints || [],
      words: h.words_meanings || [],
      reference: h.reference || h.r || '',
      categories: (h.categories || h.c || []).map(String),
      roots: (h.rt || []).map(String)
    };
  }

  /**
   * البذرة المحلية لِقسم.
   * الباب الرئيسي يُطابَق بأصول الحديث (rt) لا بأرقام أبوابه الفرعية،
   * حتى يعمل التصفّح بلا إنترنت في كل الأبواب السبعة.
   */
  function seedFor(categoryId) {
    var all = (SEED.seed || []).map(normalise);
    if (!categoryId || categoryId === 'all') return all;
    var id = String(categoryId);
    var isRoot = roots().some(function (r) { return String(r.id) === id; });
    if (isRoot) return all.filter(function (h) { return h.roots.indexOf(id) !== -1; });
    return all.filter(function (h) { return h.categories.indexOf(id) !== -1; });
  }

  /**
   * قائمة أحاديث قسم. تعيد { items, page, hasMore, source }.
   */
  function list(categoryId, page, perPage) {
    page = page || 1;
    perPage = perPage || 20;
    var key = 'list:' + (categoryId || 'all') + ':' + page + ':' + perPage;
    if (mem[key]) return Promise.resolve(mem[key]);

    var direct = API_DOOR + '/hadeeths/list/?language=ar&category_id=' + encodeURIComponent(categoryId)
               + '&page=' + page + '&per_page=' + perPage;
    var same = API_SAME + '/hadiths?category_id=' + encodeURIComponent(categoryId)
             + '&page=' + page + '&per_page=' + perPage;

    return getJSON(same).catch(function () { return getJSON(direct); })
      .then(function (res) {
        var rows = (res && (res.data || res.items)) || [];
        if (!Array.isArray(rows) || !rows.length) throw new Error('empty');
        /* قائمة HadeethEnc تعيد {id,title} فقط — النص الكامل يأتي من /hadiths/:id.
           لذلك نُكمل فورًا أي عنصر موجود في البذرة، والباقي يُحمَّل عند ظهوره. */
        var items = rows.map(normalise).map(function (h) {
          if (h.text) return h;
          var s = seedFor().filter(function (x) { return x.id === h.id; })[0];
          return s ? Object.assign({}, s, { title: h.title || s.title }) : h;
        });
        state.online = true; state.source = 'api';
        var meta = (res && res.meta) || {};
        var last = Number(meta.last_page || 0);
        var out = {
          items: items, page: page, source: 'api',
          total: Number(meta.total_items || 0) || undefined,
          hasMore: last ? page < last : items.length >= perPage
        };
        mem[key] = out;
        return out;
      })
      .catch(function (err) {
        state.online = false; state.lastError = String(err && err.message || err);
        /* السقوط إلى البذرة — مع ترقيم محلي حتى يبقى «المزيد» صادقًا */
        var all = seedFor(categoryId);
        var start = (page - 1) * perPage;
        var slice = all.slice(start, start + perPage);
        return { items: slice, page: page, source: 'seed', hasMore: start + perPage < all.length, total: all.length };
      });
  }

  /** حديث واحد بتفصيله */
  function one(id) {
    var key = 'one:' + id;
    if (mem[key]) return Promise.resolve(mem[key]);

    var local = seedFor().filter(function (h) { return h.id === String(id); })[0];
    var same = API_SAME + '/hadiths/' + encodeURIComponent(id);
    var direct = API_DOOR + '/hadeeths/one/?language=ar&id=' + encodeURIComponent(id);

    return getJSON(same).catch(function () { return getJSON(direct); })
      .then(function (res) {
        var h = normalise((res && (res.data || res)) || {});
        if (!h.text) throw new Error('empty');
        if (local && local.hints && local.hints.length && (!h.hints || !h.hints.length)) h.hints = local.hints;
        state.online = true; state.source = 'api';
        mem[key] = h;
        return h;
      })
      .catch(function () {
        if (!local) throw new Error('not-found');
        state.online = false; state.source = 'seed';
        mem[key] = local;
        return local;
      });
  }

  /** بحث نصّي في البذرة (يعمل أوفلاين) */
  function search(query, limit) {
    var q = String(query || '').trim();
    if (!q) return [];
    limit = limit || 30;
    var words = q.split(/\s+/).filter(Boolean);
    var hay = function (h) {
      return (h.title + ' ' + h.text + ' ' + h.explanation + ' ' + h.grade + ' ' + h.attribution).toLowerCase();
    };
    return seedFor().map(function (h) {
      var t = hay(h), score = 0;
      words.forEach(function (w) {
        var n = t.split(w.toLowerCase()).length - 1;
        score += n;
        if (h.title.toLowerCase().indexOf(w.toLowerCase()) !== -1) score += 4;
      });
      return { h: h, score: score };
    }).filter(function (x) { return x.score > 0; })
      .sort(function (a, b) { return b.score - a.score; })
      .slice(0, limit)
      .map(function (x) { return x.h; });
  }

  /* ── متابعة القراءة ──────────────────────────────────────────────────── */
  var READ_KEY = 'zad_lib_read';
  var BOOKMARK_KEY = 'zad_lib_bookmarks';

  function lastRead() {
    try { return JSON.parse(localStorage.getItem(READ_KEY) || 'null'); } catch (e) { return null; }
  }
  function markRead(item) {
    try {
      localStorage.setItem(READ_KEY, JSON.stringify({ id: item.id, title: item.title, at: Date.now() }));
    } catch (e) {}
  }
  function bookmarks() {
    try { return JSON.parse(localStorage.getItem(BOOKMARK_KEY) || '[]'); } catch (e) { return []; }
  }
  function isBookmarked(id) {
    return bookmarks().some(function (b) { return b.id === String(id); });
  }
  function toggleBookmark(item) {
    var list = bookmarks();
    var i = list.findIndex(function (b) { return b.id === String(item.id); });
    if (i === -1) list.unshift({ id: String(item.id), title: item.title, text: item.text, at: Date.now() });
    else list.splice(i, 1);
    try { localStorage.setItem(BOOKMARK_KEY, JSON.stringify(list.slice(0, 200))); } catch (e) {}
    return i === -1;
  }

  /**
   * فحص سريع للمصدر: طلب واحد صغير يحدّد ما إذا كانت الموسوعة متاحة،
   * حتى تعرف الواجهة ماذا تعرض في شارة الحالة قبل أن يفتح المستخدم أي باب.
   */
  function probe() {
    if (state.online !== null) return Promise.resolve(state.online);
    /* المتصفح يعرف أنه أوفلاين: لا داعي لانتظار مهلة الشبكة */
    if (typeof navigator !== 'undefined' && navigator.onLine === false) {
      state.online = false;
      return Promise.resolve(false);
    }
    var same = API_SAME + '/hadiths?category_id=1&page=1&per_page=1';
    var direct = API_DOOR + '/hadeeths/list/?language=ar&category_id=1&page=1&per_page=1';
    return getJSON(same).catch(function () { return getJSON(direct); })
      .then(function () { state.online = true; state.source = 'api'; return true; })
      .catch(function (err) { state.online = false; state.lastError = String(err && err.message || err); return false; });
  }

  function reset() { state.online = null; state.lastError = ''; }

  /** نسخة مختصرة للتصدير/الاختبار */
  function apiInfo() {
    return { same: API_SAME, direct: API_DOOR, timeout: TIMEOUT, cacheKey: CACHE_KEY };
  }

  return {
    roots: roots, subcategories: subcategories, categoryName: categoryName, counts: counts,
    list: list, one: one, search: search, seed: function () { return seedFor(); },
    lastRead: lastRead, markRead: markRead, bookmarks: bookmarks, isBookmarked: isBookmarked, toggleBookmark: toggleBookmark,
    state: state, apiInfo: apiInfo, normalise: normalise, probe: probe, reset: reset
  };
})();
