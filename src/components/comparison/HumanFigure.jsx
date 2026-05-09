const HEIGHT_M = 1.75

export default function HumanFigure({ x, groundY, scale, slotWidth }) {
  const heightPx = HEIGHT_M * scale
  const cx       = x + slotWidth / 2
  const topY     = groundY - heightPx

  const headR    = heightPx * 0.09
  const neckY    = topY + headR * 2.2
  const shoulder = topY + heightPx * 0.28
  const hip      = topY + heightPx * 0.58
  const knee     = topY + heightPx * 0.78
  const armEnd   = topY + heightPx * 0.52
  const armSpread = headR * 1.55

  return (
    <g>
      {/* Dashed height line */}
      <line
        x1={cx + slotWidth * 0.28} y1={topY}
        x2={cx + slotWidth * 0.28} y2={groundY}
        stroke="#44403c" strokeWidth={1} strokeDasharray="3 3"
      />
      <text
        x={cx + slotWidth * 0.28 + 4} y={topY + 4}
        fill="#57534e" fontSize={9} dominantBaseline="hanging"
      >
        {HEIGHT_M}m
      </text>

      {/* Head */}
      <circle cx={cx} cy={topY + headR} r={headR} fill="#a8a29e" opacity={0.88} />

      {/* Spine */}
      <line x1={cx} y1={neckY} x2={cx} y2={hip} stroke="#a8a29e" strokeWidth={2} strokeLinecap="round" />

      {/* Left arm */}
      <line x1={cx} y1={shoulder} x2={cx - armSpread} y2={armEnd} stroke="#a8a29e" strokeWidth={1.6} strokeLinecap="round" />
      {/* Right arm */}
      <line x1={cx} y1={shoulder} x2={cx + armSpread} y2={armEnd} stroke="#a8a29e" strokeWidth={1.6} strokeLinecap="round" />

      {/* Left thigh */}
      <line x1={cx} y1={hip} x2={cx - headR * 0.9} y2={knee} stroke="#a8a29e" strokeWidth={1.8} strokeLinecap="round" />
      {/* Left shin */}
      <line x1={cx - headR * 0.9} y1={knee} x2={cx - headR * 0.5} y2={groundY} stroke="#a8a29e" strokeWidth={1.5} strokeLinecap="round" />

      {/* Right thigh */}
      <line x1={cx} y1={hip} x2={cx + headR * 0.9} y2={knee} stroke="#a8a29e" strokeWidth={1.8} strokeLinecap="round" />
      {/* Right shin */}
      <line x1={cx + headR * 0.9} y1={knee} x2={cx + headR * 0.5} y2={groundY} stroke="#a8a29e" strokeWidth={1.5} strokeLinecap="round" />

      {/* Labels */}
      <text x={cx} y={groundY + 15} textAnchor="middle" fill="#78716c" fontSize={10} fontWeight="500">Human</text>
      <text x={cx} y={groundY + 26} textAnchor="middle" fill="#57534e" fontSize={9}>{HEIGHT_M} m</text>
    </g>
  )
}
