/**
 * Core environment.
 */
const isBrowser = typeof window !== 'undefined'
const globalThis = isBrowser ? window : global
globalThis.globalThis = globalThis

/**
 *  Core variables.
 */
const groupContext = {}
const packages = []
const groups = []
const tests = []

/**
 * Temp core variables.
 */
let currectGroup = null
let currectResult = null

/**
 * Creates group of tests.
 *
 * @param {String} name Name of this group.
 * @param {Function} initFn Function for tests init.
 * @param {Number} iterationsCount Number of repetitions of tests in this group.
 * @public
 */
globalThis.createGroup = function (name, initFn, iterations = 10000) {
	const newGroup = { name, iterations }

	currectGroup = newGroup

	initFn(groupContext)

	currectGroup = null

	groups.push(newGroup)

	log(`${name} \x1b[32m(group loaded)\x1b[0m`)
}

/**
 * Creates test.
 *
 * @param {String} name Name of this test.
 * @param {Function} fn Function with code to test.
 * @throws If this function is called outside the group.
 * @public
 */
globalThis.createTest = function (name, callback) {
	if (!currectGroup) throw 'use createTest only in group!'

	tests.push({
		name,
		callback,
		group: currectGroup,
	})
}

/**
 * Loads the package to core.
 *
 * @param {Object} package Settings of package.
 * @public
 */
globalThis.loadPackage = function (package) {
	const settings = {
		name: package.name,
		contextName: package.contextName,
		modulePath: package.modulePath,
	}

	try {
		const module = isBrowser ? package.module : require(package.modulePath)
		const version = package.version(module)

		if (typeof package.config === 'function') {
			package.config(module)
		}

		packages.push({
			...settings,
			module,
			version,
			loaded: true,
		})

		groupContext[settings.contextName] = module

		log(`${settings.name} \x1b[32m(package loaded)\x1b[0m`)
	} catch (e) {
		packages.push({
			...settings,
			module: undefined,
			version: 'v?.?.?',
			loaded: false,
		})

		log(`${settings.name} \x1b[31m(package skipped)\x1b[0m`)
	}
}

/**
 * Runs benchmarks.
 *
 * @param {Number} iterationsCount Number of repetitions of all benchmarks.
 * @returns The object with benchmark results.
 * @public
 */
globalThis.run = function (iterationsCount = 4) {
	currectResult = []

	log('Benchmarks started...')

	const time = benchmarkTime(() => {
		for (let count = 0; count < iterationsCount; count++) {
			const time = benchmarkTime(runTests)

			log(`Iteration ${count + 1} ended. (${time / 1000}s)`)
		}
	})

	log('Benchmarks ended.')

	let successTests = 0
	let skippedTests = 0

	for (const groupResult of currectResult) {
		for (const testResult of groupResult.results) {
			testResult.pass ? successTests++ : skippedTests++
		}
	}

	return {
		time,
		result: currectResult,
		packages,
		loadedTests: tests.length,
		successTests,
		skippedTests,
	}
}

/**
 * Runs all test in order of addition.
 * @internal
 */
function runTests() {
	const throws = []
	const iterations = []
	const results = []

	for (const key in tests) {
		iterations[key] = tests[key].group.iterations
		results[key] = []
		throws[key] = false
	}

	for (let i = 0; i < tests.length; i++) {
		if (iterations[i] > 0) {
			iterationsExists = true
			try {
				const result = benchmarkTime(tests[i].callback)
				iterations[i]--
				results[i].push(result)
			} catch (e) {
				iterations[i] = 0
				results[i] = []
				throws[i] = true
			}
		}

		if (+i === +(tests.length - 1)) {
			if (!iterationsExists) break
			iterationsExists = false
			i = -1
		}
	}

	for (const key in tests) {
		const test = tests[key]
		const testTrown = throws[key]
		let testResult = 0

		if (!testTrown) {
			let sum = 0
			for (const num of results[key]) sum += num
			testResult = tests[key].group.iterations / sum
		}

		saveResult(test, testResult, testTrown)
	}
}

/**
 * Save the test time to currectResults object. If the test thrown is `true`,
 * then mark the test result object as not passed.
 *
 * @param {Object} test Test object.
 * @param {Number} testTime Test time.
 * @param {Boolean} testThowns Test throwns.
 * @internal
 */
function saveResult(test, testTime, testThowns) {
	const testResult = getTestResult(test.group, test)

	if (testThowns) {
		testResult.pass = false
		testResult.result = 0
	} else {
		testResult.pass = true
		testResult.results.push(testTime)
		testResult.result = Math.round(
			testResult.results.reduce((val, acc) => acc + val) /
				testResult.results.length
		)
	}
}

/**
 * Returns the object with test results from group results.
 *
 * @param {Object} group Group of tests.
 * @param {Object} test Test object.
 * @internal
 */
function getTestResult(group, test) {
	const groupResult = getGroupResult(group)

	const testExists = groupResult.results.find((t) => t.name === test.name)

	let testResultObject = testExists
		? testExists
		: {
				name: test.name,
				pass: true,
				result: 0,
				results: [],
		  }

	if (!testExists) {
		groupResult.results.push(testResultObject)
	}

	return testResultObject
}

/**
 * Returns the object with group results from currectResult.
 *
 * @param {Object} group Group of tests.
 * @internal
 */
function getGroupResult(group) {
	const groupExists = currectResult.find((g) => g.name === group.name)

	let groupResultObject = groupExists
		? groupExists
		: {
				name: group.name,
				iterations: group.iterations,
				results: [],
		  }

	if (!groupExists) {
		currectResult.push(groupResultObject)
	}

	return groupResultObject
}

/**
 * Returns time diffs between after and before the callback.
 *
 * @param {Function} callback Function to benchmark.
 * @returns {Number} Time diffs between after and befroe in ms.
 * @internal
 */
function benchmarkTime(callback) {
	const start = new Date().getTime()
	callback()
	const end = new Date().getTime()
	return end - start
}

/**
 * Logger
 * @internal
 */
function log(str) {
	console.log('\x1b[36m[log]\x1b[0m: %s', str)
}
