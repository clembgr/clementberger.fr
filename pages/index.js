import { useEffect, useRef, useState, useCallback } from 'react'
import Head from 'next/head'
import styles from '../styles/Home.module.css' 
import MurDroite from '../components/MurDroite'
import MurGauche from '../components/MurGauche'
import { injectSvgAnimations } from '../lib/svgAnimations'

// ─── SCÈNES ───────────────────────────────────────────────────────────────────
const SCENE = { ENTREE: 'entree', CHAMBRE: 'chambre', ORDI: 'ordi' }

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
  'ordi','classeurs','journal','plante-suspendue','platine','saxophone',
  'siege','raquette-tennis','abwheel','miroir','cadre','feuillage',
  'mur-vierge','livres','piano','telephone'
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

  function commit() {
    if (!chambreWrapperRef.current) return
    const { scale, tx, ty } = cur.current
    chambreWrapperRef.current.style.transform =
      `translate(${tx - pan.current.x}px, ${ty - pan.current.y}px) scale(${scale})`
  }

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
    return () => window.removeEventListener('resize', update)
  }, [])

  useEffect(() => {
    if (!vp.vW || !entreeWrapperRef.current || !entreeVisible) return
    const { scale, tx, ty } = getCoverTransform(DIMS.entree, vp.vW, vp.vH)
    entreeWrapperRef.current.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`
  }, [vp, entreeVisible])

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
  }, [vp, scene])

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
            .forEach(el => el.style.display = 'none')
            
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
        setTooltipPos({ x: e.clientX, y: e.clientY })
        if (cursorRef.current) {
          cursorRef.current.style.display = 'block'
          cursorRef.current.style.left = e.clientX + 'px'
          cursorRef.current.style.top  = e.clientY + 'px'
        }
        if (ringRef.current) {
          ringRef.current.style.display = 'block'
          ringRef.current.style.left = e.clientX + 'px'
          ringRef.current.style.top  = e.clientY + 'px'
        }
      } else {
        inputMode.current = 'touch'
        if (cursorRef.current) cursorRef.current.style.display = 'none'
        if (ringRef.current)   ringRef.current.style.display   = 'none'
        setHoveredId(null)
      }
    }
    window.addEventListener('pointermove', onPointerMove)
    return () => window.removeEventListener('pointermove', onPointerMove)
  }, [])

  useEffect(() => {
    const tick = () => {
      if (
        inputMode.current === 'mouse' &&
        !transitioning.current &&
        !zoomed.current &&
        scene === SCENE.CHAMBRE &&
        !rightPanelRef.current
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
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [scene])

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

    transitioning.current = true
    zoomed.current = true
    setShowHint(true)
    setActiveElementId(id)
    
    animateTo(getPlanTransform(vpRef.current.vH), () => { transitioning.current = false })
  }, [animateTo])

  const handleOrdiClick = useCallback((e) => {
    e.stopPropagation()
    if (draggedFlag.current || transitioning.current || zoomed.current || !vpRef.current.vW) return
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
      const targetOrdi = getOrdiTransform(vW, vH)
      cur.current = { ...targetOrdi }
      pan.current = { x: 0, y: 0 }
      panTarget.current = { x: 0, y: 0 }
      commit()
      setScene(SCENE.ORDI)

      setTimeout(() => {
        overlay.style.transition = 'opacity 0.3s ease'
        overlay.style.opacity = '0'
        overlay.addEventListener('transitionend', () => {
          overlay.remove()
          transitioning.current = false
        }, { once: true })
      }, 50)
    }, 300)
  }, [commit])

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
      
      const isOrdi = id === 'ordi'
      const onEnter = () => {
        if (inputMode.current === 'touch' || scene === SCENE.ENTREE) return
        setHoveredId(isOrdi ? "ouvrir l'ordi" : id)
        el.classList.add('svgGroupHover')
        cursorRef.current?.classList.add('cursorHide')
        ringRef.current?.classList.add('ringBig')
      }
      const onLeave = () => {
        setHoveredId(null)
        el.classList.remove('svgGroupHover')
        cursorRef.current?.classList.remove('cursorHide')
        ringRef.current?.classList.remove('ringBig')
      }
      const onClick = (id === 'mur-vierge')
        ? (e) => { e.stopPropagation(); if (!draggedFlag.current) setShowMurPanel(v => !v) }
        : isOrdi
          ? handleOrdiClick
          : (e) => handleChambreElementClick(e, id)
          
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

  const isUnsupported = vp.vW < 900 || vp.vH >= vp.vW
  const isChambre     = scene === SCENE.CHAMBRE
  const isOrdi        = scene === SCENE.ORDI
  const isEntree      = scene === SCENE.ENTREE

  return (
    <>
      <Head>
        <title>Portfolio — Clément Berger</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {isUnsupported && (
        <div className={styles.unsupportedScreen}>
          <p>Désolé, mon portfolio n'est pas optimisé pour les téléphones ou les écrans verticaux.<br /><strong>Veuillez utiliser un ordinateur ou tourner votre tablette en mode paysage.</strong></p>
          <p>Vous pouvez consulter mon cv sur <a href="https://cv.clementberger.fr" target="_blank" rel="noopener noreferrer">cv.clementberger.fr</a></p>
        </div>
      )}

      <div style={{ visibility: isUnsupported ? 'hidden' : 'visible' }}>

        <div ref={cursorRef} className={styles.cursor} />
        <div ref={ringRef}   className={styles.ring}   />

        {hoveredId && (
          <div className={styles.tooltip} style={{ left: tooltipPos.x + 18, top: tooltipPos.y - 10 }}>
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
                <MurGauche activeElementId={activeElementId} />
                <a href="https://cv.clementberger.fr" target="_blank" rel="noopener noreferrer"
                  className={styles.cvFrame}
                  style={{ left: `${CV_FRAME.left}%`, top: `${CV_FRAME.top}%`, width: `${CV_FRAME.width}%`, height: `${CV_FRAME.height}%`, pointerEvents: 'all' }}
                  onClick={e => { draggedFlag.current ? (e.preventDefault(), e.stopPropagation()) : e.stopPropagation() }}
                  onMouseEnter={() => { if (inputMode.current === 'mouse') setHoveredId('voir le cv') }}
                  onMouseLeave={() => setHoveredId(null)}>
                  <img src="/images/cv.png" alt="CV Clément Berger" className={styles.cvImg} draggable={false} />
                </a>
                <div className={styles.paysageFrame} style={{ left: `${PAYSAGE.left}%`, top: `${PAYSAGE.top}%`, width: `${PAYSAGE.width}%`, height: `${PAYSAGE.height}%`, overflow: 'hidden' }}>
                  <video src="/images/paysage.MOV" autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                </div>
                <div
                  className={styles.paysageFrame}
                  style={{
                    left: `${ORDI_VIDEO.left}%`, top: `${ORDI_VIDEO.top}%`,
                    width: `${ORDI_VIDEO.width}%`, height: `${ORDI_VIDEO.height}%`,
                    clipPath: ORDI_CLIP,
                    pointerEvents: 'all',
                    cursor: 'none',
                  }}
                  onClick={handleOrdiClick}
                  onMouseEnter={() => {
                    if (inputMode.current === 'mouse') {
                      setHoveredId("ouvrir l'ordi")
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
                    src="/images/paysage.MOV"
                    autoPlay loop muted playsInline
                    className={styles.ordiVideo3D}
                    style={{ pointerEvents: 'none' }}
                  />
                </div>
              </div>
            )}

            {isOrdi && (
              <div style={{ position: 'absolute', inset: 0 }}>
                <img src="/images/zoom-ordi.svg" alt="ordi" className={styles.svgImg} draggable={false} />
                <iframe src="https://projets.clementberger.fr/" title="Ordinateur" className={styles.ordiIframe}
                  style={{ left: `${ORDI_PH.left}%`, top: `${ORDI_PH.top}%`, width: `${ORDI_PH.width}%`, height: `${ORDI_PH.height}%`, transform: 'scale(1.01)' }} />
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
                overflow: 'hidden'
              }}
              onClick={!doorOpen ? handlePorteClick : handleEnterClick}
            >
              <img src="/images/entree-fermee.svg" alt="entrée" className={styles.svgImg} draggable={false}
                style={{
                  position: 'absolute', inset: 0, transition: 'opacity 0.6s ease',
                  opacity: doorOpen ? 0 : 1, 
                }} />
              <img src="/images/entree-ouverte.svg" alt="entrée ouverte" className={styles.svgImg} draggable={false}
                style={{
                  position: 'absolute', inset: 0, transition: 'opacity 0.6s ease',
                  opacity: doorOpen ? 1 : 0, 
                }} />
            </div>
          )}

          {showMurPanel && isChambre && <MurDroite />}

          {isChambre && !rightPanelOpen && (
            <button className={styles.arrowBtn} style={{ right: '1.5rem', zIndex: 5 }} onClick={handleGoRight}
              onMouseEnter={() => { if (inputMode.current === 'mouse') setHoveredId('explorer') }}
              onMouseLeave={() => setHoveredId(null)}>›</button>
          )}
          {isChambre && rightPanelOpen && (
            <button className={styles.arrowBtn} style={{ left: '1.5rem', zIndex: 5 }} onClick={handleGoLeft}
              onMouseEnter={() => { if (inputMode.current === 'mouse') setHoveredId('retour') }}
              onMouseLeave={() => setHoveredId(null)}>‹</button>
          )}

          {isOrdi && (
            <button className={styles.backBtn} style={{ zIndex: 9998 }} onClick={handleOrdiBack}>← retour</button>
          )}

          <div className={styles.vignette} style={{ zIndex: 6, pointerEvents: 'none' }} />
          {isChambre && showHint && <p className={styles.hint} style={{ zIndex: 5 }}>cliquer pour revenir</p>}

        </div>
      </div>
    </>
  )
}