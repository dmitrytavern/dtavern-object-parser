const fs = require('fs')
const path = require('path')
const execa = require('execa')
const semver = require('semver')
const minimist = require('minimist')
const pkgJson = require('../package.json')

/**
 * Returns pretty arguments.
 *
 * @returns {Object} - pretty process argv.
 */
module.exports.parseArgs = () => minimist(process.argv.slice(2))

/**
 * Returns currect package version.
 *
 * @returns {String} - current package version
 */
module.exports.parseCurrentVersion = () => pkgJson.version

/**
 * Execute the command in terminal.
 *
 * @param {String} bin - bin.
 * @param {Array} args - bin arguments.
 * @param {Object} opts - options for execa.
 * @returns
 */
module.exports.run = (bin, args, opts = {}) =>
  execa(bin, args, { stdio: 'inherit', ...opts })

/**
 * Output the command for execution.
 *
 * @param {String} bin - bin.
 * @param {Array} args - bin arguments.
 * @param {Object} opts - options for execa.
 * @returns
 */
module.exports.dryRun = (bin, args, opts = {}) =>
  console.log(`[dryrun] ${bin} ${args.join(' ')}`, opts)

/**
 * Alias for console.log.
 *
 * @param {String} msg - message.
 * @returns
 */
module.exports.step = (msg) => console.log(msg)

/**
 * Returns package.json content.
 *
 * @param {String} packagePath
 * @returns
 */
module.exports.getPackageData = (packageRoot) => {
  const pkgPath = path.resolve(packageRoot, 'package.json')
  return JSON.parse(fs.readFileSync(pkgPath, 'utf-8'))
}

/**
 * Returns full path for a package.json directory.
 *
 * @param {String} package - package name.
 * @returns {String} full path for a package directory.
 */
module.exports.getPackageRoot = (package = '.') =>
  package === '.'
    ? path.resolve(__dirname, '../')
    : path.resolve(__dirname, '../packages/' + package)

/**
 * Validate package version.
 *
 * @param {String} - package version.
 * @returns {Boolean} - an array of package verstions
 */
module.exports.validatePackageVersion = (version) => semver.valid(version)

/**
 * Returns suggestions of package version.
 *
 * @returns {Array} - an array of package verstions
 */
module.exports.getPackageversionSuggestions = () =>
  ['patch', 'minor', 'major']
    .map((i) => `${i} (${semver.inc(pkgJson.version, i)})`)
    .concat(['custom'])
