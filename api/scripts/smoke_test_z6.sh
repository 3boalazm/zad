#!/usr/bin/env bash
# ZAD Z6 Full Smoke Test
# Run from: /opt/codeandcanvas/apps/zad/source/api
# Prerequisites: .env sourced, API running, docker exec to zad-postgres
set -euo pipefail

API_BASE="${API_BASE:-http://localhost:4010/api/v1}"
DB_CONTAINER="zad-postgres"; DB_NAME="zad"; DB_USER="zad_app"
PASS=0; FAIL=0; WARN=0
log_pass() { echo "  ✓ PASS  $1"; PASS=$((PASS+1)); }
log_fail() { echo "  ✗ FAIL  $1"; FAIL=$((FAIL+1)); }
log_warn() { echo "  ⚠ WARN  $1"; WARN=$((WARN+1)); }
log_section() { echo; echo "══════════════════════════════════════"; echo "  $1"; echo "══════════════════════════════════════"; }
run_sql() { docker exec -i "$DB_CONTAINER" psql -U "$DB_USER" -d "$DB_NAME" -v ON_ERROR_STOP=1 "$@"; }

log_section "PHASE 1: HEALTH"
LIVE=$(curl -s -o /dev/null -w "%{http_code}" "${API_BASE%/api/v1}/health/live" 2>/dev/null || echo "000")
[ "$LIVE" = "200" ] && log_pass "/health/live 200" || log_fail "/health/live $LIVE"
READY=$(curl -s -o /dev/null -w "%{http_code}" "${API_BASE%/api/v1}/health/ready" 2>/dev/null || echo "000")
[ "$READY" = "200" ] && log_pass "/health/ready 200" || log_fail "/health/ready $READY"
ROOT=$(curl -s "$API_BASE" 2>/dev/null || echo "{}")
echo "$ROOT" | grep -q '"sprint":"Z6"' && log_pass "sprint Z6" || log_warn "sprint != Z6"
echo "$ROOT" | grep -q '"version":"0.6.0"' && log_pass "version 0.6.0" || log_warn "version != 0.6.0"

log_section "PHASE 2: DB SCHEMA"
for tbl in users worship_log sync_cursors idempotency_keys; do
  EXISTS=$(run_sql -t -c "SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='$tbl');" 2>/dev/null | tr -d ' \n')
  [ "$EXISTS" = "t" ] && log_pass "table $tbl" || log_fail "table $tbl MISSING"
done

log_section "PHASE 3: SMOKE USER"
USER_JSON=$(node scripts/create_test_user.js 2>&1)
SMOKE_EMAIL=$(echo "$USER_JSON" | grep '"email"' | sed 's/.*: *"\(.*\)".*/\1/')
SMOKE_PASS=$(echo "$USER_JSON" | grep '"rawPassword"' | sed 's/.*: *"\(.*\)".*/\1/')
SMOKE_UID=$(echo "$USER_JSON" | grep '"userId"' | sed 's/.*: *"\(.*\)".*/\1/')
[ -z "$SMOKE_EMAIL" ] && { log_fail "create_test_user.js failed"; exit 1; }
log_pass "smoke user: $SMOKE_EMAIL"
COOKIE_JAR=$(mktemp /tmp/zad-z6-cookies-XXXXXX.txt)
cleanup() { rm -f "$COOKIE_JAR"; [ -n "${SMOKE_EMAIL:-}" ] && node scripts/cleanup_test_user.js "$SMOKE_EMAIL" 2>/dev/null && echo "  ✓ cleanup" || true; }
trap cleanup EXIT

log_section "PHASE 4: AUTH"
LS=$(curl -s -o /dev/null -w "%{http_code}" -X POST -H "Content-Type: application/json" \
  -d "{\"email\":\"$SMOKE_EMAIL\",\"password\":\"$SMOKE_PASS\"}" -c "$COOKIE_JAR" "$API_BASE/auth/login")
[ "$LS" = "200" ] && log_pass "POST /auth/login 200" || log_fail "POST /auth/login $LS"
MR=$(curl -s -w "\n%{http_code}" -b "$COOKIE_JAR" "$API_BASE/auth/me")
MS=$(echo "$MR" | tail -1); MB=$(echo "$MR" | head -1)
[ "$MS" = "200" ] && log_pass "GET /auth/me 200" || log_fail "GET /auth/me $MS"
echo "$MB" | grep -q "$SMOKE_UID" && log_pass "userId matches" || log_warn "userId not found"

log_section "PHASE 5: POST /worship/logs"
TODAY=$(date +%Y-%m-%d)
IK="smoke-idem-$(date +%s)"
CR=$(curl -s -w "\n%{http_code}" -X POST -H "Content-Type: application/json" \
  -d "{\"log_date\":\"$TODAY\",\"payload\":{\"fajr\":true},\"idempotency_key\":\"$IK\"}" \
  -b "$COOKIE_JAR" "$API_BASE/worship/logs")
[ "$(echo "$CR" | tail -1)" = "200" ] && log_pass "POST /worship/logs 200" || log_fail "POST /worship/logs $(echo "$CR" | tail -1)"
IR=$(curl -s -o /dev/null -w "%{http_code}" -X POST -H "Content-Type: application/json" \
  -d "{\"log_date\":\"$TODAY\",\"payload\":{\"fajr\":false},\"idempotency_key\":\"$IK\"}" \
  -b "$COOKIE_JAR" "$API_BASE/worship/logs")
[ "$IR" = "200" ] && log_pass "POST /worship/logs idempotent 200" || log_fail "POST /worship/logs idempotent $IR"
VR=$(curl -s -b "$COOKIE_JAR" "$API_BASE/worship/logs?since=$TODAY")
echo "$VR" | grep -q '"fajr":true' && log_pass "idempotency: payload unchanged" || log_warn "cannot verify idempotency payload"
BD=$(curl -s -o /dev/null -w "%{http_code}" -X POST -H "Content-Type: application/json" \
  -d '{"log_date":"not-a-date","payload":{}}' -b "$COOKIE_JAR" "$API_BASE/worship/logs")
[ "$BD" = "400" ] && log_pass "POST /worship/logs bad date 400" || log_fail "POST /worship/logs bad date $BD"
NA=$(curl -s -o /dev/null -w "%{http_code}" -X POST -H "Content-Type: application/json" \
  -d '{"log_date":"2026-06-16","payload":{}}' "$API_BASE/worship/logs")
[ "$NA" = "401" ] && log_pass "POST /worship/logs no auth 401" || log_fail "POST /worship/logs no auth $NA"

log_section "PHASE 6: GET /worship/logs"
LT=$(curl -s -o /dev/null -w "%{http_code}" -b "$COOKIE_JAR" "$API_BASE/worship/logs?since=$TODAY")
[ "$LT" = "200" ] && log_pass "GET /worship/logs 200" || log_fail "GET /worship/logs $LT"
BS=$(curl -s -o /dev/null -w "%{http_code}" -b "$COOKIE_JAR" "$API_BASE/worship/logs?since=bad")
[ "$BS" = "400" ] && log_pass "GET /worship/logs bad since 400" || log_fail "GET /worship/logs bad since $BS"
LN=$(curl -s -o /dev/null -w "%{http_code}" "$API_BASE/worship/logs")
[ "$LN" = "401" ] && log_pass "GET /worship/logs no auth 401" || log_fail "GET /worship/logs no auth $LN"

log_section "PHASE 7: POST /sync/push"
YESTERDAY=$(date -d 'yesterday' +%Y-%m-%d 2>/dev/null || date -v-1d +%Y-%m-%d 2>/dev/null || echo "2026-06-15")
PH=$(curl -s -w "\n%{http_code}" -X POST -H "Content-Type: application/json" \
  -d "{\"changes\":[{\"log_date\":\"$YESTERDAY\",\"payload\":{\"asr\":true}},{\"log_date\":\"bad\",\"payload\":{}}]}" \
  -b "$COOKIE_JAR" "$API_BASE/sync/push")
PS=$(echo "$PH" | tail -1); PB=$(echo "$PH" | head -1)
[ "$PS" = "200" ] && log_pass "POST /sync/push 200" || log_fail "POST /sync/push $PS"
echo "$PB" | grep -q '"failed"' && log_pass "bad item marked failed" || log_warn "failed status not found"
BIG=$(python3 -c "import json; print(json.dumps({'changes':[{'log_date':'2026-01-01','payload':{}}]*51}))" 2>/dev/null || echo '{"changes":[]}')
BIGS=$(curl -s -o /dev/null -w "%{http_code}" -X POST -H "Content-Type: application/json" -d "$BIG" -b "$COOKIE_JAR" "$API_BASE/sync/push")
[ "$BIGS" = "400" ] && log_pass "POST /sync/push 51 items 400" || log_fail "POST /sync/push 51 items $BIGS"
PN=$(curl -s -o /dev/null -w "%{http_code}" -X POST -H "Content-Type: application/json" -d '{"changes":[]}' "$API_BASE/sync/push")
[ "$PN" = "401" ] && log_pass "POST /sync/push no auth 401" || log_fail "POST /sync/push no auth $PN"

log_section "PHASE 8: POST /sync/pull"
PL=$(curl -s -w "\n%{http_code}" -X POST -H "Content-Type: application/json" \
  -d '{"after_seq":0,"limit":10}' -b "$COOKIE_JAR" "$API_BASE/sync/pull")
PLS=$(echo "$PL" | tail -1); PLB=$(echo "$PL" | head -1)
[ "$PLS" = "200" ] && log_pass "POST /sync/pull 200" || log_fail "POST /sync/pull $PLS"
echo "$PLB" | grep -q '"data"' && log_pass "sync/pull data field present" || log_warn "data field missing"
echo "$PLB" | grep -q '"has_more"' && log_pass "sync/pull has_more field present" || log_warn "has_more missing"
BSQ=$(curl -s -o /dev/null -w "%{http_code}" -X POST -H "Content-Type: application/json" -d '{"after_seq":-1}' -b "$COOKIE_JAR" "$API_BASE/sync/pull")
[ "$BSQ" = "400" ] && log_pass "POST /sync/pull after_seq=-1 400" || log_fail "POST /sync/pull after_seq=-1 $BSQ"
PLNA=$(curl -s -o /dev/null -w "%{http_code}" -X POST -H "Content-Type: application/json" -d '{"after_seq":0}' "$API_BASE/sync/pull")
[ "$PLNA" = "401" ] && log_pass "POST /sync/pull no auth 401" || log_fail "POST /sync/pull no auth $PLNA"

log_section "PHASE 9: DB VERIFY"
WC=$(run_sql -t -c "SELECT COUNT(*) FROM worship_log WHERE user_id='$SMOKE_UID';" 2>/dev/null | tr -d ' \n')
[ "${WC:-0}" -ge "1" ] && log_pass "worship_log: $WC rows" || log_warn "worship_log: 0 rows"
CSR=$(run_sql -t -c "SELECT last_seq FROM sync_cursors WHERE user_id='$SMOKE_UID';" 2>/dev/null | tr -d ' \n')
[ -n "$CSR" ] && log_pass "sync_cursors: last_seq=$CSR" || log_warn "sync_cursors: no row"

log_section "PHASE 10: TEARDOWN"
LO=$(curl -s -o /dev/null -w "%{http_code}" -X POST -b "$COOKIE_JAR" "$API_BASE/auth/logout")
[ "$LO" = "200" ] && log_pass "POST /auth/logout 200" || log_fail "POST /auth/logout $LO"
MAL=$(curl -s -o /dev/null -w "%{http_code}" -b "$COOKIE_JAR" "$API_BASE/auth/me")
[ "$MAL" = "401" ] && log_pass "GET /auth/me post-logout 401" || log_fail "GET /auth/me post-logout $MAL"
WAL=$(curl -s -o /dev/null -w "%{http_code}" -b "$COOKIE_JAR" "$API_BASE/worship/logs")
[ "$WAL" = "401" ] && log_pass "GET /worship/logs post-logout 401" || log_fail "GET /worship/logs post-logout $WAL"

log_section "Z6 CLOSURE REPORT"
TOTAL=$((PASS + FAIL + WARN))
echo; echo "  Total : $TOTAL"; echo "  ✓ PASS: $PASS"; echo "  ✗ FAIL: $FAIL"; echo "  ⚠ WARN: $WARN"; echo
if [ "$FAIL" -eq 0 ]; then
  echo "  Sprint Z6 : PASS ✓"; exit 0
else
  echo "  Sprint Z6 : FAIL ✗  ($FAIL failures)"; exit 1
fi
