#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUTPUT_SITE="${1:-${ROOT_DIR}/_site}"
STATICRYPT_CLI="${ROOT_DIR}/node_modules/staticrypt/cli/index.js"

cd "${ROOT_DIR}"

if [[ -z "${STATICRYPT_PASSWORD:-}" ]]; then
  echo "Set STATICRYPT_PASSWORD before encrypting." >&2
  exit 1
fi

if [[ ! -d "${OUTPUT_SITE}" ]]; then
  echo "Site directory not found: ${OUTPUT_SITE}" >&2
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

if [[ ! -f "${OUTPUT_SITE}/index.html" ]]; then
  echo "Missing ${OUTPUT_SITE}/index.html" >&2
  exit 1
fi

HTML_COUNT=0
while IFS= read -r html_file; do
  HTML_COUNT=$((HTML_COUNT + 1))
done < <(find "${OUTPUT_SITE}" -name '*.html')

if [[ "${HTML_COUNT}" == "0" ]]; then
  echo "No HTML files found under ${OUTPUT_SITE}." >&2
  exit 1
fi

echo "Encrypting ${HTML_COUNT} HTML file(s)..."

WORK_DIR="$(mktemp -d)"
cp -a "${OUTPUT_SITE}/." "${WORK_DIR}/"
chmod -R u+w "${WORK_DIR}"

STATICRYPT_ARGS=(
  --short
  --template-title "Per Pierre Jorgensen"
  --template-instructions "Enter the portfolio password to view this page."
  --template-placeholder "Password"
  --template-button "Continue"
  --template-color-primary "#e3660e"
  --template-color-secondary "#f9f9f9"
  --template-error "Incorrect password."
  --remember 30
)

while IFS= read -r html_file; do
  echo "  ${html_file#"${WORK_DIR}/"}"
  node "${STATICRYPT_CLI}" "${STATICRYPT_ARGS[@]}" "${html_file}" -d "$(dirname "${html_file}")"
done < <(find "${WORK_DIR}" -name '*.html')

chmod -R u+w "${OUTPUT_SITE}" || true
rsync -a --delete "${WORK_DIR}/" "${OUTPUT_SITE}/"
rm -rf "${WORK_DIR}"

grep -q staticrypt-html "${OUTPUT_SITE}/index.html"
echo "Encryption verified."
