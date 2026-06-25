import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const sourcePath = path.join(root, "index.html");
const baseUrl = "https://zhenguocool.com/";
const source = fs.readFileSync(sourcePath, "utf8");

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
  }
];

const serviceUi = {
  "zh-Hant": {
    home: "首頁",
    services: "服務",
    eyebrow: "Overseas Influencer Marketing",
    overviewTitle: "服務介紹",
    processTitle: "合作流程",
    faqTitle: "常見問題",
    ctaTitle: "想確認你的品牌適合哪個市場？",
    ctaBody: "把品牌目標、預算區間、目標市場與希望合作的平台寄給我們，我們會協助整理第一版方向。",
    ctaPrimary: "預約免費諮詢",
    ctaSecondary: "聯絡我們",
    steps: ["需求與市場確認", "創作者篩選", "合作洽談與寄樣", "內容審核與發布", "成效追蹤與下一步"],
    stepBody: "每一步都以品牌端可判斷、可追蹤、可交接為原則，降低跨境溝通成本。",
    faqTwo: ["如何挑選適合品牌的網紅？", "需要同時評估受眾市場、內容風格、互動品質、品牌契合度、平台特性與合作可行性。"],
    faqThree: ["合作流程包含哪些步驟？", "流程包含需求確認、創作者篩選、合作洽談、寄樣管理、內容審核、發布追蹤與結案整理。"],
    faqFour: ["費用如何估算？", "費用會依創作者報價、合作人數、內容格式、授權範圍與執行深度而不同，正式報價會拆列項目。"]
  },
  "zh-Hans": {
    home: "首页",
    services: "服务",
    eyebrow: "Overseas Influencer Marketing",
    overviewTitle: "服务介绍",
    processTitle: "合作流程",
    faqTitle: "常见问题",
    ctaTitle: "想确认你的品牌适合哪个市场？",
    ctaBody: "把品牌目标、预算区间、目标市场与希望合作的平台寄给我们，我们会协助整理第一版方向。",
    ctaPrimary: "预约免费咨询",
    ctaSecondary: "联系我们",
    steps: ["需求与市场确认", "创作者筛选", "合作洽谈与寄样", "内容审核与发布", "成效追踪与下一步"],
    stepBody: "每一步都以品牌端可判断、可追踪、可交接为原则，降低跨境沟通成本。",
    faqTwo: ["如何挑选适合品牌的网红？", "需要同时评估受众市场、内容风格、互动品质、品牌契合度、平台特性与合作可行性。"],
    faqThree: ["合作流程包含哪些步骤？", "流程包含需求确认、创作者筛选、合作洽谈、寄样管理、内容审核、发布追踪与结案整理。"],
    faqFour: ["费用如何估算？", "费用会依创作者报价、合作人数、内容格式、授权范围与执行深度而不同，正式报价会拆列项目。"]
  },
  en: {
    home: "Home",
    services: "Services",
    eyebrow: "Overseas Influencer Marketing",
    overviewTitle: "Service Overview",
    processTitle: "Collaboration Workflow",
    faqTitle: "Frequently Asked Questions",
    ctaTitle: "Want to know which market fits your brand?",
    ctaBody: "Send us your brand goal, budget range, target market, and preferred platforms. We will help organize the first direction.",
    ctaPrimary: "Book a Free Consultation",
    ctaSecondary: "Contact Us",
    steps: ["Brief and market alignment", "Creator screening", "Negotiation and product seeding", "Content review and publishing", "Tracking and next steps"],
    stepBody: "Each step is designed to be easy for brand teams to judge, track, and hand off, reducing cross-border coordination cost.",
    faqTwo: ["How do brands choose suitable influencers?", "Review audience market, content style, engagement quality, brand fit, platform context, and execution feasibility together."],
    faqThree: ["What steps are included in the workflow?", "The workflow includes brief alignment, creator screening, negotiation, product seeding, content review, publishing follow-up, and final reporting."],
    faqFour: ["How are fees estimated?", "Fees vary by creator quote, creator count, content format, usage rights, and execution depth. Formal proposals list the line items clearly."]
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
  if (!isRoot) html = html.replace(/(src|href)="web-assets\//g, '$1="../web-assets/');
  return html;
};

const serviceUrl = (page, locale) => locale.isRoot
  ? `${baseUrl}services/${page.slug}/`
  : `${locale.url}services/${page.slug}/`;

const serviceRelativePrefix = () => "../../";

const serviceAlternates = (page) => [
  `<link rel="alternate" hreflang="zh-Hant" href="${serviceUrl(page, locales[0])}">`,
  `<link rel="alternate" hreflang="zh-Hans" href="${serviceUrl(page, locales[1])}">`,
  `<link rel="alternate" hreflang="en" href="${serviceUrl(page, locales[2])}">`,
  `<link rel="alternate" hreflang="x-default" href="${serviceUrl(page, rootLocale)}">`
].join("\n  ");

const serviceFaq = (page, locale) => {
  const ui = serviceUi[locale.key];
  return [page.faqOne[locale.key], ui.faqTwo, ui.faqThree, ui.faqFour];
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
    @media (max-width: 760px) { .nav { align-items:flex-start; flex-direction:column; padding:14px 0; } .nav-links { flex-wrap:wrap; } .grid { grid-template-columns:1fr; } section { padding:54px 0; } }
`;

const renderServicePage = (page, locale) => {
  const ui = serviceUi[locale.key];
  const url = serviceUrl(page, locale);
  const prefix = serviceRelativePrefix(locale);
  const faqs = serviceFaq(page, locale);
  const steps = ui.steps.map((step) => `<article class="card"><h3>${escapeHtml(step)}</h3><p>${escapeHtml(ui.stepBody)}</p></article>`).join("\n          ");
  const faqCards = faqs.map(([question, answer]) => `<article class="card"><h3>${escapeHtml(question)}</h3><p>${escapeHtml(answer)}</p></article>`).join("\n          ");
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
  <meta property="og:image" content="${baseUrl}web-assets/game-liming-cheer.webp">
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
      <a class="brand" href="${prefix}"><span>${escapeHtml(locale.label)}</span><small>Overseas Influencer Agency</small></a>
      <nav class="nav-links" aria-label="${escapeAttr(ui.services)}">
        <a href="${prefix}#services">${escapeHtml(ui.services)}</a>
        <a href="${prefix}#answers">FAQ</a>
        <a class="nav-cta" href="#contact">${escapeHtml(ui.ctaPrimary)}</a>
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
          <a class="button primary" href="#contact">${escapeHtml(ui.ctaPrimary)}</a>
          <a class="button" href="mailto:weiting@zhenguocool.com">${escapeHtml(ui.ctaSecondary)}</a>
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
    <section id="contact" class="cta">
      <div class="wrap">
        <h2>${escapeHtml(ui.ctaTitle)}</h2>
        <p>${escapeHtml(ui.ctaBody)}</p>
        <div class="actions">
          <a class="button primary" href="mailto:weiting@zhenguocool.com">${escapeHtml(ui.ctaPrimary)}</a>
          <a class="button" href="${prefix}#contact">${escapeHtml(ui.ctaSecondary)}</a>
        </div>
      </div>
    </section>
  </main>
  <footer><div class="wrap">© 2026 ${escapeHtml(locale.label)} / ZHENGUOCool. All Rights Reserved.</div></footer>
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

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${sitemapItems.map((item) => `  <url>\n    <loc>${item.loc}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>${item.priority}</priority>\n${item.alternates.map(([hreflang, href]) => `    <xhtml:link rel="alternate" hreflang="${hreflang}" href="${href}" />`).join("\n")}\n  </url>`).join("\n")}\n</urlset>\n`;
fs.writeFileSync(path.join(root, "sitemap.xml"), sitemap);

const robots = `User-agent: *\nAllow: /\n\nSitemap: ${baseUrl}sitemap.xml\n`;
fs.writeFileSync(path.join(root, "robots.txt"), robots);

console.log(`Built ${locales.length} locale pages, ${servicePages.length * allLocales.length} service pages, sitemap.xml, and robots.txt`);
