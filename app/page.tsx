import {getMatches} from "../lib/data";
export const dynamic="force-dynamic";
const pc=(x:number)=>Math.round(x*100)+"%";
export default async function Home({searchParams}:{searchParams:Promise<{date?:string;q?:string}>}){
 const sp=await searchParams;const date=sp.date||new Date().toISOString().slice(0,10);const q=(sp.q||"").toLowerCase();
 let data,err="";try{data=await getMatches(date)}catch(e:any){err=e.message}
 const list=(data?.matches||[]).filter(m=>!q||(m.h+m.a).toLowerCase().includes(q));
 return <main style={{maxWidth:900,margin:"0 auto",padding:16}}>
  <h1 style={{fontSize:20}}>⚽ Foot<span style={{color:"#34d399"}}>Predict</span> AI</h1>
  <form style={{display:"flex",gap:8,flexWrap:"wrap",margin:"12px 0"}}>
   <input type="date" name="date" defaultValue={date}/><input name="q" placeholder="Équipe" defaultValue={sp.q}/><button>Filtrer</button></form>
  {err&&<p style={{color:"#f87171"}}>Erreur source de données : {err}. Vérifiez FOOTBALL_DATA_TOKEN.</p>}
  {data&&<p style={{color:"#8f9ac0",fontSize:13}}>{list.length} match(s) · données actualisées à {new Date(data.fetchedAt).toLocaleTimeString("fr-FR",{timeZone:"Europe/Paris"})} · source : football-data.org · classés par confiance</p>}
  {list.map(m=><div key={m.id} style={{background:"#141b30",border:"1px solid #26304d",borderRadius:12,padding:13,margin:"10px 0"}}>
   <div style={{display:"flex",justifyContent:"space-between",color:"#8f9ac0",fontSize:13}}><span>{m.comp}</span><span>{new Date(m.utc).toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit",timeZone:"Europe/Paris"})}{m.score&&` · ${m.score}`}</span></div>
   <div style={{fontWeight:600,margin:"6px 0"}}>{m.h} {m.hPos&&`(${m.hPos}e)`} vs {m.a} {m.aPos&&`(${m.aPos}e)`}</div>
   {m.pred?<><div style={{display:"flex",height:9,borderRadius:5,overflow:"hidden",background:"#26304d"}}><i style={{width:m.pred.ph*100+"%",background:"#34d399"}}/><i style={{width:m.pred.pd*100+"%",background:"#8f9ac0"}}/><i style={{width:m.pred.pa*100+"%",background:"#60a5fa"}}/></div>
    <div style={{color:"#8f9ac0",fontSize:13,marginTop:6}}>1 {pc(m.pred.ph)} · N {pc(m.pred.pd)} · 2 {pc(m.pred.pa)} · buts attendus {(m.pred.lh+m.pred.la).toFixed(2)} · scores probables {m.pred.top.map(s=>`${s[0]}-${s[1]}`).join(", ")} · confiance {m.pred.conf}/100</div></>
   :<div style={{color:"#8f9ac0",fontSize:13}}>Données insuffisantes : aucune probabilité affichée.</div>}
  </div>)}
  {data&&!list.length&&<p>Aucun match couvert par la source pour cette date.</p>}
  <p style={{color:"#8f9ac0",fontSize:12}}>Estimations statistiques (modèle de Poisson), sans garantie. Compositions, blessures et stats joueurs : non disponibles avec l'offre gratuite.</p>
 </main>}
