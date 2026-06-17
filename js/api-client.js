/* ════════════════════════════════════════════════════════════
   زاد — API Client  (Z9b)
   js/api-client.js

   window.ZadAPI surface:
     Z9a: health()  → GET /health/ready
          index()   → GET /api/v1
     Z9b: auth.login(email, password) → POST /api/v1/auth/login
          auth.me()                   → GET  /api/v1/auth/me
          auth.logout()               → POST /api/v1/auth/logout

   Worship → Z9c (لم تُضَف بعد)
   Sync    → Z9d (لم تُضَف بعد)

   قواعد ثابتة:
   • credentials: 'include' على كل request
   • cache: 'no-store' على كل request
   • لا يقرأ zad_v2 ولا يكتب عليه
   • لا يعتمد على window.STATE
   • لا يلمس Firebase
   • لا Authorization header
   • لا credentials محفوظة
   • كل الـ errors تُرجَع كـ {ok:false, status, error, data:null}
   ════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  var ZAD_API_PREFIX  = '/api/v1';
  var ZAD_HEALTH_URL  = '/health/ready';
  var ZAD_API_TIMEOUT = 8000;

  /* ── fetch مع AbortController timeout ── */
  function fetchWithTimeout(url, options, ms) {
    var ctrl  = typeof AbortController !== 'undefined' ? new AbortController() : null;
    var timer = ctrl ? setTimeout(function () { ctrl.abort(); }, ms) : null;
    var opts  = ctrl ? Object.assign({}, options, { signal: ctrl.signal }) : options;

    return fetch(url, opts).then(
      function (res) { if (timer) clearTimeout(timer); return res; },
      function (err) { if (timer) clearTimeout(timer); throw err; }
    );
  }

  /* ── نتيجة موحّدة من الـ Response ── */
  function parseResponse(res) {
    return res.json()
      .then(function (data) { return { ok: res.ok, status: res.status, data: data }; })
      .catch(function ()   { return { ok: res.ok, status: res.status, data: null }; });
  }

  /* ── معالجة الـ network errors ── */
  function handleError(err) {
    var msg = err && err.name === 'AbortError' ? 'timeout' : (err && err.message) || 'network-error';
    return { ok: false, status: 0, error: msg, data: null };
  }

  /* ── GET ── */
  function get(url) {
    return fetchWithTimeout(
      url,
      { method: 'GET', credentials: 'include', cache: 'no-store' },
      ZAD_API_TIMEOUT
    )
      .then(parseResponse)
      .catch(handleError);
  }

  /* ── POST JSON — login only ── */
  function postJson(url, body) {
    return fetchWithTimeout(
      url,
      {
        method: 'POST',
        credentials: 'include',
        cache: 'no-store',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      },
      ZAD_API_TIMEOUT
    )
      .then(parseResponse)
      .catch(handleError);
  }

  /* ── POST بدون body — logout ── */
  function postNoBody(url) {
    return fetchWithTimeout(
      url,
      {
        method: 'POST',
        credentials: 'include',
        cache: 'no-store'
      },
      ZAD_API_TIMEOUT
    )
      .then(parseResponse)
      .catch(handleError);
  }

  /* ── Public API ── */
  window.ZadAPI = {

    /* Z9a */
    health: function () { return get(ZAD_HEALTH_URL); },
    index:  function () { return get(ZAD_API_PREFIX); },

    /* Z9b */
    auth: {
      login:  function (email, password) {
        return postJson(ZAD_API_PREFIX + '/auth/login', { email: email, password: password });
      },
      me:     function () { return get(ZAD_API_PREFIX + '/auth/me');     },
      logout: function () { return postNoBody(ZAD_API_PREFIX + '/auth/logout'); },
    },

    /* Worship → Z9c */
    /* Sync    → Z9d */
  };

})();
