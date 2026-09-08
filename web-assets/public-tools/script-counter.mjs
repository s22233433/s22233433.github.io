const DEFAULT_SETTINGS = Object.freeze({
  hanRate: 300,
  englishRate: 150,
  paragraphPause: 0.5,
  goalSeconds: 60
});
const GOALS = new Set([30, 60, 90]);
const HAN = /\p{Script=Han}/u;
const LATIN_LETTER = /\p{Script=Latin}/u;
const LETTER = /\p{Letter}/u;
const NUMBER = /\p{Number}/u;
const PUNCTUATION = /\p{P}/u;
const WHITESPACE = /\s/u;

function makeSegmenter(locale, granularity) {
  if (typeof Intl === 'undefined' || typeof Intl.Segmenter !== 'function') return null;
  try {
    return new Intl.Segmenter(locale, { granularity });
  } catch {
    return null;
  }
}

export function segmentGraphemes(value) {
  const text = String(value ?? '');
  const segmenter = makeSegmenter('zh-Hant', 'grapheme');
  return segmenter ? Array.from(segmenter.segment(text), item => item.segment) : Array.from(text);
}

function wordSegments(text) {
  const segmenter = makeSegmenter('en', 'word');
  if (segmenter) return Array.from(segmenter.segment(text), item => ({ text: item.segment, isWordLike: item.isWordLike }));
  const matches = text.match(/[\p{Letter}\p{Mark}]+(?:['’][\p{Letter}\p{Mark}]+)*/gu) || [];
  return matches.map(item => ({ text: item, isWordLike: true }));
}

function countCodePoints(text, pattern) {
  let count = 0;
  for (const character of text) if (pattern.test(character)) count += 1;
  return count;
}

function coreCounts(text) {
  const graphemes = segmentGraphemes(text);
  const words = wordSegments(text);
  const englishWords = words.filter(item => item.isWordLike && LATIN_LETTER.test(item.text) && !HAN.test(item.text)).length;
  const numberGroups = (text.match(/\p{Number}+/gu) || []).length;
  const han = graphemes.filter(item => HAN.test(item)).length;
  const whitespace = countCodePoints(text, WHITESPACE);
  const punctuation = countCodePoints(text, PUNCTUATION);
  const other = graphemes.filter(item => !HAN.test(item) && !/^\s+$/u.test(item) && !PUNCTUATION.test(item) && !LETTER.test(item) && !NUMBER.test(item)).length;
  return {
    han,
    englishWords,
    numberGroups,
    whitespace,
    punctuation,
    other,
    graphemes: graphemes.length,
    totalCharacters: graphemes.length
  };
}

export function analyzeText(value = '') {
  const text = String(value ?? '').replace(/\r\n?/gu, '\n');
  const paragraphs = text.split('\n').filter(paragraph => paragraph.trim()).map((paragraph, index) => ({
    index: index + 1,
    preview: paragraph.trim().replace(/\s+/gu, ' ').slice(0, 100),
    ...coreCounts(paragraph)
  }));
  return {
    ...coreCounts(text),
    paragraphCount: paragraphs.length,
    paragraphs
  };
}

function positiveNumber(value, fallback) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : fallback;
}

function nonNegativeNumber(value, fallback) {
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? number : fallback;
}

function roundSeconds(value) {
  return Math.round(value * 10) / 10;
}

export function normalizeSettings(settings = {}) {
  const goal = Number(settings.goalSeconds);
  return {
    hanRate: positiveNumber(settings.hanRate, DEFAULT_SETTINGS.hanRate),
    englishRate: positiveNumber(settings.englishRate, DEFAULT_SETTINGS.englishRate),
    paragraphPause: nonNegativeNumber(settings.paragraphPause, DEFAULT_SETTINGS.paragraphPause),
    goalSeconds: GOALS.has(goal) ? goal : DEFAULT_SETTINGS.goalSeconds
  };
}

export function settingsWarnings(settings = {}) {
  const warnings = [];
  if (!(Number(settings.hanRate) > 0)) warnings.push('中文語速需大於 0，已使用預設值。');
  if (!(Number(settings.englishRate) > 0)) warnings.push('英文語速需大於 0，已使用預設值。');
  if (!(Number(settings.paragraphPause) >= 0)) warnings.push('段落停頓不可為負數，已使用預設值。');
  if (!GOALS.has(Number(settings.goalSeconds))) warnings.push('目標只支援 30、60 或 90 秒，已使用預設值。');
  return warnings;
}

export function estimateSpeech(analysis, settings = {}) {
  const normalized = normalizeSettings(settings);
  const contentSeconds = roundSeconds(analysis.han / normalized.hanRate * 60 + analysis.englishWords / normalized.englishRate * 60);
  const pauseSeconds = roundSeconds(Math.max(0, analysis.paragraphCount - 1) * normalized.paragraphPause);
  const perParagraph = analysis.paragraphs.map(paragraph => ({
    ...paragraph,
    seconds: roundSeconds(paragraph.han / normalized.hanRate * 60 + paragraph.englishWords / normalized.englishRate * 60)
  }));
  return {
    ...normalized,
    contentSeconds,
    pauseSeconds,
    totalSeconds: roundSeconds(contentSeconds + pauseSeconds),
    differenceSeconds: roundSeconds(contentSeconds + pauseSeconds - normalized.goalSeconds),
    perParagraph
  };
}

export function formatDuration(value) {
  const rawSeconds = Math.max(0, Number(value) || 0);
  if (rawSeconds < 60) return (Math.round(rawSeconds * 10) / 10) + ' 秒';
  const seconds = Math.round(rawSeconds);
  return Math.floor(seconds / 60) + ' 分 ' + String(seconds % 60).padStart(2, '0') + ' 秒';
}

function number(value) {
  return Number(value || 0).toLocaleString('zh-TW');
}

export function buildSummary(analysis, estimate) {
  const difference = estimate.differenceSeconds === 0
    ? '剛好達到 ' + estimate.goalSeconds + ' 秒目標'
    : estimate.differenceSeconds > 0
      ? '超過目標 ' + formatDuration(estimate.differenceSeconds)
      : '少於目標 ' + formatDuration(Math.abs(estimate.differenceSeconds));
  return [
    '字數／口播時間摘要',
    '中文字符：' + number(analysis.han),
    '英文詞：' + number(analysis.englishWords),
    '數字組：' + number(analysis.numberGroups),
    '空白：' + number(analysis.whitespace),
    '標點：' + number(analysis.punctuation),
    '總字符：' + number(analysis.graphemes),
    '預估口播時間：' + formatDuration(estimate.totalSeconds),
    '內容時間：' + formatDuration(estimate.contentSeconds) + '；段落停頓：' + formatDuration(estimate.pauseSeconds),
    '目標：' + estimate.goalSeconds + ' 秒；' + difference,
    '段落數：' + number(analysis.paragraphCount)
  ].join('\n');
}

function fallbackCopyText(value) {
  if (typeof document === 'undefined' || typeof document.execCommand !== 'function') return false;
  const textarea = document.createElement('textarea');
  textarea.value = value;
  textarea.setAttribute('readonly', '');
  textarea.setAttribute('aria-hidden', 'true');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.append(textarea);
  textarea.select();
  let copied = false;
  try {
    copied = document.execCommand('copy');
  } catch {
    copied = false;
  }
  textarea.remove();
  return copied;
}

export async function copyText(value) {
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(String(value));
      return true;
    } catch {
      // Use the visible-browser fallback if clipboard permission is denied.
    }
  }
  return fallbackCopyText(String(value));
}

function formValues(form) {
  return Object.fromEntries([...form.querySelectorAll('[name]')].map(input => [input.name, input.value]));
}

function setMetric(root, key, value) {
  const node = root.querySelector('[data-metric="' + key + '"]');
  if (node) node.textContent = value;
}

export function initScriptCounterTool(root = typeof document === 'undefined' ? null : document.querySelector('[data-tool="script-counter"]')) {
  if (!root || root.dataset.counterReady === 'true') return false;
  const form = root.querySelector('#script-counter-form');
  const textarea = root.querySelector('#script-counter-text');
  if (!form || !textarea) return false;
  root.dataset.counterReady = 'true';
  const notice = root.querySelector('#counter-notice');
  const goalNotice = root.querySelector('#counter-goal');
  const total = root.querySelector('#counter-total');
  const paragraphList = root.querySelector('#counter-paragraph-list');
  const paragraphCount = root.querySelector('#counter-paragraph-count');
  let current = { analysis: analyzeText(''), estimate: estimateSpeech(analyzeText(''), DEFAULT_SETTINGS), summary: '' };
  const render = () => {
    const rawSettings = formValues(form);
    current.analysis = analyzeText(textarea.value);
    current.estimate = estimateSpeech(current.analysis, rawSettings);
    current.summary = buildSummary(current.analysis, current.estimate);
    setMetric(root, 'han', number(current.analysis.han));
    setMetric(root, 'englishWords', number(current.analysis.englishWords));
    setMetric(root, 'numberGroups', number(current.analysis.numberGroups));
    setMetric(root, 'whitespace', number(current.analysis.whitespace));
    setMetric(root, 'punctuation', number(current.analysis.punctuation));
    setMetric(root, 'graphemes', number(current.analysis.graphemes));
    setMetric(root, 'duration', formatDuration(current.estimate.totalSeconds));
    setMetric(root, 'durationDetail', '內容 ' + formatDuration(current.estimate.contentSeconds) + ' · 段落停頓 ' + formatDuration(current.estimate.pauseSeconds));
    const warnings = settingsWarnings(rawSettings);
    notice.textContent = warnings.length ? warnings.join(' ') : current.analysis.paragraphCount ? '統計已更新；稿件只留在目前分頁。' : '貼上稿件後會即時更新統計；不會自動保存。';
    notice.dataset.tone = warnings.length ? 'error' : 'info';
    const difference = current.estimate.differenceSeconds;
    goalNotice.textContent = !current.analysis.paragraphCount
      ? '尚未輸入稿件；與目標的差距會顯示在這裡。'
      : difference === 0
        ? '目前估算剛好是 ' + current.estimate.goalSeconds + ' 秒。'
        : difference > 0
          ? '目前估算超過 ' + current.estimate.goalSeconds + ' 秒目標 ' + formatDuration(difference) + '。'
          : '目前估算少於 ' + current.estimate.goalSeconds + ' 秒目標 ' + formatDuration(Math.abs(difference)) + '。';
    goalNotice.dataset.tone = difference > 0 ? 'error' : 'info';
    total.dataset.tone = !current.analysis.paragraphCount ? 'neutral' : difference > 0 ? 'over' : 'under';
    paragraphCount.textContent = current.analysis.paragraphCount + ' 段';
    paragraphList.replaceChildren();
    if (!current.analysis.paragraphCount) {
      const empty = document.createElement('p');
      empty.className = 'counter-empty';
      empty.textContent = '輸入內容後顯示每段的字符與時間。';
      paragraphList.append(empty);
      return;
    }
    current.estimate.perParagraph.forEach(paragraph => {
      const row = document.createElement('article');
      row.className = 'counter-paragraph';
      const copy = document.createElement('div');
      const preview = document.createElement('p');
      preview.textContent = paragraph.preview;
      const detail = document.createElement('span');
      detail.textContent = number(paragraph.han) + ' 中文字符 · ' + number(paragraph.englishWords) + ' 英文詞';
      copy.append(preview, detail);
      const duration = document.createElement('strong');
      duration.textContent = formatDuration(paragraph.seconds);
      row.append(copy, duration);
      paragraphList.append(row);
    });
  };
  form.addEventListener('input', render);
  form.addEventListener('change', render);
  form.addEventListener('reset', () => setTimeout(render, 0));
  root.querySelector('#copy-counter-summary')?.addEventListener('click', async () => {
    render();
    if (!current.analysis.paragraphCount) {
      notice.textContent = '請先輸入至少一段稿件，再複製摘要。';
      notice.dataset.tone = 'error';
      return;
    }
    if (await copyText(current.summary)) {
      notice.textContent = '已複製統計摘要；摘要不包含稿件正文。';
      notice.dataset.tone = 'info';
      try { window.zgToolEvent?.('tool_complete', { format: 'summary' }); } catch {}
    } else {
      notice.textContent = '複製失敗，請稍後再試。';
      notice.dataset.tone = 'error';
    }
  });
  render();
  return true;
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => initScriptCounterTool(), { once: true });
  else initScriptCounterTool();
}
