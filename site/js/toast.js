/** Toast único, reaproveitado. O elemento já é role="status" aria-live. */
let timer;

export function toast(mensagem, tipo = 'ok') {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = mensagem;
  el.dataset.kind = tipo;
  el.dataset.open = 'true';
  clearTimeout(timer);
  timer = setTimeout(() => {
    el.dataset.open = 'false';
  }, 2400);
}

/** Copia e avisa. Devolve true/false para quem quiser encadear. */
export async function copiar(texto, rotulo = 'Copiado') {
  try {
    await navigator.clipboard.writeText(texto);
    toast(rotulo);
    return true;
  } catch {
    toast('Não foi possível copiar', 'err');
    return false;
  }
}
