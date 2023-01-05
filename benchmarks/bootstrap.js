globalThis.bootstrap = function bootstrap() {
  const benchmarks = run()

  console.log('\x1b[1mBenchmarks:\x1b[0m')

  for (const key in benchmarks.result) {
    printGroup(benchmarks.result[key])
    console.log('')
  }

  printTime(benchmarks)
  printTests(benchmarks)
  printPackages(benchmarks)

  console.log('Exit.')
}

function printGroup(groupResult) {
  console.log(
    '  %s \x1b[36m(%d repeats)\x1b[0m',
    groupResult.name,
    groupResult.iterations
  )

  let min = Number.MAX_SAFE_INTEGER
  let max = 0

  for (const testResult of groupResult.results) {
    min = min > testResult.result ? testResult.result : min
    max = max < testResult.result ? testResult.result : max
  }

  for (const testResult of groupResult.results) {
    if (testResult.pass) {
      const resultPersent = (testResult.result / max) * 100
      let color = resultPersent > 75 ? '32' : resultPersent > 40 ? '33' : '31'

      console.log(
        `    \x1b[32m✓\x1b[0m %s \x1b[${color}m(%d iterations per 1 ms)\x1b[0m`,
        testResult.name,
        testResult.result
      )
    } else {
      console.log(
        `    \x1b[31m✕\x1b[0m %s \x1b[33m(skipped)\x1b[0m`,
        testResult.name
      )
    }
  }
}

function printTime({ time }) {
  console.log('\x1b[1mTime:\x1b[0m     %ss', time / 1000)
}

function printTests({ loadedTests, successTests, skippedTests }) {
  let string = `\x1b[1mTests:\x1b[0m    ${loadedTests} loaded`
  if (successTests > 0) string += `, \x1b[32m${successTests} success\x1b[0m`
  if (skippedTests > 0) string += `, \x1b[33m${skippedTests} skipped\x1b[0m`
  console.log(string)
}

function printPackages({ packages }) {
  let strings = []

  for (const package of packages) {
    strings.push(
      `${package.name} ${package.version} ${
        package.loaded
          ? '\x1b[32m(loaded)\x1b[0m'
          : '\x1b[31m(not loaded)\x1b[0m'
      }`
    )
  }

  console.log('\x1b[1mPackages:\x1b[0m %s', strings.join(', '))
}
