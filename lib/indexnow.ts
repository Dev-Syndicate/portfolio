import "server-only";

import { site } from "@/lib/content";

/**
 * IndexNow — instantly tell participating search engines that a URL was added,
 * updated, or removed. Submitting to one participant (we use Bing's endpoint)
 * automatically shares the URLs with every other participant — Bing, Brave,
 * Yandex, Seznam, and others — so a single call reaches the engines that don't
 * offer a submit portal (notably Brave).
 *
 * Ownership is proven by a key file hosted at the site root:
 *   https://<host>/<key>.txt   (public/<key>.txt in this repo)
 * The key is NOT a secret — it only proves control of the host, and the search
 * engines fetch it publicly. See the IndexNow docs.
 *
 * This is best-effort and must never break a publish: all failures are caught
 * and logged, never thrown. It also no-ops unless the canonical site URL is a
 * real https host (so local dev / preview URLs don't spam the endpoint).
 */

const KEY = "9e434de976137ecb9f65bc29ef49b2e1";
const ENDPOINT = "https://api.indexnow.org/indexnow";

function siteHost(): string | null {
  try {
    const u = new URL(site.url);
    // Only submit for the real production host over https. Anything else
    // (localhost, vercel preview) is skipped — IndexNow only accepts URLs that
    // belong to the verified host, and we only host the key file on prod.
    if (u.protocol !== "https:") return null;
    if (u.hostname === "localhost" || u.hostname.endsWith(".vercel.app")) {
      return null;
    }
    return u.host;
  } catch {
    return null;
  }
}

/**
 * Notify IndexNow that the given site paths changed. Pass absolute paths
 * (e.g. "/blog/my-post"); they're resolved against the canonical site URL.
 * Deduplicates and caps at the protocol's 10,000-URL limit.
 */
export async function pingIndexNow(paths: string[]): Promise<void> {
  const host = siteHost();
  if (!host) return;

  const urlList = Array.from(
    new Set(paths.filter(Boolean).map((p) => new URL(p, site.url).toString())),
  ).slice(0, 10000);
  if (urlList.length === 0) return;

  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "content-type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host,
        key: KEY,
        keyLocation: new URL(`/${KEY}.txt`, site.url).toString(),
        urlList,
      }),
    });
    // 200 OK and 202 Accepted both mean "received". Anything else is worth a
    // log line but never a thrown error — indexing is not on the critical path.
    if (res.status !== 200 && res.status !== 202) {
      console.error(`[indexnow] unexpected status ${res.status}`);
    }
  } catch (error) {
    console.error("[indexnow] ping failed:", error);
  }
}
