import assert from 'node:assert/strict';
import { tool as signatureTool } from '../tools/public-tools/email-signature.mjs';
import {
  buildSignature,
  isSafeHttpsUrl,
  normalizeHttpsUrl,
  previewSignatureHtml
} from '../web-assets/public-tools/email-signature.mjs';
import { tool as counterTool } from '../tools/public-tools/script-counter.mjs';
import {
  analyzeText,
  buildSummary,
  estimateSpeech,
  formatDuration,
  normalizeSettings,
  settingsWarnings
} from '../web-assets/public-tools/script-counter.mjs';

for (const tool of [signatureTool, counterTool]) {
  assert.equal(typeof tool.id, 'string');
  assert.equal(typeof tool.slug, 'string');
  assert.equal(typeof tool.body, 'string');
  assert.match(tool.body, /data-tool="/);
  assert.match(tool.script, /^\/web-assets\/public-tools\/.+\.mjs$/);
  assert.ok(Array.isArray(tool.help) && tool.help.length > 0);
  assert.ok(Array.isArray(tool.faqs) && tool.faqs.length > 0);
  assert.ok(Array.isArray(tool.releaseNotes) && tool.releaseNotes.length > 0);
}

assert.equal(normalizeHttpsUrl('https://example.com/path?q=1'), 'https://example.com/path?q=1');
assert.equal(isSafeHttpsUrl('https://example.com/logo.png'), true);
assert.equal(isSafeHttpsUrl('http://example.com/logo.png'), false);
assert.equal(isSafeHttpsUrl('javascript:alert(1)'), false);
assert.equal(isSafeHttpsUrl('https://user:password@example.com/logo.png'), false);

const safeSignature = buildSignature({
  template: 'logo',
  name: '王小明',
  title: '專案經理',
  company: '榛菓行銷',
  email: 'hello@example.com',
  website: 'https://example.com',
  logoUrl: 'https://example.com/logo.png'
});
assert.equal(safeSignature.hasContent, true);
assert.match(safeSignature.html, /<img /);
assert.match(safeSignature.html, /hello%40example/);
assert.match(safeSignature.text, /王小明/);
const safePreview = previewSignatureHtml(safeSignature.html);
assert.match(safePreview, /<span/);
assert.doesNotMatch(safePreview, /href=/i);
assert.match(safeSignature.html, /href=/i);

const maliciousSignature = buildSignature({
  template: 'logo',
  name: '<img src=x onerror=alert(1)>',
  website: 'javascript:alert(1)',
  chatLabel: 'LINE',
  chatUrl: 'https://user:pass@example.com/?onerror=alert(1)',
  logoUrl: 'https://example.com/logo.png'
});
assert.match(maliciousSignature.html, /&lt;img src=x onerror=alert\(1\)&gt;/);
assert.doesNotMatch(maliciousSignature.html, /<img src=x onerror=/);
assert.doesNotMatch(maliciousSignature.html, /javascript:/);
assert.doesNotMatch(maliciousSignature.html, /user:pass/);
assert.ok(maliciousSignature.warnings.length >= 2);

const bilingualSignature = buildSignature({
  template: 'bilingual',
  name: '王小明',
  nameEn: 'Ming Wang',
  titleEn: 'Project Manager'
});
assert.match(bilingualSignature.text, /王小明 \/ Ming Wang/);
assert.match(bilingualSignature.text, /Project Manager/);
assert.doesNotMatch(bilingualSignature.text, / · $/);

const emptySignature = buildSignature({});
assert.equal(emptySignature.html, '');
assert.equal(emptySignature.text, '');
assert.match(buildSignature({ template: 'logo', logoUrl: 'javascript:alert(1)' }).warnings.join(' '), /Logo/);

const mixed = analyzeText('你好，Hello 2026! 👩‍💻\nNext');
assert.equal(mixed.han, 2);
assert.equal(mixed.englishWords, 2);
assert.equal(mixed.numberGroups, 1);
assert.equal(mixed.paragraphCount, 2);
assert.equal(mixed.graphemes, mixed.totalCharacters);
assert.equal(mixed.paragraphs[0].other, 1);

const estimate = estimateSpeech(mixed, {
  hanRate: 300,
  englishRate: 150,
  paragraphPause: 0.5,
  goalSeconds: 60
});
assert.equal(estimate.pauseSeconds, 0.5);
assert.equal(estimate.perParagraph.length, 2);
assert.equal(estimate.totalSeconds, 1.7);
assert.equal(normalizeSettings({ hanRate: 0, englishRate: -1, paragraphPause: -2, goalSeconds: 45 }).hanRate, 300);
assert.ok(settingsWarnings({ hanRate: 0, englishRate: 0 }).length >= 2);
assert.equal(formatDuration(0), '0 秒');
assert.equal(formatDuration(60), '1 分 00 秒');
assert.match(buildSummary(mixed, estimate), /摘要/);
assert.doesNotMatch(buildSummary(mixed, estimate), /你好，Hello/);

console.log('public signature and counter tools pass');
