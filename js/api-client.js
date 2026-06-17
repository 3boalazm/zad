/* ════════════════════════════════════════════════════════════
   زاد — API Client  (Z9a)
   js/api-client.js

   Z9a scope: connectivity فقط.
   window.ZadAPI يكشف health() و index() حصراً.

   Auth    → Z9b (لم تُضَف بعد)
   Worship → Z9c (لم تُضَف بعد)
   Sync    → Z9d (لم تُضَف بعد)

   قواعد ثابتة:
   • لا يقرأ zad_v2 ولا يكتب عليه
   • لا يعتمد على window.STATE
   • لا يلمس Firebase
   • credentials: 'include' دائماً
   • كل الـ errors تُرجَع كـ {ok:false, error, status, data:null}
   ════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  var ZAD_API_PREFIX  = '/api/v1';
  var ZAD_HEALTH_URL  = '/health/ready';
  var ZAD_API_TIMEOUT = 8000;

  function fetchWithTimeout(url, options, ms) {
    var ctrl  = typeof AbortController !== 'undefined' ? new AbortController() : null;
    var timer = ctrl ? setTimeout(function () { ctrl.abort(); }, ms) : null;
    var opts  = ctrl ? Object.assign({}, options, { signal: ctrl.signal }) : options;

    return fetch(url, opts).then(
      function (res) { if (timer) clearTimeout(timer); return res; },
      function (err) { if (timer) clearTimeout(timer); throw err; }
    );
  }

  function get(url) {
    return fetchWithTimeout(
      url,
      { method: 'GET', credentials: 'include', cache: 'no-store' },
      ZAD_API_TIMEOUT
    )
      .then(function (res) {
        return res.json()
          .then(function (data) { return { ok: res.ok, status: res.status, data: data }; })
          .catch(function ()   { return { ok: res.ok, status: res.status, data: null }; });
      })
      .catch(function (err) {
        var msg = err && err.name === 'AbortError' ? 'timeout' : (err && err.message) || 'network-error';
        return { ok: false, status: 0, error: msg, data: null };
      });
  }

  window.ZadAPI = {
    health: function () { return get(ZAD_HEALTH_URL);  },
    index:  function () { return get(ZAD_API_PREFIX); },
  };

})();
