/** Versão do build: mantém módulos, manifesto e imagens coerentes no navegador. */
export function assetUrl(path) {
  const version =
    typeof document === 'undefined'
      ? null
      : document.querySelector('meta[name="si-version"]')?.content;
  if (!version) return path;
  const [base, fragment] = path.split('#', 2);
  const token = `v=${encodeURIComponent(version)}`;
  const resource = /[?&]v=/.test(base)
    ? base.replace(/([?&])v=[^&]*/, `$1${token}`)
    : `${base}${base.includes('?') ? '&' : '?'}${token}`;
  return resource + (fragment === undefined ? '' : `#${fragment}`);
}
