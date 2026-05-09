import { useState } from 'react'
import HumanFigure from './HumanFigure'
import DinoFigure from './DinoFigure'
import DinoDetail from './DinoDetail'
import ComparisonEmbed from './ComparisonEmbed'
import { parseSilhouetteAspect } from './silhouetteUtils'

// Layout constants (px)
const L = {
  axisW:    62,
  humanW:   88,
  dinoGap:  20,   // gap between dino slots
  minSlot:  80,   // minimum slot width (keeps labels readable for tiny dinos)
  svgH:    540,
  groundY: 468,
  topPad:   34,
  rightPad: 32,
}

const AVAILABLE_H = L.groundY - L.topPad   // 434 px

/** Returns the slot width a dino needs given the current px/m scale. */
function dinoSlotWidth(dino, scale) {
  const heightPx = dino.heightM * scale
  const aspect   = parseSilhouetteAspect(dino.assets.silhouette2d) ?? 1.5
  return Math.max(heightPx * aspect, L.minSlot)
}

/**
 * ComparisonPlane — entry point for the comparison view.
 * mode: '2d' → SVG silhouettes | '3d' → Sketchfab embeds | 'fossil' → Smithsonian embeds
 */
export default function ComparisonPlane({ dinos, mode = '2d' }) {
  const [focusedDino, setFocusedDino] = useState(null)

  if (dinos.length === 0) {
    return <EmptyState />
  }

  if (mode === '3d' || mode === 'fossil') {
    return <ComparisonEmbed dinos={dinos} mode={mode} />
  }

  const maxH   = Math.max(...dinos.map(d => d.heightM), 2.5)
  const scale  = AVAILABLE_H / (maxH * 1.14)   // 14 % headroom above tallest

  // Variable slot widths: each dino gets exactly as much horizontal room as
  // its silhouette needs (height × aspect ratio), with a minimum for labels.
  const slots = dinos.map(d => ({ dino: d, slotWidth: dinoSlotWidth(d, scale) }))

  // Cumulative x positions
  let xCursor = L.axisW + L.humanW
  const positioned = slots.map(({ dino, slotWidth }) => {
    const x = xCursor
    xCursor += slotWidth + L.dinoGap
    return { dino, x, slotWidth }
  })

  const svgW = xCursor - L.dinoGap + L.rightPad

  // Y-axis tick marks — one per meter up to ceil(max * 1.14)
  const maxTick = Math.ceil(maxH * 1.14)
  const ticks   = Array.from({ length: maxTick + 1 }, (_, i) => i)

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Scrollable SVG */}
      <div className="flex-1 overflow-auto rounded-xl border border-stone-800/80 bg-stone-950">
        <svg
          width={Math.max(svgW, 320)}
          height={L.svgH}
          style={{ display: 'block' }}
        >
          {/* ── Grid ─────────────────────────────────────────── */}
          {ticks.map(m => m > 0 && (
            <line
              key={m}
              x1={L.axisW} y1={L.groundY - m * scale}
              x2={svgW - L.rightPad} y2={L.groundY - m * scale}
              stroke="#1c1917" strokeWidth={1}
            />
          ))}

          {/* ── Y axis ────────────────────────────────────────── */}
          <line
            x1={L.axisW} y1={L.topPad - 8}
            x2={L.axisW} y2={L.groundY}
            stroke="#44403c" strokeWidth={1}
          />

          {/* ── Tick marks + labels ───────────────────────────── */}
          {ticks.map(m => (
            <g key={m}>
              <line
                x1={L.axisW - 5} y1={L.groundY - m * scale}
                x2={L.axisW}     y2={L.groundY - m * scale}
                stroke="#57534e" strokeWidth={1}
              />
              <text
                x={L.axisW - 8} y={L.groundY - m * scale + 4}
                textAnchor="end" fill="#57534e" fontSize={10}
              >
                {m}m
              </text>
            </g>
          ))}

          {/* ── Ground line ───────────────────────────────────── */}
          <line
            x1={L.axisW} y1={L.groundY}
            x2={svgW - L.rightPad + 4} y2={L.groundY}
            stroke="#44403c" strokeWidth={1.5}
          />

          {/* ── Human reference ───────────────────────────────── */}
          <HumanFigure
            x={L.axisW + 4}
            groundY={L.groundY}
            scale={scale}
            slotWidth={L.humanW - 8}
          />

          {/* ── Dinosaurs ─────────────────────────────────────── */}
          {positioned.map(({ dino, x, slotWidth }) => (
            <DinoFigure
              key={dino.id}
              dino={dino}
              x={x}
              groundY={L.groundY}
              scale={scale}
              slotWidth={slotWidth}
              onFocus={setFocusedDino}
              isFocused={focusedDino?.id === dino.id}
              renderer={mode}
            />
          ))}

          {/* ── Scale legend ──────────────────────────────────── */}
          <text x={L.axisW + 4} y={L.topPad - 12} fill="#44403c" fontSize={9}>
            Scale 1 : 1 (meters)
          </text>
        </svg>
      </div>

      {/* Detail panel */}
      <DinoDetail dino={focusedDino} />
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 text-stone-600 select-none">
      <div className="text-6xl opacity-30">🦕</div>
      <p className="text-base font-medium text-stone-500">Select dinosaurs from the roster</p>
      <p className="text-sm text-stone-600">Up to 8 can be compared at once</p>
    </div>
  )
}
