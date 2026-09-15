#!/usr/bin/env node
/**
 * Read slide structure and text from a presentation.
 * Usage: node scripts/google/read-presentation.js <presentationId>
 */

const { google } = require("googleapis");
const { getAuthorizedClient } = require("./auth");

function textFromShape(element) {
  const parts = [];
  for (const el of element.pageElements || []) {
    if (el.shape?.text?.textElements) {
      for (const te of el.shape.text.textElements) {
        if (te.textRun?.content) {
          parts.push(te.textRun.content);
        }
      }
    }
  }
  return parts.join("").trim();
}

async function main() {
  const presentationId = process.argv[2];
  if (!presentationId) {
    console.error("Usage: node scripts/google/read-presentation.js <presentationId>");
    process.exit(1);
  }

  const auth = await getAuthorizedClient();
  const slides = google.slides({ version: "v1", auth });

  const { data } = await slides.presentations.get({ presentationId });

  console.log(`Title: ${data.title}`);
  console.log(`Slides: ${data.slides.length}\n`);

  data.slides.forEach((slide, index) => {
    const text = textFromShape(slide);
    const layout = slide.slideProperties?.layoutObjectId || "unknown";
    console.log(`--- Slide ${index + 1} (${slide.objectId}) layout=${layout} ---`);
    console.log(text || "(no text)");
    console.log();
  });

  // Also dump layout/master info for template understanding
  if (data.layouts?.length) {
    console.log("\n=== Layouts ===");
    for (const layout of data.layouts) {
      const text = textFromShape(layout);
      console.log(`${layout.objectId}: ${text.slice(0, 120) || "(no placeholder text)"}`);
    }
  }
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
