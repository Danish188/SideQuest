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
 * only by `wrangler pages deploy`, and a Worker deployment ignores them entirely.
 * Routing therefore has to be explicit, and it lives here.
 *
 * Assets are matched first by the runtime, so only paths with no file behind them
 * reach this code. `/api/quest` is one of those; everything else is handed back to
 * the asset binding, which serves the file or falls back to index.html so client
 * side routes like /history resolve instead of 404ing.
 */
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const { pathname } = new URL(request.url);

    if (pathname === '/api/quest') {
      return handleQuestRequest(request, env.OPENAI_API_KEY);
    }

    return env.ASSETS.fetch(request);
  },
};
