(() => {
  'use strict';

  const english = new URLSearchParams(window.location.search).get('lang') === 'en';
  const copy = english
    ? {
        eyebrow: 'DISCOVER MONTEVIDEO PLUS',
        title: 'Plan your route through Montevideo',
        body: 'Explore the city’s updated offer and create a personalized itinerary based on your time and interests.',
        action: 'Open the app'
      }
    : {
        eyebrow: 'DESCUBRÍ MONTEVIDEO PLUS',
        title: 'Armá tu recorrido por Montevideo',
        body: 'Explorá la oferta actualizada de la ciudad y creá un itinerario según tu tiempo y tus preferencias.',
        action: 'Abrir la aplicación'
      };

  function addStyles() {
    if (document.getElementById('descubri-plus-styles')) return;
    const style = document.createElement('style');
    style.id = 'descubri-plus-styles';
    style.textContent = `
      .descubri-plus-banner{margin:32px 0 42px;border:1px solid rgba(36,37,255,.22);background:#fff;display:grid;grid-template-columns:minmax(190px,250px) 1fr auto;align-items:center;gap:28px;padding:25px 28px;color:#181a42;transition:transform .22s ease,box-shadow .22s ease,border-color .22s ease}
      .descubri-plus-banner:hover{transform:translateY(-3px);border-color:rgba(36,37,255,.38);box-shadow:0 13px 28px rgba(32,35,105,.10)}
      .descubri-plus-brand{display:flex;align-items:center;justify-content:center;min-height:72px;padding:14px 18px;background:#fff}
      .descubri-plus-brand img{display:block;width:100%;max-width:205px;height:auto}
      .descubri-plus-copy small{display:block;margin-bottom:7px;color:#2425ff;font-size:11px;font-weight:800;letter-spacing:.14em}
      .descubri-plus-copy h3{margin:0 0 6px;font-size:clamp(22px,2.2vw,32px);line-height:1.02;letter-spacing:-.035em}
      .descubri-plus-copy p{max-width:610px;margin:0;font-size:14px;line-height:1.45;color:#494b68}
      .descubri-plus-action{display:inline-flex;align-items:center;justify-content:center;min-height:46px;padding:0 20px;border:1px solid #2425ff;background:#2425ff;color:#fff!important;text-decoration:none!important;font-size:13px;font-weight:800;white-space:nowrap;transition:background .2s,color .2s,border-color .2s,transform .2s}
      .descubri-plus-action:hover,.descubri-plus-action:focus-visible{background:#53e3bd;border-color:#53e3bd;color:#181a42!important;transform:translateY(-2px)}
      .participation-grid.expanded .cinando-wide{grid-column:1/-1;min-height:390px!important}
      @media(max-width:760px){.descubri-plus-banner{grid-template-columns:1fr;gap:18px;padding:22px}.descubri-plus-brand{justify-content:flex-start}.descubri-plus-brand img{max-width:190px}.descubri-plus-action{width:100%}.participation-grid.expanded .cinando-wide{min-height:auto!important}}
    `;
    document.head.appendChild(style);
  }

  function addBanner() {
    const culture = document.querySelector('.culture-edit');
    if (!culture || document.getElementById('descubri-plus-banner')) return false;
    addStyles();
    const banner = document.createElement('aside');
    banner.id = 'descubri-plus-banner';
    banner.className = 'descubri-plus-banner';
    banner.setAttribute('aria-label', copy.eyebrow);
    banner.innerHTML = `
      <div class="descubri-plus-brand"><img src="/logo-descubri-montevideo.svg" alt="Descubrí Montevideo"></div>
      <div class="descubri-plus-copy"><small>${copy.eyebrow}</small><h3>${copy.title}</h3><p>${copy.body}</p></div>
      <a class="descubri-plus-action" href="https://www.descubrimontevideoplus.uy/" target="_blank" rel="noreferrer">${copy.action}&nbsp; ↗</a>`;
    culture.insertAdjacentElement('beforebegin', banner);
    return true;
  }

  const textCorrections = english
    ? [
        ['You will receive your accreditation at the hotel. If this is not the case, collect it at the accreditation desk.', 'You will receive your accreditation at your hotel. If you do not collect it there, you can pick it up at the accreditation desk.'],
        ['The desk opens on Monday 30 November at 11 am. From Tuesday to Thursday it is open from 9:30 am to 5 pm at Auditorio Nacional “Adela Reta” (SODRE).', 'The accreditation desk at Auditorio Nacional “Adela Reta” (SODRE) will open at 11 am on Monday 30 November. From Tuesday to Thursday, it will be open from 9:30 am to 5 pm.'],
        ['Transfers to hotels', 'Hotel transfer coordinator'],
        ['Entry requirements may vary depending on nationality. Carrasco International Airport is approximately 20 kilometres from downtown Montevideo, where Ventana Sur activities will take place.', 'We recommend checking the official entry requirements, as they may vary depending on your nationality. Carrasco International Airport is approximately 20 kilometres from central Montevideo, where Ventana Sur activities will take place.'],
        ['Montevideo is usually humid and windy. Daytime temperatures may range from 16°C to 28°C and rarely fall below 10°C at night. Bring layers, comfortable shoes, a sun hat and sunscreen.', 'Montevideo is usually humid and windy. At this time of year, daytime temperatures may range from 16°C to 28°C and rarely fall below 10°C at night. We recommend bringing layers, comfortable shoes, a sun hat and sunscreen.'],
        ['The local currency is the Uruguayan peso ($). The organisation’s document uses approximate references of 44 pesos per euro and 41.50 pesos per US dollar; rates may fluctuate during the day. Cards are accepted by most businesses and services.', 'The local currency is the Uruguayan peso ($). As of November 2026, the reference exchange rates are 44 Uruguayan pesos per euro and 41.50 Uruguayan pesos per US dollar. Exchange rates are subject to change. Cards are accepted by most businesses and services.'],
        ['Uruguay offers visitors zero VAT on restaurant services and car rental without a driver, as well as the Tax Free regime.', 'Uruguay offers tourists zero VAT on restaurant services and car rentals without a driver, as well as a Tax Free scheme.'],
        ['Venues are close to one another, particularly in Centro and Ciudad Vieja. For longer distances use taxis, ride-hailing apps such as Uber or Cabify, or local buses. Check each venue location before the activity to plan your journey.', 'The proximity of the venues and the location of recommended hotels, restaurants, bars and cafés make it easier for accredited guests to get around. Our Sustainability Plan aims to reduce the need for motorised travel and encourage walking whenever each person’s circumstances and needs allow.\n\nFor longer distances, you can take a local bus or taxi, or use ride-hailing apps such as Uber or Cabify. Check the location before each activity to plan your journey.']
      ]
    : [
        ['Van a recibir la acreditación en el hotel. Si no la reciben allí, podrán retirarla en el mostrador de acreditaciones.', 'Recibirás tu acreditación en el hotel. En caso de que no la retires, podrás hacerlo en el mostrador de acreditaciones.'],
        ['El mostrador abrirá el lunes 30 de noviembre a las 11 h. De martes a jueves atenderá de 9:30 a 17 h en el Auditorio Nacional «Adela Reta» (SODRE).', 'El mostrador de acreditaciones del Auditorio Nacional «Adela Reta» (SODRE) atenderá el lunes 30 de noviembre a partir de las 11 h. De martes a jueves, estará abierto de 9:30 a 17 h.'],
        ['Traslado a los hoteles', 'Coordinación de traslados a los hoteles'],
        ['Los requisitos de ingreso pueden variar según la nacionalidad. El Aeropuerto Internacional de Carrasco está a unos 20 kilómetros del centro de Montevideo, donde se realizarán las actividades de Ventana Sur.', 'Te recomendamos consultar los requisitos oficiales de ingreso, ya que pueden variar según la nacionalidad. El Aeropuerto Internacional de Carrasco está a unos 20 kilómetros del centro de Montevideo, donde se realizarán las actividades de Ventana Sur.'],
        ['Clima y qué llevar', 'Clima e indumentaria'],
        ['Montevideo suele ser húmeda y ventosa. Las temperaturas diurnas pueden oscilar entre 16 °C y 28 °C y rara vez bajan de 10 °C por la noche. Llevá ropa en capas, calzado cómodo, gorro y protector solar.', 'Montevideo suele ser húmeda y ventosa. En esta época del año, las temperaturas diurnas pueden oscilar entre 16 °C y 28 °C y rara vez bajan de 10 °C por la noche. Te recomendamos llevar prendas que puedas usar en capas, calzado cómodo, gorro y protector solar.'],
        ['La moneda local es el peso uruguayo ($). El documento de organización toma como referencia aproximada 44 pesos por euro y 41,50 pesos por dólar; la cotización puede variar durante el día. Se aceptan tarjetas en la mayoría de los comercios y servicios.', 'La moneda local es el peso uruguayo ($). En noviembre de 2026, la referencia para el cambio de divisas es de 44 pesos uruguayos por euro y 41,50 pesos uruguayos por dólar. La cotización está sujeta a variaciones. Se aceptan tarjetas en la mayoría de los comercios y servicios.'],
        ['Las sedes están cerca unas de otras, especialmente en Centro y Ciudad Vieja. Para distancias más largas hay taxis, aplicaciones como Uber o Cabify y ómnibus. Consultá la ubicación antes de cada actividad para planificar el traslado.', 'La cercanía entre las sedes y la ubicación de los hoteles, restaurantes, bares y cafés recomendados facilitan los desplazamientos de las personas acreditadas. Nuestro Plan de Sustentabilidad busca reducir la necesidad de traslados motorizados y favorecer los recorridos a pie, de acuerdo con las posibilidades y necesidades de cada persona.\n\nPara distancias más largas, podés tomar ómnibus de línea o taxis, o utilizar aplicaciones como Uber o Cabify. Consultá la ubicación antes de cada actividad para planificar tu traslado.']
      ];

  function applyTextCorrections() {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node => {
      textCorrections.forEach(([from, to]) => {
        if (node.nodeValue !== from) return;
        if (!to.includes('\n\n')) {
          node.nodeValue = to;
          return;
        }
        const [first, second] = to.split('\n\n');
        const fragment = document.createDocumentFragment();
        fragment.append(first, document.createElement('br'), document.createElement('br'), second);
        node.replaceWith(fragment);
      });
    });
  }

  function arrangeParticipationCards() {
    const grid = document.querySelector('.participation-grid.expanded');
    if (!grid) return;
    const keyEvents = grid.querySelector('.key-events');
    if (keyEvents) keyEvents.closest('article')?.remove();
    const cinando = grid.querySelector('img[alt="Cinando"]')?.closest('article');
    if (cinando) cinando.classList.add('cinando-wide');
  }

  const observer = new MutationObserver(addBanner);
  observer.observe(document.documentElement, {childList: true, subtree: true});
  window.addEventListener('load', () => { addBanner(); applyTextCorrections(); arrangeParticipationCards(); }, {once: true});
  [0, 150, 500, 1200].forEach(delay => window.setTimeout(() => { addBanner(); applyTextCorrections(); arrangeParticipationCards(); }, delay));
})();
