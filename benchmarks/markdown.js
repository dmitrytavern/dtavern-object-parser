const fs = require('fs')
const path = require('path')

const pathDir = path.join(__dirname, '../docs/.autogenerate')
const pathFile = path.join(pathDir, 'benchmarks-results.md')

globalThis.markdown = function bootstrap() {
  const benchmarks = run()
  let markdown = '## Results for Node.js\n'

  for (const key in benchmarks.result)
    markdown += printGroup(benchmarks.result[key]) + '\n'

  if (!fs.existsSync(pathDir)) {
    fs.mkdirSync(pathDir)
  }

  fs.writeFileSync(pathFile, markdown, { encoding: 'utf-8' })

  console.log('Result is written along the path ' + pathFile)
}

function printGroup(groupResult) {
  const iterations = groupResult.iterations
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')

  const badge = `<Badge type="info" text="${iterations} repeats" />`
  let markdown = `### ${groupResult.name} ${badge}\n`

  let min = Number.MAX_SAFE_INTEGER
  let max = 0

  for (const testResult of groupResult.results) {
    min = min > testResult.result ? testResult.result : min
    max = max < testResult.result ? testResult.result : max
  }

  for (const testResult of groupResult.results) {
    if (testResult.pass) {
      const resultPersent = (testResult.result / max) * 100
      let badgeType =
        resultPersent > 75 ? 'tip' : resultPersent > 40 ? 'warning' : 'danger'

      markdown += `- ✓ ${testResult.name} <Badge type="${badgeType}" text="${testResult.result} iterations per 1 ms" />\n`
    } else {
      markdown += `- ✕ ${testResult.name} <Badge type="warning" text="skipped" />\n`
    }
  }

  return markdown
}
