const qs = s => document.querySelector(s);
const qsa = s => [...document.querySelectorAll(s)];
const pad = n => String(n).padStart(2, '0');
const fmt = n => Number(n).toLocaleString('pt-BR');

let selected = new Set();
let uploadedDatasetText = '';
let latestWallet = null;
let latestResponse = null;

const steps = [
  'Importando dataset histórico',
  'Normalizando concursos e dezenas',
  'Calculando frequência global e recente',
  'Mapeando atraso estrutural',
  'Construindo matriz de pares',
  'Estimando transição N→N+1',
  'Ativando CORE-TRANSITION',
  'Ativando NEXUS-HYBRID',
  'Ativando DIVERSITY-SHIELD',
  'Ativando TAIL-SPARK',
  'Consolidando 20 cenários técnicos'
];

function escapeHtml(v){return String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));}
function wait(ms){return new Promise(r=>setTimeout(r,ms));}

function initOrbit(){
  const map = qs('#orbital-map');
  for(let i=1;i<=25;i++){
    const node=document.createElement('div');
    node.className='orbit-node'; node.textContent=pad(i);
    const angle=(i/25)*Math.PI*2;
    const rx=42+Math.cos(angle)*36;
    const ry=42+Math.sin(angle)*34;
    node.style.left=`${rx}%`; node.style.top=`${ry}%`;
    node.style.transform='translate(-50%,-50%)';
    node.style.animation=`pulse ${1.8+(i%5)*.2}s infinite`;
    map.appendChild(node);
  }
}

function initPad(){
  const padEl=qs('#number-pad');
  for(let i=1;i<=25;i++){
    const b=document.createElement('button');
    b.type='button'; b.className='pick'; b.textContent=pad(i); b.dataset.n=i;
    b.addEventListener('click',()=>{
      if(selected.has(i)) selected.delete(i); else if(selected.size<15) selected.add(i);
      syncPadToText();
    });
    padEl.appendChild(b);
  }
}

function syncPadToText(){
  qsa('.pick').forEach(b=>b.classList.toggle('on',selected.has(Number(b.dataset.n))));
  qs('#last-draw').value=[...selected].sort((a,b)=>a-b).map(pad).join(' ');
}

function syncTextToPad(){
  const nums = parseNumbers(qs('#last-draw').value);
  selected = new Set(nums.slice(0,15));
  qsa('.pick').forEach(b=>b.classList.toggle('on',selected.has(Number(b.dataset.n))));
}

function parseNumbers(text){
  return String(text||'').split(/[^0-9]+/).filter(Boolean).map(Number).filter(n=>Number.isInteger(n)&&n>=1&&n<=25).filter((n,i,a)=>a.indexOf(n)===i).slice(0,15).sort((a,b)=>a-b);
}

async function api(url,payload={}){
  const r=await fetch(url,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(payload)});
  const j=await r.json();
  if(!r.ok||!j.ok) throw new Error(j.error||'Falha no processamento.');
  return j;
}

async function loadDatasetStatus(){
  try{
    const j=await api('/api/dataset/validate',{});
    qs('#dataset-info').innerHTML=`<strong>Base interna validada</strong><br>${fmt(j.summary.draws)} concursos • ${j.summary.firstContest} → ${j.summary.lastContest}<br>Última data: ${j.summary.lastDate}`;
  }catch(e){qs('#dataset-info').textContent=e.message;}
}

async function parseFile(file){
  if(!file) return '';
  const name=file.name.toLowerCase();
  if(name.endsWith('.xlsx')){
    if(!window.XLSX) throw new Error('Biblioteca XLSX não carregada. Use CSV/TXT/JSON ou conecte a internet para carregar o parser.');
    const buf=await file.arrayBuffer();
    const wb=XLSX.read(buf,{type:'array'});
    const sheet=wb.Sheets[wb.SheetNames[0]];
    const rows=XLSX.utils.sheet_to_json(sheet,{header:1,raw:false});
    return rows.map(r=>r.join(',')).join('\n');
  }
  return await file.text();
}

function openLab(){
  qs('#lab-overlay').classList.remove('hidden');
  qs('#progress-bar').style.width='0%';
  qs('#lab-log').innerHTML='';
  qs('#capsule-grid').innerHTML='';
  for(let i=1;i<=20;i++){
    const c=document.createElement('div'); c.className='capsule'; c.dataset.i=i;
    c.innerHTML=`<strong>Cenário ${pad(i)}</strong><br>aguardando energia`;
    qs('#capsule-grid').appendChild(c);
  }
}
function closeLab(){qs('#lab-overlay').classList.add('hidden');}
function log(msg){
  const d=document.createElement('div'); d.textContent=msg; qs('#lab-log').prepend(d);
  while(qs('#lab-log').children.length>5) qs('#lab-log').lastChild.remove();
}
function spark(){
  const s=document.createElement('div'); s.className='spark';
  s.style.left=(30+Math.random()*40)+'vw'; s.style.top=(18+Math.random()*22)+'vh';
  s.style.setProperty('--tx',(Math.random()*500-250)+'px');
  s.style.setProperty('--ty',(260+Math.random()*240)+'px');
  document.body.appendChild(s); setTimeout(()=>s.remove(),900);
}
async function animateWhile(promise){
  openLab();
  let data,err,done=false;
  promise.then(x=>{data=x;done=true}).catch(e=>{err=e;done=true});
  const start=Date.now();
  const minMs=7600;
  for(let i=1;i<=20;i++){
    const step=steps[Math.min(steps.length-1,Math.floor((i-1)/2))];
    qs('#lab-step').textContent=step;
    qs('#progress-bar').style.width=`${Math.round(i/20*100)}%`;
    log(`pulso ${pad(i)} • ${step}`);
    const cap=qs(`.capsule[data-i="${i}"]`);
    if(cap){cap.classList.add('active'); cap.innerHTML=`<strong>Cenário ${pad(i)}</strong><br>dezenas orbitais sendo puxadas`;}
    for(let k=0;k<3;k++) spark();
    await wait(360);
    if(cap){cap.classList.remove('active');cap.classList.add('done');cap.innerHTML=`<strong>Cenário ${pad(i)}</strong><br>matriz consolidada`;}
  }
  while(!done || Date.now()-start<minMs){qs('#lab-step').textContent='Sincronizando resposta do back-end'; log('conferindo integridade do pacote técnico'); await wait(300);}
  await wait(350); closeLab();
  if(err) throw err; return data;
}

function renderMetrics(m){
  const rows=[['Cenários',m.count],['Soma média',m.avgSum],['Pares médios',m.avgEven],['Baixas médias',m.avgLow],['Overlap médio',m.avgOverlap],['Cobertura',m.coverage+'/25']];
  qs('#metric-wall').innerHTML=rows.map(([a,b])=>`<div class="metric"><small>${a}</small><strong>${b}</strong></div>`).join('');
}
function renderWallet(data){
  latestResponse=data; latestWallet=data.wallet;
  qs('#results').classList.remove('hidden');
  qs('#result-subtitle').textContent=`Fonte: ${data.source} • concursos usados: ${fmt(data.dataset.draws)} • seed ${data.meta.seed} • repetição alvo ${data.meta.targetRepeat}`;
  renderMetrics(data.metrics);
  qs('#wallet-grid').innerHTML=data.wallet.map(g=>`<article class="scenario"><header><div><h3>Cenário ${pad(g.id)}</h3><small>score ${g.score}</small></div><span class="method">${g.method}</span></header><div class="nums">${g.numbers.map(n=>`<span class="num">${pad(n)}</span>`).join('')}</div><div class="profile-line">Soma ${g.profile.sum} • P/I ${g.profile.even}/${g.profile.odd} • B/A ${g.profile.low}/${g.profile.high} • Rep. ${g.profile.repeatFromLast ?? '—'}</div></article>`).join('');
  qs('#engine-report').innerHTML=`<strong>Relatório do motor:</strong><br>O NEXUS CORE combinou os módulos ${data.meta.methods.join(', ')} sobre o dataset selecionado. A saída é experimental e deve ser validada por conferência e backtest antes de qualquer interpretação operacional.<br><br><span class="muted">${escapeHtml(data.disclaimer)}</span>`;
}

function walletText(){return (latestWallet||[]).map(g=>`${pad(g.id)};${g.method};${g.numbers.map(pad).join(' ')};soma=${g.profile.sum};pares=${g.profile.even}`).join('\n');}
function download(name,content,type='text/plain'){
  const blob=new Blob([content],{type}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=name; a.click(); URL.revokeObjectURL(a.href);
}
function exportCsv(){
  if(!latestWallet) return;
  const rows=['id,method,numbers,sum,even,odd,low,high,repeatFromLast,score',...latestWallet.map(g=>[g.id,g.method,`"${g.numbers.map(pad).join(' ')}"`,g.profile.sum,g.profile.even,g.profile.odd,g.profile.low,g.profile.high,g.profile.repeatFromLast??'',g.score].join(','))];
  download('sigma-nexus-cenarios.csv',rows.join('\n'),'text/csv');
}
function exportPdf(){
  if(!latestWallet) return;
  if(!window.jspdf){download('sigma-nexus-relatorio.txt',walletText());return;}
  const {jsPDF}=window.jspdf; const doc=new jsPDF();
  doc.setFont('helvetica','bold'); doc.setFontSize(16); doc.text('SIGMA NEXUS CORE — Relatório analítico',12,14);
  doc.setFont('helvetica','normal'); doc.setFontSize(9); doc.text('Cenários experimentais para auditoria estatística. Sem promessa de acerto.',12,20);
  let y=30;
  for(const g of latestWallet){
    if(y>280){doc.addPage();y=15;}
    doc.setFont('helvetica','bold'); doc.text(`Cenário ${pad(g.id)} • ${g.method}`,12,y);
    doc.setFont('helvetica','normal'); doc.text(g.numbers.map(pad).join('  '),12,y+5);
    doc.text(`Soma ${g.profile.sum} • Pares ${g.profile.even} • Baixas ${g.profile.low} • Score ${g.score}`,12,y+10);
    y+=16;
  }
  doc.save('sigma-nexus-relatorio-analitico.pdf');
}

function renderCheck(data){
  const s=data.summary;
  qs('#check-output').innerHTML=`<h2>Conferência concluída</h2><div class="check-summary"><div class="hit-card"><span>11</span><strong>${s.hits11}</strong></div><div class="hit-card"><span>12</span><strong>${s.hits12}</strong></div><div class="hit-card"><span>13</span><strong>${s.hits13}</strong></div><div class="hit-card"><span>14</span><strong>${s.hits14}</strong></div><div class="hit-card"><span>15</span><strong>${s.hits15}</strong></div></div><p class="muted">Melhor acerto: ${s.bestHit}. Cenários com 13+: ${s.ge13}. Cenários com 14+: ${s.ge14}.</p><table class="check-table"><thead><tr><th>Cenário</th><th>Acertos</th><th>Faixa</th><th>Dezenas acertadas</th></tr></thead><tbody>${data.games.map(g=>`<tr><td>${pad(g.id)}</td><td>${g.hits}</td><td>${g.band}</td><td>${g.hitNumbers.map(pad).join(' ')}</td></tr>`).join('')}</tbody></table>`;
}
function renderBacktest(data){
  const s=data.summary;
  qs('#backtest-output').innerHTML=`<div class="metric-wall"><div class="metric"><small>Testes</small><strong>${s.tests}</strong></div><div class="metric"><small>Média melhor</small><strong>${s.avgBestHit}</strong></div><div class="metric"><small>13+</small><strong>${s.walletsGe13}</strong></div><div class="metric"><small>14+</small><strong>${s.walletsGe14}</strong></div><div class="metric"><small>15</small><strong>${s.wallets15}</strong></div><div class="metric"><small>Máximo</small><strong>${s.bestHitMax}</strong></div></div><p class="muted">${escapeHtml(data.disclaimer)}</p>`;
}

qs('#last-draw').addEventListener('input', syncTextToPad);
qs('#clear-draw-btn').addEventListener('click',()=>{selected.clear();syncPadToText();});
qs('#dataset-file').addEventListener('change',async e=>{
  try{
    const file=e.target.files[0]; uploadedDatasetText=await parseFile(file);
    const j=await api('/api/dataset/validate',{datasetText:uploadedDatasetText});
    qs('#upload-status').innerHTML=`<strong>Dataset personalizado validado</strong><br>${fmt(j.summary.draws)} concursos • ${j.summary.firstContest} → ${j.summary.lastContest}`;
    qs('#dataset-badge').textContent='Dataset personalizado';
  }catch(err){uploadedDatasetText='';qs('#upload-status').textContent=err.message;}
});
qs('#generate-btn').addEventListener('click',async()=>{
  qs('#generate-error').textContent='';
  try{
    const payload={contest:qs('#contest').value,numbers:qs('#last-draw').value,seed:qs('#seed').value,datasetText:uploadedDatasetText};
    const data=await animateWhile(api('/api/generate',payload)); renderWallet(data);
  }catch(e){qs('#generate-error').textContent=e.message; closeLab();}
});
qs('#copy-btn').addEventListener('click',async()=>{if(latestWallet){await navigator.clipboard.writeText(walletText());qs('#copy-btn').textContent='Copiado';setTimeout(()=>qs('#copy-btn').textContent='Copiar',1200);}});
qs('#csv-btn').addEventListener('click',exportCsv); qs('#pdf-btn').addEventListener('click',exportPdf);
qs('#check-btn').addEventListener('click',async()=>{
  qs('#check-error').textContent='';
  try{if(!latestWallet) throw new Error('Gere os cenários antes da conferência.'); const data=await api('/api/check',{wallet:latestWallet,result:qs('#check-result').value}); renderCheck(data);}catch(e){qs('#check-error').textContent=e.message;}
});
qs('#backtest-btn').addEventListener('click',async()=>{qs('#backtest-output').textContent='Rodando backtest no back-end...'; try{renderBacktest(await api('/api/backtest',{limit:200,minHistory:200}));}catch(e){qs('#backtest-output').textContent=e.message;}});

initOrbit(); initPad(); loadDatasetStatus();
