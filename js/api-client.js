/**
 * زاد — API Client  (Z9c)
 *
 * Z9a: health() + index()
 * Z9b: auth.login / auth.me / auth.logout
 * Z9c: worship.push / worship.list
 *
 * القواعد الثابتة:
 *   - credentials: 'include'  على كل request
 *   - cache: 'no-store'       على كل request
 *   - لا Authorization header
 *   - لا credentials مخزّنة هنا
 *   - لا كتابة على zad_v2
 *   - لا window.STATE
 */

'use strict';

(function () {

  var ZAD_API_PREFIX = '/api/v1';
  var TIMEOUT_MS     = 10000;

  /* ── helpers ───────────────────────────────────────────────────────── */

  function fetchWithTimeout(url, opts) {
    return new Promise(function (resolve, reject) {
      var controller = new AbortController();
      var timer = setTimeout(function () {
        controller.abort();
        reject(new Error('timeout'));
      }, TIMEOUT_MS);

      fetch(url, Object.assign({}, opts, {
        signal:      controller.signal,
        credentials: 'include',
        cache:       'no-store'
      }))
        .then(function (r) { clearTimeout(timer); resolve(r); })
        .catch(function (e) { clearTimeout(timer); reject(e); });
    });
  }

  /**
   * safeJsonResponse — يمسك حالات السيرفر رجع non-JSON
   * (nginx 502، HTML error page، إلخ)
   * بدلاً من SyntaxError غير واضح، يرجّع:
   *   { ok: false, status: N, data: null, raw: '<first 200 chars>' }
   */
  function safeJsonResponse(r) {
    return r.text().then(function (text) {
      var data;
      try {
        data = JSON.parse(text);
      } catch (_) {
        return { ok: false, status: r.status, data: null, raw: text.slice(0, 200) };
      }
      return { ok: r.ok, status: r.status, data: data };
    });
  }

  function get(url) {
    return fetchWithTimeout(url, { method: 'GET' }).then(safeJsonResponse);
  }

  function postJson(url, body) {
    return fetchWithTimeout(url, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(body)
    }).then(safeJsonResponse);
  }

  function postNoBody(url) {
    return fetchWithTimeout(url, { method: 'POST' }).then(safeJsonResponse);
  }

  /* ── public API ─────────────────────────────────────────────────────── */

  window.ZadAPI = {

    /* Z9a */
    health: function () {
      return get('/health/ready');
    },

    index: function () {
      return get(ZAD_API_PREFIX);
    },

    /* Z9b */
    auth: {
      login: function (email, password) {
        return postJson(ZAD_API_PREFIX + '/auth/login', { email: email, password: password });
      },
      me: function () {
        return get(ZAD_API_PREFIX + '/auth/me');
      },
      register: async function (email, password) {
      try {
        const res = await fetch('/api/v1/auth/register', {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          cache:       'no-store',
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json().catch(() => ({}));

        if (res.status === 201) {
          return { ok: true, userId: data.userId, email: data.email };
        }
        if (res.status === 409) {
          return { ok: false, code: 'EMAIL_EXISTS' };
        }
        if (res.status === 422) {
          return { ok: false, code: 'VALIDATION_ERROR', detail: data.detail || '' };
        }
        return { ok: false, code: 'SERVER_ERROR', status: res.status };

      } catch (err) {
        return { ok: false, code: 'NETWORK_ERROR', detail: String(err) };
      }
    },
    register: async function (email, password) {
      try {
        const res = await fetch('/api/v1/auth/register', {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          cache:       'no-store',
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json().catch(() => ({}));

        if (res.status === 201) {
          return { ok: true, userId: data.userId, email: data.email };
        }
        if (res.status === 409) {
          return { ok: false, code: 'EMAIL_EXISTS' };
        }
        if (res.status === 422) {
          return { ok: false, code: 'VALIDATION_ERROR', detail: data.detail || '' };
        }
        return { ok: false, code: 'SERVER_ERROR', status: res.status };

      } catch (err) {
        return { ok: false, code: 'NETWORK_ERROR', detail: String(err) };
      }
    },
    logout: function () {
        return postNoBody(ZAD_API_PREFIX + '/auth/logout');
      }
    },

    /* Z9c — worship sync */
    worship: {
      /**
       * push — ترسل سجل عبادة ليوم معين
       * @param {string}  log_date          "YYYY-MM-DD"
       * @param {object}  payload           { worship, streak, takbeer_total, history_today? }
       * @param {string}  [idempotency_key] اختياري
       */
      push: function (log_date, payload, idempotency_key) {
        var body = { log_date: log_date, payload: payload };
        if (idempotency_key) { body.idempotency_key = idempotency_key; }
        return postJson(ZAD_API_PREFIX + '/worship/logs', body);
      },

      /**
       * list — تجيب كل سجلات المستخدم المصادق
       */
      list: function () {
        return get(ZAD_API_PREFIX + '/worship/logs');
      }
    }
  };

})();
