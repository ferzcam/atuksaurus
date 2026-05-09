import { useState } from 'react'
import { DINOSAURS } from './data/dinosaurs'
import DinoRoster from './components/roster/DinoRoster'
import ComparisonPlane from './components/comparison/ComparisonPlane'

const MAX_SELECTION = 8

export default function App() {
  const [selectedIds, setSelectedIds] = useState(new Set())

  const toggle = (id) => {
    setSelectedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else if (next.size < MAX_SELECTION) {
        next.add(id)
      }
      return next
    })
  }

  const clear = () => setSelectedIds(new Set())

  const selectedDinos = DINOSAURS.filter(d => selectedIds.has(d.id))
    .sort((a, b) => a.heightM - b.heightM)   // shortest → tallest left-to-right

  return (
    <div className="flex h-screen overflow-hidden bg-stone-950">
      {/* ── Sidebar ──────────────────────────────────────────── */}
      <aside className="w-72 flex-shrink-0 border-r border-stone-800 flex flex-col bg-stone-900/50">
        {/* App title */}
        <div className="px-5 py-4 border-b border-stone-800">
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-black tracking-tight text-amber-500">ATUK</span>
            <span className="text-xl font-black tracking-tight text-stone-300">SAURUS</span>
          </div>
          <p className="text-[11px] text-stone-600 mt-0.5 tracking-wide uppercase">
            Height Comparator
          </p>
        </div>

        <DinoRoster
          selected={selectedIds}
          onToggle={toggle}
          onClear={clear}
        />
      </aside>

      {/* ── Main ─────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="px-6 py-3 border-b border-stone-800 flex items-center gap-4 bg-stone-900/30">
          <span className="text-stone-400 text-sm">
            {selectedDinos.length === 0
              ? 'No dinosaurs selected'
              : `Comparing ${selectedDinos.length} dinosaur${selectedDinos.length > 1 ? 's' : ''}`}
          </span>
          {selectedDinos.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              {selectedDinos.map(d => (
                <button
                  key={d.id}
                  onClick={() => toggle(d.id)}
                  className="flex items-center gap-1 text-xs bg-stone-800 hover:bg-stone-700 text-stone-300 px-2 py-0.5 rounded-full transition-colors"
                  title={`Remove ${d.name}`}
                >
                  {d.name.split(' ')[0]}
                  <span className="text-stone-500 hover:text-stone-300 ml-0.5">×</span>
                </button>
              ))}
            </div>
          )}
        </header>

        {/* Comparison area */}
        <div className="flex-1 overflow-hidden p-5">
          <ComparisonPlane dinos={selectedDinos} />
        </div>
      </main>
    </div>
  )
}
