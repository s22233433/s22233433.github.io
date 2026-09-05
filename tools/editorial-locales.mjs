import { enCore } from './editorial-en-core.mjs';
import { enNews } from './editorial-en-news.mjs';
import { zhCN } from './editorial-zh-cn.mjs';

export const blogLocales = [
  { key:'zh-TW', prefix:'', dataKey:'zh-Hant', og:'zh_TW', label:'繁中',
    ui:{site:'榛菓筆記',brand:'榛菓',brandSuffix:'筆記',company:'榛菓行銷',home:'榛菓官網',all:'全部文章',skip:'跳至內容',nav:'網站導覽',languages:'語言切換',author:'榛菓編輯部',contents:'這篇筆記',related:'換個角度，繼續看',back:'回到全部文章',intro:['把日常滑過的，','再看仔細一點。'],subtitle:['關於社群、創作者與內容工作的觀察。','有時拆解一則留言，有時只是換個角度看一杯茶。'],latest:'最新文章',guides:'決策指南',guideIntro:'需要更完整的市場與合作整理？既有指南都在這裡。',footer:'把社群與內容工作，看得更仔細一點。',rights:'原創觀察與圖文筆記',indexTitle:'榛菓筆記：社群觀察、內容拆解與工具分享',indexDescription:'分享社群、創作者與內容工作的原創觀察、圖文拆解與工具筆記，也整理榛菓既有市場決策指南。',categories:{all:'全部',observation:'社群觀察',storytelling:'內容拆解',tools:'工具筆記',guides:'決策指南'},articlesUnit:'篇文章',guidesUnit:'篇指南',noJs:'未啟用 JavaScript 時仍可閱讀全部文章；分類篩選需要 JavaScript。',read:'閱讀',order:'最新優先'} },
  { key:'zh-CN', prefix:'zh-cn/', dataKey:'zh-Hans', og:'zh_CN', label:'简中',
    ui:{site:'榛果笔记',brand:'榛果',brandSuffix:'笔记',company:'榛果营销',home:'榛果官网',all:'全部文章',skip:'跳至内容',nav:'网站导航',languages:'语言切换',author:'榛果编辑部',contents:'这篇笔记',related:'换个角度，继续看',back:'返回全部文章',intro:['把日常划过的，','再看仔细一点。'],subtitle:['关于社群、创作者与内容工作的观察。','有时拆解一条评论，有时只是换个角度看一杯茶。'],latest:'最新文章',guides:'决策指南',guideIntro:'需要更完整的市场与合作梳理？现有指南都在这里。',footer:'把社群与内容工作，看得更仔细一点。',rights:'原创观察与图文笔记',indexTitle:'榛果笔记：社群观察、内容拆解与工具分享',indexDescription:'分享社群、创作者与内容工作的原创观察、图文拆解与工具笔记，也整理榛果现有市场决策指南。',categories:{all:'全部',observation:'社群观察',storytelling:'内容拆解',tools:'工具笔记',guides:'决策指南'},articlesUnit:'篇文章',guidesUnit:'篇指南',noJs:'未启用 JavaScript 时仍可阅读全部文章；分类筛选需要 JavaScript。',read:'阅读',order:'最新优先'} },
  { key:'en', prefix:'en/', dataKey:'en', og:'en_US', label:'EN',
    ui:{site:'ZhenguoCool Journal',brand:'ZhenguoCool',brandSuffix:' Journal',company:'ZhenguoCool',home:'Company website',all:'All articles',skip:'Skip to content',nav:'Site navigation',languages:'Language',author:'ZhenguoCool Editorial',contents:'In this story',related:'Another angle worth exploring',back:'Back to all articles',intro:['Look a little closer.','There is more to the story.'],subtitle:['Observations on social media, creators and the work of making content.','From a comment thread to an everyday cup of tea.'],latest:'Latest stories',guides:'Decision guides',guideIntro:'Looking for a deeper look at markets and collaboration? Start with these guides.',footer:'A closer look at creators and the work behind content.',rights:'Original observations and illustrated field notes',indexTitle:'ZhenguoCool Journal: creator insights, content studies and practical notes',indexDescription:'Original observations, illustrated content studies and practical notes on social media and creators, alongside market and collaboration guides.',categories:{all:'All',observation:'Social observations',storytelling:'Content studies',tools:'Practical notes',guides:'Decision guides'},articlesUnit:'articles',guidesUnit:'guides',noJs:'All articles remain available without JavaScript. Enable it to filter by category.',read:'Read',order:'Newest first'} }
];
const english={...enCore,...enNews};
export function translatePost(post, locale, baseCover) {
  if(locale.key==='zh-TW')return {...post,cover:baseCover};
  const copy=(locale.key==='en'?english:zhCN)[post.slug];
  if(!copy)throw new Error(`Missing ${locale.key} translation: ${post.slug}`);
  for(const field of ['title','description','category','coverAlt','caption','body'])if(typeof copy[field]!=='string'||!copy[field].trim())throw new Error(`Incomplete ${locale.key} ${post.slug}: ${field}`);
  if(!Array.isArray(copy.toc)||copy.toc.length!==post.toc.length||!Array.isArray(copy.cover?.headline)||!Array.isArray(copy.cover?.sub))throw new Error(`Incomplete ${locale.key} structure: ${post.slug}`);
  return {...post,...copy,cover:{...baseCover,...copy.cover}};
}
