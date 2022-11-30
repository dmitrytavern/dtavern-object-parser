import 'dotenv/config'
import path from 'path'
import typescript from '@rollup/plugin-typescript'
import babel from '@rollup/plugin-babel'
import alias from '@rollup/plugin-alias'
import del from 'rollup-plugin-delete'

const {
	NODE_ENV,
	APP_FILENAME,
	APP_SRC_DIRNAME,
	APP_BUILD_DIRNAME,
	APP_BUILD_FILENAME,
	APP_BUILD_UMD_NAME,
} = process.env

const input = path.join(APP_SRC_DIRNAME, `${APP_FILENAME}.ts`)
const output = path.join(APP_BUILD_DIRNAME, `${APP_BUILD_FILENAME}`)

const rollupConfig = {
	input,
	output: [{ file: `${output}.js`, format: 'cjs', exports: 'named' }],
	plugins: [
		del({ targets: `${APP_BUILD_DIRNAME}/*` }),
		alias({
			entries: [
				{
					find: '@types',
					replacement: path.resolve(__dirname, 'types/index'),
				},
				{
					find: '@utilities',
					replacement: path.resolve(__dirname, 'src/utils.ts'),
				},
			],
		}),
		typescript(),
	],
}

if (NODE_ENV === 'production') {
	rollupConfig.output.push(
		...[
			{ file: `${output}.esm.js`, format: 'esm', exports: 'named' },
			{
				file: `${output}.umd.js`,
				format: 'umd',
				exports: 'named',
				name: APP_BUILD_UMD_NAME,
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
