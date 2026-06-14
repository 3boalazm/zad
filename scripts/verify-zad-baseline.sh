#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════════
# ZAD — Baseline Verification Script
# Sprint Z0: Freeze & Server Migration Baseline
#
# وظيفته: قراءة وفحص فقط — لا يعدل أي شيء
# تشغيل: bash scripts/verify-zad-baseline.sh
#        (من داخل /opt/codeandcanvas/apps/zad/source)
# ═══════════════════════════════════════════════════════════════════

set -euo pipefail

PASS=0
FAIL=0
WARN=0

# ── ألوان للطرفية ───────────────────────────────────────────────────
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

check_pass() { echo -e "${GREEN}  ✅ PASS${NC} — $1"; PASS=$((PASS+1)); }
check_fail() { echo -e "${RED}  ❌ FAIL${NC} — $1"; FAIL=$((FAIL+1)); }
check_warn() { echo -e "${YELLOW}  ⚠️  WARN${NC} — $1"; WARN=$((WARN+1)); }
section()    { echo -e "\n${BLUE}══ $1 ══${NC}"; }

echo ""
echo -e "${BLUE}╔══════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║      ZAD — Baseline Verification — Sprint Z0         ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════╝${NC}"

# ── 1. الملفات الأساسية للـ PWA ────────────────────────────────────
section "1. Core PWA Files"

[ -f "index.html" ]              && check_pass "index.html موجود"           || check_fail "index.html مفقود"
[ -f "manifest.json" ]           && check_pass "manifest.json موجود"        || check_fail "manifest.json مفقود"
[ -f "sw.js" ]                   && check_pass "sw.js موجود"                || check_fail "sw.js مفقود"

# ── 2. مجلدات الكود ────────────────────────────────────────────────
section "2. Code Directories"

[ -d "js" ]                      && check_pass "مجلد js/ موجود"             || check_fail "مجلد js/ مفقود"
[ -f "js/app.js" ]               && check_pass "js/app.js موجود"            || check_fail "js/app.js مفقود"
[ -f "js/storage.js" ]           && check_pass "js/storage.js موجود"        || check_fail "js/storage.js مفقود"
[ -d "css" ]                     && check_pass "مجلد css/ موجود"            || check_fail "مجلد css/ مفقود"

# ── 3. Firebase ────────────────────────────────────────────────────
section "3. Firebase Configuration"

[ -d "firebase" ]                && check_pass "مجلد firebase/ موجود"       || check_fail "مجلد firebase/ مفقود"
[ -f "firebase/database.rules.json" ] && check_pass "database.rules.json موجود" || check_fail "database.rules.json مفقود"
[ -f "js/firebase-init.js" ]     && check_pass "firebase-init.js موجود"     || check_fail "firebase-init.js مفقود"
[ -f "js/firebase-auth.js" ]     && check_pass "firebase-auth.js موجود"     || check_fail "firebase-auth.js مفقود"
[ -f "firebase-messaging-sw.js" ] && check_pass "firebase-messaging-sw.js موجود" || check_warn "firebase-messaging-sw.js مفقود"

# ── 4. عدم وجود ملفات Backend (Sprint Z0 — لا backend بعد) ────────
section "4. No Backend Files (Expected Absent)"

[ ! -f "package.json" ]          && check_pass "package.json غير موجود (متوقع)" || check_warn "package.json موجود — تحقق قبل Phase 1"
[ ! -f ".env" ]                  && check_pass ".env غير موجود (متوقع)"     || check_fail ".env موجود — خطر أمني محتمل"
[ ! -d "node_modules" ]          && check_pass "node_modules/ غير موجود (متوقع)" || check_warn "node_modules/ موجود — هل تم npm install؟"
[ ! -f "Dockerfile" ]            && check_pass "Dockerfile غير موجود (متوقع)" || check_warn "Dockerfile موجود — قبل Phase 1؟"
[ ! -f "docker-compose.yml" ] && [ ! -f "docker-compose.yaml" ] \
                                 && check_pass "docker-compose غير موجود (متوقع)" || check_warn "docker-compose موجود — قبل Phase 1؟"

# ── 5. وثائق Migration ─────────────────────────────────────────────
section "5. Migration Documentation"

[ -d "docs/server-migration" ]   && check_pass "docs/server-migration/ موجود" || check_fail "docs/server-migration/ مفقود"

DOCS=(
  "docs/server-migration/ZAD_CURRENT_DATA_AUDIT.md"
  "docs/server-migration/ZAD_TARGET_DATABASE_DESIGN.md"
  "docs/server-migration/ZAD_MIGRATION_MAPPING.md"
  "docs/server-migration/ZAD_SERVER_CONVERSION_PLAN.md"
  "docs/server-migration/ZAD_API_BOUNDARY_DRAFT.md"
  "docs/server-migration/ZAD_RISKS_AND_DECISIONS.md"
  "docs/server-migration/ZAD_MIGRATION_DECISIONS_v0.md"
  "docs/server-migration/ZAD_SPRINT_Z0_CLOSURE.md"
)

for doc in "${DOCS[@]}"; do
  [ -f "$doc" ] && check_pass "$doc موجود" || check_warn "$doc مفقود بعد"
done

# ── 6. Script نفسه ─────────────────────────────────────────────────
section "6. Verification Script"

[ -f "scripts/verify-zad-baseline.sh" ] \
                                 && check_pass "verify-zad-baseline.sh موجود" || check_fail "verify-zad-baseline.sh مفقود"

# ── 7. Git Repository ──────────────────────────────────────────────
section "7. Git Repository"

if git rev-parse --git-dir > /dev/null 2>&1; then
  check_pass "Git repository موجود"

  # آخر commit (بدون كشف secrets)
  LAST_COMMIT=$(git log --oneline -1 2>/dev/null || echo "N/A")
  echo -e "         آخر commit: ${YELLOW}${LAST_COMMIT}${NC}"

  # Tag baseline
  if git tag --list | grep -q "v1.0-pre-server-migration"; then
    check_pass "Tag v1.0-pre-server-migration موجود"
    TAG_COMMIT=$(git rev-list -n 1 v1.0-pre-server-migration 2>/dev/null | cut -c1-7)
    echo -e "         Tag commit: ${YELLOW}${TAG_COMMIT}${NC}"
  else
    check_fail "Tag v1.0-pre-server-migration مفقود"
  fi

  # Git status
  STATUS=$(git status --short 2>/dev/null)
  if [ -z "$STATUS" ]; then
    check_pass "Repo clean — لا ملفات معلقة"
  else
    check_warn "Repo ليس clean — ملفات غير مُكوَّمة:"
    echo "$STATUS" | head -10
  fi

else
  check_fail "ليس Git repository — تحقق من المسار"
fi

# ── 8. فحص أمني خفيف (بدون طباعة قيم) ───────────────────────────
section "8. Basic Security Checks"

# تحقق أن لا secrets مكشوفة في firebase-init.js بطريقة غير مقصودة
# ملاحظة: Firebase config عام بطبيعته — هذا فقط للتحقق من وجود الملف
if [ -f "js/firebase-init.js" ]; then
  check_pass "firebase-init.js موجود — Firebase Config (public by design)"
fi

# تحقق أن VAPID_KEY لا يزال placeholder (لم يُضف فعلياً)
if [ -f "js/firebase-push.js" ]; then
  if grep -q "REPLACE_WITH_YOUR_VAPID_PUBLIC_KEY" "js/firebase-push.js" 2>/dev/null; then
    check_warn "VAPID_KEY لا يزال placeholder في firebase-push.js — يحتاج إعداد في Phase 6"
  else
    check_pass "VAPID_KEY مُعدَّل في firebase-push.js"
  fi
fi

# تحقق أن لا .env في الريبو
if git ls-files | grep -q "^\.env$" 2>/dev/null; then
  check_fail ".env مُضاف للـ Git — خطر أمني!"
else
  check_pass ".env غير موجود في Git tracking"
fi

# ── ملخص النهائي ──────────────────────────────────────────────────
echo ""
echo -e "${BLUE}══════════════════════════════════════════════════════${NC}"
echo -e "  📊 النتيجة النهائية:"
echo -e "     ${GREEN}✅ PASS: $PASS${NC}"
echo -e "     ${YELLOW}⚠️  WARN: $WARN${NC}"
echo -e "     ${RED}❌ FAIL: $FAIL${NC}"
echo -e "${BLUE}══════════════════════════════════════════════════════${NC}"

if [ "$FAIL" -eq 0 ]; then
  if [ "$WARN" -eq 0 ]; then
    echo -e "${GREEN}  🎉 Sprint Z0 Baseline: PASS (Clean)${NC}"
  else
    echo -e "${GREEN}  ✅ Sprint Z0 Baseline: PASS (with warnings — review above)${NC}"
  fi
  exit 0
else
  echo -e "${RED}  ❌ Sprint Z0 Baseline: FAIL — يجب إصلاح الـ FAILs قبل المتابعة${NC}"
  exit 1
fi
