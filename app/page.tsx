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
];

const venueOptions = places.filter((p)=>p.kind === "venue");
const barSources:Record<string,string>={montevideosur:"https://www.gub.uy/ministerio-educacion-cultura/patrimonio-uruguay/guia-actividades-dia-del-patrimonio-2026/montevideo/barrio-sur",paysandu:"https://paseocentro.com.uy/bar-paysandu/",santacatalina:"https://www.gub.uy/ministerio-educacion-cultura/patrimonio-uruguay/guia-actividades-dia-del-patrimonio-2026/montevideo/barrio-sur",brasilero:"https://cafebrasilero.uy/",ladiaria:"https://ladiaria.com.uy/",brecha:"https://1122.com.uy/local/brecha-bar-y-cafe/LOC556280001",martei:"https://www.instagram.com/martei.cafe/",capicua:"https://eventos.montevideo.gub.uy/evento/sabados-en-ciudad-vieja/musica-en-vivo-en-destileria-capicua"};
const barInstagram:Record<string,string>={montevideosur:"mvdalsur",paysandu:"paysandu_bar",santacatalina:"santacatalinabar",brasilero:"cafebrasilero.uy",ladiaria:"ladiaria",brecha:"elbar_delxsamigxs",martei:"martei.cafe",capicua:"destileriacapicua"};
const barMarks:Record<string,string>={montevideosur:"MVD\nAL SUR",paysandu:"BAR\nPAYSANDÚ",santacatalina:"SANTA\nCATALINA",brasilero:"CAFÉ\nBRASILERO",ladiaria:"la diaria",brecha:"BRECHA",martei:"martei",capicua:"CAPICÚA"};
const coordinates:Record<string,{lat:number;lng:number}>={solis:{lat:-34.9078788,lng:-56.2010001},sodre:{lat:-34.9042808,lng:-56.198708},cinemateca:{lat:-34.908515,lng:-56.2008552},nelly:{lat:-34.9064151,lng:-56.196285},cce:{lat:-34.9057785,lng:-56.2027206},aecid:{lat:-34.9057873,lng:-56.2052188},museo:{lat:-34.9057085,lng:-56.21217},maua:{lat:-34.9121908,lng:-56.1960524},montevideosur:{lat:-34.9098214,lng:-56.1920231},paysandu:{lat:-34.9022743,lng:-56.1919269},santacatalina:{lat:-34.909496,lng:-56.1999995},brasilero:{lat:-34.9056692,lng:-56.2046929},ladiaria:{lat:-34.9072987,lng:-56.2013957},brecha:{lat:-34.9084142,lng:-56.18779},martei:{lat:-34.9039968,lng:-56.1996303},capicua:{lat:-34.9088117,lng:-56.2098835},fotogaleria:{lat:-34.9134288,lng:-56.1693808},cdf:{lat:-34.906209,lng:-56.1973729},busturistico:{lat:-34.9064,lng:-56.2114}};

export default function Home(){
  const [page,setPage] = useState(0);
  const [lang,setLang] = useState<"es"|"en">("es");
  const [origin,setOrigin] = useState("solis");
  const [destination,setDestination] = useState("sodre");
  const [mode,setMode] = useState<"walking"|"driving">("walking");
  const [showBars,setShowBars] = useState(false);
  const [showVisits,setShowVisits] = useState(true);
  const [barsOpen,setBarsOpen] = useState(false);
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
  const pageNames=[tr("Inicio","Home"),tr("Información útil","Visitor information"),tr("Sedes y recorridos","Venues and routes"),tr("Conoce las sedes","Explore the venues"),tr("Recomendados","Recommended"),tr("Conoce lo local","Meet the local scene"),tr("Montevideo y Uruguay","Montevideo and Uruguay")];
  const pageIds=["inicio","antes","mapa","sedes","agenda","local","montevideo"];
  const goToPage=(index:number)=>{
    const next=Math.max(0,Math.min(6,index));
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
      places.filter((place)=>coordinates[place.id]).forEach((place)=>{const point=coordinates[place.id];const marker=L.marker([point.lat,point.lng],{icon:L.divIcon({className:`real-marker ${place.kind}`,html:"<span></span>",iconSize:[22,22],iconAnchor:[11,11]}),title:place.name}).bindTooltip(place.short,{direction:"top"}).bindPopup(`<strong>${place.name}</strong><br>${place.address}<br><small>${place.kind==="bar"?"Bar amigo":place.kind==="visit"?"Para visitar":"Sede Ventana Sur"}</small>`);marker.on("click",()=>setDestination(place.id));markersRef.current[place.id]=marker;if(place.kind==="venue"||place.kind==="visit")marker.addTo(map)});
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
    {basePath&&<a className={`back-to-plan ${scrolled?"is-scrolled":""}`} href="/" aria-label={tr("Volver al Plan de sustentabilidad","Back to the Sustainability plan")}><span aria-hidden="true">←</span><strong>{tr("Plan de sustentabilidad","Sustainability plan")}</strong></a>}
    <div className="document-shell" aria-live="polite">
    <section className="sheet cover" id="inicio">
      <div className="sheet-head">
        <img src={localAsset("/ventana-sur-official.svg")} alt="Ventana Sur" />
        <p>30 NOV—04 DIC 2026<br/>MONTEVIDEO · URUGUAY</p>
      </div>
      <div className="cover-title">
        <h1>{tr("Información","Practical")}<br/>{tr("práctica","information")}</h1>
      </div>
      <div className="cover-index">
        <button onClick={()=>goToPage(1)}><strong>{tr("Información útil para visitantes","Useful visitor information")}</strong><b>↘</b></button>
        <button onClick={()=>goToPage(2)}><strong>{tr("Mapas, distancias y traslados","Maps, distances and transfers")}</strong><b>↘</b></button>
        <button onClick={()=>goToPage(3)}><strong>{tr("Conoce las sedes","Explore the venues")}</strong><b>↘</b></button>
        <button onClick={()=>goToPage(4)}><strong>{tr("Recomendados Ventana Sur","Ventana Sur recommends")}</strong><b>↘</b></button>
        <button onClick={()=>goToPage(5)}><strong>{tr("Conoce lo local","Meet the local scene")}</strong><b>↘</b></button>
        <button onClick={()=>goToPage(6)}><strong>{tr("Montevideo y Uruguay","Montevideo and Uruguay")}</strong><b>↘</b></button>
      </div>
      <div className="scroll-hint" aria-hidden="true"><span>{tr("Desliza para recorrer","Scroll to explore")}</span><b>↓</b></div>
    </section>

    <section className="sheet content-sheet" id="antes">
      <PageHead section="01" title="Información práctica" />
      <div className="lead-grid practical-lead">
        <h2>{tr("Información útil","Useful information")}<br/>{tr("para visitantes","for visitors")}</h2>
      </div>
      <div className="practical-list">
        <details><summary><i aria-hidden="true"><UtilityIcon type="money"/></i><span><small>URUGUAY</small>{tr("Dinero y cambio","Money and exchange")}</span><b>+</b></summary><div><p>{tr("La moneda es el peso uruguayo. El sistema es de libre cambio y las tarjetas tienen amplia aceptación.","The currency is the Uruguayan peso. Currency exchange is unrestricted and cards are widely accepted.")}</p><a href="https://uruguaynatural.com/es/datos/" target="_blank" rel="noreferrer">{tr("Consultar en Uruguay Natural","Visit Uruguay Natural")} ↗</a></div></details>
        <details><summary><i aria-hidden="true"><UtilityIcon type="bus"/></i><span><small>MONTEVIDEO</small>{tr("Transporte público","Public transport")}</span><b>+</b></summary><div><p>{tr("La red urbana cuenta con numerosas líneas de ómnibus. Se puede pagar en efectivo o utilizar la tarjeta STM; la aplicación Cómo Ir permite planificar recorridos.","Montevideo has an extensive bus network. Pay in cash or use an STM card; the Cómo Ir app helps plan journeys.")}</p><a href="https://montevideo.gub.uy/tipo/area-tematica/sistema-de-transporte-metropolitano/como-ir" target="_blank" rel="noreferrer">{tr("Planificar en Cómo Ir","Plan with Cómo Ir")} ↗</a></div></details>
        <details><summary><i aria-hidden="true"><UtilityIcon type="plug"/></i><span><small>{tr("DATOS GENERALES","GENERAL INFORMATION")}</small>{tr("Conectividad, enchufes y horarios","Connectivity, plugs and opening hours")}</span><b>+</b></summary><div><p>{tr("Montevideo dispone de puntos de wifi público. La red eléctrica es de 220 V y 50 Hz. Consulta también horarios comerciales, bancos y otros servicios.","Montevideo offers public Wi-Fi hotspots. Electricity is 220 V / 50 Hz. Check business hours, banking and other services.")}</p><a href="https://www.descubrimontevideo.uy/datos-generales" target="_blank" rel="noreferrer">{tr("Ver datos generales","See general information")} ↗</a></div></details>
        <details><summary><i aria-hidden="true"><UtilityIcon type="info"/></i><span><small>{tr("ASISTENCIA","ASSISTANCE")}</small>{tr("Oficinas de información turística","Tourist information offices")}</span><b>+</b></summary><div><p>{tr("Hay puntos de atención en Ciudad Vieja, el Mirador Panorámico de la Intendencia y la terminal Tres Cruces.","Information points are available in Ciudad Vieja, at the City Hall panoramic viewpoint and Tres Cruces terminal.")}</p><a href="https://www.descubrimontevideo.uy/oficinas-de-informacion-turistica" target="_blank" rel="noreferrer">{tr("Ver oficinas y horarios","See offices and opening hours")} ↗</a></div></details>
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
        <h2>{tr("Montevideo","Montevideo")}<br/>{tr("y Uruguay","and Uruguay")}</h2>
      </div>
      <div className="city-grid">
        <article><span className="city-no">01</span><h3>{tr("Entre actividades","Between activities")}</h3><p>{tr("Ciudad Vieja, el Centro y la Rambla Sur concentran patrimonio, museos, librerías, cafés y algunos de los principales espacios culturales.","Ciudad Vieja, Centro and Rambla Sur bring together heritage, museums, bookshops, cafés and major cultural venues.")}</p><Source href="https://www.descubrimontevideo.uy/que-hacer/casco-historico" label={tr("Descubrí Montevideo · Casco histórico","Discover Montevideo · Historic district")} /></article>
        <article><span className="city-no">02</span><h3>{tr("Conocer Montevideo","Explore Montevideo")}</h3><p>{tr("La rambla, los barrios, las playas, los mercados y la agenda cultural permiten armar recorridos de pocas horas o de un día completo.","The waterfront, neighbourhoods, beaches, markets and cultural agenda offer routes lasting a few hours or a full day.")}</p><Source href="https://www.descubrimontevideo.uy/que-hacer" label={tr("Descubrí Montevideo · Qué hacer","Discover Montevideo · Things to do")} /></article>
        <article><span className="city-no">03</span><h3>{tr("Una escapada cercana","A nearby getaway")}</h3><p>{tr("Con más tiempo, la costa de Canelones, Santa Lucía y Colonia ofrecen alternativas próximas para sumar al viaje.","With more time, the coast of Canelones, Santa Lucía and Colonia offer nearby additions to your trip.")}</p><Source href="https://uruguaynatural.com/es/experiences/patrimonio-y-naturaleza-en-santa-lucia-y-quinta-capurro/" label={tr("Uruguay Natural · Cerca de Montevideo","Uruguay Natural · Near Montevideo")} /></article>
        <article><span className="city-no">04</span><h3>{tr("Recorrer Uruguay","Explore Uruguay")}</h3><p>{tr("Para extender la estadía, consulta destinos, experiencias e itinerarios en las distintas regiones del país.","To extend your stay, browse destinations, experiences and itineraries across the country.")}</p><Source href="https://uruguaynatural.com/" label={tr("Uruguay Natural · Ministerio de Turismo","Uruguay Natural · Ministry of Tourism")} /></article>
      </div>
      <section className="culture-edit" aria-labelledby="culture-title">
        <div className="culture-intro"><span>{tr("AGENDA SELECCIONADA · 01—04 DIC","SELECTED EVENTS · 01—04 DEC")}</span><h3 id="culture-title">{tr("Cultura en la ciudad","Culture in the city")}</h3><p>{tr("Durante Ventana Sur, la cultura de Montevideo también está en escena. Aprovechá estos días para conocerla y ser parte.","While Ventana Sur is taking place, Montevideo’s culture is also on stage. Make the most of these days to discover it and take part.")}</p></div>
        <div className="culture-list">
          <a className="culture-card candombe" href="https://montevideo.gub.uy/tipo/area-tematica/turismo-y-tiempo-libre/fiestas-tradicionales-de-montevideo" target="_blank" rel="noreferrer"><img src={localAsset("/assets/culture/candombe.jpg")} alt="Cuerda de tambores en Isla de Flores"/><div><small>{tr("03 DIC · BARRIO SUR Y PALERMO","03 DEC · BARRIO SUR AND PALERMO")}</small><h4>{tr("Día Nacional del Candombe","National Candombe Day")}</h4><p>{tr("Una expresión central de la identidad afrouruguaya y de Montevideo. Sus cuerdas de tambores recorren Isla de Flores en una jornada de memoria, encuentro y celebración.","A defining expression of Afro-Uruguayan and Montevideo identity. Drum groups take over Isla de Flores for a day of remembrance, community and celebration.")}</p><strong>{tr("Información oficial","Official information")} ↗</strong></div></a>
          <a className="culture-card" href="https://montevideo.gub.uy/noticias/el-carnaval-ya-tiene-fechas-0" target="_blank" rel="noreferrer"><img src={localAsset("/assets/culture/murga-joven.jpg")} alt="Murga Joven en el Teatro de Verano"/><div><small>{tr("01—04 DIC · TEATRO DE VERANO","01—04 DEC · TEATRO DE VERANO")}</small><h4>{tr("Encuentro de Murga Joven","Young Murga Showcase")}</h4><p>{tr("La nueva generación de la murga montevideana presenta repertorios de música, humor y crítica en uno de los escenarios emblemáticos del carnaval.","A new generation of Montevideo murga presents music, humour and social commentary on one of carnival’s landmark stages.")}</p><strong>{tr("Consultar programación","View programme")} ↗</strong></div></a>
          <a className="culture-card" href="https://www.teatrosolis.org.uy/PROGRAMACION/Cascanueces-uc2973" target="_blank" rel="noreferrer"><img src={localAsset("/assets/culture/cascanueces.png")} alt="Gráfica oficial de Cascanueces de la Banda Sinfónica de Montevideo"/><div><small>{tr("02 DIC · 20 H · TEATRO SOLÍS","02 DEC · 8 PM · TEATRO SOLÍS")}</small><h4>{tr("Cascanueces sinfónico","The Nutcracker in concert")}</h4><p>{tr("La Banda Sinfónica de Montevideo interpreta la partitura de Tchaikovsky bajo la dirección del maestro mexicano Enrique Arturo Diemecke.","The Montevideo Symphonic Band performs Tchaikovsky’s score under Mexican conductor Enrique Arturo Diemecke.")}</p><strong>{tr("Ver función","View performance")} ↗</strong></div></a>
          <a className="culture-card" href="https://www.teatrosolis.org.uy/PROGRAMACION/19-Festival-de-Jazz-de-Montevideo-uc3053" target="_blank" rel="noreferrer"><img src={localAsset("/assets/culture/jazz.png")} alt="Gráfica oficial del 19.º Festival de Jazz de Montevideo"/><div><small>{tr("04 DIC · 21 H · TEATRO SOLÍS","04 DEC · 9 PM · TEATRO SOLÍS")}</small><h4>{tr("19.º Festival de Jazz de Montevideo","19th Montevideo Jazz Festival")}</h4><p>{tr("La apertura celebra el centenario de Miles Davis con Kind of Blue: músicos nacionales e internacionales dialogan con una obra que transformó el lenguaje del jazz.","Opening night marks Miles Davis’s centenary with Kind of Blue, bringing national and international musicians into dialogue with an album that changed jazz.")}</p><strong>{tr("Ver festival","View festival")} ↗</strong></div></a>
        </div>
      </section>
      <div className="related-links"><a href={`https://accesibilidadvs26.netlify.app/${lang==="en"?"en/":""}`} target="_blank" rel="noreferrer"><span>{tr("Guía relacionada","Related guide")}</span><strong>{tr("Información de accesibilidad","Accessibility information")}</strong><b>↗</b></a><a href={basePath?"/":"#"}><span>{tr("Guía relacionada","Related guide")}</span><strong>{tr("Sustentabilidad","Sustainability")}</strong><b>↗</b></a></div>
      <PageFoot page="07" />
    </section>

    <section className="sheet visits-sheet" id="agenda">
      <PageHead section="04" title="Recomendados Ventana Sur" />
      <div className="lead-grid compact"><h2>{tr("Recomendados","Ventana Sur")}<br/>{tr("Ventana Sur","recommends")}</h2></div>
      <div className="recommendations-grid">
        <article className="recommendation featured with-media"><img className="recommendation-media featured-media" src="https://cdf.montevideo.gub.uy/system/files/imagecache/Foto_destacada_645_430/fotos/1_59.jpg" alt="Fotografía histórica de una sala de cine en Uruguay"/><span>01 · {tr("FOTOGALERÍA","PHOTO EXHIBITION")}</span><h3>{tr("130 años de cine en Uruguay","130 years of cinema in Uruguay")}</h3><p>{tr("Fotografías, archivos y registros que recuperan rostros, oficios, hábitos y espacios vinculados a la experiencia colectiva de ir al cine.","Photographs and archives portraying the people, trades, habits and spaces linked to the collective experience of going to the movies.")}</p><small>{tr("Parque Rodó · abierta 24 horas · hasta 25.01.2027","Parque Rodó · open 24 hours · until 25 Jan 2027")}</small><Source href="https://cdf.montevideo.gub.uy/exposicion/130-anos-de-cine-en-uruguay" label={tr("Ver la fotogalería","View the exhibition")} /></article>
        <article className="recommendation with-media"><img className="recommendation-media" src="https://muhar.montevideo.gub.uy/sites/muhar.montevideo.gub.uy/files/articulos/imagenes/dsc_3152.jpg" alt="Exposición El mundo de Walter Tournier"/><span>02 · {tr("EXPOSICIÓN","EXHIBITION")}</span><h3>Walter Tournier</h3><p>{tr("Una retrospectiva del cineasta y animador: personajes, muñecos y técnicas artesanales que pasan del dibujo al volumen y al movimiento.","A retrospective of the filmmaker and animator: characters, puppets and hand-crafted techniques moving from drawing to volume and motion.")}</p><small>{tr("Centro Cultural UTU · condiciones a confirmar","UTU Cultural Centre · details to be confirmed")}</small><Source href="https://muhar.montevideo.gub.uy/proximas-actividades/el-mundo-de-walter-tournier" label={tr("El mundo de Walter Tournier · MUHAR","The world of Walter Tournier · MUHAR")} /></article>
        <article className="recommendation green with-media"><img className="recommendation-media mass-art" src="https://www.acau.gub.uy/innovaportal/file/823/1/diseno-sin-titulo-13.png" alt="MASS · Festivales de Málaga y San Sebastián"/><span>03 · {tr("MUESTRA","SHOWCASE")}</span><h3>MASS</h3><p>{tr("Seis películas españolas de las últimas ediciones de los festivales de San Sebastián y Málaga, con sesiones y encuentros en Cinemateca Uruguaya.","Six Spanish films from the latest San Sebastián and Málaga festivals, with screenings and talks at Cinemateca Uruguaya.")}</p><small>{tr("30 NOV—02 DIC · entrada libre hasta completar aforo","30 NOV—02 DEC · free admission, subject to capacity")}</small><Source href="https://www.acau.gub.uy/innovaportal/v/823/1/acau/mass-llega-a-montevideo-con-lo-mejor-del-cine-espanol-de-los-festivales-de-malaga-y-san-sebastian.html" label={tr("Información oficial de MASS","Official MASS information")} /></article>
        <article className="recommendation with-media"><img className="recommendation-media" src="https://www.descubrimontevideo.uy/sites/default/files/styles/escala_y_recorte_1400x800/public/2024-11/DSC01005_1.jpg?itok=N832JJz8" alt="Bus Turístico de Montevideo"/><span>04 · {tr("RECORRIDO","CITY TOUR")}</span><h3>{tr("Bus turístico","Sightseeing bus")}</h3><p>{tr("Buses eléctricos de dos pisos para recorrer los puntos emblemáticos de la ciudad mediante los circuitos Histórico-Cultural y Rambla.","Electric double-decker buses connecting city landmarks on the Historic-Cultural and waterfront routes.")}</p><small>{tr("Beneficio para acreditados · condiciones a confirmar","Accredited guest benefit · details to be confirmed")}</small><Source href="https://www.descubrimontevideo.uy/bus-turistico-de-montevideo" label={tr("Descubrí Montevideo","Discover Montevideo")} /></article>
        <article className="recommendation wide with-media"><img className="recommendation-media" src="https://www.gub.uy/ministerio-educacion-cultura/sites/ministerio-educacion-cultura/files/imagenes/noticias/Portada_3.jpeg" alt="Función de cine al aire libre en Parque Mauá"/><span>05 · {tr("PROYECCIÓN","SCREENING")}</span><h3>{tr("Cine al aire libre","Open-air cinema")}</h3><p>{tr("Una función abierta junto al Río de la Plata, en un espacio costero recuperado como lugar de encuentro para el cine nacional.","An open screening by the Río de la Plata in a restored waterfront setting for Uruguayan cinema.")}</p><small>{tr("Parque Mauá · programación Ventana Sur a confirmar","Parque Mauá · Ventana Sur programme to be confirmed")}</small><Source href="https://www.gub.uy/ministerio-educacion-cultura/comunicacion/noticias/1000-personas-disfrutaron-pelicula-dirigible-ciclo-cine-parque-maua" label={tr("Conocer el ciclo","About the series")} /></article>
      </div>
      <PageFoot page="05" />
    </section>

    <section className="sheet local-sheet" id="local">
      <div className="local-lead"><h2>{tr("Conoce lo local","Meet the local scene")}</h2><p>{tr("Ventana Sur reúne al ecosistema audiovisual de la región y el mundo. Los cafés, bares y comercios cercanos ofrecen otros espacios para continuar las conversaciones, encontrarse y generar nuevos vínculos. Presentá tu acreditación para conocer los beneficios disponibles en cada comercio amigo.","Ventana Sur brings together the audiovisual ecosystem from across the region and the world. Nearby cafés, bars and businesses offer places to continue conversations, meet and build new connections. Show your accreditation to discover the benefits available at each partner business.")}</p></div>
      <aside className="accredited-benefits" aria-label="Beneficios para personas acreditadas">
        <button className="benefit-card" onClick={()=>setBarsOpen(true)}><span className="benefit-mark"><UtilityIcon type="cup"/></span><div><small>{tr("OCHO ESPACIOS · CENTRO Y ZONAS CERCANAS","EIGHT VENUES · CENTRO AND NEARBY")}</small><h3>{tr("Bares amigos","Partner bars")}</h3><p>{tr("Cafés y bares con actividad diurna y nocturna para reunirse o continuar la conversación después de las actividades.","Daytime and evening cafés and bars for meeting or continuing the conversation after the programme.")}</p><strong>{tr("Conocer los bares y ubicaciones","Explore bars and locations")} ↗</strong></div></button>
        <a className="benefit-card" href="https://www.descubrimontevideo.uy/que-hacer/casco-historico" target="_blank" rel="noreferrer"><span className="benefit-mark"><UtilityIcon type="store"/></span><div><small>{tr("COMERCIOS Y ESPACIOS ADHERIDOS","PARTICIPATING SHOPS AND VENUES")}</small><h3>Distrito Ciudad Vieja</h3><p>{tr("Locales del distrito ofrecen atenciones y descuentos presentando la acreditación de Ventana Sur.","District businesses offer benefits and discounts upon presentation of a Ventana Sur accreditation.")}</p><strong>{tr("Conocer el distrito","Explore the district")} ↗</strong></div></a>
      </aside>
      <PageFoot page="06" />
    </section>
    </div>
    <nav className="reader-nav" aria-label="Navegación de la guía">
      <button className="arrow" onClick={()=>goToPage(page-1)} disabled={page===0} aria-label="Página anterior">‹</button>
      <div className="page-status"><span>{String(page+1).padStart(2,"0")} / 07</span><strong>{pageNames[page]}</strong></div>
      <div className="page-dots">{pageNames.map((name,index)=><button key={name} className={page===index?"current":""} onClick={()=>goToPage(index)} aria-label={`Ir a ${name}`}/>)}</div>
      <button className="arrow" onClick={()=>goToPage(page+1)} disabled={page===6} aria-label="Página siguiente">›</button>
    </nav>
    {barsOpen&&<div className="bars-modal" role="dialog" aria-modal="true" aria-label={tr("Bares amigos","Partner bars")}><button className="bars-close" onClick={()=>setBarsOpen(false)} aria-label={tr("Cerrar","Close")}>×</button><div className="bars-modal-head"><h2>{tr("Bares amigos","Partner bars")}</h2><p>{tr("Espacios para reunirse durante el día o continuar la conversación después de las actividades.","Places to meet during the day or continue the conversation after the programme.")}</p></div><div className="bars-grid">{places.filter(p=>p.kind==="bar").map((bar)=><article key={bar.id}><div className={`bar-wordmark mark-${bar.id}`}>{barMarks[bar.id].split("\n").map((line,i)=><span key={i}>{line}</span>)}</div><div><h3>{bar.name}</h3><p>{bar.address}</p><div className="bar-actions"><button onClick={()=>{setBarsOpen(false);setShowBars(true);setDestination(bar.id);document.getElementById("mapa")?.scrollIntoView({behavior:"smooth"})}}>{tr("Ver en el mapa","View on map")} ↑</button><a href={`https://www.instagram.com/${barInstagram[bar.id]}/`} target="_blank" rel="noreferrer">Instagram ↗</a></div></div></article>)}</div></div>}
  </main>
}

function PageHead({section,title}:{section:string,title:string}){return <header className="page-head"><img src={localAsset("/ventana-sur-official.svg")} alt="Ventana Sur"/><p><span>{section}</span>{title}</p></header>}
function PageFoot({page}:{page:string}){return <footer className="page-foot"><span>VENTANA SUR · PRACTICAL INFO · 2026</span><span>{page}</span></footer>}
function Source({href,label}:{href:string,label:string}){return <a className="source" href={href} target="_blank" rel="noreferrer">{label}<b>↗</b></a>}
function UtilityIcon({type}:{type:"money"|"bus"|"plug"|"info"|"cup"|"store"}){
  const paths={money:<><rect x="3" y="6" width="18" height="13" rx="2"/><path d="M7 10h10M8 15h.01M16 15h.01"/></>,bus:<><rect x="5" y="3" width="14" height="17" rx="3"/><path d="M5 12h14M8 7h8M8 20v2M16 20v2"/><circle cx="8.5" cy="16" r=".7"/><circle cx="15.5" cy="16" r=".7"/></>,plug:<><path d="M9 3v6M15 3v6M7 8h10v3a5 5 0 0 1-10 0V8ZM12 16v5"/></>,info:<><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7h.01"/></>,cup:<><path d="M5 8h12v5a6 6 0 0 1-12 0V8ZM17 10h1a3 3 0 0 1 0 6h-2M4 21h15"/></>,store:<><path d="M4 10v10h16V10M3 10l2-6h14l2 6M8 20v-6h5v6"/><path d="M3 10a3 3 0 0 0 5 0 3 3 0 0 0 5 0 3 3 0 0 0 5 0 3 3 0 0 0 3-1"/></>};
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{paths[type]}</svg>
}
function VenueCard({name,role,address,image,href,wide=false}:{name:string;role:string;address:string;image:string;href:string;wide?:boolean}){return <article className={`venue-card ${wide?"wide":""}`}><img src={image} alt={name} loading="lazy"/><div><span>{role}</span><h3>{name}</h3><p>{address}</p><a href={href} target="_blank" rel="noreferrer">Sitio oficial <b>↗</b></a></div></article>}
