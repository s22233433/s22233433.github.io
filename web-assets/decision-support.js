(() => {
 const button=document.querySelector('[data-copy-inquiry]');
 if(!button)return;
 button.addEventListener('click',async()=>{
  const field=document.querySelector('#quote-checklist'),status=document.querySelector('[data-copy-status]');
  try{await navigator.clipboard.writeText(field.value);status.textContent=button.dataset.copySuccess;}
  catch{field.focus();field.select();status.textContent=button.dataset.copyFallback;}
 });
})();
