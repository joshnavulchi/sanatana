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
    init.textContent = `window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '${id}');`;
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
    s.textContent = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${id}');`;
    document.head.appendChild(s);

    // Add noscript iframe fallback - create iframe as a child element
    const nos = document.createElement('noscript');
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.googletagmanager.com/ns.html?id=${id}`;
    iframe.height = '0';
    iframe.width = '0';
    iframe.style.display = 'none';
    iframe.style.visibility = 'hidden';
    nos.appendChild(iframe);
    document.body.appendChild(nos);

    win.__gtm_loaded = true;
  } catch (err) {
    /* ignore */
  }
}

export default { loadGtag, loadGTM };
