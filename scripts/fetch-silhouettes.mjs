/**
 * Queries PhyloPic v2 API for each dinosaur's silhouette.
 * Outputs the resolved PNG URL per dino ID.
 * Run: node scripts/fetch-silhouettes.mjs
 */

const BUILD = 538
const BASE  = 'https://api.phylopic.org'
const IMG   = 'https://images.phylopic.org'

// Map dino ID → scientific name to search (lowercase, as PhyloPic requires)
const LOOKUP = [
  { id: 'trex',             name: 'tyrannosaurus rex' },
  { id: 'spinosaurus',      name: 'spinosaurus aegyptiacus' },
  { id: 'brachiosaurus',    name: 'brachiosaurus altithorax' },
  { id: 'diplodocus',       name: 'diplodocus carnegii' },
  { id: 'triceratops',      name: 'triceratops horridus' },
  { id: 'stegosaurus',      name: 'stegosaurus stenops' },
  { id: 'velociraptor',     name: 'velociraptor mongoliensis' },
  { id: 'ankylosaurus',     name: 'ankylosaurus magniventris' },
  { id: 'parasaurolophus',  name: 'parasaurolophus walkeri' },
  { id: 'allosaurus',       name: 'allosaurus fragilis' },
  { id: 'gallimimus',       name: 'gallimimus bullatus' },
  { id: 'compsognathus',    name: 'compsognathus longipes' },
  { id: 'pteranodon',       name: 'pteranodon longiceps' },
  { id: 'dilophosaurus',    name: 'dilophosaurus wetherilli' },
  { id: 'carnotaurus',      name: 'carnotaurus sastrei' },
  { id: 'baryonyx',         name: 'baryonyx walkeri' },
  { id: 'iguanodon',        name: 'iguanodon bernissartensis' },
  { id: 'pachycephalosaurus', name: 'pachycephalosaurus wyomingensis' },
  { id: 'edmontosaurus',    name: 'edmontosaurus regalis' },
  { id: 'microraptor',      name: 'microraptor gui' },
  { id: 'archaeopteryx',    name: 'archaeopteryx lithographica' },
  // JW hybrids have no PhyloPic entries — skip
]

async function fetchJSON(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`${res.status} ${url}`)
  return res.json()
}

async function resolveImage(name) {
  // 1. Check if the images endpoint has entries for this name
  const imgSearch = await fetchJSON(
    `${BASE}/images?build=${BUILD}&filter_name=${encodeURIComponent(name)}`
  )
  if (imgSearch.totalItems > 0) {
    const page = await fetchJSON(
      `${BASE}/images?build=${BUILD}&filter_name=${encodeURIComponent(name)}&embed_items=true&page=0`
    )
    const items = page?._embedded?.items ?? []
    if (items.length > 0) {
      const imageHref = items[0]?._links?.self?.href ?? ''
      const imageUUID = imageHref.split('/images/')[1]?.split('?')[0]
      if (imageUUID) return imageUUID
    }
  }

  // 2. Fall back: find node UUID, then get its primary image
  const nodeSearch = await fetchJSON(
    `${BASE}/nodes?build=${BUILD}&filter_name=${encodeURIComponent(name)}`
  )
  if (nodeSearch.totalItems === 0) {
    // Try genus only
    const genus = name.split(' ')[0]
    const genusSearch = await fetchJSON(
      `${BASE}/nodes?build=${BUILD}&filter_name=${encodeURIComponent(genus)}`
    )
    if (genusSearch.totalItems === 0) return null

    const genusPage = await fetchJSON(
      `${BASE}/nodes?build=${BUILD}&filter_name=${encodeURIComponent(genus)}&embed_items=true&page=0`
    )
    const nodeHref = genusPage?._embedded?.items?.[0]?._links?.self?.href ?? ''
    const nodeUUID = nodeHref.split('/nodes/')[1]?.split('?')[0]
    if (!nodeUUID) return null
    return getImageForNode(nodeUUID)
  }

  const nodePage = await fetchJSON(
    `${BASE}/nodes?build=${BUILD}&filter_name=${encodeURIComponent(name)}&embed_items=true&page=0`
  )
  const nodeHref = nodePage?._embedded?.items?.[0]?._links?.self?.href ?? ''
  const nodeUUID = nodeHref.split('/nodes/')[1]?.split('?')[0]
  if (!nodeUUID) return null
  return getImageForNode(nodeUUID)
}

async function getImageForNode(nodeUUID) {
  const node = await fetchJSON(`${BASE}/nodes/${nodeUUID}?build=${BUILD}&embed_primaryImage=true`)
  const imageHref = node?._embedded?.primaryImage?._links?.self?.href ?? ''
  return imageHref.split('/images/')[1]?.split('?')[0] ?? null
}

async function getRasterUrl(imageUUID) {
  const meta = await fetchJSON(`${BASE}/images/${imageUUID}?build=${BUILD}`)
  const rasters = meta?._links?.rasterFiles ?? []
  // Prefer the 512-wide raster; fall back to the first available
  const r512 = rasters.find(r => r.sizes?.startsWith('512x'))
  const chosen = r512 ?? rasters[0]
  return chosen?.href ?? null
}

const results = {}

for (const { id, name } of LOOKUP) {
  process.stdout.write(`  ${id.padEnd(22)} `)
  try {
    const uuid = await resolveImage(name)
    if (uuid) {
      const url = await getRasterUrl(uuid)
      results[id] = url
      console.log(`OK  ${url?.split('/raster/')[1] ?? '?'}  (${uuid.slice(0,8)}…)`)
    } else {
      results[id] = null
      console.log('NOT FOUND')
    }
  } catch (e) {
    results[id] = null
    console.log(`ERR ${e.message}`)
  }
}

console.log('\n--- RESULTS (paste into dinosaurs.js) ---\n')
for (const [id, url] of Object.entries(results)) {
  console.log(`  '${id}': '${url ?? ''}',`)
}
