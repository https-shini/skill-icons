/**
 * localStorage que não derruba a página.
 *
 * Em origem opaca (file://, iframe com sandbox, alguns modos privativos) só
 * TOCAR em localStorage lança SecurityError. Sem este wrapper a exceção subia
 * no topo do módulo e nada mais inicializava — a página abria morta.
 */
const PREFIXO = 'si:';

export const store = {
  get(chave, padrao = null) {
    try {
      const v = localStorage.getItem(PREFIXO + chave);
      return v === null ? padrao : v;
    } catch {
      return padrao;
    }
  },
  set(chave, valor) {
    try {
      localStorage.setItem(PREFIXO + chave, valor);
    } catch {
      /* sem persistência; a sessão segue funcionando */
    }
  },
  getJSON(chave, padrao) {
    const bruto = this.get(chave);
    if (bruto === null) return padrao;
    try {
      return JSON.parse(bruto);
    } catch {
      return padrao;
    }
  },
  setJSON(chave, valor) {
    this.set(chave, JSON.stringify(valor));
  },
};
