import { useState, useMemo } from 'react'
import { DINOSAURS, DIET_META } from '../../data/dinosaurs'
import DinoCard from './DinoCard'

const FILTERS = [
  { key: 'all',          label: 'All' },
  { key: 'carnivore',    label: 'Carnivore' },
  { key: 'herbivore',    label: 'Herbivore' },
  { key: 'piscivore',    label: 'Piscivore' },
  { key: 'omnivore',     label: 'Omnivore' },
  { key: 'jurassicWorld', label: 'JW' },
]

export default function DinoRoster({ selected, onToggle, onClear }) {
  const [query, setQuery]       = useState('')
  const [filter, setFilter]     = useState('all')

  const filtered = useMemo(() => {
    const q = query.toLowerCase()
    return DINOSAURS.filter(d => {
      if (q && !d.name.toLowerCase().includes(q) && !d.scientificName.toLowerCase().includes(q)) return false
      if (filter === 'jurassicWorld') return d.isJurassicWorld
      if (filter !== 'all' && d.diet !== filter) return false
      return true
    })
  }, [query, filter])

  const selectedCount = selected.size

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 border-b border-stone-800 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-stone-200 tracking-wide uppercase">
            Roster
          </h2>
          {selectedCount > 0 && (
            <button
              onClick={onClear}
              className="text-xs text-amber-500 hover:text-amber-400 transition-colors"
            >
              Clear {selectedCount}/8
            </button>
          )}
        </div>

        <div className="relative">
          <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-500 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search by name..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-stone-800 border border-stone-700 rounded-md text-sm text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-600 transition-colors"
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {FILTERS.map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={[
                'text-xs px-2.5 py-0.5 rounded-full transition-all duration-100 font-medium',
                filter === f.key
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-stone-800 text-stone-400 hover:bg-stone-700 hover:text-stone-200',
              ].join(' ')}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
        {filtered.map(dino => (
          <DinoCard
            key={dino.id}
            dino={dino}
            isSelected={selected.has(dino.id)}
            onToggle={onToggle}
            disabled={!selected.has(dino.id) && selectedCount >= 8}
          />
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-stone-600 text-sm">
            No dinosaurs match your search
          </div>
        )}
      </div>

      {/* Footer legend */}
      <div className="px-4 py-3 border-t border-stone-800 flex flex-wrap gap-x-3 gap-y-1">
        {Object.entries(DIET_META).map(([key, meta]) => (
          <span key={key} className="flex items-center gap-1.5 text-[11px] text-stone-500">
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: meta.color }} />
            {meta.label}
          </span>
        ))}
      </div>
    </div>
  )
}
