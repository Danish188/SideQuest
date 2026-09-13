import { handleQuestRequest } from '../../server/generateQuest';

/** Bindings this Function reads. The key is set in the Cloudflare dashboard. */
interface Env {
  OPENAI_API_KEY?: string;
}

/**
 * Cloudflare Pages adapter. All of the work lives in `server/generateQuest.ts`,
 * which is written against the Web `Request`/`Response` the Workers runtime
 * already speaks, so this file only has to hand over the key.
 */
export function onRequestPost(context: { request: Request; env: Env }): Promise<Response> {
  return handleQuestRequest(context.request, context.env.OPENAI_API_KEY);
}
