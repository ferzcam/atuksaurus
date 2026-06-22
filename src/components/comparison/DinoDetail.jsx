import { DIET_META } from '../../data/dinosaurs'

const HUMAN_HEIGHT = 1.75

function Stat({ label, value }) {
  return (
    <div className="flex flex-col">
      <span className="text-[10px] uppercase tracking-widest text-stone-600 font-medium">{label}</span>
      <span className="text-sm font-mono text-stone-200 mt-0.5">{value}</span>
    </div>
  )
}

export default function DinoDetail({ dino }) {
  if (!dino) {
    return (
      <div className="h-28 rounded-xl border border-stone-800/60 bg-stone-900/40 flex items-center justify-center">
        <p className="text-stone-700 text-sm">Tap a dinosaur for details</p>
      </div>
    )
  }

  const diet = DIET_META[dino.diet]
  const ratio = (dino.heightM / HUMAN_HEIGHT).toFixed(1)

  return (
    <div
      className="rounded-xl border bg-stone-900/60 p-4 flex flex-col sm:flex-row gap-4 sm:gap-6 sm:items-start transition-all duration-200 overflow-y-auto"
      style={{ borderColor: diet.color + '55' }}
    >
      {/* Name block */}
      <div className="flex-shrink-0 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="text-base font-bold text-stone-100">{dino.name}</h3>
          {dino.isJurassicWorld && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-violet-900/80 text-violet-300 border border-violet-700/50">
              Jurassic World
            </span>
          )}
          <span
            className="text-[10px] font-bold px-2 py-0.5 rounded-full"
            style={{ color: diet.color, backgroundColor: diet.bg }}
          >
            {diet.label}
          </span>
        </div>
        <p className="text-xs italic text-stone-500 mt-0.5">{dino.scientificName}</p>
        <p className="text-xs text-stone-400 mt-2 max-w-sm leading-relaxed">{dino.description}</p>
      </div>

      {/* Stats */}
      <div className="flex-shrink-0 grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-3 sm:ml-auto">
        <Stat label="Height"  value={`${dino.heightM} m`} />
        <Stat label="Length"  value={`${dino.lengthM} m`} />
        <Stat label="Weight"  value={dino.weightKg >= 1000 ? `${(dino.weightKg / 1000).toFixed(1)} t` : `${dino.weightKg} kg`} />
        <Stat label="Period"  value={dino.period} />
        <Stat label="Age"     value={dino.periodMa} />
        <Stat label="× Human" value={`${ratio}×`} />
      </div>
    </div>
  )
}
