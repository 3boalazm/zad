#!/usr/bin/env bash
# ============================================================
# ZAD — Z5.1 Server Sprint Label Patch
# Fixes: startup log shows sprint:"Z4" instead of sprint:"Z5"
# Run from: /opt/codeandcanvas/apps/zad/api
#
# Root cause: src/server.ts line ~48 still has sprint: 'Z4'
# from Z4 sprint. Z5 updated auth.router.ts but missed server.ts.
# ============================================================
set -euo pipefail

cd /opt/codeandcanvas/apps/zad/api

echo "=== Z5.1 Sprint Label Patch ==="

# 1. Verify we're in the right place
if [ ! -f src/server.ts ]; then
  echo "ERROR: src/server.ts not found. Run from api/ root."
  exit 1
fi

# 2. Check current state
CURRENT=$(grep -n "sprint:" src/server.ts | head -5)
echo "Current sprint labels in src/server.ts:"
echo "$CURRENT"

# 3. Replace sprint: 'Z4' with sprint: 'Z5'
# Uses sed — safe because it's a simple string replace
if grep -q "sprint: 'Z4'" src/server.ts; then
  sed -i "s/sprint: 'Z4'/sprint: 'Z5'/g" src/server.ts
  echo "✓ Patched src/server.ts: sprint Z4 → Z5"
else
  echo "⚠ sprint: 'Z4' not found in src/server.ts — already patched or different format"
  grep -n "sprint" src/server.ts || echo "  (no sprint label found)"
fi

# 4. Rebuild
echo ""
echo "=== Rebuilding dist/ ==="
npm run build

if [ $? -eq 0 ]; then
  echo "✓ Build: PASS"
else
  echo "✗ Build: FAIL"
  exit 1
fi

# 5. Verify patch in dist
echo ""
echo "=== Verify in dist/server.js ==="
if grep -q "sprint.*Z5" dist/server.js; then
  echo "✓ dist/server.js: sprint Z5 confirmed"
else
  echo "✗ dist/server.js: sprint Z5 NOT found"
  grep "sprint" dist/server.js | head -5
fi

# 6. Quick typecheck
echo ""
echo "=== Typecheck ==="
npm run typecheck && echo "✓ Typecheck: PASS"

echo ""
echo "=== Patch Complete ==="
echo "Restart API server for changes to take effect:"
echo "  kill <PID> && node dist/server.js &"
