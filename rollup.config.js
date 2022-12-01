import path from 'path'
import typescript from '@rollup/plugin-typescript'
import terser from '@rollup/plugin-terser';
import babel from '@rollup/plugin-babel'
import del from 'rollup-plugin-delete'

const NODE_ENV = process.env.NODE_ENV
const APP_FILENAME = 'index'
const APP_SRC_DIRNAME = 'src'
const APP_BUILD_DIRNAME = 'dist'
const APP_BUILD_FILENAME = 'object-parser'
const APP_BUILD_UMD_NAME = 'objectParser'

const input = path.join(APP_SRC_DIRNAME, `${APP_FILENAME}.ts`)
const output = path.join(APP_BUILD_DIRNAME, `${APP_BUILD_FILENAME}`)

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
	plugins: [del({ targets: `${APP_BUILD_DIRNAME}/*` }), typescript()],
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
				plugins: [terser()]
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
