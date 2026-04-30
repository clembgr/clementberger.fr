// ─── Animations ambiantes SVG ─────────────────────────────────────────────────
export function injectSvgAnimations(svgEl) {
  if (!svgEl) return

  // ── Injection des keyframes en premier ──────────────────────────────────────
  const style = document.createElementNS('http://www.w3.org/2000/svg', 'style')
  style.textContent = `
    @keyframes svgLeaf0 {
      0%   { transform: rotate(0deg); }
      30%  { transform: rotate(4deg); }
      60%  { transform: rotate(-2.5deg); }
      100% { transform: rotate(0deg); }
    }
    @keyframes svgLeaf1 {
      0%   { transform: rotate(0deg); }
      20%  { transform: rotate(-3deg); }
      55%  { transform: rotate(2deg); }
      80%  { transform: rotate(-1.5deg); }
      100% { transform: rotate(0deg); }
    }
    @keyframes svgLeaf2 {
      0%   { transform: rotate(0deg); }
      40%  { transform: rotate(3.5deg); }
      70%  { transform: rotate(0deg); }
      85%  { transform: rotate(-2deg); }
      100% { transform: rotate(0deg); }
    }
    @keyframes svgLeaf3 {
      0%   { transform: rotate(-2deg); }
      35%  { transform: rotate(0deg); }
      65%  { transform: rotate(3deg); }
      100% { transform: rotate(-2deg); }
    }
    @keyframes svgPlante {
      0%   { transform: rotate(0deg); }
      25%  { transform: rotate(2.5deg); }
      75%  { transform: rotate(-2deg); }
      100% { transform: rotate(0deg); }
    }
    @keyframes svgTelephone {
      0%    { transform: translate(0px, 0px) rotate(0deg); }
      70%   { transform: translate(0px, 0px) rotate(0deg); }
      71%   { transform: translate(-3px, 0px) rotate(-2deg); }
      72%   { transform: translate(3px, 0px) rotate(2deg); }
      73%   { transform: translate(-3px, 0px) rotate(-2deg); }
      74%   { transform: translate(3px, 0px) rotate(2deg); }
      75%   { transform: translate(-2px, 0px) rotate(-1deg); }
      76%   { transform: translate(0px, 0px) rotate(0deg); }
      78%   { transform: translate(0px, -18px) rotate(-3deg); }
      81%   { transform: translate(2px, -6px) rotate(1deg); }
      83%   { transform: translate(0px, 0px) rotate(0deg); }
      100%  { transform: translate(0px, 0px) rotate(0deg); }
    }
  `
  svgEl.insertBefore(style, svgEl.firstChild)

  // ── Feuillage ────────────────────────────────────────────────────────────────
  const feuillage = svgEl.querySelector('#feuillage')
  if (feuillage) {
    const leaves = Array.from(feuillage.children)
    const targets = leaves.length > 0 ? leaves : [feuillage]
    targets.forEach((leaf, i) => {
      leaf.style.transformBox = 'fill-box'
      leaf.style.transformOrigin = '50% 100%'
      const duration = 2.5 + (i % 3) * 1
      const delay    = -(i * 1.1)
      leaf.style.animation = `svgLeaf${i % 4} ${duration}s ease-in-out infinite`
      leaf.style.animationDelay = `${delay}s`
    })
  }

  // ── Plante suspendue ─────────────────────────────────────────────────────────
  const plante = svgEl.querySelector('#plante-suspendue')
  if (plante) {
    plante.style.transformBox = 'fill-box'
    plante.style.transformOrigin = '50% 0%'
    plante.style.animation = 'svgPlante 8s ease-in-out infinite'
    plante.style.animationDelay = '-3s'
  }

  // ── Téléphone ────────────────────────────────────────────────────────────────
  const telephone = svgEl.querySelector('#telephone')
  if (telephone) {
    telephone.style.transformBox = 'fill-box'
    telephone.style.transformOrigin = '50% 50%'
    telephone.style.animation = 'svgTelephone 10s ease-in-out infinite'
  }
}
