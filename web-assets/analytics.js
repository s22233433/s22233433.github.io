(() => {
  const measurementId = window.ZG_GA_MEASUREMENT_ID;
  const debugMode = new URLSearchParams(location.search).has("ga_debug");
  window.dataLayer = window.dataLayer || [];
  const page = () => ({
    page_path: `${location.pathname}${location.search}`,
    page_title: document.title,
    locale: document.documentElement.lang || "unknown"
  });
  const track = (event, details = {}) => {
    const payload = { ...page(), ...details, ...(debugMode ? { debug_mode: true } : {}) };
    window.dataLayer.push({ event, ...payload });
    if (measurementId && window.gtag) window.gtag("event", event, payload);
  };

  window.zgTrack = track;
  if (measurementId) {
    window.gtag = window.gtag || function gtag() { window.dataLayer.push(arguments); };
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
    document.head.append(script);
    window.gtag("js", new Date());
    if (debugMode) window.gtag("set", "debug_mode", true);
    window.gtag("config", measurementId, { send_page_view: false, ...(debugMode ? { debug_mode: true } : {}) });
  }
  track("page_view");

  document.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return;
    const element = event.target.closest("[data-track-event], [data-lang-link]");
    if (!element) return;
    if (element.dataset.langLink) track("language_switch", { target_locale: element.dataset.langLink });
    if (element.dataset.trackEvent) track(element.dataset.trackEvent, { cta_location: element.dataset.trackLocation || "content" });
    if (!(element instanceof HTMLAnchorElement) || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || element.target === "_blank") return;
    const destination = new URL(element.href, location.href);
    const isSameDocument = destination.origin === location.origin && destination.pathname === location.pathname && destination.search === location.search;
    if (isSameDocument) return;
    event.preventDefault();
    window.setTimeout(() => location.assign(element.href), 700);
  });
})();
