#!/usr/bin/env node
/**
 * Find a Google Slides presentation by name.
 * Usage: node scripts/google/find-presentation.js "Deck title"
 */

const { google } = require("googleapis");
const { getAuthorizedClient } = require("./auth");

async function main() {
  const query = process.argv.slice(2).join(" ").trim();
  if (!query) {
    console.error('Usage: node scripts/google/find-presentation.js "Deck title"');
    process.exit(1);
  }

  const auth = await getAuthorizedClient();
  const drive = google.drive({ version: "v3", auth });

  const { data } = await drive.files.list({
    q: `name contains '${query.replace(/'/g, "\\'")}' and mimeType='application/vnd.google-apps.presentation' and trashed=false`,
    fields: "files(id,name,webViewLink,modifiedTime,owners(displayName))",
    orderBy: "modifiedTime desc",
    pageSize: 10,
  });

  if (!data.files?.length) {
    console.log("No presentations found.");
    return;
  }

  for (const file of data.files) {
    console.log(JSON.stringify(file, null, 2));
  }
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
