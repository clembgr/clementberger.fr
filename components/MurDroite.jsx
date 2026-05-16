import { useState } from 'react'
import { PORTFOLIO_CATEGORIES } from '../data/portfolio'

const DARK_GREEN = '#1b3b22'
const DARK_TEXT  = 'rgba(80, 50, 20, 0.95)'
const SAND       = '#FAD799'

// ─── Construction des onglets ─────────────────────────────────
function buildTabs(categories) {
  const GROUPE_CI = new Set([`Musique`, `Sport`, `Loisirs`])
  const tabs = []
  let ciTab = null

  for (const cat of categories) {
    const items = cat.items
    const catFiltered = { ...cat, items }

    if (cat.categorie === `IA`) {
      tabs.push({ label: `IA`, cats: [catFiltered], fullPage: true })
    } else if (cat.categorie === `Profil`) {
      tabs.push({ label: `Profil`, cats: [catFiltered], fullPage: false })
    } else if (cat.categorie === `Expériences`) {
      tabs.push({ label: `Expériences`, cats: [catFiltered], fullPage: false })
    } else if (
      cat.categorie === `Formation` ||
      cat.categorie === `Compétences`
    ) {
      tabs.push({ label: cat.categorie, cats: [catFiltered], fullPage: true })
    } else if (GROUPE_CI.has(cat.categorie) || cat.categorie === `Loisirs`) {
      if (!ciTab) {
        ciTab = { label: `Centres d'intérêt`, cats: [], fullPage: false }
        tabs.push(ciTab)
      }
      if (items.length > 0) ciTab.cats.push(catFiltered)
    }
  }

  tabs.push({ label: `Projets`, cats: [], fullPage: false, iframe: true })

  return tabs
}

export default function MurDroite({ onClose, onIframeHover }) {
  const tabs = buildTabs(PORTFOLIO_CATEGORIES)
  const [activeTab, setActiveTab] = useState(0)
  const [expandedId, setExpandedId] = useState(null)
  const [showDetails, setShowDetails] = useState(false)

  const handleTabChange = (idx) => {
    setActiveTab(idx)
    setExpandedId(null)
    setShowDetails(false)
  }

  const toggleExpand = (id) => {
    setExpandedId(prev => prev === id ? null : id)
  }

  const currentTab = tabs[activeTab]
  const allGroups = currentTab.cats.map(cat => ({
    sousTitre: cat.categorie,
    items: cat.items,
  }))
  const allItems = allGroups.flatMap(g => g.items)

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 49, pointerEvents: 'all' }}
      onClick={onClose}
    >
      <div
        style={{
          position: 'absolute',
          top: '40px', bottom: '40px',  left: '300px', right: '40px',
          background: SAND, borderRadius: '18px',
          zIndex: 50, overflow: 'hidden',
          display: 'flex', flexDirection: 'column',
        }}
        onClick={e => e.stopPropagation()}
      >
        <style>{`
          .murd-content::-webkit-scrollbar { width: 8px; }   /* ← était 5px */
          .murd-content::-webkit-scrollbar-track { background: rgba(250,215,153,0.3); border-radius: 4px; }
          .murd-content::-webkit-scrollbar-thumb { background: rgba(201,168,76,0.45); border-radius: 4px; }
          .murd-content::-webkit-scrollbar-thumb:hover { background: rgba(201,168,76,0.75); }
          .murd-tab { transition: color 0.2s ease; }
          .murd-tab:hover { color: ${DARK_GREEN} !important; }
          .murd-card { transition: box-shadow 0.2s ease; cursor: pointer; }
          .murd-card:hover { box-shadow: 0 6px 24px rgba(27,59,34,0.13) !important; }
          .murd-btn {
            font-family: 'Cormorant Garamond', serif;
            font-weight: 700;
            color: ${DARK_GREEN};
            background: transparent;
            border: 1.5px solid rgba(27,59,34,0.3);
            border-radius: 7px;
            cursor: pointer;
            transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease;
          }
          .murd-btn:hover {
            background: ${DARK_GREEN} !important;
            color: ${SAND} !important;
            border-color: ${DARK_GREEN} !important;
          }
          @keyframes murd-expand {
            from { opacity: 0; transform: translateY(-6px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @keyframes murd-fadein {
            from { opacity: 0; }
            to   { opacity: 1; }
          }
        `}</style>

        {/* ── Croix ── */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: '18px', left: '22px', zIndex: 10,
            background: 'transparent', border: 'none', cursor: 'pointer',
            padding: '8px', color: 'rgba(80,50,20,0.3)', lineHeight: 1,
            transition: 'color 0.2s ease',
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'rgba(80,50,20,0.85)'}
          onMouseLeave={e => e.currentTarget.style.color = 'rgba(80,50,20,0.3)'}
        >
          <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <line x1="2" y1="2" x2="14" y2="14"/><line x1="14" y1="2" x2="2" y2="14"/>
          </svg>
        </button>

        {/* ── En-tête ── */}
        <div style={{ padding: '20px 24px 0 58px', flexShrink: 0 }}>
          <p style={{
            fontFamily: 'Cormorant Garamond, serif', fontSize: '20px',
            fontWeight: 700, letterSpacing: '0.28em',
            color: 'rgba(80,50,20,0.32)', margin: 0, textTransform: 'lowercase',
          }}>
            vue d'ensemble
          </p>
          <h1 style={{
            fontFamily: 'Cormorant Garamond, serif', fontSize: '45px',
            fontWeight: 700, color: DARK_TEXT, margin: '4px 0 16px 0', lineHeight: 1,
          }}>
            Clément BERGER
          </h1>
        </div>

        {/* ── Onglets ── */}
        <div
        className="murd-tabs"
        style={{
          display: 'flex', padding: '0',
          overflowX: 'auto', scrollbarWidth: 'none', flexShrink: 0,
          borderBottom: `1.5px solid rgba(27,59,34,0.12)`,
        }}
      >
        {tabs.map((tab, idx) => {
          const isActive = idx === activeTab
          return (
            <button
              key={tab.label}
              className="murd-tab"
              onClick={() => handleTabChange(idx)}
              style={{
                flex: 1,
                fontFamily: 'Cormorant Garamond, serif', fontSize: '20px',
                fontWeight: isActive ? 700 : 500,
                color: isActive ? DARK_GREEN : 'rgba(80,50,20,0.45)',
                background: 'transparent', border: 'none',
                borderBottom: isActive ? `2.5px solid ${DARK_GREEN}` : '2.5px solid transparent',
                padding: '10px 4px', cursor: 'pointer',
                whiteSpace: 'nowrap', marginBottom: '-1.5px',
              }}
            >
              {tab.label}
            </button>
          )
        })}
      </div>

        {/* ── Contenu : iframe Projets ── */}
        {currentTab.iframe && (
          <div style={{
            animation: 'murd-fadein 0.25s ease',
            border: '1.5px solid rgba(27,59,34,0.13)',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 8px 28px rgba(27,59,34,0.08)',
            height: '600px',
            position: 'relative',
            pointerEvents: 'auto'
          }}
            onMouseEnter={() => onIframeHover?.(true)}
            onMouseLeave={() => onIframeHover?.(false)}
          >
            <iframe
              src="https://projets.clementberger.fr"
              style={{ width: '100%', height: '100%', border: 'none', display: 'block', pointerEvents: 'auto' }}
              title="Projets informatiques"
            />
          </div>
        )}

        {/* ── Contenu : onglets normaux ── */}
        {!currentTab.iframe && (
          <div
            className="murd-content"
            style={{ flex: 1, overflowY: 'auto', padding: '20px 16px 40px 16px' }}
          >
            {/* VUE PLEINE PAGE */}
            {currentTab.fullPage && allItems.length === 1 && (
              <FullPageView
                item={allItems[0]}
                showDetails={showDetails}
                onToggleDetails={() => setShowDetails(v => !v)}
              />
            )}

            {/* VUE CARDS */}
            {!currentTab.fullPage && allGroups.map(({ sousTitre, items }) => (
              <div key={sousTitre}>

                {currentTab.label === 'Expériences' && (
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
                    <img
                      src="/images/objets/siege.png"
                      alt=""
                      draggable={false}
                      style={{ height: '160px', objectFit: 'contain' }}
                    />
                  </div>
                )}

                {currentTab.cats.length > 1 && (
                  <div style={{
                    marginBottom: '16px',
                    marginTop: sousTitre === allGroups[0].sousTitre ? 0 : '34px',
                  }}>
                    <h2 style={{
                      fontFamily: 'Cormorant Garamond, serif', fontSize: '18px',
                      fontWeight: 900, letterSpacing: '0.22em', textTransform: 'uppercase',
                      color: 'rgba(27,59,34,0.45)', margin: '0 0 10px 0',
                    }}>
                      {sousTitre}
                    </h2>
                    <div style={{ height: '1px', background: 'rgba(27,59,34,0.1)' }} />
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {items.map(item => (
                    <ItemCard
                      key={item.id}
                      item={item}
                      expanded={expandedId === item.id}
                      onToggle={() => toggleExpand(item.id)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}

function FullPageView({ item, showDetails, onToggleDetails }) {
  const hasRealDetails = item.details?.some(d => d.titre != null || d.texte != null)

  return (
    <div style={{
      animation: 'murd-fadein 0.25s ease',
      background: 'rgba(255,255,255,0.72)',
      border: '1.5px solid rgba(27,59,34,0.13)',
      borderRadius: '16px',
      padding: '28px 32px',
      boxShadow: '0 8px 28px rgba(27,59,34,0.08)',
    }}>
      <h2 style={{
        fontFamily: 'Cormorant Garamond, serif', fontSize: '40px',
        fontWeight: 700, color: DARK_TEXT,
        margin: '0 0 10px 0', lineHeight: 1,
      }}>
        {item.label}
      </h2>
      <div style={{ width: '44px', height: '2px', background: DARK_GREEN, marginBottom: '20px' }} />

      {/* SVG déco */}
      {item.svgId && (
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '26px' }}>
          <img
            src={item.svgId} alt="" draggable={false}
            style={{ height: '160px', maxWidth: '100%', objectFit: 'contain', opacity: 0.8 }}
          />
        </div>
      )}

      {/* Summary */}
      <p style={{
        fontFamily: 'Cormorant Garamond, serif', fontSize: '22px', fontWeight: 600,
        color: DARK_GREEN, lineHeight: 1.65, margin: '0', textAlign: 'justify',
      }}>
        {item.summary}
      </p>

      {/* Bullets — toujours visibles */}
      {item.bullets && (
        <ul style={{
          margin: '20px 0',
          padding: '0 0 0 22px',
          display: 'flex', flexDirection: 'column', gap: '10px',
        }}>
          {item.bullets.map((b, i) => (
            <li key={i} style={{
              fontFamily: 'Cormorant Garamond, serif', fontSize: '18px',
              fontWeight: 600, color: DARK_TEXT, lineHeight: 1.4, paddingLeft: '4px',
            }}>
              {b}
            </li>
          ))}
        </ul>
      )}

      {/* Bouton en savoir plus — masqué si pas de vrai contenu */}
      {hasRealDetails && (
        <button
          className="murd-btn"
          onClick={onToggleDetails}
          style={{ fontSize: '15px', padding: '8px 18px', marginBottom: showDetails ? '20px' : '0' }}
        >
          {showDetails ? `▲ réduire` : `▼ en savoir plus`}
        </button>
      )}

      {/* Details dépliés */}
      {showDetails && hasRealDetails && (
        <div style={{
          display: 'flex', flexDirection: 'column', gap: '20px',
          marginTop: '20px',
          animation: 'murd-expand 0.2s ease',
        }}>
          {item.details.map((bloc, i) => (
            <div key={i} style={{ borderLeft: `3px solid rgba(27,59,34,0.2)`, paddingLeft: '18px' }}>
              {bloc.titre && (
                <h4 style={{
                  fontFamily: 'Cormorant Garamond, serif', fontSize: '22px',
                  fontWeight: 700, color: DARK_GREEN,
                  margin: '0 0 6px 0', textTransform: 'lowercase',
                }}>
                  {bloc.titre}
                </h4>
              )}
              <p style={{
                fontFamily: 'Cormorant Garamond, serif', fontSize: '18px',
                fontWeight: 600, color: 'rgba(80,50,20,0.82)',
                lineHeight: 1.7, margin: 0, textAlign: 'justify',
              }}>
                {bloc.texte}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Média */}
      {item.media && (
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '24px' }}>
          {item.media.map((m, i) => (
            <figure key={i} style={{ margin: 0, flex: '1 1 200px' }}>
              <a
                href={m.link || '#'}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'block', cursor: 'pointer', textDecoration: 'none' }}
              >
                <img
                  src={m.src}
                  alt={m.caption}
                  style={{
                    width: '100%', borderRadius: '8px',
                    objectFit: 'cover', aspectRatio: '16/9',
                    border: `1.5px solid rgba(27,59,34,0.15)`,
                    transition: 'transform 0.2s ease',
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                />
              </a>
              {m.caption && (
                <figcaption style={{
                  fontFamily: 'Cormorant Garamond, serif',
                  fontSize: '12px', fontStyle: 'italic',
                  color: 'rgba(80,50,20,0.55)', marginTop: '6px',
                  textAlign: 'center',
                }}>
                  {m.caption}
                </figcaption>
              )}
            </figure>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Card expansible ──────────────────────────────────────────
function ItemCard({ item, expanded, onToggle }) {
  return (
    <div
      className="murd-card"
      onClick={onToggle}
      style={{
        background: 'rgba(255, 255, 255, 0.72)',
        border: `1.5px solid ${expanded ? 'rgba(27,59,34,0.35)' : 'rgba(27,59,34,0.13)'}`,
        borderRadius: '16px', overflow: 'hidden',
        boxShadow: expanded ? '0 8px 28px rgba(27,59,34,0.12)' : '0 2px 8px rgba(27,59,34,0.05)',
        transition: 'border 0.2s ease, box-shadow 0.2s ease',
      }}
    >
      {/* Ligne principale */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '22px',
        padding: expanded ? '22px 24px 14px 24px' : '20px 24px',
      }}>
        {item.svgId && !expanded && (
          <div style={{
            flexShrink: 0,
            width: '72px',
            height: '72px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <img src={item.svgId} alt="" draggable={false} style={{
              width: '100%', height: '100%', objectFit: 'contain',
              pointerEvents: 'none',
            }} />
          </div>
        )}

        <div style={{ flex: 1, minWidth: 0, textAlign: expanded ? 'center' : 'left' }}>
          <h3 style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: expanded ? '35px' : '22px', fontWeight: 700,
            color: DARK_GREEN, margin: '0 0 6px 0', lineHeight: 1.1,
            transition: 'font-size 0.2s ease',
          }}>
            {item.label}
          </h3>
          <p style={{
            fontFamily: 'Cormorant Garamond, serif', fontSize: '18px',
            fontWeight: 600, color: DARK_TEXT, margin: 0, lineHeight: 1.55,
            display: expanded ? 'block' : '-webkit-box',
            WebkitLineClamp: expanded ? 'unset' : 2,
            WebkitBoxOrient: 'vertical',
            overflow: expanded ? 'visible' : 'hidden',
          }}>
            {item.summary}
          </p>

          {!expanded && item.bullets && (
            <div style={{ marginTop: '6px' }}>
              {item.bullets.slice(0, 3).map((b, i) => (
                <span key={i} style={{
                  display: 'inline-block',
                  fontFamily: 'Cormorant Garamond, serif',
                  fontSize: '15px', fontWeight: 700,
                  color: DARK_GREEN,
                  background: 'rgba(27,59,34,0.08)',
                  border: '1px solid rgba(27,59,34,0.15)',
                  borderRadius: '20px',
                  padding: '2px 10px',
                  marginRight: '6px', marginTop: '4px',
                }}>
                  {b}
                </span>
              ))}
            </div>
          )}
        </div>

        <div style={{
          flexShrink: 0, color: 'rgba(27,59,34,0.4)', fontSize: '20px',
          transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.25s ease', userSelect: 'none',
        }}>
          ▾
        </div>
      </div>

      {/* Zone dépliée */}
      {expanded && (
        <div
          style={{ padding: '0 24px 24px 24px', animation: 'murd-expand 0.2s ease' }}
          onClick={e => e.stopPropagation()}
        >
          <div style={{ height: '1px', background: 'rgba(27,59,34,0.1)', marginBottom: '18px' }} />

          {item.svgId && (
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
              <img 
                src={item.svgId} 
                alt="" 
                draggable={false} 
                style={{
                  width: '160px',
                  height: '160px',
                  objectFit: 'contain',
                  opacity: 0.9, 
                  pointerEvents: 'none',
                }} 
              />
            </div>
          )}

          {item.details && Array.isArray(item.details) && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {item.details.map((bloc, i) => (
                <div key={i} style={{ borderLeft: `3px solid rgba(27,59,34,0.18)`, paddingLeft: '16px' }}>
                  {bloc.titre && (
                    <h4 style={{
                      fontFamily: 'Cormorant Garamond, serif', fontSize: '22px',
                      fontWeight: 700, color: DARK_GREEN, margin: '0 0 5px 0',
                    }}>
                      {bloc.titre}
                    </h4>
                  )}
                  <p style={{
                    fontFamily: 'Cormorant Garamond, serif', fontSize: '18px',
                    fontWeight: 600, color: 'rgba(80,50,20,0.82)',
                    lineHeight: 1.65, margin: 0, textAlign: 'justify',
                  }}>
                    {bloc.texte}
                  </p>
                </div>
              ))}
            </div>
          )}

          {item.bullets && (
            <ul style={{
              margin: item.details ? '18px 0 0 0' : '0',
              padding: '0 0 0 20px',
              display: 'flex', flexDirection: 'column', gap: '8px',
            }}>
              {item.bullets.map((b, i) => (
                <li key={i} style={{
                  fontFamily: 'Cormorant Garamond, serif', fontSize: '18px',
                  fontWeight: 600, color: DARK_TEXT, lineHeight: 1.4, paddingLeft: '4px',
                }}>
                  {b}
                </li>
              ))}
            </ul>
          )}

          {item.media && item.media.length > 0 && (
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '16px' }}>
              {item.media.map((m, i) => (
                <figure key={i} style={{ margin: 0, flex: '1 1 180px' }}>
                  <a
                    href={m.link || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: 'block', cursor: 'pointer' }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <img
                      src={m.src}
                      alt={m.caption}
                      style={{
                        width: '100%', borderRadius: '8px',
                        objectFit: 'cover', aspectRatio: '16/9',
                        border: `1.5px solid rgba(27,59,34,0.15)`,
                        transition: 'transform 0.2s ease',
                      }}
                      onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
                      onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                    />
                  </a>
                  {m.caption && (
                    <figcaption style={{
                      fontFamily: 'Cormorant Garamond, serif',
                      fontSize: '15px', fontStyle: 'italic',
                      color: 'rgba(80,50,20,0.55)', marginTop: '5px', textAlign: 'center',
                    }}>
                      {m.caption}
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}