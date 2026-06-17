#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SITE_DIR="${1:-${ROOT_DIR}/_site}"
STATICRYPT_CLI="${ROOT_DIR}/node_modules/staticrypt/cli/index.js"

cd "${ROOT_DIR}"

if [[ ! -d "${SITE_DIR}" ]]; then
  echo "Site directory not found: ${SITE_DIR}" >&2
  exit 1
fi

if [[ -z "${STATICRYPT_PASSWORD:-}" ]]; then
  echo "Set STATICRYPT_PASSWORD before encrypting." >&2
  exit 1
fi

if [[ ! -f "${STATICRYPT_CLI}" ]]; then
  echo "StatiCrypt not found. Run npm ci first." >&2
  exit 1
fi

if [[ ! -f "${ROOT_DIR}/.staticrypt.json" ]]; then
  echo "Missing ${ROOT_DIR}/.staticrypt.json" >&2
  exit 1
fi

HTML_COUNT="$(find "${SITE_DIR}" -name '*.html' | wc -l | tr -d ' ')"
if [[ "${HTML_COUNT}" == "0" ]]; then
  echo "No HTML files found under ${SITE_DIR}." >&2
  exit 1
fi

echo "Encrypting ${HTML_COUNT} HTML file(s) in ${SITE_DIR}..."

shopt -s nullglob
site_entries=("${SITE_DIR}"/*)
if ((${#site_entries[@]} == 0)); then
  echo "No files matched ${SITE_DIR}/* for encryption." >&2
  find "${SITE_DIR}" -maxdepth 2 -type f | head -20 >&2 || true
  exit 1
fi

node "${STATICRYPT_CLI}" "${site_entries[@]}" -r -d "${SITE_DIR}" \
  --short \
  --template-title 'Per "Pierre" Jørgensen' \
  --template-instructions "Enter the portfolio password to view this page." \
  --template-placeholder "Password" \
  --template-button "Continue" \
  --template-color-primary "#e3660e" \
  --template-color-secondary "#f9f9f9" \
  --template-error "Incorrect password." \
  --remember 30

if ! grep -rl 'staticrypt-html' "${SITE_DIR}" --include='*.html' -q; then
  echo "Encryption verification failed: no password-protected HTML found under ${SITE_DIR}." >&2
  exit 1
fi

echo "Encryption verified."
