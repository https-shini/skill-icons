/**
 * Entrada do Cloudflare Worker. A lógica vive em lib/icons.mjs, compartilhada
 * com as funções da Vercel em api/, para as duas hospedagens não divergirem.
 *
 * Aqui o fallback é `fetch(request)`: quando o Worker está numa zona com origem,
 * qualquer rota que não seja da API é proxyada para o site estático. Na Vercel o
 * fallback é 404 — ver api/render.mjs.
 */
import { handle } from './lib/icons.mjs';

export default {
  async fetch(request) {
    try {
      const response = await handle(request);
      return response ?? fetch(request);
    } catch (err) {
      return new Response(err.stack, { status: 500 });
    }
  },
};
