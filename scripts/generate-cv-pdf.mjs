// Renders the prerendered /about/print/ page to a PDF, so the downloadable CV is generated from
// content/pages/cv.yml on every build and can never disagree with the page.
//
// Runs after `nuxt generate` (see the `generate` script in package.json). Set SKIP_CV_PDF=1 to
// build without it.

import { spawnSync } from 'node:child_process'
import { readFile, stat } from 'node:fs/promises'
import { extname, join } from 'node:path'
import { chromium } from 'playwright'

// `nuxt generate` writes to .output/public and links dist to it locally; Cloudflare's
// cloudflare-pages-static preset writes to dist directly. dist is what gets deployed either way.
const OUTPUT_DIR = 'dist'
const PAGE_PATH = '/about/print/'
const PDF_FILE = 'andy-evans-cv.pdf'

// Served under the real origin so relative links in the page (posts, /about) become working
// andyevans.dev links in the PDF, rather than pointing at a local server.
const ORIGIN = 'https://andyevans.dev'

const CONTENT_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
}

if (process.env.SKIP_CV_PDF) {
  console.log('[cv-pdf] SKIP_CV_PDF is set, not generating the CV PDF')
  process.exit(0)
}

async function readBuiltFile(pathname) {
  let path = join(OUTPUT_DIR, decodeURIComponent(pathname))
  try {
    if ((await stat(path)).isDirectory()) path = join(path, 'index.html')
    return { body: await readFile(path), contentType: CONTENT_TYPES[extname(path)] ?? 'application/octet-stream' }
  } catch {
    return null
  }
}

async function launchChromium() {
  try {
    return await chromium.launch()
  } catch (error) {
    // Fresh CI machines won't have the browser yet. Fetch it once and try again. Headless
    // rendering only needs the headless shell, not the full browser and FFmpeg as well.
    if (!/Executable doesn't exist|playwright install/i.test(String(error))) throw error
    console.log('[cv-pdf] Chromium not installed, downloading it')
    const install = spawnSync('npx', ['playwright', 'install', 'chromium', '--only-shell'], { stdio: 'inherit', shell: true })
    if (install.status !== 0) throw new Error('playwright install chromium failed')
    return await chromium.launch()
  }
}

const browser = await launchChromium()
try {
  // The page is fully prerendered, so there's nothing for scripts to add, and hydration would
  // only try to reach the network.
  const context = await browser.newContext({ javaScriptEnabled: false })

  await context.route('**/*', async (route) => {
    const url = new URL(route.request().url())
    if (url.origin !== ORIGIN) return route.abort() // analytics and anything else external
    const file = await readBuiltFile(url.pathname)
    if (!file) return route.fulfill({ status: 404, body: '' })
    return route.fulfill({ status: 200, body: file.body, contentType: file.contentType })
  })

  const page = await context.newPage()
  const response = await page.goto(`${ORIGIN}${PAGE_PATH}`, { waitUntil: 'networkidle' })
  if (!response?.ok()) throw new Error(`${PAGE_PATH} was not in ${OUTPUT_DIR}. Is it in nitro.prerender.routes, and is ${OUTPUT_DIR} the build output?`)

  const footer = `
    <div style="width: 100%; font-size: 8px; color: #6b7280; text-align: center; font-family: sans-serif;">
      Andy Evans &middot; andyevans.dev/about &middot; <span class="pageNumber"></span> of <span class="totalPages"></span>
    </div>`

  await page.pdf({
    path: join(OUTPUT_DIR, PDF_FILE),
    format: 'A4',
    printBackground: true,
    margin: { top: '14mm', bottom: '16mm', left: '14mm', right: '14mm' },
    displayHeaderFooter: true,
    headerTemplate: '<span></span>',
    footerTemplate: footer,
  })

  console.log(`[cv-pdf] Wrote ${join(OUTPUT_DIR, PDF_FILE)}`)
} finally {
  await browser.close()
}
