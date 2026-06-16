# ZAD — Sprint Z3 Closure
**Sprint:** Z3 — Existing ZAD API Skeleton Alignment (+ Hardening patch)
**التاريخ:** يونيو 2026
**الحالة:** ✅ PASS

---

## الهدف

إنشاء Backend API skeleton محدود داخل `/api` فقط —
بدون لمس `/source`، بدون DB connection، بدون Auth، بدون Frontend changes.

---

## ما لا يحتويه Z3 (عن قصد)

| العنصر | السبب |
|--------|-------|
| DB connection | يأتي في Sprint Z4 |
| Auth endpoints | يأتي في Sprint Z4 |
| `/health/ready` يعيد `db: "not_configured"` | صحيح ومقصود — DB غير مضبوط بعد |
| Docker / Nginx | خارج نطاق Z3 |
| CORS | same-origin مع PWA — ADR-008 |

---

## الملفات المنشأة / المعدَّلة

```
api/
├── .env.example
├── .gitignore
├── README.md
├── package.json          # uuid مُحذوف
├── package-lock.json     # مُولَّد — npm ci يعمل
├── tsconfig.json
├── src/
│   ├── app.ts            # app.disable('x-powered-by') مضاف
│   ├── server.ts
│   ├── config/
│   │   └── index.ts      # PORT validation + API_PREFIX validation
│   ├── db/
│   │   └── index.ts      # stub — not connected
│   ├── health/
│   │   └── health.router.ts
│   └── middleware/
│       ├── errorHandler.ts
│       ├── notFound.ts
│       ├── requestId.ts  # crypto.randomUUID + input validation
│       └── requestLogger.ts
└── docs/
    └── ZAD_SPRINT_Z3_CLOSURE.md
```

**لم يُلمَس:**
- `/source/**` — صفر تعديلات
- Firebase — لم يُحذَف
- Nginx / DNS — لم يُعدَّل

---

## Hardening المُطبَّق

### 1. uuid → crypto.randomUUID

```typescript
// قبل
import { v4 as uuidv4 } from 'uuid';
const id = uuidv4();

// بعد
import { randomUUID } from 'crypto';
const id = randomUUID();
```

تبعية أقل، entropy أعلى، Node native.

### 2. X-Request-Id validation

```typescript
const SAFE_ID_RE = /^[A-Za-z0-9._:\-]{1,128}$/;
// Array → أول عنصر فقط
// فاشل التحقق → randomUUID() جديد
```

| الـ header الوارد | النتيجة |
|-----------------|---------|
| `test-req-123` | يُعاد كما هو ✅ |
| `<script>alert(1)</script>` | يُرفض → UUID جديد ✅ |
| array من headers | أول عنصر فقط ✅ |
| طول > 128 | يُرفض → UUID جديد ✅ |

### 3. app.disable('x-powered-by')

X-Powered-By غائب من كل الـ responses.

### 4. Config validation

```typescript
// PORT: integer في [1, 65535]
// API_PREFIX: يبدأ بـ "/"، trailing slash يُحذَف
parsePort('99999')   → throw Error
parsePort('4010')    → 4010  ✅
parseApiPrefix('/api/v1/') → '/api/v1'  ✅
parseApiPrefix('api/v1')   → throw Error
```

---

## نتائج التحقق الكاملة

### npm ci (lockfile)
```
EXIT: 0 ✅  (23 packages — no uuid)
```

### npm audit --omit=dev
```
found 0 vulnerabilities ✅
```

### npm run typecheck
```
EXIT: 0 ✅  (no errors)
```

### npm run build
```
EXIT: 0 ✅  (dist/ contains 9 JS files)
```

### curl -i /health/live
```
HTTP/1.1 200 OK
X-Request-Id: <uuid>
{"status":"ok","service":"zad-api","check":"live","ts":"..."} ✅
```

### curl -i /health/ready
```
HTTP/1.1 200 OK
{"status":"ok","service":"zad-api","check":"ready",
 "db":"not_configured","sprint":"Z3","ts":"..."} ✅
```

### curl -i /api/v1
```
HTTP/1.1 200 OK
{"service":"zad-api","version":"0.3.0","sprint":"Z3",...} ✅
```

### curl -i /nonexistent
```
HTTP/1.1 404 Not Found
{"error":{"code":"NOT_FOUND","message":"Route not found: GET /nonexistent",...}} ✅
```

### X-Request-Id passthrough (safe)
```
curl -H "X-Request-Id: test-req-123" /health/live
→ X-Request-Id: test-req-123  ✅  (reused as-is)
```

### X-Request-Id passthrough (unsafe)
```
curl -H "X-Request-Id: <script>alert(1)</script>" /health/live
→ X-Request-Id: fcda1e8f-...  ✅  (rejected → new UUID)
```

### X-Powered-By absent
```
grep "x-powered-by" response headers → empty
PASS — X-Powered-By absent ✅
```

### SIGTERM graceful shutdown
```
{"msg":"Received SIGTERM — shutting down gracefully"}
{"msg":"HTTP server closed"}
exit code: 0 ✅
```

---

## PASS / WARN / FAIL

| # | المعيار | النتيجة |
|---|---------|---------|
| 1 | كل التعديلات داخل `/api` فقط | ✅ PASS |
| 2 | `/source` لم يتغير | ✅ PASS |
| 3 | `uuid` محذوف من dependencies | ✅ PASS |
| 4 | `crypto.randomUUID` يستبدله | ✅ PASS |
| 5 | X-Request-Id validation (safe accept, unsafe reject) | ✅ PASS |
| 6 | `app.disable('x-powered-by')` | ✅ PASS |
| 7 | PORT validation [1, 65535] | ✅ PASS |
| 8 | API_PREFIX validation (starts with /) | ✅ PASS |
| 9 | `package-lock.json` موجود | ✅ PASS |
| 10 | `npm ci` EXIT 0 | ✅ PASS |
| 11 | `npm audit --omit=dev` — 0 vulnerabilities | ✅ PASS |
| 12 | `npm run typecheck` EXIT 0 | ✅ PASS |
| 13 | `npm run build` EXIT 0 | ✅ PASS |
| 14 | `GET /health/live` → HTTP 200 | ✅ PASS |
| 15 | `GET /health/ready` → HTTP 200, db:not_configured | ✅ PASS |
| 16 | `GET /api/v1` → HTTP 200 | ✅ PASS |
| 17 | 404 handler يعمل | ✅ PASS |
| 18 | X-Powered-By غائب | ✅ PASS |
| 19 | SIGTERM → graceful shutdown → exit 0 | ✅ PASS |
| 20 | لا production DB connection | ✅ PASS |
| 21 | لا Firebase removal | ✅ PASS |
| 22 | لا frontend changes | ✅ PASS |

**PASS: 22 — WARN: 0 — FAIL: 0**

---

## للتطبيق على السيرفر

```bash
# الملفات توضع مباشرة داخل:
# /opt/codeandcanvas/apps/zad/api/
#
# الهيكل المطلوب:
# api/package.json
# api/package-lock.json
# api/tsconfig.json
# api/src/...
# api/docs/...

cd /opt/codeandcanvas/apps/zad/api
npm ci                         # lockfile موجود — deterministic install
npm run typecheck
npm run build

# اختبار مؤقت
PORT=4010 NODE_ENV=development node dist/server.js &
curl http://127.0.0.1:4010/health/live
curl http://127.0.0.1:4010/health/ready

# Commit
cd /opt/codeandcanvas/apps/zad
git add api/
git commit -m "feat(api): Z3 backend skeleton hardened — health endpoints"
git push origin main
```

---

## التالي: Sprint Z4

Sprint Z4: **DB Connection + Auth Endpoints**
- تشغيل 4 migrations على production PostgreSQL
- إضافة `pg` pool في `src/db/index.ts`
- `getDbStatus()` يُعيد `'ready'` بعد ping ناجح
- `/health/ready` يُعيد 503 لو DB غير متاح
- `POST /api/v1/auth/anonymous`
- `POST /api/v1/auth/refresh`
- `GET /api/v1/auth/me`

---

**Sprint Z3: CLOSED ✅**
**التالي: Sprint Z4 — DB Connection + Auth Endpoints**
