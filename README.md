# pierrejorgensen.github.io

Portfolio site for Per "Pierre" Jørgensen.

## How the site is built

This is a plain static site — no Jekyll. Source pages live at the repo root (`index.html`, `p/*.html`) and pull shared fragments from `_includes/` (head, header, footer). A small Python build script assembles everything into `_site/` for deployment.

## Password protection

The live site is encrypted with [StatiCrypt](https://github.com/robinmoisson/staticrypt) during deployment. Source HTML stays unencrypted for editing; GitHub Actions builds the site, encrypts every HTML page, and deploys the result to GitHub Pages.

### GitHub setup

1. Open **Settings → Pages**.
2. Set **Build and deployment → Source** to **GitHub Actions**.
3. Choose the **Deploy password-protected site** workflow (not the default Jekyll workflow).

Password: `unicorn` (also set as `STATICRYPT_PASSWORD` in the deploy workflow).

### Local preview

```bash
npm install
npm run build
export STATICRYPT_PASSWORD='unicorn'
npm run encrypt
```

Serve `_site/` over HTTPS or localhost to test the password prompt.

### Notes

- Append `#staticrypt_logout` to any URL to clear the saved password.
- The salt in `.staticrypt.json` is committed so “Remember me” works across pages between deploys.
