import { useState } from 'react'
import DinoDetail from './DinoDetail'
import { DIET_META } from '../../data/dinosaurs'

const L = {
  axisW:   62,
  humanW:  88,
  slotW:  230,   // fixed iframe width — 3D models don't have 2D aspect ratios
  gap:     16,
  svgH:   540,
  groundY: 468,
  topPad:  34,
  rightPad: 32,
  labelH:  52,
}

const AVAILABLE_H = L.groundY - L.topPad

const MODE_LABEL = { '3d': '3D', fossil: 'Fossil' }

function getEmbedUrl(dino, mode) {
  return mode === 'fossil' ? dino.assets.fossil3d : dino.assets.model3d
}

export default function ComparisonEmbed({ dinos, mode }) {
  const [focusedDino, setFocusedDino] = useState(null)
  const [loaded, setLoaded]           = useState({})   // id → true when user clicks to load

  const maxH    = Math.max(...dinos.map(d => d.heightM), 2.5)
  const scale   = AVAILABLE_H / (maxH * 1.14)
  const maxTick = Math.ceil(maxH * 1.14)
  const ticks   = Array.from({ length: maxTick + 1 }, (_, i) => i)

  let xCursor = L.axisW + L.humanW
  const positioned = dinos.map(dino => {
    const x = xCursor
    xCursor += L.slotW + L.gap
    return { dino, x }
  })
  const totalW = xCursor - L.gap + L.rightPad

  const handleLoad = (id) => setLoaded(prev => ({ ...prev, [id]: true }))
  const handleFocus = (dino) => setFocusedDino(prev => prev?.id === dino.id ? null : dino)

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex-1 overflow-auto rounded-xl border border-stone-800/80 bg-stone-950">
        <div className="relative" style={{ width: Math.max(totalW, 320), height: L.svgH }}>

          {/* ── Y axis ─────────────────────────────────────── */}
          <svg
            style={{ position: 'absolute', top: 0, left: 0, zIndex: 2 }}
            width={L.axisW} height={L.svgH}
          >
            <line x1={L.axisW} y1={L.topPad - 8} x2={L.axisW} y2={L.groundY} stroke="#44403c" strokeWidth={1} />
            {ticks.map(m => (
              <g key={m}>
                <line x1={L.axisW - 5} y1={L.groundY - m * scale} x2={L.axisW} y2={L.groundY - m * scale} stroke="#57534e" strokeWidth={1} />
                <text x={L.axisW - 8} y={L.groundY - m * scale + 4} textAnchor="end" fill="#57534e" fontSize={10}>{m}m</text>
              </g>
            ))}
            <text x={L.axisW + 4} y={L.topPad - 12} fill="#44403c" fontSize={9}>Scale 1 : 1 (meters)</text>
          </svg>

          {/* ── Grid lines ─────────────────────────────────── */}
          {ticks.map(m => m > 0 && (
            <div key={m} style={{
              position: 'absolute', top: L.groundY - m * scale, left: L.axisW,
              right: L.rightPad, height: 1, backgroundColor: '#1c1917',
            }} />
          ))}

          {/* ── Ground line ─────────────────────────────────── */}
          <div style={{
            position: 'absolute', top: L.groundY, left: L.axisW,
            right: L.rightPad, height: 1.5, backgroundColor: '#44403c', zIndex: 1,
          }} />

          {/* ── Human reference ─────────────────────────────── */}
          <div style={{
            position: 'absolute',
            left: L.axisW + 4,
            top: L.groundY - 1.75 * scale,
            width: L.humanW - 8,
            height: 1.75 * scale,
            borderLeft: '1px dashed #44403c',
            borderRight: '1px dashed #44403c',
            borderTop: '1px dashed #44403c',
          }}>
            <span style={{ position: 'absolute', bottom: -18, left: '50%', transform: 'translateX(-50%)', color: '#57534e', fontSize: 9, whiteSpace: 'nowrap' }}>
              Human 1.75m
            </span>
          </div>

          {/* ── Dino embed slots ──────────────────────────────── */}
          {positioned.map(({ dino, x }) => {
            const heightPx = dino.heightM * scale
            const topY     = L.groundY - heightPx
            const url      = getEmbedUrl(dino, mode)
            const isLoaded = loaded[dino.id]
            const isFocused = focusedDino?.id === dino.id
            const { color }  = DIET_META[dino.diet]

            return (
              <div
                key={dino.id}
                style={{ position: 'absolute', left: x, top: topY, width: L.slotW, height: heightPx }}
              >
                {/* Height label */}
                <div style={{ position: 'absolute', top: -18, left: 0, right: 0, textAlign: 'center', color: '#57534e', fontSize: 9 }}>
                  {dino.heightM}m
                </div>

                {url && isLoaded ? (
                  <iframe
                    src={url}
                    title={dino.name}
                    style={{ width: '100%', height: '100%', border: 'none', borderRadius: 8 }}
                    allow="autoplay; fullscreen; xr-spatial-tracking"
                    allowFullScreen
                  />
                ) : (
                  <button
                    onClick={() => url ? handleLoad(dino.id) : handleFocus(dino)}
                    style={{
                      width: '100%', height: '100%',
                      background: '#0c0a09',
                      border: `1px solid ${isFocused ? color : '#292524'}`,
                      borderRadius: 8,
                      cursor: url ? 'pointer' : 'default',
                      display: 'flex', flexDirection: 'column',
                      alignItems: 'center', justifyContent: 'center',
                      gap: 6, padding: 8,
                      transition: 'border-color 0.15s',
                    }}
                    onMouseEnter={() => handleFocus(dino)}
                  >
                    {url ? (
                      <>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
                          <path d="M5 3l14 9-14 9V3z" />
                        </svg>
                        <span style={{ color: '#57534e', fontSize: 10 }}>
                          Load {MODE_LABEL[mode]} model
                        </span>
                      </>
                    ) : (
                      <span style={{ color: '#3c3836', fontSize: 10, textAlign: 'center', lineHeight: 1.4 }}>
                        No {MODE_LABEL[mode]}<br />model
                      </span>
                    )}
                  </button>
                )}

                {/* Name label */}
                <div style={{
                  position: 'absolute', bottom: -(L.labelH - 24), left: 0, right: 0,
                  textAlign: 'center', color: isFocused ? '#f5f5f4' : '#a8a29e', fontSize: 10, fontWeight: 500,
                }}>
                  {dino.name}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <DinoDetail dino={focusedDino} />
    </div>
  )
}
