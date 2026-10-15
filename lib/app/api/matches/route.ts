import {getMatches} from "../../../lib/data";
export const dynamic="force-dynamic";
export async function GET(req:Request){
 const d=new URL(req.url).searchParams.get("date")||new Date().toISOString().slice(0,10);
 if(!/^\d{4}-\d{2}-\d{2}$/.test(d))return Response.json({error:"date invalide"},{status:400});
 try{return Response.json(await getMatches(d))}catch(e:any){return Response.json({error:e.message},{status:500})}
}
