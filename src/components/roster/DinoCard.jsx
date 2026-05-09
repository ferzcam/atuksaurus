import { DIET_META } from '../../data/dinosaurs'

export default function DinoCard({ dino, isSelected, onToggle, disabled }) {
  const diet = DIET_META[dino.diet]

  return (
    <button
      onClick={() => onToggle(dino.id)}
      disabled={disabled}
      title={disabled ? 'Max 8 dinosaurs selected' : undefined}
      className={[
        'w-full text-left px-3 py-2.5 rounded-lg border transition-all duration-150',
        isSelected
          ? 'dino-card-selected'
          : disabled
          ? 'border-stone-800 opacity-35 cursor-not-allowed bg-transparent'
          : 'border-stone-700/60 hover:border-stone-500 hover:bg-stone-800/50',
      ].join(' ')}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-sm text-stone-100 truncate leading-tight">
            {dino.name}
          </p>
          <p className="text-xs text-stone-500 italic truncate mt-0.5">
            {dino.scientificName}
          </p>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0 mt-0.5">
          {dino.isJurassicWorld && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-violet-900/80 text-violet-300 border border-violet-700/50">
              JW
            </span>
          )}
          <span
            className="text-[10px] font-bold px-1.5 py-0.5 rounded"
            style={{ color: diet.color, backgroundColor: diet.bg + 'cc' }}
          >
            {diet.short}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-1.5">
        <span className="text-xs text-stone-400 font-mono">{dino.heightM}m</span>
        <span className="text-stone-700">·</span>
        <span className="text-xs text-stone-500 truncate">{dino.period}</span>
      </div>
    </button>
  )
}
