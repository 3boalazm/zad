#!/usr/bin/env bash
# ============================================================
# ZAD — Z5.1 Full Smoke Test (revised — email auth)
# Run from: /opt/codeandcanvas/apps/zad/api
# Prerequisites:
#   .env sourced (DATABASE_URL set)
#   API running: node dist/server.js &
#   docker exec accessible to zad-postgres
# ============================================================
set -euo pipefail

API_BASE="${API_BASE:-http://localhost:4010/api/v1}"
DB_CONTAINER="zad-postgres"
DB_NAME="zad"
DB_USER="zad_app"

# POSIX-safe counters (avoid ((N++)) with set -e)
PASS=0
FAIL=0
WARN=0

log_pass() { echo "  ✓ PASS  $1"; PASS=$((PASS+1)); }
log_fail() { echo "  ✗ FAIL  $1"; FAIL=$((FAIL+1)); }
log_warn() { echo "  ⚠ WARN  $1"; WARN=$((WARN+1)); }
log_section() {
  echo
  echo "══════════════════════════════════════"
  echo "  $1"
  echo "══════════════════════════════════════"
}

run_sql() {
  docker exec -i "$DB_CONTAINER" psql -U "$DB_USER" -d "$DB_NAME" \
    -v ON_ERROR_STOP=1 "$@"
}

# ─────────────────────────────────────────────────────────────
log_section "PHASE 1: PREFLIGHT"
# ─────────────────────────────────────────────────────────────

echo "  Checking DB connectivity..."
if run_sql -c "SELECT 1" > /dev/null 2>&1; then
  log_pass "DB accessible"
else
  log_fail "DB unreachable — check container $DB_CONTAINER"
  exit 1
fi

echo "  Checking API /health/live..."
LIVE=$(curl -s -o /dev/null -w "%{http_code}" \
       "${API_BASE%/api/v1}/health/live" 2>/dev/null || echo "000")
if [ "$LIVE" = "200" ]; then
  log_pass "/health/live → 200"
else
  log_warn "/health/live → $LIVE (API may not be running)"
fi

echo "  Checking API /health/ready..."
READY=$(curl -s -o /dev/null -w "%{http_code}" \
        "${API_BASE%/api/v1}/health/ready" 2>/dev/null || echo "000")
if [ "$READY" = "200" ]; then
  log_pass "/health/ready → 200 (db:ok)"
else
  log_fail "/health/ready → $READY"
fi

# ─────────────────────────────────────────────────────────────
log_section "PHASE 2: APPLY MIGRATIONS 001-005"
# ─────────────────────────────────────────────────────────────

for migration in \
    db/migrations/001_init.sql \
    db/migrations/002_identity.sql \
    db/migrations/003_worship.sql \
    db/migrations/004_sync.sql \
    db/migrations/005_auth.sql; do

  name=$(basename "$migration")
  echo "  Applying $name..."
  if run_sql < "$migration" > /dev/null 2>&1; then
    log_pass "$name"
  else
    log_fail "$name FAILED — stopping"
    exit 1
  fi
done

# ─────────────────────────────────────────────────────────────
log_section "PHASE 3: VERIFY SCHEMA"
# ─────────────────────────────────────────────────────────────

# db_migrations should have 5 rows
MIG_COUNT=$(run_sql -t -c "SELECT COUNT(*) FROM db_migrations;" 2>/dev/null | tr -d ' \n')
if [ "$MIG_COUNT" = "5" ]; then
  log_pass "db_migrations: 5 rows"
else
  log_fail "db_migrations: expected 5, got $MIG_COUNT"
fi

# Required tables — use information_schema for robust cross-env check
# to_regclass output format varies by psql version/search_path settings
for tbl in users users_auth sessions login_events worship_log sync_cursors idempotency_keys; do
  EXISTS=$(run_sql -t -c \
    "SELECT EXISTS (
       SELECT 1 FROM information_schema.tables
       WHERE table_schema='public' AND table_name='$tbl'
     );" 2>/dev/null | tr -d ' \n')
  if [ "$EXISTS" = "t" ]; then
    log_pass "table $tbl: EXISTS"
  else
    log_fail "table $tbl: MISSING"
  fi
done

# pgcrypto
PGC=$(run_sql -t -c "SELECT extname FROM pg_extension WHERE extname='pgcrypto';" 2>/dev/null | tr -d ' \n')
if [ "$PGC" = "pgcrypto" ]; then
  log_pass "pgcrypto: installed"
else
  log_fail "pgcrypto: missing"
fi

# fn_set_updated_at
FN=$(run_sql -t -c "SELECT proname FROM pg_proc WHERE proname='fn_set_updated_at';" 2>/dev/null | tr -d ' \n')
if [ "$FN" = "fn_set_updated_at" ]; then
  log_pass "fn_set_updated_at: exists"
else
  log_fail "fn_set_updated_at: missing"
fi

# Confirm users_auth has email column (not username)
HAS_EMAIL=$(run_sql -t -c \
  "SELECT column_name FROM information_schema.columns
   WHERE table_schema='public' AND table_name='users_auth' AND column_name='email';" \
  2>/dev/null | tr -d ' \n')
if [ "$HAS_EMAIL" = "email" ]; then
  log_pass "users_auth.email column: EXISTS"
else
  log_fail "users_auth.email column: MISSING"
fi

HAS_USERNAME=$(run_sql -t -c \
  "SELECT column_name FROM information_schema.columns
   WHERE table_schema='public' AND table_name='users_auth' AND column_name='username';" \
  2>/dev/null | tr -d ' \n')
if [ -z "$HAS_USERNAME" ]; then
  log_pass "users_auth.username column: absent (correct)"
else
  log_fail "users_auth.username column: present (should not exist)"
fi

# Confirm login_events has email_attempted column
HAS_EA=$(run_sql -t -c \
  "SELECT column_name FROM information_schema.columns
   WHERE table_schema='public' AND table_name='login_events' AND column_name='email_attempted';" \
  2>/dev/null | tr -d ' \n')
if [ "$HAS_EA" = "email_attempted" ]; then
  log_pass "login_events.email_attempted: EXISTS"
else
  log_fail "login_events.email_attempted: MISSING"
fi

# Confirm sessions has ip_address and user_agent (matches createSession INSERT)
for col in ip_address user_agent; do
  HAS_COL=$(run_sql -t -c \
    "SELECT column_name FROM information_schema.columns
     WHERE table_schema='public' AND table_name='sessions' AND column_name='$col';" \
    2>/dev/null | tr -d ' \n')
  if [ "$HAS_COL" = "$col" ]; then
    log_pass "sessions.$col: EXISTS"
  else
    log_fail "sessions.$col: MISSING"
  fi
done

# ─────────────────────────────────────────────────────────────
log_section "PHASE 4: CREATE TEMP USER"
# ─────────────────────────────────────────────────────────────

echo "  Creating smoke test user..."
USER_JSON=$(node scripts/create_test_user.js 2>&1)
if [ $? -ne 0 ]; then
  log_fail "create_test_user.js: $USER_JSON"
  exit 1
fi

SMOKE_EMAIL=$(echo "$USER_JSON" | grep '"email"'       | sed 's/.*: *"\(.*\)".*/\1/')
SMOKE_PASS=$(echo "$USER_JSON"  | grep '"rawPassword"' | sed 's/.*: *"\(.*\)".*/\1/')
SMOKE_UID=$(echo "$USER_JSON"   | grep '"userId"'      | sed 's/.*: *"\(.*\)".*/\1/')

if [ -z "$SMOKE_EMAIL" ] || [ -z "$SMOKE_PASS" ]; then
  log_fail "Could not parse smoke user credentials"
  exit 1
fi

log_pass "Created smoke user: $SMOKE_EMAIL (id: $SMOKE_UID)"

# Register cleanup on exit
COOKIE_JAR=$(mktemp /tmp/zad-cookies-XXXXXX.txt)
cleanup() {
  rm -f "$COOKIE_JAR"
  if [ -n "${SMOKE_EMAIL:-}" ]; then
    node scripts/cleanup_test_user.js "$SMOKE_EMAIL" 2>/dev/null || true
    echo "  ✓ Cleanup: smoke user removed"
  fi
}
trap cleanup EXIT

# ─────────────────────────────────────────────────────────────
log_section "PHASE 5: HTTP SMOKE TESTS"
# ─────────────────────────────────────────────────────────────

# 5a. POST /auth/login
echo "  POST $API_BASE/auth/login"
LOGIN_RESP=$(curl -s -w "\n%{http_code}" \
  -X POST \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$SMOKE_EMAIL\",\"password\":\"$SMOKE_PASS\"}" \
  -c "$COOKIE_JAR" \
  "$API_BASE/auth/login" 2>/dev/null)
LOGIN_STATUS=$(echo "$LOGIN_RESP" | tail -1)
LOGIN_BODY=$(echo "$LOGIN_RESP" | head -1)

if [ "$LOGIN_STATUS" = "200" ]; then
  log_pass "POST /auth/login → 200"
else
  log_fail "POST /auth/login → $LOGIN_STATUS (body: $LOGIN_BODY)"
fi

# 5b. GET /auth/me
echo "  GET $API_BASE/auth/me"
ME_RESP=$(curl -s -w "\n%{http_code}" \
  -X GET \
  -b "$COOKIE_JAR" \
  "$API_BASE/auth/me" 2>/dev/null)
ME_STATUS=$(echo "$ME_RESP" | tail -1)
ME_BODY=$(echo "$ME_RESP" | head -1)

if [ "$ME_STATUS" = "200" ]; then
  log_pass "GET /auth/me → 200"
  if echo "$ME_BODY" | grep -q "$SMOKE_UID"; then
    log_pass "GET /auth/me → userId matches"
  else
    log_warn "GET /auth/me → userId not found in body (check response format)"
  fi
else
  log_fail "GET /auth/me → $ME_STATUS (body: $ME_BODY)"
fi

# 5c. POST /auth/logout
echo "  POST $API_BASE/auth/logout"
LOGOUT_STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
  -X POST \
  -b "$COOKIE_JAR" \
  "$API_BASE/auth/logout" 2>/dev/null)

if [ "$LOGOUT_STATUS" = "200" ]; then
  log_pass "POST /auth/logout → 200"
else
  log_fail "POST /auth/logout → $LOGOUT_STATUS"
fi

# 5d. GET /auth/me after logout → 401
echo "  GET $API_BASE/auth/me (post-logout, expect 401)"
ME_AFTER=$(curl -s -o /dev/null -w "%{http_code}" \
  -X GET \
  -b "$COOKIE_JAR" \
  "$API_BASE/auth/me" 2>/dev/null)

if [ "$ME_AFTER" = "401" ]; then
  log_pass "GET /auth/me after logout → 401 ✓"
else
  log_fail "GET /auth/me after logout → $ME_AFTER (expected 401)"
fi

# 5e. POST /auth/login with wrong password → 401
echo "  POST $API_BASE/auth/login (wrong password, expect 401)"
BAD_LOGIN=$(curl -s -o /dev/null -w "%{http_code}" \
  -X POST \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$SMOKE_EMAIL\",\"password\":\"wrongpassword123\"}" \
  "$API_BASE/auth/login" 2>/dev/null)

if [ "$BAD_LOGIN" = "401" ]; then
  log_pass "POST /auth/login (bad password) → 401 ✓"
else
  log_fail "POST /auth/login (bad password) → $BAD_LOGIN (expected 401)"
fi

# ─────────────────────────────────────────────────────────────
log_section "PHASE 6: DB VERIFY AFTER SMOKE"
# ─────────────────────────────────────────────────────────────

# login_events rows for smoke email
LE_COUNT=$(run_sql -t -c \
  "SELECT COUNT(*) FROM login_events WHERE LOWER(email_attempted)=LOWER('$SMOKE_EMAIL');" \
  2>/dev/null | tr -d ' \n')
if [ "${LE_COUNT:-0}" -ge "1" ]; then
  log_pass "login_events: $LE_COUNT row(s) for smoke email"
else
  log_warn "login_events: 0 rows (router may not insert login_events yet)"
fi

# Active sessions should be 0 after logout
ACTIVE=$(run_sql -t -c \
  "SELECT COUNT(*) FROM sessions WHERE user_id='$SMOKE_UID' AND revoked_at IS NULL;" \
  2>/dev/null | tr -d ' \n')
if [ "${ACTIVE:-1}" = "0" ]; then
  log_pass "sessions: all revoked after logout"
else
  log_warn "sessions: $ACTIVE still active (expected 0)"
fi

# ─────────────────────────────────────────────────────────────
log_section "Z5.1 CLOSURE REPORT"
# ─────────────────────────────────────────────────────────────

TOTAL=$((PASS + FAIL + WARN))
echo
echo "  Total : $TOTAL"
echo "  ✓ PASS: $PASS"
echo "  ✗ FAIL: $FAIL"
echo "  ⚠ WARN: $WARN"
echo

if [ "$FAIL" -eq 0 ]; then
  echo "  ══════════════════════════════════════"
  echo "  Sprint Z5.1 : PASS ✓"
  echo "  DB baseline OK. Auth endpoints verified."
  echo "  Ready for Z6 — Worship Sync Endpoints."
  echo "  ══════════════════════════════════════"
  exit 0
else
  echo "  ══════════════════════════════════════"
  echo "  Sprint Z5.1 : FAIL ✗  ($FAIL failure(s))"
  echo "  Fix failures above before proceeding."
  echo "  ══════════════════════════════════════"
  exit 1
fi
