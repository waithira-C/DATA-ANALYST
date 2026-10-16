// Copies the research catalog into the app bundle. Runs before dev/build.
import { copyFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const src = resolve(here, '../../research/catalog/resources.json')
const dest = resolve(here, '../src/data/resources.json')
if (existsSync(src)) {
  copyFileSync(src, dest)
  console.log('[sync-data] resources.json copied from research/catalog')
} else {
  console.log('[sync-data] research catalog not found; keeping existing src/data/resources.json')
}
