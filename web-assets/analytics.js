(() => {
  const measurementId = window.ZG_GA_MEASUREMENT_ID;
  const debugKey = "ga_debug";
  const pendingLeadKey = "zg_pending_generate_lead";
  const query = new URLSearchParams(location.search);
  const isLocal = ["localhost", "127.0.0.1", "::1"].includes(location.hostname);
  const debugMode = query.get(debugKey) === "1" || sessionStorage.getItem(debugKey) === "1" || isLocal;
  const localeValue = (value) => ({ "zh-Hant": "zh-TW", "zh-Hans": "zh-CN" }[value] || value || "unknown");
  if (query.get(debugKey) === "1") sessionStorage.setItem(debugKey, "1");
  window.dataLayer = window.dataLayer || [];
  const content = () => {
    const parts = location.pathname.split("/").filter(Boolean);
    const typeIndex = parts.findIndex((part) => part === "services" || part === "insights" || part === "cases");
    const contentType = typeIndex < 0 ? "homepage" : parts[typeIndex] === "insights" ? "article" : parts[typeIndex] === "cases" ? "case_study" : "service";
    const contentSlug = typeIndex < 0 ? "home" : parts[typeIndex + 1] || contentType;
    return { content_type: contentType, content_slug: contentSlug, ...(contentType === "service" ? { service_name: contentSlug } : {}) };
  };
  const page = () => ({
    page_path: `${location.pathname}${location.search}`,
    page_title: document.title,
    page_location: location.href,
    locale: document.documentElement.lang || "unknown",
    ...content()
  });
  const pendingLead = (() => {
    try {
      const value = localStorage.getItem(pendingLeadKey);
      localStorage.removeItem(pendingLeadKey);
      return value ? JSON.parse(value) : null;
    } catch {
      return null;
    }
  })();
  const track = (event, details = {}) => {
    const payload = { ...page(), ...details, ...(debugMode ? { debug_mode: true } : {}) };
    window.dataLayer.push({ event, ...payload });
    if (!measurementId || !window.gtag) return Promise.resolve();
    return new Promise((resolve) => {
      window.gtag("event", event, { ...payload, event_callback: resolve, event_timeout: 1500 });
    });
  };

  window.zgTrack = track;
  window.zgPagePayload = page;
  if (measurementId) {
    window.gtag = window.gtag || function gtag() { window.dataLayer.push(arguments); };
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
    script.addEventListener("load", () => {
      track("page_view");
      if (pendingLead) track("generate_lead", pendingLead);
    }, { once: true });
    document.head.append(script);
    window.gtag("js", new Date());
    if (debugMode) window.gtag("set", "debug_mode", true);
    window.gtag("config", measurementId, { send_page_view: false, ...(debugMode ? { debug_mode: true } : {}) });
  } else track("page_view");

  document.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return;
    const element = event.target.closest("[data-track-event], [data-lang-link]");
    if (!element) return;
    let tracked = null;
    if (element.dataset.langLink) {
      if (debugMode && element instanceof HTMLAnchorElement) {
        const destination = new URL(element.href, location.href);
        destination.searchParams.set(debugKey, "1");
        element.href = destination.href;
      }
      tracked = track("language_switch", { from_locale: localeValue(document.documentElement.lang), to_locale: localeValue(element.dataset.langLink), target_url: element instanceof HTMLAnchorElement ? new URL(element.href, location.href).href : location.href });
    }
    if (element.dataset.trackEvent) tracked = track(element.dataset.trackEvent, { cta_location: element.dataset.trackLocation || "content", target_url: element instanceof HTMLAnchorElement ? new URL(element.href, location.href).href : location.href });
    if (!(element instanceof HTMLAnchorElement) || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || element.target === "_blank") return;
    const destination = new URL(element.href, location.href);
    const isSameDocument = destination.origin === location.origin && destination.pathname === location.pathname && destination.search === location.search;
    if (isSameDocument) return;
    event.preventDefault();
    (tracked || Promise.resolve()).finally(() => location.assign(element.href));
  });
})();
