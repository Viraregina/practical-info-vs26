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
      @media(max-width:760px){.descubri-plus-banner{grid-template-columns:1fr;gap:18px;padding:22px}.descubri-plus-brand{justify-content:flex-start}.descubri-plus-brand img{max-width:190px}.descubri-plus-action{width:100%}}
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

  const observer = new MutationObserver(addBanner);
  observer.observe(document.documentElement, {childList: true, subtree: true});
  window.addEventListener('load', addBanner, {once: true});
  [0, 150, 500, 1200].forEach(delay => window.setTimeout(addBanner, delay));
})();
