const { exec, execSync, spawn, spawnSync } = require('child_process')
const fs = require('fs')
const path = require('path')
const { exit } = require('process')

// Variables
const platform = 'linux/arm/v7'
const name = 'sqooid/big-two-multi'
const versionsFilename = 'versions.txt'

// The rest
const versionsFilepath = path.join(__dirname, versionsFilename)
const versionsArrayString = fs.readFileSync(versionsFilepath)
const versions = JSON.parse(versionsArrayString)

let majorVersion
let minorVersion
if (process.argv.length > 2) {
  majorVersion = Number(process.argv[process.argv.length - 1])
} else {
  majorVersion = versions.length - 1
}

if (majorVersion > versions.length) {
  console.error('Error: skipped major version', versions.length)
  process.exit(1)
} else if (majorVersion === versions.length) {
  minorVersion = 0
  versions.push(minorVersion)
} else {
  minorVersion = ++versions[majorVersion]
}

const imageName = `${name}:${majorVersion}.${minorVersion}`
const imageNameLatest = `${name}:latest`

const build = spawnSync(
  'docker',
  ['build', '--platform', platform, '-t', imageName, '.'],
  {
    stdio: 'inherit',
  },
)

if (build.status !== 0) {
  console.error('Error: image build failed')
  exit(1)
}

if (majorVersion === versions.length - 1) {
  const tag = spawnSync('docker', ['tag', imageName, `${name}:latest`], {
    stdio: 'inherit',
  })
  if (tag.status !== 0) {
    console.error('Error: image tag latest failed')
    exit(1)
  }
}

fs.writeFileSync(versionsFilepath, JSON.stringify(versions))

const push = spawnSync('docker', ['push', '--all-tags', name], {
  stdio: 'inherit',
})
