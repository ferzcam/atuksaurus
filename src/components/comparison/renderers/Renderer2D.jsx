import { DIET_META, TYPE } from '../../../data/dinosaurs'

/**
 * Renderer2D — draws a dinosaur silhouette inside an SVG coordinate space.
 *
 * Contract (shared with future Renderer3D):
 *   props: { dino, x, topY, groundY, heightPx, slotWidth }
 *
 * If dino.assets.silhouette2d is populated, the image is used directly.
 * Otherwise a procedural shape is drawn based on dino.type.
 *
 * To upgrade to a real silhouette later, just set assets.silhouette2d to a URL.
 */
export default function Renderer2D({ dino, x, topY, groundY, heightPx, slotWidth }) {
  const { color: stroke, bg } = DIET_META[dino.diet]
  const fill = bg

  if (dino.assets.silhouette2d) {
    return (
      <image
        href={dino.assets.silhouette2d}
        x={x}
        y={topY}
        width={slotWidth}
        height={heightPx}
        preserveAspectRatio="xMidYMax meet"
        style={{
          // brightness(0) → forces all pixels to black; invert(1) → flips to white.
          // This makes the black PhyloPic silhouette white on our dark background.
          // The drop-shadow then adds a diet-color glow around the shape.
          filter: `brightness(0) invert(1) drop-shadow(0 2px 10px ${stroke}cc)`,
        }}
      />
    )
  }

  const shapeProps = { x, topY, groundY, heightPx, slotWidth, fill, stroke }

  switch (dino.type) {
    case TYPE.SAUROPOD:    return <SauropodShape    {...shapeProps} />
    case TYPE.PTEROSAUR:   return <PterosaurShape   {...shapeProps} />
    case TYPE.ANKYLOSAUR:
    case TYPE.STEGOSAUR:
    case TYPE.CERATOPSIAN:
    case TYPE.ORNITHOPOD:  return <QuadrupedShape   {...shapeProps} dino={dino} />
    default:               return <TheropodShape    {...shapeProps} />
  }
}

// ─── Shape components ─────────────────────────────────────────────────────────

function TheropodShape({ x, topY, groundY, heightPx, slotWidth, fill, stroke }) {
  const h = heightPx
  const bw = Math.min(slotWidth * 0.92, h * 1.25)
  const left = x + (slotWidth - bw) / 2

  const headW   = bw * 0.3
  const headH   = h * 0.22
  const headCX  = left + bw * 0.78
  const headCY  = topY + headH * 0.58

  const neckEndX = left + bw * 0.60
  const neckEndY = topY + h * 0.34

  const bodyCX = left + bw * 0.38
  const bodyCY = topY + h * 0.50
  const bodyRX = bw * 0.22
  const bodyRY = h * 0.17

  const legW    = Math.max(bw * 0.075, 3)
  const legTopY = bodyCY + bodyRY * 0.82
  const leg1X   = bodyCX - bodyRX * 0.28
  const leg2X   = bodyCX + bodyRX * 0.15
  const shinLen = (groundY - legTopY) * 0.52
  const footLen = bw * 0.1

  return (
    <g style={{ filter: `drop-shadow(0 2px 8px ${stroke}44)` }}>
      {/* Tail */}
      <path
        d={`M ${left + bw * 0.03},${topY + h * 0.54}
            Q ${left + bw * 0.12},${topY + h * 0.50}
              ${bodyCX - bodyRX * 0.85},${bodyCY + bodyRY * 0.25}`}
        fill="none" stroke={stroke} strokeWidth={h * 0.058} strokeLinecap="round"
      />
      {/* Body */}
      <ellipse cx={bodyCX} cy={bodyCY} rx={bodyRX} ry={bodyRY} fill={fill} stroke={stroke} strokeWidth={1.5} />
      {/* Neck */}
      <path
        d={`M ${neckEndX},${neckEndY}
            Q ${left + bw * 0.68},${topY + h * 0.20}
              ${headCX - headW * 0.38},${headCY + headH * 0.22}`}
        fill="none" stroke={stroke} strokeWidth={h * 0.072} strokeLinecap="round"
      />
      {/* Upper jaw */}
      <ellipse cx={headCX} cy={headCY} rx={headW * 0.52} ry={headH * 0.44} fill={fill} stroke={stroke} strokeWidth={1.5} />
      {/* Lower jaw */}
      <path
        d={`M ${headCX - headW * 0.48},${headCY + headH * 0.12}
            Q ${headCX + headW * 0.08},${headCY + headH * 0.62}
              ${headCX + headW * 0.48},${headCY + headH * 0.12}`}
        fill={fill} stroke={stroke} strokeWidth={1.2}
      />
      {/* Eye */}
      <circle cx={headCX + headW * 0.08} cy={headCY - headH * 0.08} r={Math.max(h * 0.018, 2)} fill={stroke} />
      {/* Tiny arm */}
      <line
        x1={neckEndX - bw * 0.04} y1={neckEndY + h * 0.10}
        x2={neckEndX + bw * 0.04} y2={neckEndY + h * 0.20}
        stroke={stroke} strokeWidth={legW * 0.55} strokeLinecap="round"
      />
      {/* Front leg — thigh */}
      <line x1={leg1X} y1={legTopY} x2={leg1X - legW * 0.8} y2={legTopY + shinLen * 0.85} stroke={stroke} strokeWidth={legW * 1.2} strokeLinecap="round" />
      {/* Front leg — shin */}
      <line x1={leg1X - legW * 0.8} y1={legTopY + shinLen * 0.85} x2={leg1X} y2={groundY - 1} stroke={stroke} strokeWidth={legW * 0.9} strokeLinecap="round" />
      {/* Front leg — foot */}
      <line x1={leg1X - footLen * 0.4} y1={groundY - 1} x2={leg1X + footLen * 0.9} y2={groundY - 1} stroke={stroke} strokeWidth={legW * 0.75} strokeLinecap="round" />
      {/* Back leg — thigh */}
      <line x1={leg2X} y1={legTopY} x2={leg2X + legW * 0.6} y2={legTopY + shinLen * 0.85} stroke={stroke} strokeWidth={legW} strokeLinecap="round" />
      {/* Back leg — shin */}
      <line x1={leg2X + legW * 0.6} y1={legTopY + shinLen * 0.85} x2={leg2X + legW * 0.3} y2={groundY - 1} stroke={stroke} strokeWidth={legW * 0.8} strokeLinecap="round" />
      {/* Back leg — foot */}
      <line x1={leg2X} y1={groundY - 1} x2={leg2X + footLen * 1.1} y2={groundY - 1} stroke={stroke} strokeWidth={legW * 0.65} strokeLinecap="round" />
    </g>
  )
}

function SauropodShape({ x, topY, groundY, heightPx, slotWidth, fill, stroke }) {
  const h = heightPx
  const bw = Math.min(slotWidth * 0.96, h * 1.55)
  const left = x + (slotWidth - bw) / 2

  const bodyCX  = left + bw * 0.52
  const bodyCY  = groundY - h * 0.21
  const bodyRX  = bw * 0.27
  const bodyRY  = h * 0.155

  const neckBaseX = bodyCX - bodyRX * 0.68
  const neckBaseY = bodyCY - bodyRY * 0.72

  const headCX = left + bw * 0.08
  const headCY = topY + h * 0.075
  const headRX = bw * 0.066
  const headRY = h * 0.048

  const legW   = Math.max(bw * 0.065, 3)
  const legTop = bodyCY + bodyRY * 0.62

  return (
    <g style={{ filter: `drop-shadow(0 2px 8px ${stroke}44)` }}>
      {/* Tail */}
      <path
        d={`M ${left + bw * 0.97},${bodyCY - bodyRY * 0.08}
            Q ${bodyCX + bodyRX * 1.1},${bodyCY + bodyRY * 0.35}
              ${bodyCX + bodyRX * 0.72},${bodyCY + bodyRY * 0.1}`}
        fill="none" stroke={stroke} strokeWidth={h * 0.046} strokeLinecap="round"
      />
      {/* Body */}
      <ellipse cx={bodyCX} cy={bodyCY} rx={bodyRX} ry={bodyRY} fill={fill} stroke={stroke} strokeWidth={1.5} />
      {/* Neck */}
      <path
        d={`M ${neckBaseX},${neckBaseY}
            Q ${neckBaseX - bw * 0.14},${(neckBaseY + headCY) / 2 - h * 0.04}
              ${headCX + headRX * 0.9},${headCY + headRY * 0.35}`}
        fill="none" stroke={stroke} strokeWidth={h * 0.078} strokeLinecap="round"
      />
      {/* Head */}
      <ellipse cx={headCX} cy={headCY} rx={headRX} ry={headRY} fill={fill} stroke={stroke} strokeWidth={1.5} />
      {/* Eye */}
      <circle cx={headCX - headRX * 0.18} cy={headCY - headRY * 0.22} r={Math.max(h * 0.014, 1.5)} fill={stroke} />
      {/* Front-left leg */}
      <rect x={bodyCX - bodyRX * 0.52 - legW / 2} y={legTop} width={legW} height={groundY - legTop} rx={legW * 0.35} fill={fill} stroke={stroke} strokeWidth={1} />
      {/* Front-right leg */}
      <rect x={bodyCX - bodyRX * 0.12 - legW / 2} y={legTop + h * 0.012} width={legW} height={groundY - legTop - h * 0.012} rx={legW * 0.35} fill={fill} stroke={stroke} strokeWidth={1} />
      {/* Back-left leg */}
      <rect x={bodyCX + bodyRX * 0.18 - legW / 2} y={legTop} width={legW} height={groundY - legTop} rx={legW * 0.35} fill={fill} stroke={stroke} strokeWidth={1} />
      {/* Back-right leg */}
      <rect x={bodyCX + bodyRX * 0.52 - legW / 2} y={legTop + h * 0.012} width={legW} height={groundY - legTop - h * 0.012} rx={legW * 0.35} fill={fill} stroke={stroke} strokeWidth={1} />
    </g>
  )
}

function QuadrupedShape({ dino, x, topY, groundY, heightPx, slotWidth, fill, stroke }) {
  const h = heightPx
  const bw = Math.min(slotWidth * 0.92, h * 1.35)
  const left = x + (slotWidth - bw) / 2

  const bodyCX  = left + bw * 0.50
  const bodyCY  = groundY - h * 0.34
  const bodyRX  = bw * 0.30
  const bodyRY  = h * 0.215

  const headR   = Math.min(h * 0.13, bw * 0.14)
  const headCX  = left + bw * 0.16
  const headCY  = topY + h * 0.10 + headR

  const legW    = Math.max(bw * 0.068, 3)
  const legTop  = bodyCY + bodyRY * 0.62

  // Stegosaur plates
  const isSteg  = dino.type === 'stegosaur'
  // Ceratopsian frill
  const isCerat = dino.type === 'ceratopsian'

  return (
    <g style={{ filter: `drop-shadow(0 2px 8px ${stroke}44)` }}>
      {/* Stegosaur plates */}
      {isSteg && [0.25, 0.42, 0.58, 0.72].map((t, i) => {
        const px = bodyCX - bodyRX + bodyRX * 2 * t
        const py = bodyCY - bodyRY * 0.85
        const pw = bw * 0.065
        const ph = h * (0.22 - Math.abs(t - 0.5) * 0.25)
        return <ellipse key={i} cx={px} cy={py - ph / 2} rx={pw * 0.55} ry={ph * 0.52} fill={fill} stroke={stroke} strokeWidth={1.2} />
      })}

      {/* Ceratopsian frill */}
      {isCerat && (
        <ellipse
          cx={headCX - headR * 0.5} cy={headCY}
          rx={headR * 1.4} ry={headR * 1.1}
          fill={fill} stroke={stroke} strokeWidth={1.2} opacity={0.85}
        />
      )}

      {/* Tail */}
      <path
        d={`M ${left + bw * 0.93},${bodyCY - bodyRY * 0.1}
            Q ${left + bw * 1.02},${bodyCY + bodyRY * 0.5}
              ${left + bw * 0.88},${bodyCY + bodyRY * 0.58}`}
        fill="none" stroke={stroke} strokeWidth={h * 0.052} strokeLinecap="round"
      />
      {/* Body */}
      <ellipse cx={bodyCX} cy={bodyCY} rx={bodyRX} ry={bodyRY} fill={fill} stroke={stroke} strokeWidth={1.5} />
      {/* Neck */}
      <path
        d={`M ${bodyCX - bodyRX * 0.72},${bodyCY - bodyRY * 0.62}
            Q ${bodyCX - bodyRX * 0.95},${(bodyCY - bodyRY + headCY) / 2}
              ${headCX + headR * 0.82},${headCY}`}
        fill="none" stroke={stroke} strokeWidth={h * 0.068} strokeLinecap="round"
      />
      {/* Head */}
      <circle cx={headCX} cy={headCY} r={headR} fill={fill} stroke={stroke} strokeWidth={1.5} />
      {/* Eye */}
      <circle cx={headCX + headR * 0.22} cy={headCY - headR * 0.2} r={Math.max(h * 0.016, 1.5)} fill={stroke} />
      {/* Horns (ceratopsian) */}
      {isCerat && <>
        <line x1={headCX - headR * 0.2} y1={headCY - headR * 0.9} x2={headCX - headR * 0.35} y2={headCY - headR * 1.6} stroke={stroke} strokeWidth={Math.max(h * 0.022, 1.5)} strokeLinecap="round" />
        <line x1={headCX + headR * 0.3} y1={headCY - headR * 0.7} x2={headCX + headR * 0.5} y2={headCY - headR * 1.35} stroke={stroke} strokeWidth={Math.max(h * 0.018, 1.2)} strokeLinecap="round" />
      </>}
      {/* Legs */}
      <rect x={bodyCX - bodyRX * 0.52 - legW / 2} y={legTop} width={legW} height={groundY - legTop} rx={legW * 0.35} fill={fill} stroke={stroke} strokeWidth={1} />
      <rect x={bodyCX - bodyRX * 0.12 - legW / 2} y={legTop + h * 0.012} width={legW} height={groundY - legTop - h * 0.012} rx={legW * 0.35} fill={fill} stroke={stroke} strokeWidth={1} />
      <rect x={bodyCX + bodyRX * 0.18 - legW / 2} y={legTop} width={legW} height={groundY - legTop} rx={legW * 0.35} fill={fill} stroke={stroke} strokeWidth={1} />
      <rect x={bodyCX + bodyRX * 0.50 - legW / 2} y={legTop + h * 0.012} width={legW} height={groundY - legTop - h * 0.012} rx={legW * 0.35} fill={fill} stroke={stroke} strokeWidth={1} />
    </g>
  )
}

function PterosaurShape({ x, topY, groundY, heightPx, slotWidth, fill, stroke }) {
  const h = heightPx
  const bw = Math.min(slotWidth * 0.96, h * 1.9)
  const cx = x + slotWidth / 2

  const bodyH  = h * 0.48
  const bodyW  = bw * 0.18
  const bodyCX = cx
  const bodyCY = groundY - bodyH / 2 - h * 0.14

  const headR  = h * 0.095
  const headCX = cx
  const headCY = topY + headR + h * 0.02

  const wingH  = h * 0.28
  const wingY  = bodyCY - bodyH * 0.12
  const wSpan  = bw * 0.44

  return (
    <g style={{ filter: `drop-shadow(0 2px 8px ${stroke}44)` }}>
      {/* Left wing */}
      <path
        d={`M ${bodyCX - bodyW * 0.5},${wingY}
            Q ${cx - wSpan * 0.6},${wingY - wingH * 0.8}
              ${cx - wSpan},${wingY - wingH * 0.25}`}
        fill={fill} stroke={stroke} strokeWidth={1.4}
      />
      {/* Right wing */}
      <path
        d={`M ${bodyCX + bodyW * 0.5},${wingY}
            Q ${cx + wSpan * 0.6},${wingY - wingH * 0.8}
              ${cx + wSpan},${wingY - wingH * 0.25}`}
        fill={fill} stroke={stroke} strokeWidth={1.4}
      />
      {/* Body */}
      <ellipse cx={bodyCX} cy={bodyCY} rx={bodyW * 0.5} ry={bodyH * 0.5} fill={fill} stroke={stroke} strokeWidth={1.5} />
      {/* Neck */}
      <line x1={bodyCX} y1={bodyCY - bodyH * 0.45} x2={headCX} y2={headCY + headR} stroke={stroke} strokeWidth={h * 0.055} strokeLinecap="round" />
      {/* Head */}
      <ellipse cx={headCX} cy={headCY + headR * 0.28} rx={headR * 0.82} ry={headR * 0.72} fill={fill} stroke={stroke} strokeWidth={1.5} />
      {/* Crest */}
      <path
        d={`M ${headCX - headR * 0.55},${headCY + headR * 0.1}
            Q ${headCX + headR * 0.1},${headCY - headR * 0.9}
              ${headCX + headR * 0.6},${headCY + headR * 0.1}`}
        fill={fill} stroke={stroke} strokeWidth={1.1}
      />
      {/* Beak */}
      <path
        d={`M ${headCX - headR * 0.75},${headCY + headR * 0.55}
            L ${headCX - headR * 2.3},${headCY + headR * 0.4}`}
        stroke={stroke} strokeWidth={Math.max(h * 0.028, 1.5)} strokeLinecap="round" fill="none"
      />
      {/* Eye */}
      <circle cx={headCX - headR * 0.15} cy={headCY + headR * 0.22} r={Math.max(h * 0.016, 1.5)} fill={stroke} />
      {/* Feet */}
      <line x1={bodyCX - bodyW * 0.3} y1={bodyCY + bodyH * 0.46} x2={bodyCX - bodyW * 0.5} y2={groundY} stroke={stroke} strokeWidth={Math.max(h * 0.038, 2)} strokeLinecap="round" />
      <line x1={bodyCX + bodyW * 0.3} y1={bodyCY + bodyH * 0.46} x2={bodyCX + bodyW * 0.5} y2={groundY} stroke={stroke} strokeWidth={Math.max(h * 0.038, 2)} strokeLinecap="round" />
    </g>
  )
}
