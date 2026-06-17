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

HTML_COUNT="$(find "${SITE_DIR}" -name '*.html' | wc -l | tr -d ' ')"
if [[ "${HTML_COUNT}" == "0" ]]; then
  echo "No HTML files found under ${SITE_DIR}." >&2
  exit 1
fi

echo "Encrypting ${HTML_COUNT} HTML file(s) in ${SITE_DIR}..."

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

if ! grep -q 'staticrypt-html' "${SITE_DIR}/index.html"; then
  echo "Encryption verification failed: ${SITE_DIR}/index.html is not password-protected." >&2
  exit 1
fi

echo "Encryption verified."
