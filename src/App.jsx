import { useState, useRef, useEffect, createContext, useContext } from "react";

const ThemeCtx = createContext(null);
const useTheme = () => useContext(ThemeCtx);

const STORE_KEY = "_rs8_data";
const _loadStore = () => { try { return JSON.parse(localStorage.getItem(STORE_KEY)||"{}"); } catch { return {}; } };
const _saveStore = (s) => { try { localStorage.setItem(STORE_KEY, JSON.stringify(s)); } catch {} };
if (!window._rs8) window._rs8 = _loadStore();
const DB = {
  get:(k,fb=null)=>{try{const v=window._rs8[k];return v!==undefined?JSON.parse(v):fb;}catch{return fb;}},
  set:(k,v)=>{window._rs8[k]=JSON.stringify(v);_saveStore(window._rs8);},
  del:(k)=>{delete window._rs8[k];_saveStore(window._rs8);},
};

const ICDR=[
  {level:0,label:"Aucun signe",color:"#30d158",bg:"rgba(48,209,88,0.12)",emoji:"✅",advice:"Votre rétine semble saine. Continuez vos contrôles annuels."},
  {level:1,label:"Atteinte légère",color:"#ffd60a",bg:"rgba(255,214,10,0.12)",emoji:"🟡",advice:"Micro-anévrismes détectés. Contrôle ophtalmologique dans 12 mois."},
  {level:2,label:"Atteinte modérée",color:"#ff9f0a",bg:"rgba(255,159,10,0.12)",emoji:"🟠",advice:"Lésions modérées. Consultez un ophtalmologue sous 6 mois."},
  {level:3,label:"Atteinte sévère",color:"#ff453a",bg:"rgba(255,69,58,0.12)",emoji:"🔴",advice:"Atteinte sévère. Consultation ophtalmologique urgente."},
  {level:4,label:"Forme proliférante",color:"#bf5af2",bg:"rgba(191,90,242,0.12)",emoji:"🚨",advice:"URGENCE. Consultez un ophtalmologue immédiatement."},
];

const SNELLEN=[
  {f:"1/10", size:52,row:"E F"},
  {f:"3/10", size:40,row:"F P Z"},
  {f:"5/10", size:30,row:"E D F C"},
  {f:"7/10", size:24,row:"P E C F D"},
  {f:"8/10", size:20,row:"L P E D"},
  {f:"9/10", size:17,row:"T O Z"},
  {f:"10/10",size:14,row:"E F P"},
];

const PARINAUD=[
  {p:"P14", label:"Très grands caractères",  size:34, text:"Vision de loin."},
  {p:"P8",  label:"Grands caractères",        size:24, text:"Consultez un ophtalmologue."},
  {p:"P6",  label:"Caractères normaux",       size:19, text:"La glycémie doit rester bien équilibrée."},
  {p:"P4",  label:"Lecture standard",         size:15, text:"Contrôle ophtalmologique annuel obligatoire."},
  {p:"P3",  label:"Texte courant fin",        size:12, text:"Le dépistage précoce permet de sauver la vision."},
  {p:"P2",  label:"Petits caractères",        size:10, text:"La rétinopathie évolue silencieusement sans symptômes."},
  {p:"P1.5",label:"Très petits caractères",  size:8,  text:"Le fond de l'œil est examiné à la lampe à fente."},
];

const FAQ=[
  {keys:["retinopathie","rd","rétine"],a:"La rétinopathie diabétique est une complication du diabète touchant les vaisseaux rétiniens. Elle évolue silencieusement avant d'affecter la vision."},
  {keys:["icdr","score","niveau"],a:"L'ICDR classe la rétinopathie de 0 (absence) à 4 (forme proliférante). Chaque stade nécessite un suivi adapté."},
  {keys:["traitement","laser","vegf","vitrectomie"],a:"Traitements selon le stade : laser pan-rétinien (PPR), injections anti-VEGF (Ranibizumab, Aflibercept), ou vitrectomie."},
  {keys:["glycemie","hba1c","sucre","diabete"],a:"Cible HbA1c < 7%. Glycémie à jeun : 0,70–1,26 g/L. Post-prandiale < 1,60 g/L (HAS 2024)."},
  {keys:["depistage","frequence","fond"],a:"Fond d'œil annuel obligatoire en cas de diabète, même sans symptôme. Dès le diagnostic pour le type 2, après 5 ans pour le type 1."},
  {keys:["prevention","prevenir","proteger"],a:"Contrôle glycémique strict (HbA1c < 7%), pression artérielle < 130/80 mmHg, arrêt du tabac, et suivi ophtalmologique annuel."},
  {keys:["donnees","securite","rgpd","confidentiel"],a:"Vos photos ne sont jamais stockées sur nos serveurs. Seules les métadonnées anonymisées sont conservées avec votre consentement. RGPD Art. 9.2.j."},
  {keys:["salut","bonjour","bonsoir","hello"],a:"Bonjour ! Je suis l'assistant RetinaScore. Je peux répondre à vos questions sur la rétinopathie diabétique, la glycémie, l'acuité visuelle ou l'application."},
];

const DARK={isDark:true,bg:"transparent",bg2:"rgba(28,28,30,0.88)",bg3:"rgba(44,44,46,0.82)",bg4:"#3a3a3c",text:"#ffffff",text2:"rgba(235,235,245,0.85)",text3:"#8e8e93",text4:"#48484a",border:"rgba(255,255,255,0.08)",glass:"rgba(255,255,255,0.07)",glassBorder:"rgba(255,255,255,0.16)",glassHigh:"rgba(255,255,255,0.10)",glassShadow:"0 8px 32px rgba(0,0,0,0.5),inset 0 1px 0 rgba(255,255,255,0.14)",sf:"'SF Pro Display',-apple-system,BlinkMacSystemFont,system-ui,sans-serif",sm:"'SF Pro Text',-apple-system,BlinkMacSystemFont,system-ui,sans-serif"};
const LIGHT={isDark:false,bg:"transparent",bg2:"rgba(255,255,255,0.82)",bg3:"rgba(242,242,247,0.78)",bg4:"#e5e5ea",text:"#000000",text2:"#1c1c1e",text3:"#636366",text4:"#aeaeb2",border:"rgba(0,0,0,0.07)",glass:"rgba(255,255,255,0.60)",glassBorder:"rgba(255,255,255,0.88)",glassHigh:"rgba(255,255,255,0.78)",glassShadow:"0 8px 32px rgba(0,0,0,0.10),inset 0 1px 0 rgba(255,255,255,0.95)",sf:"'SF Pro Display',-apple-system,BlinkMacSystemFont,system-ui,sans-serif",sm:"'SF Pro Text',-apple-system,BlinkMacSystemFont,system-ui,sans-serif"};

// ── Ring SVG ──────────────────────────────────────────────────
function Ring({size=130,sw=12,progress=0,color,delay=0}){
  const r=(size-sw)/2, circ=2*Math.PI*r;
  const [go,setGo]=useState(false);
  useEffect(()=>{const tid=setTimeout(()=>setGo(true),delay+80);return()=>clearTimeout(tid);},[delay]);
  const offset=circ*(1-Math.min(Math.max(progress,0),1));
  return(
    <svg width={size} height={size} style={{transform:"rotate(-90deg)",display:"block"}}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color+"28"} strokeWidth={sw}/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={sw}
        strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={go?offset:circ}
        style={{transition:`stroke-dashoffset 1.2s cubic-bezier(.4,0,.2,1) ${delay}ms`,filter:`drop-shadow(0 0 5px ${color}99)`}}/>
    </svg>
  );
}

function TripleRings({rings,size=150}){
  const sw=13,gap=5;
  return(
    <div style={{position:"relative",width:size,height:size,flexShrink:0}}>
      {rings.map((r,i)=>{
        const s=size-i*(sw+gap)*2, off=i*(sw+gap);
        return <div key={i} style={{position:"absolute",top:off,left:off}}><Ring size={s} sw={sw} progress={r.prog} color={r.color} delay={i*150}/></div>;
      })}
    </div>
  );
}

// ── Shared UI ─────────────────────────────────────────────────
function Card({children,style={},onClick}){
  const t=useTheme();
  return(
    <div onClick={onClick} style={{
      background:t.glass,
      backdropFilter:"blur(24px) saturate(1.8)",
      WebkitBackdropFilter:"blur(24px) saturate(1.8)",
      borderRadius:20,padding:"14px 16px",
      border:`1px solid ${t.glassBorder}`,
      boxShadow:t.glassShadow,
      cursor:onClick?"pointer":"default",...style
    }}>{children}</div>
  );
}

function SecTitle({children,mt=22}){
  const t=useTheme();
  return <div style={{color:t.text,fontSize:20,fontWeight:700,fontFamily:t.sf,letterSpacing:-.4,marginTop:mt,marginBottom:10}}>{children}</div>;
}

function PrimaryBtn({label,onClick,color="#0a84ff",disabled=false,style={}}){
  const t=useTheme();
  return(
    <button onClick={onClick} disabled={disabled} style={{
      width:"100%",padding:"14px 0",borderRadius:14,border:"none",
      background:disabled?t.bg3:color,
      color:disabled?t.text4:"#fff",
      fontSize:16,fontWeight:700,fontFamily:t.sm,
      cursor:disabled?"not-allowed":"pointer",
      boxShadow:disabled?"none":`0 4px 18px ${color}44`,
      transition:"all .18s",...style
    }}>{label}</button>
  );
}

function FIn({label,value,onChange,placeholder,type="text",inputMode}){
  const t=useTheme();
  return(
    <div style={{marginBottom:10}}>
      {label&&<div style={{color:t.text3,fontSize:11,fontWeight:600,textTransform:"uppercase",letterSpacing:.6,marginBottom:5,fontFamily:t.sm}}>{label}</div>}
      <input value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} type={type} inputMode={inputMode}
        style={{width:"100%",background:t.bg3,border:`1px solid ${t.bg4}`,borderRadius:12,padding:"12px 14px",color:t.text,fontSize:15,fontFamily:t.sm,outline:"none"}}/>
    </div>
  );
}

function InfoBox({color,text,icon="💡"}){
  return(
    <div style={{background:color+"14",borderRadius:12,padding:"10px 13px",border:`1px solid ${color}28`,display:"flex",gap:8,alignItems:"flex-start",marginBottom:12}}>
      <span style={{fontSize:13,flexShrink:0,marginTop:1}}>{icon}</span>
      <div style={{color,fontSize:12,lineHeight:1.5}}>{text}</div>
    </div>
  );
}

function BackBtn({onBack,label="Retour"}){
  return(
    <button onClick={onBack} style={{background:"none",border:"none",color:"#0a84ff",fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",gap:4,padding:0,marginBottom:14}}>
      <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#0a84ff" strokeWidth={2.5} strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>{label}
    </button>
  );
}

function Spark({values,color}){
  if(!values||values.length<2) return null;
  const w=56,h=28,mn=Math.min(...values)-.1,mx=Math.max(...values)+.1;
  const pts=values.map((v,i)=>`${2+(i/(values.length-1))*(w-4)},${h-2-((v-mn)/(mx-mn))*(h-4)}`).join(" ");
  return <svg width={w} height={h}><polyline points={pts} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/></svg>;
}


// ── Tab Bar ────────────────────────────────────────────────────
function TabBar({tab,set}){
  const t=useTheme();
  const [pressed,setPressed]=useState(null);
  const tColor={home:"#30d158",scan:"#0a84ff",history:"#ff9f0a",chat:"#ff9f0a",profile:"#8e8e93"};
  const tabs=[{id:"home",label:"Résumé"},{id:"scan",label:"Dépistage"},{id:"history",label:"Historique"},{id:"chat",label:"Assistant"},{id:"profile",label:"Profil"}];
  const icons={
    home:<svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/></svg>,
    scan:<svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round"><path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2"/><circle cx={12} cy={12} r={3}/></svg>,
    history:<svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round"><circle cx={12} cy={12} r={9}/><path d="M12 7v5l3 3"/></svg>,
    chat:<svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
    profile:<svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx={12} cy={7} r={4}/></svg>,
  };
  return(
    <div style={{
      position:"fixed",bottom:0,left:0,right:0,zIndex:999,
      background:t.isDark?"rgba(8,8,12,0.72)":"rgba(248,248,252,0.78)",
      backdropFilter:"blur(32px) saturate(2.2)",
      WebkitBackdropFilter:"blur(32px) saturate(2.2)",
      borderTop:`1px solid ${t.glassBorder}`,
      boxShadow:t.isDark?"0 -1px 0 rgba(255,255,255,0.06),0 -8px 24px rgba(0,0,0,0.3)":"0 -1px 0 rgba(0,0,0,0.05),0 -8px 24px rgba(0,0,0,0.06)",
      paddingBottom:"env(safe-area-inset-bottom, 0px)",
    }}>
      <div style={{display:"flex",maxWidth:430,margin:"0 auto"}}>
        {tabs.map(tb=>{
          const active=tab===tb.id;
          const color=tColor[tb.id];
          const isPressed=pressed===tb.id;
          return(
            <button key={tb.id}
              onPointerDown={()=>setPressed(tb.id)}
              onPointerUp={()=>{setPressed(null);set(tb.id);}}
              onPointerLeave={()=>setPressed(null)}
              style={{flex:1,border:"none",background:"transparent",cursor:"pointer",
                display:"flex",flexDirection:"column",alignItems:"center",gap:2,
                padding:"8px 0 10px",WebkitTapHighlightColor:"transparent",outline:"none",
                transform:isPressed?"scale(0.85)":"scale(1)",
                transition:"transform 0.1s ease",
              }}
            >
              <div style={{
                color:active?color:t.text4,
                display:"flex",alignItems:"center",justifyContent:"center",
                marginBottom:1,
              }}>
                {icons[tb.id]}
              </div>
              <span style={{
                fontSize:10,fontFamily:t.sm,
                color:active?color:t.text4,
                fontWeight:active?600:400,
              }}>{tb.label}</span>
              {active&&<div style={{width:16,height:2,borderRadius:1,background:color,marginTop:2}}/>}
            </button>
          );
        })}
      </div>
    </div>
  );
}


// ── HOME ──────────────────────────────────────────────────────
function HomeScreen({user,scans,glycLogs,onNavigate,onGoGlyc,onGoVision,onGoRDV}){
  const t=useTheme();
  const now=new Date();
  const h=now.getHours();
  const greet=h<12?"Bonjour":h<18?"Bon après-midi":"Bonsoir";
  const name=user?.name?.split(" ")[0]||null;
  const last=scans[0];
  const lastLevel=last?.icdr_level??null;
  const daysSince=last?Math.floor((Date.now()-new Date(last.date))/86400000):null;
  const rdvList=DB.get("rdvs",[]);
  const today=new Date().toISOString().slice(0,10);
  const nextRdv=rdvList.filter(r=>r.date>=today).sort((a,b)=>a.date.localeCompare(b.date))[0];
  const daysUntilRdv=nextRdv?Math.ceil((new Date(nextRdv.date+"T12:00")-Date.now())/(86400000)):null;
  const daysUntilScan=daysSince!=null?Math.max(0,365-daysSince):null;
  const daysUntil=daysUntilRdv??daysUntilScan;
  const rdvProg=daysUntil!=null?Math.max(0,Math.min(1,1-daysUntil/365)):0;
  const todayKey=now.toISOString().slice(0,10);
  const todayG=glycLogs.filter(g=>g.date===todayKey);
  const avgG=todayG.length?todayG.reduce((a,g)=>a+g.value,0)/todayG.length:null;
  const lastVision=DB.get("last_vision",null);
  const rings=[
    {prog:rdvProg,color:"#ff375f",label:"Prochain RDV",value:daysUntil!=null?daysUntil+"j":"—",unit:nextRdv?nextRdv.type:"avant prochain FO"},
    {prog:avgG?Math.max(0,1-Math.abs(avgG-1.0)/0.8):0,color:"#30d158",label:"Glycémie",value:avgG?avgG.toFixed(2):"—",unit:"g/L aujourd'hui"},
    {prog:lastVision?parseFloat(lastVision):0,color:"#0a84ff",label:"Acuité visuelle",value:lastVision||"—",unit:"dernier Snellen"},
  ];
  const dateStr=now.toLocaleDateString("fr-FR",{weekday:"long",day:"numeric",month:"long"});
  return(
    <div style={{padding:"0 16px",background:"transparent",minHeight:"100%",paddingBottom:140}}>
      {/* Header */}
      <div style={{paddingTop:56,paddingBottom:4}} className="fade-up">
        <div style={{color:t.text3,fontSize:13,fontFamily:t.sm}}>{dateStr.charAt(0).toUpperCase()+dateStr.slice(1)}</div>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:2}}>
          <div style={{color:t.text,fontSize:32,fontWeight:700,letterSpacing:-.8,fontFamily:t.sf}}>{greet}{name?", "+name:""}</div>
          <button onClick={()=>onNavigate("settings")} style={{width:36,height:36,borderRadius:"50%",background:t.bg2,border:`1px solid ${t.border}`,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>
            <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={t.text3} strokeWidth={1.8} strokeLinecap="round">
              <circle cx={12} cy={12} r={3}/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
          </button>
        </div>
      </div>
      {/* Activity rings card */}
      <Card style={{marginTop:14}} className="fade-up-1">
        <div style={{color:t.text,fontSize:15,fontWeight:600,fontFamily:t.sf,marginBottom:14}}>Suivi de santé</div>
        <div style={{display:"flex",gap:14,alignItems:"center"}}>
          <TripleRings rings={rings} size={148}/>
          <div style={{flex:1,display:"flex",flexDirection:"column",gap:13}}>
            {rings.map((r,i)=>(
              <div key={i} style={{display:"flex",gap:8,alignItems:"flex-start"}}>
                <div style={{width:9,height:9,borderRadius:"50%",background:r.color,marginTop:4,flexShrink:0,boxShadow:`0 0 7px ${r.color}`}}/>
                <div>
                  <div style={{color:t.text3,fontSize:10,fontFamily:t.sm}}>{r.label}</div>
                  <div style={{color:r.color,fontSize:18,fontWeight:700,fontFamily:t.sf,letterSpacing:-.4,lineHeight:1.1}}>{r.value}<span style={{fontSize:10,color:t.text4,fontWeight:400,marginLeft:3}}>{r.unit}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
      {/* Last scan result */}
      {lastLevel!=null&&(
        <div style={{background:ICDR[lastLevel].bg,borderRadius:18,padding:"14px 16px",marginTop:12,border:`1px solid ${ICDR[lastLevel].color}33`}} className="fade-up-2">
          <div style={{color:ICDR[lastLevel].color,fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:1,fontFamily:t.sm,marginBottom:7}}>Dernier résultat rétinien</div>
          <div style={{display:"flex",alignItems:"center",gap:11,marginBottom:8}}>
            <span style={{fontSize:32}}>{ICDR[lastLevel].emoji}</span>
            <div>
              <div style={{color:t.text,fontSize:18,fontWeight:700,fontFamily:t.sf}}>{ICDR[lastLevel].label}</div>
              <div style={{color:t.text3,fontSize:12,fontFamily:t.sm}}>{new Date(last.date).toLocaleDateString("fr-FR",{day:"numeric",month:"long",year:"numeric"})}</div>
            </div>
          </div>
          <div style={{display:"flex",gap:3,marginBottom:9}}>{ICDR.map((_,i)=><div key={i} style={{flex:1,height:4,borderRadius:2,background:i<=lastLevel?ICDR[lastLevel].color:t.bg4}}/>)}</div>
          <div style={{color:t.text2,fontSize:13,fontFamily:t.sm,lineHeight:1.55}}>{ICDR[lastLevel].advice}</div>
          {lastLevel>=3&&<a href="https://www.doctolib.fr/ophtalmologue" target="_blank" rel="noopener noreferrer" style={{display:"block",textDecoration:"none",width:"100%",marginTop:10,padding:"11px 0",borderRadius:12,border:"none",background:"#ff453a",color:"#fff",fontSize:14,fontWeight:700,fontFamily:t.sm,textAlign:"center"}}>🏥 Prendre RDV ophtalmologue →</a>}
        </div>
      )}
      {/* Glycemia quick card */}
      <Card style={{marginTop:12}} onClick={onGoGlyc} className="fade-up-2">
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div>
            <div style={{color:"#30d158",fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:1,fontFamily:t.sm,marginBottom:5}}>Glycémie aujourd'hui</div>
            {avgG!=null
              ?<div style={{display:"flex",alignItems:"baseline",gap:6}}><span style={{color:t.text,fontSize:26,fontWeight:700,fontFamily:t.sf}}>{avgG.toFixed(2)}</span><span style={{color:t.text3,fontSize:13,fontFamily:t.sm}}>g/L · {todayG.length} mesure{todayG.length>1?"s":""}</span></div>
              :<div style={{color:t.text3,fontSize:14,fontFamily:t.sm}}>Appuyez pour ajouter</div>}
          </div>
          <div style={{display:"flex",gap:10,alignItems:"center"}}>
            {todayG.length>=2&&<Spark values={todayG.map(g=>g.value)} color="#30d158"/>}
            <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={t.text3} strokeWidth={2.5} strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
          </div>
        </div>
      </Card>
      {/* Quick stats grid */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:12}} className="fade-up-3">
        {[["📊","Analyses",String(scans.length),"total","#ff375f",null],["👓","Acuité",lastVision||"—","Snellen","#0a84ff",onGoVision],["💉","Mesures",String(glycLogs.length),"glycémie","#30d158",onGoGlyc],["📅","Prochain FO",daysUntil!=null?daysUntil+"j":"—","fond d'œil","#ffd60a",onGoRDV]].map(([ico,lbl,val,sub,color,action])=>(
          <Card key={lbl} style={{padding:"12px 13px",cursor:action?"pointer":"default"}} onClick={action||undefined}>
            <div style={{fontSize:20,marginBottom:5}}>{ico}</div>
            <div style={{color:t.text3,fontSize:10,fontFamily:t.sm,marginBottom:1}}>{lbl}</div>
            <div style={{color:color,fontSize:22,fontWeight:700,fontFamily:t.sf,letterSpacing:-.4}}>{val}</div>
            <div style={{color:t.text4,fontSize:10,fontFamily:t.sm,marginTop:1}}>{sub}</div>
          </Card>
        ))}
      </div>
      {!user&&<Card style={{marginTop:12,display:"flex",alignItems:"center",gap:12}}>
        <span style={{fontSize:22}}>👤</span>
        <div style={{flex:1}}><div style={{color:t.text,fontSize:13,fontWeight:600,fontFamily:t.sm}}>Mode invité</div><div style={{color:t.text3,fontSize:11,fontFamily:t.sm,marginTop:1}}>Créez un compte pour tout sauvegarder.</div></div>
        <button onClick={()=>onNavigate("auth")} style={{background:"#0a84ff",border:"none",borderRadius:10,padding:"7px 12px",color:"#fff",fontSize:12,fontWeight:600,fontFamily:t.sm,cursor:"pointer"}}>Créer</button>
      </Card>}
    </div>
  );
}


// ── GLYCEMIA ──────────────────────────────────────────────────
function GlycChart({data}){
  const svgW=300,h=100;
  const vals=data.map(d=>d.avg);
  const mn=Math.min(...vals,.6),mx=Math.max(...vals,1.8);
  const pts=data.map((d,i)=>({x:6+(i/Math.max(data.length-1,1))*(svgW-12),y:6+((mx-d.avg)/(mx-mn+.001))*(h-12)}));
  const pathD=pts.map((p,i)=>`${i===0?"M":"L"}${p.x},${p.y}`).join(" ");
  const areaD=pathD+` L${pts[pts.length-1].x},${h} L${pts[0].x},${h} Z`;
  const tY1=6+((mx-1.26)/(mx-mn+.001))*(h-12);
  const tY2=6+((mx-.7)/(mx-mn+.001))*(h-12);
  return(
    <svg viewBox={`0 0 ${svgW} ${h}`} style={{width:"100%",height:h}}>
      <defs><linearGradient id="gg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#30d158" stopOpacity=".3"/><stop offset="100%" stopColor="#30d158" stopOpacity="0"/></linearGradient></defs>
      <rect x={0} y={tY1} width={svgW} height={tY2-tY1} fill="rgba(52,199,89,.07)" rx={2}/>
      <path d={areaD} fill="url(#gg)"/><path d={pathD} fill="none" stroke="#30d158" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
      {pts.map((p,i)=><circle key={i} cx={p.x} cy={p.y} r={3} fill="#30d158"/>)}
    </svg>
  );
}

function GlycRow({g,color,t,showDate=false}){
  return(
    <div style={{background:t.bg2,borderRadius:14,padding:"11px 13px",marginBottom:8,border:`1px solid ${t.border}`,display:"flex",alignItems:"center",gap:11}}>
      <div style={{width:36,height:36,borderRadius:10,background:color+"18",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
        <div style={{width:10,height:10,borderRadius:"50%",background:color,boxShadow:`0 0 6px ${color}`}}/>
      </div>
      <div style={{flex:1}}>
        <div style={{color:t.text,fontSize:14,fontWeight:600,fontFamily:t.sm}}>{g.moment==="Couche"?"Couché":g.moment}{showDate&&<span style={{color:t.text4,fontWeight:400,fontSize:12}}> · {g.date}</span>}</div>
        {g.note&&<div style={{color:t.text3,fontSize:12,fontFamily:t.sm,marginTop:1}}>{g.note}</div>}
      </div>
      <div><span style={{color,fontSize:18,fontWeight:700,fontFamily:t.sf}}>{g.value.toFixed(2)}</span><span style={{color:t.text4,fontSize:11}}> g/L</span></div>
    </div>
  );
}

function GlycemiaScreen({glycLogs,onSave,onBack}){
  const t=useTheme();
  const [view,setView]=useState("chart");
  const [form,setForm]=useState({moment:"Matin",value:"",note:"",date:new Date().toISOString().slice(0,10)});
  const [err,setErr]=useState("");
  const TARGETS={Matin:[.7,1.26],Midi:[.7,1.6],Soir:[.7,1.6],Couche:[.7,1.4],Autre:[.7,1.6]};
  const getColor=(val,mom)=>{const [lo,hi]=TARGETS[mom]||TARGETS.Autre;if(val<lo||val>hi) return"#ff453a";if(val>hi*.9) return"#ffd60a";return"#30d158";};
  const handleAdd=()=>{
    const v=parseFloat(form.value.replace(",","."));
    if(isNaN(v)||v<.5||v>4){setErr("Valeur entre 0.5 et 4.0 g/L");return;}
    const isToday=form.date===new Date().toISOString().slice(0,10);
    const time=isToday?new Date().toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit"}):"—";
    onSave({id:Date.now().toString(),date:form.date,time,moment:form.moment,value:v,note:form.note});
    setForm(f=>({...f,value:"",note:"",date:new Date().toISOString().slice(0,10)}));setErr("");setView("chart");
  };
  const dates=[...new Set(glycLogs.map(g=>g.date))].sort().slice(-14);
  const chartData=dates.map(d=>{const dl=glycLogs.filter(g=>g.date===d);return{date:d,avg:dl.reduce((a,g)=>a+g.value,0)/dl.length};});
  const todayStr=new Date().toISOString().slice(0,10);
  return(
    <div style={{padding:"0 16px",background:"transparent",minHeight:"100%",paddingBottom:140}}>
      <div style={{paddingTop:56}}>
        <BackBtn onBack={onBack} label="Résumé"/>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
          <div style={{color:t.text,fontSize:30,fontWeight:700,letterSpacing:-.8,fontFamily:t.sf}}>Glycémie</div>
          <button onClick={()=>setView(view==="add"?"chart":"add")} style={{background:view==="add"?t.bg3:"#0a84ff",border:"none",borderRadius:20,padding:"7px 15px",color:view==="add"?t.text3:"#fff",fontSize:14,fontWeight:600,fontFamily:t.sm,cursor:"pointer"}}>{view==="add"?"Annuler":"+ Ajouter"}</button>
        </div>
        {view!=="add"&&<div style={{display:"flex",background:t.bg2,borderRadius:12,padding:3,marginBottom:14,border:`1px solid ${t.border}`}}>
          {[["chart","Courbe"],["table","Tableau"]].map(([v,l])=>(
            <button key={v} onClick={()=>setView(v)} style={{flex:1,padding:"8px 0",borderRadius:10,border:"none",cursor:"pointer",fontSize:13,fontWeight:600,background:view===v?t.bg4:"transparent",color:view===v?t.text:t.text3,fontFamily:t.sm,transition:"all .18s"}}>{l}</button>
          ))}
        </div>}
      </div>
      {view==="add"&&<Card className="fade-up">
        <div style={{color:t.text,fontSize:16,fontWeight:600,fontFamily:t.sf,marginBottom:12}}>Nouvelle mesure</div>
        <div style={{marginBottom:12}}>
          <div style={{color:t.text3,fontSize:11,fontWeight:600,textTransform:"uppercase",letterSpacing:.6,marginBottom:6,fontFamily:t.sm}}>Moment</div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
            {["Matin","Midi","Soir","Couche","Autre"].map(m=>(
              <button key={m} onClick={()=>setForm(f=>({...f,moment:m}))} style={{padding:"6px 13px",borderRadius:20,border:"none",cursor:"pointer",fontFamily:t.sm,fontSize:13,fontWeight:600,background:form.moment===m?"#0a84ff":t.bg3,color:form.moment===m?"#fff":t.text3,transition:"all .18s"}}>{m==="Couche"?"Couché":m}</button>
            ))}
          </div>
        </div>
        <FIn label="Glycémie (g/L)" value={form.value} onChange={v=>setForm(f=>({...f,value:v}))} placeholder="ex: 1.10" inputMode="decimal"/>
        <FIn label="Date (si oubli)" value={form.date} onChange={v=>setForm(f=>({...f,date:v}))} type="date"/>
        <FIn label="Note (optionnel)" value={form.note} onChange={v=>setForm(f=>({...f,note:v}))} placeholder="ex: après repas léger"/>
        <InfoBox color="#0a84ff" text={form.moment==="Matin"?"Cible à jeun : 0.70–1.26 g/L (HAS 2024)":"Cible post-prandiale : 0.70–1.60 g/L (HAS 2024)"} icon="🎯"/>
        {err&&<div style={{color:"#ff453a",fontSize:13,fontFamily:t.sm,marginBottom:10}}>{err}</div>}
        <PrimaryBtn label="Enregistrer" onClick={handleAdd}/>
      </Card>}
      {view==="chart"&&<div className="fade-up">
        {chartData.length===0
          ?<Card style={{textAlign:"center",padding:44}}><div style={{fontSize:40,marginBottom:12}}>💉</div><div style={{color:t.text,fontSize:16,fontWeight:600,fontFamily:t.sf,marginBottom:6}}>Aucune mesure</div><div style={{color:t.text3,fontSize:13,fontFamily:t.sm}}>Appuyez sur + Ajouter.</div></Card>
          :<>
            <Card style={{marginBottom:12}}>
              <div style={{color:t.text,fontSize:13,fontWeight:600,fontFamily:t.sf,marginBottom:12}}>14 derniers jours</div>
              <GlycChart data={chartData}/>
              <div style={{display:"flex",justifyContent:"space-between",marginTop:6}}>
                {[chartData[0],chartData[chartData.length-1]].map((d,i)=><span key={i} style={{color:t.text4,fontSize:10,fontFamily:t.sm}}>{new Date(d.date+"T12:00").toLocaleDateString("fr-FR",{day:"numeric",month:"short"})}</span>)}
              </div>
            </Card>
            <SecTitle mt={0}>Aujourd'hui</SecTitle>
            {glycLogs.filter(g=>g.date===todayStr).length===0
              ?<div style={{color:t.text3,fontSize:13,fontFamily:t.sm}}>Aucune mesure aujourd'hui.</div>
              :glycLogs.filter(g=>g.date===todayStr).map(g=><GlycRow key={g.id} g={g} color={getColor(g.value,g.moment)} t={t}/>)
            }
          </>
        }
      </div>}
      {view==="table"&&<div className="fade-up">
        {glycLogs.length===0
          ?<Card style={{textAlign:"center",padding:44}}><div style={{color:t.text3,fontSize:13,fontFamily:t.sm}}>Aucune mesure.</div></Card>
          :[...glycLogs].reverse().map(g=><GlycRow key={g.id} g={g} color={getColor(g.value,g.moment)} t={t} showDate/>)
        }
      </div>}
      <InfoBox color="#ffd60a" text="Ne modifiez jamais votre traitement sans avis médical. Valeurs indicatives." icon="⚠️"/>
    </div>
  );
}


// ── SCAN ──────────────────────────────────────────────────────
function ScanScreen({user,onDone}){
  const t=useTheme();
  const [step,setStep]=useState("pick");
  const [img,setImg]=useState(null);
  const [b64,setB64]=useState(null);
  const [res,setRes]=useState(null);
  const [err,setErr]=useState("");
  const [elapsed,setElapsed]=useState(null);
  const fileRef=useRef();
  const camRef=useRef();
  const load=f=>{
    if(!f) return;
    const r=new FileReader();
    r.onload=e=>{setImg(e.target.result);setB64(e.target.result.split(",")[1]);setStep("preview");};
    r.readAsDataURL(f);
  };
  const analyzeLocal=async()=>{
    const resp=await fetch("http://localhost:8000/analyze",{
      method:"POST",headers:{"Content-Type":"application/json"},
      body:JSON.stringify({image:b64}),
      signal:AbortSignal.timeout(8000),
    });
    if(!resp.ok) throw new Error("backend_error");
    return await resp.json();
  };
  const analyzeClaude=async()=>{
    const key=DB.get("claudeApiKey","");
    if(!key) throw new Error("no_api_key");
    const PROMPT="Analyze this retinal fundus photo for diabetic retinopathy using ICDR scale 0-4. Return ONLY valid minified JSON with these keys: icdr_level (int 0-4), findings (short French string array max 4 items), confidence (int 50-99), notes (one French patient-facing sentence). No markdown no extra text.";
    const body={model:"claude-sonnet-4-20250514",max_tokens:350,messages:[{role:"user",content:[{type:"image",source:{type:"base64",media_type:"image/jpeg",data:b64}},{type:"text",text:PROMPT}]}]};
    const resp=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json","x-api-key":key,"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},body:JSON.stringify(body)});
    const data=await resp.json();
    const txt=(data.content||[]).map(b=>b.text||"").join("");
    return JSON.parse(txt.replace(/```json|```/g,"").trim());
  };
  const analyze=async()=>{
    setStep("analyzing");setErr("");const t0=Date.now();
    try{
      const parsed=await analyzeLocal();
      setElapsed(((Date.now()-t0)/1000).toFixed(1));
      setRes(parsed);setStep("result");
    }catch(e){
      setErr("Backend IA non disponible. Démarrez le serveur : cd backend && uvicorn server:app --port 8000");
      setStep("preview");
    }
  };
  const save=()=>{
    const scan={id:Date.now().toString(),icdr_level:res.icdr_level,findings:res.findings||[],confidence:res.confidence,notes:res.notes,image:img,date:new Date().toISOString(),elapsed};
    if(user?.consentGiven){const all=DB.get("global_scans",[]);all.push({...scan,image:null});DB.set("global_scans",all);}
    onDone(scan);
  };
  const cur={pick:0,preview:0,analyzing:1,result:2}[step]||0;
  return(
    <div style={{padding:"0 16px",background:"transparent",minHeight:"100%",paddingBottom:140}}>
      <div style={{paddingTop:56,paddingBottom:16}}>
        <div style={{color:t.text,fontSize:30,fontWeight:700,letterSpacing:-.8,fontFamily:t.sf}}>Dépistage</div>
        <div style={{color:t.text3,fontSize:14,fontFamily:t.sm,marginTop:3}}>Analyse IA — Fond d'œil</div>
      </div>
      <div style={{display:"flex",gap:6,marginBottom:22}}>
        {["Import","Analyse","Résultat"].map((s,i)=>(
          <div key={s} style={{flex:1}}>
            <div style={{height:3,borderRadius:2,background:i<cur?"#30d158":i===cur?"#0a84ff":t.bg3,marginBottom:4,transition:"all .3s"}}/>
            <div style={{color:i<cur?"#30d158":i===cur?"#0a84ff":t.text4,fontSize:10,fontWeight:600,fontFamily:t.sm,textAlign:"center"}}>{s}</div>
          </div>
        ))}
      </div>
      {step==="pick"&&<div className="fade-up">
        <div style={{background:t.bg2,borderRadius:20,padding:"38px 18px",textAlign:"center",border:`2px dashed ${t.bg4}`,marginBottom:14}}>
          <div style={{fontSize:48,marginBottom:10}}>👁️</div>
          <div style={{color:t.text,fontSize:17,fontWeight:600,fontFamily:t.sf,marginBottom:5}}>Photo de fond d'œil</div>
          <div style={{color:t.text3,fontSize:13,fontFamily:t.sm,lineHeight:1.6}}>Importez une rétinographie depuis votre galerie.</div>
        </div>
        <input ref={fileRef} type="file" accept="image/*" onChange={e=>load(e.target.files[0])} style={{display:"none"}}/>
        <input ref={camRef} type="file" accept="image/*" capture="environment" onChange={e=>load(e.target.files[0])} style={{display:"none"}}/>
        <div style={{display:"flex",gap:10,marginBottom:12}}>
          <button onClick={()=>fileRef.current.click()} style={{flex:1,padding:"13px 0",borderRadius:13,border:`1px solid ${t.bg4}`,background:t.bg2,color:t.text,fontFamily:t.sm,fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:7}}>🖼️ Galerie</button>
          <button onClick={()=>camRef.current.click()} style={{flex:1,padding:"13px 0",borderRadius:13,border:`1px solid ${t.bg4}`,background:t.bg2,color:t.text,fontFamily:t.sm,fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:7}}>📷 Caméra</button>
        </div>
        <InfoBox color="#0a84ff" text="Utilisez une vraie rétinographie (fond d'œil), pas une photo frontale de l'œil."/>
      </div>}
      {step==="preview"&&<div className="fade-up">
        <img src={img} alt="" style={{width:"100%",borderRadius:18,objectFit:"contain",maxHeight:280,background:"#111",display:"block",marginBottom:12}}/>
        {err&&<div style={{color:"#ff453a",fontSize:13,fontFamily:t.sm,background:"rgba(255,69,58,.1)",borderRadius:10,padding:"10px 13px",marginBottom:10}}>{err}</div>}
        <div style={{display:"flex",gap:10}}>
          <button onClick={()=>{setImg(null);setB64(null);setStep("pick");setErr("");}} style={{flex:1,padding:"13px 0",borderRadius:13,border:`1px solid ${t.bg4}`,background:t.bg2,color:t.text,fontFamily:t.sm,fontSize:14,cursor:"pointer"}}>Changer</button>
          <button onClick={analyze} style={{flex:2,padding:"13px 0",borderRadius:13,border:"none",background:"#0a84ff",color:"#fff",fontFamily:t.sm,fontSize:15,fontWeight:700,cursor:"pointer",boxShadow:"0 4px 14px rgba(10,132,255,.35)"}}>Analyser →</button>
        </div>
      </div>}
      {step==="analyzing"&&<div style={{display:"flex",flexDirection:"column",alignItems:"center",paddingTop:50,gap:20}} className="fade-up">
        {img&&<img src={img} alt="" style={{width:100,height:100,borderRadius:20,objectFit:"cover",background:"#111",opacity:.4}}/>}
        <div style={{position:"relative",width:50,height:50}}>
          <div style={{width:50,height:50,borderRadius:"50%",border:`3px solid ${t.bg3}`}}/>
          <div style={{position:"absolute",inset:0,borderRadius:"50%",border:"3px solid transparent",borderTopColor:"#0a84ff",animation:"spin 1s linear infinite"}}/>
        </div>
        <div style={{color:t.text,fontSize:17,fontWeight:600,fontFamily:t.sf}}>Analyse en cours…</div>
        <div style={{color:t.text3,fontSize:13,fontFamily:t.sm}}>L'IA examine votre rétinographie</div>
      </div>}
      {step==="result"&&res&&(()=>{
        const info=ICDR[Math.min(Math.max(res.icdr_level,0),4)];
        return(
          <div className="fade-up">
            {img&&<img src={img} alt="" style={{width:"100%",borderRadius:18,objectFit:"contain",maxHeight:200,background:"#111",display:"block",marginBottom:12}}/>}
            <div style={{background:info.bg,borderRadius:20,padding:"16px",border:`1px solid ${info.color}44`,marginBottom:12}}>
              <div style={{color:info.color,fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:1,fontFamily:t.sm,marginBottom:7}}>Résultat ICDR</div>
              <div style={{display:"flex",alignItems:"center",gap:11,marginBottom:9}}>
                <span style={{fontSize:38}}>{info.emoji}</span>
                <div>
                  <div style={{color:t.text,fontSize:19,fontWeight:700,fontFamily:t.sf}}>{info.label}</div>
                  <div style={{color:info.color,fontSize:12,fontFamily:t.sm}}>Niveau {res.icdr_level}/4 · Confiance {res.confidence}%</div>
                </div>
              </div>
              <div style={{display:"flex",gap:3,marginBottom:10}}>{ICDR.map((_,i)=><div key={i} style={{flex:1,height:4,borderRadius:2,background:i<=res.icdr_level?info.color:t.bg4}}/>)}</div>
              <div style={{background:t.isDark?"rgba(0,0,0,.28)":"rgba(255,255,255,.6)",borderRadius:11,padding:"11px 13px"}}>
                <div style={{color:t.text2,fontSize:13,fontFamily:t.sm,lineHeight:1.55}}>{info.advice}</div>
              </div>
            </div>
            {res.findings&&res.findings.length>0&&<Card style={{marginBottom:12}}>
              <div style={{color:t.text3,fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginBottom:9,fontFamily:t.sm}}>Signes observés</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:6}}>{res.findings.map((f,i)=><span key={i} style={{background:t.bg3,color:t.text2,borderRadius:20,padding:"4px 11px",fontSize:12,fontFamily:t.sm}}>{f}</span>)}</div>
            </Card>}
            {res.icdr_level>=3&&<div style={{background:"rgba(255,69,58,.1)",borderRadius:13,padding:"12px 13px",border:"1px solid rgba(255,69,58,.25)",marginBottom:12}}>
              <div style={{color:"#ff453a",fontSize:13,fontFamily:t.sm,lineHeight:1.5,marginBottom:9}}>⚠️ Résultat nécessitant une consultation ophtalmologique urgente.</div>
              <a href="https://www.doctolib.fr/ophtalmologue" target="_blank" rel="noopener noreferrer" style={{display:"block",textDecoration:"none",width:"100%",padding:"11px 0",borderRadius:11,background:"#ff453a",color:"#fff",fontSize:14,fontWeight:700,fontFamily:t.sm,textAlign:"center"}}>🏥 Prendre RDV sur Doctolib →</a>
            </div>}
            <div style={{color:t.text4,fontSize:11,fontFamily:t.sm,textAlign:"center",marginBottom:11}}>Analysé en {elapsed}s · Outil de sensibilisation — pas un diagnostic</div>
            <PrimaryBtn label="✓ Enregistrer dans mon historique" onClick={save} color="#30d158"/>
          </div>
        );
      })()}
    </div>
  );
}


// ── HISTORY ───────────────────────────────────────────────────
function HistoryScreen({scans,glycLogs,onScanDetail}){
  const t=useTheme();
  const [filter,setFilter]=useState("all");
  const all=[
    ...scans.map(s=>({...s,_k:"retina"})),
    ...glycLogs.map(g=>({...g,_k:"glyc",date:g.date+"T"+(g.time||"00:00")})),
  ].sort((a,b)=>new Date(b.date)-new Date(a.date));
  const shown=filter==="all"?all:all.filter(i=>i._k===filter);
  return(
    <div style={{padding:"0 16px",background:"transparent",minHeight:"100%",paddingBottom:140}}>
      <div style={{paddingTop:56,paddingBottom:4}}>
        <div style={{color:t.text,fontSize:30,fontWeight:700,letterSpacing:-.8,fontFamily:t.sf}}>Historique</div>
        <div style={{color:t.text3,fontSize:13,fontFamily:t.sm,marginTop:2,marginBottom:14}}>{all.length} entrée{all.length!==1?"s":""}</div>
      </div>
      <div style={{display:"flex",background:t.bg2,borderRadius:12,padding:3,marginBottom:14,border:`1px solid ${t.border}`}}>
        {[["all","Tout"],["retina","Rétine"],["glyc","Glycémie"]].map(([v,l])=>(
          <button key={v} onClick={()=>setFilter(v)} style={{flex:1,padding:"8px 0",borderRadius:10,border:"none",cursor:"pointer",fontSize:13,fontWeight:600,background:filter===v?t.bg4:"transparent",color:filter===v?t.text:t.text3,fontFamily:t.sm,transition:"all .18s"}}>{l}</button>
        ))}
      </div>
      {shown.length===0
        ?<Card style={{textAlign:"center",padding:44}}><div style={{fontSize:40,marginBottom:12}}>📋</div><div style={{color:t.text,fontSize:16,fontWeight:600,fontFamily:t.sf,marginBottom:6}}>Aucune entrée</div><div style={{color:t.text3,fontSize:13,fontFamily:t.sm}}>Vos analyses apparaîtront ici.</div></Card>
        :shown.map(item=>{
          if(item._k==="retina"){
            const info=ICDR[Math.min(Math.max(item.icdr_level,0),4)];
            return(
              <div key={item.id} onClick={()=>onScanDetail(item)} style={{background:t.bg2,borderRadius:14,padding:"11px 13px",marginBottom:8,border:`1px solid ${t.border}`,display:"flex",alignItems:"center",gap:11,cursor:"pointer"}}>
                {item.image
                  ?<img src={item.image} alt="" style={{width:44,height:44,borderRadius:11,objectFit:"cover",background:"#111",flexShrink:0}}/>
                  :<div style={{width:44,height:44,borderRadius:11,background:info.bg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:20}}>{info.emoji}</div>}
                <div style={{flex:1,minWidth:0}}>
                  <div style={{color:t.text,fontSize:14,fontWeight:600,fontFamily:t.sm}}>{info.label}</div>
                  <div style={{color:t.text3,fontSize:11,fontFamily:t.sm,marginTop:1}}>{new Date(item.date).toLocaleDateString("fr-FR",{day:"numeric",month:"short",year:"numeric"})}</div>
                </div>
                <div style={{background:info.bg,borderRadius:20,padding:"3px 10px",border:`1px solid ${info.color}33`,flexShrink:0}}>
                  <span style={{color:info.color,fontSize:11,fontWeight:700,fontFamily:t.sm}}>N{item.icdr_level}</span>
                </div>
              </div>
            );
          }
          const col=item.value>=.7&&item.value<=1.6?"#30d158":"#ff453a";
          return(
            <div key={item.id} style={{background:t.bg2,borderRadius:14,padding:"11px 13px",marginBottom:8,border:`1px solid ${t.border}`,display:"flex",alignItems:"center",gap:11}}>
              <div style={{width:44,height:44,borderRadius:11,background:col+"18",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:18}}>💉</div>
              <div style={{flex:1}}>
                <div style={{color:t.text,fontSize:14,fontWeight:600,fontFamily:t.sm}}>Glycémie {item.moment==="Couche"?"Couché":item.moment}</div>
                <div style={{color:t.text3,fontSize:11,fontFamily:t.sm,marginTop:1}}>{item.date?.slice(0,10)} · {item.time}</div>
              </div>
              <div><span style={{color:col,fontSize:17,fontWeight:700,fontFamily:t.sf}}>{typeof item.value==="number"?item.value.toFixed(2):"—"}</span><span style={{color:t.text4,fontSize:11}}> g/L</span></div>
            </div>
          );
        })
      }
    </div>
  );
}

// ── VISION ────────────────────────────────────────────────────
function VisionScreen({onBack}){
  const t=useTheme();
  const [testType,setTestType]=useState("snellen");
  const [phase,setPhase]=useState("intro");
  const [line,setLine]=useState(0);
  const [eye,setEye]=useState("OD");
  const [done,setDone]=useState({OD:null,OG:null});
  const SCALE=testType==="snellen"?SNELLEN:PARINAUD;
  const getLabel=item=>testType==="snellen"?item.f:item.p;
  const ac=v=>{
    if(!v||v==="<1/10"||v==="<P14") return"#ff453a";
    if(testType==="snellen"){const n=parseFloat(v);if(n>=.8)return"#30d158";if(n>=.5)return"#ffd60a";if(n>=.3)return"#ff9f0a";return"#ff453a";}
    const idx=PARINAUD.findIndex(p=>p.p===v);if(idx>=5)return"#30d158";if(idx>=3)return"#ffd60a";if(idx>=1)return"#ff9f0a";return"#ff453a";
  };
  const answer=ok=>{
    if(ok){
      if(line<SCALE.length-1){setLine(l=>l+1);}
      else{const res=getLabel(SCALE[line]);const nd={...done,[eye]:res};setDone(nd);nextEyeOrResult(nd);}
    }else{
      const res=line>0?getLabel(SCALE[line-1]):(testType==="snellen"?"<1/10":"<P14");
      const nd={...done,[eye]:res};setDone(nd);nextEyeOrResult(nd);
    }
  };
  const nextEyeOrResult=(nd)=>{
    if(eye==="OD"){setEye("OG");setLine(0);}
    else{if(testType==="snellen"){const best=Math.max(parseFloat(nd.OD)||0,parseFloat(nd.OG)||0);DB.set("last_vision",String(best));}setPhase("result");}
  };
  const reset=()=>{setPhase("intro");setLine(0);setEye("OD");setDone({OD:null,OG:null});};
  const switchTest=(type)=>{setTestType(type);reset();};
  return(
    <div style={{padding:"0 16px",background:"transparent",minHeight:"100%",paddingBottom:140}}>
      <div style={{paddingTop:56,paddingBottom:14}}>
        {onBack&&<BackBtn onBack={onBack} label="Résumé"/>}
        <div style={{color:t.text,fontSize:30,fontWeight:700,letterSpacing:-.8,fontFamily:t.sf}}>Acuité visuelle</div>
        <div style={{color:t.text3,fontSize:14,fontFamily:t.sm,marginTop:3}}>Snellen (loin) · Parinaud (près)</div>
      </div>
      <div style={{display:"flex",background:t.bg2,borderRadius:12,padding:3,marginBottom:16,border:`1px solid ${t.border}`}}>
        {[["snellen","👁️ Snellen"],["parinaud","📖 Parinaud"]].map(([v,l])=>(
          <button key={v} onClick={()=>switchTest(v)} style={{flex:1,padding:"9px 0",borderRadius:10,border:"none",cursor:"pointer",fontSize:13,fontWeight:600,background:testType===v?t.bg4:"transparent",color:testType===v?t.text:t.text3,fontFamily:t.sm,transition:"all .18s"}}>{l}</button>
        ))}
      </div>
      {phase==="intro"&&<div className="fade-up">
        <Card style={{marginBottom:14}}>
          <div style={{fontSize:30,textAlign:"center",marginBottom:12}}>{testType==="snellen"?"👓":"📖"}</div>
          {(testType==="snellen"
            ?["Écran à 40 cm (longueur d'un bras).","Couvrez complètement un œil.","Lisez la dernière ligne visible nettement.","Ne plissez pas les yeux."]
            :["Tenez l'écran à 30–35 cm des yeux.","Couvrez complètement un œil.","Lisez le texte aussi petit que possible.","Arrêtez-vous quand c'est flou."]
          ).map((txt,i)=>(
            <div key={i} style={{display:"flex",gap:10,marginBottom:7,alignItems:"flex-start"}}>
              <div style={{minWidth:20,height:20,borderRadius:"50%",background:"#0a84ff",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:11,fontWeight:700,flexShrink:0}}>{i+1}</div>
              <div style={{color:t.text2,fontSize:13,fontFamily:t.sm,lineHeight:1.5}}>{txt}</div>
            </div>
          ))}
        </Card>
        <InfoBox color="#ffd60a" text="Test indicatif sur écran. Ne remplace pas un examen ophtalmologique officiel." icon="⚠️"/>
        <PrimaryBtn label="Démarrer le test" onClick={()=>setPhase("test")}/>
      </div>}
      {phase==="test"&&<div className="fade-up">
        <div style={{display:"flex",gap:8,marginBottom:14}}>
          {[["OD","Œil droit"],["OG","Œil gauche"]].map(([e,l])=>(
            <div key={e} style={{flex:1,background:eye===e?"rgba(10,132,255,.1)":t.bg2,borderRadius:13,padding:"9px 0",textAlign:"center",border:`1px solid ${eye===e?"#0a84ff44":t.border}`}}>
              <div style={{color:eye===e?"#0a84ff":t.text3,fontSize:11,fontWeight:700,fontFamily:t.sm}}>{done[e]?"✓ ":eye===e?"▶ ":""}{l}</div>
              {done[e]&&<div style={{color:ac(done[e]),fontSize:13,fontWeight:700,fontFamily:t.sm}}>{done[e]}</div>}
            </div>
          ))}
        </div>
        <Card style={{textAlign:"center",marginBottom:14,padding:"22px 14px"}}>
          <div style={{color:t.text4,fontSize:10,fontFamily:t.sm,marginBottom:8}}>Ligne {line+1}/{SCALE.length} · Cible {getLabel(SCALE[line])}</div>
          {testType==="snellen"
            ?<div style={{color:t.text,fontFamily:"'Courier New',monospace",fontWeight:900,letterSpacing:Math.max(4,14-line*2),userSelect:"none",margin:"12px 0 6px",fontSize:SNELLEN[line].size,lineHeight:1.2}}>{SNELLEN[line].row}</div>
            :<div style={{color:t.text,fontFamily:t.sm,userSelect:"none",margin:"14px 8px 8px",fontSize:PARINAUD[line].size,lineHeight:1.5,fontWeight:500,textAlign:"left"}}>{PARINAUD[line].text}</div>
          }
          <div style={{color:t.text4,fontSize:10,fontFamily:t.sm}}>Distance : {testType==="snellen"?"40 cm":"30–35 cm"}</div>
        </Card>
        <div style={{display:"flex",gap:10}}>
          <button onClick={()=>answer(false)} style={{flex:1,padding:13,borderRadius:13,border:"1px solid rgba(255,69,58,.25)",background:"rgba(255,69,58,.08)",color:"#ff453a",fontFamily:t.sm,fontSize:14,fontWeight:600,cursor:"pointer"}}>😵 Flou</button>
          <button onClick={()=>answer(true)} style={{flex:1,padding:13,borderRadius:13,border:"none",background:"#30d158",color:"#fff",fontFamily:t.sm,fontSize:14,fontWeight:600,cursor:"pointer",boxShadow:"0 3px 12px rgba(52,199,89,.3)"}}>✓ Je lis</button>
        </div>
      </div>}
      {phase==="result"&&<div className="fade-up">
        <Card style={{textAlign:"center",padding:26,marginBottom:14}}>
          <div style={{fontSize:34,marginBottom:10}}>📊</div>
          <div style={{color:t.text,fontSize:20,fontWeight:700,fontFamily:t.sf,marginBottom:4}}>Résultats {testType==="snellen"?"Snellen":"Parinaud"}</div>
          <div style={{color:t.text3,fontSize:12,fontFamily:t.sm,marginBottom:16}}>{testType==="snellen"?"Vision de loin (40 cm)":"Vision de près (30–35 cm)"}</div>
          <div style={{display:"flex",gap:10}}>
            {[["Œil droit","OD"],["Œil gauche","OG"]].map(([l,e])=>(
              <div key={e} style={{flex:1,background:t.bg3,borderRadius:13,padding:"13px 6px"}}>
                <div style={{color:t.text3,fontSize:11,fontFamily:t.sm,marginBottom:4}}>{l}</div>
                <div style={{color:ac(done[e]),fontSize:23,fontWeight:800,fontFamily:t.sf}}>{done[e]||"—"}</div>
              </div>
            ))}
          </div>
        </Card>
        <InfoBox color={t.text4} text="Test indicatif sur écran. Valeur non standardisée." icon="ℹ️"/>
        <div style={{display:"flex",gap:10}}>
          <button onClick={reset} style={{flex:1,padding:13,borderRadius:13,border:`1px solid ${t.bg4}`,background:t.bg2,color:t.text,fontFamily:t.sm,fontSize:14,cursor:"pointer"}}>Refaire</button>
          <button onClick={()=>switchTest(testType==="snellen"?"parinaud":"snellen")} style={{flex:1,padding:13,borderRadius:13,border:"none",background:"rgba(10,132,255,.12)",color:"#0a84ff",fontFamily:t.sm,fontSize:13,fontWeight:600,cursor:"pointer"}}>{testType==="snellen"?"Tester Parinaud →":"Tester Snellen →"}</button>
        </div>
      </div>}
    </div>
  );
}


// ── CHAT ──────────────────────────────────────────────────────
function ChatScreen(){
  const t=useTheme();
  const [msgs,setMsgs]=useState([{role:"assistant",text:"Bonjour 👁️\n\nJe suis l'assistant RetinaScore. Posez-moi vos questions sur la rétinopathie diabétique, la glycémie, l'acuité visuelle ou l'application.\n\nComment puis-je vous aider ?"}]);
  const [input,setInput]=useState("");
  const [loading,setLoading]=useState(false);
  const endRef=useRef();
  useEffect(()=>{endRef.current?.scrollIntoView({behavior:"smooth"});},[msgs,loading]);
  const matchFAQ=q=>{
    const norm=s=>s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
    const low=norm(q);
    return FAQ.find(f=>f.keys.some(k=>low.includes(norm(k))))||null;
  };
  const send=async(override)=>{
    const text=(override||input).trim();
    if(!text||loading) return;
    setInput("");
    const nm=[...msgs,{role:"user",text}];
    setMsgs(nm);setLoading(true);
    const faq=matchFAQ(text);
    if(faq){await new Promise(r=>setTimeout(r,380));setMsgs(m=>[...m,{role:"assistant",text:faq.a,faq:true}]);setLoading(false);return;}
    try{
      const SYS="Tu es l'assistant medical de RetinaScore. Reponds en francais, 2-3 phrases, bienveillant et precis. Rappelle que tu ne remplaces pas un medecin.";
      const hist=nm.slice(-8).map(m=>({role:m.role==="assistant"?"assistant":"user",content:m.text}));
      const key=DB.get("claudeApiKey","");
      const body={model:"claude-sonnet-4-20250514",max_tokens:280,system:SYS,messages:hist};
      const resp=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json",...(key?{"x-api-key":key,"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"}:{})},body:JSON.stringify(body)});
      const data=await resp.json();
      const reply=(data.content||[]).map(b=>b.text||"").join("")||"Aucune réponse.";
      setMsgs(m=>[...m,{role:"assistant",text:reply}]);
    }catch{
      setMsgs(m=>[...m,{role:"assistant",text:"Je ne peux pas répondre pour l'instant. Vérifiez votre connexion."}]);
    }
    setLoading(false);
  };
  const suggestions=["Qu'est-ce que la RD ?","Score ICDR ?","Glycémie cible ?","Traitements disponibles ?"];
  return(
    <div style={{display:"flex",flexDirection:"column",height:"100%",background:"transparent"}}>
      {/* Header with glass effect */}
      <div style={{
        padding:"56px 16px 12px",
        borderBottom:`1px solid ${t.border}`,
        flexShrink:0,
        background:t.isDark?"rgba(0,0,0,0.9)":"rgba(242,242,247,0.9)",
        backdropFilter:"blur(20px)",
        WebkitBackdropFilter:"blur(20px)",
      }}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <div style={{width:44,height:44,borderRadius:14,background:"linear-gradient(135deg,#ff9f0a,#ff375f)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>🤖</div>
          <div>
            <div style={{color:t.text,fontSize:17,fontWeight:700,fontFamily:t.sf}}>Assistant RetinaScore</div>
            <div style={{display:"flex",alignItems:"center",gap:5,marginTop:2}}>
              <div style={{width:6,height:6,borderRadius:"50%",background:"#30d158",animation:"pulse 2s infinite"}}/>
              <span style={{color:"#30d158",fontSize:12,fontFamily:t.sm}}>En ligne</span>
            </div>
          </div>
        </div>
      </div>
      {/* Messages */}
      <div style={{flex:1,overflowY:"auto",padding:"12px 14px 0"}}>
        {msgs.map((m,i)=>(
          <div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start",marginBottom:9}}>
            {m.role==="assistant"&&<div style={{width:28,height:28,borderRadius:"50%",background:"linear-gradient(135deg,#ff9f0a,#ff375f)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,marginRight:6,flexShrink:0,marginTop:2}}>🤖</div>}
            <div style={{maxWidth:"78%",background:m.role==="user"?"#0a84ff":t.bg2,borderRadius:m.role==="user"?"17px 17px 4px 17px":"17px 17px 17px 4px",padding:"10px 13px",border:m.role==="assistant"?`1px solid ${t.border}`:"none"}}>
              {m.faq&&<div style={{color:"#ffd60a",fontSize:9,fontWeight:700,textTransform:"uppercase",letterSpacing:.8,fontFamily:t.sm,marginBottom:4}}>FAQ ✦</div>}
              <div style={{color:m.role==="user"?"#fff":t.text,fontSize:14,fontFamily:t.sm,lineHeight:1.55,whiteSpace:"pre-line"}}>{m.text}</div>
            </div>
          </div>
        ))}
        {loading&&(
          <div style={{display:"flex",gap:7,marginBottom:9}}>
            <div style={{width:28,height:28,borderRadius:"50%",background:"linear-gradient(135deg,#ff9f0a,#ff375f)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13}}>🤖</div>
            <div style={{background:t.bg2,borderRadius:"17px 17px 17px 4px",padding:"11px 14px",border:`1px solid ${t.border}`,display:"flex",gap:5,alignItems:"center"}}>
              {[0,1,2].map(i=><div key={i} style={{width:6,height:6,borderRadius:"50%",background:t.text3,animation:`pulse 1.1s ${i*.18}s infinite`}}/>)}
            </div>
          </div>
        )}
        {msgs.length===1&&!loading&&(
          <div style={{display:"flex",flexWrap:"wrap",gap:7,marginBottom:12}}>
            {suggestions.map(s=><button key={s} onClick={()=>send(s)} style={{background:t.bg2,border:`1px solid ${t.border}`,borderRadius:20,padding:"7px 12px",color:"#0a84ff",fontSize:13,fontFamily:t.sm,cursor:"pointer"}}>{s}</button>)}
          </div>
        )}
        <div ref={endRef}/>
      </div>
      <div style={{color:t.text4,fontSize:10,fontFamily:t.sm,textAlign:"center",padding:"4px 0"}}>Messages non conservés · Pas un avis médical</div>
      {/* Input bar — sits above tab bar */}
      <div style={{padding:"8px 12px",paddingBottom:"calc(env(safe-area-inset-bottom, 0px) + 100px)",background:t.isDark?"rgba(0,0,0,0.5)":"rgba(248,248,252,0.6)",backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)",flexShrink:0}}>
        <div style={{display:"flex",gap:8,alignItems:"center",background:t.bg2,borderRadius:24,padding:"6px 6px 6px 15px",border:`1px solid ${t.border}`}}>
          <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();}}}
            placeholder="Posez votre question…"
            style={{flex:1,background:"transparent",border:"none",color:t.text,fontSize:15,fontFamily:t.sm,outline:"none",minWidth:0,padding:"3px 0"}}/>
          <button onClick={()=>send()} disabled={!input.trim()||loading}
            style={{width:36,height:36,borderRadius:"50%",border:"none",background:input.trim()&&!loading?"#0a84ff":t.bg3,display:"flex",alignItems:"center",justifyContent:"center",cursor:input.trim()&&!loading?"pointer":"default",transition:"background .18s",flexShrink:0}}>
            <svg width={14} height={14} viewBox="0 0 24 24" fill="white"><path d="M22 2L11 13"/><path d="M22 2L15 22l-4-9-9-4z" fill="white"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
}


// ── PROFILE ───────────────────────────────────────────────────
function ProfileScreen({user,scans,onDelete,onLogout,onShowAuth,onUpdateConsent,detail,setDetail}){
  const t=useTheme();
  if(detail){
    const info=ICDR[Math.min(Math.max(detail.icdr_level,0),4)];
    return(
      <div style={{padding:"0 16px",background:"transparent",minHeight:"100%",paddingBottom:140}}>
        <div style={{paddingTop:56}}><BackBtn onBack={()=>setDetail(null)} label="Profil"/></div>
        {detail.image&&<img src={detail.image} alt="" style={{width:"100%",borderRadius:18,objectFit:"contain",maxHeight:230,background:"#111",display:"block",marginBottom:12}}/>}
        <div style={{background:info.bg,borderRadius:18,padding:"15px",border:`1px solid ${info.color}44`,marginBottom:12}}>
          <div style={{display:"flex",alignItems:"center",gap:11,marginBottom:8}}>
            <span style={{fontSize:34}}>{info.emoji}</span>
            <div>
              <div style={{color:t.text,fontSize:18,fontWeight:700,fontFamily:t.sf}}>{info.label}</div>
              <div style={{color:t.text3,fontSize:12,fontFamily:t.sm}}>{new Date(detail.date).toLocaleDateString("fr-FR",{day:"numeric",month:"long",year:"numeric"})}</div>
            </div>
          </div>
          <div style={{display:"flex",gap:3,marginBottom:9}}>{ICDR.map((_,i)=><div key={i} style={{flex:1,height:4,borderRadius:2,background:i<=detail.icdr_level?info.color:t.bg4}}/>)}</div>
          <div style={{color:t.text2,fontSize:13,fontFamily:t.sm,lineHeight:1.55}}>{info.advice}</div>
        </div>
        {detail.findings?.length>0&&<Card style={{marginBottom:12}}>
          <div style={{color:t.text3,fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginBottom:8,fontFamily:t.sm}}>Signes observés</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:6}}>{detail.findings.map((f,i)=><span key={i} style={{background:t.bg3,color:t.text2,borderRadius:20,padding:"4px 11px",fontSize:12,fontFamily:t.sm}}>{f}</span>)}</div>
        </Card>}
        {(detail.notes||detail.confidence)&&<Card style={{marginBottom:12}}>
          <div style={{color:t.text3,fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginBottom:8,fontFamily:t.sm}}>Analyse IA</div>
          {detail.notes&&<div style={{color:t.text2,fontSize:13,fontFamily:t.sm,lineHeight:1.55,marginBottom:detail.confidence?10:0}}>{detail.notes}</div>}
          {detail.confidence&&<div>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
              <span style={{color:t.text3,fontSize:11,fontFamily:t.sm}}>Score de confiance</span>
              <span style={{color:"#0a84ff",fontSize:11,fontWeight:700,fontFamily:t.sm}}>{detail.confidence}%</span>
            </div>
            <div style={{height:5,borderRadius:3,background:t.bg3,overflow:"hidden"}}>
              <div style={{width:`${detail.confidence}%`,height:"100%",borderRadius:3,background:"linear-gradient(90deg,#0a84ff,#30d158)",transition:"width .6s ease"}}/>
            </div>
          </div>}
        </Card>}
        {detail.icdr_level>=3&&<a href="https://www.doctolib.fr/ophtalmologue" target="_blank" rel="noopener noreferrer" style={{display:"block",textDecoration:"none",width:"100%",padding:"11px 0",borderRadius:12,background:"#ff453a",color:"#fff",fontSize:14,fontWeight:700,fontFamily:t.sm,textAlign:"center",marginBottom:10}}>🏥 Prendre RDV ophtalmologue →</a>}
        <button onClick={()=>{onDelete(detail.id);setDetail(null);}} style={{width:"100%",padding:12,borderRadius:12,border:"1px solid rgba(255,69,58,.25)",background:"rgba(255,69,58,.08)",color:"#ff453a",fontFamily:t.sm,fontSize:14,cursor:"pointer"}}>🗑️ Supprimer</button>
      </div>
    );
  }
  return(
    <div style={{padding:"0 16px",background:"transparent",minHeight:"100%",paddingBottom:140}}>
      <div style={{paddingTop:56,paddingBottom:18}}>
        <div style={{color:t.text,fontSize:30,fontWeight:700,letterSpacing:-.8,fontFamily:t.sf}}>Profil</div>
      </div>
      {!user
        ?<Card style={{textAlign:"center",padding:30,marginBottom:12}}>
          <div style={{fontSize:44,marginBottom:12}}>👤</div>
          <div style={{color:t.text,fontSize:17,fontWeight:700,fontFamily:t.sf,marginBottom:7}}>Mode invité</div>
          <div style={{color:t.text3,fontSize:13,fontFamily:t.sm,lineHeight:1.6,marginBottom:16}}>Créez un compte pour sauvegarder vos données partout.</div>
          <PrimaryBtn label="Créer un compte" onClick={onShowAuth}/>
        </Card>
        :<Card style={{display:"flex",alignItems:"center",gap:14,marginBottom:12}}>
          <div style={{width:52,height:52,borderRadius:"50%",background:"linear-gradient(135deg,#0a84ff,#30d158)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,fontWeight:700,color:"#fff",fontFamily:t.sf,flexShrink:0}}>{user.name?.charAt(0).toUpperCase()}</div>
          <div>
            <div style={{color:t.text,fontSize:17,fontWeight:700,fontFamily:t.sf}}>{user.name}</div>
            <div style={{color:t.text3,fontSize:12,fontFamily:t.sm}}>{user.email}</div>
            <span style={{background:"rgba(10,132,255,.12)",color:"#0a84ff",borderRadius:20,padding:"2px 9px",fontSize:11,fontFamily:t.sm,fontWeight:700,marginTop:3,display:"inline-block"}}>Diabète {user.diabetes}</span>
          </div>
        </Card>
      }
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
        {[["Analyses",scans.length,"#ff375f"],["Normaux",scans.filter(s=>s.icdr_level===0).length,"#30d158"],["Modérés+",scans.filter(s=>s.icdr_level>=2).length,"#ff9f0a"],["Urgents",scans.filter(s=>s.icdr_level>=3).length,"#ff453a"]].map(([l,v,c])=>(
          <Card key={l} style={{padding:"12px 13px"}}>
            <div style={{color:t.text3,fontSize:11,fontFamily:t.sm,marginBottom:2}}>{l}</div>
            <div style={{color:c,fontSize:25,fontWeight:700,fontFamily:t.sf,letterSpacing:-.4}}>{v}</div>
          </Card>
        ))}
      </div>
      {user&&<Card style={{marginBottom:12}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:9}}>
          <div style={{width:32,height:32,borderRadius:10,background:user.consentGiven?"rgba(48,209,88,.15)":"rgba(255,159,10,.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:15}}>{user.consentGiven?"🔬":"🔒"}</div>
          <div><div style={{color:t.text,fontSize:14,fontWeight:600,fontFamily:t.sm}}>Contribution recherche</div><div style={{color:user.consentGiven?"#30d158":"#ff9f0a",fontSize:12,fontFamily:t.sm}}>{user.consentGiven?"Activée":"Désactivée"}</div></div>
        </div>
        <button onClick={onUpdateConsent} style={{width:"100%",padding:10,borderRadius:11,border:`1px solid ${user.consentGiven?"rgba(255,69,58,.25)":"rgba(52,199,89,.3)"}`,background:user.consentGiven?"rgba(255,69,58,.08)":"rgba(48,209,88,.1)",color:user.consentGiven?"#ff453a":"#30d158",fontFamily:t.sm,fontSize:13,fontWeight:600,cursor:"pointer"}}>{user.consentGiven?"Désactiver":"Activer le partage anonyme"}</button>
      </Card>}
      <Card style={{marginBottom:12}}>
        <div style={{color:t.text,fontSize:14,fontWeight:600,fontFamily:t.sf,marginBottom:11}}>🗓 Recommandations</div>
        {[["Fond d'œil","/ 12 mois","#0a84ff"],["HbA1c","/ 3 mois","#30d158"],["Tension","Régulièrement","#ff9f0a"]].map(([l,r,c])=>(
          <div key={l} style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingBottom:8,marginBottom:8,borderBottom:`1px solid ${t.bg3}`}}>
            <span style={{color:t.text2,fontSize:13,fontFamily:t.sm}}>{l}</span>
            <span style={{color:c,fontSize:12,fontFamily:t.sm,fontWeight:600}}>{r}</span>
          </div>
        ))}
      </Card>
      {user
        ?<button onClick={onLogout} style={{width:"100%",padding:13,borderRadius:13,border:"1px solid rgba(255,69,58,.25)",background:"rgba(255,69,58,.08)",color:"#ff453a",fontFamily:t.sm,fontSize:14,fontWeight:600,cursor:"pointer",marginTop:4}}>Se déconnecter</button>
        :<PrimaryBtn label="Créer un compte ou se connecter" onClick={onShowAuth} style={{marginTop:4}}/>
      }
      <div style={{color:t.text4,fontSize:10,fontFamily:t.sm,textAlign:"center",marginTop:14}}>RetinaScore v8 · Thèse médecine 2026 · RGPD EU</div>
    </div>
  );
}

// ── SETTINGS ──────────────────────────────────────────────────
function SettingsScreen({onBack,darkMode,setDarkMode}){
  const t=useTheme();
  return(
    <div style={{padding:"0 16px",background:"transparent",minHeight:"100%",paddingBottom:140}}>
      <div style={{paddingTop:56,paddingBottom:4}}>
        <BackBtn onBack={onBack} label="Résumé"/>
        <div style={{color:t.text,fontSize:30,fontWeight:700,letterSpacing:-.8,fontFamily:t.sf}}>Réglages</div>
      </div>
      <SecTitle mt={22}>Apparence</SecTitle>
      <Card style={{marginBottom:12}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:34,height:34,borderRadius:10,background:"rgba(255,214,10,.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>{darkMode?"🌙":"☀️"}</div>
            <div><div style={{color:t.text,fontSize:15,fontWeight:600,fontFamily:t.sm}}>Mode sombre</div><div style={{color:t.text3,fontSize:12,fontFamily:t.sm,marginTop:1}}>{darkMode?"Activé":"Désactivé"}</div></div>
          </div>
          <div onClick={()=>setDarkMode(!darkMode)} style={{width:50,height:30,borderRadius:15,background:darkMode?"#30d158":"rgba(120,120,128,0.32)",cursor:"pointer",position:"relative",transition:"background .25s",flexShrink:0}}>
            <div style={{width:26,height:26,borderRadius:"50%",background:"#fff",position:"absolute",top:2,left:darkMode?22:2,transition:"left .25s",boxShadow:"0 2px 6px rgba(0,0,0,0.25)"}}/>
          </div>
        </div>
      </Card>
      <SecTitle>IA & Backend</SecTitle>
      <Card style={{marginBottom:12}}>
        <div style={{display:"flex",gap:12,marginBottom:12,alignItems:"flex-start"}}>
          <div style={{width:34,height:34,borderRadius:10,background:"rgba(10,132,255,0.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>🧠</div>
          <div>
            <div style={{color:t.text,fontSize:14,fontWeight:600,fontFamily:t.sm}}>Modèle entraîné local</div>
            <div style={{color:t.text3,fontSize:12,fontFamily:t.sm,marginTop:2,lineHeight:1.5}}>Analyse via votre modèle <span style={{color:"#0a84ff",fontWeight:600}}>best_model_v2.pth</span> — aucun serveur externe.</div>
          </div>
        </div>
        <div style={{background:"rgba(10,132,255,0.08)",borderRadius:12,padding:"10px 13px",border:"1px solid rgba(10,132,255,0.2)"}}>
          <div style={{color:t.text3,fontSize:10,fontFamily:t.sm,marginBottom:6,fontWeight:700,textTransform:"uppercase",letterSpacing:.6}}>Démarrer le backend</div>
          <div style={{color:"#0a84ff",fontSize:12,fontFamily:"'Courier New',monospace",letterSpacing:.2,lineHeight:1.8,whiteSpace:"pre"}}>{"cd backend\npip install -r requirements.txt\nuvicorn server:app --host 0.0.0.0 --port 8000"}</div>
        </div>
      </Card>
      <SecTitle>Données & Confidentialité</SecTitle>
      <Card style={{marginBottom:12}}>
        {[["📷","Photos","Jamais stockées sur serveur","#30d158"],["📊","Analyses","Métadonnées anonymisées si consentement","#0a84ff"],["⚖️","Base légale","RGPD Art. 9.2.j · Recherche médicale","#ffd60a"],["🌍","Hébergement","Serveurs EU (Frankfurt)","#30d158"]].map(([ico,l,d,c])=>(
          <div key={l} style={{display:"flex",gap:12,marginBottom:10,alignItems:"flex-start"}}>
            <div style={{width:30,height:30,borderRadius:9,background:c+"18",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0}}>{ico}</div>
            <div><div style={{color:t.text,fontSize:13,fontWeight:600,fontFamily:t.sm}}>{l}</div><div style={{color:t.text3,fontSize:11,fontFamily:t.sm,marginTop:1,lineHeight:1.4}}>{d}</div></div>
          </div>
        ))}
      </Card>
      <SecTitle>À propos</SecTitle>
      <Card>
        {[["Version","8.0 · Mars 2026"],["Auteur","Thèse médecine ophtalmo"],["Conformité","RGPD · HDS · CE marquage en cours"]].map(([l,v])=>(
          <div key={l} style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingBottom:9,marginBottom:9,borderBottom:`1px solid ${t.bg3}`}}>
            <span style={{color:t.text3,fontSize:13,fontFamily:t.sm}}>{l}</span>
            <span style={{color:t.text,fontSize:13,fontFamily:t.sm,fontWeight:500}}>{v}</span>
          </div>
        ))}
        <div style={{color:t.text4,fontSize:11,fontFamily:t.sm,lineHeight:1.5,marginTop:4}}>Outil de sensibilisation académique. Ne constitue pas un dispositif médical réglementé.</div>
      </Card>
    </div>
  );
}


// ── RDV SCREEN ────────────────────────────────────────────────
function RDVScreen({onBack}){
  const t=useTheme();
  const [rdvs,setRdvs]=useState(()=>DB.get("rdvs",[]));
  const [showForm,setShowForm]=useState(false);
  const [form,setForm]=useState({date:"",type:"Fond d'œil",note:""});
  const [err,setErr]=useState("");
  const types=["Fond d'œil","HbA1c","Ophtalmologue","Diabétologue","Autre"];
  const save=()=>{
    if(!form.date){setErr("Date requise.");return;}
    const newRdv={id:Date.now().toString(),...form};
    const updated=[...rdvs,newRdv].sort((a,b)=>a.date.localeCompare(b.date));
    setRdvs(updated);DB.set("rdvs",updated);
    setForm({date:"",type:"Fond d'œil",note:""});setErr("");setShowForm(false);
  };
  const del=(id)=>{const updated=rdvs.filter(r=>r.id!==id);setRdvs(updated);DB.set("rdvs",updated);};
  const today=new Date().toISOString().slice(0,10);
  const upcoming=rdvs.filter(r=>r.date>=today);
  const past=rdvs.filter(r=>r.date<today);
  const rdvColor={"Fond d'œil":"#0a84ff","HbA1c":"#30d158","Ophtalmologue":"#bf5af2","Diabétologue":"#ff9f0a","Autre":"#8e8e93"};
  const formatDate=d=>new Date(d+"T12:00").toLocaleDateString("fr-FR",{weekday:"long",day:"numeric",month:"long",year:"numeric"});
  const daysUntil=d=>{
    const diff=Math.ceil((new Date(d+"T12:00")-new Date())/(1000*60*60*24));
    if(diff===0) return"Aujourd'hui";if(diff===1) return"Demain";if(diff>0) return`Dans ${diff} jours`;return`Il y a ${-diff} jours`;
  };
  return(
    <div style={{padding:"0 16px",background:"transparent",minHeight:"100%",paddingBottom:140}}>
      <div style={{paddingTop:56}}>
        <BackBtn onBack={onBack} label="Résumé"/>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
          <div style={{color:t.text,fontSize:30,fontWeight:700,letterSpacing:-.8,fontFamily:t.sf}}>Rendez-vous</div>
          <button onClick={()=>setShowForm(!showForm)} style={{background:showForm?t.bg3:"#0a84ff",border:"none",borderRadius:20,padding:"7px 15px",color:showForm?t.text3:"#fff",fontSize:14,fontWeight:600,fontFamily:t.sm,cursor:"pointer"}}>{showForm?"Annuler":"+ Ajouter"}</button>
        </div>
      </div>
      {showForm&&<Card style={{marginBottom:16}} className="fade-up">
        <div style={{color:t.text,fontSize:16,fontWeight:600,fontFamily:t.sf,marginBottom:12}}>Nouveau rendez-vous</div>
        <div style={{marginBottom:10}}>
          <div style={{color:t.text3,fontSize:11,fontWeight:600,textTransform:"uppercase",letterSpacing:.6,marginBottom:6,fontFamily:t.sm}}>Type</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
            {types.map(tp=>(
              <button key={tp} onClick={()=>setForm(f=>({...f,type:tp}))} style={{padding:"6px 12px",borderRadius:20,border:`1px solid ${form.type===tp?(rdvColor[tp]||"#0a84ff")+"55":t.bg4}`,cursor:"pointer",fontFamily:t.sm,fontSize:12,fontWeight:600,background:form.type===tp?(rdvColor[tp]||"#0a84ff")+"22":"transparent",color:form.type===tp?(rdvColor[tp]||"#0a84ff"):t.text3,transition:"all .18s"}}>{tp}</button>
            ))}
          </div>
        </div>
        <FIn label="Date du rendez-vous" value={form.date} onChange={v=>setForm(f=>({...f,date:v}))} type="date"/>
        <FIn label="Note (optionnel)" value={form.note} onChange={v=>setForm(f=>({...f,note:v}))} placeholder="ex: Dr Martin, Hôpital Lariboisière"/>
        {err&&<div style={{color:"#ff453a",fontSize:13,fontFamily:t.sm,marginBottom:8}}>{err}</div>}
        <PrimaryBtn label="Enregistrer" onClick={save}/>
      </Card>}
      {upcoming.length===0&&!showForm&&<Card style={{textAlign:"center",padding:44,marginBottom:12}}>
        <div style={{fontSize:40,marginBottom:12}}>📅</div>
        <div style={{color:t.text,fontSize:16,fontWeight:600,fontFamily:t.sf,marginBottom:6}}>Aucun rendez-vous</div>
        <div style={{color:t.text3,fontSize:13,fontFamily:t.sm}}>Ajoutez vos prochains RDV médicaux.</div>
      </Card>}
      {upcoming.length>0&&<>
        <div style={{color:t.text3,fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:.8,fontFamily:t.sm,marginBottom:8}}>À venir</div>
        {upcoming.map((r,i)=>{
          const color=rdvColor[r.type]||"#8e8e93";
          const du=daysUntil(r.date);
          const isClose=r.date<=new Date(Date.now()+7*86400000).toISOString().slice(0,10);
          return(
            <div key={r.id} style={{background:i===0?color+"14":t.bg2,borderRadius:15,padding:"13px 14px",marginBottom:9,border:`1px solid ${i===0?color+"33":t.border}`,display:"flex",alignItems:"flex-start",gap:12}}>
              <div style={{width:40,height:40,borderRadius:12,background:color+"20",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>
                {r.type==="Fond d'œil"?"👁️":r.type==="HbA1c"?"🩸":r.type==="Ophtalmologue"?"🔬":r.type==="Diabétologue"?"💊":"📋"}
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:2}}>
                  <div style={{color:t.text,fontSize:14,fontWeight:600,fontFamily:t.sm}}>{r.type}</div>
                  {isClose&&<span style={{background:color+"20",color,fontSize:10,fontWeight:700,borderRadius:20,padding:"2px 7px",fontFamily:t.sm}}>Bientôt</span>}
                </div>
                <div style={{color,fontSize:12,fontFamily:t.sm,fontWeight:600,marginBottom:1}}>{du}</div>
                <div style={{color:t.text3,fontSize:11,fontFamily:t.sm}}>{formatDate(r.date)}</div>
                {r.note&&<div style={{color:t.text4,fontSize:11,fontFamily:t.sm,marginTop:2}}>{r.note}</div>}
              </div>
              <button onClick={()=>del(r.id)} style={{background:"none",border:"none",color:t.text4,fontSize:18,cursor:"pointer",padding:"0 0 0 4px",flexShrink:0}}>×</button>
            </div>
          );
        })}
      </>}
      {past.length>0&&<>
        <div style={{color:t.text4,fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:.8,fontFamily:t.sm,marginTop:16,marginBottom:8}}>Passés</div>
        {past.map(r=>{
          const color=rdvColor[r.type]||"#8e8e93";
          return(
            <div key={r.id} style={{background:t.bg2,borderRadius:13,padding:"11px 13px",marginBottom:7,border:`1px solid ${t.border}`,display:"flex",alignItems:"center",gap:11,opacity:.6}}>
              <div style={{width:34,height:34,borderRadius:10,background:t.bg3,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,flexShrink:0}}>
                {r.type==="Fond d'œil"?"👁️":r.type==="HbA1c"?"🩸":r.type==="Ophtalmologue"?"🔬":r.type==="Diabétologue"?"💊":"📋"}
              </div>
              <div style={{flex:1}}>
                <div style={{color:t.text3,fontSize:13,fontWeight:600,fontFamily:t.sm}}>{r.type}</div>
                <div style={{color:t.text4,fontSize:11,fontFamily:t.sm}}>{new Date(r.date+"T12:00").toLocaleDateString("fr-FR",{day:"numeric",month:"short",year:"numeric"})}</div>
              </div>
              <button onClick={()=>del(r.id)} style={{background:"none",border:"none",color:t.text4,fontSize:16,cursor:"pointer"}}>×</button>
            </div>
          );
        })}
      </>}
    </div>
  );
}


// ── LANDING ───────────────────────────────────────────────────
function LandingScreen({onGuest,onLogin,onRegister}){
  const t=useTheme();
  const [a,setA]=useState(false);
  useEffect(()=>{setTimeout(()=>setA(true),60);},[]);
  return(
    <div style={{minHeight:"100%",background:"transparent",display:"flex",flexDirection:"column",padding:"0 20px 44px",position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",top:-80,left:"50%",transform:"translateX(-50%)",width:320,height:320,borderRadius:"50%",background:"radial-gradient(circle,rgba(10,132,255,.14) 0%,transparent 70%)",pointerEvents:"none"}}/>
      <div style={{paddingTop:88,textAlign:"center",opacity:a?1:0,transform:a?"translateY(0)":"translateY(14px)",transition:"all .5s ease"}}>
        <div style={{width:82,height:82,borderRadius:24,background:"linear-gradient(145deg,#0a84ff,#30d158)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px",boxShadow:"0 16px 50px rgba(10,132,255,.28)"}}>
          <svg width={38} height={38} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={1.6} strokeLinecap="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx={12} cy={12} r={3}/></svg>
        </div>
        <div style={{color:t.text,fontSize:34,fontWeight:800,letterSpacing:-1.2,fontFamily:t.sf}}>RetinaScore</div>
        <div style={{color:t.text3,fontSize:14,marginTop:7,fontFamily:t.sm,lineHeight:1.6}}>Dépistage de la rétinopathie diabétique<br/>par intelligence artificielle</div>
      </div>
      <div style={{marginTop:36,display:"flex",flexDirection:"column",gap:9,opacity:a?1:0,transform:a?"translateY(0)":"translateY(14px)",transition:"all .6s ease .1s"}}>
        {[["👁️","Analyse IA","Score ICDR 0–4 sur votre fond d'œil"],["📊","Suivi complet","Glycémie, acuité visuelle, historique"],["🔒","Données privées","Photos jamais stockées · RGPD EU"]].map(([e,title,desc])=>(
          <div key={title} style={{background:t.bg2,borderRadius:16,padding:"13px 15px",border:`1px solid ${t.border}`,display:"flex",gap:12,alignItems:"flex-start"}}>
            <span style={{fontSize:21,flexShrink:0}}>{e}</span>
            <div><div style={{color:t.text,fontSize:14,fontWeight:600,fontFamily:t.sm}}>{title}</div><div style={{color:t.text3,fontSize:12,fontFamily:t.sm,marginTop:2,lineHeight:1.4}}>{desc}</div></div>
          </div>
        ))}
      </div>
      <div style={{marginTop:"auto",paddingTop:30,display:"flex",flexDirection:"column",gap:10,opacity:a?1:0,transform:a?"translateY(0)":"translateY(16px)",transition:"all .7s ease .2s"}}>
        <button onClick={onGuest} style={{width:"100%",padding:"15px 0",borderRadius:16,border:"none",cursor:"pointer",background:"linear-gradient(135deg,#0a84ff,#30d158)",color:"#fff",fontSize:17,fontWeight:700,fontFamily:t.sm,boxShadow:"0 6px 24px rgba(10,132,255,.3)"}}>Essayer sans compte →</button>
        <div style={{display:"flex",alignItems:"center",gap:10}}><div style={{flex:1,height:1,background:t.bg3}}/><span style={{color:t.text4,fontSize:12,fontFamily:t.sm}}>ou</span><div style={{flex:1,height:1,background:t.bg3}}/></div>
        <div style={{display:"flex",gap:10}}>
          <button onClick={onLogin} style={{flex:1,padding:"13px 0",borderRadius:14,border:`1px solid ${t.bg4}`,background:t.bg2,color:t.text,fontSize:14,fontWeight:600,fontFamily:t.sm,cursor:"pointer"}}>Connexion</button>
          <button onClick={onRegister} style={{flex:1,padding:"13px 0",borderRadius:14,border:"1px solid rgba(10,132,255,.4)",background:"rgba(10,132,255,.1)",color:"#0a84ff",fontSize:14,fontWeight:600,fontFamily:t.sm,cursor:"pointer"}}>Créer un compte</button>
        </div>
        <div style={{color:t.text4,fontSize:10,fontFamily:t.sm,textAlign:"center",lineHeight:1.5}}>Outil académique · Ne remplace pas un avis médical</div>
      </div>
    </div>
  );
}

// ── AUTH MODAL ────────────────────────────────────────────────
function AuthModal({mode:initMode,onClose,onLogin}){
  const t=useTheme();
  const [mode,setMode]=useState(initMode);
  const [f,setF]=useState({name:"",email:"",password:"",dob:"",diabetes:"Type 2"});
  const [err,setErr]=useState("");
  const [busy,setBusy]=useState(false);
  const [showConsent,setShowConsent]=useState(false);
  const [pending,setPending]=useState(null);
  const submit=async()=>{
    setErr("");if(!f.email||!f.password) return setErr("Email et mot de passe requis.");
    setBusy(true);await new Promise(r=>setTimeout(r,600));
    if(mode==="register"){
      if(!f.name){setBusy(false);return setErr("Prénom requis.");}
      const users=DB.get("users",{});if(users[f.email]){setBusy(false);return setErr("Email déjà utilisé.");}
      const u={...f,id:Date.now().toString(),consentGiven:false,createdAt:new Date().toISOString()};
      users[f.email]=u;DB.set("users",users);setPending(u);setBusy(false);setShowConsent(true);
    }else{
      const users=DB.get("users",{});const u=users[f.email];
      if(!u||u.password!==f.password){setBusy(false);return setErr("Identifiants incorrects.");}
      DB.set("sess",{email:f.email});setBusy(false);
      if(!u.consentGiven){setPending(u);setShowConsent(true);}else onLogin(u);
    }
  };
  const handleConsent=a=>{
    const users=DB.get("users",{});const u={...pending,consentGiven:a,consentDate:new Date().toISOString()};
    users[u.email]=u;DB.set("users",users);DB.set("sess",{email:u.email});onLogin(u);
  };
  if(showConsent) return <ConsentScreen onAccept={()=>handleConsent(true)} onDecline={()=>handleConsent(false)}/>;
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.85)",display:"flex",alignItems:"flex-end",zIndex:2000,backdropFilter:"blur(14px)",WebkitBackdropFilter:"blur(14px)"}} onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={{width:"100%",maxWidth:430,margin:"0 auto",background:t.bg2,borderRadius:"22px 22px 0 0",padding:"10px 20px 44px",border:`1px solid ${t.border}`,animation:"slideUp .28s ease"}}>
        <style>{`@keyframes slideUp{from{transform:translateY(100%);opacity:0}to{transform:translateY(0);opacity:1}}@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        <div style={{width:36,height:4,borderRadius:2,background:t.bg4,margin:"12px auto 18px"}}/>
        <div style={{display:"flex",background:t.bg3,borderRadius:11,padding:3,marginBottom:18}}>
          {[["login","Connexion"],["register","Inscription"]].map(([m,l])=>(
            <button key={m} onClick={()=>{setMode(m);setErr("");}} style={{flex:1,padding:"8px 0",borderRadius:9,border:"none",cursor:"pointer",fontSize:14,fontWeight:600,background:mode===m?t.bg4:"transparent",color:mode===m?t.text:t.text3,fontFamily:t.sm,transition:"all .18s"}}>{l}</button>
          ))}
        </div>
        {mode==="register"&&<>
          <FIn label="Prénom & Nom" value={f.name} onChange={v=>setF(p=>({...p,name:v}))} placeholder="Marie Dupont"/>
          <FIn label="Date de naissance" value={f.dob} onChange={v=>setF(p=>({...p,dob:v}))} type="date"/>
          <div style={{marginBottom:10}}>
            <div style={{color:t.text3,fontSize:11,fontWeight:600,textTransform:"uppercase",letterSpacing:.6,marginBottom:6,fontFamily:t.sm}}>Type de diabète</div>
            <div style={{display:"flex",gap:6}}>
              {["Type 1","Type 2","Gestation.","Aucun"].map(d=>(
                <button key={d} onClick={()=>setF(p=>({...p,diabetes:d}))} style={{flex:1,padding:"7px 3px",borderRadius:9,border:"none",cursor:"pointer",fontFamily:t.sm,fontSize:11,fontWeight:600,background:f.diabetes===d?"#0a84ff":t.bg3,color:f.diabetes===d?"#fff":t.text3,transition:"all .18s"}}>{d}</button>
              ))}
            </div>
          </div>
        </>}
        <FIn label="Email" value={f.email} onChange={v=>setF(p=>({...p,email:v}))} placeholder="vous@email.fr" type="email"/>
        <FIn label="Mot de passe" value={f.password} onChange={v=>setF(p=>({...p,password:v}))} placeholder="••••••••" type="password"/>
        {err&&<div style={{color:"#ff453a",fontSize:13,fontFamily:t.sm,marginBottom:9}}>{err}</div>}
        <PrimaryBtn label={busy?"…":mode==="login"?"Se connecter":"Créer mon compte"} onClick={submit} disabled={busy} style={{marginTop:12}}/>
        <button onClick={onClose} style={{width:"100%",marginTop:9,padding:"11px 0",borderRadius:13,border:"none",background:"transparent",color:t.text3,fontSize:13,fontFamily:t.sm,cursor:"pointer"}}>Continuer sans compte →</button>
      </div>
    </div>
  );
}

// ── CONSENT ───────────────────────────────────────────────────
function ConsentScreen({onAccept,onDecline}){
  const t=useTheme();
  const [ck,setCk]=useState({a:false,b:false,c:false});
  const all=Object.values(ck).every(Boolean);
  return(
    <div style={{minHeight:"100%",background:"transparent",display:"flex",flexDirection:"column",padding:"0 20px 44px",overflowY:"auto"}}>
      <div style={{paddingTop:60,paddingBottom:22,textAlign:"center"}} className="fade-up">
        <div style={{width:62,height:62,borderRadius:18,background:"rgba(10,132,255,.1)",border:"1px solid rgba(10,132,255,.3)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px"}}>
          <svg width={26} height={26} viewBox="0 0 24 24" fill="none" stroke="#0a84ff" strokeWidth={1.6} strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        </div>
        <div style={{color:t.text,fontSize:23,fontWeight:700,fontFamily:t.sf}}>Consentement éclairé</div>
        <div style={{color:t.text3,fontSize:13,fontFamily:t.sm,marginTop:5}}>Une seule fois — modifiable dans les réglages</div>
      </div>
      <Card style={{marginBottom:9}}>
        <div style={{color:"#0a84ff",fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:.9,fontFamily:t.sm,marginBottom:9}}>Données collectées si accepté</div>
        {[["📊","Score ICDR","Résultat IA de chaque analyse"],["📅","Date","Pour le suivi longitudinal"],["🏥","Type de diabète","Contextualisation médicale"]].map(([e,l,d])=>(
          <div key={l} style={{display:"flex",gap:10,marginBottom:7,alignItems:"flex-start"}}><span style={{fontSize:15,flexShrink:0}}>{e}</span><div><div style={{color:t.text,fontSize:13,fontWeight:600,fontFamily:t.sm}}>{l}</div><div style={{color:t.text3,fontSize:11,fontFamily:t.sm,marginTop:1}}>{d}</div></div></div>
        ))}
      </Card>
      <Card style={{marginBottom:9}}>
        <div style={{color:"#30d158",fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:.9,fontFamily:t.sm,marginBottom:8}}>Jamais collectés</div>
        {["Photos de fond d'œil","Nom ou identité","Localisation GPS"].map(l=>(
          <div key={l} style={{display:"flex",gap:7,marginBottom:5,alignItems:"center"}}><span style={{color:"#30d158",fontSize:11}}>✓</span><span style={{color:t.text3,fontSize:12,fontFamily:t.sm}}>{l}</span></div>
        ))}
      </Card>
      <InfoBox color="#ffd60a" text="RGPD Art. 9.2.j · Hébergement EU · Conservation 5 ans · Retrait possible à tout moment" icon="⚖️"/>
      <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:16}}>
        {[["a","Cet outil est une aide au dépistage, pas un diagnostic médical."],["b","J'accepte l'utilisation anonyme de mes analyses pour améliorer l'IA."],["c","Je peux retirer ce consentement à tout moment dans les réglages."]].map(([k,txt])=>(
          <div key={k} onClick={()=>setCk(c=>({...c,[k]:!c[k]}))} style={{display:"flex",gap:10,cursor:"pointer",background:t.bg2,borderRadius:12,padding:"11px 12px",border:`1px solid ${ck[k]?"rgba(10,132,255,.4)":t.border}`,transition:"border .18s"}}>
            <div style={{width:20,height:20,borderRadius:5,border:`2px solid ${ck[k]?"#0a84ff":t.bg4}`,background:ck[k]?"#0a84ff":"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all .18s"}}>
              {ck[k]&&<svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={3} strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>}
            </div>
            <div style={{color:ck[k]?t.text:t.text3,fontSize:12,fontFamily:t.sm,lineHeight:1.5,transition:"color .18s"}}>{txt}</div>
          </div>
        ))}
      </div>
      <PrimaryBtn label="J'accepte et je continue" onClick={onAccept} disabled={!all} style={{marginBottom:9}}/>
      <button onClick={onDecline} style={{width:"100%",padding:"12px 0",borderRadius:13,border:`1px solid ${t.bg4}`,background:"transparent",color:t.text3,fontSize:14,fontFamily:t.sm,cursor:"pointer"}}>Continuer sans accepter</button>
    </div>
  );
}


// ── APP ROOT ──────────────────────────────────────────────────
export default function App(){
  const [darkMode,setDarkMode]=useState(true); // default dark, like Apple Activity
  const t=darkMode?DARK:LIGHT;

  const [screen,setScreen]=useState("landing");
  const [tab,setTab]=useState("home");
  const [user,setUser]=useState(null);
  const [scans,setScans]=useState(()=>DB.get("guest_scans",[]));
  const [glycLogs,setGlycLogs]=useState(()=>DB.get("guest_glyc",[]));
  const [authMode,setAuthMode]=useState("login");
  const [showAuth,setShowAuth]=useState(false);
  const [subScreen,setSubScreen]=useState(null);
  const [detail,setDetail]=useState(null);
  const [notif,setNotif]=useState(null);
  const [screenKey,setScreenKey]=useState(0);

  useEffect(()=>{DB.set("guest_scans",scans);},[scans]);
  useEffect(()=>{DB.set("guest_glyc",glycLogs);},[glycLogs]);

  // Smart notifications on mount
  useEffect(()=>{
    const today=new Date().toISOString().slice(0,10);
    const rdvs=DB.get("rdvs",[]);
    const upcoming=rdvs.filter(r=>r.date>=today).sort((a,b)=>a.date.localeCompare(b.date));
    if(upcoming.length>0){
      const next=upcoming[0];
      const days=Math.ceil((new Date(next.date+"T12:00")-Date.now())/86400000);
      if(days<=7){
        setTimeout(()=>setNotif({icon:"📅",color:"#0a84ff",title:days===0?"RDV aujourd'hui !":days===1?"RDV demain":"RDV dans "+days+" jours",body:next.type+(next.note?" · "+next.note:""),action:()=>{setSubScreen("rdv");setNotif(null);}}),800);
        return;
      }
    }
    const hasFO=rdvs.some(r=>r.date>=today&&(r.type==="Fond d'œil"||r.type==="Ophtalmologue"));
    if(!hasFO){
      const lastScan=DB.get("guest_scans",[]);
      const daysSinceScan=lastScan[0]?Math.floor((Date.now()-new Date(lastScan[0].date))/86400000):999;
      if(daysSinceScan>300){
        setTimeout(()=>setNotif({icon:"👁️",color:"#ff9f0a",title:"Fond d'œil annuel",body:"Aucun RDV ophtalmologique programmé. Planifiez votre contrôle.",action:()=>{setSubScreen("rdv");setNotif(null);}}),1200);
      }
    }
    const glycToday=DB.get("guest_glyc",[]).filter(g=>g.date===today);
    if(glycToday.length===0&&new Date().getHours()>=9){
      setTimeout(()=>setNotif({icon:"💉",color:"#30d158",title:"Glycémie du jour",body:"Vous n'avez pas encore enregistré de mesure aujourd'hui.",action:()=>{setSubScreen("glycemia");setNotif(null);}}),2000);
    }
  },[]);

  const login=u=>{setUser(u);setScreen("app");setShowAuth(false);};
  const logout=()=>{DB.del("sess");setUser(null);setScans([]);setGlycLogs([]);setScreen("landing");};
  const addScan=s=>{setScans(p=>[s,...p]);setTab("home");};
  const addGlyc=g=>{setGlycLogs(p=>[...p,g]);};
  const delScan=id=>setScans(p=>p.filter(s=>s.id!==id));
  const updateConsent=()=>{
    if(!user) return;
    const users=DB.get("users",{});
    const u={...user,consentGiven:!user.consentGiven};
    users[u.email]=u;DB.set("users",users);setUser(u);
  };
  const switchTab=(v)=>{setTab(v);setSubScreen(null);setDetail(null);setScreenKey(k=>k+1);};

  const navigate=dest=>{
    if(dest==="settings") setSubScreen("settings");
    else if(dest==="glycemia") setSubScreen("glycemia");
    else if(dest==="auth"){setAuthMode("register");setShowAuth(true);}
  };

  const renderMain=()=>{
    if(subScreen==="settings") return <SettingsScreen onBack={()=>setSubScreen(null)} darkMode={darkMode} setDarkMode={setDarkMode}/>;
    if(subScreen==="glycemia") return <GlycemiaScreen glycLogs={glycLogs} onSave={g=>{addGlyc(g);}} onBack={()=>setSubScreen(null)}/>;
    if(subScreen==="vision") return <VisionScreen onBack={()=>setSubScreen(null)}/>;
    if(subScreen==="rdv") return <RDVScreen onBack={()=>setSubScreen(null)}/>;
    switch(tab){
      case"home": return <HomeScreen user={user} scans={scans} glycLogs={glycLogs} onNavigate={navigate} onGoGlyc={()=>setSubScreen("glycemia")} onGoVision={()=>setSubScreen("vision")} onGoRDV={()=>setSubScreen("rdv")}/>;
      case"scan": return <ScanScreen user={user} onDone={s=>{addScan(s);setSubScreen(null);}}/>;
      case"history": return <HistoryScreen scans={scans} glycLogs={glycLogs} onScanDetail={s=>{setDetail(s);setTab("profile");}}/>;
      case"chat": return <ChatScreen/>;
      case"profile": return <ProfileScreen user={user} scans={scans} onDelete={delScan} onLogout={logout} onShowAuth={()=>{setAuthMode("register");setShowAuth(true);}} onUpdateConsent={updateConsent} detail={detail} setDetail={setDetail}/>;
      default: return null;
    }
  };

  const showTab=!subScreen||subScreen==="vision";

  // ── Landing screen (no tab bar)
  if(screen==="landing") return(
    <ThemeCtx.Provider value={t}>
      <div style={{background:t.isDark?"radial-gradient(ellipse 65% 55% at 18% 22%, rgba(10,132,255,0.22) 0%, transparent 100%), radial-gradient(ellipse 55% 65% at 82% 78%, rgba(191,90,242,0.16) 0%, transparent 100%), #000000":"radial-gradient(ellipse 65% 55% at 18% 22%, rgba(10,132,255,0.09) 0%, transparent 100%), #f2f2f7",width:"100vw",height:"100vh",overflow:"hidden",position:"relative",maxWidth:430,margin:"0 auto"}}>
        <div style={{width:"100%",height:"100%",overflowY:"auto",overflowX:"hidden"}}>
          <LandingScreen onGuest={()=>setScreen("app")} onLogin={()=>{setAuthMode("login");setShowAuth(true);}} onRegister={()=>{setAuthMode("register");setShowAuth(true);}}/>
        </div>
        {showAuth&&<AuthModal mode={authMode} onClose={()=>setShowAuth(false)} onLogin={login}/>}
      </div>
    </ThemeCtx.Provider>
  );

  // ── Main app
  return(
    <ThemeCtx.Provider value={t}>
      {/* Global keyframe injection */}
      <style>{`
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
        @keyframes slideUp{from{transform:translateY(100%);opacity:0}to{transform:translateY(0);opacity:1}}
        .screen-in{animation:screenIn .3s cubic-bezier(.25,.46,.45,.94) both}
        .fade-up{animation:fadeUp .38s cubic-bezier(.25,.46,.45,.94) both}
        .fade-up-1{animation:fadeUp .38s .07s cubic-bezier(.25,.46,.45,.94) both}
        .fade-up-2{animation:fadeUp .38s .14s cubic-bezier(.25,.46,.45,.94) both}
        .fade-up-3{animation:fadeUp .38s .22s cubic-bezier(.25,.46,.45,.94) both}
        @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        @keyframes screenIn{from{opacity:0;transform:translateY(10px) scale(0.99)}to{opacity:1;transform:translateY(0) scale(1)}}
        @keyframes notifDrop{from{opacity:0;transform:translateY(-20px) scale(0.96)}to{opacity:1;transform:translateY(0) scale(1)}}
        .notif-in{animation:notifDrop .35s cubic-bezier(.25,.46,.45,.94) both}
      `}</style>

      <div style={{
        background:t.isDark
          ?"radial-gradient(ellipse 65% 55% at 18% 22%, rgba(10,132,255,0.22) 0%, transparent 100%), radial-gradient(ellipse 55% 65% at 82% 78%, rgba(191,90,242,0.16) 0%, transparent 100%), radial-gradient(ellipse 40% 40% at 50% 50%, rgba(48,209,88,0.07) 0%, transparent 100%), #000000"
          :"radial-gradient(ellipse 65% 55% at 18% 22%, rgba(10,132,255,0.09) 0%, transparent 100%), radial-gradient(ellipse 55% 65% at 82% 78%, rgba(191,90,242,0.07) 0%, transparent 100%), #f2f2f7",
        width:"100vw",
        height:"100%",
        maxWidth:430,
        margin:"0 auto",
        position:"relative",
        overflow:"hidden",
      }}>
        {/* ── Smart notification banner (Apple-style glass drop) */}
        {notif&&(
          <div className="notif-in" style={{position:"absolute",top:0,left:0,right:0,zIndex:1500,padding:"50px 12px 0",pointerEvents:"none",display:"flex",justifyContent:"center"}}>
            <div onClick={notif.action} style={{
              pointerEvents:"all",
              maxWidth:430,width:"100%",
              background:t.isDark?"rgba(28,28,30,0.94)":"rgba(255,255,255,0.96)",
              backdropFilter:"blur(30px) saturate(180%)",
              WebkitBackdropFilter:"blur(30px) saturate(180%)",
              borderRadius:18,padding:"12px 14px",
              border:`1px solid ${notif.color}33`,
              boxShadow:`0 4px 28px rgba(0,0,0,0.2), 0 0 0 1px ${notif.color}22`,
              display:"flex",gap:11,alignItems:"center",cursor:"pointer",
            }}>
              <div style={{width:38,height:38,borderRadius:11,background:notif.color+"18",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>{notif.icon}</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{color:t.text,fontSize:13,fontWeight:700,fontFamily:t.sm}}>{notif.title}</div>
                <div style={{color:t.text3,fontSize:12,fontFamily:t.sm,marginTop:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{notif.body}</div>
              </div>
              <button onClick={e=>{e.stopPropagation();setNotif(null);}} style={{background:"none",border:"none",color:t.text4,fontSize:20,cursor:"pointer",padding:"0 2px",flexShrink:0}}>×</button>
            </div>
          </div>
        )}

        {/* ── Scrollable screen area — content scrolls UNDER the glass tab bar */}
        <div
          key={screenKey}
          className="screen-in"
          style={{
            width:"100%",
            height:"100%",
            overflowY:"auto",
            overflowX:"hidden",
            WebkitOverflowScrolling:"touch",
          }}
        >
          {renderMain()}
        </div>

        {/* ── Floating glass tab bar — FIXED over content */}
        {showTab&&<TabBar tab={tab} set={switchTab}/>}

        {/* ── Auth modal */}
        {showAuth&&<AuthModal mode={authMode} onClose={()=>setShowAuth(false)} onLogin={login}/>}
      </div>
    </ThemeCtx.Provider>
  );
}
