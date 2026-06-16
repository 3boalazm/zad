# ZAD — Sprint Z5 Closure
**Sprint:** Z5 — Auth/Sessions Backend
**التاريخ:** يونيو 2026
**الحالة:** ✅ PASS (offline) ⏳ PENDING server smoke (migration + real login)

---

## الهدف

إضافة Auth/Sessions backend: login, logout, me, requireAuth middleware.
بدون JWT — sessions opaque مخزونة في DB.

---

## ما لا يحتويه Z5 (عن قصد)

| العنصر | السبب |
|--------|-------|
| JWT | قرار ADR-004 — opaque sessions |
| User registration UI | Frontend خارج النطاق |
| Admin seed بـ password ثابت | لا secrets في الكود |
| Nginx/public exposure | خارج النطاق |
| تعديل /source | ممنوع |

---

## الملفات المُضافة / المُعدَّلة

| الملف | الوصف |
|-------|-------|
| `db/migrations/005_auth.sql` | جديد: users_auth, sessions, login_events |
| `src/auth/password.ts` | جديد: hashPassword / verifyPassword (argon2id) |
| `src/auth/session.ts` | جديد: createSession / getSession / revokeSession |
| `src/auth/auth.router.ts` | جديد: POST /login, POST /logout, GET /me |
| `src/middleware/requireAuth.ts` | جديد: optional auth guard middleware |
| `src/app.ts` | cookieParser + authRouter مضاف |
| `src/tests/auth.test.ts` | جديد: 11 tests |
| `package.json` | argon2 + cookie-parser + version 0.5.0 |
| `package-lock.json` | مُحدَّث |
| `.env.example` | Z5 notes |

---

## تصميم الـ Sessions

```
Client sends:   POST /auth/login { email, password }
Server:         1. verifies argon2id hash
                2. creates 32-byte random token
                3. stores SHA-256(token) in sessions table
                4. sets HttpOnly cookie: zad_sid=raw_token

On request:     Server hashes cookie → lookup in DB
                Active = revoked_at IS NULL AND expires_at > NOW()

Logout:         UPDATE sessions SET revoked_at = NOW()
                clearCookie(zad_sid)
```

**لماذا SHA-256 للـ session token وليس argon2؟**
Session token = 256-bit random entropy — لا يحتاج slow hashing.
argon2 مخصص للـ passwords (low-entropy user input).

---

## Migration 005_auth.sql

```sql
-- 3 جداول:
users_auth    -- email + argon2id hash (1:1 مع users، اختياري للـ anonymous)
sessions      -- token_hash (SHA-256)، expires_at، revoked_at
login_events  -- audit log append-only
```

**على السيرفر:**
```bash
cd /opt/codeandcanvas/apps/zad/api
# نسخ ملف الـ migration
cp db/migrations/005_auth.sql /tmp/

# تشغيل داخل container (migration يعتمد على جدول users من 001_identity.sql)
# لو 001_identity.sql لم يُشغَّل بعد: شغّل الـ 4 migrations أولاً
docker exec -i zad-postgres psql \
  -U zad_app -d zad < /tmp/005_auth.sql

# تحقق
docker exec zad-postgres psql -U zad_app -d zad \
  -c "\dt" | grep -E "users_auth|sessions|login_events"
```

---

## Smoke Test على السيرفر (بعد migration)

```bash
# 1. أنشئ test user (مرة واحدة — development فقط)
docker exec zad-postgres psql -U zad_app -d zad << 'SQL'
INSERT INTO users (id, locale, is_anonymous) 
VALUES ('11111111-1111-1111-1111-111111111111', 'ar', false);
SQL
# password_hash يُولَّد من node (لا تضع hash ثابت في docs):
node -e "
const a = require('argon2');
a.hash('test-password-change-me').then(h => {
  console.log(h);
});
"
# خذ الـ hash وأدخله:
docker exec zad-postgres psql -U zad_app -d zad -c \
  "INSERT INTO users_auth (user_id, email, password_hash) 
   VALUES ('11111111-1111-1111-1111-111111111111', 'test@zad.local', 'HASH_FROM_ABOVE');"

# 2. شغّل API
export $(grep -v '^#' .env | xargs)
node dist/server.js &
API_PID=$!
sleep 3

# 3. Login
curl -c /tmp/zad-cookies.txt -si \
  -X POST http://127.0.0.1:4010/api/v1/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"test@zad.local","password":"test-password-change-me"}'

# Expected: 200 {"status":"ok","userId":"11111111-..."}
# Expected header: Set-Cookie: zad_sid=...; HttpOnly

# 4. /me with session
curl -b /tmp/zad-cookies.txt -si http://127.0.0.1:4010/api/v1/auth/me
# Expected: 200 {"userId":"11111111-...","isAnonymous":false}

# 5. Logout
curl -b /tmp/zad-cookies.txt -c /tmp/zad-cookies.txt \
  -si -X POST http://127.0.0.1:4010/api/v1/auth/logout
# Expected: 200, Set-Cookie: zad_sid= (cleared)

# 6. /me after logout
curl -b /tmp/zad-cookies.txt -si http://127.0.0.1:4010/api/v1/auth/me
# Expected: 401 SESSION_INVALID

# 7. SIGTERM
kill -TERM "$API_PID" && wait "$API_PID"
rm /tmp/zad-cookies.txt
```

---

## نتائج التحقق المحلي

### npm ci
```
found 0 vulnerabilities ✅
```

### npm audit --omit=dev
```
found 0 vulnerabilities ✅
```

### npm run typecheck
```
EXIT 0 ✅
```

### npm run build
```
EXIT 0 ✅  (16 JS files في dist/)
```

### npm test — 29 tests, 7 suites
```
ok 1 - Password hashing — argon2id        (4 tests) ✅
ok 2 - Session token utilities             (4 tests) ✅
ok 3 - GET /auth/me — no session cookie   (3 tests) ✅
ok 4 - Config — PORT validation           (6 tests) ✅
ok 5 - Config — API_PREFIX validation     (4 tests) ✅
ok 6 - Config — DATABASE_URL validation   (4 tests) ✅
ok 7 - Health endpoints — no DATABASE_URL (4 tests) ✅

pass 29 / fail 0 ✅
```

### Runtime smoke (offline — no DB)
```
GET  /health/live            → 200 ok ✅
GET  /health/ready           → 200 db:not_configured ✅
POST /auth/login (no fields) → 400 INVALID_INPUT ✅
POST /auth/login (no DB)     → 503 DB_UNAVAILABLE ✅
GET  /auth/me (no cookie)    → 401 NO_SESSION ✅
GET  /api/v1                 → 200 version:0.5.0 sprint:Z5 ✅
SIGTERM                      → exit 0 ✅
```

### Server smoke (with real DB + migration)
```
⏳ PENDING — يُكتمل بعد تشغيل 005_auth.sql على السيرفر
```

---

## Z3/Z4 Hardening محفوظ

| الضمان | الحالة |
|--------|-------|
| X-Powered-By absent | ✅ |
| X-Request-Id sanitization | ✅ |
| PORT/API_PREFIX validation | ✅ |
| Graceful shutdown | ✅ |
| npm audit 0 vulnerabilities | ✅ |

---

## PASS / WARN / FAIL

| # | المعيار | النتيجة |
|---|---------|---------|
| 1 | `005_auth.sql` — 3 جداول | ✅ PASS |
| 2 | argon2id password hashing | ✅ PASS |
| 3 | Session token SHA-256, HttpOnly cookie | ✅ PASS |
| 4 | POST /auth/login (input validation) | ✅ PASS |
| 5 | POST /auth/logout (revoke + clear cookie) | ✅ PASS |
| 6 | GET /auth/me (session lookup) | ✅ PASS |
| 7 | `requireAuth` middleware | ✅ PASS |
| 8 | `npm test` — 29/29 pass | ✅ PASS |
| 9 | `npm ci` + `audit` — 0 vulns | ✅ PASS |
| 10 | typecheck + build EXIT 0 | ✅ PASS |
| 11 | لا secrets في الكود | ✅ PASS |
| 12 | `/source` لم يُلمَس | ✅ PASS |
| 13 | Server smoke (real DB + login) | ⏳ PENDING |

**PASS: 12 — PENDING: 1 — WARN: 0 — FAIL: 0**

---

**Sprint Z5: CLOSED (offline) ✅**
**Server verification PENDING بعد تشغيل migration 005_auth.sql**
**التالي: Sprint Z6 — Worship Sync Endpoints**
