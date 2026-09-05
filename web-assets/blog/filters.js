(() => {
  const root=document.querySelector('[data-blog-index]');
  if(!root)return;
  const buttons=[...root.querySelectorAll('[data-category]')];
  const allowed=new Set(buttons.map(b=>b.dataset.category));
  const cards=[...root.querySelectorAll('[data-article-category]')];
  const latest=root.querySelector('.latest'),guides=root.querySelector('.guide-index');
  const status=root.querySelector('[data-filter-status]');
  function selected(){
    const url=new URL(location.href),value=url.searchParams.get('category')||url.hash.slice(1)||'all';
    return allowed.has(value)?value:'all';
  }
  function apply(category, push=false){
    if(!allowed.has(category))category='all';
    for(const card of cards)card.hidden=category==='guides'||(category!=='all'&&card.dataset.articleCategory!==category);
    const count=cards.filter(c=>!c.hidden).length;
    latest.hidden=category==='guides';
    guides.hidden=category!=='all'&&category!=='guides';
    for(const b of buttons)b.setAttribute('aria-pressed',String(b.dataset.category===category));
    root.querySelector('[data-visible-count]').textContent=String(count).padStart(2,'0');
    status.textContent=[...(latest.hidden?[]:[`${count} ${root.dataset.articlesUnit}`]),...(guides.hidden?[]:[`${guides.querySelectorAll('li').length} ${root.dataset.guidesUnit}`])].join(' · ');
    if(push){const url=new URL(location.href);if(category==='all')url.searchParams.delete('category');else url.searchParams.set('category',category);url.hash='';history.pushState(null,'',url);}
    for(const link of document.querySelectorAll('[data-blog-language]')){
      const url=new URL(link.href);if(category==='all')url.searchParams.delete('category');else url.searchParams.set('category',category);link.href=url.href;
    }
  }
  for(const b of buttons)b.addEventListener('click',()=>apply(b.dataset.category,true));
  window.addEventListener('popstate',()=>apply(selected()));
  window.addEventListener('hashchange',()=>apply(selected()));
  apply(selected());
})();
