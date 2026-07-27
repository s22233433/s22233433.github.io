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
    const route = ["zh-tw", "zh-cn", "en", "ja"].includes(parts[0]) ? parts.slice(1) : parts;
    const section = route[0];
    const contentType = section === "services" ? "service"
      : section === "insights" ? "article"
      : section === "cases" ? "case_study"
      : section === "tools" ? "product"
      : section === "mytools" ? "mytools"
      : section === "privacy" ? "privacy"
      : section ? "other" : "homepage";
    const contentSlug = contentType === "homepage" ? "home" : route[1] || (contentType === "other" ? section : contentType);
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
      if (pendingLead) setTimeout(() => track("generate_lead", pendingLead), 50);
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
    if (element.dataset.trackEvent) tracked = track(element.dataset.trackEvent, {
      cta_location: element.dataset.trackLocation || "content",
      target_url: element instanceof HTMLAnchorElement ? new URL(element.href, location.href).href : location.href,
      ...(element.dataset.productName ? { product_name: element.dataset.productName } : {}),
      ...(element.dataset.serviceName ? { service_name: element.dataset.serviceName } : {})
    });
    if (!(element instanceof HTMLAnchorElement) || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || element.target === "_blank") return;
    const destination = new URL(element.href, location.href);
    const isSameDocument = destination.origin === location.origin && destination.pathname === location.pathname && destination.search === location.search;
    if (isSameDocument) return;
    event.preventDefault();
    (tracked || Promise.resolve()).finally(() => location.assign(element.href));
  });
})();
