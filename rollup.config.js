import fs from 'fs'
import path from 'path'
import typescript from '@rollup/plugin-typescript'
import replace from '@rollup/plugin-replace'
import terser from '@rollup/plugin-terser'
import babel from '@rollup/plugin-babel'
import pkg from './package.json'

const NODE_ENV = process.env.NODE_ENV
const APP_FILENAME = 'index'
const APP_SRC_DIRNAME = 'src'
const APP_BUILD_DIRNAME = 'dist'
const APP_BUILD_FILENAME = 'object-parser'
const APP_BUILD_UMD_NAME = 'objectParser'

const input = path.join(APP_SRC_DIRNAME, `${APP_FILENAME}.ts`)
const output = path.join(APP_BUILD_DIRNAME, `${APP_BUILD_FILENAME}`)

const splitedVersion = pkg.version.split('.')

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
	plugins: [
		typescript(),
		replace({
			preventAssignment: true,
			'process.env.VERSION_MAJOR': splitedVersion[0],
			'process.env.VERSION_MINOR': splitedVersion[1],
			'process.env.VERSION_PATCH': splitedVersion[2],
		}),
	],
}

if (NODE_ENV === 'production') {
	const removeComments = terser({
		compress: false,
		mangle: false,
		format: {
			beautify: true,
			comments: false,
		},
	})

	rollupConfig.output[0].plugins = [removeComments]
	rollupConfig.output.push(
		...[
			{
				file: `${output}.esm.js`,
				format: 'esm',
				exports: 'named',
				plugins: [removeComments],
			},
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
