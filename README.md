# pierrejorgensen.github.io

Portfolio site for Per "Pierre" Jørgensen.

## Password protection

The live site is encrypted with [StatiCrypt](https://github.com/robinmoisson/staticrypt) during deployment. Source HTML in this repo stays unencrypted for editing; GitHub Actions builds the Jekyll site, encrypts every HTML page, and deploys the result to GitHub Pages.

### One-time GitHub setup

1. In the repo on GitHub, open **Settings → Secrets and variables → Actions** and add a repository secret:
   - Name: `STATICRYPT_PASSWORD`
   - Value: your portfolio password
2. Open **Settings → Pages** and set **Build and deployment → Source** to **GitHub Actions** (not “Deploy from a branch”).

After that, every push to `main` rebuilds and redeploys the password-protected site.

### Local encryption test

```bash
npm install
bundle install
bundle exec jekyll build --destination _site
export STATICRYPT_PASSWORD='your-password-here'
npm run encrypt
```

Then open files under `_site/` in a browser via a local web server (StatiCrypt requires HTTPS or localhost).

### Notes

- Use a password you are comfortable sharing with portfolio viewers. StatiCrypt decrypts in the browser; this is suitable for casual access control, not highly sensitive data.
- The salt in `.staticrypt.json` is committed so “Remember me” works across pages between deploys.
- Append `#staticrypt_logout` to any page URL to clear the saved password.
