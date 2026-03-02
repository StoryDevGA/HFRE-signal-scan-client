#!/usr/bin/env node

import { execFileSync } from 'node:child_process'
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const clientDist = path.join(rootDir, 'dist')
const prodDir = path.resolve(rootDir, '..', 'prod')
const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm'
const npmExecPath = process.env.npm_execpath
const nodeExecPath = process.execPath

console.log('Building client (npm run build)...')
try {
  let usedFallback = false

  if (npmExecPath) {
    try {
      execFileSync(nodeExecPath, [npmExecPath, 'run', 'build'], {
        cwd: rootDir,
        stdio: 'inherit',
      })
    } catch (error) {
      if (error?.code !== 'ENOENT') throw error
      usedFallback = true
    }
  } else {
    usedFallback = true
  }

  if (usedFallback) {
    execFileSync(npmCommand, ['run', 'build'], {
      cwd: rootDir,
      stdio: 'inherit',
    })
  }
} catch (error) {
  if (error?.message) {
    console.error(error.message)
  }
  console.error('Error: Build failed. Stopping copy to prod.')
  process.exit(error?.status ?? 1)
}

if (!existsSync(clientDist)) {
  console.error(`Error: ${clientDist} does not exist after build.`)
  process.exit(1)
}

mkdirSync(prodDir, { recursive: true })

for (const entry of readdirSync(prodDir)) {
  rmSync(path.join(prodDir, entry), { recursive: true, force: true })
}

for (const entry of readdirSync(clientDist)) {
  cpSync(path.join(clientDist, entry), path.join(prodDir, entry), {
    recursive: true,
    force: true,
  })
}

console.log('Success: Copied client/dist to prod/.')
