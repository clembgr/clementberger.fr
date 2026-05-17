import { useEffect, useRef, useState, useCallback } from 'react'
import Head from 'next/head'
import styles from '../styles/Home.module.css' 
import MurDroite from '../components/MurDroite'
import MurGauche from '../components/MurGauche'
import { injectSvgAnimations, pauseSvgAnimations, resumeSvgAnimations } from '../lib/svgAnimations'

// ─── SCÈNES ───────────────────────────────────────────────────────────────────
const SCENE = { ENTREE: 'entree', CHAMBRE: 'chambre', ORDI: 'ordi' }



const LABELS = {
  'telephone':        'Mes contacts',
  'abwheel':          'Musculation',
  'saxophone':        'Jouer de la musique',
  'platine':          'Mixer la musique',
  'piano':            'Créer de la musique',
  'raquette-tennis':  'Le tennis',
  'raquette-pingpong':'Le tennis de table',
  'basket':           'La course à pied',
  'ballon':           'Le football',
  'miroir':           'Ma personnalité',
  'livres':           'Lecture & écriture',
  'classeurs':        'Ma formation',
  'journal':          'Mes valeurs & qualités',
  'tiroir':           'Mes compétences',
  'siege':            'Mes expériences pro',
  'gemini':           "L'ia dans mon projet",
  'fenetre':          "Mes perspectives d'avenir",
  'cadre':            'Mon cv',
  'sous-mon-lit':     "Tu m'as trouvé !",
}

// ─── SVG dimensions ───────────────────────────────────────────────────────────
const DIMS = {
  entree:  { w: 4000, h: 1978 },
  chambre: { w: 9956, h: 2271 },
  ordi:    { w: 4000, h: 2286 },
}

const CHAMBRE_X = 1660
const CHAMBRE_W = 5670 - CHAMBRE_X

const INTERACTIVE_IDS = [
  'tiroir','gemini','fenetre','raquette-pingpong','basket','ballon',
  'ordi','classeurs','journal','platine','saxophone', 'ordi-placeholder','paysage-placeholder',
  'siege','raquette-tennis','abwheel','miroir','cadre','livres','piano','telephone','sous-mon-lit'
]

// ─── Constantes de positionnement ────────────────────────────────────────────
const ORDI_CENTER = { cx: 0.4556, cy: 0.573536 }
const ORDI_VIDEO = { left: 43.69, top: 52.41, width: 3.746, height: 9.928 }
const ORDI_CLIP   = 'polygon(0.0% 0.3%, 96.8% 0.0%, 100.0% 100.0%, 2.4% 99.1%)'
const ORDI_PH     = { left: 30.5924, top: 33.7123, width: 40.3149, height: 43.8566 }
const CV_FRAME    = { left: 48.63, top: 15.6759, width: 3.948, height: 24.4826 }
const PAYSAGE     = { left: 54.529932, top: 12.021136, width: 7.312174, height: 31.704095 }

const PORTE_CENTER = { cx: 0.42, cy: 0.50 }

// ─── Config ───────────────────────────────────────────────────────────────────
const ZOOM                 = 1.05
const DURATION             = 950
const DIVE_DURATION_ENTREE = 2500
const DIVE_DURATION_ORDI   = 2600
const OFFSET_CHAMBRE       = { x: 0, y: 0 }
const EDGE = 0.12, SPEED = 7, LERP = 0.07
const PLANT_CENTER_X       = 7500

// ─── Easing ──────────────────────────────────────────────────────────────────
function ease(t) { return t < 0.5 ? 2*t*t : -1+(4-2*t)*t }

function easeDive(t) {
  return t < 0.7 ? (t / 0.7) * 0.1 : 0.1 + (((t - 0.7) / 0.3) ** 3) * 0.9
}

// ─── Utilitaires de transform ─────────────────────────────────────────────────
function getChambreTransform(vW, vH) {
  const { w, h } = DIMS.chambre
  const scale = Math.max(vW / CHAMBRE_W, vH / h) * ZOOM
  const tx = (vW - CHAMBRE_W * scale) / 2 - CHAMBRE_X * scale + OFFSET_CHAMBRE.x * CHAMBRE_W * scale
  const ty = (vH - h * scale) / 2 + OFFSET_CHAMBRE.y * h * scale
  return { scale, tx, ty }
}

function getPlanTransform(vH) {
  const { h } = DIMS.chambre
  const scale = vH / h
  return { scale, tx: 0, ty: -1 }
}

function getRightPanelTransform(vW, vH) {
  const t = getChambreTransform(vW, vH)
  let tx = vW / 2 - PLANT_CENTER_X * t.scale
  const maxTx = vW - DIMS.chambre.w * t.scale
  if (tx < maxTx) tx = maxTx
  const ty = vH - DIMS.chambre.h * t.scale
  return { scale: t.scale, tx, ty }
}

const ORDI_ZONE = { x: 256, y: 519, w: 3536, h: 1768 }
function getOrdiTransform(vW, vH) {
  const scale = Math.max(vW / ORDI_ZONE.w, vH / ORDI_ZONE.h)
  const tx = vW / 2 - (ORDI_ZONE.x + ORDI_ZONE.w / 2) * scale
  const ty = vH / 2 - (ORDI_ZONE.y + ORDI_ZONE.h / 2) * scale
  return { scale, tx, ty }
}

function getPanBounds(vW, vH, t, isRight = false) {
  const { h } = DIMS.chambre
  const { scale, tx, ty } = t
  return {
    minX: isRight ? tx + 5670 * scale - vW : tx + CHAMBRE_X * scale,
    maxX: isRight ? tx + 9956 * scale - vW : tx + 5670 * scale - vW,
    minY: ty,
    maxY: ty + h * scale - vH,
  }
}

function getCoverTransform(dims, vW, vH) {
  const scale = Math.max(vW / dims.w, vH / dims.h)
  const tx = (vW - dims.w * scale) / 2
  const ty = (vH - dims.h * scale) / 2
  return { scale, tx, ty }
}

const LOADING_TEXTS = [
    "Patientez un instant, je prépare la visite...",
    "Chargement des vidéos, images et autres contenus multimédias...",
    "Optimisation de l'expérience utilisateur...",
    "Quelques secondes de plus pour une expérience plus fluide !",
  ]

function LoadingScreen({ progress, total, currentFile }) {
  const [textIndex, setTextIndex] = useState(0)
  const loaded = Math.round((progress / 100) * total)

  useEffect(() => {
    const id = setInterval(() => {
      setTextIndex(i => (i + 1) % LOADING_TEXTS.length)
    }, 5000)
    return () => clearInterval(id)
  }, [])

  const shortName = currentFile ? currentFile.split('/').pop() : '...'

    return (
      <div style={{
        position: 'fixed', inset: 0,
        background: '#0a0806',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '20px',
      }}>
        <p style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: '3rem',
          fontWeight: 300,
          letterSpacing: '0.1em',
          color: 'rgba(200, 170, 100, 0.6)',
          margin: 0,
        }}>
          Chargement
        </p>

        <div style={{
          width: '360px',
          height: '3px',
          background: 'rgba(200, 170, 100, 0.12)',
          borderRadius: '2px',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute',
            left: 0, top: 0, bottom: 0,
            width: `${progress}%`,
            background: 'rgba(200, 170, 100, 0.75)',
            borderRadius: '2px',
            transition: 'width 0.25s ease',
          }} />
        </div>

        <p style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: '1.5rem',
          fontWeight: 500,
          fontStyle: 'italic',
          letterSpacing: '0.15em',
          color: 'rgba(200, 170, 100, 0.4)',
          margin: 0,
        }}>
          {shortName} — {loaded} / {total} éléments chargés
        </p>

        <p style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: '2rem',
          fontWeight: 400,
          letterSpacing: '0.1em',
          color: 'rgba(200, 170, 100, 0.6)',
          margin: '8px 0 0 0',
          transition: 'opacity 0.5s ease',
          maxWidth: '700px',
          textAlign: 'center',
        }}>
          {LOADING_TEXTS[textIndex]}
        </p>
      </div>
    )
  }

const TOTAL_RESOURCES = 64

// ─── Composant principal ──────────────────────────────────────────────────────
export default function Home() {
  const chambreWrapperRef = useRef(null)
  const entreeWrapperRef  = useRef(null)
  const svgContRef        = useRef(null)
  const rafRef            = useRef(null)
  const animRafRef        = useRef(null)
  const entreeAnimRef     = useRef(null)
  const cursorRef         = useRef(null)
  const ringRef           = useRef(null)

  const vpRef         = useRef({ vW: 0, vH: 0 })
  const cur           = useRef({ scale: 1, tx: 0, ty: 0 })
  const pan           = useRef({ x: 0, y: 0 })
  const panTarget     = useRef({ x: 0, y: 0 })
  const mouse         = useRef({ x: 0, y: 0 })
  const transitioning = useRef(false)
  const zoomed        = useRef(false)
  const rightPanelRef = useRef(false)
  const inputMode     = useRef('mouse')
  const isDragging    = useRef(false)
  const lastTouch     = useRef({ x: 0, y: 0 })
  const draggedFlag   = useRef(false)

  const [scene,           setScene]           = useState(SCENE.ENTREE)
  const [doorOpen,        setDoorOpen]        = useState(false)
  const [entreeVisible,   setEntreeVisible]   = useState(true) 
  const [svgLoaded,       setSvgLoaded]       = useState(false)
  const [showHint,        setShowHint]        = useState(false)
  const [hoveredId,       setHoveredId]       = useState(null)
  const [tooltipPos,      setTooltipPos]      = useState({ x: 0, y: 0 })
  const [vp,              setVp]              = useState({ vW: 0, vH: 0 })
  const [rightPanelOpen,  setRightPanelOpen]  = useState(false)
  const [showMurPanel,    setShowMurPanel]    = useState(false)
  const [activeElementId, setActiveElementId] = useState(null)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [loadingDone, setLoadingDone]         = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const isOverUI = useRef(false)
  const activeElementIdRef = useRef(null)
  const [hideCursorGlobal, setHideCursorGlobal] = useState(false);
  const paysageVideoRef = useRef(null)
  const ordiVideoRef    = useRef(null)
  const [currentFile, setCurrentFile] = useState('')




  const commit = useCallback(() => {
    if (!chambreWrapperRef.current) return
    const { scale, tx, ty } = cur.current
    chambreWrapperRef.current.style.transform =
      `translate(${tx - pan.current.x}px, ${ty - pan.current.y}px) scale(${scale})`
  }, [])

  useEffect(() => {
    const resources = [
      '/videos/paysage.webm',
      '/videos/video.webm',
      '/audios/musique.mp3',
      '/audios/musique1.mp3',
      '/audios/musique2.mp3',
      '/images/carte.svg',
      '/images/chambre.svg',
      '/images/curseur.png',
      '/images/cv-icon.png',
      '/images/cv.png',
      '/images/disque1.jpg',
      '/images/disque2.jpg',
      '/images/email-icon.png',
      '/images/entree-fermee.svg',
      '/images/entree-ouverte.svg',
      '/images/feuille-journal.svg',
      '/images/github-icon.png',
      '/images/linkedin-icon.png',
      '/images/livre-mur.png',
      '/images/logo.png',
      '/images/photo.png',
      '/images/raquette-pingpong-mur.svg',
      '/images/raquette-tennis.svg',
      '/images/telephone-mur.svg',
      '/images/tiroir-ouvert.svg',
      '/images/zoom-ordi.svg',
      '/images/experience/boutique.png',
      '/images/experience/champ.png',
      '/images/experience/cnpe.png',
      '/images/objets/abwheel.png',
      '/images/objets/abwheel.svg',
      '/images/objets/balle-tennis.svg',
      '/images/objets/balle.svg',
      '/images/objets/ballon.png',
      '/images/objets/basket.png',
      '/images/objets/cadre.svg',
      '/images/objets/classeurs.png',
      '/images/objets/course.png',
      '/images/objets/fenetre.png',
      '/images/objets/football.svg',
      '/images/objets/gemini.svg',
      '/images/objets/graffiti.svg',
      '/images/objets/journal.png',
      '/images/objets/livres.png',
      '/images/objets/miroir.png',
      '/images/objets/piano.png',
      '/images/objets/platine.png',
      '/images/objets/pong1.svg',
      '/images/objets/pong2.svg',
      '/images/objets/raquette-pingpong.png',
      '/images/objets/raquette-tennis.png',
      '/images/objets/recul.png',
      '/images/objets/saxophone.png',
      '/images/objets/saxophone.svg',
      '/images/objets/siege.png',
      '/images/objets/telephone.svg',
      '/images/pdf/edf-affiche.pdf',
      '/images/pdf/edf-affiche.png',
      '/images/pdf/edf-app.png',
      '/images/taskbar/aide.svg',
      '/images/taskbar/central.svg',
      '/images/taskbar/central1.svg',
      '/images/taskbar/contact.svg',
      '/images/taskbar/entree.svg',
      '/images/taskbar/entree1.svg'
    ]
    let loaded = 0
    const total = resources.length

    const onLoad = (src) => {
      loaded++
      setCurrentFile(src)
      setLoadingProgress(Math.round((loaded / total) * 100))
      if (loaded === total) {
        setTimeout(() => setLoadingDone(true), 400)
      }
    }

    resources.forEach(src => {
      if (src.endsWith('.webm') || src.endsWith('.mov')) {
        const v = document.createElement('video')
        v.src = src
        v.preload = 'auto'
        v.addEventListener('canplaythrough', () => onLoad(src), { once: true })
        v.addEventListener('error', () => onLoad(src), { once: true })
      } else if (src.endsWith('.pdf')) {
        fetch(src, { method: 'HEAD' }).then(() => onLoad(src)).catch(() => onLoad(src))
      } else if (src.endsWith('.svg') && src.includes('chambre')) {
        fetch(src).then(() => onLoad(src)).catch(() => onLoad(src))
      } else {
        const img = new Image()
        img.src = src
        img.onload = () => onLoad(src)
        img.onerror = () => onLoad(src)
      }
    })
  }, [])


  useEffect(() => {
    const update = () => {
      const val = { vW: window.innerWidth, vH: window.innerHeight }
      vpRef.current = val
      if (rightPanelRef.current) {
        const { vW, vH } = val
        cur.current = getRightPanelTransform(vW, vH)
        pan.current = { x: 0, y: 0 }
        panTarget.current = { x: 0, y: 0 }
        commit()
      }
      setVp(val)
    }
    update()
    window.addEventListener('resize', update)

    const preventZoom = (e) => {
      if (e.ctrlKey || e.metaKey) e.preventDefault()
    }
    window.addEventListener('wheel', preventZoom, { passive: false })

    return () => {
      window.removeEventListener('resize', update)
      window.removeEventListener('wheel', preventZoom)
    }
  }, []) 

  useEffect(() => {
    if (!vp.vW || !entreeWrapperRef.current || !entreeVisible) return
    const { scale, tx, ty } = getCoverTransform(DIMS.entree, vp.vW, vp.vH)
    entreeWrapperRef.current.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`
  }, [vp, entreeVisible, loadingDone])

  useEffect(() => {
    if (!vp.vW || rightPanelRef.current) return
    let t
    if (scene === SCENE.ORDI) {
        t = getOrdiTransform(vp.vW, vp.vH)
    } else {
        t = getChambreTransform(vp.vW, vp.vH) 
    }
    cur.current = { ...t }
    pan.current = { x: 0, y: 0 }
    panTarget.current = { x: 0, y: 0 }
    commit()
  }, [vp, scene, svgLoaded])

  useEffect(() => {
    let isMounted = true;
    
    fetch('/images/chambre.svg')
      .then(r => r.text())
      .then(text => {
        if (!isMounted) return;
        
        const parser = new DOMParser()
        const doc = parser.parseFromString(text, 'image/svg+xml')
        const svgEl = doc.documentElement
        
        if (svgEl && svgEl.tagName.toLowerCase() === 'svg') {
          const ordiPh = svgEl.querySelector('#ordi-placeholder')
          if (ordiPh) ordiPh.style.opacity = '0'
          
          svgEl.setAttribute('viewBox', `0 0 ${DIMS.chambre.w} ${DIMS.chambre.h}`)
          svgEl.removeAttribute('width')
          svgEl.removeAttribute('height')
          svgEl.style.width   = DIMS.chambre.w + 'px'
          svgEl.style.height  = DIMS.chambre.h + 'px'
          svgEl.style.display = 'block'
          
          svgEl.querySelectorAll('[id*="placeholder"], [id*="ordi-ph"]')
            .forEach(el => {
              if (el.id === 'ordi-placeholder' || el.id === 'paysage-placeholder') {
                el.style.opacity = '0'
                el.style.display = 'block' 
              } else {
                el.style.display = 'none'
              }
            })
            
          injectSvgAnimations(svgEl)
          
          const attachSvg = () => {
            if (svgContRef.current) {
              svgContRef.current.innerHTML = ''
              svgContRef.current.appendChild(svgEl)
              setSvgLoaded(true)
            } else {
              requestAnimationFrame(attachSvg)
            }
          }
          attachSvg()
        }
      })
      .catch(console.error)

    return () => { isMounted = false }
  }, [])

  useEffect(() => {
    const onPointerMove = (e) => {
      if (e.pointerType === 'mouse') {
        inputMode.current = 'mouse'
        mouse.current = { x: e.clientX, y: e.clientY }
        const isRight = e.clientX > window.innerWidth - 150
        setTooltipPos({ x: e.clientX, y: e.clientY, isRight })
        
        if (cursorRef.current) {
          cursorRef.current.style.left = e.clientX + 'px'
          cursorRef.current.style.top  = e.clientY + 'px'
        }
        if (ringRef.current) {
          ringRef.current.style.left = e.clientX + 'px'
          ringRef.current.style.top  = e.clientY + 'px'
        }
      } else {
        inputMode.current = 'touch'
        setHoveredId(null)
      }
    }

    
    const onMouseDown = () => {
      if (inputMode.current === 'mouse') {
        if (cursorRef.current) cursorRef.current.classList.add(styles.cursorClick || 'cursorClick')
        if (ringRef.current) ringRef.current.classList.add(styles.ringClick || 'ringClick')
      }
    }

    const onMouseUp = () => {
      if (cursorRef.current) cursorRef.current.classList.remove(styles.cursorClick || 'cursorClick')
      if (ringRef.current) ringRef.current.classList.remove(styles.ringClick || 'ringClick')
    }

    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mouseup', onMouseUp)
    
    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [])

  useEffect(() => {
    const tick = () => {
    if (scene === SCENE.CHAMBRE) {
      if (
        inputMode.current === 'mouse' &&
        !transitioning.current &&
        !zoomed.current &&
        !rightPanelRef.current &&
        !isOverUI.current
      ) {
        const { vW, vH } = vpRef.current
        if (!vW) { rafRef.current = requestAnimationFrame(tick); return }
        const nx = mouse.current.x / vW
        const ny = mouse.current.y / vH
        const b = getPanBounds(vW, vH, cur.current, rightPanelRef.current)
        let dx = 0, dy = 0
        if      (nx < EDGE)   dx = -SPEED * (1 - nx / EDGE)
        else if (nx > 1-EDGE) dx =  SPEED * ((nx - (1-EDGE)) / EDGE)
        if      (ny < EDGE)   dy = -SPEED * (1 - ny / EDGE)
        else if (ny > 1-EDGE) dy =  SPEED * ((ny - (1-EDGE)) / EDGE)
        panTarget.current.x = Math.max(b.minX, Math.min(b.maxX, panTarget.current.x + dx))
        panTarget.current.y = Math.max(b.minY, Math.min(b.maxY, panTarget.current.y + dy))
      }
      pan.current.x += (panTarget.current.x - pan.current.x) * LERP
      pan.current.y += (panTarget.current.y - pan.current.y) * LERP
      commit()
    }
    rafRef.current = requestAnimationFrame(tick)
  }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [scene])

  useEffect(() => {
    const svgEl = svgContRef.current?.querySelector('svg')
    const paysage = paysageVideoRef.current
    const ordi    = ordiVideoRef.current

    if (scene === SCENE.ORDI) {
      pauseSvgAnimations(svgEl, ['plante-suspendue', 'feuillage', 'telephone'])
      if (paysage) paysage.pause()
      if (ordi)    ordi.pause()
    } else if (rightPanelOpen) {
      pauseSvgAnimations(svgEl, ['plante-suspendue', 'feuillage', 'telephone'])
      if (paysage) paysage.play()
      if (ordi)    ordi.pause()
    } else if (activeElementId) {
      pauseSvgAnimations(svgEl, ['plante-suspendue'])
      if (paysage) paysage.pause()
      if (ordi)    ordi.play()
      resumeSvgAnimations(svgEl, ['feuillage', 'telephone'])
    } else {
      resumeSvgAnimations(svgEl, ['plante-suspendue', 'feuillage', 'telephone'])
      if (paysage) paysage.play()
      if (ordi)    ordi.play()
    }
  }, [activeElementId, rightPanelOpen])

  const handleTouchStart = useCallback((e) => {
    inputMode.current = 'touch'
    if (scene !== SCENE.CHAMBRE || transitioning.current || zoomed.current || rightPanelRef.current) return
    isDragging.current  = true
    draggedFlag.current = false
    lastTouch.current   = { x: e.touches[0].clientX, y: e.touches[0].clientY }
  }, [scene])

  const handleTouchMove = useCallback((e) => {
    if (!isDragging.current) return
    const touch = e.touches[0]
    const dx = touch.clientX - lastTouch.current.x
    const dy = touch.clientY - lastTouch.current.y
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) draggedFlag.current = true
    lastTouch.current = { x: touch.clientX, y: touch.clientY }
    const { vW, vH } = vpRef.current
    const b = getPanBounds(vW, vH, cur.current, rightPanelRef.current)
    panTarget.current.x = Math.max(b.minX, Math.min(b.maxX, panTarget.current.x - dx))
    panTarget.current.y = Math.max(b.minY, Math.min(b.maxY, panTarget.current.y - dy))
    pan.current.x = panTarget.current.x
    pan.current.y = panTarget.current.y
    commit()
  }, [])

  const handleTouchEnd = useCallback(() => { isDragging.current = false }, [])

  const animateTo = useCallback((to, onDone) => {
    if (animRafRef.current) cancelAnimationFrame(animRafRef.current)
    const t0   = performance.now()
    const from = { ...cur.current }
    const fpx  = pan.current.x, fpy = pan.current.y
    const frame = (now) => {
      const t = Math.min((now - t0) / DURATION, 1)
      const e = ease(t)
      cur.current.scale = from.scale + (to.scale - from.scale) * e
      cur.current.tx    = from.tx    + (to.tx    - from.tx)    * e
      cur.current.ty    = from.ty    + (to.ty    - from.ty)    * e
      pan.current.x = fpx * (1-e); pan.current.y = fpy * (1-e)
      panTarget.current = { ...pan.current }
      if (t < 1) {
        animRafRef.current = requestAnimationFrame(frame)
      } else {
        cur.current = { ...to }
        pan.current = { x: 0, y: 0 }
        panTarget.current = { x: 0, y: 0 }
        onDone?.()
      }
    }
    animRafRef.current = requestAnimationFrame(frame)
  }, [])

  const animateDive = useCallback((to, onDone, duration = 2000) => {
    if (animRafRef.current) cancelAnimationFrame(animRafRef.current)
    const t0   = performance.now()
    const from = { ...cur.current }
    const fpx  = pan.current.x, fpy = pan.current.y

    const frame = (now) => {
      const t = Math.min((now - t0) / duration, 1)
      const e = easeDive(t)
      cur.current.scale = from.scale + (to.scale - from.scale) * e
      cur.current.tx    = from.tx    + (to.tx    - from.tx)    * e
      cur.current.ty    = from.ty    + (to.ty    - from.ty)    * e
      pan.current.x = fpx * (1-e); pan.current.y = fpy * (1-e)
      panTarget.current = { ...pan.current }

      if (t < 1) {
        animRafRef.current = requestAnimationFrame(frame)
      } else {
        cur.current = { ...to }
        pan.current = { x: 0, y: 0 }
        panTarget.current = { x: 0, y: 0 }
        onDone?.()
      }
    }
    animRafRef.current = requestAnimationFrame(frame)
  }, [])

  const handlePorteClick = useCallback(() => {
    if (transitioning.current || draggedFlag.current || doorOpen) return
    setDoorOpen(true)
  }, [doorOpen])

  const animateDiveEntree = useCallback((targetEntree, targetChambre, duration, onDone) => {
    if (entreeAnimRef.current) cancelAnimationFrame(entreeAnimRef.current)
    const t0 = performance.now()
    
    const { vW, vH } = vpRef.current
    const fromEntree = getCoverTransform(DIMS.entree, vW, vH)
    const fromChambre = { ...cur.current }

    const frame = (now) => {
      const t = Math.min((now - t0) / duration, 1)
      const e = easeDive(t)

      if (entreeWrapperRef.current) {
        const s = fromEntree.scale + (targetEntree.scale - fromEntree.scale) * e
        const x = fromEntree.tx    + (targetEntree.tx    - fromEntree.tx)    * e
        const y = fromEntree.ty    + (targetEntree.ty    - fromEntree.ty)    * e
        entreeWrapperRef.current.style.transform = `translate(${x}px, ${y}px) scale(${s})`
        
        const opacity = t > 0.85 ? Math.max(0, 1 - (t - 0.85) / 0.15) : 1
        entreeWrapperRef.current.style.opacity = opacity
      }

      cur.current.scale = fromChambre.scale + (targetChambre.scale - fromChambre.scale) * e
      cur.current.tx    = fromChambre.tx    + (targetChambre.tx    - fromChambre.tx)    * e
      cur.current.ty    = fromChambre.ty    + (targetChambre.ty    - fromChambre.ty)    * e
      
      commit()

      if (t < 1) {
        entreeAnimRef.current = requestAnimationFrame(frame)
      } else {
        if (entreeWrapperRef.current) entreeWrapperRef.current.style.display = 'none' 
        onDone?.()
      }
    }
    entreeAnimRef.current = requestAnimationFrame(frame)
  }, [])

  const handleEnterClick = useCallback(() => {
    if (transitioning.current || draggedFlag.current || !doorOpen) return
    transitioning.current = true
    const { vW, vH } = vpRef.current
    if (!vW) { transitioning.current = false; return }

    const dimsEntree = DIMS.entree
    const targetScaleEntree = getCoverTransform(dimsEntree, vW, vH).scale * 25
    const targetTxEntree = vW / 2 - PORTE_CENTER.cx * dimsEntree.w * targetScaleEntree
    const targetTyEntree = vH / 2 - PORTE_CENTER.cy * dimsEntree.h * targetScaleEntree
    const targetEntreeT = { scale: targetScaleEntree, tx: targetTxEntree, ty: targetTyEntree }

    const targetChambreT = getChambreTransform(vW, vH)

    animateDiveEntree(targetEntreeT, targetChambreT, DIVE_DURATION_ENTREE, () => {
      setScene(SCENE.CHAMBRE)
      setEntreeVisible(false)
      transitioning.current = false
      
      
      
      setTimeout(() => {
        if (!zoomed.current && !rightPanelRef.current) {
          setShowHelp(true)
        }
      }, 750)
    })
  }, [doorOpen, animateDiveEntree])

  const handleGoRight = useCallback(() => {
    if (transitioning.current || !vpRef.current.vW) return
    transitioning.current = true
    const { vW, vH } = vpRef.current
    animateTo(getRightPanelTransform(vW, vH), () => {
      transitioning.current = false
      setRightPanelOpen(true)
      rightPanelRef.current = true
      setShowMurPanel(true)
    })
  }, [animateTo])

  const handleGoLeft = useCallback(() => {
    if (transitioning.current || !vpRef.current.vW) return
    transitioning.current  = true
    rightPanelRef.current  = false
    setRightPanelOpen(false)
    setShowMurPanel(false)
    const { vW, vH } = vpRef.current
    animateTo(getChambreTransform(vW, vH), () => { transitioning.current = false })
  }, [animateTo])

  const handleChambreElementClick = useCallback((e, id) => {
    e.stopPropagation()
    if (draggedFlag.current || transitioning.current || !vpRef.current.vW) return
    if (zoomed.current && activeElementIdRef.current === id) return

      if (zoomed.current) {
        transitioning.current = true
        zoomed.current = false
        setShowHint(true)
        
        const { vW, vH } = vpRef.current
        animateTo(getChambreTransform(vW, vH), () => {
          setActiveElementId(id)
          activeElementIdRef.current = id
          transitioning.current = true
          zoomed.current = true
          animateTo(getPlanTransform(vpRef.current.vH), () => {
            transitioning.current = false
          })
        })
      } else {
      transitioning.current = true
      zoomed.current = true
      setShowHint(true)
      setActiveElementId(id)
      activeElementIdRef.current = id
      animateTo(getPlanTransform(vpRef.current.vH), () => {
        transitioning.current = false
      })
    }
  }, [animateTo])

  const handleOrdiClick = useCallback((e) => {
    e.stopPropagation()
    if (draggedFlag.current || transitioning.current || !vpRef.current.vW) return

    setHoveredId(null)
    if (cursorRef.current) cursorRef.current.classList.remove(styles.cursorHide || 'cursorHide')
    if (ringRef.current)   ringRef.current.classList.remove(styles.ringBig || 'ringBig')

    const doOrdi = () => {
      const { vW, vH } = vpRef.current
      const overlay = document.createElement('div')
      Object.assign(overlay.style, {
        position: 'fixed', inset: '0',
        background: '#0a0806',
        zIndex: '9997',
        opacity: '0',
        pointerEvents: 'none',
        transition: 'opacity 0.3s ease',
      })
      document.body.appendChild(overlay)
      requestAnimationFrame(() => { overlay.style.opacity = '1' })
      setTimeout(() => {
        const targetOrdi = getOrdiTransform(vW, vH)
        cur.current = { ...targetOrdi }
        pan.current = { x: 0, y: 0 }
        panTarget.current = { x: 0, y: 0 }
        commit()
        setScene(SCENE.ORDI)
        setTimeout(() => {
          overlay.style.opacity = '0'
          overlay.addEventListener('transitionend', () => {
            overlay.remove()
            transitioning.current = false
          }, { once: true })
        }, 50)
      }, 300)
    }

    if (zoomed.current) {
      transitioning.current = true
      zoomed.current = false
      setShowHint(false)
      setActiveElementId(null)
      activeElementIdRef.current = null
      const { vW, vH } = vpRef.current
      animateTo(getChambreTransform(vW, vH), () => {
        transitioning.current = true
        doOrdi()
      })
      return
    }

    transitioning.current = true
    doOrdi()
  }, [commit, animateTo])

  const handleOrdiBack = useCallback(() => {
    if (transitioning.current) return
    transitioning.current = true

    const { vW, vH } = vpRef.current
    const overlay = document.createElement('div')
    Object.assign(overlay.style, {
      position: 'fixed', inset: '0',
      background: '#0a0806',
      zIndex: '9997',
      opacity: '0',
      pointerEvents: 'none',
      transition: 'opacity 0.3s ease',
    })
    document.body.appendChild(overlay)

    requestAnimationFrame(() => {
      overlay.style.opacity = '1'
    })

    setTimeout(() => {
      const chambreT = getChambreTransform(vW, vH)
      cur.current = { ...chambreT }
      pan.current = { x: 0, y: 0 }
      panTarget.current = { x: 0, y: 0 }
      commit()
      setScene(SCENE.CHAMBRE)

      setTimeout(() => {
        overlay.style.transition = 'opacity 0.3s ease'
        overlay.style.opacity = '0'
        overlay.addEventListener('transitionend', () => {
          overlay.remove()
          transitioning.current = false
          if (cursorRef.current) {
            cursorRef.current.style.opacity = '1'
            cursorRef.current.style.transition = ''
            cursorRef.current.classList.remove(styles.cursorHide)
          }
          if (ringRef.current) {
            ringRef.current.style.opacity = '1'
            ringRef.current.style.transition = ''
            ringRef.current.classList.remove(styles.ringBig)
          }
        }, { once: true })
      }, 80)
    }, 500)
  }, [commit])

  const handleViewportClick = useCallback(() => {
    if (draggedFlag.current || transitioning.current || !zoomed.current || !vpRef.current.vW) return
    if (rightPanelRef.current) return 
    transitioning.current = true
    zoomed.current = false
    setShowHint(false)
    setActiveElementId(null)
    activeElementIdRef.current = null
    const { vW, vH } = vpRef.current
    animateTo(getChambreTransform(vW, vH), () => { transitioning.current = false })
  }, [animateTo])

  useEffect(() => {
      if (!svgLoaded || !svgContRef.current) return
      const handlers = []
      
      INTERACTIVE_IDS.forEach(id => {
        const el = svgContRef.current.querySelector(`#${id}`)
        if (!el) return

        el.style.cursor        = (scene === SCENE.ENTREE) ? 'default' : 'none'
        el.style.pointerEvents = (scene === SCENE.ENTREE) ? 'none' : 'all'
        
        
        const isOrdiGroup    = id === 'ordi' || id === 'ordi-placeholder'
        const isFenetreGroup = id === 'fenetre' || id === 'paysage-placeholder'
        
        const onEnter = () => {
          if (inputMode.current === 'touch' || scene === SCENE.ENTREE) return
          
          if (isOrdiGroup) {
            setHoveredId("Mes projets informatiques")
          } else if (isFenetreGroup) {
            setHoveredId(LABELS['fenetre'])
          } else {
            setHoveredId(LABELS[id] || id)
          }
          
          el.classList.add(styles.svgGroupHover || 'svgGroupHover')
          cursorRef.current?.classList.add(styles.cursorHide || 'cursorHide')
          ringRef.current?.classList.add(styles.ringBig || 'ringBig')
        }
        
        const onLeave = () => {
          setHoveredId(null)
          el.classList.remove(styles.svgGroupHover || 'svgGroupHover')
          cursorRef.current?.classList.remove(styles.cursorHide || 'cursorHide')
          ringRef.current?.classList.remove(styles.ringBig || 'ringBig')
        }
        
        const onClick = (e) => {
          if (draggedFlag.current) return
          
          if (isOrdiGroup) {
            handleOrdiClick(e)
          } else if (isFenetreGroup) {
            handleChambreElementClick(e, 'fenetre')
          } else if (id === 'cadre') {
            window.open('https://cv.clementberger.fr', '_blank', 'noopener,noreferrer')
          } else {
            handleChambreElementClick(e, id)
          }
        }
            
        el.addEventListener('mouseenter', onEnter)
        el.addEventListener('mouseleave', onLeave)
        el.addEventListener('click', onClick)
        handlers.push({ el, onEnter, onLeave, onClick })
      })
      
      return () => handlers.forEach(({ el, onEnter, onLeave, onClick }) => {
        el.removeEventListener('mouseenter', onEnter)
        el.removeEventListener('mouseleave', onLeave)
        el.removeEventListener('click', onClick)
      })
    }, [svgLoaded, scene, handleChambreElementClick, handleOrdiClick])

  if (!vp.vW) return null

  if (!loadingDone) {
    return <LoadingScreen progress={loadingProgress} total={TOTAL_RESOURCES} currentFile={currentFile} />
  }

  const isUnsupported = vp.vW < 900 || vp.vH >= vp.vW
  const isChambre     = scene === SCENE.CHAMBRE
  const isOrdi        = scene === SCENE.ORDI
  const isEntree      = scene === SCENE.ENTREE


  return (
    <>
      <Head>
        <title>Portfolio — Clément Berger</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="icon" type="image/png" href="/images/logo.png" />
      </Head>

      <div ref={cursorRef} className={styles.cursor} />
      <div ref={ringRef}   className={styles.ring}   />

      {isUnsupported && (
        <div className={styles.unsupportedScreen}>
          <p>Désolé, mon portfolio n'est pas optimisé pour les téléphones ou les écrans verticaux.<br /><strong>Veuillez utiliser un ordinateur ou tourner votre tablette en mode paysage.</strong></p>
          <p>Vous pouvez consulter mon cv sur <a href="https://cv.clementberger.fr" target="_blank" rel="noopener noreferrer">cv.clementberger.fr</a></p>
        </div>
      )}

      <div style={{ visibility: isUnsupported ? 'hidden' : 'visible' }}>

        {hoveredId && (
          <div className={styles.tooltip} style={{ 
            left: tooltipPos.isRight ? tooltipPos.x - 15 : tooltipPos.x + 32, 
            top: tooltipPos.y - 10,
            transform: tooltipPos.isRight ? 'translateX(-100%)' : 'none'
          }}>
            {hoveredId}
          </div>
        )}

        <div
          className={styles.viewport}
          style={{ 
            touchAction: 'none',
            background: 'transparent' 
          }}
          onClick={isChambre ? handleViewportClick : undefined}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >

          <div
            ref={chambreWrapperRef}
            className={styles.wrapper}
            style={{
              width:  isOrdi ? DIMS.ordi.w : DIMS.chambre.w,
              height: isOrdi ? DIMS.ordi.h : DIMS.chambre.h,
              pointerEvents: isEntree ? 'none' : 'all', 
              zIndex: 1,
            }}
          >
            <div style={{ position: 'absolute', inset: 0, display: isOrdi ? 'none' : 'block' }}>
              <div ref={svgContRef} className={styles.svgInline} />
            </div>
            
            {isChambre && (
              <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                <MurGauche activeElementId={activeElementId}/>
                <a href="https://cv.clementberger.fr" target="_blank" rel="noopener noreferrer"
                  className={styles.cvFrame}
                  style={{ left: `${CV_FRAME.left}%`, top: `${CV_FRAME.top}%`, width: `${CV_FRAME.width}%`, height: `${CV_FRAME.height}%`, pointerEvents: 'none' }}
                  onClick={e => { draggedFlag.current ? (e.preventDefault(), e.stopPropagation()) : e.stopPropagation() }}
                  onMouseEnter={() => { if (inputMode.current === 'mouse') setHoveredId('voir le cv') }}
                  onMouseLeave={() => setHoveredId(null)}>
                  <img src="/images/cv.png" alt="CV Clément Berger" className={styles.cvImg} draggable={false} />
                </a>
                <div className={styles.paysageFrame} style={{ left: `${PAYSAGE.left}%`, top: `${PAYSAGE.top}%`, width: `${PAYSAGE.width}%`, height: `${PAYSAGE.height}%`, overflow: 'hidden' }}>
                  <video ref={paysageVideoRef} src="/videos/paysage.webm" autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                </div>
                <div
                  className={styles.paysageFrame}
                  style={{
                    left: `${ORDI_VIDEO.left}%`, top: `${ORDI_VIDEO.top}%`,
                    width: `${ORDI_VIDEO.width}%`, height: `${ORDI_VIDEO.height}%`,
                    clipPath: ORDI_CLIP,
                    pointerEvents: 'none',
                    cursor: 'none',
                  }}
                  onClick={handleOrdiClick}
                  onMouseEnter={() => {
                    if (inputMode.current === 'mouse') {
                      setHoveredId("Mes projets informatiques")
                      cursorRef.current?.classList.add(styles.cursorHide)
                      ringRef.current?.classList.add(styles.ringBig)
                    }
                  }}
                  onMouseLeave={() => {
                    setHoveredId(null)
                    cursorRef.current?.classList.remove(styles.cursorHide)
                    ringRef.current?.classList.remove(styles.ringBig)
                  }}
                >
                  <video
                    ref={ordiVideoRef}
                    src="/videos/video.webm"
                    autoPlay loop muted playsInline
                    className={styles.ordiVideo3D}
                    style={{ pointerEvents: 'none' }}
                  />
                </div>
              </div>
            )}

            {isOrdi && (
              <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                <img src="/images/zoom-ordi.svg" alt="ordi" className={styles.svgImg} draggable={false} />
                
                <div 
                  style={{ 
                    position: 'absolute', 
                    left: `${ORDI_PH.left}%`, top: `${ORDI_PH.top}%`, 
                    width: `${ORDI_PH.width}%`, height: `${ORDI_PH.height}%`, 
                    transform: 'scale(1.01)',
                    pointerEvents: 'auto' 
                  }}
                  onMouseEnter={() => {
                    if (cursorRef.current) { cursorRef.current.style.opacity = '0'; cursorRef.current.style.transition = 'none'; }
                    if (ringRef.current)   { ringRef.current.style.opacity   = '0'; ringRef.current.style.transition = 'none'; }
                  }}
                  onMouseLeave={() => {
                    if (cursorRef.current) { cursorRef.current.style.opacity = '1'; cursorRef.current.style.transition = ''; }
                    if (ringRef.current)   { ringRef.current.style.opacity   = '1'; ringRef.current.style.transition = ''; }
                  }}
                >
                  <iframe 
                    src="https://projets.clementberger.fr/?mode=grand" 
                    title="Ordinateur" 
                    className={styles.ordiIframe}
                    style={{ width: '100%', height: '100%', pointerEvents: 'auto' }} 
                  />
                </div>
              </div>
            )}
          </div>

          {entreeVisible && (
            <div
              ref={entreeWrapperRef}
              style={{
                position: 'absolute',
                top: 0, left: 0,
                width:  DIMS.entree.w,
                height: DIMS.entree.h,
                transformOrigin: 'top left',
                willChange: 'transform, opacity',
                pointerEvents: isEntree ? 'all' : 'none',
                zIndex: 10,
                overflow: 'hidden',
              }}
              onClick={!doorOpen ? handlePorteClick : handleEnterClick}
            >
              {/* SVGs porte */}
              <img src="/images/entree-fermee.svg" alt="entrée" className={styles.svgImg} draggable={false}
                style={{ position: 'absolute', inset: 0, transition: 'opacity 0.6s ease', opacity: doorOpen ? 0 : 1 }} />
              <img src="/images/entree-ouverte.svg" alt="entrée ouverte" className={styles.svgImg} draggable={false}
                style={{ position: 'absolute', inset: 0, transition: 'opacity 0.6s ease', opacity: doorOpen ? 1 : 0 }} />

              {/* ── Contenu mur droit ── */}
              <div style={{
                position: 'absolute',
                left: '57%',
                top: '0',
                width: '40%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                gap: '2.5%',
                padding: '3% 5% 5% 5%',
                pointerEvents: 'none',
                boxSizing: 'border-box',
                containerType: 'inline-size',
              }}>

              {/* Photo + nom */}
              <div style={{ position: 'relative', width: '100%', flexShrink: 0, display: 'flex', justifyContent: 'flex-end' }}>

                {/* Photo */}
                <img
                  src="/images/photo.png"
                  style={{
                    position: 'absolute',
                    left: '-4.8%',
                    bottom: 0,
                    width: '55%',
                    objectFit: 'contain',
                    display: 'block',
                    marginBottom: '-3%',
                    imageRendering: 'high-quality',
                    pointerEvents: 'none',
                  }}
                  draggable={false}
                />

                {/* Conteneur des textes */}
                <div style={{ width: '50%', paddingBottom: '5%', zIndex: 1 }}>
                  
                  {/* Nom */}
                  <h1 style={{
                    fontFamily: 'Cormorant Garamond, serif',
                    fontSize: '14cqw',
                    fontWeight: 700,
                    color: 'rgba(80, 50, 20, 0.95)',
                    margin: '0 0 3% 0',
                    lineHeight: 1.0,
                    letterSpacing: '0.02em',
                  }}>
                    Clément<br />BERGER
                  </h1>

                  {/* Premier Séparateur */}
                  <div style={{ width: '100%', height: '2px', background: 'rgba(80,50,20,0.2)', margin: '2% 0' }} />

                  {/* Bienvenue */}
                  <p style={{
                    fontFamily: 'Cormorant Garamond, serif',
                    fontSize: '5cqw',
                    fontStyle: 'italic',
                    fontWeight: 600,
                    color: '#1b3b22',
                    margin: 0,
                    marginTop: '4%',
                    lineHeight: 1.4,
                  }}>
                    Bienvenue dans<br />ma chambre interactive !
                  </p>

                </div>
              </div>

              {/* Deuxième Séparateur */}
              <div style={{ width: '100%', height: '2px', background: 'rgba(80,50,20,0.2)', flexShrink: 0, marginTop: '2%' }} />

                {/* Texte de présentation */}
                <p style={{
                  fontFamily: 'Cormorant Garamond, serif',
                  fontSize: '4.5cqw',
                  width: '120%',
                  fontWeight: 900,
                  color: 'rgba(80, 50, 20, 0.6)',
                  margin: 0,
                  lineHeight: 1.7,
                  letterSpacing: '0.02em',
                  flexShrink: 0,
                }}>
                  Étudiant en BUT Informatique, ouvert aux opportunités d'alternance en informatique pour mon bac+4. Ce portfolio est
                  une chambre : explorez-la en cliquant sur les différents éléments pour en savoir plus sur moi !
                </p>

                {/* Séparateur */}
                <div style={{ width: '100%', height: '2px', background: 'rgba(80,50,20,0.2)', flexShrink: 0 }} />

                {/* Instructions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3%', flexShrink: 0 }}>
                  <p style={{
                    fontFamily: 'Cormorant Garamond, serif',
                    fontSize: '5.5cqw',
                    fontWeight: 'bold',
                    letterSpacing: '0.25em',
                    color: '#1b3b22',
                    marginBottom: '1.8%',
                  }}>
                    Comment faire ?
                  </p>

                  {[
                    { num: '①', text: 'Cliquez pour ouvrir la porte',                  actif: !doorOpen },
                    { num: '②', text: 'Cliquez à nouveau pour entrer dans la chambre', actif: doorOpen  },
                    { num: '③', text: 'Cliquer ensuite sur les éléments !', actif: doorOpen },
                  ].map(({ num, text, actif }) => (
                    <div key={num} style={{ display: 'flex', alignItems: 'flex-start', gap: '3%' }}>
                      <span style={{
                        fontFamily: 'Cormorant Garamond, serif',
                        fontSize: '4cqw',
                        fontWeight: 700,
                        color: actif ? '#1b3b22' : 'rgba(80,50,20,0.2)',
                        transition: 'color 0.6s ease',
                        lineHeight: 1.5,
                        flexShrink: 0,
                      }}>{num}</span>
                      <p style={{
                        fontFamily: 'Cormorant Garamond, serif',
                        fontSize: '4cqw',
                        fontWeight: 600,
                        color: actif ? 'rgba(80,50,20,0.85)' : 'rgba(80,50,20,0.2)',
                        transition: 'color 0.6s ease',
                        margin: 0,
                        lineHeight: 1.5,
                        letterSpacing: '0.02em',
                      }}>{text}</p>
                    </div>
                  ))}
                </div>

                {/* Lien CV */}
                <a
                  href="https://cv.clementberger.fr"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={e => e.stopPropagation()}
                  style={{
                    pointerEvents: 'all',
                    fontFamily: 'Cormorant Garamond, serif',
                    fontSize: '5cqw',
                    fontWeight: 700,
                    letterSpacing: '0.2em',
                    marginTop: '3%',
                    color: '#1b3b22',
                    textDecoration: 'none',
                    borderBottom: '1px solid rgba(27,59,34,0.4)',
                    paddingBottom: '1px',
                    alignSelf: 'flex-start',
                  }}
                >
                  Voir mon cv
                </a>

                {/* Bouton fermer la porte */}
                {doorOpen && (
                  <button
                    onClick={e => { e.stopPropagation(); setDoorOpen(false) }}
                    style={{
                      pointerEvents: 'all',
                      fontFamily: 'Cormorant Garamond, serif',
                      fontSize: '5cqw',
                      fontWeight: 300,
                      letterSpacing: '0.25em',
                      color: 'rgba(80, 50, 20, 0.55)',
                      background: 'transparent',
                      border: 'none',
                      padding: 0,
                      cursor: 'none',
                      alignSelf: 'flex-start',
                      transition: 'color 0.3s ease',
                    }}
                  >
                    Fermer la porte
                  </button>
                )}

              </div>
            </div>
          )}

          {showMurPanel && isChambre && <MurDroite onClose={handleGoLeft} onIframeHover={(inside) => {
            if (cursorRef.current) {
              cursorRef.current.style.opacity = inside ? '0' : '1';
              cursorRef.current.style.transition = inside ? 'none' : '';
            }
            if (ringRef.current) {
              ringRef.current.style.opacity = inside ? '0' : '1';
              ringRef.current.style.transition = inside ? 'none' : '';
            }
          }}/>}

          {isChambre && (
          <>

          {!rightPanelOpen && !activeElementId && (
            <div style={{
              position: 'fixed',
              top: '1.8rem',
              left: '1.8rem',
              zIndex: 200,
              pointerEvents: 'none',
            }}>
              <p style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: '2rem',
                fontWeight: 700,
                letterSpacing: '0.18em',
                color: 'rgba(255, 225, 194, 0.7)',
                margin: '0 0 4px 0',
                textTransform: 'uppercase',
                lineHeight: 1,
              }}>
               Clément <span style={{ fontWeight: 900 }}>BERGER</span>
              </p>
              <p style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: '1rem',
                fontWeight: 700,
                letterSpacing: '0.22em',
                color: 'rgba(255, 225, 194, 0.7)',
                margin: 0,
                textTransform: 'lowercase',
                lineHeight: 1,
              }}>
                votre futur développeur informatique bac+4
              </p>
            </div>
          )}
            {/* ── Taskbar ── */}
            <div className={styles.taskbar}
                onMouseLeave={() => setHoveredId(null)}
              >
              {/* Bouton ? */}
              <button
                className={styles.taskbarBtn}
                onClick={() => { setShowHelp(true)}}
                onMouseEnter={() => { if (inputMode.current === 'mouse') setHoveredId('aide') }}
                onMouseLeave={() => setHoveredId(null)}
                title="aide"
              >
                <img src="/images/taskbar/aide.svg" width="20" height="20" style={{ opacity: 0.8 }} />
              </button>

              <div className={styles.taskbarDivider} />

              {/* Bouton porte (retour entrée) */}
              <button
                className={styles.taskbarBtn}
                onClick={() => window.location.reload()}
                onMouseEnter={() => { if (inputMode.current === 'mouse') setHoveredId('entrée') }}
                onMouseLeave={() => setHoveredId(null)}
                title="retour à l'entrée"
              >
                <img src="/images/taskbar/entree.svg" width="16" height="20" style={{ opacity: 0.8 }} />
              </button>

              <button
                className={styles.taskbarBtn}
                onClick={() => {
                
                if (showMurPanel) {
                  handleGoLeft()
                  
                  setTimeout(() => {
                    if (transitioning.current || !vpRef.current.vW) return
                    transitioning.current = true
                    zoomed.current = true
                    setShowHint(true)
                    setActiveElementId('telephone')
                    activeElementIdRef.current = 'telephone'
                    animateTo(getPlanTransform(vpRef.current.vH), () => { transitioning.current = false })
                  }, DURATION + 100)
                  return
                }
              
                
                if (activeElementId === 'telephone') {
                  if (transitioning.current || !vpRef.current.vW) return
                  transitioning.current = true
                  zoomed.current = false
                  setShowHint(false)
                  setActiveElementId(null)
                  activeElementIdRef.current = null
                  const { vW, vH } = vpRef.current
                  animateTo(getChambreTransform(vW, vH), () => { transitioning.current = false })
                  return
                }
              
                
                if (transitioning.current || !vpRef.current.vW) return
                if (zoomed.current) {
                  
                  transitioning.current = true
                  zoomed.current = false
                  setShowHint(false)
                  setActiveElementId(null)
                  activeElementIdRef.current = null
                  const { vW, vH } = vpRef.current
                  animateTo(getChambreTransform(vW, vH), () => {
                    transitioning.current = true
                    zoomed.current = true
                    setShowHint(true)
                    setActiveElementId('telephone')
                    activeElementIdRef.current = 'telephone'
                    animateTo(getPlanTransform(vpRef.current.vH), () => { transitioning.current = false })
                  })
                } else {
                  transitioning.current = true
                  zoomed.current = true
                  setShowHint(true)
                  setActiveElementId('telephone')
                  activeElementIdRef.current = 'telephone'
                  animateTo(getPlanTransform(vpRef.current.vH), () => { transitioning.current = false })
                }
              }}
                onMouseEnter={() => { if (inputMode.current === 'mouse') setHoveredId(activeElementId === 'telephone' ? 'retour' : 'contact') }}
                onMouseLeave={() => setHoveredId(null)}
                style={{
                  color: activeElementId === 'telephone' ? 'rgba(201, 168, 76, 1)' : 'rgba(201, 168, 76, 0.65)',
                  background: activeElementId === 'telephone' ? 'rgba(201, 168, 76, 0.12)' : 'transparent',
                }}
              >
                {activeElementId === 'telephone' ? (
                  
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M6 3l5 5-5 5"/>
                  </svg>
                ) : (
                  
                  <img src="/images/taskbar/contact.svg" width="20" height="20" style={{ opacity: 0.8 }} />
                )}
              </button>

              <div className={styles.taskbarDivider} />

              {/* Bouton vue centralisée */}
              <button
                className={styles.taskbarBtn}
                onClick={() => {
                
                if (activeElementId === 'telephone' || zoomed.current) {
                  if (transitioning.current || !vpRef.current.vW) return
                  transitioning.current = true
                  zoomed.current = false
                  setShowHint(false)
                  setActiveElementId(null)
                  activeElementIdRef.current = null
                  const { vW, vH } = vpRef.current
                  animateTo(getChambreTransform(vW, vH), () => {
                    transitioning.current = false
                    
                    handleGoRight()
                  })
                  return
                }

                  if (rightPanelOpen) {
                    handleGoLeft()
                  } else {
                    handleGoRight()
                  }
                }}

                onMouseEnter={() => { if (inputMode.current === 'mouse') setHoveredId(rightPanelOpen ? 'retour' : 'vue centralisée') }}
                onMouseLeave={() => setHoveredId(null)}
                style={{
                  color: rightPanelOpen ? 'rgba(201, 168, 76, 1)' : 'rgba(201, 168, 76, 0.65)',
                  background: rightPanelOpen ? 'rgba(201, 168, 76, 0.12)' : 'transparent',
                }}
              >
                {rightPanelOpen ? (
                  
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M10 3L5 8l5 5"/>
                  </svg>
                ) : (
                  
                  <img src="/images/taskbar/central.svg" width="20" height="20" style={{ opacity: 0.8, pointerEvents: 'none' }} />
                )}
              </button>
            </div>

            {/* ── Modal d'aide ── */}
            {showHelp && (
              <div className={styles.helpModal} onClick={() => { setShowHelp(false)}} style={{ cursor: 'none' }}>
                <div className={styles.helpModalInner} style={{ cursor: 'none' }} onClick={e => e.stopPropagation()}>
                  <button className={styles.helpModalClose} onClick={() => { setShowHelp(false)}}>×</button>
                  <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', fontWeight: 500, letterSpacing: '0.3em', marginBottom: '2rem', color: 'rgba(201,168,76,0.9)'}}>
                    Comment explorer ?
                  </h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                    {[
                      { node: <span style={{ fontSize: '1rem', opacity: 0.6, minWidth: '1.5rem', paddingTop: '1px' }}>↔</span>, text: 'Déplacez la souris vers les bords pour faire défiler la chambre.' },
                      { node: <span style={{ fontSize: '1rem', opacity: 0.6, minWidth: '1.5rem', paddingTop: '1px' }}>↗</span>, text: 'Cliquez sur les objets pour en apprendre plus sur moi.' },
                      { node: <span style={{ fontSize: '1rem', opacity: 0.6, minWidth: '1.5rem', paddingTop: '1px' }}>⌫</span>, text: 'Cliquez n\'importe où pour revenir en arrière après avoir ouvert un objet.' },
                      { node: <img src="/images/taskbar/central1.svg" width="20" height="20" style={{ opacity: 0.55, marginTop: '3px', flexShrink: 0 }} />, text: `Vous n'avez pas de temps a perdre ? Le bouton vue centralisée regroupe tout le contenu du portfolio au même endroit` },
                      { node: <img src="/images/taskbar/entree1.svg" width="20" height="20" style={{ opacity: 0.55, marginTop: '3px', flexShrink: 0 }} />, text: 'Le bouton porte recharge la page et revient à l\'entrée.' },
                    ].map(({ node, text }) => (
                      <div key={text} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                        {node}
                        <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.15rem', fontWeight: 300, lineHeight: 1.7, color: '#fff0c8b3', margin: 0 }}>{text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}

          {isOrdi && (
          <>
            <button 
              className={styles.backBtn} 
              onClick={handleOrdiBack}
              onMouseEnter={() => { if (inputMode.current === 'mouse') setHoveredId('retour à la chambre') }}
              onMouseLeave={() => setHoveredId(null)}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M10 3L5 8l5 5"/>
              </svg>
              retour
            </button>

            <a 
              href="https://projets.clementberger.fr/" 
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.fullscreenBtn}
              onMouseEnter={() => { if (inputMode.current === 'mouse') setHoveredId('ouvrir le site en plein écran') }}
              onMouseLeave={() => setHoveredId(null)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
              </svg>
            </a>
          </>
        )}

          <div className={styles.vignette} style={{ zIndex: 6, pointerEvents: 'none' }} />
          {isChambre && showHint && <p className={styles.hint} style={{ zIndex: 5 }}>cliquer pour revenir</p>}

        </div>
      </div>
    </>
  )
}