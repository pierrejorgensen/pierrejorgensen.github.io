#!/usr/bin/env node
/**
 * Google OAuth setup for Slides + Drive.
 *
 * One-time Google Cloud setup:
 * 1. https://console.cloud.google.com/ → create or pick a project
 * 2. APIs & Services → Library → enable "Google Slides API" and "Google Drive API"
 * 3. APIs & Services → OAuth consent screen → External → add your email as test user
 * 4. APIs & Services → Credentials → Create credentials → OAuth client ID
 *    - Application type: Desktop app (or Web application with redirect http://localhost:3456/oauth2callback)
 * 5. Copy client ID + secret into .env (see .env.example)
 *
 * Then run: npm run google:auth
 */

const fs = require("fs");
const http = require("http");
const path = require("path");
const { URL } = require("url");
const { google } = require("googleapis");

require("dotenv").config({ path: path.join(__dirname, "..", "..", ".env") });

const TOKEN_PATH = path.join(__dirname, "token.json");
const LOCAL_REDIRECT_URI = "http://127.0.0.1:3456/oauth2callback";
const SCOPES = [
  "https://www.googleapis.com/auth/presentations",
  "https://www.googleapis.com/auth/drive.readonly",
];

function resolveRedirectUri(configuredUri) {
  if (process.env.GOOGLE_REDIRECT_URI) {
    return process.env.GOOGLE_REDIRECT_URI;
  }

  if (
    !configuredUri ||
    configuredUri === "http://localhost" ||
    configuredUri === "http://127.0.0.1"
  ) {
    return LOCAL_REDIRECT_URI;
  }

  const url = new URL(configuredUri);
  if (
    (url.hostname === "localhost" || url.hostname === "127.0.0.1") &&
    !url.port
  ) {
    return LOCAL_REDIRECT_URI;
  }

  return configuredUri;
}

function loadClientSecrets() {
  const credentialsPath =
    process.env.GOOGLE_CREDENTIALS_PATH ||
    path.join(__dirname, "credentials.json");

  if (fs.existsSync(credentialsPath)) {
    const json = JSON.parse(fs.readFileSync(credentialsPath, "utf8"));
    const installed = json.installed || json.web;
    if (!installed?.client_id || !installed?.client_secret) {
      throw new Error(
        `Invalid credentials file at ${credentialsPath}. Expected OAuth client JSON from Google Cloud.`,
      );
    }
    return {
      clientId: installed.client_id,
      clientSecret: installed.client_secret,
      redirectUri: resolveRedirectUri(installed.redirect_uris?.[0]),
    };
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    console.error(`
Google OAuth is not configured yet.

Option A — put credentials in .env:
  GOOGLE_CLIENT_ID=...
  GOOGLE_CLIENT_SECRET=...

Option B — download OAuth client JSON from Google Cloud and save as:
  scripts/google/credentials.json
  (or set GOOGLE_CREDENTIALS_PATH)

See the comment block at the top of scripts/google/auth.js for Cloud Console steps.
`);
    process.exit(1);
  }

  return {
    clientId,
    clientSecret,
    redirectUri: resolveRedirectUri(process.env.GOOGLE_REDIRECT_URI),
  };
}

function createOAuthClient() {
  const { clientId, clientSecret, redirectUri } = loadClientSecrets();
  return new google.auth.OAuth2(clientId, clientSecret, redirectUri);
}

function getAuthUrl(oauth2Client) {
  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    prompt: "consent",
  });
}

function saveToken(token) {
  fs.writeFileSync(TOKEN_PATH, JSON.stringify(token, null, 2));
  console.log(`Saved token to ${TOKEN_PATH}`);
}

function loadSavedToken() {
  if (!fs.existsSync(TOKEN_PATH)) {
    return null;
  }
  return JSON.parse(fs.readFileSync(TOKEN_PATH, "utf8"));
}

async function exchangeCode(oauth2Client, code) {
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  saveToken(tokens);
  return oauth2Client;
}

function waitForAuthCode(oauth2Client, authUrl, redirectUri) {
  const callbackUrl = new URL(redirectUri);
  const port = Number(callbackUrl.port);
  if (!port || port < 1024) {
    throw new Error(
      `Redirect URI must use a port above 1023 (got ${redirectUri}).`,
    );
  }

  return new Promise((resolve, reject) => {
    const server = http.createServer(async (req, res) => {
      try {
        const reqUrl = new URL(req.url, redirectUri);
        if (reqUrl.pathname !== callbackUrl.pathname) {
          res.writeHead(404);
          res.end("Not found");
          return;
        }

        const error = reqUrl.searchParams.get("error");
        if (error) {
          res.writeHead(400, { "Content-Type": "text/html; charset=utf-8" });
          res.end(`<p>Authorization failed: ${error}</p>`);
          reject(new Error(`Authorization failed: ${error}`));
          server.close();
          return;
        }

        const code = reqUrl.searchParams.get("code");
        if (!code) {
          res.writeHead(400, { "Content-Type": "text/html; charset=utf-8" });
          res.end("<p>Missing authorization code.</p>");
          reject(new Error("Missing authorization code"));
          server.close();
          return;
        }

        await exchangeCode(oauth2Client, code);
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        res.end(
          "<p>Google authorization succeeded. You can close this tab and return to the terminal.</p>",
        );
        resolve(oauth2Client);
        server.close();
      } catch (err) {
        reject(err);
        server.close();
      }
    });

    server.listen(port, "127.0.0.1", () => {
      console.log("Opening browser for Google sign-in...");
      console.log(`If it does not open, visit:\n${authUrl}\n`);
      import("open")
        .then(({ default: open }) => open(authUrl))
        .catch(() => {
          // Browser open is optional; URL is printed above.
        });
    });

    server.on("error", reject);
  });
}

async function authorizeInteractive() {
  const { redirectUri } = loadClientSecrets();
  const oauth2Client = createOAuthClient();
  const saved = loadSavedToken();

  if (saved) {
    oauth2Client.setCredentials(saved);
    if (saved.expiry_date && saved.expiry_date <= Date.now()) {
      if (!saved.refresh_token) {
        console.log("Token expired and no refresh token saved. Re-authorizing...");
      } else {
        try {
          const { credentials } = await oauth2Client.refreshAccessToken();
          oauth2Client.setCredentials(credentials);
          saveToken(credentials);
          console.log("Refreshed access token.");
          return oauth2Client;
        } catch {
          console.log("Refresh failed. Re-authorizing...");
        }
      }
    } else {
      console.log("Using saved token.");
      return oauth2Client;
    }
  }

  const authUrl = getAuthUrl(oauth2Client);
  return waitForAuthCode(oauth2Client, authUrl, redirectUri);
}

async function getAuthorizedClient() {
  const oauth2Client = createOAuthClient();
  const saved = loadSavedToken();
  if (!saved) {
    throw new Error(
      "No Google token found. Run: npm run google:auth",
    );
  }

  oauth2Client.setCredentials(saved);
  if (saved.expiry_date && saved.expiry_date <= Date.now()) {
    if (!saved.refresh_token) {
      throw new Error(
        "Google token expired. Run: npm run google:auth",
      );
    }
    const { credentials } = await oauth2Client.refreshAccessToken();
    oauth2Client.setCredentials(credentials);
    saveToken(credentials);
  }

  return oauth2Client;
}

async function main() {
  await authorizeInteractive();
  console.log("Google account connected.");
}

if (require.main === module) {
  main().catch((err) => {
    console.error(err.message || err);
    process.exit(1);
  });
}

module.exports = {
  SCOPES,
  TOKEN_PATH,
  authorizeInteractive,
  getAuthorizedClient,
};
