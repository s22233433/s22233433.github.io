import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const sourcePath = path.join(root, "index.html");
const baseUrl = "https://zhenguocool.com/";
const socialShareImage = "web-assets/og-zhenguocool-campaign-plan.webp";
const gaMeasurementId = "G-3G60NBREE3";
const gaSnippet = `  <!-- Google tag (gtag.js) -->\n  <script async src="https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}"></script>\n  <script>window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments)} gtag("js", new Date()); gtag("config", "${gaMeasurementId}");</script>`;
const source = fs.readFileSync(sourcePath, "utf8");

const injectGoogleAnalytics = (dir) => fs.readdirSync(dir, { withFileTypes: true }).reduce((count, entry) => {
  const file = path.join(dir, entry.name);
  if (entry.isDirectory()) return count + (entry.name === ".git" ? 0 : injectGoogleAnalytics(file));
  if (!entry.isFile() || !entry.name.endsWith(".html")) return count;
  const html = fs.readFileSync(file, "utf8");
  if (html.includes(gaMeasurementId)) return count + 1;
  if (!html.includes("</head>")) throw new Error(`Missing </head> in ${file}`);
  fs.writeFileSync(file, html.replace("</head>", `${gaSnippet}\n</head>`));
  return count + 1;
}, 0);

const rootLocale = { key: "zh-Hant", dir: "", htmlLang: "zh-Hant", url: baseUrl, label: "榛菓行銷", isRoot: true };
const locales = [
  { key: "zh-Hant", dir: "zh-tw", htmlLang: "zh-Hant", url: `${baseUrl}zh-tw/`, label: "榛菓行銷" },
  { key: "zh-Hans", dir: "zh-cn", htmlLang: "zh-Hans", url: `${baseUrl}zh-cn/`, label: "榛果营销" },
  { key: "en", dir: "en", htmlLang: "en", url: `${baseUrl}en/`, label: "Zhenguo Marketing" }
];
const allLocales = [rootLocale, ...locales];

const servicePages = [
  {
    slug: "kol-marketing",
    name: {
      "zh-Hant": "KOL 行銷",
      "zh-Hans": "KOL 营销",
      en: "KOL Marketing"
    },
    title: {
      "zh-Hant": "KOL 行銷服務 | 海外創作者合作與品牌口碑",
      "zh-Hans": "KOL 营销服务 | 海外创作者合作与品牌口碑",
      en: "KOL Marketing Service | Overseas Creator Partnerships"
    },
    description: {
      "zh-Hant": "榛菓行銷提供 KOL 行銷服務，協助品牌依市場、受眾與內容情境篩選海外 KOL/KOC，管理洽談、寄樣、內容審核與成效追蹤。",
      "zh-Hans": "榛果营销提供 KOL 营销服务，协助品牌依市场、受众与内容情境筛选海外 KOL/KOC，管理洽谈、寄样、内容审核与成效追踪。",
      en: "Zhenguo Marketing provides KOL marketing services for overseas creator screening, negotiation, product seeding, content review, and performance tracking."
    },
    intro: {
      "zh-Hant": "KOL 行銷適合需要建立市場認知、品牌信任與口碑討論的品牌。榛菓會依品牌定位、受眾市場、內容風格與合作目標，協助篩選適合的 KOL/KOC，而不是只用粉絲數判斷。",
      "zh-Hans": "KOL 营销适合需要建立市场认知、品牌信任与口碑讨论的品牌。榛果会依品牌定位、受众市场、内容风格与合作目标，协助筛选适合的 KOL/KOC，而不是只用粉丝数判断。",
      en: "KOL marketing is useful when a brand needs awareness, trust, and word of mouth. Zhenguo screens KOLs and KOCs by brand positioning, audience market, content style, and campaign objective, not follower count alone."
    },
    faqOne: {
      "zh-Hant": ["KOL 行銷適合哪些品牌？", "適合正在進入新市場、需要建立信任背書、或希望讓產品被更自然說明的品牌。"],
      "zh-Hans": ["KOL 营销适合哪些品牌？", "适合正在进入新市场、需要建立信任背书，或希望让产品被更自然说明的品牌。"],
      en: ["Which brands should use KOL marketing?", "It fits brands entering new markets, building trust, or needing creators to explain product value naturally."]
    }
  },
  {
    slug: "tiktok-influencer-marketing",
    name: {
      "zh-Hant": "TikTok 網紅行銷",
      "zh-Hans": "TikTok 网红营销",
      en: "TikTok Influencer Marketing"
    },
    title: {
      "zh-Hant": "TikTok 網紅行銷服務 | 短影音創作者合作",
      "zh-Hans": "TikTok 网红营销服务 | 短视频创作者合作",
      en: "TikTok Influencer Marketing Service | Short-Video Creator Campaigns"
    },
    description: {
      "zh-Hant": "TikTok 網紅行銷服務協助品牌規劃短影音合作、創作者篩選、腳本方向、內容審核與發布追蹤，適合海外市場快速建立曝光與討論。",
      "zh-Hans": "TikTok 网红营销服务协助品牌规划短视频合作、创作者筛选、脚本方向、内容审核与发布追踪，适合海外市场快速建立曝光与讨论。",
      en: "TikTok influencer marketing service for short-video creator screening, script direction, content review, publishing, and tracking in overseas markets."
    },
    intro: {
      "zh-Hant": "TikTok 適合用快速、生活化、可複製的內容切入海外受眾。榛菓會依市場與產品特性，協助品牌找到適合的短影音創作者與內容角度。",
      "zh-Hans": "TikTok 适合用快速、生活化、可复制的内容切入海外受众。榛果会依市场与产品特性，协助品牌找到适合的短视频创作者与内容角度。",
      en: "TikTok is useful for fast, everyday, repeatable content that reaches overseas audiences. Zhenguo helps brands select short-video creators and content angles by market and product context."
    },
    faqOne: {
      "zh-Hant": ["TikTok 網紅合作費用如何計算？", "通常依創作者等級、影片支數、授權範圍、腳本修改需求與是否搭配投放而不同。"],
      "zh-Hans": ["TikTok 网红合作费用如何计算？", "通常依创作者等级、视频支数、授权范围、脚本修改需求与是否搭配投放而不同。"],
      en: ["How are TikTok creator fees calculated?", "Fees usually depend on creator tier, video count, usage rights, script revisions, and whether paid amplification is included."]
    }
  },
  {
    slug: "youtube-influencer-marketing",
    name: {
      "zh-Hant": "YouTube 網紅行銷",
      "zh-Hans": "YouTube 网红营销",
      en: "YouTube Influencer Marketing"
    },
    title: {
      "zh-Hant": "YouTube 網紅行銷服務 | 長影音業配與內容合作",
      "zh-Hans": "YouTube 网红营销服务 | 长视频业配与内容合作",
      en: "YouTube Influencer Marketing Service | Sponsored Video Campaigns"
    },
    description: {
      "zh-Hant": "YouTube 網紅行銷適合需要完整說明產品價值、建立信任與沉澱搜尋內容的品牌，榛菓協助創作者提案、腳本審核、發布與成效整理。",
      "zh-Hans": "YouTube 网红营销适合需要完整说明产品价值、建立信任与沉淀搜索内容的品牌，榛果协助创作者提案、脚本审核、发布与成效整理。",
      en: "YouTube influencer marketing helps brands explain product value, build trust, and create searchable content through creator proposals, script review, publishing, and reporting."
    },
    intro: {
      "zh-Hant": "YouTube 適合需要深度說明、使用教學、評測或信任背書的產品。榛菓協助品牌管理主題確認、創作者提案、腳本或大綱審核、成片確認與發布追蹤。",
      "zh-Hans": "YouTube 适合需要深度说明、使用教学、评测或信任背书的产品。榛果协助品牌管理主题确认、创作者提案、脚本或大纲审核、成片确认与发布追踪。",
      en: "YouTube fits products that need deeper explanation, tutorials, reviews, or trust-building. Zhenguo manages topic alignment, creator proposals, script or outline review, final video checks, and publishing follow-up."
    },
    faqOne: {
      "zh-Hant": ["YouTube 業配合作流程是什麼？", "流程包含主題確認、創作者提案、腳本或大綱審核、拍攝製作、成片確認、發布與數據整理。"],
      "zh-Hans": ["YouTube 业配合作流程是什么？", "流程包含主题确认、创作者提案、脚本或大纲审核、拍摄制作、成片确认、发布与数据整理。"],
      en: ["What is the YouTube sponsorship workflow?", "It includes topic alignment, creator proposal, script or outline review, production, final video check, publishing, and reporting."]
    }
  },
  {
    slug: "instagram-influencer-marketing",
    name: {
      "zh-Hant": "Instagram 網紅行銷",
      "zh-Hans": "Instagram 网红营销",
      en: "Instagram Influencer Marketing"
    },
    title: {
      "zh-Hant": "Instagram 網紅行銷服務 | Reels、貼文與品牌口碑",
      "zh-Hans": "Instagram 网红营销服务 | Reels、帖文与品牌口碑",
      en: "Instagram Influencer Marketing Service | Reels, Posts, and Brand Trust"
    },
    description: {
      "zh-Hant": "Instagram 網紅行銷服務協助品牌規劃 Reels、圖文貼文與限時動態合作，適合美妝、生活、餐飲、旅遊與品牌形象建立。",
      "zh-Hans": "Instagram 网红营销服务协助品牌规划 Reels、图文帖文与限时动态合作，适合美妆、生活、餐饮、旅游与品牌形象建立。",
      en: "Instagram influencer marketing service for Reels, posts, and Stories, suitable for beauty, lifestyle, food, travel, and brand image building."
    },
    intro: {
      "zh-Hant": "Instagram 適合建立生活風格、品牌美感與可分享的口碑內容。榛菓協助品牌依目標市場挑選創作者，規劃 Reels、貼文、限時動態與素材授權。",
      "zh-Hans": "Instagram 适合建立生活风格、品牌美感与可分享的口碑内容。榛果协助品牌依目标市场挑选创作者，规划 Reels、帖文、限时动态与素材授权。",
      en: "Instagram is useful for lifestyle positioning, brand aesthetics, and shareable word-of-mouth content. Zhenguo helps select creators and plan Reels, posts, Stories, and usage rights."
    },
    faqOne: {
      "zh-Hant": ["Instagram 網紅行銷適合什麼目標？", "適合建立品牌形象、生活情境、產品口碑與可再利用的社群素材。"],
      "zh-Hans": ["Instagram 网红营销适合什么目标？", "适合建立品牌形象、生活情境、产品口碑与可再利用的社群素材。"],
      en: ["What goals fit Instagram influencer marketing?", "It fits brand image, lifestyle context, product word of mouth, and reusable social assets."]
    }
  },
  {
    slug: "overseas-influencer-marketing",
    name: {
      "zh-Hant": "海外網紅行銷",
      "zh-Hans": "海外网红营销",
      en: "Overseas Influencer Marketing"
    },
    title: {
      "zh-Hant": "海外網紅行銷服務 | 美國、日本、韓國與東南亞市場",
      "zh-Hans": "海外网红营销服务 | 美国、日本、韩国与东南亚市场",
      en: "Overseas Influencer Marketing Service | US, Japan, Korea, and Southeast Asia"
    },
    description: {
      "zh-Hant": "海外網紅行銷服務協助跨境品牌進入美國、日本、韓國與東南亞市場，包含市場方向、創作者篩選、合作洽談、寄樣管理與內容追蹤。",
      "zh-Hans": "海外网红营销服务协助跨境品牌进入美国、日本、韩国与东南亚市场，包含市场方向、创作者筛选、合作洽谈、寄样管理与内容追踪。",
      en: "Overseas influencer marketing service for brands entering the US, Japan, Korea, and Southeast Asia, covering market direction, creator screening, negotiation, seeding, and content tracking."
    },
    intro: {
      "zh-Hant": "海外網紅行銷不只是翻譯內容，而是要理解目標市場的平台習慣、創作者溝通方式、寄樣節奏與內容審核標準。榛菓協助品牌把出海合作拆成可執行流程。",
      "zh-Hans": "海外网红营销不只是翻译内容，而是要理解目标市场的平台习惯、创作者沟通方式、寄样节奏与内容审核标准。榛果协助品牌把出海合作拆成可执行流程。",
      en: "Overseas influencer marketing is not just translated content. It requires market understanding, platform habits, creator communication, product seeding rhythm, and content review standards. Zhenguo turns market entry collaborations into executable workflows."
    },
    faqOne: {
      "zh-Hant": ["海外網紅行銷如何開始？", "先確認目標市場、平台、產品限制與預算範圍，再進行創作者篩選、合作洽談與內容規劃。"],
      "zh-Hans": ["海外网红营销如何开始？", "先确认目标市场、平台、产品限制与预算范围，再进行创作者筛选、合作洽谈与内容规划。"],
      en: ["How should overseas influencer marketing start?", "Start by confirming the target market, platform, product constraints, and budget range, then move into creator screening, negotiation, and content planning."]
    }
  },
  {
    slug: "tiktok-koc-marketing",
    name: {
      "zh-Hant": "TikTok KOC 行銷",
      "zh-Hans": "TikTok KOC 营销",
      en: "TikTok KOC Marketing"
    },
    title: {
      "zh-Hant": "TikTok KOC 行銷服務 | 短影音口碑與素材測試",
      "zh-Hans": "TikTok KOC 营销服务 | 短视频口碑与素材测试",
      en: "TikTok KOC Marketing Service | Short-Video Word of Mouth"
    },
    description: {
      "zh-Hant": "TikTok KOC 行銷適合品牌用多位短影音創作者測試內容角度、累積口碑素材，榛菓協助篩選、洽談、寄樣、審稿與上刊追蹤。",
      "zh-Hans": "TikTok KOC 营销适合品牌用多位短视频创作者测试内容角度、累积口碑素材，榛果协助筛选、洽谈、寄样、审核与发布追踪。",
      en: "TikTok KOC marketing helps brands test content angles and build word-of-mouth assets through multiple short-video creators, with screening, negotiation, seeding, review, and publishing follow-up."
    },
    intro: {
      "zh-Hant": "TikTok KOC 適合需要快速測試內容語感、產品賣點與受眾反應的品牌。重點不是找最多帳號，而是讓每位創作者都能產出可判斷、可追蹤、可複用的內容。",
      "zh-Hans": "TikTok KOC 适合需要快速测试内容语感、产品卖点与受众反应的品牌。重点不是找最多账号，而是让每位创作者都能产出可判断、可追踪、可复用的内容。",
      en: "TikTok KOCs are useful for testing content tone, product angles, and audience response quickly. The goal is not the largest list, but content that can be judged, tracked, and reused."
    },
    faqOne: {
      "zh-Hant": ["TikTok KOC 適合什麼品牌？", "適合有明確產品賣點、可寄樣、希望用短影音測試口碑或素材角度的品牌。"],
      "zh-Hans": ["TikTok KOC 适合什么品牌？", "适合有明确产品卖点、可寄样、希望用短视频测试口碑或素材角度的品牌。"],
      en: ["Which brands fit TikTok KOC marketing?", "It fits brands with clear product value, sample availability, and a need to test word-of-mouth or creative angles through short video."]
    }
  },
  {
    slug: "youtube-influencer-review",
    name: {
      "zh-Hant": "YouTube 網紅評測",
      "zh-Hans": "YouTube 网红评测",
      en: "YouTube Influencer Reviews"
    },
    title: {
      "zh-Hant": "YouTube 網紅評測合作 | 產品開箱、教學與深度內容",
      "zh-Hans": "YouTube 网红评测合作 | 产品开箱、教学与深度内容",
      en: "YouTube Influencer Review Service | Product Reviews and Tutorials"
    },
    description: {
      "zh-Hant": "YouTube 網紅評測適合需要完整說明產品價值、建立信任與長尾搜尋內容的品牌，包含創作者篩選、主題提案、腳本方向與發布追蹤。",
      "zh-Hans": "YouTube 网红评测适合需要完整说明产品价值、建立信任与长尾搜索内容的品牌，包含创作者筛选、主题提案、脚本方向与发布追踪。",
      en: "YouTube influencer reviews help brands explain product value, build trust, and create long-tail searchable content through creator screening, topic planning, script direction, and publishing follow-up."
    },
    intro: {
      "zh-Hant": "YouTube 評測合作適合功能型、單價較高、需要展示使用情境的產品。榛菓協助品牌把產品重點轉成創作者能自然說明的內容方向。",
      "zh-Hans": "YouTube 评测合作适合功能型、单价较高、需要展示使用情境的产品。榛果协助品牌把产品重点转成创作者能自然说明的内容方向。",
      en: "YouTube review collaborations fit functional or higher-ticket products that need usage context. Zhenguo turns product points into creator-friendly content direction."
    },
    faqOne: {
      "zh-Hant": ["YouTube 評測需要品牌準備什麼？", "建議準備產品賣點、使用情境、禁用說法、寄樣資訊、希望出現的重點與審稿規則。"],
      "zh-Hans": ["YouTube 评测需要品牌准备什么？", "建议准备产品卖点、使用情境、禁用说法、寄样信息、希望出现的重点与审核规则。"],
      en: ["What should brands prepare for a YouTube review?", "Prepare product value points, usage context, restricted claims, seeding details, key messages, and review rules."]
    }
  },
  {
    slug: "instagram-kol-collaboration",
    name: {
      "zh-Hant": "Instagram KOL 合作",
      "zh-Hans": "Instagram KOL 合作",
      en: "Instagram KOL Collaboration"
    },
    title: {
      "zh-Hant": "Instagram KOL 合作服務 | Reels、貼文與限時動態",
      "zh-Hans": "Instagram KOL 合作服务 | Reels、帖文与限时动态",
      en: "Instagram KOL Collaboration Service | Reels, Posts, and Stories"
    },
    description: {
      "zh-Hant": "Instagram KOL 合作服務協助品牌規劃 Reels、貼文、限時動態與素材授權，適合美妝、生活、餐飲、旅遊與品牌形象建立。",
      "zh-Hans": "Instagram KOL 合作服务协助品牌规划 Reels、帖文、限时动态与素材授权，适合美妆、生活、餐饮、旅游与品牌形象建立。",
      en: "Instagram KOL collaboration service for Reels, posts, Stories, and usage rights, suitable for beauty, lifestyle, food, travel, and brand image building."
    },
    intro: {
      "zh-Hant": "Instagram KOL 合作的重點在畫面質感、生活情境與可轉發素材。榛菓協助品牌確認創作者風格、合作格式、審稿節奏與素材使用範圍。",
      "zh-Hans": "Instagram KOL 合作的重点在画面质感、生活情境与可转发素材。榛果协助品牌确认创作者风格、合作格式、审核节奏与素材使用范围。",
      en: "Instagram KOL work depends on visual quality, lifestyle context, and reusable assets. Zhenguo helps align creator style, format, review rhythm, and usage scope."
    },
    faqOne: {
      "zh-Hant": ["Instagram KOL 合作適合什麼目標？", "適合品牌形象、生活情境、口碑素材、活動曝光與可二次使用的社群內容。"],
      "zh-Hans": ["Instagram KOL 合作适合什么目标？", "适合品牌形象、生活情境、口碑素材、活动曝光与可二次使用的社群内容。"],
      en: ["What goals fit Instagram KOL collaboration?", "It fits brand image, lifestyle context, word-of-mouth assets, campaign exposure, and reusable social content."]
    }
  },
  {
    slug: "korea-influencer-marketing",
    name: {
      "zh-Hant": "韓國網紅行銷",
      "zh-Hans": "韩国网红营销",
      en: "Korea Influencer Marketing"
    },
    title: {
      "zh-Hant": "韓國網紅行銷服務 | 韓國 KOL/KOC 合作執行",
      "zh-Hans": "韩国网红营销服务 | 韩国 KOL/KOC 合作执行",
      en: "Korea Influencer Marketing Service | Korean KOL/KOC Campaigns"
    },
    description: {
      "zh-Hant": "韓國網紅行銷服務協助品牌篩選韓國 KOL/KOC、規劃內容方向、管理洽談寄樣、審稿與發布追蹤，適合美妝、食品、遊戲與生活品牌。",
      "zh-Hans": "韩国网红营销服务协助品牌筛选韩国 KOL/KOC、规划内容方向、管理洽谈寄样、审核与发布追踪，适合美妆、食品、游戏与生活品牌。",
      en: "Korea influencer marketing service for Korean KOL/KOC screening, content direction, negotiation, seeding, review, and publishing follow-up across beauty, food, gaming, and lifestyle brands."
    },
    intro: {
      "zh-Hant": "韓國市場重視內容語境、創作者調性與產品呈現方式。榛菓協助品牌把合作條件整理清楚，再篩選適合的韓國創作者。",
      "zh-Hans": "韩国市场重视内容语境、创作者调性与产品呈现方式。榛果协助品牌把合作条件整理清楚，再筛选适合的韩国创作者。",
      en: "The Korean market depends on content context, creator tone, and product presentation. Zhenguo clarifies collaboration conditions before screening suitable Korean creators."
    },
    faqOne: {
      "zh-Hant": ["韓國網紅合作適合哪些品類？", "常見品類包含美妝、食品飲料、遊戲、生活用品、旅遊與零售通路活動。"],
      "zh-Hans": ["韩国网红合作适合哪些品类？", "常见品类包含美妆、食品饮料、游戏、生活用品、旅游与零售通路活动。"],
      en: ["Which categories fit Korean influencer campaigns?", "Common categories include beauty, food and beverage, gaming, lifestyle products, travel, and retail activations."]
    }
  },
  {
    slug: "japan-influencer-marketing",
    name: {
      "zh-Hant": "日本網紅行銷",
      "zh-Hans": "日本网红营销",
      en: "Japan Influencer Marketing"
    },
    title: {
      "zh-Hant": "日本網紅行銷服務 | 日本 KOL/KOC 合作與內容審核",
      "zh-Hans": "日本网红营销服务 | 日本 KOL/KOC 合作与内容审核",
      en: "Japan Influencer Marketing Service | Japanese KOL/KOC Campaigns"
    },
    description: {
      "zh-Hant": "日本網紅行銷服務協助品牌規劃日本 KOL/KOC 合作，包含創作者篩選、合作洽談、寄樣、內容方向、審稿與發布追蹤。",
      "zh-Hans": "日本网红营销服务协助品牌规划日本 KOL/KOC 合作，包含创作者筛选、合作洽谈、寄样、内容方向、审核与发布追踪。",
      en: "Japan influencer marketing service for Japanese KOL/KOC campaigns, including creator screening, negotiation, product seeding, content direction, review, and publishing follow-up."
    },
    intro: {
      "zh-Hant": "日本網紅合作需要更細的溝通、審稿與時程管理。榛菓協助品牌把產品資訊、表述限制與合作條件整理成創作者容易理解的 brief。",
      "zh-Hans": "日本网红合作需要更细的沟通、审核与时程管理。榛果协助品牌把产品信息、表述限制与合作条件整理成创作者容易理解的 brief。",
      en: "Japanese influencer campaigns need careful communication, review, and timing. Zhenguo turns product details, claim restrictions, and collaboration terms into creator-friendly briefs."
    },
    faqOne: {
      "zh-Hant": ["日本網紅合作最容易卡在哪裡？", "常見卡點是溝通細節、審稿節奏、授權範圍、寄樣時間與品牌表述限制。"],
      "zh-Hans": ["日本网红合作最容易卡在哪里？", "常见卡点是沟通细节、审核节奏、授权范围、寄样时间与品牌表述限制。"],
      en: ["Where do Japan influencer campaigns usually get stuck?", "Common blockers include communication details, review rhythm, usage rights, seeding timing, and claim restrictions."]
    }
  },
  {
    slug: "gaming-influencer-marketing",
    name: {
      "zh-Hant": "遊戲網紅行銷",
      "zh-Hans": "游戏网红营销",
      en: "Gaming Influencer Marketing"
    },
    title: {
      "zh-Hant": "遊戲網紅行銷服務 | 實況主、短影音與社群活動",
      "zh-Hans": "游戏网红营销服务 | 实况主、短视频与社群活动",
      en: "Gaming Influencer Marketing Service | Streamers, Short Video, and Community Campaigns"
    },
    description: {
      "zh-Hant": "遊戲網紅行銷服務協助遊戲品牌規劃實況主、YouTube、TikTok 與社群創作者合作，包含名單篩選、內容方向、活動節奏與發布追蹤。",
      "zh-Hans": "游戏网红营销服务协助游戏品牌规划实况主、YouTube、TikTok 与社群创作者合作，包含名单筛选、内容方向、活动节奏与发布追踪。",
      en: "Gaming influencer marketing service for streamer, YouTube, TikTok, and community creator campaigns, including shortlist screening, content direction, activation rhythm, and publishing follow-up."
    },
    intro: {
      "zh-Hant": "遊戲合作不只要曝光，還要讓玩家理解玩法、角色、活動與參與理由。榛菓協助把遊戲賣點轉成創作者能執行的內容場景。",
      "zh-Hans": "游戏合作不只要曝光，还要让玩家理解玩法、角色、活动与参与理由。榛果协助把游戏卖点转成创作者能执行的内容场景。",
      en: "Gaming campaigns need more than exposure. Players must understand gameplay, characters, events, and reasons to join. Zhenguo turns game selling points into creator-ready content contexts."
    },
    faqOne: {
      "zh-Hant": ["遊戲網紅行銷適合哪些合作形式？", "常見形式包含實況、短影音挑戰、遊戲評測、活動宣傳、角色主題內容與社群互動。"],
      "zh-Hans": ["游戏网红营销适合哪些合作形式？", "常见形式包含实况、短视频挑战、游戏评测、活动宣传、角色主题内容与社群互动。"],
      en: ["What formats fit gaming influencer marketing?", "Common formats include livestreaming, short-video challenges, game reviews, event promotion, character-themed content, and community interaction."]
    }
  },
  {
    slug: "beauty-influencer-marketing",
    name: {
      "zh-Hant": "美妝網紅行銷",
      "zh-Hans": "美妆网红营销",
      en: "Beauty Influencer Marketing"
    },
    title: {
      "zh-Hant": "美妝網紅行銷服務 | 試用、妝容內容與口碑素材",
      "zh-Hans": "美妆网红营销服务 | 试用、妆容内容与口碑素材",
      en: "Beauty Influencer Marketing Service | Reviews, Looks, and Word-of-Mouth Assets"
    },
    description: {
      "zh-Hant": "美妝網紅行銷服務協助品牌規劃試用、妝容示範、開箱、短影音與圖文合作，管理創作者篩選、寄樣、內容審核與發布追蹤。",
      "zh-Hans": "美妆网红营销服务协助品牌规划试用、妆容示范、开箱、短视频与图文合作，管理创作者筛选、寄样、内容审核与发布追踪。",
      en: "Beauty influencer marketing service for reviews, makeup looks, unboxing, short videos, and posts, managing creator screening, seeding, content review, and publishing follow-up."
    },
    intro: {
      "zh-Hant": "美妝合作重視膚質、色號、使用感與畫面呈現。榛菓協助品牌篩選適合的創作者，並把審稿重點整理成可執行的內容方向。",
      "zh-Hans": "美妆合作重视肤质、色号、使用感与画面呈现。榛果协助品牌筛选适合的创作者，并把审核重点整理成可执行的内容方向。",
      en: "Beauty campaigns depend on skin type, shade, usage feel, and visual presentation. Zhenguo screens suitable creators and turns review priorities into executable content direction."
    },
    faqOne: {
      "zh-Hant": ["美妝網紅合作需要注意什麼？", "需要注意膚質與色號匹配、功效表述限制、試用時間、素材授權與是否可二次投放。"],
      "zh-Hans": ["美妆网红合作需要注意什么？", "需要注意肤质与色号匹配、功效表述限制、试用时间、素材授权与是否可二次投放。"],
      en: ["What should beauty influencer campaigns watch for?", "Watch for skin and shade fit, claim restrictions, trial period, usage rights, and whether paid media reuse is allowed."]
    }
  },
  {
    slug: "food-influencer-marketing",
    name: {
      "zh-Hant": "食品網紅行銷",
      "zh-Hans": "食品网红营销",
      en: "Food Influencer Marketing"
    },
    title: {
      "zh-Hant": "食品網紅行銷服務 | 試吃、門市體驗與口碑內容",
      "zh-Hans": "食品网红营销服务 | 试吃、门店体验与口碑内容",
      en: "Food Influencer Marketing Service | Tastings, Store Visits, and Word of Mouth"
    },
    description: {
      "zh-Hant": "食品網紅行銷服務協助品牌規劃試吃、門市體驗、短影音、圖文與在地口碑合作，包含創作者篩選、寄樣安排、內容審核與上刊整理。",
      "zh-Hans": "食品网红营销服务协助品牌规划试吃、门店体验、短视频、图文与在地口碑合作，包含创作者筛选、寄样安排、内容审核与发布整理。",
      en: "Food influencer marketing service for tastings, store visits, short videos, posts, and local word-of-mouth campaigns, including creator screening, seeding, content review, and publishing records."
    },
    intro: {
      "zh-Hant": "食品合作要把口味、場景、購買方式與到店理由說清楚。榛菓協助品牌依市場與通路，挑選能自然呈現體驗的創作者。",
      "zh-Hans": "食品合作要把口味、场景、购买方式与到店理由说清楚。榛果协助品牌依市场与渠道，挑选能自然呈现体验的创作者。",
      en: "Food campaigns need to explain taste, context, purchase path, and reasons to visit. Zhenguo selects creators who can present the experience naturally by market and channel."
    },
    faqOne: {
      "zh-Hant": ["食品網紅行銷適合哪種品牌？", "適合食品飲料、餐飲門市、伴手禮、零售新品與需要試吃體驗或在地口碑的品牌。"],
      "zh-Hans": ["食品网红营销适合哪种品牌？", "适合食品饮料、餐饮门店、伴手礼、零售新品与需要试吃体验或在地口碑的品牌。"],
      en: ["Which brands fit food influencer marketing?", "It fits food and beverage, restaurants, gift products, retail launches, and brands needing tasting experiences or local word of mouth."]
    }
  },
  {
    slug: "ugc-content-creation",
    name: {
      "zh-Hant": "UGC 素材製作",
      "zh-Hans": "UGC 素材制作",
      en: "UGC Content Creation"
    },
    title: {
      "zh-Hant": "UGC 素材製作服務 | 可投放的創作者短影音內容",
      "zh-Hans": "UGC 素材制作服务 | 可投放的创作者短视频内容",
      en: "UGC Content Creation Service | Creator Videos for Paid Media"
    },
    description: {
      "zh-Hant": "UGC 素材製作服務協助品牌以創作者視角產出短影音、開箱、實測與使用情境素材，並事先確認授權、內容重點與後續投放需求。",
      "zh-Hans": "UGC 素材制作服务协助品牌以创作者视角产出短视频、开箱、实测与使用情境素材，并事先确认授权、内容重点与后续投放需求。",
      en: "UGC content creation service for creator-led short videos, unboxing, product testing, and usage scenarios, with usage rights and paid-media needs aligned upfront."
    },
    intro: {
      "zh-Hant": "UGC 的價值不只是自然口碑，而是讓品牌取得更接近真實使用者語氣的素材。榛菓會先確認素材用途、授權範圍與內容重點，再挑選適合出鏡與執行的創作者。",
      "zh-Hans": "UGC 的价值不只是自然口碑，而是让品牌取得更接近真实使用者语气的素材。榛果会先确认素材用途、授权范围与内容重点，再挑选适合出镜与执行的创作者。",
      en: "UGC is more than organic word of mouth. It gives brands assets that sound closer to real users. Zhenguo aligns usage, rights, and key messages before selecting creators who can appear on camera and deliver."
    },
    faqOne: {
      "zh-Hant": ["UGC 素材可以用於廣告投放嗎？", "可以，但需要在合作前確認素材使用期間、投放渠道、剪輯方式與肖像授權範圍。"],
      "zh-Hans": ["UGC 素材可以用于广告投放吗？", "可以，但需要在合作前确认素材使用期间、投放渠道、剪辑方式与肖像授权范围。"],
      en: ["Can UGC assets be used in paid ads?", "Yes, but usage period, media channels, editing permissions, and likeness rights should be agreed before the collaboration."]
    }
  },
  {
    slug: "ecommerce-influencer-marketing",
    name: {
      "zh-Hant": "電商網紅行銷",
      "zh-Hans": "电商网红营销",
      en: "Ecommerce Influencer Marketing"
    },
    title: {
      "zh-Hant": "電商網紅行銷服務 | 導購內容、素材與轉換節奏",
      "zh-Hans": "电商网红营销服务 | 导购内容、素材与转化节奏",
      en: "Ecommerce Influencer Marketing Service | Content, Assets, and Conversion Flow"
    },
    description: {
      "zh-Hant": "電商網紅行銷服務協助品牌安排導購內容、檔期溝通、折扣資訊、素材授權與上刊追蹤，讓創作者合作能接到商品頁與促銷節奏。",
      "zh-Hans": "电商网红营销服务协助品牌安排导购内容、档期沟通、折扣信息、素材授权与发布追踪，让创作者合作能接到商品页与促销节奏。",
      en: "Ecommerce influencer marketing service for shoppable content, launch timing, promotion details, usage rights, and publishing follow-up that connects creator work to product pages."
    },
    intro: {
      "zh-Hant": "電商合作不能只看曝光。產品頁、庫存、優惠碼、投放素材與客服承接都會影響轉換。榛菓協助把創作者內容放進品牌可執行的導購流程。",
      "zh-Hans": "电商合作不能只看曝光。产品页、库存、优惠码、投放素材与客服承接都会影响转化。榛果协助把创作者内容放进品牌可执行的导购流程。",
      en: "Ecommerce collaborations are not only about reach. Product pages, inventory, promo codes, paid assets, and customer support all affect conversion. Zhenguo fits creator content into an executable commerce flow."
    },
    faqOne: {
      "zh-Hant": ["電商網紅合作可以保證銷售嗎？", "不能保證銷售，但可以在合作前先確認商品頁、優惠資訊、內容授權與投放承接，降低轉換斷點。"],
      "zh-Hans": ["电商网红合作可以保证销售吗？", "不能保证销售，但可以在合作前先确认商品页、优惠信息、内容授权与投放承接，降低转化断点。"],
      en: ["Can ecommerce creator collaborations guarantee sales?", "No, but product pages, promotions, usage rights, and paid-media handoff can be aligned beforehand to reduce conversion gaps."]
    }
  },
  {
    slug: "consumer-electronics-influencer-marketing",
    name: {
      "zh-Hant": "3C／家電網紅行銷",
      "zh-Hans": "3C／家电网红营销",
      en: "Consumer Electronics Influencer Marketing"
    },
    title: {
      "zh-Hant": "3C／家電網紅行銷服務 | 開箱、實測與功能說明",
      "zh-Hans": "3C／家电网红营销服务 | 开箱、实测与功能说明",
      en: "Consumer Electronics Influencer Marketing | Unboxing, Testing, and Product Education"
    },
    description: {
      "zh-Hant": "3C／家電網紅行銷服務協助品牌以開箱、實測、使用教學與生活情境解釋產品功能，管理創作者篩選、借測或寄樣、審稿與素材授權。",
      "zh-Hans": "3C／家电网红营销服务协助品牌以开箱、实测、使用教学与生活情境解释产品功能，管理创作者筛选、借测或寄样、审核与素材授权。",
      en: "Consumer electronics influencer marketing service for unboxing, hands-on testing, tutorials, and lifestyle use cases, including creator screening, loaner or sample handling, review, and usage rights."
    },
    intro: {
      "zh-Hant": "3C 與家電的合作重點是把規格轉成使用者聽得懂的差異。榛菓會依產品複雜度、目標受眾與內容深度，安排適合做實測或教學的創作者。",
      "zh-Hans": "3C 与家电的合作重点是把规格转成使用者听得懂的差异。榛果会依产品复杂度、目标受众与内容深度，安排适合做实测或教学的创作者。",
      en: "For electronics and appliances, the job is to turn specifications into differences users can understand. Zhenguo selects creators suited to testing or education by product complexity, audience, and required depth."
    },
    faqOne: {
      "zh-Hant": ["3C／家電適合短影音還是 YouTube 評測？", "取決於產品是否需要深度解釋。功能單純可用短影音建立記憶點；需要比較、安裝或長期實測時，較適合長影音或多階段內容。"],
      "zh-Hans": ["3C／家电适合短视频还是 YouTube 评测？", "取决于产品是否需要深度解释。功能单纯可用短视频建立记忆点；需要比较、安装或长期实测时，较适合长视频或多阶段内容。"],
      en: ["Should electronics use short video or YouTube reviews?", "It depends on explanation depth. Simple features can use short video for recall; products needing comparison, installation, or longer testing fit long-form or staged content better."]
    }
  },
  {
    slug: "health-supplement-influencer-marketing",
    name: {
      "zh-Hant": "保健食品網紅行銷",
      "zh-Hans": "保健食品网红营销",
      en: "Health Supplement Influencer Marketing"
    },
    title: {
      "zh-Hant": "保健食品網紅行銷服務 | 日常情境、口碑內容與合規溝通",
      "zh-Hans": "保健食品网红营销服务 | 日常情境、口碑内容与合规沟通",
      en: "Health Supplement Influencer Marketing | Everyday Context and Compliant Creator Content"
    },
    description: {
      "zh-Hant": "保健食品網紅行銷服務協助品牌把成分、食用方式與日常情境轉成創作者內容，並在合作前整理禁用表述、審稿重點與素材授權。",
      "zh-Hans": "保健食品网红营销服务协助品牌把成分、食用方式与日常情境转成创作者内容，并在合作前整理禁用表述、审核重点与素材授权。",
      en: "Health supplement influencer marketing service that turns ingredients, usage, and everyday context into creator content while aligning prohibited claims, review priorities, and usage rights upfront."
    },
    intro: {
      "zh-Hant": "保健食品合作要同時兼顧信任感與表述界線。榛菓會先整理產品可說與不可說的重點，再依受眾與內容風格安排適合的創作者與審稿節奏。",
      "zh-Hans": "保健食品合作要同时兼顾信任感与表述边界。榛果会先整理产品可说与不可说的重点，再依受众与内容风格安排适合的创作者与审核节奏。",
      en: "Supplement campaigns need both trust and clear claim boundaries. Zhenguo first aligns what can and cannot be said, then matches suitable creators and review timing to the audience and content style."
    },
    faqOne: {
      "zh-Hant": ["保健食品合作如何避免內容誇大？", "合作前應提供成分、可用表述、禁用詞與審稿流程；內容可聚焦日常使用感與產品資訊，不把創作者內容寫成醫療承諾。"],
      "zh-Hans": ["保健食品合作如何避免内容夸大？", "合作前应提供成分、可用表述、禁用词与审核流程；内容可聚焦日常使用感与产品信息，不把创作者内容写成医疗承诺。"],
      en: ["How can supplement creator content avoid exaggerated claims?", "Provide ingredients, approved wording, prohibited terms, and a review process before work begins. Content can focus on everyday experience and product information, not medical promises."]
    }
  },
  {
    slug: "japan-koc-marketing",
    name: {
      "zh-Hant": "日本 KOC 行銷",
      "zh-Hans": "日本 KOC 营销",
      en: "Japan KOC Marketing"
    },
    title: {
      "zh-Hant": "日本 KOC 行銷服務 | 在地口碑與短影音素材測試",
      "zh-Hans": "日本 KOC 营销服务 | 在地口碑与短视频素材测试",
      en: "Japan KOC Marketing Service | Local Word of Mouth and Short-Video Testing"
    },
    description: {
      "zh-Hant": "日本 KOC 行銷服務協助品牌依品類、平台與內容語境篩選日本微型創作者，安排寄樣、洽談、內容審核與上刊整理。",
      "zh-Hans": "日本 KOC 营销服务协助品牌依品类、平台与内容语境筛选日本微型创作者，安排寄样、洽谈、内容审核与发布整理。",
      en: "Japan KOC marketing service for screening Japanese micro creators by category, platform, and content context, with seeding, negotiation, review, and publishing records."
    },
    intro: {
      "zh-Hant": "日本 KOC 合作重點在於內容的在地語氣、寄樣節奏與溝通細節。榛菓協助品牌先確認商品資訊與審稿規則，再安排可執行的人選與內容方向。",
      "zh-Hans": "日本 KOC 合作重点在于内容的在地语气、寄样节奏与沟通细节。榛果协助品牌先确认商品信息与审核规则，再安排可执行的人选与内容方向。",
      en: "Japan KOC work depends on local content tone, seeding rhythm, and communication detail. Zhenguo aligns product information and review rules before arranging practical creator options and content direction."
    },
    faqOne: {
      "zh-Hant": ["日本 KOC 合作前品牌要準備什麼？", "建議先準備日文或可翻譯的產品資訊、寄樣方式、活動檔期、預算區間與可接受的內容表述。"],
      "zh-Hans": ["日本 KOC 合作前品牌要准备什么？", "建议先准备日文或可翻译的产品信息、寄样方式、活动档期、预算区间与可接受的内容表述。"],
      en: ["What should a brand prepare before Japan KOC work?", "Prepare Japanese or translatable product information, seeding method, campaign timing, budget range, and acceptable content wording."]
    }
  },
  {
    slug: "korea-koc-marketing",
    name: {
      "zh-Hant": "韓國 KOC 行銷",
      "zh-Hans": "韩国 KOC 营销",
      en: "Korea KOC Marketing"
    },
    title: {
      "zh-Hant": "韓國 KOC 行銷服務 | 內容口碑與在地創作者合作",
      "zh-Hans": "韩国 KOC 营销服务 | 内容口碑与在地创作者合作",
      en: "Korea KOC Marketing Service | Local Creator Content and Word of Mouth"
    },
    description: {
      "zh-Hant": "韓國 KOC 行銷服務協助品牌依內容風格、受眾與合作可行性篩選韓國微型創作者，管理洽談、寄樣、審稿與發布追蹤。",
      "zh-Hans": "韩国 KOC 营销服务协助品牌依内容风格、受众与合作可行性筛选韩国微型创作者，管理洽谈、寄样、审核与发布追踪。",
      en: "Korea KOC marketing service for selecting Korean micro creators by content style, audience, and execution fit, with negotiation, seeding, review, and publishing follow-up."
    },
    intro: {
      "zh-Hant": "韓國 KOC 合作適合先以多個內容角度測試品牌在地語境。榛菓會將產品賣點、寄樣條件、內容重點與審稿節奏整理成創作者可理解的合作方向。",
      "zh-Hans": "韩国 KOC 合作适合先以多个内容角度测试品牌在地语境。榛果会将产品卖点、寄样条件、内容重点与审核节奏整理成创作者可理解的合作方向。",
      en: "Korea KOC work can test multiple content angles before a brand scales. Zhenguo turns product value, seeding conditions, key messages, and review timing into a brief creators can execute."
    },
    faqOne: {
      "zh-Hant": ["韓國 KOC 與韓國 KOL 的合作差異是什麼？", "KOC 通常更適合累積多元使用情境與口碑素材；KOL 則較適合需要較強個人影響力、特定內容定位或大型合作檔期的專案。"],
      "zh-Hans": ["韩国 KOC 与韩国 KOL 的合作差异是什么？", "KOC 通常更适合累积多元使用情境与口碑素材；KOL 则较适合需要较强个人影响力、特定内容定位或大型合作档期的项目。"],
      en: ["How do Korea KOC and Korea KOL collaborations differ?", "KOCs are often better for varied usage contexts and word-of-mouth assets. KOLs fit projects needing stronger individual reach, specific content positioning, or larger campaign timing."]
    }
  }
];

const caseStudies = [
  {
    slug: "liming-weiquan-cheer",
    image: "web-assets/game-liming-cheer.webp",
    relatedServices: ["kol-marketing", "gaming-influencer-marketing", "tiktok-influencer-marketing", "tiktok-koc-marketing"],
    title: {
      "zh-Hant": "黎明再現 x 味全龍啦啦隊",
      "zh-Hans": "黎明再现 x 味全龙啦啦队",
      en: "Liming Reappearance x Wei Chuan Dragons Cheerleaders"
    },
    summary: {
      "zh-Hant": "以啦啦隊與遊戲題材建立話題連結，讓活動素材能自然進入社群討論。",
      "zh-Hans": "以啦啦队与游戏题材建立话题连接，让活动素材能自然进入社交讨论。",
      en: "A cheerleading and game collaboration designed to bring campaign assets into natural social conversation."
    },
    content: {
      "zh-Hant": ["《黎明再現》需要以具娛樂性與辨識度的合作素材，為遊戲活動建立社群聲量。", "讓遊戲活動資訊不只被看見，也能透過粉絲熟悉的角色與互動情境被討論。", "遊戲訊息需要在不犧牲活動感的前提下，進入受眾熟悉的內容語境。", "以啦啦隊合作為切點，兼顧社群辨識度、現場感與受眾可參與性。", "以人物互動、活動氛圍與遊戲主題為主軸，避免把內容做成單向廣告。", "協調合作條件、內容方向、素材確認與發布節奏，讓各方在同一專案節點推進。", "交付合作素材、上刊連結與執行整理；復盤重點放在可延伸的話題角度與後續素材使用。"],
      "zh-Hans": ["《黎明再现》需要以具娱乐性与辨识度的合作素材，为游戏活动建立社交声量。", "让游戏活动资讯不只被看见，也能透过粉丝熟悉的角色与互动情境被讨论。", "游戏讯息需要在不牺牲活动感的前提下，进入受众熟悉的内容语境。", "以啦啦队合作为切点，兼顾社交辨识度、现场感与受众可参与性。", "以人物互动、活动氛围与游戏主题为主轴，避免把内容做成单向广告。", "协调合作条件、内容方向、素材确认与发布时间，让各方在同一项目节点推进。", "交付合作素材、发布链接与执行整理；复盘重点放在可延伸的话题角度与后续素材使用。"],
      en: ["Liming Reappearance needed recognizable, entertainment-led collaboration assets to create momentum for a game campaign.", "Make the campaign information visible and discussable through a familiar fan-facing context.", "The game message needed to enter a native content context without losing campaign energy.", "Cheerleaders were selected for strong social recognition, live-event energy, and audience participation potential.", "The content focused on character interaction, campaign atmosphere, and the game theme instead of a one-way advertisement.", "Zhenguo coordinated collaboration terms, content direction, asset checks, and publishing timing around shared project milestones.", "Deliverables included campaign assets, publishing links, and an execution summary. The review focused on reusable conversation angles and future asset use."]
    }
  },
  {
    slug: "korea-kol-goodme",
    image: "web-assets/case-goodme-korean-kol.webp",
    relatedServices: ["kol-marketing", "overseas-influencer-marketing", "korea-influencer-marketing", "korea-koc-marketing", "food-influencer-marketing", "instagram-kol-collaboration"],
    title: {
      "zh-Hant": "韓國 KOL x 古茗飲料",
      "zh-Hans": "韩国 KOL x 古茗饮料",
      en: "Korean KOL x Goodme Tea"
    },
    summary: {
      "zh-Hant": "以韓國創作者實訪門市，把旅遊動線、飲品體驗與社群內容串成可理解的品牌故事。",
      "zh-Hans": "以韩国创作者实访门店，把旅行路线、饮品体验与社交内容串成可理解的品牌故事。",
      en: "A Korean creator store visit that connected travel context, drink experience, and social storytelling into a clear brand narrative."
    },
    content: {
      "zh-Hant": ["古茗希望讓海外受眾更容易理解中國茶飲品牌的門市與產品體驗。", "以韓國市場的創作者內容，建立可感知的門市體驗與品牌認知。", "餐飲內容若只描述產品，很難讓陌生市場理解到店的理由與消費情境。", "選擇能把旅遊、城市探索與日常飲品體驗自然串連的韓國創作者。", "以實訪、飲品選擇、門市情境與個人感受為內容線索，保留創作者自身敘事。", "管理溝通、到店安排、重點確認與上刊追蹤，讓素材與合作節奏可被品牌端掌握。", "交付上刊內容與連結整理；復盤重點是海外創作者如何替在地門市補足品牌情境。"],
      "zh-Hans": ["古茗希望让海外受众更容易理解中国茶饮品牌的门店与产品体验。", "以韩国市场的创作者内容，建立可感知的门店体验与品牌认知。", "餐饮内容若只描述产品，很难让陌生市场理解到店的理由与消费情境。", "选择能把旅行、城市探索与日常饮品体验自然串连的韩国创作者。", "以实访、饮品选择、门店情境与个人感受为内容线索，保留创作者自身叙事。", "管理沟通、到店安排、重点确认与发布追踪，让素材与合作节奏可被品牌端掌握。", "交付发布内容与链接整理；复盘重点是海外创作者如何替在地门店补足品牌情境。"],
      en: ["Goodme Tea wanted overseas audiences to better understand the store and product experience of a Chinese tea brand.", "Use Korean creator content to create a tangible store experience and brand understanding in the Korean market.", "Food content that only describes a product rarely explains why a new audience would visit a store.", "A Korean creator who could naturally connect travel, city exploration, and everyday drink experiences was selected.", "The content used the visit, drink selection, store context, and personal response as its narrative thread while keeping the creator's own voice.", "Zhenguo managed communication, visit arrangements, key-message checks, and publishing follow-up so the brand could follow the campaign rhythm.", "Deliverables included published content and a link summary. The review focused on how overseas creators can add local context for physical stores."]
    }
  },
  {
    slug: "camay-curling-iron",
    image: "web-assets/case-camay-curling-iron.webp",
    relatedServices: ["kol-marketing", "ugc-content-creation", "tiktok-influencer-marketing", "tiktok-koc-marketing", "instagram-influencer-marketing", "beauty-influencer-marketing"],
    title: {
      "zh-Hant": "凱夢捲髮棒",
      "zh-Hans": "凯梦卷发棒",
      en: "Camay Hair Curler"
    },
    summary: {
      "zh-Hant": "以男性造型需求切入，透過創作者實測與功能拆解，讓產品賣點被看懂。",
      "zh-Hans": "以男性造型需求切入，透过创作者实测与功能拆解，让产品卖点被看懂。",
      en: "Creator testing and feature breakdowns framed the product around men's styling needs, making the product benefits easier to understand."
    },
    content: {
      "zh-Hant": ["凱夢需要以更具體的使用情境，說明捲髮棒在男性日常造型中的價值。", "讓受眾理解髮根、瀏海與快速加熱等功能，並降低嘗試造型工具的門檻。", "美髮工具的規格本身不容易被感知，內容需要把功能轉為使用前後的具體差異。", "選擇能自然示範男性造型過程、並以實測方式說明產品的創作者。", "用日常整理、步驟拆解與重點功能呈現，讓內容既保有個人感，也有可理解的產品資訊。", "協助確認內容重點、產品資訊、素材檢查與發布節點，降低功能表述與使用示範的落差。", "交付短影音與社群素材整理；復盤重點是哪些實測畫面最能承接後續廣告與社群再利用。"],
      "zh-Hans": ["凯梦需要以更具体的使用情境，说明卷发棒在男性日常造型中的价值。", "让受众理解发根、刘海与快速加热等功能，并降低尝试造型工具的门槛。", "美发工具的规格本身不容易被感知，内容需要把功能转为使用前后的具体差异。", "选择能自然示范男性造型过程、并以实测方式说明产品的创作者。", "用日常整理、步骤拆解与重点功能呈现，让内容既保有个人感，也有可理解的产品资讯。", "协助确认内容重点、产品资讯、素材检查与发布节点，降低功能表述与使用示范的落差。", "交付短视频与社交素材整理；复盘重点是哪些实测画面最能承接后续广告与社交再利用。"],
      en: ["Camay needed a more tangible use case to explain the value of its curling iron in men's everyday styling.", "Help audiences understand root volume, bangs, and fast-heating benefits while reducing the barrier to trying a styling tool.", "Tool specifications are not inherently easy to feel, so the content needed to turn features into visible before-and-after differences.", "A creator able to naturally demonstrate men's styling and explain the product through real testing was selected.", "Everyday grooming, step-by-step use, and key features were combined so the content kept a personal voice while explaining the product clearly.", "Zhenguo aligned key messages, product information, asset checks, and publishing milestones to reduce the gap between technical claims and demonstrations.", "Deliverables included short-form and social assets. The review focused on which testing scenes could support later advertising and social reuse."]
    }
  }
];

const caseUi = {
  "zh-Hant": {
    home: "首頁", cases: "案例", readCase: "閱讀完整案例", relatedServices: "相關服務頁",
    labels: ["專案背景", "品牌目標", "市場難點", "創作者選擇邏輯", "內容策略", "執行過程", "交付與復盤"],
    ctaTitle: "有相似的合作需求？", ctaBody: "提交市場、預算與時程，我們會整理第一版合作方向。", cta: "立即取得初步合作建議"
  },
  "zh-Hans": {
    home: "首页", cases: "案例", readCase: "阅读完整案例", relatedServices: "相关服务页",
    labels: ["项目背景", "品牌目标", "市场难点", "创作者选择逻辑", "内容策略", "执行过程", "交付与复盘"],
    ctaTitle: "有相似的合作需求？", ctaBody: "提交市场、预算与时程，我们会整理第一版合作方向。", cta: "立即获取初步合作建议"
  },
  en: {
    home: "Home", cases: "Case Studies", readCase: "Read the full case", relatedServices: "Related Service Pages",
    labels: ["Project Background", "Brand Objective", "Market Challenge", "Creator Selection Logic", "Content Strategy", "Execution", "Deliverables and Review"],
    ctaTitle: "Have a similar campaign need?", ctaBody: "Share your market, budget, and timing and we will organize an initial direction.", cta: "Get Initial Campaign Advice"
  }
};

const serviceUi = {
  "zh-Hant": {
    home: "首頁",
    services: "服務",
    brandSmall: "海內外創作者行銷專案團隊",
    eyebrow: "Creator Marketing Project Management",
    overviewTitle: "服務介紹",
    decisionTitle: "合作判斷與交付",
    decisionFitTitle: "這個服務適合什麼情況？",
    decisionDeliverablesTitle: "你會收到什麼？",
    decisionPrepareTitle: "開始前先確認什麼？",
    deliverablesBody: "依專案範圍，常見交付包含創作者候選方向、推薦理由、合作條件與報價整理、內容重點、審稿記錄、上刊連結與素材／授權狀態。",
    preparationBody: "先準備產品資訊、目標市場、預算區間、預計上線時間、可寄樣方式，以及可接受的內容與審稿規則；這些條件會直接影響人選與時程。",
    faqFitSuffix: "適合什麼情況？",
    faqDeliverablesSuffix: "通常會交付什麼？",
    faqPrepareSuffix: "開始前要先確認什麼？",
    processTitle: "合作流程",
    faqTitle: "常見問題",
    caseStudiesTitle: "相關案例",
    ctaTitle: "想先確認這個服務是否適合你的品牌？",
    ctaBody: "提交市場、預算與時程，我們會依專案條件整理第一版合作方向。",
    ctaPrimary: "立即取得初步合作建議",
    ctaSecondary: "查看相關案例",
    steps: ["需求與市場確認", "創作者篩選", "合作洽談與寄樣", "內容審核與發布", "成效追蹤與下一步"],
    stepBody: "每一步都以品牌端可判斷、可追蹤、可交接為原則，降低跨境溝通成本。"
  },
  "zh-Hans": {
    home: "首页",
    services: "服务",
    brandSmall: "海内外创作者营销项目团队",
    eyebrow: "Creator Marketing Project Management",
    overviewTitle: "服务介绍",
    decisionTitle: "合作判断与交付",
    decisionFitTitle: "这项服务适合什么情况？",
    decisionDeliverablesTitle: "你会收到什么？",
    decisionPrepareTitle: "开始前先确认什么？",
    deliverablesBody: "依项目范围，常见交付包含创作者候选方向、推荐理由、合作条件与报价整理、内容重点、审核记录、发布链接与素材／授权状态。",
    preparationBody: "先准备产品信息、目标市场、预算区间、预计上线时间、可寄样方式，以及可接受的内容与审核规则；这些条件会直接影响人选与时程。",
    faqFitSuffix: "适合什么情况？",
    faqDeliverablesSuffix: "通常会交付什么？",
    faqPrepareSuffix: "开始前要先确认什么？",
    processTitle: "合作流程",
    faqTitle: "常见问题",
    caseStudiesTitle: "相关案例",
    ctaTitle: "想先确认这项服务是否适合你的品牌？",
    ctaBody: "提交市场、预算与时程，我们会依项目条件整理第一版合作方向。",
    ctaPrimary: "立即获取初步合作建议",
    ctaSecondary: "查看相关案例",
    steps: ["需求与市场确认", "创作者筛选", "合作洽谈与寄样", "内容审核与发布", "成效追踪与下一步"],
    stepBody: "每一步都以品牌端可判断、可追踪、可交接为原则，降低跨境沟通成本。"
  },
  en: {
    home: "Home",
    services: "Services",
    brandSmall: "Domestic & Overseas Creator Marketing Project Team",
    eyebrow: "Creator Marketing Project Management",
    overviewTitle: "Service Overview",
    decisionTitle: "Decision Guide and Deliverables",
    decisionFitTitle: "When does this service fit?",
    decisionDeliverablesTitle: "What will you receive?",
    decisionPrepareTitle: "What should be confirmed first?",
    deliverablesBody: "Depending on scope, common deliverables include creator directions, recommendation rationale, collaboration terms and quote tracking, content priorities, review records, publishing links, and asset or usage-rights status.",
    preparationBody: "Prepare product information, target market, budget range, launch timing, sample availability, and acceptable content and review rules. These conditions directly affect creator options and timing.",
    faqFitSuffix: "When does it fit?",
    faqDeliverablesSuffix: "What does it usually deliver?",
    faqPrepareSuffix: "What should be confirmed before starting?",
    processTitle: "Collaboration Workflow",
    faqTitle: "Frequently Asked Questions",
    caseStudiesTitle: "Related Case Studies",
    ctaTitle: "Want to check whether this service fits your brand?",
    ctaBody: "Share your market, budget, and timing. We will organize an initial direction based on the project conditions.",
    ctaPrimary: "Get Initial Campaign Advice",
    ctaSecondary: "View Related Cases",
    steps: ["Brief and market alignment", "Creator screening", "Negotiation and product seeding", "Content review and publishing", "Tracking and next steps"],
    stepBody: "Each step is designed to be easy for brand teams to judge, track, and hand off, reducing cross-border coordination cost."
  }
};

const findObjectLiteral = (html, variableName) => {
  const marker = `const ${variableName} =`;
  const markerIndex = html.indexOf(marker);
  if (markerIndex === -1) throw new Error(`Cannot find ${marker}`);
  const start = html.indexOf("{", markerIndex);
  let depth = 0;
  let quote = "";
  let escaped = false;
  for (let index = start; index < html.length; index += 1) {
    const char = html[index];
    if (quote) {
      if (escaped) {
        escaped = false;
      } else if (char === "\\") {
        escaped = true;
      } else if (char === quote) {
        quote = "";
      }
      continue;
    }
    if (char === "\"" || char === "'" || char === "`") {
      quote = char;
      continue;
    }
    if (char === "{") depth += 1;
    if (char === "}") {
      depth -= 1;
      if (depth === 0) return html.slice(start, index + 1);
    }
  }
  throw new Error(`Cannot parse ${variableName}`);
};

const translations = Function(`"use strict"; return (${findObjectLiteral(source, "translations")});`)();

const escapeHtml = (value) => String(value)
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;");
const escapeAttr = (value) => escapeHtml(value).replace(/"/g, "&quot;");
const replaceAttr = (tag, attr, value) => {
  const safeValue = escapeAttr(value);
  const pattern = new RegExp(`${attr}="[^"]*"`);
  if (pattern.test(tag)) return tag.replace(pattern, `${attr}="${safeValue}"`);
  return tag.replace(/>$/, ` ${attr}="${safeValue}">`);
};

const localizeElements = (html, copy) => html
  .replace(/(<[^>]+data-i18n="([^"]+)"[^>]*>)([\s\S]*?)(<\/[^>]+>)/g, (match, open, key, _content, close) => {
    if (!(key in copy)) return match;
    return `${open}${copy[key]}${close}`;
  })
  .replace(/(<[^>]+data-i18n-html="([^"]+)"[^>]*>)([\s\S]*?)(<\/[^>]+>)/g, (match, open, key, _content, close) => {
    if (!(key in copy)) return match;
    return `${open}${copy[key]}${close}`;
  })
  .replace(/<[^>]+data-i18n-alt="([^"]+)"[^>]*>/g, (tag, key) => replaceAttr(tag, "alt", copy[key] || ""))
  .replace(/<[^>]+data-i18n-src="([^"]+)"[^>]*>/g, (tag, key) => replaceAttr(tag, "src", copy[key] || ""))
  .replace(/<[^>]+data-i18n-aria-label="([^"]+)"[^>]*>/g, (tag, key) => replaceAttr(tag, "aria-label", copy[key] || ""));

const faqItems = (copy) => [
  [copy.answerOneQuestion, copy.answerOneBody],
  [copy.answerTwoQuestion, copy.answerTwoBody],
  [copy.answerThreeQuestion, copy.answerThreeBody],
  [copy.answerFourQuestion, copy.answerFourBody],
  [copy.answerFiveQuestion, copy.answerFiveBody],
  [copy.answerSixQuestion, copy.answerSixBody]
];

const organizationSchema = (locale) => ({
  "@type": ["Organization", "LocalBusiness", "ProfessionalService"],
  "@id": `${baseUrl}#organization`,
  name: locale.key === "en" ? "Zhenguo Marketing Co., Ltd." : locale.label,
  alternateName: "ZHENGUOCool",
  url: baseUrl,
  email: "weiting@zhenguocool.com",
  sameAs: ["https://www.instagram.com/kolmasters_tw"],
  address: [
    {
      "@type": "PostalAddress",
      streetAddress: locale.key === "en" ? "2F.-3, No. 352, Sec. 1, Fuxing S. Rd." : "復興南路一段352號2樓之3",
      addressLocality: locale.key === "en" ? "Da'an District" : "大安區",
      addressRegion: locale.key === "en" ? "Taipei City" : "臺北市",
      addressCountry: "TW"
    },
    {
      "@type": "PostalAddress",
      streetAddress: locale.key === "en" ? "Room 2009-B050, Qianhai Champagne Building, No. 18 Free Trade West Street" : "前海合作區自貿西街18號前海香繽大廈2009-B050",
      addressLocality: locale.key === "en" ? "Nanshan District, Shenzhen" : "深圳市南山區",
      addressRegion: locale.key === "en" ? "Guangdong" : "廣東省",
      addressCountry: "CN"
    }
  ]
});

const buildHomeSchema = (copy, locale) => ({
  "@context": "https://schema.org",
  "@graph": [
    organizationSchema(locale),
    {
      "@type": "WebSite",
      "@id": `${baseUrl}#website`,
      url: locale.url,
      name: locale.label,
      inLanguage: locale.htmlLang,
      publisher: { "@id": `${baseUrl}#organization` }
    },
    {
      "@type": "Service",
      "@id": `${locale.url}#service`,
      name: copy.servicesTitle,
      provider: { "@id": `${baseUrl}#organization` },
      serviceType: ["Overseas Influencer Marketing", "KOL Marketing", "TikTok Influencer Marketing", "YouTube Influencer Marketing", "Instagram Influencer Marketing"],
      areaServed: ["United States", "Japan", "South Korea", "Southeast Asia", "Taiwan"],
      description: copy.metaDescription
    },
    {
      "@type": "FAQPage",
      "@id": `${locale.url}#faq`,
      mainEntity: faqItems(copy).map(([question, answer]) => ({
        "@type": "Question",
        name: question,
        acceptedAnswer: { "@type": "Answer", text: answer }
      }))
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${locale.url}#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: locale.key === "en" ? "Home" : "首頁", item: locale.url }
      ]
    }
  ]
});

const setLanguageLinks = (html, locale, isRoot = false) => html
  .replace(/<a ([^>]*data-lang-link="([^"]+)"[^>]*)>/g, (match, attrs, key) => {
    let nextAttrs = attrs.replace(/\saria-current="page"/g, "");
    if (!isRoot) {
      nextAttrs = nextAttrs.replace(/href="zh-tw\/"/, 'href="../zh-tw/"');
      nextAttrs = nextAttrs.replace(/href="zh-cn\/"/, 'href="../zh-cn/"');
      nextAttrs = nextAttrs.replace(/href="en\/"/, 'href="../en/"');
    }
    if (key === locale.key) nextAttrs += ' aria-current="page"';
    return `<a ${nextAttrs}>`;
  });

const renderHomePage = (locale, isRoot = false) => {
  const copy = translations[locale.key];
  if (!copy) throw new Error(`Missing copy for ${locale.key}`);

  let html = source;
  html = html.replace(/<html lang="[^"]+" data-locale="[^"]+">/, `<html lang="${locale.htmlLang}" data-locale="${locale.key}">`);
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${copy.metaTitle}</title>`);
  html = html.replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${escapeAttr(copy.metaDescription)}">`);
  html = html.replace(/<link rel="canonical" href="[^"]+">/, `<link rel="canonical" href="${locale.url}">`);
  html = html.replace(/<meta property="og:site_name" content="[^"]*">/, `<meta property="og:site_name" content="${escapeAttr(locale.label)}">`);
  html = html.replace(/<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${escapeAttr(copy.metaTitle)}">`);
  html = html.replace(/<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${escapeAttr(copy.metaDescription)}">`);
  html = html.replace(/<meta property="og:url" content="[^"]*">/, `<meta property="og:url" content="${locale.url}">`);
  html = html.replace(/<meta name="twitter:title" content="[^"]*">/, `<meta name="twitter:title" content="${escapeAttr(copy.metaTitle)}">`);
  html = html.replace(/<meta name="twitter:description" content="[^"]*">/, `<meta name="twitter:description" content="${escapeAttr(copy.metaDescription)}">`);
  html = html.replace(/<script type="application\/ld\+json" id="structured-data">[\s\S]*?<\/script>/, `<script type="application/ld+json" id="structured-data">\n${JSON.stringify(buildHomeSchema(copy, locale), null, 2)}\n  </script>`);
  html = localizeElements(html, copy);
  html = setLanguageLinks(html, locale, isRoot);
  if (!isRoot) {
    html = html
      .replace(/(src|href)="web-assets\//g, '$1="../web-assets/')
      .replace(/href="cases\//g, 'href="../cases/');
  }
  return html;
};

const serviceUrl = (page, locale) => locale.isRoot
  ? `${baseUrl}services/${page.slug}/`
  : `${locale.url}services/${page.slug}/`;

const caseStudyUrl = (study, locale) => locale.isRoot
  ? `${baseUrl}cases/${study.slug}/`
  : `${locale.url}cases/${study.slug}/`;

const serviceRelativePrefix = () => "../../";

const caseStudyAlternates = (study) => [
  `<link rel="alternate" hreflang="zh-Hant" href="${caseStudyUrl(study, locales[0])}">`,
  `<link rel="alternate" hreflang="zh-Hans" href="${caseStudyUrl(study, locales[1])}">`,
  `<link rel="alternate" hreflang="en" href="${caseStudyUrl(study, locales[2])}">`,
  `<link rel="alternate" hreflang="x-default" href="${caseStudyUrl(study, rootLocale)}">`
].join("\n  ");

const relatedCaseStudies = (page) => caseStudies.filter((study) => study.relatedServices.includes(page.slug));

const serviceRelation = {
  "tiktok-influencer-marketing": { slug: "tiktok-koc-marketing", profile: "influencer" },
  "tiktok-koc-marketing": { slug: "tiktok-influencer-marketing", profile: "koc" },
  "youtube-influencer-marketing": { slug: "youtube-influencer-review", profile: "sponsorship" },
  "youtube-influencer-review": { slug: "youtube-influencer-marketing", profile: "review" },
  "instagram-influencer-marketing": { slug: "instagram-kol-collaboration", profile: "strategy" },
  "instagram-kol-collaboration": { slug: "instagram-influencer-marketing", profile: "execution" },
  "japan-influencer-marketing": { slug: "japan-koc-marketing", profile: "marketPlan" },
  "japan-koc-marketing": { slug: "japan-influencer-marketing", profile: "marketKoc" },
  "korea-influencer-marketing": { slug: "korea-koc-marketing", profile: "marketPlan" },
  "korea-koc-marketing": { slug: "korea-influencer-marketing", profile: "marketKoc" }
};

const relationCopy = {
  "zh-Hant": {
    influencer: (name) => ["需要單一影響力合作，還是多角度測試？", `若目標是少數創作者的影響力、主題內容或較高溝通密度，這頁較適合；若要用多位短影音創作者測試內容角度與口碑素材，請比較 ${name}。`],
    koc: (name) => ["KOC 測試和單一創作者合作怎麼選？", `若希望快速累積多個內容角度與可複用素材，這頁較適合；若需要較強的個人影響力、深度說明或單一主題合作，請比較 ${name}。`],
    sponsorship: (name) => ["YouTube 業配與評測內容怎麼選？", `若品牌需要較明確的合作訊息、主題整合或長期內容合作，這頁較適合；若核心是產品開箱、實測與使用教學，請比較 ${name}。`],
    review: (name) => ["評測合作和一般 YouTube 業配有何不同？", `這頁適合需要開箱、比較、實測或教學節奏的產品；若品牌更重視主題整合、形象合作或長期內容規劃，請比較 ${name}。`],
    strategy: (name) => ["Instagram 策略與單次 KOL 合作怎麼選？", `這頁適合需要把 Reels、貼文、限動與素材授權排成內容組合的品牌；若已明確鎖定創作者與單次合作形式，請比較 ${name}。`],
    execution: (name) => ["單次 KOL 合作與 Instagram 內容策略怎麼選？", `這頁適合已經知道希望合作的 Reels、貼文或限動形式；若需要先規劃平台內容組合、創作者配置與素材授權，請比較 ${name}。`],
    marketPlan: (name) => ["何時該選 KOC，而不是整體市場合作？", `這頁適合需要同時判斷市場、平台、KOL／KOC 配置與完整執行流程的品牌；若已確定要以多位微型創作者測試在地口碑，請比較 ${name}。`],
    marketKoc: (name) => ["何時該從 KOC 測試擴大為市場專案？", `這頁適合先用多位創作者測試內容角度與在地反應；若需要更完整的市場規劃、KOL／KOC 組合或跨平台執行，請比較 ${name}。`]
  },
  "zh-Hans": {
    influencer: (name) => ["需要单一影响力合作，还是多角度测试？", `若目标是少数创作者的影响力、主题内容或较高沟通密度，这页较适合；若要用多位短视频创作者测试内容角度与口碑素材，请比较 ${name}。`],
    koc: (name) => ["KOC 测试和单一创作者合作怎么选？", `若希望快速累积多个内容角度与可复用素材，这页较适合；若需要较强的个人影响力、深度说明或单一主题合作，请比较 ${name}。`],
    sponsorship: (name) => ["YouTube 业配与评测内容怎么选？", `若品牌需要较明确的合作信息、主题整合或长期内容合作，这页较适合；若核心是产品开箱、实测与使用教学，请比较 ${name}。`],
    review: (name) => ["评测合作和一般 YouTube 业配有何不同？", `这页适合需要开箱、比较、实测或教学节奏的产品；若品牌更重视主题整合、形象合作或长期内容规划，请比较 ${name}。`],
    strategy: (name) => ["Instagram 策略与单次 KOL 合作怎么选？", `这页适合需要把 Reels、帖文、限动与素材授权排成内容组合的品牌；若已明确锁定创作者与单次合作形式，请比较 ${name}。`],
    execution: (name) => ["单次 KOL 合作与 Instagram 内容策略怎么选？", `这页适合已经知道希望合作的 Reels、帖文或限动形式；若需要先规划平台内容组合、创作者配置与素材授权，请比较 ${name}。`],
    marketPlan: (name) => ["何时该选 KOC，而不是整体市场合作？", `这页适合需要同时判断市场、平台、KOL／KOC 配置与完整执行流程的品牌；若已确定要以多位微型创作者测试在地口碑，请比较 ${name}。`],
    marketKoc: (name) => ["何时该从 KOC 测试扩大为市场项目？", `这页适合先用多位创作者测试内容角度与在地反应；若需要更完整的市场规划、KOL／KOC 组合或跨平台执行，请比较 ${name}。`]
  },
  en: {
    influencer: (name) => ["Should you choose focused influence or multi-angle testing?", `This page fits campaigns needing a few higher-impact creators, themed content, or closer coordination. For testing content angles and word-of-mouth assets with many short-video creators, compare ${name}.`],
    koc: (name) => ["How does KOC testing differ from focused creator work?", `This page fits campaigns that need many content angles and reusable assets quickly. For stronger individual influence, deeper explanation, or a focused theme, compare ${name}.`],
    sponsorship: (name) => ["How do YouTube sponsorships differ from review content?", `This page fits clearer campaign messaging, theme integration, or longer-term content partnerships. For unboxing, testing, and tutorials, compare ${name}.`],
    review: (name) => ["How does a review differ from a standard YouTube sponsorship?", `This page fits products that need unboxing, comparison, hands-on testing, or tutorials. For themed partnerships, brand positioning, or a longer content plan, compare ${name}.`],
    strategy: (name) => ["How does an Instagram strategy differ from a single KOL collaboration?", `This page fits brands planning Reels, posts, Stories, and usage rights as a content mix. If the creator and one-off collaboration format are already clear, compare ${name}.`],
    execution: (name) => ["How does a single KOL collaboration differ from Instagram strategy?", `This page fits brands that already know the desired Reels, post, or Story format. For planning a platform mix, creator allocation, and usage rights first, compare ${name}.`],
    marketPlan: (name) => ["When should you choose KOCs instead of a broader market project?", `This page fits brands that need market, platform, KOL/KOC mix, and full execution planning together. If you have already decided to test local word of mouth with multiple micro creators, compare ${name}.`],
    marketKoc: (name) => ["When should KOC testing expand into a broader market project?", `This page fits brands testing content angles and local response through multiple creators first. For broader market planning, KOL/KOC mix, or cross-platform execution, compare ${name}.`]
  }
};

const serviceAlternates = (page) => [
  `<link rel="alternate" hreflang="zh-Hant" href="${serviceUrl(page, locales[0])}">`,
  `<link rel="alternate" hreflang="zh-Hans" href="${serviceUrl(page, locales[1])}">`,
  `<link rel="alternate" hreflang="en" href="${serviceUrl(page, locales[2])}">`,
  `<link rel="alternate" hreflang="x-default" href="${serviceUrl(page, rootLocale)}">`
].join("\n  ");

const serviceDecisionGuide = (page, locale) => {
  const ui = serviceUi[locale.key];
  return [
    [ui.decisionFitTitle, page.intro[locale.key]],
    [ui.decisionDeliverablesTitle, ui.deliverablesBody],
    [ui.decisionPrepareTitle, ui.preparationBody]
  ];
};

const serviceFaqQuestions = (page, locale) => {
  const name = page.name[locale.key];
  const ui = serviceUi[locale.key];
  if (locale.key === "en") {
    return [`When does ${name} fit?`, `What does ${name} usually deliver?`, `What should be confirmed before ${name} starts?`];
  }
  return [`${name}${ui.faqFitSuffix}`, `${name}${ui.faqDeliverablesSuffix}`, `${name}${ui.faqPrepareSuffix}`];
};

const serviceFaq = (page, locale) => {
  const ui = serviceUi[locale.key];
  const [fitQuestion, deliverablesQuestion, prepareQuestion] = serviceFaqQuestions(page, locale);
  return [
    page.faqOne[locale.key],
    [fitQuestion, page.intro[locale.key]],
    [deliverablesQuestion, page.description[locale.key]],
    [prepareQuestion, ui.preparationBody]
  ];
};

const serviceComparison = (page, locale) => {
  const relation = serviceRelation[page.slug];
  if (!relation) return null;
  const relatedPage = servicePages.find((candidate) => candidate.slug === relation.slug);
  if (!relatedPage) return null;
  const [title, body] = relationCopy[locale.key][relation.profile](relatedPage.name[locale.key]);
  return { page: relatedPage, title, body };
};

const buildServiceSchema = (page, locale) => {
  const ui = serviceUi[locale.key];
  const url = serviceUrl(page, locale);
  const faqs = serviceFaq(page, locale);
  return {
    "@context": "https://schema.org",
    "@graph": [
      organizationSchema(locale),
      {
        "@type": "Service",
        "@id": `${url}#service`,
        name: page.name[locale.key],
        provider: { "@id": `${baseUrl}#organization` },
        serviceType: page.name.en,
        areaServed: ["United States", "Japan", "South Korea", "Southeast Asia", "Taiwan"],
        description: page.description[locale.key],
        url
      },
      {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        mainEntity: faqs.map(([question, answer]) => ({
          "@type": "Question",
          name: question,
          acceptedAnswer: { "@type": "Answer", text: answer }
        }))
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: ui.home, item: locale.url },
          { "@type": "ListItem", position: 2, name: ui.services, item: `${locale.url}#services` },
          { "@type": "ListItem", position: 3, name: page.name[locale.key], item: url }
        ]
      }
    ]
  };
};

const serviceCss = `
    :root { --ink:#14213d; --muted:#5f6f89; --paper:#fbfaf6; --surface:#fff; --line:#e7dfd1; --coral:#e94f37; --teal:#0f8b8d; --mustard:#f3b61f; --forest:#29524a; --shadow:0 24px 80px rgba(20,33,61,.13); }
    * { box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    body { margin:0; color:var(--ink); background:var(--paper); font-family:"Noto Sans TC","PingFang TC","Microsoft JhengHei",sans-serif; line-height:1.65; }
    a { color:inherit; text-decoration:none; }
    .wrap { width:min(1080px, calc(100% - 40px)); margin:0 auto; }
    header { border-bottom:1px solid var(--line); background:rgba(251,250,246,.9); backdrop-filter:blur(16px); position:sticky; top:0; z-index:5; }
    .nav { min-height:68px; display:flex; align-items:center; justify-content:space-between; gap:20px; font-weight:900; }
    .brand { line-height:1.1; }
    .brand small { display:block; color:var(--teal); font-size:12px; letter-spacing:.18em; text-transform:uppercase; }
    .nav-links { display:flex; gap:14px; align-items:center; color:var(--muted); font-size:14px; }
    .nav-cta { color:#fff; background:var(--ink); border-radius:999px; padding:9px 14px; }
    .hero { padding:92px 0 74px; background:linear-gradient(120deg, rgba(243,182,31,.16), transparent 34%), linear-gradient(315deg, rgba(15,139,141,.16), transparent 32%); }
    .eyebrow { display:inline-flex; align-items:center; gap:10px; color:var(--teal); font-weight:900; letter-spacing:.18em; text-transform:uppercase; font-size:12px; }
    .eyebrow:before { content:""; width:42px; height:2px; background:var(--teal); }
    h1,h2,h3,p { margin-top:0; }
    h1 { margin:18px 0 22px; max-width:860px; font-family:Georgia,"Times New Roman",serif; font-size:clamp(44px,7vw,86px); line-height:1; }
    .hero p { max-width:780px; color:#40516c; font-size:clamp(18px,2vw,22px); }
    .actions { display:flex; flex-wrap:wrap; gap:12px; margin-top:30px; }
    .button { display:inline-flex; align-items:center; justify-content:center; min-height:48px; padding:12px 20px; border-radius:999px; border:1px solid var(--ink); font-weight:900; }
    .primary { color:#fff; background:var(--coral); border-color:var(--coral); }
    section { padding:72px 0; }
    .grid { display:grid; grid-template-columns:repeat(2, 1fr); gap:18px; }
    .card { background:var(--surface); border:1px solid var(--line); border-radius:8px; padding:26px; box-shadow:0 16px 42px rgba(20,33,61,.06); }
    .card h3 { margin-bottom:10px; font-size:22px; line-height:1.25; }
    .card p { color:var(--muted); margin:0; }
    .steps { counter-reset:step; }
    .steps .card:before { counter-increment:step; content:"0" counter(step); display:block; color:var(--coral); font-family:Georgia,"Times New Roman",serif; font-size:36px; line-height:1; margin-bottom:12px; }
    .faq { background:#fffdf8; border-block:1px solid var(--line); }
    .cta { color:#fff; background:var(--forest); }
    .cta p { color:#e9f3ee; }
    footer { padding:28px 0; border-top:1px solid var(--line); color:var(--muted); font-size:14px; }
    @media (max-width: 760px) { .nav { align-items:flex-start; flex-direction:column; padding:14px 0; } .nav-links { flex-wrap:wrap; } .grid { grid-template-columns:1fr; } section { padding:54px 0; } h1 { font-size:clamp(38px, 10vw, 46px); line-height:1.08; overflow-wrap:anywhere; } }
`;

const renderServicePage = (page, locale) => {
  const ui = serviceUi[locale.key];
  const url = serviceUrl(page, locale);
  const prefix = serviceRelativePrefix(locale);
  const faqs = serviceFaq(page, locale);
  const decisionGuide = serviceDecisionGuide(page, locale);
  const comparison = serviceComparison(page, locale);
  const relatedStudies = relatedCaseStudies(page);
  const secondaryHref = relatedStudies.length ? "#case-studies" : `${prefix}#cases`;
  const steps = ui.steps.map((step) => `<article class="card"><h3>${escapeHtml(step)}</h3><p>${escapeHtml(ui.stepBody)}</p></article>`).join("\n          ");
  const faqCards = faqs.map(([question, answer]) => `<article class="card"><h3>${escapeHtml(question)}</h3><p>${escapeHtml(answer)}</p></article>`).join("\n          ");
  const guideCards = decisionGuide.map(([title, body]) => `<article class="card"><h3>${escapeHtml(title)}</h3><p>${escapeHtml(body)}</p></article>`).join("\n          ");
  const caseCards = relatedStudies.map((study) => `<article class="card"><h3>${escapeHtml(study.title[locale.key])}</h3><p>${escapeHtml(study.summary[locale.key])}</p><p style="margin-top:16px"><a class="button" href="${prefix}cases/${study.slug}/">${escapeHtml(caseUi[locale.key].readCase)}</a></p></article>`).join("\n          ");
  return `<!DOCTYPE html>
<html lang="${locale.htmlLang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${escapeAttr(page.description[locale.key])}">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="${url}">
  ${serviceAlternates(page)}
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="${escapeAttr(locale.label)}">
  <meta property="og:title" content="${escapeAttr(page.title[locale.key])}">
  <meta property="og:description" content="${escapeAttr(page.description[locale.key])}">
  <meta property="og:url" content="${url}">
  <meta property="og:image" content="${baseUrl}${socialShareImage}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeAttr(page.title[locale.key])}">
  <meta name="twitter:description" content="${escapeAttr(page.description[locale.key])}">
  <title>${escapeHtml(page.title[locale.key])}</title>
  <script type="application/ld+json">
${JSON.stringify(buildServiceSchema(page, locale), null, 2)}
  </script>
  <style>${serviceCss}
  </style>
</head>
<body>
  <header>
    <div class="wrap nav">
      <a class="brand" href="${prefix}"><span>${escapeHtml(locale.label)}</span><small>${escapeHtml(ui.brandSmall)}</small></a>
      <nav class="nav-links" aria-label="${escapeAttr(ui.services)}">
        <a href="${prefix}#services">${escapeHtml(ui.services)}</a>
        <a href="${prefix}#answers">FAQ</a>
        <a class="nav-cta" href="${prefix}#contact-form">${escapeHtml(ui.ctaPrimary)}</a>
      </nav>
    </div>
  </header>
  <main>
    <section class="hero">
      <div class="wrap">
        <span class="eyebrow">${escapeHtml(ui.eyebrow)}</span>
        <h1>${escapeHtml(page.title[locale.key])}</h1>
        <p>${escapeHtml(page.intro[locale.key])}</p>
        <div class="actions">
          <a class="button primary" href="${prefix}#contact-form">${escapeHtml(ui.ctaPrimary)}</a>
          <a class="button" href="${secondaryHref}">${escapeHtml(ui.ctaSecondary)}</a>
        </div>
      </div>
    </section>
    <section>
      <div class="wrap">
        <h2>${escapeHtml(ui.overviewTitle)}</h2>
        <div class="grid">
          <article class="card"><h3>${escapeHtml(page.name[locale.key])}</h3><p>${escapeHtml(page.description[locale.key])}</p></article>
          <article class="card"><h3>${escapeHtml(translations[locale.key].whyThreeTitle)}</h3><p>${escapeHtml(translations[locale.key].whyThreeBody)}</p></article>
        </div>
      </div>
    </section>
    <section id="decision-guide">
      <div class="wrap">
        <h2>${escapeHtml(ui.decisionTitle)}</h2>
        <div class="grid">
          ${guideCards}
        </div>
      </div>
    </section>
${comparison ? `<section class="service-comparison">
      <div class="wrap">
        <div class="card">
          <h2>${escapeHtml(comparison.title)}</h2>
          <p>${escapeHtml(comparison.body)}</p>
          <p style="margin-top:18px"><a class="button" href="${prefix}services/${comparison.page.slug}/">${escapeHtml(comparison.page.name[locale.key])}</a></p>
        </div>
      </div>
    </section>` : ""}
    <section>
      <div class="wrap">
        <h2>${escapeHtml(ui.processTitle)}</h2>
        <div class="grid steps">
          ${steps}
        </div>
      </div>
    </section>
    <section class="faq">
      <div class="wrap">
        <h2>${escapeHtml(ui.faqTitle)}</h2>
        <div class="grid">
          ${faqCards}
        </div>
      </div>
    </section>
${relatedStudies.length ? `<section id="case-studies">
      <div class="wrap">
        <h2>${escapeHtml(ui.caseStudiesTitle)}</h2>
        <div class="grid">
          ${caseCards}
        </div>
      </div>
    </section>` : ""}
    <section id="contact" class="cta">
      <div class="wrap">
        <h2>${escapeHtml(ui.ctaTitle)}</h2>
        <p>${escapeHtml(ui.ctaBody)}</p>
        <div class="actions">
          <a class="button primary" href="${prefix}#contact-form">${escapeHtml(ui.ctaPrimary)}</a>
          <a class="button" href="${secondaryHref}">${escapeHtml(ui.ctaSecondary)}</a>
        </div>
      </div>
    </section>
  </main>
  <footer><div class="wrap">© 2026 ${escapeHtml(locale.label)} / ZHENGUOCool. All Rights Reserved.</div></footer>
</body>
</html>
`;
};

const buildCaseSchema = (study, locale) => {
  const url = caseStudyUrl(study, locale);
  const ui = caseUi[locale.key];
  return {
    "@context": "https://schema.org",
    "@graph": [
      organizationSchema(locale),
      {
        "@type": "CreativeWork",
        "@id": `${url}#case-study`,
        name: study.title[locale.key],
        description: study.summary[locale.key],
        image: `${baseUrl}${study.image}`,
        url,
        inLanguage: locale.htmlLang,
        creator: { "@id": `${baseUrl}#organization` }
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: ui.home, item: locale.url },
          { "@type": "ListItem", position: 2, name: ui.cases, item: `${locale.url}#cases` },
          { "@type": "ListItem", position: 3, name: study.title[locale.key], item: url }
        ]
      }
    ]
  };
};

const renderCasePage = (study, locale) => {
  const ui = caseUi[locale.key];
  const serviceCopy = serviceUi[locale.key];
  const url = caseStudyUrl(study, locale);
  const prefix = "../../";
  const assetPrefix = locale.isRoot ? "../../" : "../../../";
  const sections = study.content[locale.key].map((body, index) => `<article class="card"><h3>${escapeHtml(ui.labels[index])}</h3><p>${escapeHtml(body)}</p></article>`).join("\n          ");
  const serviceLinks = study.relatedServices.map((slug) => servicePages.find((page) => page.slug === slug)).filter(Boolean)
    .map((page) => `<a class="button" href="${prefix}services/${page.slug}/">${escapeHtml(page.name[locale.key])}</a>`).join("\n          ");
  return `<!DOCTYPE html>
<html lang="${locale.htmlLang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${escapeAttr(study.summary[locale.key])}">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="${url}">
  ${caseStudyAlternates(study)}
  <meta property="og:type" content="article">
  <meta property="og:site_name" content="${escapeAttr(locale.label)}">
  <meta property="og:title" content="${escapeAttr(study.title[locale.key])}">
  <meta property="og:description" content="${escapeAttr(study.summary[locale.key])}">
  <meta property="og:url" content="${url}">
  <meta property="og:image" content="${baseUrl}${socialShareImage}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeAttr(study.title[locale.key])}">
  <meta name="twitter:description" content="${escapeAttr(study.summary[locale.key])}">
  <title>${escapeHtml(study.title[locale.key])} | ${escapeHtml(locale.label)}</title>
  <script type="application/ld+json">
${JSON.stringify(buildCaseSchema(study, locale), null, 2)}
  </script>
  <style>${serviceCss}
    .case-image { width:100%; max-width:760px; margin-top:32px; border:1px solid var(--line); border-radius:8px; background:#fff; }
    .case-summary { max-width:780px; color:#40516c; font-size:clamp(18px,2vw,22px); }
  </style>
</head>
<body>
  <header>
    <div class="wrap nav">
      <a class="brand" href="${prefix}"><span>${escapeHtml(locale.label)}</span><small>${escapeHtml(serviceCopy.brandSmall)}</small></a>
      <nav class="nav-links" aria-label="${escapeAttr(ui.cases)}">
        <a href="${prefix}#cases">${escapeHtml(ui.cases)}</a>
        <a class="nav-cta" href="${prefix}#contact-form">${escapeHtml(ui.cta)}</a>
      </nav>
    </div>
  </header>
  <main>
    <section class="hero">
      <div class="wrap">
        <span class="eyebrow">CASE STUDY</span>
        <h1>${escapeHtml(study.title[locale.key])}</h1>
        <p class="case-summary">${escapeHtml(study.summary[locale.key])}</p>
        <img class="case-image" src="${assetPrefix}${study.image}" alt="${escapeAttr(study.title[locale.key])}">
      </div>
    </section>
    <section>
      <div class="wrap">
        <div class="grid">
          ${sections}
        </div>
      </div>
    </section>
    <section>
      <div class="wrap">
        <h2>${escapeHtml(ui.relatedServices)}</h2>
        <div class="actions">
          ${serviceLinks}
        </div>
      </div>
    </section>
    <section class="cta">
      <div class="wrap">
        <h2>${escapeHtml(ui.ctaTitle)}</h2>
        <p>${escapeHtml(ui.ctaBody)}</p>
        <div class="actions"><a class="button primary" href="${prefix}#contact-form">${escapeHtml(ui.cta)}</a></div>
      </div>
    </section>
  </main>
  <footer><div class="wrap">© 2026 ${escapeHtml(locale.label)} / ZHENGUOCool. All Rights Reserved.</div></footer>
</body>
</html>
`;
};

const thanksUi = {
  "zh-Hant": { title: "已收到合作需求", body: "謝謝你提供專案資訊。我們會依目標市場、預算與時程整理第一版合作方向，再與你聯繫。", cta: "回到首頁" },
  "zh-Hans": { title: "已收到合作需求", body: "谢谢你提供项目信息。我们会依目标市场、预算与时程整理第一版合作方向，再与你联系。", cta: "回到首页" },
  en: { title: "Your project brief is received", body: "Thank you for sharing your project details. We will review the market, budget, and timing, then follow up with an initial direction.", cta: "Back to home" }
};

const thankYouUrl = (locale) => locale.isRoot ? `${baseUrl}thanks/` : `${locale.url}thanks/`;

const renderThankYouPage = (locale) => {
  const copy = thanksUi[locale.key];
  const prefix = "../";
  return `<!DOCTYPE html>
<html lang="${locale.htmlLang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="robots" content="noindex, follow">
  <link rel="canonical" href="${thankYouUrl(locale)}">
  <title>${escapeHtml(copy.title)} | ${escapeHtml(locale.label)}</title>
  <style>${serviceCss}</style>
</head>
<body>
  <main><section class="hero"><div class="wrap"><span class="eyebrow">ZHENGUOCOOL</span><h1>${escapeHtml(copy.title)}</h1><p>${escapeHtml(copy.body)}</p><div class="actions"><a class="button primary" href="${prefix}">${escapeHtml(copy.cta)}</a></div></div></section></main>
</body>
</html>
`;
};

fs.writeFileSync(sourcePath, renderHomePage(rootLocale, true));

for (const locale of locales) {
  const dir = path.join(root, locale.dir);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), renderHomePage(locale));
}

for (const page of servicePages) {
  const rootDir = path.join(root, "services", page.slug);
  fs.mkdirSync(rootDir, { recursive: true });
  fs.writeFileSync(path.join(rootDir, "index.html"), renderServicePage(page, rootLocale));
  for (const locale of locales) {
    const dir = path.join(root, locale.dir, "services", page.slug);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, "index.html"), renderServicePage(page, locale));
  }
}

for (const study of caseStudies) {
  const rootDir = path.join(root, "cases", study.slug);
  fs.mkdirSync(rootDir, { recursive: true });
  fs.writeFileSync(path.join(rootDir, "index.html"), renderCasePage(study, rootLocale));
  for (const locale of locales) {
    const dir = path.join(root, locale.dir, "cases", study.slug);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, "index.html"), renderCasePage(study, locale));
  }
}

const rootThanksDir = path.join(root, "thanks");
fs.mkdirSync(rootThanksDir, { recursive: true });
fs.writeFileSync(path.join(rootThanksDir, "index.html"), renderThankYouPage(rootLocale));
for (const locale of locales) {
  const dir = path.join(root, locale.dir, "thanks");
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), renderThankYouPage(locale));
}

const sitemapItems = [];
sitemapItems.push({
  loc: baseUrl,
  priority: "1.0",
  alternates: [
    ...locales.map((locale) => [locale.htmlLang, locale.url]),
    ["x-default", baseUrl]
  ]
});
for (const locale of locales) {
  sitemapItems.push({
    loc: locale.url,
    priority: "0.9",
    alternates: [
      ...locales.map((altLocale) => [altLocale.htmlLang, altLocale.url]),
      ["x-default", baseUrl]
    ]
  });
}
for (const page of servicePages) {
  const alternates = [
    ...locales.map((locale) => [locale.htmlLang, serviceUrl(page, locale)]),
    ["x-default", serviceUrl(page, rootLocale)]
  ];
  sitemapItems.push({ loc: serviceUrl(page, rootLocale), priority: "0.86", alternates });
  for (const locale of locales) {
    sitemapItems.push({ loc: serviceUrl(page, locale), priority: "0.82", alternates });
  }
}
for (const study of caseStudies) {
  const alternates = [
    ...locales.map((locale) => [locale.htmlLang, caseStudyUrl(study, locale)]),
    ["x-default", caseStudyUrl(study, rootLocale)]
  ];
  sitemapItems.push({ loc: caseStudyUrl(study, rootLocale), priority: "0.78", alternates });
  for (const locale of locales) {
    sitemapItems.push({ loc: caseStudyUrl(study, locale), priority: "0.74", alternates });
  }
}
for (const extraPath of [
  "mytools/",
  "mytools/ai-teaching-flow/",
  "mytools/ai-prompt-engineering/",
  "mytools/ai-agent-intro/",
  "mytools/codex-first-project/",
  "mytools/ai-automation-intro/",
  "mytools/n8n-workflow-reuse/"
]) {
  sitemapItems.push({ loc: `${baseUrl}${extraPath}`, priority: "0.6", alternates: [] });
}
for (const toolPath of ["tools/youtube-channel-metrics/", "tools/instagram-insights-passive/"]) {
  sitemapItems.push({ loc: `${baseUrl}${toolPath}`, priority: "0.7", alternates: [], noAlternatePadding: true });
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${sitemapItems.map((item) => `  <url>\n    <loc>${item.loc}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>${item.priority}</priority>\n${item.alternates.map(([hreflang, href]) => `    <xhtml:link rel="alternate" hreflang="${hreflang}" href="${href}" />`).join("\n")}${item.noAlternatePadding ? "" : "\n"}  </url>`).join("\n")}\n</urlset>\n`;
fs.writeFileSync(path.join(root, "sitemap.xml"), sitemap);

const robots = `User-agent: *\nAllow: /\n\nSitemap: ${baseUrl}sitemap.xml\n`;
fs.writeFileSync(path.join(root, "robots.txt"), robots);

const trackedPageCount = injectGoogleAnalytics(root);
console.log(`Built ${locales.length} locale pages, ${servicePages.length * allLocales.length} service pages, ${caseStudies.length * allLocales.length} case pages, thank-you pages, sitemap.xml, robots.txt, and GA on ${trackedPageCount} pages`);
