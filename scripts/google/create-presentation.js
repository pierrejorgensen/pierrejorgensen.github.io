#!/usr/bin/env node
/**
 * Create a blank Google Slides deck.
 *
 * Usage:
 *   npm run google:slides -- "My deck title"
 */

const { google } = require("googleapis");
const { getAuthorizedClient } = require("./auth");

async function main() {
  const title = process.argv.slice(2).join(" ").trim() || "Untitled presentation";
  const auth = await getAuthorizedClient();
  const slides = google.slides({ version: "v1", auth });
  const drive = google.drive({ version: "v3", auth });

  const { data: presentation } = await slides.presentations.create({
    requestBody: { title },
  });

  const { data: file } = await drive.files.get({
    fileId: presentation.presentationId,
    fields: "id,name,webViewLink",
  });

  console.log(file.webViewLink);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
