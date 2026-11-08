/** Estado persistido é entrada não confiável: validar cada campo isoladamente. */
export function normalizarEstado(raw, ids, categorias) {
  const perline = Number(raw.perline);
  const lado = Number(raw.lado);
  return {
    selecao: [
      ...new Set(
        (Array.isArray(raw.selecao) ? raw.selecao : []).filter(
          id => typeof id === 'string' && ids.has(id)
        )
      ),
    ],
    termo: '',
    categoria: categorias.includes(raw.categoria) ? raw.categoria : null,
    perline:
      Number.isInteger(perline) && perline >= 1 && perline <= 50 ? perline : 15,
    formato: ['svg', 'png', 'webp'].includes(raw.formato) ? raw.formato : 'svg',
    lado:
      Number.isFinite(lado) && lado > 0
        ? Math.min(1024, Math.max(16, Math.round(lado)))
        : 256,
  };
}
