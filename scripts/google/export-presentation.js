#!/usr/bin/env node
/**
 * Export presentation via Slides API only (no Drive metadata).
 */

const fs = require("fs");
const path = require("path");
const { google } = require("googleapis");
const { getAuthorizedClient } = require("./auth");

async function main() {
  const presentationId = process.argv[2];
  const outputPath =
    process.argv[3] ||
    path.join(__dirname, "presentation-export.json");

  if (!presentationId) {
    console.error("Usage: node scripts/google/export-presentation.js <presentationId>");
    process.exit(1);
  }

  const auth = await getAuthorizedClient();
  const slides = google.slides({ version: "v1", auth });
  const { data: presentation } = await slides.presentations.get({
    presentationId,
  });

  fs.writeFileSync(outputPath, JSON.stringify(presentation, null, 2));
  console.log(`Title: ${presentation.title}`);
  console.log(`Slides: ${presentation.slides.length}`);
  console.log(`Saved: ${outputPath}`);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
