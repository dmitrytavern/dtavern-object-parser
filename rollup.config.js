import fs from 'fs'
import path from 'path'
import typescript from '@rollup/plugin-typescript'
import terser from '@rollup/plugin-terser'
import babel from '@rollup/plugin-babel'

const NODE_ENV = process.env.NODE_ENV
const APP_FILENAME = 'index'
const APP_SRC_DIRNAME = 'src'
const APP_BUILD_DIRNAME = 'dist'
const APP_BUILD_FILENAME = 'object-parser'
const APP_BUILD_UMD_NAME = 'objectParser'

const input = path.join(APP_SRC_DIRNAME, `${APP_FILENAME}.ts`)
const output = path.join(APP_BUILD_DIRNAME, `${APP_BUILD_FILENAME}`)

if (fs.existsSync(APP_BUILD_DIRNAME)) {
	fs.rmSync(APP_BUILD_DIRNAME, { recursive: true, force: true })
}

const rollupConfig = {
	input,
	output: [
		{
			file: `${output}.js`,
			format: 'umd',
			exports: 'named',
			name: APP_BUILD_UMD_NAME,
		},
	],
	plugins: [typescript()],
}

if (NODE_ENV === 'production') {
	rollupConfig.output.push(
		...[
			{ file: `${output}.esm.js`, format: 'esm', exports: 'named' },
			{
				file: `${output}.min.js`,
				format: 'umd',
				exports: 'named',
				name: APP_BUILD_UMD_NAME,
				plugins: [terser({ compress: { unsafe_arrows: true, passes: 2 } })],
			},
		]
	)

	rollupConfig.plugins.push(
		babel({
			babelHelpers: 'bundled',
			exclude: 'node_modules/**',
		})
	)
}

export default rollupConfig
