// Client-safe helpers to dynamically load analytics scripts after user consent
export function loadGtag(id?: string) {
  try {
    if (typeof window === 'undefined' || !id) return;
    const win = window as any;
    if (win.__ga_loaded) return;
    const s = document.createElement('script');
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
    document.head.appendChild(s);

    const init = document.createElement('script');
    init.innerHTML = `window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '${id}');`;
    document.head.appendChild(init);
    win.__ga_loaded = true;
  } catch (err) {
    /* ignore */
  }
}

export function loadGTM(id?: string) {
  try {
    if (typeof window === 'undefined' || !id) return;
    const win = window as any;
    if (win.__gtm_loaded) return;
    // Inject GTM script
    const s = document.createElement('script');
    s.innerHTML = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${id}');`;
    document.head.appendChild(s);

    // Add noscript iframe fallback
    const nos = document.createElement('noscript');
    nos.innerHTML = `<iframe src="https://www.googletagmanager.com/ns.html?id=${id}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`;
    document.body.appendChild(nos);

    win.__gtm_loaded = true;
  } catch (err) {
    /* ignore */
  }
}

export default { loadGtag, loadGTM };
