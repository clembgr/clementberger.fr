import { useEffect, useRef, useState, useCallback } from 'react'
import Head from 'next/head'
import styles from '../styles/Home.module.css'

const SVG_W = 4000
const SVG_H = 1602
const CHAMBRE_X = 1149
const CHAMBRE_W = SVG_W - CHAMBRE_X

const ZOOM = 1.05

const DURATION = 950

const SAX = { x: 68, y: 30, w: 3.5, h: 14 }

const OFFSET_CHAMBRE = { x: 0, y: 0 }

const OFFSET_PLAN = { x: 0, y: 0 }

const EDGE  = 0.12
const SPEED = 7
const LERP  = 0.07

function ease(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
}


function getChambreTransform(vW, vH) {
  
  const scale = Math.max(vW / CHAMBRE_W, vH / SVG_H) * ZOOM

  
  const tx = (vW - CHAMBRE_W * scale) / 2 - CHAMBRE_X * scale
             + OFFSET_CHAMBRE.x * CHAMBRE_W * scale

  
  const ty = (vH - SVG_H * scale) / 2
             + OFFSET_CHAMBRE.y * SVG_H * scale

  return { scale, tx, ty }
}

function getPlanTransform(vH) {
  const scale = vH / SVG_H
  
  return { scale, tx: OFFSET_PLAN.x, ty: OFFSET_PLAN.y - 1 }
}

function getPanBounds(vW, vH, t) {
  const { scale, tx, ty } = t
  
  
  
  return {
    minX: tx + CHAMBRE_X * scale,
    maxX: tx + SVG_W * scale - vW,
    minY: ty,
    maxY: ty + SVG_H * scale - vH,
  }
}


export default function Home() {
  const wrapperRef = useRef(null)
  const rafRef     = useRef(null)
  const animRafRef = useRef(null)
  const cursorRef  = useRef(null)
  const ringRef    = useRef(null)

  
  const vpRef  = useRef({ vW: 0, vH: 0 })

  const cur       = useRef({ scale: 1, tx: 0, ty: 0 })
  const pan       = useRef({ x: 0, y: 0 })
  const panTarget = useRef({ x: 0, y: 0 })
  const mouse     = useRef({ x: 0, y: 0 })

  const transitioning = useRef(false)
  const zoomed        = useRef(false)

  const [saxVisible, setSaxVisible] = useState(false)
  const [showHint,   setShowHint]   = useState(false)
  const [vp, setVp] = useState({ vW: 0, vH: 0 })

  
  useEffect(() => {
    const update = () => {
      const val = { vW: window.innerWidth, vH: window.innerHeight }
      vpRef.current = val
      setVp(val)
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  
  useEffect(() => {
    if (!vp.vW) return
    const t = getChambreTransform(vp.vW, vp.vH)
    cur.current = { ...t }
    pan.current = { x: 0, y: 0 }
    panTarget.current = { x: 0, y: 0 }
    commit()
  }, [vp])

  function commit() {
    if (!wrapperRef.current) return
    const { scale, tx, ty } = cur.current
    wrapperRef.current.style.transform =
      `translate(${tx - pan.current.x}px, ${ty - pan.current.y}px) scale(${scale})`
  }

  useEffect(() => {
    const t = setTimeout(() => setSaxVisible(true), 1400)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    const mv = (e) => {
      mouse.current = { x: e.clientX, y: e.clientY }
      if (cursorRef.current) {
        cursorRef.current.style.left = e.clientX + 'px'
        cursorRef.current.style.top  = e.clientY + 'px'
      }
      if (ringRef.current) {
        ringRef.current.style.left = e.clientX + 'px'
        ringRef.current.style.top  = e.clientY + 'px'
      }
    }
    window.addEventListener('mousemove', mv)
    return () => window.removeEventListener('mousemove', mv)
  }, [])

  
  useEffect(() => {
    const tick = () => {
      if (!transitioning.current && !zoomed.current) {
        
        const { vW, vH } = vpRef.current
        if (!vW) { rafRef.current = requestAnimationFrame(tick); return }

        const { x: mx, y: my } = mouse.current
        const nx = mx / vW
        const ny = my / vH

        const bounds = getPanBounds(vW, vH, cur.current)

        let dx = 0, dy = 0
        if      (nx < EDGE)     dx = -SPEED * (1 - nx / EDGE)
        else if (nx > 1 - EDGE) dx =  SPEED * ((nx - (1 - EDGE)) / EDGE)
        if      (ny < EDGE)     dy = -SPEED * (1 - ny / EDGE)
        else if (ny > 1 - EDGE) dy =  SPEED * ((ny - (1 - EDGE)) / EDGE)

        panTarget.current.x = Math.max(bounds.minX, Math.min(bounds.maxX, panTarget.current.x + dx))
        panTarget.current.y = Math.max(bounds.minY, Math.min(bounds.maxY, panTarget.current.y + dy))
      }

      pan.current.x += (panTarget.current.x - pan.current.x) * LERP
      pan.current.y += (panTarget.current.y - pan.current.y) * LERP

      commit()
      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, []) 

  const animateTo = useCallback((to, onDone) => {
    if (animRafRef.current) cancelAnimationFrame(animRafRef.current)
    const t0  = performance.now()
    const from = { ...cur.current }
    const fpx  = pan.current.x
    const fpy  = pan.current.y

    const frame = (now) => {
      const t = Math.min((now - t0) / DURATION, 1)
      const e = ease(t)
      cur.current.scale = from.scale + (to.scale - from.scale) * e
      cur.current.tx    = from.tx    + (to.tx    - from.tx)    * e
      cur.current.ty    = from.ty    + (to.ty    - from.ty)    * e
      pan.current.x     = fpx * (1 - e)
      pan.current.y     = fpy * (1 - e)
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

  const handleSaxClick = useCallback((e) => {
    e.stopPropagation()
    if (transitioning.current || zoomed.current || !vpRef.current.vW) return
    transitioning.current = true
    zoomed.current = true
    setShowHint(true)
    animateTo(getPlanTransform(vpRef.current.vH), () => { transitioning.current = false })
  }, [animateTo])

  const handleViewportClick = useCallback(() => {
    if (transitioning.current || !zoomed.current || !vpRef.current.vW) return
    transitioning.current = true
    zoomed.current = false
    setShowHint(false)
    const { vW, vH } = vpRef.current
    animateTo(getChambreTransform(vW, vH), () => { transitioning.current = false })
  }, [animateTo])

  if (!vp.vW) return null

  return (
    <>
      <Head>
        <title>Portfolio</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div ref={cursorRef} className={styles.cursor} />
      <div ref={ringRef}   className={styles.ring}   />

      <div
        className={styles.viewport}
        style={{ background: showHint ? '#fdd699' : '#1a1008' }}
        onClick={handleViewportClick}
      >
        <div
          ref={wrapperRef}
          className={styles.wrapper}
          style={{ width: SVG_W, height: SVG_H }}
        >
          <img
            src="/images/plan_chambre_final.svg"
            alt=""
            className={styles.svg}
            draggable={false}
          />

          <div
            className={`${styles.sax} ${saxVisible ? styles.saxOn : ''}`}
            style={{
              left:   `${SAX.x}%`,
              top:    `${SAX.y}%`,
              width:  `${SAX.w}%`,
              height: `${SAX.h}%`,
            }}
            onClick={handleSaxClick}
            onMouseEnter={() => {
              cursorRef.current?.classList.add(styles.cursorHide)
              ringRef.current?.classList.add(styles.ringBig)
            }}
            onMouseLeave={() => {
              cursorRef.current?.classList.remove(styles.cursorHide)
              ringRef.current?.classList.remove(styles.ringBig)
            }}
          >
            <img
              src="/images/saxophone.svg"
              alt="saxophone"
              className={styles.saxImg}
              draggable={false}
            />
            <span className={styles.saxLabel}>explorer</span>
          </div>
        </div>

        <div className={styles.vignette} />

        {showHint && (
          <p className={styles.hint}>cliquer pour revenir</p>
        )}
      </div>
    </>
  )
}
