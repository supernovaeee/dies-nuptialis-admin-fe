import fs from 'node:fs'
import path from 'node:path'

const apiDir = path.join(process.cwd(), 'api')

function patchFile(filePath) {
  const source = fs.readFileSync(filePath, 'utf8')
  const patched = source.replace(
    /^(import\s+)\{([^}]+)\}(\s+from\s+['"]\.\.?\/)/gm,
    '$1type {$2}$3',
  )
  if (patched !== source) {
    fs.writeFileSync(filePath, patched, 'utf8')
  }
}

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      walk(full)
    } else if (entry.name.endsWith('.ts')) {
      patchFile(full)
    }
  }
}

walk(apiDir)
console.log('Patched api/ imports for verbatimModuleSyntax.')
