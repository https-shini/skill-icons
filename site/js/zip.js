/**
 * Escritor de ZIP no cliente, sem dependência.
 *
 * TRADE-OFF (a decisão pedida no briefing, seção 2.2)
 *
 * Optei por manter o empacotador próprio em vez de trazer uma biblioteca. O que
 * pesa a favor:
 *
 *   - O repositório inteiro hoje tem duas devDependencies e nenhuma dependência
 *     de runtime. Uma biblioteca de ZIP seria a primeira, num projeto cujo
 *     bundle já esbarra no teto de 1 MiB do plano gratuito do Cloudflare.
 *   - O payload é conhecido e estreito: arquivos SVG/PNG/WebP, nomes ASCII, sem
 *     diretórios aninhados, sem nada perto de 4 GB. Nenhum Zip64, nenhum UTF-8
 *     em nome, nenhum stream de tamanho desconhecido — que é exatamente onde as
 *     implementações caseiras costumam errar.
 *   - A compressão de verdade vem do `CompressionStream('deflate-raw')` do
 *     próprio navegador, não de código meu. O que escrevi aqui é só o
 *     envelope: cabeçalho local, diretório central e EOCD.
 *
 * O que pesa contra, e é real: se um dia entrarem nomes com acento, arquivos
 * grandes ou pastas, o certo é trocar por uma biblioteca em vez de esticar isto.
 *
 * Referência do formato: APPNOTE.TXT 6.3.x, seções 4.3.7 (cabeçalho local),
 * 4.3.12 (diretório central) e 4.3.16 (EOCD).
 */

const TABELA_CRC = (() => {
  const t = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[i] = c >>> 0;
  }
  return t;
})();

function crc32(bytes) {
  let c = 0xffffffff;
  for (let i = 0; i < bytes.length; i++)
    c = TABELA_CRC[(c ^ bytes[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

/** Data/hora no formato MS-DOS que o ZIP usa (resolução de 2 segundos). */
function dataDos(d = new Date()) {
  const hora =
    (d.getHours() << 11) | (d.getMinutes() << 5) | (d.getSeconds() >> 1);
  const data =
    ((d.getFullYear() - 1980) << 9) | ((d.getMonth() + 1) << 5) | d.getDate();
  return { hora, data };
}

async function deflate(bytes) {
  if (typeof CompressionStream === 'undefined') return null;
  try {
    const cs = new CompressionStream('deflate-raw');
    const fluxo = new Blob([bytes]).stream().pipeThrough(cs);
    const saida = new Uint8Array(await new Response(fluxo).arrayBuffer());
    // Só vale comprimir se encolheu; PNG e WebP já vêm comprimidos e o deflate
    // costuma devolvê-los alguns bytes maiores.
    return saida.length < bytes.length ? saida : null;
  } catch {
    return null;
  }
}

/**
 * @param {{nome: string, dados: Uint8Array}[]} arquivos
 * @returns {Promise<Blob>} o .zip pronto
 */
export async function zip(arquivos) {
  const codificador = new TextEncoder();
  const { hora, data } = dataDos();
  const partes = [];
  const central = [];
  let deslocamento = 0;

  for (const { nome, dados } of arquivos) {
    const nomeBytes = codificador.encode(nome);
    const crc = crc32(dados);
    const comprimido = await deflate(dados);
    const metodo = comprimido ? 8 : 0;
    const corpo = comprimido ?? dados;

    const local = new Uint8Array(30 + nomeBytes.length);
    const vl = new DataView(local.buffer);
    vl.setUint32(0, 0x04034b50, true); // assinatura
    vl.setUint16(4, 20, true); // versão necessária
    vl.setUint16(6, 0, true); // flags
    vl.setUint16(8, metodo, true);
    vl.setUint16(10, hora, true);
    vl.setUint16(12, data, true);
    vl.setUint32(14, crc, true);
    vl.setUint32(18, corpo.length, true);
    vl.setUint32(22, dados.length, true);
    vl.setUint16(26, nomeBytes.length, true);
    vl.setUint16(28, 0, true); // extra
    local.set(nomeBytes, 30);

    partes.push(local, corpo);

    const cd = new Uint8Array(46 + nomeBytes.length);
    const vc = new DataView(cd.buffer);
    vc.setUint32(0, 0x02014b50, true);
    vc.setUint16(4, 20, true); // versão de origem
    vc.setUint16(6, 20, true); // versão necessária
    vc.setUint16(8, 0, true);
    vc.setUint16(10, metodo, true);
    vc.setUint16(12, hora, true);
    vc.setUint16(14, data, true);
    vc.setUint32(16, crc, true);
    vc.setUint32(20, corpo.length, true);
    vc.setUint32(24, dados.length, true);
    vc.setUint16(28, nomeBytes.length, true);
    vc.setUint16(30, 0, true); // extra
    vc.setUint16(32, 0, true); // comentário
    vc.setUint16(34, 0, true); // disco inicial
    vc.setUint16(36, 0, true); // atributos internos
    vc.setUint32(38, 0, true); // atributos externos
    vc.setUint32(42, deslocamento, true);
    cd.set(nomeBytes, 46);
    central.push(cd);

    deslocamento += local.length + corpo.length;
  }

  const tamanhoCentral = central.reduce((s, c) => s + c.length, 0);
  const fim = new Uint8Array(22);
  const vf = new DataView(fim.buffer);
  vf.setUint32(0, 0x06054b50, true);
  vf.setUint16(4, 0, true); // número do disco
  vf.setUint16(6, 0, true); // disco do diretório central
  vf.setUint16(8, arquivos.length, true);
  vf.setUint16(10, arquivos.length, true);
  vf.setUint32(12, tamanhoCentral, true);
  vf.setUint32(16, deslocamento, true);
  vf.setUint16(20, 0, true); // comentário

  return new Blob([...partes, ...central, fim], { type: 'application/zip' });
}
