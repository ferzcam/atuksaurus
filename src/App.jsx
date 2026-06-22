import { useState } from 'react'
import { DINOSAURS } from './data/dinosaurs'
import DinoRoster from './components/roster/DinoRoster'
import ComparisonPlane from './components/comparison/ComparisonPlane'

const MAX_SELECTION = 8

const MODES = [
  { key: '2d',     label: '2D',     title: 'Silhouette comparison' },
  { key: '3d',     label: '3D',     title: 'Sketchfab 3D models (CC BY 4.0)' },
  { key: 'fossil', label: 'Fossil', title: 'Smithsonian scanned fossils (CC0)' },
]

export default function App() {
  const [selectedIds, setSelectedIds] = useState(new Set())
  const [mode, setMode]               = useState('2d')
  const [drawerOpen, setDrawerOpen]   = useState(false)

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
    setDrawerOpen(false)   // on mobile, close the roster drawer after a pick
  }

  const clear = () => setSelectedIds(new Set())

  const selectedDinos = DINOSAURS.filter(d => selectedIds.has(d.id))
    .sort((a, b) => a.heightM - b.heightM)   // shortest → tallest left-to-right

  return (
    <div className="flex h-screen h-[100dvh] overflow-hidden bg-stone-950">
      {/* ── Mobile drawer backdrop ───────────────────────────── */}
      {drawerOpen && (
        <div
          onClick={() => setDrawerOpen(false)}
          className="fixed inset-0 z-30 bg-black/60 md:hidden"
          aria-hidden="true"
        />
      )}

      {/* ── Sidebar (static on desktop, off-canvas drawer on mobile) ── */}
      <aside
        className={[
          'w-72 flex-shrink-0 border-r border-stone-800 flex flex-col bg-stone-900/95 md:bg-stone-900/50',
          'fixed inset-y-0 left-0 z-40 transition-transform duration-200 ease-out',
          'md:static md:z-auto md:translate-x-0',
          drawerOpen ? 'translate-x-0' : '-translate-x-full',
        ].join(' ')}
      >
        {/* App title */}
        <div className="px-5 py-4 border-b border-stone-800 flex items-start justify-between">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-black tracking-tight text-amber-500">ATUK</span>
              <span className="text-xl font-black tracking-tight text-stone-300">SAURUS</span>
            </div>
            <p className="text-[11px] text-stone-600 mt-0.5 tracking-wide uppercase">
              Height Comparator
            </p>
          </div>
          {/* Close (mobile only) */}
          <button
            onClick={() => setDrawerOpen(false)}
            className="md:hidden text-stone-500 hover:text-stone-200 transition-colors p-1 -mr-1"
            aria-label="Close roster"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
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
        <header className="px-4 md:px-6 py-3 border-b border-stone-800 flex items-center gap-3 md:gap-4 bg-stone-900/30 flex-wrap">
          {/* Hamburger (mobile only) */}
          <button
            onClick={() => setDrawerOpen(true)}
            className="md:hidden text-stone-300 hover:text-white transition-colors flex-shrink-0 -ml-1 p-1"
            aria-label="Open roster"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Mode switcher */}
          <div className="flex items-center gap-1 bg-stone-900 rounded-lg p-1 flex-shrink-0">
            {MODES.map(m => (
              <button
                key={m.key}
                onClick={() => setMode(m.key)}
                title={m.title}
                className={[
                  'text-xs px-3 py-1 rounded-md font-medium transition-all duration-150',
                  mode === m.key
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-stone-400 hover:text-stone-200',
                ].join(' ')}
              >
                {m.label}
              </button>
            ))}
          </div>

          <span className="text-stone-600 text-sm">
            {selectedDinos.length === 0
              ? 'No dinosaurs selected'
              : `Comparing ${selectedDinos.length} dinosaur${selectedDinos.length > 1 ? 's' : ''}`}
          </span>

          {selectedDinos.length > 0 && (
            <div className="flex items-center gap-2 flex-nowrap md:flex-wrap overflow-x-auto w-full md:w-auto -mx-4 px-4 md:mx-0 md:px-0 pb-0.5 md:pb-0">
              {selectedDinos.map(d => (
                <button
                  key={d.id}
                  onClick={() => toggle(d.id)}
                  className="flex items-center gap-1 text-xs bg-stone-800 hover:bg-stone-700 text-stone-300 px-2 py-0.5 rounded-full transition-colors flex-shrink-0"
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
        <div className="flex-1 overflow-hidden p-3 md:p-5">
          <ComparisonPlane dinos={selectedDinos} mode={mode} />
        </div>
      </main>
    </div>
  )
}
