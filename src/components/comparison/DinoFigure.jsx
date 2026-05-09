import { useState } from 'react'
import Renderer2D from './renderers/Renderer2D'
import { DIET_META } from '../../data/dinosaurs'

/**
 * DinoFigure — positions and labels one dinosaur in the comparison plane.
 *
 * The `renderer` prop is the extensibility seam: pass 'renderer2d' (default)
 * or 'renderer3d' (future). Only the inner renderer changes — positioning,
 * labels, and interaction stay here.
 */
export default function DinoFigure({ dino, x, groundY, scale, slotWidth, onFocus, isFocused, renderer = '2d' }) {
  const [hovered, setHovered] = useState(false)

  const heightPx = dino.heightM * scale
  const topY     = groundY - heightPx
  const cx       = x + slotWidth / 2
  const { color: stroke } = DIET_META[dino.diet]

  const active = hovered || isFocused

  return (
    <g
      onMouseEnter={() => { setHovered(true);  onFocus(dino) }}
      onMouseLeave={() => { setHovered(false); onFocus(null) }}
      onClick={() => onFocus(isFocused ? null : dino)}
      style={{ cursor: 'pointer' }}
    >
      {/* Hover glow column */}
      {active && (
        <rect
          x={x + 2} y={topY - 10}
          width={slotWidth - 4} height={heightPx + 10}
          rx={6}
          fill={stroke} opacity={0.06}
        />
      )}

      {/* Height dashed line */}
      <line
        x1={x + 6} y1={groundY}
        x2={x + 6} y2={topY}
        stroke={active ? stroke : '#2c2a28'}
        strokeWidth={1} strokeDasharray="3 3"
        style={{ transition: 'stroke 0.15s' }}
      />

      {/* The renderer — swap this for Renderer3D later */}
      {renderer === '2d' && (
        <Renderer2D
          dino={dino}
          x={x} topY={topY} groundY={groundY}
          heightPx={heightPx} slotWidth={slotWidth}
        />
      )}

      {/* Height label (top) */}
      <text
        x={cx} y={topY - 6}
        textAnchor="middle"
        fill={active ? stroke : '#57534e'}
        fontSize={10} fontWeight="600"
        style={{ transition: 'fill 0.15s' }}
      >
        {dino.heightM} m
      </text>

      {/* Name label (bottom) */}
      <text
        x={cx} y={groundY + 15}
        textAnchor="middle"
        fill={active ? '#f5f5f4' : '#a8a29e'}
        fontSize={10} fontWeight="500"
        style={{ transition: 'fill 0.15s' }}
      >
        {dino.name.length > 14 ? dino.name.split(' ').pop() : dino.name}
      </text>

      {/* JW badge */}
      {dino.isJurassicWorld && (
        <text x={cx} y={groundY + 27} textAnchor="middle" fill="#7c3aed" fontSize={8} fontWeight="700">
          JW
        </text>
      )}
    </g>
  )
}
