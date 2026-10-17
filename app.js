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
const io='IntersectionObserver' in window?new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('on');io.unobserve(e.target)}}),{threshold:.08}):null;
$$('.rv').forEach(el=>io?io.observe(el):el.classList.add('on'));
h.classList.add('rv-ready'); /* tells the stylesheet this script is alive (see the .rv fail-safe) */

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

const dlBtns=$$('[data-dl]'),verEls=$$('[data-ver]');
const isDlPage=dlBtns.length>0||verEls.length>0||$('a[href*="download.html"]');
if(isDlPage){
  const KEY='lucent-latest-release';
  verEls.forEach(el=>el.classList.add('loading'));
  const isSub=$('script[src*="app.js"]')?.getAttribute('src')?.startsWith('../')||/\/(zh|ja|ko)(\/|$)/.test(location.pathname);
  const base=isSub?'../':'./';
  const vUrl=isSub?'../downloads/version.json':'./downloads/version.json';
  const fmtDate=iso=>{try{return new Intl.DateTimeFormat(h.lang||undefined,{year:'numeric',month:'short',day:'numeric'}).format(new Date(iso))}catch(e){return ''}};
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
  const selectFromVersionJson=data=>{
    if(!data)return null;
    const list=Array.isArray(data.assets)?data.assets:(Array.isArray(data.files)?data.files:[]);
    if(!list.length)return null;
    const valid=list.filter(a=>!/\.(sha256|sig|asc|txt)$/i.test(a?.name||''));
    const apks=valid.filter(a=>/\.apk$/i.test(a?.name||'')||a?.platform==='android'||a?.content_type==='application/vnd.android.package-archive');
    const exes=valid.filter(a=>/\.exe$/i.test(a?.name||'')||a?.platform==='windows');
    const android=apks.find(a=>/universal|release/i.test(a?.name||''))||apks[0];
    const windows=exes.find(a=>/setup|installer/i.test(a?.name||''))||exes[0];
    if(!android&&!windows)return null;
    const toUrl=a=>{
      if(!a)return null;
      if(a.name)return base+'downloads/'+a.name;
      return a.browser_download_url||a.url||null;
    };
    return {
      tag:data.tag_name||data.version||android?.version||windows?.version||'',
      urls:{android:toUrl(android),windows:toUrl(windows)},
      date:data.published_at||data.date||''
    };
  };
  const applyRelease=(tag,urls,date)=>{
    dlBtns.forEach(btn=>{
      const u=urls[btn.dataset.dl];
      if(u){
        btn.href=u;
        btn.removeAttribute('target');
        btn.dataset.assetUrl=u;
      }
    });
    if(tag){
      const when=date?fmtDate(date):'';
      verEls.forEach(el=>{el.textContent=when?tag+' · '+when:tag});
    }
  };
  let fetchDone=false;
  const resolvePromise=(async()=>{
    const cached=readCache(sessionStorage,15*60*1000);
    if(cached){
      applyRelease(cached.tag,cached.urls,cached.date);
      verEls.forEach(el=>el.classList.remove('loading'));
      fetchDone=true;
      return;
    }
    let entry=null;
    // 1. Fetch ./downloads/version.json FIRST for download URLs
    try{
      const ac1=new AbortController(),tm1=setTimeout(()=>ac1.abort(),3000);
      const res=await fetch(vUrl,{headers:{Accept:'application/json'},signal:ac1.signal});
      clearTimeout(tm1);
      if(res.ok){
        const data=await res.json();
        const parsed=selectFromVersionJson(data);
        if(parsed&&(parsed.urls.android||parsed.urls.windows)){
          entry={tag:parsed.tag,urls:parsed.urls,ts:Date.now(),date:parsed.date};
        }
      }
    }catch(e){}

    // 2. Fall back to GitHub API when version.json is missing or stale
    if(!entry){
      const ac2=new AbortController(),tm2=setTimeout(()=>ac2.abort(),4000);
      try{
        const res=await fetch('https://api.github.com/repos/Yuan0-o/Lucent/releases/latest',{
          headers:{Accept:'application/vnd.github+json'},
          signal:ac2.signal
        });
        clearTimeout(tm2);
        if(!res.ok)throw new Error(res.status);
        const data=await res.json();
        if(data.prerelease||data.draft||!data.tag_name||/^p/i.test(data.tag_name))throw new Error('invalid');
        const urls=selectAssets(data.assets);
        entry={tag:data.tag_name,urls,ts:Date.now(),date:data.published_at};
      }catch(err){
        clearTimeout(tm2);
        const stale=readCache(localStorage,6*60*60*1000);
        if(stale){
          applyRelease(stale.tag,stale.urls,stale.date);
        }
      }
    }

    if(entry){
      writeCache(entry);
      applyRelease(entry.tag,entry.urls,entry.date);
    }
    fetchDone=true;
    verEls.forEach(el=>el.classList.remove('loading'));
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
/* changelog: stable releases pulled live from GitHub, built from DOM nodes only (never innerHTML) */
const cl=$('[data-changelog]');
if(cl){
  const L=cl.dataset,list=$('[data-cl-list]',cl),status=$('[data-cl-status]',cl),prev=$('[data-cl-previews]',cl);
  const RK='lucent-releases-list',API='https://api.github.com/repos/Yuan0-o/Lucent/releases?per_page=30',ALL='https://github.com/Yuan0-o/Lucent/releases';
  const el=(tag,cls,txt)=>{const n=d.createElement(tag);if(cls)n.className=cls;if(txt!=null)n.textContent=txt;return n};
  const fmt=iso=>{try{return new Intl.DateTimeFormat(h.lang||undefined,{year:'numeric',month:'short',day:'numeric'}).format(new Date(iso))}catch(e){return String(iso||'').slice(0,10)}};
  const isPre=r=>!!r.prerelease||/^p/i.test(r.tag_name||'');
  const inline=(s,p)=>{
    const re=/`([^`]+)`|\*\*([^*]+)\*\*|\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g;let i=0,m;
    while((m=re.exec(s))){
      if(m.index>i)p.append(s.slice(i,m.index));
      if(m[1]!==undefined)p.append(el('code',0,m[1]));
      else if(m[2]!==undefined)p.append(el('strong',0,m[2]));
      else{const a=el('a',0,m[3]);a.href=m[4];a.target='_blank';a.rel='noopener';p.append(a)}
      i=re.lastIndex;
    }
    if(i<s.length)p.append(s.slice(i));
  };
  const notes=md=>{
    const f=d.createDocumentFragment();let ul=null,para=null;
    String(md||'').replace(/\r/g,'').replace(/<!--[\s\S]*?-->/g,'').replace(/!\[[^\]]*\]\([^)]*\)/g,'').split('\n').forEach(raw=>{
      const line=raw.trim();let m;
      if(!line){ul=null;para=null;return}
      if((m=line.match(/^#{1,6}\s+(.*)$/))){ul=null;para=null;const e=el('h4');inline(m[1],e);f.append(e);return}
      if((m=line.match(/^[-*+]\s+(.*)$/))){para=null;if(!ul){ul=el('ul');f.append(ul)}const li=el('li');inline(m[1],li);ul.append(li);return}
      ul=null;if(!para){para=el('p');f.append(para)}else para.append(' ');inline(line,para);
    });
    return f;
  };
  const draw=()=>{
    const rows=(cl._rel||[]).filter(r=>!r.draft&&(prev.checked||!isPre(r)));
    list.replaceChildren();
    if(!rows.length){status.hidden=false;status.textContent=L.lEmpty;return}
    status.hidden=true;
    let latest=true;
    rows.forEach((r,i)=>{
      const det=el('details','release glass');if(i===0)det.open=true;
      const sum=el('summary');
      sum.append(el('span','rel-title',r.name||r.tag_name));
      if(isPre(r))sum.append(el('span','rel-badge',L.lPreview));
      else if(latest){sum.append(el('span','rel-badge',L.lLatest));latest=false}
      sum.append(el('span','rel-meta',[r.tag_name,r.published_at?fmt(r.published_at):''].filter(Boolean).join(' · ')));
      det.append(sum);
      const body=el('div','rel-body prose');
      const n=notes(r.body);
      if(n.childNodes.length)body.append(n);else body.append(el('p',0,L.lNoNotes));
      if(/^https:\/\/github\.com\//.test(r.html_url||'')){const a=el('a','rel-link',L.lView);a.href=r.html_url;a.target='_blank';a.rel='noopener';body.append(a)}
      det.append(body);list.append(det);
    });
  };
  const save=data=>{const s=JSON.stringify({ts:Date.now(),data});try{sessionStorage.setItem(RK,s)}catch(e){}try{localStorage.setItem(RK,s)}catch(e){}};
  const read=(st,max)=>{try{const it=JSON.parse(st.getItem(RK));if(it&&it.ts&&Date.now()-it.ts<max&&Array.isArray(it.data))return it.data}catch(e){}return null};
  const fail=()=>{status.hidden=false;status.textContent=L.lError+' ';const a=el('a',0,L.lErrLink);a.href=ALL;a.target='_blank';a.rel='noopener';status.append(a)};
  prev.addEventListener('change',()=>{if(cl._rel)draw()});
  (async()=>{
    status.hidden=false;status.textContent=L.lLoading;
    let data=read(sessionStorage,15*60*1000);
    if(!data){
      const ac=new AbortController(),tm=setTimeout(()=>ac.abort(),7000);
      try{
        const res=await fetch(API,{headers:{Accept:'application/vnd.github+json'},signal:ac.signal});
        clearTimeout(tm);if(!res.ok)throw new Error(res.status);
        const json=await res.json();if(!Array.isArray(json))throw new Error('shape');
        data=json.map(r=>({tag_name:r.tag_name,name:r.name,body:r.body,html_url:r.html_url,published_at:r.published_at,prerelease:r.prerelease,draft:r.draft}));
        save(data);
      }catch(e){clearTimeout(tm);data=read(localStorage,6*60*60*1000)}
    }
    if(!data){fail();return}
    cl._rel=data;draw();
  })();
}

/* screenshots: each gallery appears only once its image files exist in assets/shots/ (never a broken box) */
$$('[data-shots]').forEach(sec=>{
  const figs=$$('figure[data-device]',sec);
  const probe=src=>new Promise(r=>{const i=new Image();i.onload=()=>r(i);i.onerror=()=>r(null);i.src=src});
  Promise.all(figs.map(async f=>{
    const [l,k]=await Promise.all([probe(f.dataset.srcLight),probe(f.dataset.srcDark)]);
    f._s={light:l&&{src:f.dataset.srcLight,w:l.naturalWidth,h:l.naturalHeight},dark:k&&{src:f.dataset.srcDark,w:k.naturalWidth,h:k.naturalHeight}};
    return !!(l||k);
  })).then(ok=>{
    if(!ok.some(Boolean))return;
    const show=()=>{
      const t=h.dataset.theme==='light'?'light':'dark';
      figs.forEach((f,i)=>{
        if(!ok[i])return;
        const s=f._s,use=s[t]?t:(s.light?'light':'dark'),img=$('img',f);
        if(img.dataset.use!==use){img.dataset.use=use;img.src=s[use].src;img.width=s[use].w;img.height=s[use].h;img.alt=f.dataset[use==='light'?'altLight':'altDark']}
        f.hidden=false;
      });
    };
    show();sec.hidden=false;
    new MutationObserver(show).observe(h,{attributes:true,attributeFilter:['data-theme']});
  });
});
})();
