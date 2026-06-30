import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const outDir = join(process.cwd(), "web-assets", "ai-course");

const images = [
  ["ai-thinking-flow", "AI 思考流程", ["問題", "拆解", "收集", "推理", "答案"], "flow"],
  ["ai-vs-search", "AI vs 搜尋引擎", ["Google", "資料", "AI", "理解", "整理"], "compare"],
  ["ai-workflow", "AI 工作流程", ["想法", "Prompt", "AI", "修正", "完成"], "flow"],
  ["human-ai-collab", "人與 AI 合作", ["人決策", "AI 執行", "人確認"], "loop"],
  ["ai-learning-map", "AI 學習地圖", ["第一課", "第二課", "第三課", "第四課"], "map"],
  ["bad-good-prompt", "Bad Prompt vs Good Prompt", ["模糊", "補背景", "定格式", "可檢查"], "compare"],
  ["prompt-five-elements", "Prompt 五元素", ["角色", "任務", "背景", "限制", "格式"], "orbit"],
  ["ai-ask-first", "AI 先問問題", ["缺資料", "先問", "再回答"], "loop"],
  ["prompt-iteration", "Prompt Iteration", ["Prompt", "AI", "追問", "更好答案"], "flow"],
  ["assistant-vs-agent", "AI 助理 vs AI Agent", ["回一句", "走流程", "用工具", "交結果"], "compare"],
  ["good-ai-tasks", "哪些工作適合 AI", ["重複", "固定", "清楚", "可檢查"], "orbit"],
  ["input-process-check-output", "Input Process Check Output", ["Input", "Process", "Check", "Output"], "flow"],
  ["agent-tool-map", "工具地圖", ["ChatGPT", "Codex", "n8n", "Make", "Zapier", "MCP"], "map"]
];

function escapeXml(value) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function node(x, y, label, i) {
  const fill = i % 2 === 0 ? "#eef6ff" : "#f3f0ff";
  const stroke = i % 2 === 0 ? "#2563eb" : "#7c3aed";
  return `<g>
    <rect x="${x}" y="${y}" width="156" height="72" rx="22" fill="${fill}" stroke="${stroke}" stroke-width="3"/>
    <circle cx="${x + 34}" cy="${y + 36}" r="13" fill="${stroke}" opacity=".9"/>
    <text x="${x + 58}" y="${y + 43}" font-family="PingFang TC, Noto Sans TC, Microsoft JhengHei, sans-serif" font-size="24" font-weight="800" fill="#132238">${escapeXml(label)}</text>
  </g>`;
}

function arrow(x1, y1, x2, y2) {
  return `<path d="M${x1} ${y1} C${(x1 + x2) / 2} ${y1}, ${(x1 + x2) / 2} ${y2}, ${x2} ${y2}" fill="none" stroke="#93b7e8" stroke-width="5" stroke-linecap="round"/>
  <path d="M${x2 - 13} ${y2 - 9} L${x2} ${y2} L${x2 - 13} ${y2 + 9}" fill="none" stroke="#93b7e8" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>`;
}

function renderFlow(title, labels) {
  const startX = 92;
  const y = 302;
  const gap = 198;
  return labels.map((label, i) => node(startX + i * gap, y, label, i)).join("") +
    labels.slice(1).map((_, i) => arrow(startX + 156 + i * gap + 12, y + 36, startX + (i + 1) * gap - 12, y + 36)).join("");
}

function renderCompare(title, labels) {
  return `
    <rect x="110" y="238" width="410" height="230" rx="36" fill="#ffffff" stroke="#c9dcf6" stroke-width="3"/>
    <rect x="680" y="238" width="410" height="230" rx="36" fill="#ffffff" stroke="#d9ccff" stroke-width="3"/>
    <text x="315" y="314" text-anchor="middle" font-family="PingFang TC, Noto Sans TC, Microsoft JhengHei, sans-serif" font-size="38" font-weight="900" fill="#2563eb">${escapeXml(labels[0])}</text>
    <text x="885" y="314" text-anchor="middle" font-family="PingFang TC, Noto Sans TC, Microsoft JhengHei, sans-serif" font-size="38" font-weight="900" fill="#7c3aed">${escapeXml(labels[2] || labels[1])}</text>
    <text x="315" y="386" text-anchor="middle" font-family="PingFang TC, Noto Sans TC, Microsoft JhengHei, sans-serif" font-size="27" fill="#64748b">${escapeXml(labels[1])}</text>
    <text x="885" y="372" text-anchor="middle" font-family="PingFang TC, Noto Sans TC, Microsoft JhengHei, sans-serif" font-size="27" fill="#64748b">${escapeXml(labels[3] || "推理")}</text>
    <text x="885" y="414" text-anchor="middle" font-family="PingFang TC, Noto Sans TC, Microsoft JhengHei, sans-serif" font-size="27" fill="#64748b">${escapeXml(labels[4] || "整理")}</text>
    <text x="600" y="372" text-anchor="middle" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="34" font-weight="900" fill="#132238">VS</text>`;
}

function renderLoop(title, labels) {
  const positions = [[218, 310], [522, 206], [826, 310], [522, 414]];
  const active = labels.length === 3 ? positions.slice(0, 3) : positions;
  return active.map(([x, y], i) => node(x, y, labels[i], i)).join("") +
    arrow(374, 346, 522, 242) + arrow(678, 242, 826, 346) + (labels.length > 3 ? arrow(826, 382, 678, 450) + arrow(522, 450, 374, 382) : "");
}

function renderOrbit(title, labels) {
  const center = `<circle cx="600" cy="348" r="92" fill="#ffffff" stroke="#2563eb" stroke-width="4"/>
  <text x="600" y="358" text-anchor="middle" font-family="PingFang TC, Noto Sans TC, Microsoft JhengHei, sans-serif" font-size="28" font-weight="900" fill="#132238">${escapeXml(title)}</text>`;
  const positions = [[116, 152], [464, 126], [824, 152], [234, 470], [716, 470], [522, 512]];
  return center + labels.map((label, i) => node(positions[i][0], positions[i][1], label, i)).join("") +
    labels.map((_, i) => `<line x1="600" y1="348" x2="${positions[i][0] + 78}" y2="${positions[i][1] + 36}" stroke="#c9dcf6" stroke-width="4" stroke-linecap="round"/>`).join("");
}

function renderMap(title, labels) {
  return labels.map((label, i) => {
    const x = 92 + (i % 3) * 338;
    const y = 230 + Math.floor(i / 3) * 134;
    return node(x, y, label, i);
  }).join("") + labels.slice(1).map((_, i) => {
    const fromX = 92 + (i % 3) * 338 + 156;
    const fromY = 230 + Math.floor(i / 3) * 134 + 36;
    const toX = 92 + ((i + 1) % 3) * 338 - 14;
    const toY = 230 + Math.floor((i + 1) / 3) * 134 + 36;
    return arrow(fromX + 12, fromY, toX, toY);
  }).join("");
}

function render([slug, title, labels, type]) {
  const body = type === "compare" ? renderCompare(title, labels)
    : type === "loop" ? renderLoop(title, labels)
    : type === "orbit" ? renderOrbit(title, labels)
    : type === "map" ? renderMap(title, labels)
    : renderFlow(title, labels);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675" role="img" aria-labelledby="title desc">
  <title id="title">${escapeXml(title)}</title>
  <desc id="desc">白底科技藍與淡紫色的 AI 入門課程資訊圖。</desc>
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#ffffff"/>
      <stop offset=".58" stop-color="#eef6ff"/>
      <stop offset="1" stop-color="#f3f0ff"/>
    </linearGradient>
    <pattern id="grid" width="36" height="36" patternUnits="userSpaceOnUse">
      <path d="M36 0H0V36" fill="none" stroke="#d8e6f7" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="1200" height="675" rx="42" fill="url(#bg)"/>
  <rect width="1200" height="675" rx="42" fill="url(#grid)" opacity=".65"/>
  <circle cx="1024" cy="116" r="82" fill="#ede9fe" opacity=".88"/>
  <circle cx="176" cy="560" r="74" fill="#dbeafe" opacity=".9"/>
  <text x="72" y="104" font-family="PingFang TC, Noto Sans TC, Microsoft JhengHei, sans-serif" font-size="42" font-weight="900" fill="#132238">${escapeXml(title)}</text>
  <rect x="72" y="132" width="210" height="10" rx="5" fill="#2563eb"/>
  ${body}
</svg>
`;
}

mkdirSync(outDir, { recursive: true });
for (const image of images) {
  writeFileSync(join(outDir, `${image[0]}.svg`), render(image));
}
