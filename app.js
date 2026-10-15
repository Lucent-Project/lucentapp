(()=>{
const d=document,h=d.documentElement,$=(s,r=d)=>r.querySelector(s),$$=(s,r=d)=>[...r.querySelectorAll(s)];
const nav=$('nav'),lg=$('.lang'),burger=$('.burger');
const COLORS={dark:'#080b16',light:'#eef2fb'};

/* theme: follows the system until the visitor chooses; the choice is remembered */
const paint=t=>{h.dataset.theme=t;const m=$('meta[name=theme-color]');if(m)m.content=COLORS[t]};
$('.theme')?.addEventListener('click',()=>{
  const t=h.dataset.theme==='light'?'dark':'light';paint(t);
  try{localStorage.setItem('lucent-theme',t)}catch(e){}
});
matchMedia('(prefers-color-scheme: light)').addEventListener?.('change',e=>{
  try{if(localStorage.getItem('lucent-theme'))return}catch(x){}
  paint(e.matches?'light':'dark');
});

/* mobile menu + language dropdown */
const setMenu=o=>{nav.classList.toggle('open',o);burger?.setAttribute('aria-expanded',o)};
burger?.addEventListener('click',()=>{setMenu(!nav.classList.contains('open'));if(lg)lg.open=false});
lg?.addEventListener('toggle',()=>{if(lg.open)setMenu(false)});
d.addEventListener('click',e=>{
  if(lg?.open&&!lg.contains(e.target))lg.open=false;
  if(!nav.contains(e.target))setMenu(false);
});
d.addEventListener('keydown',e=>{
  if(e.key!=='Escape')return;
  if(lg?.open){lg.open=false;$('summary',lg).focus()}
  setMenu(false);
});
matchMedia('(min-width:861px)').addEventListener('change',()=>setMenu(false));

/* nav gets a denser glass once the page scrolls */
const onScroll=()=>nav.classList.toggle('scrolled',scrollY>8);
addEventListener('scroll',onScroll,{passive:true});onScroll();

/* reveal on scroll */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('on');io.unobserve(e.target)}}),{threshold:.08});
$$('.rv').forEach(el=>io.observe(el));

/* desktop only: pointer-tracked glass highlight + gentle background parallax */
if(matchMedia('(hover:hover) and (pointer:fine) and (min-width:861px)').matches&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
  d.addEventListener('pointermove',e=>{
    const g=e.target.closest?.('.glass');if(!g)return;
    const r=g.getBoundingClientRect();
    g.style.setProperty('--mx',e.clientX-r.left+'px');g.style.setProperty('--my',e.clientY-r.top+'px');
  },{passive:true});
  const orbs=$$('.orb');let tick=0;
  addEventListener('scroll',()=>{tick||(tick=requestAnimationFrame(()=>{tick=0;orbs.forEach((o,i)=>o.style.translate=`0 ${scrollY*(.04+i*.02)}px`)}))},{passive:true});
}

const dlBtns=$$('[data-dl]');
if(dlBtns.length){
  const KEY='lucent-latest-release';
  const readCache=(st,max)=>{
    try{
      const raw=st.getItem(KEY);
      if(!raw)return null;
      const it=JSON.parse(raw);
      if(it&&it.ts&&(Date.now()-it.ts<max)&&it.urls)return it;
    }catch(e){}
    return null;
  };
  const writeCache=it=>{
    try{sessionStorage.setItem(KEY,JSON.stringify(it))}catch(e){}
    try{localStorage.setItem(KEY,JSON.stringify(it))}catch(e){}
  };
  const selectAssets=assets=>{
    if(!Array.isArray(assets))return {};
    const valid=assets.filter(a=>!/\.(sha256|sig|asc|txt)$/i.test(a?.name||''));
    const apks=valid.filter(a=>/\.apk$/i.test(a?.name||'')||a?.content_type==='application/vnd.android.package-archive');
    const exes=valid.filter(a=>/\.exe$/i.test(a?.name||''));
    const android=apks.find(a=>/universal|release/i.test(a?.name||''))||apks[0];
    const windows=exes.find(a=>/setup|installer/i.test(a?.name||''))||exes[0];
    return {
      android:android?.browser_download_url,
      windows:windows?.browser_download_url
    };
  };
  const applyRelease=(tag,urls)=>{
    dlBtns.forEach(btn=>{
      const u=urls[btn.dataset.dl];
      if(u){
        btn.href=u;
        btn.removeAttribute('target');
        btn.dataset.assetUrl=u;
      }
    });
    if(tag){
      $$('[data-ver]').forEach(el=>{el.textContent=tag});
    }
  };
  let fetchDone=false;
  const resolvePromise=(async()=>{
    const cached=readCache(sessionStorage,15*60*1000);
    if(cached){
      applyRelease(cached.tag,cached.urls);
      fetchDone=true;
      return;
    }
    const ac=new AbortController();
    const tm=setTimeout(()=>ac.abort(),4000);
    try{
      const res=await fetch('https://api.github.com/repos/Yuan0-o/Lucent/releases/latest',{
        headers:{Accept:'application/vnd.github+json'},
        signal:ac.signal
      });
      clearTimeout(tm);
      if(!res.ok)throw new Error(res.status);
      const data=await res.json();
      if(data.prerelease||data.draft||!data.tag_name||/^p/i.test(data.tag_name))throw new Error('invalid');
      const urls=selectAssets(data.assets);
      const entry={tag:data.tag_name,urls,ts:Date.now()};
      writeCache(entry);
      applyRelease(entry.tag,entry.urls);
    }catch(err){
      clearTimeout(tm);
      const stale=readCache(localStorage,24*60*60*1000);
      if(stale){
        applyRelease(stale.tag,stale.urls);
      }
    }finally{
      fetchDone=true;
    }
  })();
  dlBtns.forEach(btn=>{
    btn.addEventListener('click',async e=>{
      if(btn.dataset.assetUrl||fetchDone)return;
      e.preventDefault();
      btn.setAttribute('aria-busy','true');
      try{
        await resolvePromise;
      }catch(err){}
      finally{
        btn.removeAttribute('aria-busy');
      }
      window.location.assign(btn.dataset.assetUrl||btn.href);
    });
  });
}
})();
