"use client";
import {useEffect,useState} from "react";
const css=`body{margin:0;background:#0b1020}
.fp{--card:#141b30;--line:#26304d;--tx:#e8ecf8;--mut:#8f9ac0;--ac:#34d399;--w:#f59e0b;--r:#f87171;--b:#60a5fa;color:var(--tx);font:15px/1.45 system-ui,sans-serif;min-height:100vh}
.fp *{box-sizing:border-box}
.fp header{display:flex;align-items:center;gap:12px;padding:14px 16px;border-bottom:1px solid var(--line);flex-wrap:wrap}
.fp h1{font-size:18px;margin:0 auto 0 0}.fp h1 span{color:var(--ac)}
.fp nav{display:flex;gap:6px}
.fp button,.fp select,.fp input{font:inherit;color:var(--tx);background:var(--card);border:1px solid var(--line);border-radius:8px;padding:7px 11px}
.fp button{cursor:pointer}.fp button.on{background:var(--ac);color:#06241a;border-color:var(--ac);font-weight:600}
.fp main{max-width:1000px;margin:0 auto;padding:14px 16px 40px}
.days{display:flex;gap:6px;overflow-x:auto;padding-bottom:8px}.days button{min-width:62px;flex:none;line-height:1.2}
.filters{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:8px;margin:10px 0 14px}
.grid{display:grid;gap:10px}
.card{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:13px;cursor:pointer}.card:hover{border-color:var(--ac)}
.row{display:flex;justify-content:space-between;align-items:center;gap:8px}
.mut{color:var(--mut);font-size:13px}.teams{font-weight:600;margin:6px 0}
.bar{display:flex;height:9px;border-radius:5px;overflow:hidden;background:var(--line)}.bar i{display:block;height:100%}
.pill{font-size:12px;padding:2px 8px;border-radius:99px;border:1px solid var(--line)}
.hi{color:var(--ac);border-color:var(--ac)}.mid{color:var(--w);border-color:var(--w)}.lo{color:var(--r);border-color:var(--r)}.na{color:var(--mut)}
.sec{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:14px;margin:12px 0}.sec h3{margin:0 0 8px;font-size:15px}
.wrap{overflow-x:auto}table{border-collapse:collapse;font-size:12px}td,th{padding:4px 7px;text-align:center;border:1px solid var(--line)}
.kv{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:8px}.kv div{background:#0b1020;border-radius:8px;padding:8px}.kv b{display:block;font-size:18px}
.two{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:12px}.empty{color:var(--mut);font-style:italic}`;
const pc=(x:number)=>Math.round(x*100)+"%";
const cl=(c:number)=>c>=55?"hi":c>=35?"mid":"lo";
const ymd=(d:Date)=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
const hm=(u:string)=>new Date(u).toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit",timeZone:"Europe/Paris"});
const Bar=({p}:{p:any})=><div className="bar"><i style={{width:p.ph*100+"%",background:"#34d399"}}/><i style={{width:p.pd*100+"%",background:"#8f9ac0"}}/><i style={{width:p.pa*100+"%",background:"#60a5fa"}}/></div>;
export default function Page(){
 const [tab,setTab]=useState("m"),[day,setDay]=useState(0),[q,setQ]=useState(""),[comp,setComp]=useState(""),[slot,setSlot]=useState("");
 const [sel,setSel]=useState<any>(null),[data,setData]=useState<any>(null),[err,setErr]=useState(""),[load,setLoad]=useState(false);
 const days=Array.from({length:7},(_,i)=>{const d=new Date();d.setDate(d.getDate()+i);return d});
 useEffect(()=>{setLoad(true);setErr("");setSel(null);
  fetch("/api/matches?date="+ymd(days[day])).then(r=>r.json()).then(j=>{if(j.error)throw new Error(j.error);setData(j)}).catch(e=>{setErr(e.message);setData(null)}).finally(()=>setLoad(false))},[day]);
 const all:any[]=data?.matches||[];
 const comps=Array.from(new Set(all.map(m=>m.comp)));
 const list=all.filter(m=>(!comp||m.comp===comp)&&(!q||(m.h+m.a).toLowerCase().includes(q.toLowerCase()))&&(!slot||(slot==="a"?Number(hm(m.utc).slice(0,2))<18:Number(hm(m.utc).slice(0,2))>=18)));
 const card=(m:any)=>{const p=m.pred;return <div key={m.id} className="card" onClick={()=>setSel(m)}>
  <div className="row"><span className="mut">{m.comp}</span><span className="mut">{hm(m.utc)}{m.score?" · "+m.score:""}</span></div>
  <div className="teams">{m.h} <span className="mut">vs</span> {m.a}</div>
  {p?<><Bar p={p}/><div className="row mut" style={{marginTop:6}}><span>1 {pc(p.ph)} · N {pc(p.pd)} · 2 {pc(p.pa)}</span><span className={"pill "+cl(p.conf)}>Confiance {p.conf}/100</span></div></>
  :<div className="row"><span className="pill na">Données insuffisantes</span><span className="mut">Aucune probabilité affichée</span></div>}</div>};
 const detail=(m:any)=>{const p=m.pred;return <div>
  <button onClick={()=>setSel(null)}>← Retour</button><h2>{m.h} vs {m.a}</h2>
  <div className="mut">{m.comp} · {hm(m.utc)}{m.hPos?` · ${m.h} ${m.hPos}e, ${m.a} ${m.aPos}e`:""}</div>
  {!p?<div className="sec"><h3>Prédiction</h3><span className="pill na">Données insuffisantes</span><p className="empty">Moins de 5 matchs domicile/extérieur disponibles : aucune probabilité affichée.</p></div>
  :<><div className="sec"><h3>Probabilités estimées</h3><Bar p={p}/>
   <div className="kv" style={{marginTop:10}}><div>Domicile<b>{pc(p.ph)}</b></div><div>Nul<b>{pc(p.pd)}</b></div><div>Extérieur<b>{pc(p.pa)}</b></div><div>Buts attendus<b>{(p.lh+p.la).toFixed(2)}</b></div><div>Plus de 2,5 buts<b>{pc(p.over)}</b></div><div>Les deux marquent<b>{pc(p.btts)}</b></div></div>
   <p>Scores les plus probables : {p.top.map((s:any)=>`${s[0]}-${s[1]} (${pc(s[2])})`).join(" · ")}</p>
   <p>Incertitude : <span className={"pill "+cl(p.conf)}>Confiance {p.conf}/100</span> <span className="mut">Selon la taille de l'échantillon et l'écart entre les issues. Aucune garantie.</span></p></div>
   <div className="sec"><h3>Matrice des scores (domicile en lignes)</h3><div className="wrap"><table><tbody><tr><th></th>{[0,1,2,3,4].map(j=><th key={j}>{j}</th>)}</tr>
   {p.M.map((r:number[],i:number)=><tr key={i}><th>{i}</th>{r.map((v,j)=><td key={j} style={{background:`rgba(52,211,153,${Math.min(.9,v*5)})`}}>{(v*100).toFixed(1)}</td>)}</tr>)}</tbody></table></div></div></>}
  <div className="two"><div className="sec"><h3>Modèle utilisé</h3><p className="mut">Loi de Poisson sur les buts marqués et encaissés à domicile / à l'extérieur (classements réels football-data.org). Le xG, les absences et les confrontations directes ne sont pas encore intégrés.</p></div>
  <div className="sec"><h3>Compositions</h3><p className="empty">Probables et officielles : non disponibles avec cette source.</p></div>
  <div className="sec"><h3>Blessures et suspensions</h3><p className="empty">Non disponibles avec cette source.</p></div>
  <div className="sec"><h3>Joueurs</h3><p className="empty">Stats individuelles non disponibles : aucune probabilité de but affichée.</p></div></div></div>};
 return <div className="fp"><style>{css}</style>
  <header><h1>⚽ Foot<span>Predict</span> AI</h1><nav>{[["m","Matchs"],["f","Fiabilité"],["s","Sources"]].map(t=><button key={t[0]} className={tab===t[0]?"on":""} onClick={()=>{setTab(t[0]);setSel(null)}}>{t[1]}</button>)}</nav></header>
  <main>
  {tab==="f"&&<><div className="sec"><h3>Fiabilité du modèle</h3><div className="kv"><div>Matchs analysés<b>0</b></div><div>1N2 corrects<b>—</b></div><div>Erreur buts (MAE)<b>—</b></div><div>Score de Brier<b>—</b></div></div>
   <p className="empty">Aucune prédiction vérifiée pour l'instant. L'historique horodaté avant match nécessite une base de données (étape suivante). Aucun taux de réussite n'est promis.</p></div></>}
  {tab==="s"&&<div className="sec"><h3>Sources</h3><p>Données : football-data.org (API sous licence, offre gratuite : Ligue des champions, Premier League, Liga, Bundesliga, Serie A, Ligue 1 et autres grandes compétitions). Actualisation toutes les 5 minutes (classements : 1 h).</p></div>}
  {tab==="m"&&(sel?detail(sel):<>
   <div className="days">{days.map((d,i)=><button key={i} className={day===i?"on":""} onClick={()=>setDay(i)}>{d.toLocaleDateString("fr-FR",{weekday:"short",day:"numeric"})}</button>)}</div>
   <div className="filters"><input placeholder="Rechercher une équipe" value={q} onChange={e=>setQ(e.target.value)}/>
    <select value={comp} onChange={e=>setComp(e.target.value)}><option value="">Toutes compétitions</option>{comps.map(c=><option key={c}>{c}</option>)}</select>
    <select value={slot} onChange={e=>setSlot(e.target.value)}><option value="">Toute heure</option><option value="a">Avant 18h</option><option value="b">À partir de 18h</option></select></div>
   {err&&<p style={{color:"#f87171"}}>Erreur source : {err}. Vérifiez la clé FOOTBALL_DATA_TOKEN.</p>}
   <div className="mut" style={{marginBottom:8}}>{load?"Chargement…":`${list.length} match(s) · classés par confiance${data?" · actualisé à "+new Date(data.fetchedAt).toLocaleTimeString("fr-FR",{timeZone:"Europe/Paris"}):""}`}</div>
   <div className="grid">{list.map(card)}{!load&&!err&&!list.length&&<div className="empty">Aucun match couvert par la source ce jour-là. Essayez un autre jour.</div>}</div></>)}
  </main></div>}
