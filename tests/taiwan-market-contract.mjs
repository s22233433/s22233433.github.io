import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";

const root = path.resolve(import.meta.dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const slug = "taiwan-influencer-marketing";
const baseline = {
  "index.html": "eac63790f5a7ff1b55e494eaae02a3b64c4f6b11c8f127db1ccc1893b9423881",
  "zh-tw/index.html": "100036306a59f15142a227c614f0ac22b6e5c9639198f5a03cba292c451323db",
  "zh-cn/index.html": "88a9b21a8877a8aa8bfda449c3e276c31b7da19fee893f0e8d3e749fe755cc50",
  "en/index.html": "3a56b7b1db9897d9a9847b84d1493484bfb6e9d8f295395a7ec44f28e6538d17"
};
// Approved launch scope freezes all homepage bytes at e2404f4.
for (const [file, hash] of Object.entries(baseline)) {
  assert.equal(createHash("sha256").update(read(file)).digest("hex"), hash, `${file} must remain unchanged`);
}
for (const prefix of ["", "zh-cn/", "en/"]) {
  const url = `https://zhenguocool.com/${prefix}services/${slug}/`;
  const html = read(`${prefix}services/${slug}/index.html`);
  const graph = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])["@graph"];
  assert.deepEqual(graph.find((node) => node["@type"] === "Service").areaServed, ["Taiwan"]);
  const questions = graph.find((node) => node["@type"] === "FAQPage").mainEntity;
  assert.equal(questions.length, 6);
  for (const question of questions) {
    assert.ok(html.includes(question.name), "Schema FAQ must be visible");
    assert.ok(html.includes(question.acceptedAnswer.text), "Schema answer must be visible");
  }
  assert.ok(html.includes(`rel="canonical" href="${url}"`));
  assert.ok(read("sitemap.xml").includes(`<loc>${url}</loc>`));
  const contact = `https://zhenguocool.com/${prefix || "zh-tw/"}#lead-form`;
  assert.equal(html.split(`href="${contact}"`).length - 1, 3);
  assert.match(read(`${prefix || "zh-tw/"}index.html`), /id="lead-form"/);
  assert.match(read(`${prefix || "zh-tw/"}index.html`), /name="messaging_id"/);
  for (const entry of ["china-brands-taiwan-influencer-marketing", "taiwan-kol-koc-selection-guide", "taiwan-influencer-campaign-brief-checklist", "taiwan-influencer-marketing-costs-2026"]) {
    assert.ok(read(`${prefix}insights/${entry}/index.html`).includes(`href="${url}"`));
  }
  assert.ok(read(`${prefix}services/influencer-marketing-agency/index.html`).includes(`href="${url}"`));
  for (const caseSlug of ["camay-curling-iron", "liming-weiquan-cheer"]) {
    assert.ok(html.includes(`href="https://zhenguocool.com/${prefix}cases/${caseSlug}/"`));
    assert.ok(read(`${prefix}cases/${caseSlug}/index.html`).includes(`href="${url}"`));
  }
  assert.ok(!html.includes("korea-kol-goodme"), "Do not present Korean audience work as Taiwan proof");
  assert.equal((html.match(/data-track-location="taiwan-service-case"/g) || []).length, 2);
}
console.log("Taiwan market contract: pass (3 routes, 4 unchanged homepages, contextual links and real form anchors)");
