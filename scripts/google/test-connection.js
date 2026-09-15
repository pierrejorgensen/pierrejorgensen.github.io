#!/usr/bin/env node
/**
 * Verifies Google Slides + Drive access by creating a test presentation.
 */

const { google } = require("googleapis");
const { getAuthorizedClient } = require("./auth");

async function main() {
  const auth = await getAuthorizedClient();
  const slides = google.slides({ version: "v1", auth });
  const drive = google.drive({ version: "v3", auth });

  const { data: presentation } = await slides.presentations.create({
    requestBody: {
      title: `Cursor connection test — ${new Date().toISOString().slice(0, 10)}`,
    },
  });

  const presentationId = presentation.presentationId;
  const { data: file } = await drive.files.get({
    fileId: presentationId,
    fields: "id,name,webViewLink",
  });

  console.log("Connection OK.");
  console.log(`Created: ${file.name}`);
  console.log(`Open: ${file.webViewLink}`);
  console.log(`ID: ${presentationId}`);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
