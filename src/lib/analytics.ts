// Lightweight analytics: UTM capture + event tracking.
// Pushes to window.dataLayer (GTM-compatible) and console in dev.
// Persists first-touch UTM in localStorage and last-touch in sessionStorage.

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
] as const;

export type UtmParams = Partial<Record<(typeof UTM_KEYS)[number], string>> & {
  referrer?: string;
  landing_path?: string;
  gclid?: string;
  fbclid?: string;
};

const FIRST_KEY = "utm_first_touch_v1";
const LAST_KEY = "utm_last_touch_v1";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
  }
}

const safeParse = (raw: string | null): UtmParams | null => {
  if (!raw) return null;
  try { return JSON.parse(raw) as UtmParams; } catch { return null; }
};

export const captureUtm = () => {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  const captured: UtmParams = {};
  let hasUtm = false;

  UTM_KEYS.forEach((k) => {
    const v = url.searchParams.get(k);
    if (v) { captured[k] = v.slice(0, 100); hasUtm = true; }
  });
  const gclid = url.searchParams.get("gclid");
  const fbclid = url.searchParams.get("fbclid");
  if (gclid) { captured.gclid = gclid.slice(0, 200); hasUtm = true; }
  if (fbclid) { captured.fbclid = fbclid.slice(0, 200); hasUtm = true; }

  if (!hasUtm) return;

  captured.referrer = document.referrer || undefined;
  captured.landing_path = url.pathname + url.search;

  try {
    if (!localStorage.getItem(FIRST_KEY)) {
      localStorage.setItem(FIRST_KEY, JSON.stringify({ ...captured, ts: Date.now() }));
    }
    sessionStorage.setItem(LAST_KEY, JSON.stringify({ ...captured, ts: Date.now() }));
  } catch { /* storage blocked */ }

  track("utm_captured", captured);
};

export const getUtm = (): { first: UtmParams | null; last: UtmParams | null } => {
  if (typeof window === "undefined") return { first: null, last: null };
  try {
    return {
      first: safeParse(localStorage.getItem(FIRST_KEY)),
      last: safeParse(sessionStorage.getItem(LAST_KEY)),
    };
  } catch {
    return { first: null, last: null };
  }
};

export const track = (event: string, props: Record<string, unknown> = {}) => {
  if (typeof window === "undefined") return;
  const { first, last } = getUtm();
  const payload = {
    event,
    ...props,
    utm_first: first ?? undefined,
    utm_last: last ?? undefined,
    ts: Date.now(),
  };
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);
  if (typeof window.gtag === "function") {
    window.gtag("event", event, props);
  }
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.debug("[analytics]", event, payload);
  }
};

// Build a serialized UTM string to append to the lead `message` field
// so attribution lives alongside the lead row in the DB.
export const utmMessageSuffix = (): string => {
  const { first, last } = getUtm();
  if (!first && !last) return "";
  const parts: string[] = ["", "---", "Attribution:"];
  if (first) parts.push(`first=${JSON.stringify(first)}`);
  if (last) parts.push(`last=${JSON.stringify(last)}`);
  return parts.join("\n").slice(0, 1500);
};

export const buildLeadMessage = (base?: string | null): string | null => {
  const suffix = utmMessageSuffix();
  const baseStr = (base ?? "").trim();
  const out = baseStr ? `${baseStr}${suffix}` : suffix.trim();
  return out ? out.slice(0, 2000) : null;
};
