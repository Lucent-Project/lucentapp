(()=>{
const d=document,h=d.documentElement,$=(s,r=d)=>r.querySelector(s),$$=(s,r=d)=>[...r.querySelectorAll(s)];
const nav=$('nav'),lg=$('.lang'),burger=$('.burger');
const COLORS={dark:'#080b16',light:'#eef2fb'};
const isSub=$('script[src*="app.js"]')?.getAttribute('src')?.startsWith('../')||/\/(zh|ja|ko)(\/|$)/.test(location.pathname);
const base=isSub?'../':'./';
const mergeSplitDownload=async(manifest,fallbackUrl)=>{
  try{
    if(!manifest||!Array.isArray(manifest.parts)||!manifest.parts.length)throw new Error('invalid');
    const bufs=[];
    for(const p of manifest.parts){
      const u=p.url||(base+'downloads/'+p.name);
      const res=await fetch(u);
      if(!res.ok)throw new Error('part fetch');
      bufs.push(await res.arrayBuffer());
    }
    const blob=new Blob(bufs);
    const hashBuf=await crypto.subtle.digest('SHA-256',await blob.arrayBuffer());
    const hash=[...new Uint8Array(hashBuf)].map(b=>b.toString(16).padStart(2,'0')).join('');
    if(hash.toLowerCase()!==String(manifest.sha256||'').toLowerCase())throw new Error('sha256');
    const objUrl=URL.createObjectURL(blob);
    const a=d.createElement('a');
    a.href=objUrl;
    a.download=manifest.name||'download';
    d.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(()=>URL.revokeObjectURL(objUrl),60000);
  }catch(err){
    if(fallbackUrl)window.location.assign(fallbackUrl);
  }
};

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
$$('.lang .menu a').forEach(a=>a.addEventListener('click',()=>{try{var hl=(a.getAttribute('hreflang')||'en').toLowerCase();localStorage.setItem('lucent-lang',hl.indexOf('zh')===0?'zh':hl.indexOf('ja')===0?'ja':hl.indexOf('ko')===0?'ko':'en')}catch(e){}}));
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
  const vUrl=base+'downloads/version.json';
  const fmtDate=iso=>{try{return new Intl.DateTimeFormat(h.lang||undefined,{year:'numeric',month:'short',day:'numeric'}).format(new Date(iso))}catch(e){return ''}};
  const readCache=(st,max)=>{
    try{
      const raw=st.getItem(KEY);
      if(!raw)return null;
      const it=JSON.parse(raw);
      if(it&&it.ts&&(Date.now()-it.ts<max)&&(it.urls||it.splits))return it;
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
    const toManifest=a=>a?.split?{name:a.name,sha256:a.sha256,parts:a.split.parts||[]}:null;
    const toFallback=a=>a?.fallback_download_url||a?.browser_download_url||a?.url||null;
    const toUrl=a=>{
      if(!a||a.split)return null;
      if(a.name)return base+'downloads/'+a.name;
      return a.browser_download_url||a.url||null;
    };
    return {
      tag:data.tag_name||data.version||android?.version||windows?.version||'',
      urls:{android:toUrl(android),windows:toUrl(windows)},
      splits:{android:toManifest(android),windows:toManifest(windows)},
      fallbacks:{android:toFallback(android),windows:toFallback(windows)},
      date:data.published_at||data.date||''
    };
  };
  const applyRelease=(tag,urls={},date='',splits={},fallbacks={})=>{
    dlBtns.forEach(btn=>{
      const platform=btn.dataset.dl;
      const sp=splits&&splits[platform];
      const fb=fallbacks&&fallbacks[platform];
      if(sp){
        if(fb){
          btn.href=fb;
          btn.target='_blank';
          btn.rel='noopener';
        }
        btn.dataset.split=JSON.stringify(sp);
        if(fb)btn.dataset.fallback=fb;
        delete btn.dataset.assetUrl;
      }else{
        const u=urls&&urls[platform];
        if(u){
          btn.href=u;
          btn.removeAttribute('target');
          btn.removeAttribute('rel');
          btn.dataset.assetUrl=u;
          delete btn.dataset.split;
          delete btn.dataset.fallback;
        }
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
      applyRelease(cached.tag,cached.urls,cached.date,cached.splits,cached.fallbacks);
      verEls.forEach(el=>el.classList.remove('loading'));
      fetchDone=true;
      return;
    }
    let entry=null;
    try{
      const ac1=new AbortController(),tm1=setTimeout(()=>ac1.abort(),3000);
      const res=await fetch(vUrl,{headers:{Accept:'application/json'},signal:ac1.signal});
      clearTimeout(tm1);
      if(res.ok){
        const data=await res.json();
        const parsed=selectFromVersionJson(data);
        if(parsed&&(parsed.urls.android||parsed.urls.windows||parsed.splits?.android||parsed.splits?.windows)){
          entry={tag:parsed.tag,urls:parsed.urls,splits:parsed.splits,fallbacks:parsed.fallbacks,ts:Date.now(),date:parsed.date};
        }
      }
    }catch(e){}

    if(!entry){
      const ac2=new AbortController(),tm2=setTimeout(()=>ac2.abort(),4000);
      try{
        const res=await fetch('https://api.github.com/repos/Lucent-Project/Lucent/releases/latest',{
          headers:{Accept:'application/vnd.github+json'},
          signal:ac2.signal
        });
        clearTimeout(tm2);
        if(!res.ok)throw new Error(res.status);
        const data=await res.json();
        if(data.prerelease||data.draft||!data.tag_name||/^p/i.test(data.tag_name))throw new Error('invalid');
        const urls=selectAssets(data.assets);
        entry={tag:data.tag_name,urls,splits:{},fallbacks:{},ts:Date.now(),date:data.published_at};
      }catch(err){
        clearTimeout(tm2);
        const stale=readCache(localStorage,6*60*60*1000);
        if(stale){
          applyRelease(stale.tag,stale.urls,stale.date,stale.splits,stale.fallbacks);
        }
      }
    }

    if(entry){
      writeCache(entry);
      applyRelease(entry.tag,entry.urls,entry.date,entry.splits,entry.fallbacks);
    }
    fetchDone=true;
    verEls.forEach(el=>el.classList.remove('loading'));
  })();
  dlBtns.forEach(btn=>{
    btn.addEventListener('click',async e=>{
      if(btn.dataset.split){
        e.preventDefault();
        btn.setAttribute('aria-busy','true');
        try{
          await mergeSplitDownload(JSON.parse(btn.dataset.split),btn.dataset.fallback||btn.href);
        }finally{
          btn.removeAttribute('aria-busy');
        }
        return;
      }
      if(btn.dataset.assetUrl||fetchDone)return;
      e.preventDefault();
      btn.setAttribute('aria-busy','true');
      try{
        await resolvePromise;
      }catch(err){}
      if(btn.dataset.split){
        try{
          await mergeSplitDownload(JSON.parse(btn.dataset.split),btn.dataset.fallback||btn.href);
        }finally{
          btn.removeAttribute('aria-busy');
        }
        return;
      }
      btn.removeAttribute('aria-busy');
      window.location.assign(btn.dataset.assetUrl||btn.href);
    });
  });
}
/* changelog: all releases pulled live from GitHub (stable + preview), built from DOM nodes only (never innerHTML) */
const cl=$('[data-changelog]');
if(cl){
  const L=cl.dataset,list=$('[data-cl-list]',cl),status=$('[data-cl-status]',cl),prev=$('[data-cl-previews]',cl);
  const RK='lucent-releases-v2',ALL='https://github.com/Lucent-Project/Lucent/releases';
  const LANG_LABELS={zh:'简体中文',ja:'日本語',ko:'한국어'};
  const pageLang=(h.lang||'').toLowerCase().startsWith('zh')?'zh':
                 (h.lang||'').toLowerCase().startsWith('ja')?'ja':
                 (h.lang||'').toLowerCase().startsWith('ko')?'ko':
                 (/\/(zh|ja|ko)(\/|$)/.exec(location.pathname)?.[1]||'en');
  const el=(tag,cls,txt)=>{const n=d.createElement(tag);if(cls)n.className=cls;if(txt!=null)n.textContent=txt;return n};
  const fmt=iso=>{try{return new Intl.DateTimeFormat(h.lang||undefined,{year:'numeric',month:'short',day:'numeric'}).format(new Date(iso))}catch(e){return String(iso||'').slice(0,10)}};
  const PER=10;let pg=0;
  const pager=el('nav','rel-pager');pager.hidden=true;list.after(pager);
  const isPre=r=>!!r.prerelease||/^p/i.test(r.tag_name||'');
  const parseRelease=(body,lang)=>{
    const text=String(body||'').replace(/\r/g,'').replace(/Yuan0-o\/Lucent/g,'Lucent-Project/Lucent');
    const firstDet=text.indexOf('<details>');
    const enBody=(firstDet!==-1?text.slice(0,firstDet):text).trim();
    if(lang==='en')return {title:null,body:enBody};
    const lbl=LANG_LABELS[lang];
    if(lbl){
      const re=new RegExp('<details>\\s*<summary>\\s*'+lbl+'\\s*<\\/summary>([\\s\\S]*?)<\\/details>','i');
      const m=text.match(re);
      if(m){
        const content=m[1].trim();
        const tm=content.match(/^#{1,6}\s+(.*)$/m);
        return {title:tm?tm[1].trim():null,body:content};
      }
    }
    return {title:null,body:enBody};
  };
  const mirrorFor=async tag=>{
    try{
      const ac=new AbortController(),tm=setTimeout(()=>ac.abort(),3000);
      const res=await fetch(base+'downloads/version.json',{headers:{Accept:'application/json'},signal:ac.signal});
      clearTimeout(tm);
      if(!res.ok)return null;
      const data=await res.json();
      const vtag=data.tag_name||data.version;
      if(vtag&&vtag!==tag)return null;
      const items=Array.isArray(data.assets)?data.assets:(Array.isArray(data.files)?data.files:[]);
      const valid=items.filter(a=>!/\.(sha256|sig|asc|txt)$/i.test(a?.name||''));
      const apk=valid.find(a=>/\.apk$/i.test(a?.name||'')||a?.platform==='android'||a?.content_type==='application/vnd.android.package-archive');
      const exe=valid.find(a=>/\.exe$/i.test(a?.name||'')||a?.platform==='windows');
      const toManifest=a=>a?.split?{name:a.name,sha256:a.sha256,parts:a.split.parts||[]}:null;
      const toFallback=a=>a?.fallback_download_url||a?.browser_download_url||a?.url||null;
      const toUrl=a=>{
        if(!a)return null;
        if(a.split)return toFallback(a);
        if(a.name)return base+'downloads/'+a.name;
        return a.browser_download_url||a.url||null;
      };
      const urls={android:toUrl(apk),windows:toUrl(exe)};
      const splits={android:toManifest(apk),windows:toManifest(exe)};
      if(!urls.android&&!urls.windows&&!splits.android&&!splits.windows)return null;
      return {android:urls.android,windows:urls.windows,splits};
    }catch(e){return null}
  };
  const ghAssets=assets=>{
    const valid=(assets||[]).filter(a=>!/\.(sha256|sig|asc|txt)$/i.test(a?.name||''));
    const apk=valid.find(a=>/\.apk$/i.test(a?.name||''));
    const exe=valid.find(a=>/\.exe$/i.test(a?.name||''));
    const urls={android:apk?.browser_download_url||null,windows:exe?.browser_download_url||null};
    return (urls.android||urls.windows)?urls:null;
  };
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
      if(!line||line==='---'){ul=null;para=null;return}
      if((m=line.match(/^#{1,6}\s+(.*)$/))){ul=null;para=null;const e=el('h4');inline(m[1],e);f.append(e);return}
      if((m=line.match(/^[-*+]\s+(.*)$/))){para=null;if(!ul){ul=el('ul');f.append(ul)}const li=el('li');inline(m[1],li);ul.append(li);return}
      ul=null;if(!para){para=el('p');f.append(para)}else para.append(' ');inline(line,para);
    });
    return f;
  };
  const draw=()=>{
    const rows=(cl._rel||[]).filter(r=>!r.draft&&(prev.checked||!isPre(r)));
    list.replaceChildren();
    if(!rows.length){
      status.hidden=false;
      const hiddenPre=(cl._rel||[]).some(r=>!r.draft&&isPre(r))&&!prev.checked;
      status.textContent=L.lEmpty+(hiddenPre&&L.lEmptyHint?' '+L.lEmptyHint:'');
      pager.hidden=true;
      return;
    }
    status.hidden=true;
    const pages=Math.max(1,Math.ceil(rows.length/PER));
    if(pg>pages-1)pg=pages-1;
    const slice=rows.slice(pg*PER,pg*PER+PER);
    let latest=true;
    slice.forEach(r=>{
      const det=el('details','release glass');
      const sum=el('summary');
      const parsed=parseRelease(r.body,pageLang);
      sum.append(el('span','rel-title',parsed.title||r.name||r.tag_name));
      if(isPre(r))sum.append(el('span','rel-badge',L.lPreview));
      else if(latest){sum.append(el('span','rel-badge',L.lLatest));latest=false}
      sum.append(el('span','rel-meta',[r.tag_name,r.published_at?fmt(r.published_at):''].filter(Boolean).join(' · ')));
      det.append(sum);
      const body=el('div','rel-body prose');
      const n=notes(parsed.body);
      if(n.childNodes.length)body.append(n);else body.append(el('p',0,L.lNoNotes));
      if(r._dl&&(r._dl.android||r._dl.windows)){
        const dl=el('div','rel-dl');
        ['android','windows'].forEach(k=>{
          const u=r._dl[k];
          if(!u)return;
          const a=el('a','btn ghost',k==='android'?L.lDlAndroid:L.lDlWindows);
          a.href=u;
          const sp=r._dl.splits?.[k];
          if(sp){
            a.target='_blank';
            a.rel='noopener';
            a.addEventListener('click',async e=>{
              e.preventDefault();
              a.setAttribute('aria-busy','true');
              try{
                await mergeSplitDownload(sp,u);
              }finally{
                a.removeAttribute('aria-busy');
              }
            });
          }
          dl.append(a);
        });
        body.append(dl);
      }
      if(/^https:\/\/github\.com\//.test(r.html_url||'')){const a=el('a','rel-link',r.tag_name===cl._latestTag?L.lView:L.lDlGh);a.href=r.html_url;a.target='_blank';a.rel='noopener';body.append(a)}
      det.append(body);list.append(det);
    });
    pager.replaceChildren();
    if(pages<=1){pager.hidden=true;return}
    pager.hidden=false;
    const go=n=>{pg=n;draw();const s=document.getElementById('changelog');if(s)s.scrollIntoView({block:'start',behavior:'smooth'})};
    const bP=el('button','btn ghost',L.lPrev||'←');bP.disabled=pg===0;bP.addEventListener('click',()=>go(pg-1));
    const bN=el('button','btn ghost',L.lNext||'→');bN.disabled=pg>=pages-1;bN.addEventListener('click',()=>go(pg+1));
    pager.append(bP,el('span','rel-pageinfo',(pg+1)+' / '+pages),bN);
  };
  const save=data=>{const s=JSON.stringify({ts:Date.now(),data});try{sessionStorage.setItem(RK,s)}catch(e){}try{localStorage.setItem(RK,s)}catch(e){}};
  const read=(st,max)=>{try{const it=JSON.parse(st.getItem(RK));if(it&&it.ts&&Date.now()-it.ts<max&&Array.isArray(it.data))return it.data}catch(e){}return null};
  const fail=()=>{status.hidden=false;status.textContent=L.lError+' ';const a=el('a',0,L.lErrLink);a.href=ALL;a.target='_blank';a.rel='noopener';status.append(a)};
  prev.addEventListener('change',()=>{pg=0;if(cl._rel)draw()});
  (async()=>{
    status.hidden=false;status.textContent=L.lLoading;
    let data=read(sessionStorage,15*60*1000);
    if(!data){
      const ac=new AbortController(),tm=setTimeout(()=>ac.abort(),12000);
      try{
        let nextUrl='https://api.github.com/repos/Lucent-Project/Lucent/releases?per_page=100';
        const raw=[];
        while(nextUrl){
          const res=await fetch(nextUrl,{headers:{Accept:'application/vnd.github+json'},signal:ac.signal});
          if(!res.ok)throw new Error(res.status);
          const chunk=await res.json();
          if(!Array.isArray(chunk))throw new Error('shape');
          raw.push(...chunk);
          const link=res.headers.get('link');
          const m=link&&link.match(/<([^>]+)>;\s*rel="next"/i);
          if(m){
            nextUrl=m[1];
          }else if(chunk.length===100){
            const u=new URL(nextUrl);
            const p=parseInt(u.searchParams.get('page')||'1',10);
            u.searchParams.set('page',p+1);
            nextUrl=u.toString();
          }else{
            nextUrl=null;
          }
        }
        clearTimeout(tm);
        data=raw.map(r=>({
          tag_name:r.tag_name,
          name:r.name,
          body:r.body,
          html_url:r.html_url,
          published_at:r.published_at,
          prerelease:r.prerelease,
          draft:r.draft,
          assets:(r.assets||[]).map(a=>({name:a.name,browser_download_url:a.browser_download_url}))
        }));
        save(data);
      }catch(e){
        clearTimeout(tm);
        data=read(localStorage,6*60*60*1000);
      }
    }
    if(!data){fail();return}
    cl._rel=data;pg=0;
    const latest=data.find(r=>!r.draft&&!isPre(r));
    if(latest){
      cl._latestTag=latest.tag_name;
      let urls=await mirrorFor(latest.tag_name);
      if(!urls)urls=ghAssets(latest.assets);
      if(urls)latest._dl=urls;
    }
    draw();
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
