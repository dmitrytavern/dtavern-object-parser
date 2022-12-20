;(function (fn) {
	typeof window === 'undefined' ? fn(global) : fn(window)
})(function (globalObject) {
	const packages = {}
	const packageVersions = {}
	const groups = []
	let totalGroups = 0
	let totalTests = 0
	let currectGroup = null
	let currectResult = null

	globalObject.run = function (count) {
		currectResult = []

		logger.log('Benchmarks started....')
		const start = new Date().getTime()

		for (var i = 0; i < count; i++) {
			const start = new Date().getTime()
			for (const group of groups) runGroup(group)
			const end = new Date().getTime()

			logger.log(`Iteration ${i + 1} ended. (${(end - start) / 1000}s)`)
		}

		const end = new Date().getTime()
		logger.log('Benchmarks ended.')

		const currectPackages = []
		for (const package in packages) {
			currectPackages.push(package + ' ' + packageVersions[package])
		}

		return {
			time: (end - start) / 1000,
			result: currectResult,
			packages: currectPackages,
			totalGroups,
			totalTests,
		}
	}

	globalObject.createGroup = function (groupName, groupTests, count = 10000) {
		groups.push({
			groupName: groupName,
			groupTests: [],
			groupRepeatCount: count,
		})

		currectGroup = groups[groups.length - 1]

		groupTests(packages)

		currectGroup = null

		totalGroups++
		console.log(`\x1b[32m[group]\x1b[0m: "${groupName}" loaded.`)
	}

	globalObject.createTest = function (testName, testFn) {
		if (currectGroup) {
			currectGroup.groupTests.push({
				testFn: testFn,
				testName: testName,
			})

			totalTests++
		} else {
			throw 'Use create test only in group!'
		}
	}

	globalObject.loadPackage = function (
		packageName,
		packageVersion,
		packagePath
	) {
		try {
			packages[packageName] = require(packagePath)
			packageVersions[packageName] = packageVersion
			console.log(`\x1b[32m[package]\x1b[0m: "${packageName}" loaded.`)
		} catch (error) {
			console.log(`\x1b[91m[package]\x1b[0m: "${packageName}" skipped.`)
		}
	}

	globalObject.logger = {
		log: (str) => console.log('\x1b[36m[log]:\x1b[0m %s', str),
	}

	function runGroup(group) {
		for (const test of group.groupTests) {
			const testResult = runTest(test, group.groupRepeatCount)
			saveResult(group, test, Math.round(testResult))
		}
	}

	function runTest(test, count) {
		var start = new Date().getTime()
		for (var i = 1; i < count; i++) test.testFn()
		var end = new Date().getTime()
		var time = end - start
		return count / time
	}

	function saveResult(group, groupTest, testResult) {
		const groupExists = currectResult.find(
			(g) => g.groupName === group.groupName
		)
		let groupResultObject = groupExists
			? groupExists
			: {
					groupName: group.groupName,
					groupRepeats: group.groupRepeatCount,
					groupResults: [],
			  }

		if (!groupExists) {
			currectResult.push(groupResultObject)
		}

		const testExists = groupResultObject.groupResults.find(
			(t) => t.testName === groupTest.testName
		)
		let testResultObject = testExists
			? testExists
			: {
					testName: groupTest.testName,
					testResult: testResult,
					testResults: [testResult],
			  }

		if (!testExists) {
			groupResultObject.groupResults.push(testResultObject)
		} else {
			testResultObject.testResults.push(testResult)
			testResultObject.testResult = Math.round(
				testResultObject.testResults.reduce((val, acc) => acc + val) /
					testResultObject.testResults.length
			)
		}
	}

	logger.log(`Loading...`)
})
