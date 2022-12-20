const packageRoot = require('../package.json')
const packageBenchmarks = require('./package.json')

// Load global scripts
require('./core')

// Load packages
loadPackage('objectParser', 'v' + packageRoot.version, '../dist/object-parser')
loadPackage(
	'validateParser',
	packageBenchmarks.dependencies['validate.js'].replace('^', 'v'),
	'validate.js'
)

// Load benchmark tests
require('./groups/existance')

const RUN_COUNT = 4

function bootstrap() {
	const { time, result, totalGroups, totalTests, packages } = run(RUN_COUNT)

	console.log('\x1b[1mResult\x1b[0m:')
	for (const key in result) {
		const groupResult = result[key]

		console.log(
			'  \x1b[1mGroup\x1b[0m: %s \x1b[36m(%d repeats)\x1b[0m',
			groupResult.groupName,
			groupResult.groupRepeats
		)

		let min = Number.MAX_SAFE_INTEGER
		let max = 0

		for (const testResult of groupResult.groupResults) {
			min = min > testResult.testResult ? testResult.testResult : min
			max = max < testResult.testResult ? testResult.testResult : max
		}

		for (const testResult of groupResult.groupResults) {
			const resultPersent = (testResult.testResult / max) * 100
			let color = resultPersent > 75 ? '32' : resultPersent > 40 ? '33' : '31'

			console.log(
				'    Test: %s \x1b[' + color + 'm(%d iterations per 1 ms)\x1b[0m',
				testResult.testName,
				testResult.testResult
			)
		}

		console.log('') // \n
	}

	console.log('\x1b[1mTime:\x1b[0m %ss', time)
	console.log('\x1b[1mTotal groups:\x1b[0m %s', totalGroups)
	console.log('\x1b[1mTotal tests:\x1b[0m %s', totalTests)
	console.log('\x1b[1mPackages:\x1b[0m %s', packages.join(', '))
}

bootstrap()
