#!/usr/bin/env bash
# Regenerates the whole data layer from data/_source/. Idempotent.
#   ./scripts/bootstrap/run_all.sh
set -euo pipefail
cd "$(dirname "$0")/../.."
for step in extract_wp build_url_map build_cities annotate_geo reconcile; do
  echo "── $step"
  python3 "scripts/bootstrap/$step.py"
  echo
done
echo "data layer rebuilt."
