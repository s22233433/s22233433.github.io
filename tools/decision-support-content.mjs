export const decisionSupport = {
  "zh-Hant": {
    service: {
      scopeTitle: "合作分工先說清楚",
      scopeIntro: "台灣創作者合作要先對齊品牌提供的資料、榛菓承接的工作，以及最後可驗收的交付。以下是討論範圍的起點，正式範圍仍以報價與合作確認為準。",
      columns: [
        {
          title: "品牌提供",
          items: [
            "產品事實、主要賣點、禁用說法與台灣可使用的產品或活動資訊。",
            "目標受眾、平台方向、上線時程、預算口徑與品牌端審核窗口。",
            "寄樣、購買／參與承接、客服，以及希望取得或使用的素材與權利條件。"
          ]
        },
        {
          title: "榛菓承接",
          items: [
            "依需求整理 brief、候選方向、推薦理由與待確認風險。",
            "按約協調邀約、合作條件、寄樣、審稿、修改與上刊節點。",
            "整理上刊連結、素材版本、權利狀態及未完成事項，並協助結案對照。"
          ]
        },
        {
          title: "品牌收到的交付",
          items: [
            "候選清單與每個人選的推薦理由、合作條件和狀態。",
            "已約定的內容或素材、上刊連結與執行紀錄。",
            "授權與使用範圍清單、待補資料及後續建議。"
          ]
        }
      ],
      sampleTitle: "流程欄位示意：從候選到結案",
      sampleDisclosure: "以下是完全虛構的工作流程示意，用來說明候選清單、審核狀態、連結與權利檢查如何並列；不代表實際案件，不含任何人名、聯絡方式或成效數據。",
      sampleColumns: ["流程階段", "審核狀態", "連結／權利檢查"],
      sampleRows: [
        ["候選清單（示意）", "待品牌確認", "候選資料連結：待補；合作與授權：待確認"],
        ["內容審核（示意）", "已整理回饋", "初稿連結：示意；原始發布、轉載與投放權利：分開確認"],
        ["上刊與結案（示意）", "待核對交付", "上刊連結：示意；素材版本、使用期間與地區：待確認"]
      ],
      sampleNote: "這個虛構表格只示範決策欄位的關係；實際專案會依正式確認的內容與權利範圍建立紀錄。"
    },
    pricing: {
      comparisonTitle: "看懂報價，先對齊同一口徑",
      comparisonIntro: "品牌比較台灣網紅報價時，先把每一列的工作與權利寫清楚；不同平台、格式或使用範圍不能只看一個總數。以下用於詢價討論，不是固定價目表。",
      columns: ["報價項目", "詢價時要說明", "常見警訊"],
      rows: [
        ["創作者合作費", "帳號、平台、發布形式與數量，以及是否含內容製作與溝通協調。", "只寫一個總額，卻沒有說明發布、製作與其他工作的界線。"],
        ["內容製作", "腳本、拍攝、場景、剪輯版本、修改次數與交付檔案的範圍。", "把素材製作寫成一句話，未說明修改或原始檔。"],
        ["使用權", "品牌社群、官網、轉載、剪輯與投放使用的媒體、期間、地區與素材版本。", "把原始上刊直接當成所有後續使用權。"],
        ["付費投放或帳號授權", "是否需要白名單、廣告帳號操作、投放媒體與授權期間。", "未寫範圍就宣稱可以直接拿去投廣告。"],
        ["寄樣、交通與出席", "產品寄送、退回、交通、活動出席與相關安排由誰負責。", "物流或出席被放在備註，結算時才出現額外工作。"],
        ["專案執行", "候選、邀約、條件確認、審稿、上刊追蹤與結案哪些由誰承接。", "只承諾提供名單，卻讓品牌自行承擔後續協調。"],
        ["付款與稅務口徑", "幣別、付款節點、發票或稅務文件由雙方確認的範圍。", "用未說明的含稅／未稅說法比較不同報價。"],
        ["驗收與資料", "上刊連結、素材、權利狀態、資料來源與觀察期間如何交付。", "只給單一成效數字，沒有來源、期間或計算口徑。"]
      ],
      scenarioTitle: "不同任務，報價拆法也不同",
      scenarioIntro: "同一個創作者或平台可以承接不同工作。先定義任務，再請報價反映交付內容與成本因素。",
      scenarios: [
        {
          title: "新品測試",
          goal: "了解台灣受眾是否理解產品，以及哪些內容角度適合繼續測試。",
          deliverables: "候選理由、合作條件紀錄、約定內容與回饋整理。",
          costDrivers: "創作者適配度、產品體驗與寄樣、內容形式、審稿及追蹤範圍。"
        },
        {
          title: "詳細評測",
          goal: "透過較完整的內容，讓受眾理解產品功能與使用情境。",
          deliverables: "測試重點 brief、初稿與修改節點、上刊連結及權利紀錄。",
          costDrivers: "體驗時間、製作難度、平台形式、使用權及修改範圍。"
        },
        {
          title: "純素材製作",
          goal: "取得可供品牌自有渠道使用的內容素材，不預設包含創作者發布。",
          deliverables: "素材規格、約定的原始或編輯檔、交付清單及使用範圍。",
          costDrivers: "腳本與拍攝難度、場景或道具、剪輯版本，以及按期間與地區確認的素材權利。"
        }
      ],
      requestTitle: "寄出詢價前，先整理這些欄位",
      requestIntro: "可複製以下文字提供給合作團隊；這只是詢價摘要，不是網站表單，也不會在此儲存個人資料。",
      requestTemplate: `品牌／產品：
台灣購買或活動連結：
目標受眾與主要任務：
希望的平台與內容形式：
希望委託的工作：
預計上線時間：
預算口徑（可不填，請註明幣別與包含項目）：
素材用途與使用權：
寄樣、審稿與修改需求：
希望觀察的結果：
目前尚未確定的事項：`,
      historyTitle: "如何閱讀 2025 年歷史公開參考",
      historyNote: "2025 年的公開參考只是在當時條件下的單篇內容觀察，不是 2026 年的對外報價，也不是完整活動總價。服務費起價不等於整場活動總價；創作者酬勞、內容製作、授權、投放、寄樣、修改、專案管理與付款／稅務口徑仍須按當次需求確認。"
    }
  },
  "zh-Hans": {
    service: {
      scopeTitle: "先把合作分工说清楚",
      scopeIntro: "台湾创作者合作要先对齐品牌提供的资料、榛果承接的工作，以及最后可验收的交付。以下是讨论范围的起点，正式范围仍以报价与合作确认为准。",
      columns: [
        {
          title: "品牌提供",
          items: [
            "产品事实、主要卖点、禁用说法，以及台湾可使用的产品或活动信息。",
            "目标受众、平台方向、上线排期、预算口径和品牌审核窗口。",
            "寄样、购买／参与承接、客服，以及希望取得或使用的素材和权利条件。"
          ]
        },
        {
          title: "榛果承接",
          items: [
            "按需求整理 brief、候选方向、推荐理由和待确认风险。",
            "按约协调邀约、合作条件、寄样、审核、修改和上线节点。",
            "整理上线链接、素材版本、权利状态和未完成事项，并协助结案核对。"
          ]
        },
        {
          title: "品牌收到的交付",
          items: [
            "候选清单，以及每位候选的推荐理由、合作条件和状态。",
            "已约定的内容或素材、上线链接和执行记录。",
            "授权与使用范围清单、待补资料和后续建议。"
          ]
        }
      ],
      sampleTitle: "流程字段示意：从候选到结案",
      sampleDisclosure: "以下是完全虚构的工作流程示意，用来说明候选清单、审核状态、链接与权利检查如何并列；不代表实际项目，不含任何人名、联系方式或效果数据。",
      sampleColumns: ["流程阶段", "审核状态", "链接／权利检查"],
      sampleRows: [
        ["候选清单（示意）", "待品牌确认", "候选资料链接：待补；合作与授权：待确认"],
        ["内容审核（示意）", "已整理反馈", "初稿链接：示意；原始发布、转载与投放权利：分别确认"],
        ["上线与结案（示意）", "待核对交付", "上线链接：示意；素材版本、使用期限与地区：待确认"]
      ],
      sampleNote: "这个虚构表格只示范决策字段的关系；实际项目会按正式确认的内容与权利范围建立记录。"
    },
    pricing: {
      comparisonTitle: "看懂报价，先对齐同一口径",
      comparisonIntro: "品牌比较台湾网红报价时，先把每一行的工作与权利写清楚；不同平台、形式或使用范围不能只看一个总数。以下用于询价讨论，不是固定价目表。",
      columns: ["报价项目", "询价时要说明", "常见警讯"],
      rows: [
        ["创作者合作费", "账号、平台、发布形式与数量，以及是否包含内容制作与沟通协调。", "只写一个总额，却没有说明发布、制作与其他工作的边界。"],
        ["内容制作", "脚本、拍摄、场景、剪辑版本、修改次数和交付文件的范围。", "把素材制作写成一句话，没有说明修改或源文件。"],
        ["使用权", "品牌社媒、官网、转载、剪辑与投放使用的媒体、期限、地区和素材版本。", "把原始上线直接当成所有后续使用权。"],
        ["付费投放或账号授权", "是否需要白名单、广告账号操作、投放媒体和授权期限。", "没有写清范围，就声称可以直接拿去投广告。"],
        ["寄样、交通与出席", "产品寄送、退回、交通、活动出席和相关安排由谁负责。", "物流或出席被放在备注，结算时才出现额外工作。"],
        ["项目执行", "候选、邀约、条件确认、审核、上线追踪与结案由谁承接。", "只承诺提供名单，却让品牌自行承担后续协调。"],
        ["付款与税务口径", "币种、付款节点、发票或税务文件由双方确认的范围。", "用未说明的含税／未税口径比较不同报价。"],
        ["验收与资料", "上线链接、素材、权利状态、资料来源和观察周期如何交付。", "只给单一效果数字，没有来源、周期或计算口径。"]
      ],
      scenarioTitle: "不同任务，报价拆法也不同",
      scenarioIntro: "同一位创作者或平台可以承接不同工作。先定义任务，再请报价反映交付内容与成本因素。",
      scenarios: [
        {
          title: "新品测试",
          goal: "了解台湾受众是否理解产品，以及哪些内容角度适合继续测试。",
          deliverables: "候选理由、合作条件记录、约定内容和反馈整理。",
          costDrivers: "创作者适配度、产品体验与寄样、内容形式、审核及追踪范围。"
        },
        {
          title: "详细评测",
          goal: "通过较完整的内容，让受众理解产品功能和使用场景。",
          deliverables: "测试重点 brief、初稿与修改节点、上线链接和权利记录。",
          costDrivers: "体验时间、制作难度、平台形式、使用权和修改范围。"
        },
        {
          title: "纯素材制作",
          goal: "取得可供品牌自有渠道使用的内容素材，不预设包含创作者发布。",
          deliverables: "素材规格、约定的原始或编辑文件、交付清单和使用范围。",
          costDrivers: "脚本与拍摄难度、场景或道具、剪辑版本，以及按期限和地区确认的素材权利。"
        }
      ],
      requestTitle: "发出询价前，先整理这些字段",
      requestIntro: "可以复制以下文字提供给合作团队；这只是询价摘要，不是网站表单，也不会在此储存个人资料。",
      requestTemplate: `品牌／产品：
台湾购买或活动链接：
目标受众与主要任务：
希望的平台与内容形式：
希望委托的工作：
预计上线时间：
预算口径（可不填，请注明币种和包含项目）：
素材用途与使用权：
寄样、审核与修改需求：
希望观察的结果：
目前尚未确定的事项：`,
      historyTitle: "如何阅读 2025 年历史公开参考",
      historyNote: "2025 年的公开参考只是在当时条件下的单篇内容观察，不是 2026 年的对外报价，也不是完整活动总价。服务费起价不等于整场活动总价；创作者酬劳、内容制作、授权、投放、寄样、修改、项目管理及付款／税务口径仍须按本次需求确认。"
    }
  },
  en: {
    service: {
      scopeTitle: "Make the working split explicit",
      scopeIntro: "A Taiwan creator engagement starts by aligning what the brand supplies, what Zhenguo manages, and what can be checked at delivery. This is a discussion framework; the formal scope follows the quote and agreed terms.",
      columns: [
        {
          title: "Brand provides",
          items: [
            "Accurate product facts, key benefits, restricted claims, and a product or campaign page usable in Taiwan.",
            "Target audience, channel direction, launch timing, budget context, and one brand-side review owner.",
            "Seeding, purchase or participation handoff, customer-support readiness, and the asset or rights needs to discuss."
          ]
        },
        {
          title: "Zhenguo manages",
          items: [
            "Turns the brief into a shortlist direction with rationale and open risks.",
            "Coordinates agreed outreach, terms, seeding, review, revisions, and publishing checkpoints.",
            "Keeps delivery records for live links, asset versions, rights status, and open items."
          ]
        },
        {
          title: "Brand receives",
          items: [
            "A shortlist with rationale, agreed terms, and status for each candidate.",
            "Agreed content or assets, live links, and execution records.",
            "A rights-and-usage checklist, missing inputs, and close-out notes."
          ]
        }
      ],
      sampleTitle: "Workflow fields in context: shortlist to close-out",
      sampleDisclosure: "The table below is a fictional workflow illustration only. It shows how a shortlist, review status, links, and rights checks may sit together; it is not a real campaign and contains no names, contact details, or performance metrics.",
      sampleColumns: ["Workflow stage", "Review status", "Links / rights check"],
      sampleRows: [
        ["Shortlist (illustration)", "Awaiting brand confirmation", "Candidate link: to be added; terms and rights: to confirm"],
        ["Content review (illustration)", "Feedback organized", "Draft link: illustration; original publishing, reposting, and paid-use rights: confirm separately"],
        ["Publishing and close-out (illustration)", "Delivery check pending", "Live link: illustration; asset version, usage term, and territory: to confirm"]
      ],
      sampleNote: "This fictional table demonstrates field relationships only; a live project uses the content and rights scope agreed for that project."
    },
    pricing: {
      comparisonTitle: "Read a quote by matching the same scope",
      comparisonIntro: "When comparing Taiwan creator quotes, write down the work and rights in each line; different channels, formats, and usage scopes cannot be compared by one total alone. This is a quote-review aid, not a rate card.",
      columns: ["Quote line", "Specify in the request", "Red flag"],
      rows: [
        ["Creator compensation", "Account, platform, publishing format and quantity, and whether production and coordination are included.", "One total with no boundary between publishing, production, and other work."],
        ["Content production", "Script, shoot, setting, edit versions, number of revision rounds, and delivery files.", "Production is summarized in one line with no revision or source-file terms."],
        ["Usage rights", "Brand social, website, reposting, editing, and paid use by medium, term, territory, and asset version.", "The original post is treated as if it transfers every later-use right."],
        ["Paid media or account authorization", "Whether whitelisting, ad-account access, media placement, and an authorization term are needed.", "Paid use is implied without a defined scope."],
        ["Seeding, travel, and attendance", "Who owns product shipping, returns, travel, event attendance, and related coordination.", "Logistics or attendance appears only as an afterthought at settlement."],
        ["Project management", "Who handles shortlist, outreach, terms, review, publishing follow-up, and close-out.", "List delivery is promised while follow-up is left to the brand."],
        ["Payment and tax basis", "Currency, payment milestones, invoices, or tax documents to be confirmed by both sides.", "Quotes are compared across unexplained tax-inclusive or tax-exclusive bases."],
        ["Acceptance and reporting", "Live links, assets, rights status, data source, and observation window.", "A single outcome number is given with no source, window, or calculation basis."]
      ],
      scenarioTitle: "Different jobs require different quote lines",
      scenarioIntro: "The same creator or channel can carry different work. Define the job first, then ask the quote to reflect deliverables and cost drivers.",
      scenarios: [
        {
          title: "New-product test",
          goal: "Learn whether Taiwan audiences understand the product and which content angles are workable.",
          deliverables: "Shortlist rationale, agreed collaboration record, content handoff, and feedback summary.",
          costDrivers: "Creator fit, product experience and seeding, content format, review, and follow-up scope."
        },
        {
          title: "Detailed review",
          goal: "Help audiences understand product functions and use context through a more complete review.",
          deliverables: "Test-focused brief, draft and revision checkpoints, live link, and rights record.",
          costDrivers: "Experience time, production difficulty, channel format, usage rights, and revision scope."
        },
        {
          title: "Asset-only production",
          goal: "Obtain content assets for the brand's own channels without assuming creator publishing.",
          deliverables: "Agreed asset specifications, source or edit files where agreed, delivery checklist, and usage scope.",
          costDrivers: "Script and shoot complexity, setting or props, edit versions, and asset rights by term and territory."
        }
      ],
      requestTitle: "Before requesting a quote, organize these fields",
      requestIntro: "Copy the text below into a discussion with a partner. It is a quote brief, not a live form, and it does not collect personal information here.",
      requestTemplate: `Brand / product:
Taiwan purchase or campaign link:
Target audience and primary job:
Preferred channels and formats:
Work to commission:
Expected launch timing:
Budget basis (optional; state currency and inclusions):
Asset use and rights:
Seeding, review, and revision needs:
Outcome to observe:
Open questions:`,
      historyTitle: "How to read the 2025 historical public reference",
      historyNote: "A public reference from 2025 describes a single-post context under its then-known conditions. It is not a 2026 quote or a complete campaign total. A starting service fee is not the total campaign cost; creator compensation, production, rights, paid use, seeding, revisions, project management, and payment or tax basis still need to be confirmed for the current brief."
    }
  }
};
