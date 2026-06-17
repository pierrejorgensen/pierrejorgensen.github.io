#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SITE_DIR="${1:-${ROOT_DIR}/_site}"

cd "${ROOT_DIR}"

if [[ ! -d "${SITE_DIR}" ]]; then
  echo "Site directory not found: ${SITE_DIR}" >&2
  exit 1
fi

if [[ -z "${STATICRYPT_PASSWORD:-}" ]]; then
  echo "Set STATICRYPT_PASSWORD before encrypting." >&2
  exit 1
fi

npx staticrypt "${SITE_DIR}"/* -r -d "${SITE_DIR}" \
  --short \
  --template-title 'Per "Pierre" Jørgensen' \
  --template-instructions "Enter the portfolio password to view this page." \
  --template-placeholder "Password" \
  --template-button "Continue" \
  --template-color-primary "#e3660e" \
  --template-color-secondary "#f9f9f9" \
  --template-error "Incorrect password." \
  --remember 30
