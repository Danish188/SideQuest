import { handleQuestRequest } from '../server/generateQuest';

interface Env {
  /** The static build in `dist`, bound by wrangler.jsonc. */
  ASSETS: { fetch(request: Request): Promise<Response> };
  /** Set as a Secret in the Cloudflare dashboard. Never reaches the browser. */
  OPENAI_API_KEY?: string;
}

/**
 * The Worker entry point.
 *
 * This project deploys as a Worker with static assets, not as a Pages project, so
 * the `functions/` directory convention does not apply: Pages Functions are read
 * only by `wrangler pages deploy` and a Worker deployment ignores them entirely.
 * Routing therefore has to be explicit, and it lives here.
 */
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const { pathname } = new URL(request.url);

    if (pathname === '/api/quest') {
      return handleQuestRequest(request, env.OPENAI_API_KEY);
    }

    const asset = await env.ASSETS.fetch(request);
    if (asset.status !== 404) return asset;

    /*
     * Client-side routing, deliberately narrow.
     *
     * The obvious version of this is `not_found_handling: "single-page-application"`
     * in wrangler.jsonc, which serves index.html for anything with no file behind
     * it. That is wrong, and it fails in a way that is genuinely hard to diagnose:
     * a page asking for a bundle that is not there, because it is mid-deploy or
     * holding a stale index.html, gets HTML back with a 200 and `text/html`. The
     * browser refuses to execute it as a module, React never mounts, and the user
     * sees a blank page in the pre-paint theme colour with nothing useful in the
     * console. A missing asset has to 404 like a missing asset.
     *
     * So only document requests get the fallback. Everything else keeps its 404.
     */
    const wantsDocument =
      request.method === 'GET' && (request.headers.get('accept') ?? '').includes('text/html');

    if (!wantsDocument) return asset;

    return env.ASSETS.fetch(new Request(new URL('/', request.url).toString(), request));
  },
};
