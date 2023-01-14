// Release script helper
// (Based on the same file in the Vue.js repository)
//
// This script has been specifically designed to make it
// easier to create new releases. It automatically:
// - Build and test code
// - Updates the package version
// - Creates a release commit and tag
// - Push release tag and commits to remote repository
//
// At the moment, the script pushes the code only to
// the remote repository and does not affect the 'npm registry'.

const fs = require('fs')
const path = require('path')
const enquirer = require('enquirer')
const {
  run,
  step,
  dryRun,
  parseArgs,
  getPackageRoot,
  getPackageData,
  parseCurrentVersion,
  validatePackageVersion,
  getPackageversionSuggestions,
} = require('./shared')

const args = parseArgs()

const isDryRun = args.dry

const runIfNotDry = isDryRun ? dryRun : run

async function main() {
  const targetVersion = await getNewPackageVersion()

  const comfirmVersion = await comfirmNewPackageVersion(targetVersion)

  if (!comfirmVersion) return

  step('\nUpdating package version...')
  await updatePackage(targetVersion)

  step('\nUpdating lockfile...')
  await run(`npm`, ['install'])

  step('\nBuilding package...')
  await run('npm', ['run', 'build'])

  step('\nRunning tests...')
  await run('npm', ['run', 'test'])

  const { stdout } = await run('git', ['diff'], { stdio: 'pipe' })
  if (stdout) {
    step('\nCommitting changes...')
    await runIfNotDry('git', ['add', '-A'])
    await runIfNotDry('git', ['commit', '-m', `release: v${targetVersion}`])
  } else {
    console.log('No changes to commit.')
  }

  step(`\nSetting 'v${targetVersion}' tag...`)
  await runIfNotDry('git', ['tag', `v${targetVersion}`])

  step('\nPushing new tag to GitHub...')
  await runIfNotDry('git', ['push', 'origin', `refs/tags/v${targetVersion}`])

  step('\nPushing master to GitHub...')
  await runIfNotDry('git', ['push', 'origin', 'master'])

  if (isDryRun) {
    console.log(`\nDry run finished - run git diff to see package changes.`)
  }

  console.log('\nRelease successful finished.')
}

/**
 * Calls a console dialog interface where the user selects
 * a new package version.
 *
 * To do this, the interface recommends new versions or
 * suggests writing a custom one.
 *
 * @returns New package version.
 * @throws If new package version is invalid.
 */
async function getNewPackageVersion() {
  const currentVersion = parseCurrentVersion()
  let targetVersion = null

  const { release } = await enquirer.prompt({
    type: 'select',
    name: 'release',
    message: 'Select release type',
    choices: getPackageversionSuggestions(),
  })

  if (release === 'custom') {
    const { version } = await enquirer.prompt({
      type: 'input',
      name: 'version',
      message: 'Input custom version',
      initial: currentVersion,
    })

    targetVersion = version
  }

  if (release !== 'custom') {
    targetVersion = release.match(/\((.*)\)/)[1]
  }

  if (!validatePackageVersion(targetVersion)) {
    throw new Error(`invalid target version: ${targetVersion}`)
  }

  return targetVersion
}

/**
 * Calls a console dialog interface where it prompts
 * the user to confirm his choice.
 *
 * @param {String} targetVersion - version to comfirm.
 * @returns {Boolean}
 */
async function comfirmNewPackageVersion(targetVersion) {
  const { yes } = await enquirer.prompt({
    type: 'confirm',
    name: 'yes',
    message: `Releasing v${targetVersion}. Confirm?`,
  })

  return yes
}

/**
 * Update version property in the package.json
 *
 * @param {String} targetVersion - version to update.
 */
async function updatePackage(targetVersion) {
  const packageRoot = getPackageRoot()
  const packageData = getPackageData(packageRoot)
  const packagePath = path.join(packageRoot, 'package.json')

  packageData.version = targetVersion

  fs.writeFileSync(packagePath, JSON.stringify(packageData, null, 2) + '\n')
}

main()
