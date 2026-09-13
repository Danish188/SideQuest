import { handleQuestRequest } from '../server/generateQuest';

/** Edge, not Node: `handleQuestRequest` speaks the Web Request/Response API. */
export const config = { runtime: 'edge' };

/** Vercel adapter. The shared module does the work; this passes the key in. */
export default function handler(request: Request): Promise<Response> {
  return handleQuestRequest(request, process.env.OPENAI_API_KEY);
}
