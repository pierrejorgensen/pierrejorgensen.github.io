#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SITE_DIR="${1:-${ROOT_DIR}/_site}"
STATICRYPT_CLI="${ROOT_DIR}/node_modules/staticrypt/cli/index.js"
PASSWORD="${STATICRYPT_PASSWORD:-unicorn}"

cd "${ROOT_DIR}"

if [[ ! -d "${SITE_DIR}" ]]; then
  echo "Site directory not found: ${SITE_DIR}" >&2
  exit 1
fi

if [[ ! -f "${STATICRYPT_CLI}" ]]; then
  echo "StatiCrypt not found at ${STATICRYPT_CLI}. Run npm ci first." >&2
  exit 1
fi

if [[ ! -f "${ROOT_DIR}/.staticrypt.json" ]]; then
  echo "Missing ${ROOT_DIR}/.staticrypt.json" >&2
  exit 1
fi

if [[ ! -f "${SITE_DIR}/index.html" ]]; then
  echo "Missing ${SITE_DIR}/index.html" >&2
  exit 1
fi

shopt -s nullglob
site_entries=("${SITE_DIR}"/*)
if ((${#site_entries[@]} == 0)); then
  echo "No files matched ${SITE_DIR}/* for encryption." >&2
  exit 1
fi

echo "Encrypting HTML under ${SITE_DIR}..."

node "${STATICRYPT_CLI}" "${site_entries[@]}" -r -d "${SITE_DIR}" \
  -p "${PASSWORD}" \
  --short \
  --template-title "Per Pierre Jorgensen" \
  --template-instructions "Enter the portfolio password to view this page." \
  --template-placeholder "Password" \
  --template-button "Continue" \
  --template-color-primary "#e3660e" \
  --template-color-secondary "#f9f9f9" \
  --template-error "Incorrect password." \
  --remember 30

grep -q staticrypt-html "${SITE_DIR}/index.html"
echo "Encryption verified."
