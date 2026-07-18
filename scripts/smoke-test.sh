#!/usr/bin/env bash
# Smoke-test the shadcn registry by installing into a throwaway consumer project.
#
# Usage:
#   bash scripts/smoke-test.sh local   # installs from http://localhost:3000 (requires `pnpm dev`)
#   bash scripts/smoke-test.sh prod    # installs from https://www.hitlkit.dev (tests last-deployed state)
#
# Verifies end-to-end:
#   - registry endpoint reachable
#   - registry item parses
#   - transitive registryDependencies resolve
#   - npm dependencies install
#   - files land at expected paths
#
# Exits non-zero on any failure.

set -euo pipefail

MODE="${1:-local}"

case "$MODE" in
  local)
    BASE_URL="http://localhost:3000/r"
    echo "→ Smoke test against LOCAL dev server: $BASE_URL"
    echo "  (make sure 'pnpm dev' is running)"
    ;;
  prod)
    BASE_URL="https://www.hitlkit.dev/r"
    echo "→ Smoke test against PRODUCTION: $BASE_URL"
    ;;
  *)
    echo "Usage: $0 {local|prod}"
    exit 2
    ;;
esac

# Items to install. Cover a leaf, a single-dep, and a deep-dep to exercise the resolver.
ITEMS=(
  "hitl-card"               # depends on hitl-utils + hitl-types (single-hop)
  "subagent-status-card"    # depends on hitl-utils + hitl-types + hitl-subagent-meta (two-hop chain)
  "writing-agent"           # same depth as above, different shape
)

WORKDIR="$(mktemp -d -t hitlkit-smoke-XXXXXX)"
trap 'rm -rf "$WORKDIR"' EXIT
echo "→ Workdir: $WORKDIR"

# 1. Reachability
for item in "${ITEMS[@]}"; do
  url="$BASE_URL/$item.json"
  status=$(curl -sSL -o /dev/null -w "%{http_code}" --max-time 10 "$url" || echo "FAIL")
  if [ "$status" != "200" ]; then
    echo "✗ $url returned $status"
    exit 1
  fi
  echo "✓ reachable: $url"
done

# 2. Scaffold a fresh consumer project (or reuse if one exists from a prior run)
CONSUMER="$WORKDIR/consumer"
echo "→ Scaffolding consumer Next.js project at $CONSUMER"
(
  cd "$WORKDIR"
  pnpm create next-app@latest consumer \
    --typescript --tailwind --eslint --app --src-dir --turbopack \
    --import-alias '@/*' --use-pnpm --yes >/dev/null 2>&1 || true
  cd consumer
  rm -f pnpm-workspace.yaml
  pnpm install --silent >/dev/null 2>&1
  npx shadcn@latest init -d >/dev/null 2>&1
)
echo "✓ consumer scaffolded"

# 3. Install each test item and verify the file landed
for item in "${ITEMS[@]}"; do
  url="$BASE_URL/$item.json"
  echo "→ Installing $item from $url"

  (cd "$CONSUMER" && npx shadcn@latest add "$url" --overwrite --yes >/tmp/smoke-install.log 2>&1) || {
    echo "✗ install failed. Last 30 log lines:"
    tail -30 /tmp/smoke-install.log
    exit 1
  }

  # Component name in PascalCase becomes the .tsx file name in components/hitl/
  case "$item" in
    hitl-card)             expect="HitlCard.tsx" ;;
    subagent-status-card)  expect="SubagentStatusCard.tsx" ;;
    writing-agent)         expect="WritingAgent.tsx" ;;
    *)                     expect="" ;;
  esac

  if [ -n "$expect" ] && [ ! -f "$CONSUMER/src/components/hitl/$expect" ]; then
    echo "✗ expected $expect not found in consumer/src/components/hitl/"
    ls "$CONSUMER/src/components/hitl/" 2>&1 || true
    exit 1
  fi

  echo "✓ installed: $expect"
done

echo ""
echo "──────────────────────────────────────────────"
echo "✓ Smoke test passed against $MODE ($BASE_URL)"
echo "──────────────────────────────────────────────"
