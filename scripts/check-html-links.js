#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");

const pages = [
  path.join(__dirname, "..", "index.html"),
  path.join(__dirname, "..", "nebras-v3", "index.html"),
];

const anchorPattern = /<a\b[^>]*\bhref\s*=\s*["']([^"']*)["'][^>]*>/gi;
const idPattern = /\bid\s*=\s*["']([^"']+)["']/gi;
const failures = [];
const placeholders = [];

for (const pagePath of pages) {
  const html = fs.readFileSync(pagePath, "utf8");
  const ids = new Set();
  let match;

  while ((match = idPattern.exec(html)) !== null) {
    ids.add(match[1]);
  }

  anchorPattern.lastIndex = 0;
  while ((match = anchorPattern.exec(html)) !== null) {
    const href = match[1].trim();
    if (href === "#") {
      placeholders.push(`${path.relative(process.cwd(), pagePath)}: placeholder href="#"`);
      continue;
    }
    if (href.startsWith("#") && !ids.has(href.slice(1))) {
      failures.push(`${path.relative(process.cwd(), pagePath)}: missing internal target ${href}`);
    }
  }
}

console.log(`Checked ${pages.length} HTML pages.`);
console.log(`Placeholder links: ${placeholders.length}`);
if (placeholders.length > 0) {
  console.log("Placeholder links remain documented for follow-up:");
  for (const item of placeholders.slice(0, 20)) console.log(`- ${item}`);
  if (placeholders.length > 20) console.log(`- ...and ${placeholders.length - 20} more`);
}

if (failures.length > 0) {
  console.error("Broken internal anchors:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log("No broken internal anchors found.");
}
