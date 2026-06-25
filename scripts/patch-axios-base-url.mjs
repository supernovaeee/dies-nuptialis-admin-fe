import fs from 'node:fs'
import path from 'node:path'

const targetFile = path.join(process.cwd(), 'api', 'AxiosClient.ts')

if (!fs.existsSync(targetFile)) {
  console.error(`AxiosClient not found at: ${targetFile}`)
  process.exit(1)
}

const source = fs.readFileSync(targetFile, 'utf8')
const replacement = "public base_url: string = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';"

if (source.includes(replacement)) {
  console.log('AxiosClient base_url already patched.')
  process.exit(0)
}

const patched = source.replace(/public\s+base_url:\s*string\s*=\s*[^;]+;/, replacement)
fs.writeFileSync(targetFile, patched, 'utf8')
console.log('Patched AxiosClient base_url with VITE_API_URL fallback.')
