import {predict,Pred,Row} from "./model";
const API="https://api.football-data.org/v4";
async function fd(path:string,rev:number){
 const r=await fetch(API+path,{headers:{"X-Auth-Token":process.env.FOOTBALL_DATA_TOKEN||""},next:{revalidate:rev}});
 if(!r.ok)throw new Error(`football-data ${r.status}`);return r.json();
}
export type Match={id:number;comp:string;utc:string;status:string;h:string;a:string;score:string|null;pred:Pred;hPos?:number;aPos?:number};
export async function getMatches(date:string){
 const m=await fd(`/matches?dateFrom=${date}&dateTo=${date}`,300);
 const codes=[...new Set<string>(m.matches.map((x:any)=>x.competition.code))];
 const st:Record<string,any>={};
 for(const c of codes){try{st[c]=await fd(`/competitions/${c}/standings`,3600)}catch{}}
 const out:Match[]=m.matches.map((x:any)=>{
  const s=st[x.competition.code];const tb=(t:string)=>s?.standings?.find((y:any)=>y.type===t)?.table||[];
  const find=(t:string,id:number)=>tb(t).find((r:any)=>r.team.id===id);
  const row=(r:any):Row|null=>r?{played:r.playedGames,gf:r.goalsFor,ga:r.goalsAgainst}:null;
  const H=row(find("HOME",x.homeTeam.id)),A=row(find("AWAY",x.awayTeam.id));
  const sum=(rows:any[],k:string)=>rows.reduce((u,r)=>u+r[k],0),pl=sum(tb("HOME"),"playedGames");
  const avgH=pl?sum(tb("HOME"),"goalsFor")/pl:0,pa=sum(tb("AWAY"),"playedGames"),avgA=pa?sum(tb("AWAY"),"goalsFor")/pa:0;
  const ft=x.score?.fullTime;
  return{id:x.id,comp:x.competition.name,utc:x.utcDate,status:x.status,h:x.homeTeam.shortName||x.homeTeam.name,a:x.awayTeam.shortName||x.awayTeam.name,
   score:ft?.home!=null?`${ft.home}-${ft.away}`:null,pred:H&&A?predict(H,A,avgH,avgA):null,
   hPos:find("TOTAL",x.homeTeam.id)?.position,aPos:find("TOTAL",x.awayTeam.id)?.position};
 });
 return{matches:out.sort((a,b)=>(b.pred?.conf??-1)-(a.pred?.conf??-1)),fetchedAt:new Date().toISOString()};
}
