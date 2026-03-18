#!/usr/bin/env bash
set -euo pipefail

if [ -z "${SYMPHONY_SOURCE_REPO_URL:-}" ]; then
  echo "SYMPHONY_SOURCE_REPO_URL is required." >&2
  exit 1
fi

git clone --depth 1 "${SYMPHONY_SOURCE_REPO_URL}" .
npm ci
