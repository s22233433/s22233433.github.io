import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const baseUrl = "https://zhenguocool.com";
const pages = [
  ["careers/index.html", "/careers/"],
  ["zh-tw/careers/index.html", "/zh-tw/careers/"],
  ["zh-cn/careers/index.html", "/zh-cn/careers/"],
  ["en/careers/index.html", "/en/careers/"]
];
const sitemap = fs.readFileSync(path.join(root, "sitemap.xml"), "utf8");

for (const [file, route] of pages) {
  const html = fs.readFileSync(path.join(root, file), "utf8");
  assert.match(html, /<h1>.+<\/h1>/, `${file} has one visible career H1.`);
  assert.match(html, new RegExp(`<link rel="canonical" href="${baseUrl}${route}">`), `${file} is self-canonical.`);
  assert.ok(sitemap.includes(`<loc>${baseUrl}${route}</loc>`), `${file} is in the sitemap.`);
  assert.match(html, /"@type": "FAQPage"/, `${file} includes FAQPage schema.`);
  assert.match(html, /"@type": "BreadcrumbList"/, `${file} includes BreadcrumbList schema.`);
  assert.doesNotMatch(html, /JobPosting/, `${file} does not claim an unverified job posting.`);
  assert.match(html, /data-track-event="contact_click"/, `${file} has a tracked contact CTA.`);
  assert.match(html, /services\/kol-marketing\//, `${file} links a relevant service.`);
  assert.match(html, /cases\/korea-kol-goodme\//, `${file} links a relevant case.`);
}

const rootCareer = fs.readFileSync(path.join(root, "careers/index.html"), "utf8");
for (const field of ["full_name", "email", "career_direction", "experience_background", "introduction", "resume_file", "privacy_consent"]) assert.match(rootCareer, new RegExp(`name="${field}"`), `Career form includes ${field}.`);
for (const field of ["full_name", "email", "career_direction", "experience_background", "introduction", "privacy_consent"]) assert.match(rootCareer, new RegExp(`name="${field}"[^>]*required`), `Career form requires ${field}.`);
assert.match(rootCareer, /action="https:\/\/formsubmit\.co\/ajax\/hr@zhenguocool\.com"/, "Career form forwards basic details to HR through FormSubmit.");
assert.match(rootCareer, /type="email"[^>]+pattern=/, "Career form rejects incomplete email domains before submission.");
assert.match(rootCareer, /name="website"/, "Career form needs a honeypot field.");
assert.match(rootCareer, /data-resume-file/, "Career form exposes a local resume file check.");
assert.match(rootCareer, /10 \* 1024 \* 1024/, "Career form checks the 10 MB attachment ceiling.");
assert.match(rootCareer, /data\.delete\("resume_file"\)/, "Career form never sends resume files through FormSubmit.");
assert.match(rootCareer, /privacy\/passive-analytics\//, "Career form links the existing privacy page.");

console.log("careers contract: pass");
