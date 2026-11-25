{
const EMAIL = 'sonya@toldingreen.com';
/* Web3Forms access key: submissions are emailed to sonya@toldingreen.com. The key is public by design. */
const W3F_KEY = '213143eb-f5cc-4dee-a44e-b891840388e3';
const store = {
  get(k){ try { return JSON.parse(localStorage.getItem(k)); } catch(e){ return null; } },
  set(k,v){ try { localStorage.setItem(k, JSON.stringify(v)); } catch(e){} },
  del(k){ try { localStorage.removeItem(k); } catch(e){} }
};
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const usd = n => '$' + Math.round(n).toLocaleString('en-US');

/* ---------- glyphs for the gradient tiles ---------- */
const star = (x,y,r) => `<path d="M${x} ${y-r}C${x+r*.12} ${y-r*.12} ${x+r*.12} ${y-r*.12} ${x+r} ${y}C${x+r*.12} ${y+r*.12} ${x+r*.12} ${y+r*.12} ${x} ${y+r}C${x-r*.12} ${y+r*.12} ${x-r*.12} ${y+r*.12} ${x-r} ${y}C${x-r*.12} ${y-r*.12} ${x-r*.12} ${y-r*.12} ${x} ${y-r}Z"/>`;
const GLYPHS = {
  pr(){ // broadcast: arcs of dots
    let s=''; [[16,7],[30,10],[44,13]].forEach(([R,n],k)=>{ for(let i=0;i<n;i++){ const a=Math.PI*(1.08+.84*i/(n-1)); s+=`<circle cx="${50+R*Math.cos(a)}" cy="${72+R*Math.sin(a)}" r="${4.6-k*.6}"/>`; } });
    return s + '<circle cx="50" cy="72" r="6"/>';
  },
  art(){ // asterisk of rounded bars
    let s=''; for(let i=0;i<4;i++) s+=`<rect x="44" y="12" width="12" height="76" rx="6" transform="rotate(${i*45} 50 50)"/>`; return s;
  },
  db(){ // plus made of rounded squares
    const p=[[38,10],[38,38],[38,66],[10,38],[66,38],[22,22],[54,22],[22,54],[54,54]];
    return p.map(([x,y],i)=>`<rect x="${x+(i>4?6:0)}" y="${y+(i>4?6:0)}" width="${i>4?12:24}" height="${i>4?12:24}" rx="${i>4?3:6}"/>`).join('');
  },
  out(){ // arrow of dots moving right
    let s=''; for(let r=0;r<5;r++) for(let c=0;c<5;c++){ const d=Math.abs(r-2); if(c>=d && c<=d+2) s+=`<circle cx="${14+c*18}" cy="${14+r*18}" r="${5.5}"/>`; } return s;
  },
  mail(){ // grid of four-point stars
    let s=''; for(let r=0;r<3;r++) for(let c=0;c<3;c++) s+=star(18+c*32,18+r*32,(r===1&&c===2)?10:14); return s;
  },
  li(){ // stacked rounded bars, a feed
    return [0,1,2,3].map(i=>`<rect x="${10+(i%2)*14}" y="${12+i*21}" width="${80-(i%2)*14}" height="14" rx="7"/>`).join('');
  },
  audit(){ // ring with a single star
    return '<circle cx="50" cy="50" r="34" fill="none" stroke="#fff" stroke-width="9"/>' + star(50,50,16);
  },
  you(){ // halftone portrait mark: dots growing toward centre
    let s=''; for(let r=0;r<7;r++) for(let c=0;c<7;c++){ const d=Math.hypot(r-3,c-3); const rad=Math.max(0,6.2-d*1.5); if(rad>.8) s+=`<circle cx="${14+c*12}" cy="${14+r*12}" r="${rad}"/>`; } return s;
  },
  shield(){
    return '<path d="M50 8 86 22v26c0 22-15 38-36 46C29 86 14 70 14 48V22Z" fill="none" stroke="#CCF261" stroke-width="7" stroke-linejoin="round"/>' + '<circle cx="50" cy="50" r="10" fill="#CCF261"/>';
  }
};
document.querySelectorAll('[data-glyph]').forEach(el=>{
  const g = GLYPHS[el.dataset.glyph]; if(!g) return;
  el.insertAdjacentHTML('beforeend', `<svg viewBox="0 0 100 100" fill="#fff" aria-hidden="true">${g()}</svg>`);
});

/* ---------- LED wall: halftone ribbon ---------- */
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
document.querySelectorAll('.wall').forEach(wall=>{
  const cv = wall.querySelector('canvas'); if(!cv) return;
  const ctx = cv.getContext('2d');
  const amp = parseFloat(wall.dataset.amp || '1');
  let W=0,H=0,dpr=1,clears=[],t=parseFloat(wall.dataset.seed||'0'),run=false,frame=0;
  const measure = ()=>{
    const r = cv.getBoundingClientRect(); dpr = Math.min(2, window.devicePixelRatio||1);
    W = r.width; H = r.height; cv.width = Math.round(W*dpr); cv.height = Math.round(H*dpr);
    clears = [...wall.querySelectorAll('[data-clear]')].map(el=>{ const b=el.getBoundingClientRect(); return [b.left-r.left-14,b.top-r.top-14,b.right-r.left+14,b.bottom-r.top+14]; });
  };
  const draw = ()=>{
    ctx.setTransform(dpr,0,0,dpr,0,0); ctx.clearRect(0,0,W,H);
    const step = W<600 ? 9 : 11, max = step*.52;
    const dim = new Path2D(), lit = new Path2D();
    for(let x=step/2;x<W;x+=step){
      const u = x/W;
      const ph = W<600;
      const cy = ph ? 70 + 110*u + 26*Math.sin(u*5+t) : H*(.24 + .34*u + .09*amp*Math.sin(u*5.0+t) + .035*Math.sin(u*12.5-t*1.3));
      const w = ph ? 30 + 12*Math.sin(u*3.1+t*.6) : H*(.085 + .045*Math.sin(u*3.1+t*.6));
      const cy2 = cy + H*(.15 + .04*Math.sin(u*7+t));
      const w2 = w*.45, fade2 = Math.max(0, Math.min(1,(u-.38)*4)) * Math.max(0, Math.min(1,(.92-u)*5));
      for(let y=step/2;y<H;y+=step){
        let skip=false; for(const c of clears){ if(x>c[0]&&x<c[2]&&y>c[1]&&y<c[3]){ skip=true; break; } } if(skip) continue;
        const d1=(y-cy)/w, d2=(y-cy2)/w2;
        const v = Math.max(Math.exp(-d1*d1*.5), .8*fade2*Math.exp(-d2*d2*.5));
        const r = max*v;
        if(r<1.05){ dim.moveTo(x+1.05,y); dim.arc(x,y,1.05,0,6.2832); }
        else { lit.moveTo(x+r,y); lit.arc(x,y,r,0,6.2832); }
      }
    }
    ctx.fillStyle='rgba(214,236,206,.10)'; ctx.fill(dim);
    ctx.fillStyle='#CCF261'; ctx.fill(lit);
  };
  const loop = ()=>{ if(!run) return; frame++; if(frame%2===0){ t+=.012; draw(); } requestAnimationFrame(loop); };
  const ro = new ResizeObserver(()=>{ measure(); draw(); }); ro.observe(wall);
  if(!reduce){
    const io = new IntersectionObserver(es=>{ es.forEach(e=>{ const was=run; run=e.isIntersecting; if(run&&!was) requestAnimationFrame(loop); }); });
    io.observe(wall);
  }
});

/* ---------- pricing calculator ---------- */
const ITEMS = [
  {id:'pr',  name:'Media relations & PR', price:1800, unit:'per month', lang:true, col:'#9DBF7E',
   desc:'Press list for your segment, story angles, pitching editors one by one, interview booking.'},
  {id:'art', name:'Contributed articles & longreads', price:380, unit:'per article', qty:2, min:1, max:8, qlabel:'articles a month', lang:true, col:'#C3D8AE',
   desc:'Expert articles written for a named magazine, in your voice and to its guidelines.'},
  {id:'out', name:'Distributor & buyer outreach', price:1400, unit:'per month', lang:true, col:'#5F8E78',
   desc:'Personal emails to dealers, distributors and large growers, follow-ups, warm handoff to sales.'},
  {id:'mail',name:'Email campaigns & CRM', price:750, unit:'per month', lang:true, col:'#8FB3B5',
   desc:'Lists, segments and contact scoring in your CRM, one campaign a month built from your content.'},
  {id:'li',  name:'LinkedIn company page', price:650, unit:'per month', lang:true, col:'#DCE3D4',
   desc:'Eight posts a month from your cases, articles, trade shows and team.'},
  {id:'db',  name:'Market contact base', price:600, unit:'per market, once', qty:1, min:1, max:12, qlabel:'markets', oneoff:true,
   desc:'Growers or channel partners in one country: found, verified, segmented, competitors removed.'},
  {id:'audit',name:'Website & analytics audit', price:900, unit:'once', oneoff:true,
   desc:'Broken links, content gaps, GA4 check for bot traffic, a fix list your developer can use.'}
];
const PRESETS = {
  press:{label:'Get into the trade press', on:['pr','art','li'], qty:{art:2}},
  market:{label:'Open a new market', on:['db','out','mail'], qty:{db:2}},
  engine:{label:'Full engine', on:['pr','art','out','mail','li','db'], qty:{art:2,db:1}}
};
const TERMS = {1:-.20, 3:0, 6:.07, 12:.12};
const calcEl = document.getElementById('calc');
if(calcEl){
  const saved = store.get('tig-calc2');
  const S = saved && saved.on ? saved : {preset:'press', on:{pr:true,art:true,li:true}, qty:{art:2,db:1}, lang:0, term:3};
  const rowsEl = document.getElementById('rows');
  rowsEl.innerHTML = ITEMS.map(it=>`
    <div class="row" id="row-${it.id}">
      <input class="sw" type="checkbox" id="sw-${it.id}" aria-label="${esc(it.name)}">
      <label for="sw-${it.id}" style="display:block;font-weight:400;cursor:pointer"><span class="name">${esc(it.name)}</span><span class="desc" style="display:block">${esc(it.desc)}</span></label>
      <div class="price">${usd(it.price)}<small>${esc(it.unit)}</small></div>
      ${it.qty?`<div class="qty" id="q-${it.id}" hidden><button type="button" data-q="${it.id}" data-d="-1" aria-label="Fewer">−</button><output id="qo-${it.id}">1</output><button type="button" data-q="${it.id}" data-d="1" aria-label="More">+</button><span>${esc(it.qlabel)}</span></div>`:''}
    </div>`).join('');
  const presetsEl = document.getElementById('presets');
  presetsEl.innerHTML = Object.entries(PRESETS).map(([k,p])=>`<button type="button" class="chip" data-p="${k}" aria-pressed="false">${esc(p.label)}</button>`).join('');

  const compute = ()=>{
    const langF = 1 + .2*S.lang;
    const lines = []; let gross=0, oneoff=0, nMonthly=0;
    ITEMS.forEach(it=>{
      if(!S.on[it.id]) return;
      const q = it.qty ? (S.qty[it.id]||1) : 1;
      const cost = it.price * q * (it.lang ? langF : 1);
      if(it.oneoff){ oneoff += cost; lines.push({it,q,cost,once:true}); }
      else { gross += cost; nMonthly++; lines.push({it,q,cost}); }
    });
    const bundle = nMonthly>=3 ? .10 : 0, termD = TERMS[S.term]||0;
    const monthly = Math.round(gross*(1-bundle)*(1-termD)/10)*10;
    const base3 = Math.round(gross*(1-bundle)/10)*10;
    return {lines, gross, monthly, oneoff, bundle, termD, base3, save: gross-monthly, total: monthly*S.term + oneoff, langF};
  };
  const summary = r => {
    const items = r.lines.map(l=> l.it.name + (l.it.qty ? ` × ${l.q}${l.once?'':' a month'}` : '')).join('\n  ');
    return `Estimate from Told in green\nServices:\n  ${items}\nLanguages: English${S.lang?` + ${S.lang} more`:' only'}\nTerm: ${S.term} month${S.term>1?'s':''}\nMonthly retainer: ${usd(r.monthly)}\nOne-off setup: ${usd(r.oneoff)}\nTotal for ${S.term} month${S.term>1?'s':''}: ${usd(r.total)}\nApproximate estimate, final price fixed in a freelance service contract`;
  };
  const render = ()=>{
    ITEMS.forEach(it=>{
      const on = !!S.on[it.id];
      document.getElementById('sw-'+it.id).checked = on;
      document.getElementById('row-'+it.id).classList.toggle('on', on);
      const q = document.getElementById('q-'+it.id);
      if(q){ q.hidden = !on; document.getElementById('qo-'+it.id).textContent = S.qty[it.id]||1; }
    });
    presetsEl.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed', String(b.dataset.p===S.preset)));
    document.querySelectorAll('#lang button').forEach(b=>b.setAttribute('aria-pressed', String(+b.dataset.v===S.lang)));
    document.querySelectorAll('#term button').forEach(b=>b.setAttribute('aria-pressed', String(+b.dataset.v===S.term)));
    const r = compute();
    const empty = !r.lines.length;
    document.getElementById('r-empty').hidden = !empty;
    document.getElementById('r-full').hidden = empty;
    document.getElementById('r-big').innerHTML = `${usd(r.monthly)}<small> / month</small>`;
    document.getElementById('bar-v').textContent = empty ? '—' : usd(r.monthly)+' / mo';
    const monthlyLines = r.lines.filter(l=>!l.once);
    document.getElementById('r-mix').innerHTML = monthlyLines.map(l=>`<span style="width:${(l.cost/r.gross*100).toFixed(2)}%;background:${l.it.col}"></span>`).join('');
    let brk = monthlyLines.map(l=>`<div><i style="background:${l.it.col}"></i><span>${esc(l.it.name)}${l.it.qty?` × ${l.q}`:''}</span><b>${usd(l.cost)}</b></div>`).join('');
    if(r.save>0) brk += `<div><i style="background:transparent;border:1px solid #B9C6B5"></i><span>Bundle and term discount</span><b>−${usd(r.save)}</b></div>`;
    if(r.save<0) brk += `<div><i style="background:transparent;border:1px solid #B9C6B5"></i><span>Single-month surcharge, 20%</span><b>+${usd(-r.save)}</b></div>`;
    if(!monthlyLines.length) brk = '<div><i style="background:transparent"></i><span>No monthly services selected</span><b>$0</b></div>';
    document.getElementById('r-brk').innerHTML = brk;
    document.getElementById('r-once').textContent = usd(r.oneoff);
    document.getElementById('r-total-k').textContent = S.term===1 ? 'Total for 1 month' : `Total for ${S.term} months`;
    document.getElementById('r-total').textContent = usd(r.total);
    const parts=[]; if(r.bundle) parts.push('10% for three or more monthly services'); if(r.termD>0) parts.push(`${Math.round(r.termD*100)}% for a ${S.term}-month term`);
    let saveTxt = parts.length ? `Includes ${parts.join(' and ')}.` : 'Add a third monthly service or a longer term to unlock a discount.';
    if(S.term===1) saveTxt = `On a 3-month term the same services cost ${usd(r.base3)} a month, ${usd(r.monthly-r.base3)} less.`;
    document.getElementById('r-save').textContent = saveTxt;
    store.set('tig-calc2', S);
    if(!empty) store.set('tig-estimate', {text: summary(r), ids: r.lines.map(l=>l.it.id)});
  };
  rowsEl.addEventListener('change', e=>{ const id=e.target.id.replace('sw-',''); if(e.target.classList.contains('sw')){ S.on[id]=e.target.checked; S.preset=null; render(); } });
  rowsEl.addEventListener('click', e=>{ const b=e.target.closest('[data-q]'); if(!b) return; const it=ITEMS.find(i=>i.id===b.dataset.q); S.qty[it.id]=Math.min(it.max,Math.max(it.min,(S.qty[it.id]||1)+ +b.dataset.d)); S.preset=null; render(); });
  presetsEl.addEventListener('click', e=>{ const b=e.target.closest('[data-p]'); if(!b) return; const p=PRESETS[b.dataset.p]; S.preset=b.dataset.p; S.on={}; p.on.forEach(id=>S.on[id]=true); S.qty={art:2,db:1,...p.qty}; render(); });
  document.getElementById('lang').addEventListener('click', e=>{ const b=e.target.closest('button'); if(b){ S.lang=+b.dataset.v; render(); } });
  document.getElementById('term').addEventListener('click', e=>{ const b=e.target.closest('button'); if(b){ S.term=+b.dataset.v; render(); } });
  document.getElementById('reset').addEventListener('click', ()=>{ Object.assign(S,{preset:'press', on:{pr:true,art:true,li:true}, qty:{art:2,db:1}, lang:0, term:3}); render(); });
  render();
}

/* ---------- contact form ---------- */
const form = document.getElementById('brief');
if(form){
  const est = store.get('tig-estimate');
  const estBox = document.getElementById('est');
  if(est && est.text){
    estBox.hidden = false;
    document.getElementById('est-text').textContent = est.text;
    (est.ids||[]).forEach(id=>{ const c=form.querySelector(`input[name=need][value="${id}"]`); if(c) c.checked=true; });
    document.getElementById('est-clear').addEventListener('click', ()=>{ store.del('tig-estimate'); estBox.hidden=true; });
  }
  const setErr = (id,msg)=>{ const f=document.getElementById(id); const e=document.getElementById(id+'-err'); if(f) f.setAttribute('aria-invalid', msg?'true':'false'); if(e) e.textContent=msg||''; return !msg; };
  form.addEventListener('submit', async e=>{
    e.preventDefault();
    document.getElementById('f-send-err').textContent='';
    const v = id => document.getElementById(id).value.trim();
    const needs = [...form.querySelectorAll('input[name=need]:checked')].map(c=>c.parentElement.textContent.trim());
    let ok = true;
    ok = setErr('f-name', v('f-name')?'':'Please add your name.') && ok;
    ok = setErr('f-email', /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v('f-email'))?'':'Please add a work email we can reply to.') && ok;
    ok = setErr('f-company', v('f-company')?'':'Please add your company name.') && ok;
    ok = setErr('f-msg', (v('f-msg')||needs.length)?'':'Pick a service above or tell us in a sentence what you need.') && ok;
    if(!ok){ form.querySelector('[aria-invalid=true]')?.focus(); return; }
    const attach = estBox.hidden===false && document.getElementById('est-use').checked;
    const text = [
      `Name: ${v('f-name')}`, `Email: ${v('f-email')}`, `Company: ${v('f-company')}`,
      v('f-site')?`Website: ${v('f-site')}`:'', v('f-role')?`Role: ${v('f-role')}`:'',
      needs.length?`Interested in: ${needs.join(', ')}`:'', v('f-markets')?`Markets: ${v('f-markets')}`:'',
      v('f-budget')?`Monthly budget: ${v('f-budget')}`:'', v('f-msg')?`\n${v('f-msg')}`:'',
      attach?`\n${est.text}`:''
    ].filter(Boolean).join('\n');
    const showFallback = ()=>{
      const done = document.getElementById('done');
      document.getElementById('done-text').textContent = text;
      document.getElementById('done-mail').href = `mailto:${EMAIL}?subject=${encodeURIComponent('Brief from '+v('f-company'))}&body=${encodeURIComponent(text)}`;
      form.hidden = true; done.hidden = false; done.querySelector('h2').focus();
    };
    if(!W3F_KEY){ showFallback(); return; }
    const btn = document.getElementById('f-send'); btn.disabled = true; btn.textContent = 'Sending…';
    try{
      const res = await fetch('https://api.web3forms.com/submit', {
        method:'POST', headers:{'Content-Type':'application/json','Accept':'application/json'},
        body: JSON.stringify({
          access_key: W3F_KEY,
          subject: `New lead from toldingreen.com: ${v('f-company')}`,
          from_name: 'Told in green website',
          replyto: v('f-email'),
          botcheck: document.getElementById('f-bot').checked,
          Name: v('f-name'), Email: v('f-email'), Company: v('f-company'),
          Website: v('f-site'), Role: v('f-role'), Markets: v('f-markets'),
          'Interested in': needs.join(', '), 'Monthly budget': v('f-budget'),
          Message: v('f-msg'), Estimate: attach ? est.text : ''
        })
      });
      const data = await res.json().catch(()=>({}));
      if(!res.ok || data.success === false) throw new Error(data.message || 'send failed');
      store.del('tig-estimate');
      const sent = document.getElementById('sent');
      form.hidden = true; sent.hidden = false; sent.querySelector('h2').focus();
    } catch(err){
      btn.disabled = false; btn.textContent = 'Send';
      showFallback();
    }
  });
  document.getElementById('done-copy').addEventListener('click', async e=>{
    const t = document.getElementById('done-text').textContent, b=e.currentTarget;
    try { await navigator.clipboard.writeText(t); b.textContent='Copied'; }
    catch(err){ const r=document.createRange(); r.selectNodeContents(document.getElementById('done-text')); const s=getSelection(); s.removeAllRanges(); s.addRange(r); b.textContent='Selected, press Ctrl+C'; }
  });
  document.getElementById('done-edit').addEventListener('click', ()=>{ document.getElementById('done').hidden=true; form.hidden=false; });
}
}
