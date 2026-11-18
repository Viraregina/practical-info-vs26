"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
const localAsset = (path:string) => `${basePath}${path}`;

type Place = { id:string; name:string; short:string; address:string; x:number; y:number; kind:"venue"|"bar"|"visit" };

const places: Place[] = [
  {id:"solis",name:"Teatro Solís",short:"Solís",address:"Buenos Aires y Bartolomé Mitre",x:46,y:63,kind:"venue"},
  {id:"sodre",name:"Auditorio Nacional Adela Reta",short:"Adela Reta · SODRE",address:"Andes y Mercedes",x:58,y:22,kind:"venue"},
  {id:"cinemateca",name:"Cinemateca Uruguaya",short:"Cinemateca",address:"Bartolomé Mitre 1236",x:36,y:68,kind:"venue"},
  {id:"nelly",name:"Auditorio Nelly Goitiño",short:"Nelly Goitiño",address:"18 de Julio 930",x:75,y:52,kind:"venue"},
  {id:"cce",name:"Centro Cultural de España",short:"CCE",address:"Rincón 629",x:29,y:36,kind:"venue"},
  {id:"aecid",name:"Cooperación Española · AECID",short:"AECID",address:"25 de Mayo 520",x:16,y:49,kind:"venue"},
  {id:"museo",name:"Sala del Museo · MUS",short:"Sala del Museo",address:"Rambla 25 de Agosto de 1825 218",x:9,y:24,kind:"venue"},
  {id:"maua",name:"Parque Mauá",short:"Parque Mauá",address:"Rambla Sur",x:88,y:78,kind:"venue"},
  {id:"brasilero",name:"Café Brasilero",short:"Café Brasilero",address:"Ituzaingó 1447",x:35,y:47,kind:"bar"},
  {id:"montevideosur",name:"Montevideo al Sur",short:"Montevideo al Sur",address:"Paraguay 1150",x:68,y:58,kind:"bar"},
  {id:"paysandu",name:"Bar Paysandú",short:"Bar Paysandú",address:"Av. Gral. Rondeau 1549",x:69,y:34,kind:"bar"},
  {id:"santacatalina",name:"Santa Catalina",short:"Santa Catalina",address:"Ciudadela 1200",x:49,y:66,kind:"bar"},
  {id:"ladiaria",name:"Café la diaria",short:"Café la diaria",address:"Bacacay 1306",x:44,y:66,kind:"bar"},
  {id:"brecha",name:"Brecha Bar y Café",short:"Brecha Bar y Café",address:"Aquiles Lanza 1201",x:86,y:66,kind:"bar"},
  {id:"martei",name:"Martei Café",short:"Martei Café",address:"Florida 1487",x:55,y:36,kind:"bar"},
  {id:"capicua",name:"Destilería Capicúa",short:"Destilería Capicúa",address:"Pérez Castellano 1364",x:15,y:67,kind:"bar"},
  {id:"fotogaleria",name:"Fotogalería Parque Rodó",short:"Fotogalería Parque Rodó",address:"Rambla Wilson y Pablo de María",x:80,y:88,kind:"visit"},
  {id:"cdf",name:"Centro de Fotografía",short:"CdF",address:"Av. 18 de Julio 885",x:75,y:51,kind:"visit"},
  {id:"busturistico",name:"Bus Turístico · Mercado del Puerto",short:"Bus Turístico",address:"Mercado del Puerto",x:8,y:43,kind:"visit"},
  {id:"planetario",name:"Planetario de Montevideo",short:"Planetario",address:"Av. Rivera 3275",x:97,y:20,kind:"visit"},
];

const venueOptions = places.filter((p)=>p.kind === "venue");
const barSources:Record<string,string>={montevideosur:"https://www.gub.uy/ministerio-educacion-cultura/patrimonio-uruguay/guia-actividades-dia-del-patrimonio-2026/montevideo/barrio-sur",paysandu:"https://paseocentro.com.uy/bar-paysandu/",santacatalina:"https://www.gub.uy/ministerio-educacion-cultura/patrimonio-uruguay/guia-actividades-dia-del-patrimonio-2026/montevideo/barrio-sur",brasilero:"https://cafebrasilero.uy/",ladiaria:"https://ladiaria.com.uy/",brecha:"https://1122.com.uy/local/brecha-bar-y-cafe/LOC556280001",martei:"https://www.instagram.com/martei.cafe/",capicua:"https://eventos.montevideo.gub.uy/evento/sabados-en-ciudad-vieja/musica-en-vivo-en-destileria-capicua"};
const barInstagram:Record<string,string>={montevideosur:"mvdalsur",paysandu:"paysandu_bar",santacatalina:"santacatalinabar",brasilero:"cafebrasilero.uy",ladiaria:"ladiaria",brecha:"elbar_delxsamigxs",martei:"martei.cafe",capicua:"destileriacapicua"};
const barMarks:Record<string,string>={montevideosur:"MVD\nAL SUR",paysandu:"BAR\nPAYSANDÚ",santacatalina:"SANTA\nCATALINA",brasilero:"CAFÉ\nBRASILERO",ladiaria:"la diaria",brecha:"BRECHA",martei:"martei",capicua:"CAPICÚA"};
const coordinates:Record<string,{lat:number;lng:number}>={solis:{lat:-34.9078788,lng:-56.2010001},sodre:{lat:-34.9042808,lng:-56.198708},cinemateca:{lat:-34.908515,lng:-56.2008552},nelly:{lat:-34.9064151,lng:-56.196285},cce:{lat:-34.9057785,lng:-56.2027206},aecid:{lat:-34.9057873,lng:-56.2052188},museo:{lat:-34.9057085,lng:-56.21217},maua:{lat:-34.9121908,lng:-56.1960524},montevideosur:{lat:-34.9098214,lng:-56.1920231},paysandu:{lat:-34.9022743,lng:-56.1919269},santacatalina:{lat:-34.909496,lng:-56.1999995},brasilero:{lat:-34.9056692,lng:-56.2046929},ladiaria:{lat:-34.9072987,lng:-56.2013957},brecha:{lat:-34.9084142,lng:-56.18779},martei:{lat:-34.9039968,lng:-56.1996303},capicua:{lat:-34.9088117,lng:-56.2098835},fotogaleria:{lat:-34.9134288,lng:-56.1693808},cdf:{lat:-34.906209,lng:-56.1973729},busturistico:{lat:-34.9064,lng:-56.2114},planetario:{lat:-34.90186,lng:-56.14455}};
const venueMeta:Record<string,{role:string;image:string}>={
  sodre:{role:"Sede principal · mercado y reuniones",image:"https://media.telenoche.com.uy/p/b60378f55e7f3968a8223a5647d15a33/adjuntos/329/imagenes/000/196/0000196729/1200x630/smart/auditorio-sodrejpg.jpg"},
  solis:{role:"Conferencias, pitchings y networking",image:"https://www.teatrosolis.org.uy/imgnoticias/202503/5968.jpg"},
  cinemateca:{role:"Proyecciones del mercado",image:"https://ladiaria.com.uy/media/photologue/photos/cache/RS49954_20200525ER_0310_edit_1200w.jpg"},
  nelly:{role:"Secciones y proyecciones especiales",image:"https://sodre.gub.uy/institucional/wp-content/themes/cygnus/images/nelly_goitino.jpg"},
  cce:{role:"Talleres y actividades de industria",image:"https://www.descubrimontevideo.uy/sites/default/files/styles/escala_y_recorte_1400x800/public/2022-12/centrocultural%20espa%C3%B1a.jpg?itok=_y0Uzr0F"},
  aecid:{role:"Talleres de los programas de industria",image:"https://cdf.montevideo.gub.uy/system/files/imagecache/Foto_destacada_645_430/fotos/tu79.jpg"},
  maua:{role:"Cine al aire libre",image:"https://montevideo.gub.uy/sites/default/files/styles/galleria/public/2025-12/20251219dicimouyit7952.jpg?itok=SAwOEWo5"},
  fotogaleria:{role:"Exposición · 130 años de cine en Uruguay",image:"https://cdf.montevideo.gub.uy/system/files/imagecache/Foto_destacada_645_430/fotos/1_59.jpg"},
  busturistico:{role:"Punto de encuentro · recorrido por locaciones",image:"https://www.descubrimontevideo.uy/sites/default/files/styles/escala_y_recorte_1400x800/public/2024-11/DSC01005_1.jpg?itok=N832JJz8"},
  planetario:{role:"Actividad fulldome · información a confirmar",image:"https://upload.wikimedia.org/wikipedia/commons/f/f4/Planetario_2.jpg"}
};

function DollIcon(){
  return <svg className="cover-doll-svg" viewBox="0 0 250 390" role="img" aria-label="Participante de Ventana Sur">
    <ellipse cx="124" cy="363" rx="74" ry="11" fill="#111e56" opacity=".2"/>
    <g className="cover-bike" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="50" cy="302" r="38" stroke="#53f6c6" strokeWidth="7"/><circle cx="200" cy="302" r="38" stroke="#53f6c6" strokeWidth="7"/>
      <path d="M50 302l43-63 39 63H50Zm43-63h45l62 63m-68 0 27-86m-10 0h27M80 228h31" stroke="#fff8ed" strokeWidth="7"/>
      <circle cx="132" cy="302" r="7" fill="#edb0ca" stroke="#edb0ca" strokeWidth="2"/>
      <path d="M128 302l-16 20m20-20 17 18" stroke="#edb0ca" strokeWidth="5"/>
    </g>
    <path d="M97 268L80 347" stroke="#172f62" strokeWidth="27" strokeLinecap="round"/><path d="M79 346l-13 15h35" fill="none" stroke="#fff8ed" strokeWidth="12" strokeLinejoin="round"/>
    <path d="M139 269l21 78" stroke="#25487e" strokeWidth="27" strokeLinecap="round"/><path d="M159 347l5 14h29" fill="none" stroke="#e9b8ce" strokeWidth="12" strokeLinejoin="round"/>
    <path d="M84 171q37-24 74 2l19 98q-47 25-101 0Z" fill="#edb0ca"/>
    <path d="M84 171q37-24 74 2l19 98q-47 25-101 0Z" fill="none" stroke="#fff" strokeWidth="2" strokeDasharray="12 7" opacity=".26"/>
    <path d="M94 188l-35 62 22 22" fill="none" stroke="#bd785a" strokeWidth="15" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M119 151v23" stroke="#bd785a" strokeWidth="20" strokeLinecap="round"/>
    <path d="M84 111q-14-28 8-48 28-24 57 1 19 16 8 47l-16 20H98Z" fill="#182c59"/>
    <path d="M99 92q28-24 52 2v29q-5 27-27 27-24-1-27-26Z" fill="#cf906d"/>
    <path d="M91 105q-9-27 7-41l-3-10 18 3q14-22 34-7l13-3-2 12q15 11 2 43l-13-17q-19 10-31-4-5 18-19 18l2 23h-8Z" fill="#182c59"/>
    <circle cx="140" cy="110" r="2.6" fill="#172d55"/><path d="M135 128q8 6 14-2" fill="none" stroke="#783e41" strokeWidth="2.4" strokeLinecap="round"/>
    <path d="M95 174l27 60 31-59" fill="none" stroke="#3463a5" strokeWidth="6"/><rect x="111" y="226" width="34" height="43" rx="4" fill="#ddffe4"/><path d="M117 240h21m-21 8h15" stroke="#3662a6" strokeWidth="2"/>
    <path d="M157 188l25 50 37-11" fill="none" stroke="#cf906d" strokeWidth="15" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M207 201h18v11l6 9v41q-14 8-30 0v-41l6-9Z" fill="#c6f7e6"/><path d="M203 240h26v19h-26Z" fill="#54b9be"/><rect x="205" y="195" width="22" height="8" rx="3" fill="#ebbadb"/>
  </svg>
}

function AccessibilitySymbol(){
  return <svg className="mini-access-symbol" viewBox="130 120 640 610" aria-hidden="true">
    <g className="symbol-piece symbol-p0"><circle cx="450" cy="260" r="54"/></g>
    <g className="symbol-piece symbol-p1"><path d="M242 344Q450 470 658 344"/></g>
    <g className="symbol-piece symbol-p2"><circle cx="222" cy="333" r="23"/></g>
    <g className="symbol-piece symbol-p3"><circle cx="678" cy="333" r="23"/></g>
    <g className="symbol-piece symbol-p4"><path d="M327 590L450 412L573 590"/></g>
    <g className="symbol-piece symbol-p5"><circle cx="327" cy="613" r="23"/></g>
    <g className="symbol-piece symbol-p6"><circle cx="573" cy="613" r="23"/></g>
    <g className="symbol-piece symbol-p7"><path d="M240 281A243 243 0 0 1 660 281"/></g>
    <g className="symbol-piece symbol-p8"><path d="M687 383Q692 507 612 570"/></g>
    <g className="symbol-piece symbol-p9"><path d="M533 637Q450 676 367 637"/></g>
    <g className="symbol-piece symbol-p10"><path d="M288 570Q208 507 213 383"/></g>
    <g className="symbol-node node-left"><circle cx="222" cy="333" r="10"/></g>
    <g className="symbol-node node-right"><circle cx="678" cy="333" r="10"/></g>
    <g className="symbol-node node-foot-left"><circle cx="327" cy="613" r="10"/></g>
    <g className="symbol-node node-foot-right"><circle cx="573" cy="613" r="10"/></g>
  </svg>
}

function DayParticipantIcon(){
  return <svg className="day-participant-svg" viewBox="120 105 470 350" aria-hidden="true">
    <defs><pattern id="mini-stripes" width="16" height="16" patternUnits="userSpaceOnUse"><path d="M0 8H16" stroke="#fff" strokeWidth="2" opacity=".13"/></pattern></defs>
    <ellipse cx="282" cy="445" rx="110" ry="13" fill="#103e6b" opacity=".16"/>
    <g className="mini-bin"><path d="M393 430V379Q393 341 429 341H499Q537 341 537 379V430" fill="#e4b1d0"/><circle cx="464" cy="308" r="31" fill="#ba8265"/><path d="M432 302Q429 269 465 269Q501 270 497 302L480 287L443 302Z" fill="#1b335f"/><text x="465" y="395" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="34" fill="#33669e">♻</text></g>
    <g className="mini-person-original">
      <g className="mini-leg"><path d="M230 331L215 421" stroke="#172f62" strokeWidth="27" strokeLinecap="round"/><path d="M214 419L201 435H235" fill="#f6e9dd" stroke="#f6e9dd" strokeWidth="12" strokeLinejoin="round"/></g>
      <g className="mini-leg"><path d="M257 332L280 421" stroke="#25487e" strokeWidth="27" strokeLinecap="round"/><path d="M281 421L285 435H310" fill="#e9b8ce" stroke="#e9b8ce" strokeWidth="12" strokeLinejoin="round"/></g>
      <path d="M216 232Q240 218 265 235L280 333Q244 347 205 332Z" fill="#edb0ca"/><path d="M216 232Q240 218 265 235L280 333Q244 347 205 332Z" fill="url(#mini-stripes)"/>
      <path d="M220 248L190 305L208 323" fill="none" stroke="#bd785a" strokeWidth="15" strokeLinecap="round" strokeLinejoin="round"/><path d="M240 215V234" stroke="#bd785a" strokeWidth="20" strokeLinecap="round"/>
      <path d="M212 177Q201 154 217 138Q235 119 260 135Q278 143 272 177L262 190H222Z" fill="#182c59"/><path d="M222 161Q247 143 265 167V190Q262 212 244 212Q225 211 221 191Z" fill="#cf906d"/><path d="M215 173Q207 158 215 145L211 139L227 141Q237 124 252 132L262 129L262 137Q278 143 269 170L258 159Q246 164 234 155Q230 167 220 169L222 185H216Z" fill="#182c59"/>
      <circle cx="255" cy="179" r="2.5" fill="#172d55"/><path d="M251 194Q257 197 262 191" fill="none" stroke="#783e41" strokeWidth="2" strokeLinecap="round"/>
      <path d="M224 237L244 283L263 238" fill="none" stroke="#3463a5" strokeWidth="6"/><rect x="233" y="278" width="30" height="40" rx="4" fill="#ddffe4"/><path d="M239 291H257M239 298H251" stroke="#3662a6" strokeWidth="2"/>
      <g className="mini-arm"><path d="M264 248L283 286L317 278" fill="none" stroke="#cf906d" strokeWidth="15" strokeLinecap="round" strokeLinejoin="round"/><g className="mini-bottle"><path d="M310 257H324V267L329 274V306Q319 312 306 306V274L310 267Z" fill="#c6f7e6"/><path d="M309 289H326V303H309Z" fill="#54b9be"/><rect x="309" y="253" width="16" height="7" rx="2" fill="#ebbadb"/></g></g>
      <g className="mini-phone"><rect x="304" y="252" width="24" height="38" rx="4" fill="#111e56"/><rect x="308" y="257" width="16" height="24" rx="2" fill="#53f6c6"/><circle cx="316" cy="285" r="1.8" fill="#fff"/></g>
      <g className="mini-cup"><path d="M303 266h25v25q-12 8-25 0Z" fill="#fff3dd"/><path d="M328 271h6q10 0 4 13h-10" fill="none" stroke="#fff3dd" strokeWidth="6"/><path d="M308 258q-5-9 2-15m8 15q-5-9 2-15" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round"/></g>
    </g>
    <g className="mini-bike-echo" transform="translate(354 300) scale(.58)" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="50" cy="140" r="38" stroke="#53f6c6" strokeWidth="7"/><circle cx="200" cy="140" r="38" stroke="#53f6c6" strokeWidth="7"/>
      <path d="M50 140l43-63 39 63H50Zm43-63h45l62 63m-68 0 27-86m-10 0h27M80 66h31" stroke="#fff8ed" strokeWidth="7"/>
      <circle cx="132" cy="140" r="7" fill="#edb0ca" stroke="#edb0ca" strokeWidth="2"/><path d="M128 140l-16 20m20-20 17 18" stroke="#edb0ca" strokeWidth="5"/>
    </g>
    <g className="mini-sort-bins"><path d="M400 430v-80h58v80Z" fill="#53f6c6"/><path d="M393 348h72v12h-72Z" fill="#111e56"/><text x="429" y="401" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="29" fill="#111e56">♻</text><path d="M472 430v-80h58v80Z" fill="#edb0ca"/><path d="M465 348h72v12h-72Z" fill="#111e56"/><circle cx="501" cy="391" r="13" fill="none" stroke="#111e56" strokeWidth="4"/></g>
  </svg>
}

function MiniDayDoll(){
  return <div className="mini-day-scene" aria-hidden="true">
    <span className="day-sun"/><span className="day-moon"/><span className="day-stars">· ✦ ·</span>
    <div className="day-doll"><DayParticipantIcon/></div>
  </div>
}

function BubbleIcon({type}:{type:string}){
  if(type==="badge")return <svg viewBox="0 0 24 24"><rect x="6" y="4" width="12" height="16" rx="2"/><path d="M9 8h6m-6 4h4m-1-8V2"/></svg>;
  if(type==="info")return <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/><path d="M12 11v6m0-10h.01"/></svg>;
  if(type==="route")return <svg viewBox="0 0 24 24"><path d="M5 19c6 0 2-12 8-12 3 0 2 5 6 5"/><circle cx="5" cy="19" r="2"/><circle cx="19" cy="12" r="2"/></svg>;
  if(type==="venue")return <svg viewBox="0 0 24 24"><path d="M4 20h16M6 20V9h12v11M9 9V5h6v4m-6 4h2m2 0h2m-6 4h2m2 0h2"/></svg>;
  if(type==="film")return <svg viewBox="0 0 24 24"><rect x="4" y="6" width="16" height="12" rx="2"/><path d="M8 6v12m8-12v12M4 10h4m8 0h4M4 14h4m8 0h4"/></svg>;
  if(type==="local")return <svg viewBox="0 0 24 24"><path d="M6 10h12v4a6 6 0 0 1-12 0Zm12 1h1a2 2 0 0 1 0 4h-1M5 20h14"/></svg>;
  return <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v3m0 14v3M2 12h3m14 0h3M5 5l2 2m10 10 2 2M19 5l-2 2M7 17l-2 2"/></svg>;
}

function ParticipationIcon({type}:{type:"badge"|"meeting"|"eventival"|"cinando"}){
  if(type==="eventival") return <span className="brand-lockup eventival-lockup"><b>e</b><strong>eventival</strong></span>;
  if(type==="cinando") return <span className="brand-lockup cinando-lockup"><strong>CINANDO</strong><small>THE FILM INDUSTRY NETWORK</small></span>;
  if(type==="meeting") return <svg viewBox="0 0 48 48" fill="none"><path d="M24 42s13-12.1 13-24a13 13 0 1 0-26 0c0 11.9 13 24 13 24Z"/><circle cx="24" cy="18" r="5"/><path d="M16.5 29c2.2-3.5 4.7-5.2 7.5-5.2s5.3 1.7 7.5 5.2"/></svg>;
  return <svg viewBox="0 0 48 48" fill="none"><path d="M18 8h12v7H18zM12 14h24v27H12z"/><circle cx="24" cy="24" r="5"/><path d="M17 35c1.8-4.1 4.1-6.1 7-6.1s5.2 2 7 6.1"/></svg>;
}

export default function Home(){
  const [page,setPage] = useState(0);
  const [lang,setLang] = useState<"es"|"en">("es");
  const [origin,setOrigin] = useState("solis");
  const [destination,setDestination] = useState("sodre");
  const [mode,setMode] = useState<"walking"|"driving">("walking");
  const [showBars,setShowBars] = useState(true);
  const [showVisits,setShowVisits] = useState(true);
  const [barsOpen,setBarsOpen] = useState(false);
  const [pdfNotice,setPdfNotice] = useState(false);
  const [scrolled,setScrolled] = useState(false);
  const [liveRoute,setLiveRoute]=useState<{meters:number;minutes:number}|null>(null);
  const mapRef=useRef<any>(null);
  const markersRef=useRef<Record<string,any>>({});
  const routeLayerRef=useRef<any>(null);
  const a = places.find((p)=>p.id===origin)!;
  const b = places.find((p)=>p.id===destination)!;
  const route = useMemo(()=>{
    const d=Math.hypot(b.x-a.x,b.y-a.y);
    const meters=Math.round(d*42/10)*10;
    const minutes=Math.max(2,Math.round(meters/(mode==="walking"?75:260)));
    return {meters,minutes};
  },[a,b,mode]);
  const swap=()=>{setOrigin(destination);setDestination(origin)};
  const tr=(es:string,en:string)=>lang==="es"?es:en;
  const routeOptions=places.filter((p)=>p.kind==="venue"||(p.kind==="bar"&&showBars)||(p.kind==="visit"&&showVisits));
  const pageNames=[tr("Inicio","Home"),tr("Tu participación","Your participation"),tr("Información útil","Visitor information"),tr("Sedes y recorridos","Venues and routes"),tr("Conoce las sedes","Explore the venues"),tr("Recomendados","Recommended"),tr("Conoce lo local","Meet the local scene"),tr("Montevideo y Uruguay","Montevideo and Uruguay")];
  const pageIds=["inicio","participacion","antes","mapa","sedes","agenda","local","montevideo"];
  const goToPage=(index:number)=>{
    const next=Math.max(0,Math.min(7,index));
    setPage(next);
    document.getElementById(pageIds[next])?.scrollIntoView({behavior:"smooth",block:"start"});
  };
  useEffect(()=>{
    if(new URLSearchParams(window.location.search).get("lang")==="en")setLang("en");
  },[]);
  useEffect(()=>{
    document.documentElement.lang=lang;
  },[lang]);
  useEffect(()=>{
    const updateScroll=()=>setScrolled(window.scrollY>80);
    updateScroll();
    window.addEventListener("scroll",updateScroll,{passive:true});
    return()=>window.removeEventListener("scroll",updateScroll);
  },[]);
  useEffect(()=>{
    const onKey=(event:KeyboardEvent)=>{
      if(event.key==="ArrowRight"||event.key==="PageDown") goToPage(page+1);
      if(event.key==="ArrowLeft"||event.key==="PageUp") goToPage(page-1);
    };
    window.addEventListener("keydown",onKey);
    return ()=>window.removeEventListener("keydown",onKey);
  },[page]);
  useEffect(()=>{
    const observer=new IntersectionObserver((entries)=>{
      const visible=entries.filter((entry)=>entry.isIntersecting).sort((x,y)=>y.intersectionRatio-x.intersectionRatio)[0];
      if(visible){const index=pageIds.indexOf(visible.target.id);if(index>=0)setPage(index)}
    },{threshold:[.35,.6]});
    pageIds.forEach((id)=>{const element=document.getElementById(id);if(element)observer.observe(element)});
    return ()=>observer.disconnect();
  },[]);
  useEffect(()=>{
    let timer:number|undefined;
    const initialise=()=>{
      const L=(window as any).L;
      if(!L){timer=window.setTimeout(initialise,100);return}
      if(mapRef.current)return;
      const map=L.map("real-city-map",{scrollWheelZoom:false}).setView([-34.9067,-56.202],15);
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png",{maxZoom:19,attribution:'&copy; OpenStreetMap · Recorridos FOSSGIS / OSRM'}).addTo(map);
      places.filter((place)=>coordinates[place.id]).forEach((place)=>{const point=coordinates[place.id];const meta=venueMeta[place.id];const popup=meta?`<article class="map-photo-popup"><img src="${meta.image}" alt=""><small>${meta.role}</small><strong>${place.name}</strong><span>${place.address}</span></article>`:`<strong>${place.name}</strong><br>${place.address}<br><small>${place.kind==="bar"?"Bar amigo":place.kind==="visit"?"Para visitar":"Sede Ventana Sur"}</small>`;const marker=L.marker([point.lat,point.lng],{icon:L.divIcon({className:`real-marker ${place.kind}`,html:"<span></span>",iconSize:[22,22],iconAnchor:[11,11]}),title:place.name}).bindTooltip(place.short,{direction:"top"}).bindPopup(popup,{className:"venue-map-popup",minWidth:210});marker.on("click",()=>setDestination(place.id));markersRef.current[place.id]=marker;marker.addTo(map)});
      routeLayerRef.current=L.layerGroup().addTo(map);mapRef.current=map;
    };
    initialise();
    return()=>{if(timer)window.clearTimeout(timer);mapRef.current?.remove();mapRef.current=null;markersRef.current={}};
  },[]);
  useEffect(()=>{
    const map=mapRef.current;if(!map)return;
    places.forEach((place)=>{const marker=markersRef.current[place.id];if(!marker)return;const visible=place.kind==="venue"||(place.kind==="bar"&&showBars)||(place.kind==="visit"&&showVisits);if(visible&&!map.hasLayer(marker))marker.addTo(map);if(!visible&&map.hasLayer(marker))map.removeLayer(marker)});
    if(!routeOptions.some((place)=>place.id===origin))setOrigin("solis");
    if(!routeOptions.some((place)=>place.id===destination))setDestination("sodre");
  },[showBars,showVisits]);
  useEffect(()=>{
    const map=mapRef.current,L=(window as any).L;if(!map||!L)return;
    const start=coordinates[origin],end=coordinates[destination];if(!start||!end)return;
    const controller=new AbortController();
    fetch(`https://routing.openstreetmap.de/routed-${mode==="walking"?"foot":"car"}/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson`,{signal:controller.signal}).then((response)=>response.json()).then((data)=>{
      const result=data.routes?.[0];if(!result)return;routeLayerRef.current.clearLayers();
      const points=result.geometry.coordinates.map((point:number[])=>[point[1],point[0]]);
      L.polyline(points,{color:"#fffaf4",weight:10,opacity:.95}).addTo(routeLayerRef.current);
      const path=L.polyline(points,{color:"#00b388",weight:mode==="walking"?4:6,dashArray:mode==="walking"?"3 12":undefined,lineCap:"round"}).addTo(routeLayerRef.current);
      map.fitBounds(path.getBounds(),{padding:[45,45],maxZoom:17});setLiveRoute({meters:result.distance,minutes:Math.max(1,Math.ceil(result.duration/60))});
    }).catch(()=>{});return()=>controller.abort();
  },[origin,destination,mode]);

  return <main className="reader-shell">
    <div className="language-switch"><button onClick={()=>setLang(lang==="es"?"en":"es")} aria-label={tr("Cambiar a inglés","Switch to Spanish")}><span className={lang==="es"?"active":""}>🇺🇾 ES</span><i>/</i><span className={lang==="en"?"active":""}>🇬🇧 EN</span></button></div>
    {basePath&&<a className={`back-to-plan ${scrolled?"is-scrolled":""}`} href="/" aria-label={tr("Volver al Plan de sustentabilidad","Back to the Sustainability plan")}><span aria-hidden="true">←</span><strong>{tr("Plan de sustentabilidad","Sustainability plan")}</strong></a>}
    <div className="document-shell" aria-live="polite">
    <section className="sheet cover" id="inicio">
      <div className="sheet-head">
        <img src={localAsset("/ventana-sur-crisp.png")} alt="Ventana Sur" />
        <p>30 NOV—04 DIC 2026<br/>MONTEVIDEO · URUGUAY</p>
      </div>
      <div className="cover-title">
        <h1>{tr("Información","Practical")}<br/>{tr("práctica","information")}</h1>
        <button className="cover-pdf" type="button" onClick={()=>{setPdfNotice(true);window.setTimeout(()=>setPdfNotice(false),2600)}}>{tr("Descargar PDF en español","Download English PDF")} <b>↓</b></button>
      </div>
      <div className="cover-orbit" aria-label={tr("Secciones de la guía","Guide sections")}>
        <div className="orbit-lines" aria-hidden="true"><span/><span/><span/></div>
        <div className="cover-doll"><DollIcon/></div>
        <button className="orbit-bubble bubble-participation" onClick={()=>goToPage(1)}><i><BubbleIcon type="badge"/></i><strong>{tr("Tu participación","Your participation")}</strong></button>
        <button className="orbit-bubble bubble-info" onClick={()=>goToPage(2)}><i><BubbleIcon type="info"/></i><strong>{tr("Información útil","Useful information")}</strong></button>
        <button className="orbit-bubble bubble-route" onClick={()=>goToPage(3)}><i><BubbleIcon type="route"/></i><strong>{tr("Mapas y traslados","Maps & transfers")}</strong></button>
        <button className="orbit-bubble bubble-venues" onClick={()=>goToPage(4)}><i><BubbleIcon type="venue"/></i><strong>{tr("Conoce las sedes","Explore the venues")}</strong></button>
        <button className="orbit-bubble bubble-film" onClick={()=>goToPage(5)}><i><BubbleIcon type="film"/></i><strong>{tr("Recomendados","Recommended")}</strong></button>
        <button className="orbit-bubble bubble-local" onClick={()=>goToPage(6)}><i><BubbleIcon type="local"/></i><strong>{tr("Conoce lo local","Meet the local scene")}</strong></button>
        <button className="orbit-bubble bubble-city" onClick={()=>goToPage(7)}><i><BubbleIcon type="city"/></i><strong>{tr("Montevideo y Uruguay","Montevideo & Uruguay")}</strong></button>
      </div>
      <div className="scroll-hint" aria-hidden="true"><span>{tr("Desliza para recorrer","Scroll to explore")}</span><b>↓</b></div>
    </section>

    <section className="sheet participation-sheet" id="participacion">
      <PageHead section="01" title={tr("Tu participación","Your participation")} />
      <div className="participation-intro"><div><small>VENTANA SUR 2026</small><h2>{tr("Tu participación","Your participation")}</h2></div><p>{tr("Contactos, acreditación y herramientas para organizar tu agenda durante el mercado.","Contacts, accreditation and tools to organise your market schedule.")}</p></div>
      <div className="participation-grid expanded">
        <article><div className="participation-card-head"><h3>{tr("Acreditación y contactos","Accreditation and contacts")}</h3></div><div><p>{tr("Van a recibir la acreditación en el hotel. Si no la reciben allí, podrán retirarla en el mostrador de acreditaciones.","You will receive your accreditation at the hotel. If this is not the case, collect it at the accreditation desk.")}</p><details className="card-more" open><summary>{tr("Horarios y contactos","Times and contacts")}</summary><div><p>{tr("El mostrador abrirá el lunes 30 de noviembre a las 11 h. De martes a jueves atenderá de 9:30 a 17 h en el Auditorio Nacional «Adela Reta» (SODRE).","The desk opens on Monday 30 November at 11 am. From Tuesday to Thursday it is open from 9:30 am to 5 pm at Auditorio Nacional “Adela Reta” (SODRE).")}</p><p><strong>Hospitality:</strong> hospitality@ventana-sur.com<br/><strong>{tr("Coordinación de hospitalidad","Hospitality coordinator")}:</strong> Florencia Abbondanza · +598 98 460 476<br/><strong>{tr("Traslado a los hoteles","Transfers to hotels")}:</strong> Andrés Roel · +598 99 173 499</p></div></details></div></article>
        <article><div className="participation-card-head"><h3>{tr("Encuentros clave","Key events")}</h3></div><div className="key-events"><div><i/><strong>{tr("Ceremonia de apertura","Opening ceremony")}</strong><span>{tr("Lunes 30 de noviembre · 19 h","Monday 30 November · 7 pm")}</span><small>Teatro Solís</small></div><div><i/><strong>{tr("Fiesta de cierre","Closing party")}</strong><span>{tr("Jueves 3 de diciembre · 19 h","Thursday 3 December · 7 pm")}</span><small>Sala del Museo</small></div><div><i/><strong>{tr("Ceremonia de cierre","Closing ceremony")}</strong><span>{tr("Viernes 4 de diciembre · 11—13 h","Friday 4 December · 11 am—1 pm")}</span><small>Teatro Solís</small></div></div></article>
        <article className="platform-card"><div className="participation-card-head"><img className="eventival-logo" src="https://styleguide.eventival.com/downloads/ea_logo_no_background.png" alt="Eventival"/><h3>Eventival</h3></div><div><p>{tr("Es la plataforma para gestionar tu participación durante el mercado.","This is the platform for managing your participation during the market.")}</p><a className="platform-access" href={`https://vp.eventival.com/acau/ventanasur2026/${lang}`} target="_blank" rel="noreferrer">{tr("Acceder a Eventival","Access Eventival")} ↗</a><details className="card-more" open><summary>{tr("Todo lo que podés gestionar","Everything you can manage")}</summary><div><ul><li>{tr("Consultar los proyectos de las distintas secciones.","Browse projects across the different sections.")}</li><li>{tr("Recibir y gestionar tu acreditación y las invitaciones a eventos.","Receive and manage your accreditation and event invitations.")}</li><li>{tr("Agendar reuniones con los equipos de los proyectos.","Schedule meetings with project teams.")}</li><li>{tr("Consultar y descargar tu agenda.","View and download your schedule.")}</li><li>{tr("Gestionar los datos de alojamiento y transporte, cuando corresponda.","Manage accommodation and transport details, where applicable.")}</li><li>{tr("Consultar participantes acreditados y compradores internacionales con tu cuenta personal.","View accredited participants and international buyers using your personal account.")}</li></ul></div></details></div></article>
        <article className="platform-card"><div className="participation-card-head"><img className="cinando-logo" src="https://upload.wikimedia.org/wikipedia/commons/1/1a/Cinando_logo.svg" alt="Cinando"/><h3>Cinando</h3></div><div><p>{tr("La principal base de datos profesional y videoteca de la industria cinematográfica.","The film industry’s leading professional database and video library.")}</p><strong className="membership-benefit">{tr("6 meses de membresía incluidos con tu acreditación","6 months of membership included with your accreditation")}</strong><details className="card-more" open><summary>{tr("Más información","More information")}</summary><div><p>{tr("Durante Ventana Sur tendrás acceso a Market Environment, el espacio virtual dedicado al mercado dentro de Cinando.","During Ventana Sur you will have access to Market Environment, the market’s dedicated online space within Cinando.")}</p><ul><li>{tr("Consultá profesionales acreditados y sus perfiles.","Browse accredited professionals and their profiles.")}</li><li>{tr("Explorá empresas, catálogos y películas disponibles para distribución.","Explore companies, line-ups and films available for distribution.")}</li><li>{tr("Accedé a la videoteca durante el mercado y hasta un mes después.","Access the video library during the market and for up to one month afterwards.")}</li><li>{tr("Subí y compartí películas, catálogos, materiales y datos de contacto.","Upload and share films, line-ups, supporting materials and contact details.")}</li><li>{tr("Buscá empresas, contactos, socios y oportunidades de negocio.","Search companies, contacts, partners and business opportunities.")}</li></ul><p>{tr("Las películas de la videoteca estarán disponibles hasta el 4 de enero de 2027.","Video-library films remain available until 4 January 2027.")}</p><a href="https://cinandovl.com/ventanasur" target="_blank" rel="noreferrer">{tr("Abrir la videoteca","Open the video library")} ↗</a></div></details></div></article>
      </div>
      <PageFoot page="02" />
    </section>

    <section className="sheet content-sheet" id="antes">
      <PageHead section="02" title="Información práctica" />
      <div className="lead-grid practical-lead">
        <h2>{tr("Información útil","Useful information")}<br/>{tr("para visitantes","for visitors")}</h2>
      </div>
      <div className="practical-list">
        <details><summary><i aria-hidden="true"><UtilityIcon type="info"/></i><span><small>{tr("ANTES DE VIAJAR","BEFORE YOU TRAVEL")}</small>{tr("Documentación y llegada","Documents and arrival")}</span><b>+</b></summary><div><p>{tr("Los requisitos de ingreso pueden variar según la nacionalidad. El Aeropuerto Internacional de Carrasco está a unos 20 kilómetros del centro de Montevideo, donde se realizarán las actividades de Ventana Sur.","Entry requirements may vary depending on nationality. Carrasco International Airport is approximately 20 kilometres from downtown Montevideo, where Ventana Sur activities will take place.")}</p><p>{tr("Idioma: español · Huso horario: UTC−3 · Electricidad: 220 V / 50 Hz.","Language: Spanish · Time zone: UTC−3 · Electricity: 220 V / 50 Hz.")}</p><a href="https://www.gub.uy/ministerio-relaciones-exteriores/" target="_blank" rel="noreferrer">{tr("Consultar requisitos oficiales","Check official requirements")} ↗</a></div></details>
        <details><summary><i aria-hidden="true"><UtilityIcon type="info"/></i><span><small>{tr("SALUD","HEALTH")}</small>{tr("Seguro médico","Health insurance")}</span><b>+</b></summary><div><p>{tr("Se recomienda a quienes viajen desde el exterior contar con un seguro médico cuya cobertura se les podría solicitar al ingresar al país.","Foreign visitors are advised to travel with health insurance coverage, which may be requested upon arrival.")}</p></div></details>
        <details><summary><i aria-hidden="true"><UtilityIcon type="info"/></i><span><small>{tr("ASISTENCIA","ASSISTANCE")}</small>{tr("Emergencias en Uruguay","Emergencies in Uruguay")}</span><b>+</b></summary><div><p>{tr("Para emergencias generales —policía, bomberos y ambulancias— llamá al 911. Ante una emergencia en una ruta o autopista, podés comunicarte con la Policía Caminera también al 911.","For general emergencies —police, fire and ambulance— call 911. For emergencies on highways or roads, contact the Highway Patrol on 911 as well.")}</p></div></details>
        <details><summary><i aria-hidden="true"><UtilityIcon type="plug"/></i><span><small>{tr("PRIMAVERA—VERANO","SPRING—SUMMER")}</small>{tr("Clima y qué llevar","Weather and what to pack")}</span><b>+</b></summary><div><p>{tr("Montevideo suele ser húmeda y ventosa. Las temperaturas diurnas pueden oscilar entre 16 °C y 28 °C y rara vez bajan de 10 °C por la noche. Llevá ropa en capas, calzado cómodo, gorro y protector solar.","Montevideo is usually humid and windy. Daytime temperatures may range from 16°C to 28°C and rarely fall below 10°C at night. Bring layers, comfortable shoes, a sun hat and sunscreen.")}</p></div></details>
        <details><summary><i aria-hidden="true"><UtilityIcon type="money"/></i><span><small>URUGUAY</small>{tr("Moneda y tipo de cambio","Currency and exchange rate")}</span><b>+</b></summary><div><p>{tr("La moneda local es el peso uruguayo ($). El documento de organización toma como referencia aproximada 44 pesos por euro y 41,50 pesos por dólar; la cotización puede variar durante el día. Se aceptan tarjetas en la mayoría de los comercios y servicios.","The local currency is the Uruguayan peso ($). The organisation’s document uses approximate references of 44 pesos per euro and 41.50 pesos per US dollar; rates may fluctuate during the day. Cards are accepted by most businesses and services.")}</p><p>{tr("Uruguay ofrece a turistas IVA cero en servicios gastronómicos y alquiler de vehículos sin chofer, además del régimen Tax Free.","Uruguay offers visitors zero VAT on restaurant services and car rental without a driver, as well as the Tax Free regime.")}</p><a href="https://uruguaynatural.com/es/datos/" target="_blank" rel="noreferrer">{tr("Consultar información actualizada","Check updated information")} ↗</a></div></details>
        <details><summary><i aria-hidden="true"><UtilityIcon type="bus"/></i><span><small>MONTEVIDEO</small>{tr("Cómo moverse","Getting around")}</span><b>+</b></summary><div><p>{tr("Las sedes están cerca unas de otras, especialmente en Centro y Ciudad Vieja. Para distancias más largas hay taxis, aplicaciones como Uber o Cabify y ómnibus. Consultá la ubicación antes de cada actividad para planificar el traslado.","Venues are close to one another, particularly in Centro and Ciudad Vieja. For longer distances use taxis, ride-hailing apps such as Uber or Cabify, or local buses. Check each venue location before the activity to plan your journey.")}</p><a href="https://montevideo.gub.uy/tipo/area-tematica/sistema-de-transporte-metropolitano/como-ir" target="_blank" rel="noreferrer">{tr("Planificar en Cómo Ir","Plan with Cómo Ir")} ↗</a></div></details>
      </div>
      <PageFoot page="02" />
    </section>

    <section className="sheet map-sheet" id="mapa">
      <PageHead section="02" title="Sedes y recorridos" />
      <div className="lead-grid compact">
        <h2>{tr("Mapas, distancias","Maps, distances")}<br/>{tr("y traslados","and transfers")}</h2>
      </div>
      <div className="route-layout">
        <aside className="planner">
          <div className="legend-control"><label><input type="checkbox" checked readOnly/><i className="venue-dot"/> {tr("Sedes","Venues")}</label><label><input type="checkbox" checked={showBars} onChange={(e)=>setShowBars(e.target.checked)}/><i className="bar-dot"/> {tr("Bares amigos","Partner bars")}</label><label><input type="checkbox" checked={showVisits} onChange={(e)=>setShowVisits(e.target.checked)}/><i className="visit-dot"/> {tr("Para visitar","Places to visit")}</label></div>
          <label htmlFor="origin">{tr("Desde","From")}</label><select id="origin" value={origin} onChange={(e)=>setOrigin(e.target.value)}>{routeOptions.map(p=><option value={p.id} key={p.id}>{p.name}</option>)}</select>
          <button className="swap" onClick={swap} aria-label="Intercambiar origen y destino">⇅</button>
          <label htmlFor="destination">{tr("Hasta","To")}</label><select id="destination" value={destination} onChange={(e)=>setDestination(e.target.value)}>{routeOptions.map(p=><option value={p.id} key={p.id}>{p.name}</option>)}</select>
          <div className="mode-controls"><button className={mode==="walking"?"selected":""} onClick={()=>setMode("walking")}><span aria-hidden="true">🚶 ♿</span> {tr("Por vereda","Walking")}</button><button className={mode==="driving"?"selected":""} onClick={()=>setMode("driving")}><span aria-hidden="true">🚗</span> {tr("En auto","Driving")}</button></div>
          <div className="route-result"><small>{mode==="walking"?tr("POR VEREDA","WALKING"):tr("EN VEHÍCULO","BY CAR")}</small><h3>{a.short}<br/>→ {b.short}</h3><strong>{Math.round((liveRoute?.meters??route.meters)/10)*10} {tr("m de recorrido","m route")}</strong><span>{liveRoute?.minutes??route.minutes} {tr("min estimados","min estimated")}</span><p>{tr("El tiempo puede variar según el ritmo de traslado y las condiciones del tránsito.","Travel time may vary depending on pace and traffic conditions.")}</p></div>
        </aside>
        <div className="editorial-map">
          <div className="map-label"><span>MONTEVIDEO · SEDES Y RECORRIDOS</span><span>↑ N</span></div>
          <div id="real-city-map" className="map-field" aria-label="Mapa urbano interactivo de las sedes de Ventana Sur"/>
          <div className="map-caption"><span><i className="venue-dot"/> {tr("Sedes","Venues")}</span><span><i className="bar-dot"/> {tr("Bares amigos","Partner bars")}</span><span><i className="visit-dot"/> {tr("Para visitar","Places to visit")}</span></div>
        </div>
      </div>
      <p className="map-disclaimer">{tr("Las sedes principales forman un circuito compacto para trasladarse por vereda. Para trayectos fuera de esta zona, consulta recorridos, paradas y líneas en","The main venues form a compact area that can be covered on foot. For journeys beyond this area, check routes, stops and bus lines with")} <a href="https://montevideo.gub.uy/tipo/area-tematica/sistema-de-transporte-metropolitano/como-ir" target="_blank" rel="noreferrer">Cómo Ir ↗</a>.</p>
      <PageFoot page="03" />
    </section>

    <section className="sheet venues-sheet" id="sedes">
      <PageHead section="03" title="Conocer las sedes" />
      <div className="lead-grid compact"><h2>{tr("Conoce las sedes","Explore the venues")}</h2></div>
      <div className="venues-gallery">
        <VenueCard name="Auditorio Nacional Adela Reta" role="Sede principal" address="Andes y Mercedes" image="https://media.telenoche.com.uy/p/b60378f55e7f3968a8223a5647d15a33/adjuntos/329/imagenes/000/196/0000196729/1200x630/smart/auditorio-sodrejpg.jpg" href="https://sodre.gub.uy/" />
        <VenueCard name="Teatro Solís" role="Apertura, actividades y premiación" address="Buenos Aires y Bartolomé Mitre" image="https://www.teatrosolis.org.uy/imgnoticias/202503/5968.jpg" href="https://www.teatrosolis.org.uy/" />
        <VenueCard name="Cinemateca Uruguaya" role="Proyecciones del mercado" address="Bartolomé Mitre 1236" image="https://ladiaria.com.uy/media/photologue/photos/cache/RS49954_20200525ER_0310_edit_1200w.jpg" href="https://cinemateca.org.uy/" />
        <VenueCard name="Auditorio Nelly Goitiño" role="Actividades Ventana Sur" address="18 de Julio 930" image="https://sodre.gub.uy/institucional/wp-content/themes/cygnus/images/nelly_goitino.jpg" href="https://sodre.gub.uy/institucional/auditorio-nelly-goitino-informacion/" />
        <VenueCard name="Centro Cultural de España" role="Encuentros y actividades" address="Rincón 629" image="https://www.descubrimontevideo.uy/sites/default/files/styles/escala_y_recorte_1400x800/public/2022-12/centrocultural%20espa%C3%B1a.jpg?itok=_y0Uzr0F" href="https://cce.org.uy/" />
        <VenueCard name="Centro de Formación AECID" role="Encuentros profesionales" address="25 de Mayo 520" image="https://cdf.montevideo.gub.uy/system/files/imagecache/Foto_destacada_645_430/fotos/tu79.jpg" href="https://intercoonecta.aecid.es/intercoonecta/centros-de-formaci%C3%B3n/centro-de-formaci%C3%B3n-de-montevideo" />
        <VenueCard name="Parque Mauá" role="Cine y actividades abiertas" address="Rambla Sur y Convención" image="https://montevideo.gub.uy/sites/default/files/styles/galleria/public/2025-12/20251219dicimouyit7952.jpg?itok=SAwOEWo5" href="https://montevideo.gub.uy/parques-de-montevideo/parque-maua" wide />
      </div>
      <PageFoot page="04" />
    </section>

    <section className="sheet content-sheet" id="montevideo">
      <PageHead section="05" title="Montevideo" />
      <div className="lead-grid">
        <h2>{tr("Montevideo y Uruguay","Montevideo and Uruguay")}</h2>
      </div>
      <div className="city-grid">
        <article><span className="city-no">01</span><h3>{tr("Entre actividades","Between activities")}</h3><p>{tr("Ciudad Vieja, el Centro y la Rambla Sur concentran patrimonio, museos, librerías, cafés y algunos de los principales espacios culturales.","Ciudad Vieja, Centro and Rambla Sur bring together heritage, museums, bookshops, cafés and major cultural venues.")}</p><Source href="https://www.descubrimontevideo.uy/que-hacer/casco-historico" label={tr("Descubrí Montevideo · Casco histórico","Discover Montevideo · Historic district")} /></article>
        <article><span className="city-no">02</span><h3>{tr("Conocer Montevideo","Explore Montevideo")}</h3><p>{tr("La rambla, los barrios, las playas, los mercados y la agenda cultural permiten armar recorridos de pocas horas o de un día completo.","The waterfront, neighbourhoods, beaches, markets and cultural agenda offer routes lasting a few hours or a full day.")}</p><Source href="https://www.descubrimontevideo.uy/que-hacer" label={tr("Descubrí Montevideo · Qué hacer","Discover Montevideo · Things to do")} /></article>
        <article><span className="city-no">03</span><h3>{tr("Una escapada cercana","A nearby getaway")}</h3><p>{tr("Con más tiempo, la costa de Canelones, Santa Lucía y Colonia ofrecen alternativas próximas para sumar al viaje.","With more time, the coast of Canelones, Santa Lucía and Colonia offer nearby additions to your trip.")}</p><Source href="https://uruguaynatural.com/es/experiences/patrimonio-y-naturaleza-en-santa-lucia-y-quinta-capurro/" label={tr("Uruguay Natural · Cerca de Montevideo","Uruguay Natural · Near Montevideo")} /></article>
        <article><span className="city-no">04</span><h3>{tr("Recorrer Uruguay","Explore Uruguay")}</h3><p>{tr("Para extender la estadía, consulta destinos, experiencias e itinerarios en las distintas regiones del país.","To extend your stay, browse destinations, experiences and itineraries across the country.")}</p><Source href="https://uruguaynatural.com/" label={tr("Uruguay Natural · Ministerio de Turismo","Uruguay Natural · Ministry of Tourism")} /></article>
      </div>
      <section className="culture-edit" aria-labelledby="culture-title">
        <div className="culture-intro"><h3 id="culture-title">{tr("Cultura en la ciudad","Culture in the city")}</h3><p>{tr("Durante Ventana Sur, la cultura de Montevideo también está en escena. Aprovechá estos días para conocerla y ser parte.","While Ventana Sur is taking place, Montevideo’s culture is also on stage. Make the most of these days to discover it and take part.")}</p></div>
        <div className="culture-list">
          <a className="culture-card candombe" href="https://montevideo.gub.uy/tipo/area-tematica/turismo-y-tiempo-libre/fiestas-tradicionales-de-montevideo" target="_blank" rel="noreferrer"><img src={localAsset("/assets/culture/candombe.jpg")} alt="Cuerda de tambores en Isla de Flores"/><div><small>{tr("03 DIC · BARRIO SUR Y PALERMO","03 DEC · BARRIO SUR AND PALERMO")}</small><h4>{tr("Día Nacional del Candombe","National Candombe Day")}</h4><p>{tr("Una expresión central de la identidad afrouruguaya y de Montevideo. Sus cuerdas de tambores recorren Isla de Flores en una jornada de memoria, encuentro y celebración.","A defining expression of Afro-Uruguayan and Montevideo identity. Drum groups take over Isla de Flores for a day of remembrance, community and celebration.")}</p><strong>{tr("Información oficial","Official information")} ↗</strong></div></a>
          <a className="culture-card" href="https://montevideo.gub.uy/noticias/el-carnaval-ya-tiene-fechas-0" target="_blank" rel="noreferrer"><img src={localAsset("/assets/culture/murga-joven.jpg")} alt="Murga Joven en el Teatro de Verano"/><div><small>{tr("01—04 DIC · TEATRO DE VERANO","01—04 DEC · TEATRO DE VERANO")}</small><h4>{tr("Encuentro de Murga Joven","Young Murga Showcase")}</h4><p>{tr("La nueva generación de la murga montevideana presenta repertorios de música, humor y crítica en uno de los escenarios emblemáticos del carnaval.","A new generation of Montevideo murga presents music, humour and social commentary on one of carnival’s landmark stages.")}</p><strong>{tr("Consultar programación","View programme")} ↗</strong></div></a>
          <a className="culture-card" href="https://www.teatrosolis.org.uy/PROGRAMACION/Cascanueces-uc2973" target="_blank" rel="noreferrer"><img src={localAsset("/assets/culture/cascanueces.png")} alt="Gráfica oficial de Cascanueces de la Banda Sinfónica de Montevideo"/><div><small>{tr("02 DIC · 20 H · TEATRO SOLÍS","02 DEC · 8 PM · TEATRO SOLÍS")}</small><h4>{tr("Cascanueces sinfónico","The Nutcracker in concert")}</h4><p>{tr("La Banda Sinfónica de Montevideo interpreta la partitura de Tchaikovsky bajo la dirección del maestro mexicano Enrique Arturo Diemecke.","The Montevideo Symphonic Band performs Tchaikovsky’s score under Mexican conductor Enrique Arturo Diemecke.")}</p><strong>{tr("Ver función","View performance")} ↗</strong></div></a>
          <a className="culture-card" href="https://www.teatrosolis.org.uy/PROGRAMACION/19-Festival-de-Jazz-de-Montevideo-uc3053" target="_blank" rel="noreferrer"><img src={localAsset("/assets/culture/jazz.png")} alt="Gráfica oficial del 19.º Festival de Jazz de Montevideo"/><div><small>{tr("04 DIC · 21 H · TEATRO SOLÍS","04 DEC · 9 PM · TEATRO SOLÍS")}</small><h4>{tr("19.º Festival de Jazz de Montevideo","19th Montevideo Jazz Festival")}</h4><p>{tr("La apertura celebra el centenario de Miles Davis con Kind of Blue: músicos nacionales e internacionales dialogan con una obra que transformó el lenguaje del jazz.","Opening night marks Miles Davis’s centenary with Kind of Blue, bringing national and international musicians into dialogue with an album that changed jazz.")}</p><strong>{tr("Ver festival","View festival")} ↗</strong></div></a>
        </div>
      </section>
      <PageFoot page="07" />
    </section>

    <section className="sheet visits-sheet" id="agenda">
      <PageHead section="04" title="Recomendados Ventana Sur" />
      <div className="lead-grid compact"><h2>{tr("Recomendados","Ventana Sur")}<br/>{tr("Ventana Sur","recommends")}</h2></div>
      <div className="recommendations-grid">
        <article className="recommendation with-media"><img className="recommendation-media" src="https://cdf.montevideo.gub.uy/system/files/imagecache/Foto_destacada_645_430/fotos/1_59.jpg" alt="Fotografía histórica de una sala de cine en Uruguay"/><span>01 · {tr("FOTOGALERÍA","PHOTO EXHIBITION")}</span><h3>{tr("130 años de cine en Uruguay","130 years of cinema in Uruguay")}</h3><p>{tr("Fotografías, archivos y registros que recuperan rostros, oficios, hábitos y espacios vinculados a la experiencia colectiva de ir al cine.","Photographs and archives portraying the people, trades, habits and spaces linked to the collective experience of going to the movies.")}</p><small>{tr("Parque Rodó · abierta 24 horas · hasta 25.01.2027","Parque Rodó · open 24 hours · until 25 Jan 2027")}</small><Source href="https://cdf.montevideo.gub.uy/exposicion/130-anos-de-cine-en-uruguay" label={tr("Ver la fotogalería","View the exhibition")} /></article>
        <article className="recommendation with-media"><img className="recommendation-media" src="https://muhar.montevideo.gub.uy/sites/muhar.montevideo.gub.uy/files/articulos/imagenes/dsc_3152.jpg" alt="Exposición El mundo de Walter Tournier"/><span>02 · {tr("EXPOSICIÓN","EXHIBITION")}</span><h3>Walter Tournier</h3><p>{tr("Una retrospectiva del cineasta y animador: personajes, muñecos y técnicas artesanales que pasan del dibujo al volumen y al movimiento.","A retrospective of the filmmaker and animator: characters, puppets and hand-crafted techniques moving from drawing to volume and motion.")}</p><small>{tr("Centro Cultural UTU · condiciones a confirmar","UTU Cultural Centre · details to be confirmed")}</small><Source href="https://muhar.montevideo.gub.uy/proximas-actividades/el-mundo-de-walter-tournier" label={tr("El mundo de Walter Tournier · MUHAR","The world of Walter Tournier · MUHAR")} /></article>
        <article className="recommendation green with-media"><img className="recommendation-media mass-art" src="https://www.acau.gub.uy/innovaportal/file/823/1/diseno-sin-titulo-13.png" alt="MASS · Festivales de Málaga y San Sebastián"/><span>03 · {tr("MUESTRA","SHOWCASE")}</span><h3>MASS</h3><p>{tr("Seis películas españolas de las últimas ediciones de los festivales de San Sebastián y Málaga, con sesiones y encuentros en Cinemateca Uruguaya.","Six Spanish films from the latest San Sebastián and Málaga festivals, with screenings and talks at Cinemateca Uruguaya.")}</p><small>{tr("30 NOV—02 DIC · entrada libre hasta completar aforo","30 NOV—02 DEC · free admission, subject to capacity")}</small><Source href="https://www.acau.gub.uy/innovaportal/v/823/1/acau/mass-llega-a-montevideo-con-lo-mejor-del-cine-espanol-de-los-festivales-de-malaga-y-san-sebastian.html" label={tr("Información oficial de MASS","Official MASS information")} /></article>
        <article className="recommendation with-media"><img className="recommendation-media" src="https://www.descubrimontevideo.uy/sites/default/files/styles/escala_y_recorte_1400x800/public/2024-11/DSC01005_1.jpg?itok=N832JJz8" alt="Bus Turístico de Montevideo"/><span>04 · {tr("RECORRIDO","CITY TOUR")}</span><h3>{tr("Bus turístico · Locaciones de cine en Montevideo","Sightseeing bus · Montevideo film locations")}</h3><p>{tr("Un recorrido especial en bus por locaciones emblemáticas de Ciudad Vieja, Centro, Parque Rodó y Rambla Sur.","A special bus tour of landmark filming locations in Ciudad Vieja, Centro, Parque Rodó and Rambla Sur.")}</p><small>{tr("03 DIC · salidas 13 y 15 h · Plaza Independencia · cupos limitados","03 DEC · departures at 1 and 3 pm · Plaza Independencia · limited capacity")}</small><Source href="https://formularios.montevideo.gub.uy/recorrido-locaciones-ventana-sur" label={tr("Inscribirse al recorrido","Register for the tour")} /></article>
        <article className="recommendation with-media"><img className="recommendation-media" src="https://www.gub.uy/ministerio-educacion-cultura/sites/ministerio-educacion-cultura/files/imagenes/noticias/Portada_3.jpeg" alt="Función de cine al aire libre en Parque Mauá"/><span>05 · {tr("PROYECCIÓN","SCREENING")}</span><h3>{tr("Cine al aire libre","Open-air cinema")}</h3><p>{tr("Una función abierta junto al Río de la Plata, en un espacio costero recuperado como lugar de encuentro para el cine nacional.","An open screening by the Río de la Plata in a restored waterfront setting for Uruguayan cinema.")}</p><small>{tr("Parque Mauá · programación Ventana Sur a confirmar","Parque Mauá · Ventana Sur programme to be confirmed")}</small><Source href="https://www.gub.uy/ministerio-educacion-cultura/comunicacion/noticias/1000-personas-disfrutaron-pelicula-dirigible-ciclo-cine-parque-maua" label={tr("Conocer el ciclo","About the series")} /></article>
        <article className="recommendation planetarium with-media"><img className="recommendation-media" src="https://upload.wikimedia.org/wikipedia/commons/f/f4/Planetario_2.jpg" alt={tr("Exterior del Planetario de Montevideo","Exterior of Montevideo Planetarium")}/><span>06 · FULLDOME</span><h3>{tr("Fulldome en el Planetario","Fulldome at the Planetarium")}</h3><p>{tr("Una experiencia de proyección inmersiva en el domo digital 8K del Planetario de Montevideo.","An immersive projection experience in Montevideo Planetarium’s 8K digital dome.")}</p><small>{tr("Actividad Ventana Sur · información a confirmar","Ventana Sur activity · details to be confirmed")}</small><Source href="https://www.montevideo.gub.uy/planetario" label={tr("Conocer el Planetario","Explore the Planetarium")} /></article>
      </div>
      <PageFoot page="05" />
    </section>

    <section className="sheet connected-guides" id="guias" aria-labelledby="connected-guides-title">
      <div className="connected-guides-head"><h2 id="connected-guides-title">{tr("Tres guías que acompañan tu experiencia","Three guides to support your experience")}</h2></div>
      <div className="connected-guides-grid">
        <a className="connected-guide accessibility-guide" href={`https://accesibilidadvs26.netlify.app/${lang==="en"?"en/":""}`} target="_blank" rel="noreferrer">
          <div className="guide-art accessibility-art"><AccessibilitySymbol/></div>
          <div><small>{tr("ACCESIBILIDAD","ACCESSIBILITY")}</small><h3>{tr("Conoce la información de accesibilidad","Explore accessibility information")}</h3><p>{tr("Accesos, recorridos y recursos disponibles para organizar tu participación.","Access, routes and available resources to help organise your participation.")}</p></div><b className="guide-arrow">↗</b>
        </a>
        <a className="connected-guide plan-guide" href={`https://plansustentabilidadvs26.netlify.app/${lang==="en"?"?lang=en":""}`} target="_blank" rel="noreferrer">
          <div className="guide-art plan-art" aria-hidden="true"><span/><i/><i/><i/></div>
          <div><small>{tr("PLAN GENERAL","GENERAL PLAN")}</small><h3>{tr("Conoce el Plan de Sustentabilidad","Explore the Sustainability Plan")}</h3><p>{tr("Compromisos, medición y acciones para aprender y mejorar en cada edición.","Commitments, measurement and actions designed to learn and improve with every edition.")}</p></div><b className="guide-arrow">↗</b>
        </a>
        <a className="connected-guide participant-guide" href={`https://acreditacionesvs26.netlify.app/${lang==="en"?"?lang=en":""}`} target="_blank" rel="noreferrer">
          <div className="guide-art participant-art"><MiniDayDoll/></div>
          <div><small>{tr("DESDE TU LUGAR","FROM WHERE YOU ARE")}</small><h3>{tr("Conoce cómo puedes sumarte","See how you can take part")}</h3><p>{tr("Gestos simples para contribuir a un encuentro más sustentable durante toda la jornada.","Simple actions that contribute to a more sustainable event throughout the day.")}</p></div><b className="guide-arrow">↗</b>
        </a>
      </div>
    </section>

    <section className="sheet local-sheet" id="local">
      <div className="local-lead"><div className="local-title"><h2>{tr("Conoce lo local","Meet the local scene")}</h2><div className="local-photo" role="img" aria-label={tr("Café y encuentro en Montevideo","Café and meeting place in Montevideo")}/></div><p>{tr("Ventana Sur reúne al ecosistema audiovisual de la región y el mundo. Los cafés, bares y comercios cercanos ofrecen otros espacios para continuar las conversaciones, encontrarse y generar nuevos vínculos. Presentá tu acreditación para conocer los beneficios disponibles en cada comercio amigo.","Ventana Sur brings together the audiovisual ecosystem from across the region and the world. Nearby cafés, bars and businesses offer places to continue conversations, meet and build new connections. Show your accreditation to discover the benefits available at each partner business.")}</p></div>
      <aside className="accredited-benefits" aria-label="Beneficios para personas acreditadas">
        <button className="benefit-card" onClick={()=>setBarsOpen(true)}><span className="benefit-mark"><UtilityIcon type="cup"/></span><div><small>{tr("OCHO ESPACIOS · CENTRO Y ZONAS CERCANAS","EIGHT VENUES · CENTRO AND NEARBY")}</small><h3>{tr("Bares amigos","Partner bars")}</h3><p>{tr("Cafés y bares con actividad diurna y nocturna para reunirse o continuar la conversación después de las actividades.","Daytime and evening cafés and bars for meeting or continuing the conversation after the programme.")}</p><strong>{tr("Conocer los bares y ubicaciones","Explore bars and locations")} ↗</strong></div></button>
        <a className="benefit-card" href="https://www.descubrimontevideo.uy/que-hacer/casco-historico" target="_blank" rel="noreferrer"><span className="benefit-mark"><UtilityIcon type="store"/></span><div><small>{tr("COMERCIOS Y ESPACIOS ADHERIDOS","PARTICIPATING SHOPS AND VENUES")}</small><h3>Distrito Ciudad Vieja</h3><p>{tr("Locales del distrito ofrecen atenciones y descuentos presentando la acreditación de Ventana Sur.","District businesses offer benefits and discounts upon presentation of a Ventana Sur accreditation.")}</p><strong>{tr("Conocer el distrito","Explore the district")} ↗</strong></div></a>
      </aside>
      <PageFoot page="06" />
    </section>
    </div>
    <nav className="reader-nav" aria-label="Navegación de la guía">
      <div className="page-dots">{pageNames.map((name,index)=><button key={name} className={page===index?"current":""} onClick={()=>goToPage(index)} aria-label={`Ir a ${name}`}/>)}</div>
    </nav>
    {barsOpen&&<div className="bars-modal" role="dialog" aria-modal="true" aria-label={tr("Bares amigos","Partner bars")}><button className="bars-close" onClick={()=>setBarsOpen(false)} aria-label={tr("Cerrar","Close")}>×</button><div className="bars-modal-head"><h2>{tr("Bares amigos","Partner bars")}</h2><p>{tr("Espacios para reunirse durante el día o continuar la conversación después de las actividades.","Places to meet during the day or continue the conversation after the programme.")}</p></div><div className="bars-grid">{places.filter(p=>p.kind==="bar").map((bar)=><article key={bar.id}><div className={`bar-wordmark mark-${bar.id}`}>{barMarks[bar.id].split("\n").map((line,i)=><span key={i}>{line}</span>)}</div><div><h3>{bar.name}</h3><p>{bar.address}</p><div className="bar-actions"><button onClick={()=>{setBarsOpen(false);setShowBars(true);setDestination(bar.id);document.getElementById("mapa")?.scrollIntoView({behavior:"smooth"})}}>{tr("Ver en el mapa","View on map")} ↑</button><a href={`https://www.instagram.com/${barInstagram[bar.id]}/`} target="_blank" rel="noreferrer">Instagram ↗</a></div></div></article>)}</div></div>}
    {pdfNotice&&<div className="pdf-preview-notice" role="status">{tr("Versión PDF en preparación","PDF version coming soon")}</div>}
  </main>
}

function PageHead({section,title}:{section:string,title:string}){return <header className="page-head"><img src={localAsset("/ventana-sur-crisp.png")} alt="Ventana Sur"/><p><span>{section}</span>{title}</p></header>}
function PageFoot({page}:{page:string}){return <footer className="page-foot"><span>VENTANA SUR · PRACTICAL INFO · 2026</span><span>{page}</span></footer>}
function Source({href,label}:{href:string,label:string}){return <a className="source" href={href} target="_blank" rel="noreferrer">{label}<b>↗</b></a>}
function UtilityIcon({type}:{type:"money"|"bus"|"plug"|"info"|"cup"|"store"}){
  const paths={money:<><rect x="3" y="6" width="18" height="13" rx="2"/><path d="M7 10h10M8 15h.01M16 15h.01"/></>,bus:<><rect x="5" y="3" width="14" height="17" rx="3"/><path d="M5 12h14M8 7h8M8 20v2M16 20v2"/><circle cx="8.5" cy="16" r=".7"/><circle cx="15.5" cy="16" r=".7"/></>,plug:<><path d="M9 3v6M15 3v6M7 8h10v3a5 5 0 0 1-10 0V8ZM12 16v5"/></>,info:<><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7h.01"/></>,cup:<><path d="M5 8h12v5a6 6 0 0 1-12 0V8ZM17 10h1a3 3 0 0 1 0 6h-2M4 21h15"/></>,store:<><path d="M4 10v10h16V10M3 10l2-6h14l2 6M8 20v-6h5v6"/><path d="M3 10a3 3 0 0 0 5 0 3 3 0 0 0 5 0 3 3 0 0 0 5 0 3 3 0 0 0 3-1"/></>};
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{paths[type]}</svg>
}
function VenueCard({name,role,address,image,href,wide=false}:{name:string;role:string;address:string;image:string;href:string;wide?:boolean}){return <article className={`venue-card ${wide?"wide":""}`}><img src={image} alt={name} loading="lazy"/><div><span>{role}</span><h3>{name}</h3><p>{address}</p><a href={href} target="_blank" rel="noreferrer">Sitio oficial <b>↗</b></a></div></article>}
