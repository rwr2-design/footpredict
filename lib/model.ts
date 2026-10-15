export type Row={played:number;gf:number;ga:number};
export type Pred={ph:number;pd:number;pa:number;lh:number;la:number;top:[number,number,number][];conf:number}|null;
const pois=(l:number,k:number)=>{let p=Math.exp(-l);for(let i=1;i<=k;i++)p*=l/i;return p};
// Poisson sur stats domicile/extérieur réelles. null = données insuffisantes (<5 matchs).
export function predict(h:Row,a:Row,avgH:number,avgA:number):Pred{
 if(h.played<5||a.played<5||!avgH||!avgA)return null;
 const lh=((h.gf/h.played)/avgH)*((a.ga/a.played)/avgH)*avgH;
 const la=((a.gf/a.played)/avgA)*((h.ga/h.played)/avgA)*avgA;
 let ph=0,pd=0,pa=0,t=0;const s:[number,number,number][]=[];
 for(let i=0;i<=8;i++)for(let j=0;j<=8;j++){const p=pois(lh,i)*pois(la,j);t+=p;s.push([i,j,p]);if(i>j)ph+=p;else if(i===j)pd+=p;else pa+=p}
 s.sort((x,y)=>y[2]-x[2]);
 const n=Math.min(h.played,a.played),size=Math.min(1,n/15),dec=Math.min(1,((Math.max(ph,pd,pa)/t-1/3)/(2/3))*1.6);
 return{ph:ph/t,pd:pd/t,pa:pa/t,lh,la,top:s.slice(0,3).map(x=>[x[0],x[1],x[2]/t] as [number,number,number]),conf:Math.round(100*(0.5*size+0.5*dec))};
}
