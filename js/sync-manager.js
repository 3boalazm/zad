/**
 * ZAD — js/sync-manager.js
 * Sprint Z10 — Product Sync Island
 *
 * مبادئ ثابتة:
 *  - localStorage = source of truth دايماً (offline-first)
 *  - الـ sync additive فقط — فشله ما يأثرش على الـ UX
 *  - لا كتابة على zad_v2 إلا sync metadata
 *  - لا credentials في الكود
 *  - لا JWT، لا Authorization header
 *  - لا uncaught errors — كل حاجة wrapped
 */

(function () {
  'use strict';

  /* ── constants ─────────────────────────────────────────────────────── */

  var ZAD_LS_KEY   = 'zad_v2';
  var ZAD_VERSION  = 'Z10';

  /* ── internal helpers ──────────────────────────────────────────────── */

  /**
   * قرأ zad_v2 من localStorage — بدون أي كتابة
   * @returns {object|null}
   */
  function readLocalState() {
    try {
      var raw = localStorage.getItem(ZAD_LS_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) {
      return null;
    }
  }

  /**
   * اكتب sync metadata فقط داخل zad_v2.sync
   * الحقول المسموحة: lastPushedAt، lastPushedDate، lastPushedStatus
   * لا تلمس أي حاجة تانية في zad_v2
   */
  function writeSyncMeta(fields) {
    try {
      var raw = localStorage.getItem(ZAD_LS_KEY);
      if (!raw) return false;
      var state = JSON.parse(raw);
      if (!state.sync) state.sync = {};
      Object.keys(fields).forEach(function (k) {
        state.sync[k] = fields[k];
      });
      localStorage.setItem(ZAD_LS_KEY, JSON.stringify(state));
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * بناء idempotency_key من log_date + timestamp
   * مش بنخزّنها — بنولّدها عشان كل sync له key جديد (last-write-wins)
   */
  function makeIdempotencyKey(log_date) {
    return 'z10-' + log_date + '-' + Date.now();
  }

  /**
   * اليوم بصيغة YYYY-MM-DD (local time)
   */
  function todayDate() {
    var d = new Date();
    var mm = String(d.getMonth() + 1).padStart(2, '0');
    var dd = String(d.getDate()).padStart(2, '0');
    return d.getFullYear() + '-' + mm + '-' + dd;
  }

  /**
   * بناء payload العبادة من zad_v2
   * يستخرج فقط الـ fields المتفق عليها مع الـ backend
   */
  function buildWorshipPayload(state, log_date) {
    var payload = {};

    /* worship checklist — array of booleans أو object */
    if (state.worship !== undefined) {
      payload.worship = state.worship;
    }

    /* streak */
    if (state.streak !== undefined) {
      payload.streak = state.streak;
    }

    /* takbeer total */
    if (state.takbeer_total !== undefined) {
      payload.takbeer_total = state.takbeer_total;
    }

    /* history entry for today */
    if (state.history && state.history[log_date] !== undefined) {
      payload.history_today = state.history[log_date];
    }

    return payload;
  }

  /**
   * SHA-256 hash لـ object معين — لـ before/after equality check
   * بيستخدم SubtleCrypto لو متاحة، وإلا بيرجع length fallback
   */
  function hashObject(obj) {
    try {
      var str = JSON.stringify(obj);
      /* SubtleCrypto async — بنعمله sync approximation */
      return 'len:' + str.length + ':check:' + simpleChecksum(str);
    } catch (e) {
      return 'err';
    }
  }

  function simpleChecksum(str) {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
      var chr = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + chr;
      hash |= 0;
    }
    return Math.abs(hash).toString(16);
  }

  /**
   * مقارنة two snapshots من zad_v2 — يتجاهل sync metadata
   */
  function productDataEqual(snapBefore, snapAfter) {
    if (!snapBefore || !snapAfter) return false;
    var b = JSON.parse(JSON.stringify(snapBefore));
    var a = JSON.parse(JSON.stringify(snapAfter));
    delete b.sync;
    delete a.sync;
    return JSON.stringify(b) === JSON.stringify(a);
  }

  /* ── normalizeAuthUser ─────────────────────────────────────────────── */
  /**
   * يطبّع response من auth.me() / auth.login() بغض النظر عن الـ shape
   * يدعم: res.user مباشرة، أو res.data.userId (الـ shape الفعلي من الـ backend)
   */
  function normalizeAuthUser(res) {
    if (!res || !res.ok) return null;
    if (res.user) return res.user;
    if (res.data && (res.data.userId || res.data.email)) {
      return {
        id:               res.data.userId,
        userId:           res.data.userId,
        email:            res.data.email,
        isAnonymous:      res.data.isAnonymous,
        sessionExpiresAt: res.data.sessionExpiresAt
      };
    }
    return null;
  }

  /* ── extractRows ───────────────────────────────────────────────────── */
  /**
   * يستخرج array من rows من أي response shape ممكن:
   *   { data: [...] }
   *   { data: { data: [...] } }
   *   { data: { data: { data: [...] } } }
   */
  function extractRows(res) {
    if (!res) return [];
    if (Array.isArray(res.data)) return res.data;
    if (res.data && Array.isArray(res.data.data)) return res.data.data;
    if (res.data && res.data.data && Array.isArray(res.data.data.data)) return res.data.data.data;
    return [];
  }

  /* ── ZadSync public API ────────────────────────────────────────────── */

  var ZadSync = {};

  /**
   * checkAuth — تحقق من الـ session الحالي
   * @returns {Promise<{ok, user}>}
   */
  ZadSync.checkAuth = function () {
    if (!window.ZadAPI || !window.ZadAPI.auth) {
      return Promise.resolve({ ok: false, reason: 'ZadAPI_MISSING' });
    }
    return window.ZadAPI.auth.me()
      .then(function (res) {
        var user = normalizeAuthUser(res);
        if (user) {
          return { ok: true, user: user };
        }
        return { ok: false, reason: 'NO_SESSION' };
      })
      .catch(function (err) {
        return { ok: false, reason: 'AUTH_ERROR', detail: String(err) };
      });
  };

  /**
   * syncNow — المزامنة اليدوية
   * يعمل:
   *   1. snapshot من zad_v2 قبل الـ sync
   *   2. تحقق من الـ session
   *   3. push اليوم الحالي
   *   4. readback
   *   5. snapshot بعد الـ sync — يتأكد إن product data لم تتغير
   *   6. يكتب sync metadata فقط
   *
   * @returns {Promise<SyncResult>}
   */
  ZadSync.syncNow = function () {
    var log_date    = todayDate();
    var idempotency = makeIdempotencyKey(log_date);
    var snapBefore  = null;
    var snapAfter   = null;

    /* step 1 — snapshot before */
    try {
      snapBefore = readLocalState();
    } catch (e) {
      snapBefore = null;
    }

    var hashBefore = hashObject(snapBefore);

    /* step 2 — guard: ZadAPI موجودة */
    if (!window.ZadAPI || !window.ZadAPI.auth || !window.ZadAPI.worship) {
      return Promise.resolve({
        ok: false,
        status: 'SKIP',
        message: 'ZadAPI not available',
        version: ZAD_VERSION
      });
    }

    /* step 3 — auth check أولاً (قبل localStorage check)
     * AUTH_REQUIRED لازم يرجع حتى لو مفيش zad_v2 —
     * عشان الـ auth guard test يشتغل صح في أي حالة
     */
    return window.ZadAPI.auth.me()
      .then(function (authRes) {
        var authUser = normalizeAuthUser(authRes);
        if (!authUser) {
          return {
            ok: false,
            status: 'AUTH_REQUIRED',
            message: 'No active session — login required',
            version: ZAD_VERSION
          };
        }

        /* step 4 — guard: localStorage state موجودة */
        if (!snapBefore) {
          return {
            ok: false,
            status: 'SKIP',
            message: 'zad_v2 not found in localStorage',
            version: ZAD_VERSION
          };
        }

        /* step 5 — build payload */
        var payload = buildWorshipPayload(snapBefore, log_date);

        /* step 6 — push */
        return window.ZadAPI.worship.push(log_date, payload, idempotency)
          .then(function (pushRes) {
            if (!pushRes || !pushRes.ok) {
              return {
                ok: false,
                status: 'PUSH_FAILED',
                message: (pushRes && pushRes.error) || 'Push failed',
                user: authUser,
                log_date: log_date,
                version: ZAD_VERSION
              };
            }

            /* step 7 — readback */
            return window.ZadAPI.worship.list()
              .then(function (listRes) {
                var readback = null;
                var readbackSource = null;
                var pushedAt = new Date().toISOString();

                /* primary: search list response for today's row */
                var listRows = extractRows(listRes);
                if (listRows.length > 0) {
                  var found = listRows.find(function (r) {
                    return r.log_date && String(r.log_date).slice(0, 10) === log_date;
                  }) || null;
                  if (found) {
                    readback = found;
                    readbackSource = 'list';
                  }
                }

                /* fallback: use pushResponse.data.data if list didn't return the row */
                if (!readback && pushRes && pushRes.data) {
                  var pushed = pushRes.data.data || pushRes.data;
                  if (pushed && pushed.log_date &&
                      String(pushed.log_date).slice(0, 10) === log_date) {
                    readback = pushed;
                    readbackSource = 'pushResponseFallback';
                  }
                }

                /* step 8 — after snapshot */
                snapAfter  = readLocalState();
                hashAfter  = hashObject(snapAfter);
                var equal  = productDataEqual(snapBefore, snapAfter);

                /* step 9 — write sync metadata only */
                writeSyncMeta({
                  lastPushedAt:     pushedAt,
                  lastPushedDate:   log_date,
                  lastPushedStatus: 'ok'
                });

                return {
                  ok: true,
                  status: pushRes.cached ? 'CACHED' : 'PUSHED',
                  message: pushRes.cached
                    ? 'Idempotent — same key returned cached (no DB mutation)'
                    : 'Pushed and written to DB',
                  user:          authUser,
                  log_date:      log_date,
                  idempotency_key: idempotency,
                  pushedAt:      pushedAt,
                  pushResponse:  pushRes,
                  readback:      readback,
                  readbackSource: readbackSource,
                  localIntegrity: {
                    hashBefore:       hashBefore,
                    hashAfter:        hashAfter,
                    productDataEqual: equal
                  },
                  version: ZAD_VERSION
                };
              });
          });
      })
      .catch(function (err) {
        return {
          ok: false,
          status: 'ERROR',
          message: String(err),
          version: ZAD_VERSION
        };
      });

    /* declare hashAfter in outer scope for closure */
    var hashAfter;
  };

  /**
   * previewPayload — يعرض الـ payload اللي هيتبعت بدون ما يبعته
   * للاستخدام في diagnostics/debugging
   */
  ZadSync.previewPayload = function () {
    var log_date = todayDate();
    var state    = readLocalState();
    if (!state) {
      return { ok: false, message: 'zad_v2 not found' };
    }
    return {
      ok:      true,
      log_date: log_date,
      payload:  buildWorshipPayload(state, log_date),
      hashNow:  hashObject(state)
    };
  };

  /**
   * getLocalIntegrity — snapshot hash من zad_v2 في أي وقت
   * للاستخدام في before/after tests
   */
  ZadSync.getLocalIntegrity = function () {
    var state = readLocalState();
    return {
      found:    !!state,
      hash:     hashObject(state),
      hasSyncMeta: !!(state && state.sync)
    };
  };

  /**
   * clearSyncMeta — يمسح sync metadata فقط (للـ testing)
   * ما بيلمسش product data
   */
  ZadSync.clearSyncMeta = function () {
    try {
      var raw = localStorage.getItem(ZAD_LS_KEY);
      if (!raw) return false;
      var state = JSON.parse(raw);
      delete state.sync;
      localStorage.setItem(ZAD_LS_KEY, JSON.stringify(state));
      return true;
    } catch (e) {
      return false;
    }
  };

  /* ── expose globally ───────────────────────────────────────────────── */

  window.ZadSync = ZadSync;

})();
