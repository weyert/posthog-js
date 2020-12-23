import * as path from 'path'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from 'rollup-plugin-typescript2'
import json from '@rollup/plugin-json'
import packageJson from './package.json'

const plugins = [
    json(),
    resolve({
        preferBuiltins: false,
        mainFields: ['module', 'main', 'jsnext:main', 'browser'],
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
    }),
    typescript({
        useTsconfigDeclarationDir: true,
    }),
    commonjs(),
]

/**
 * Configuration for the ESM build
 */
const buildEsm = {
    external: ['posthog-js', 'react', 'react-dom'],
    input: [
        // Split modules so they can be tree-shaken
        'src/index.ts',
    ],
    output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name]-deps.js',
        dir: path.dirname(packageJson.module),
        format: 'esm',
    },
    plugins,
}

/**
 * Configuration for the UMD build
 */
const buildUmd = {
    external: ['posthog-js', 'react', 'react-dom'],
    input: 'src/index.ts',
    output: {
        file: packageJson.main,
        name: 'MswWebarchiveExtension',
        format: 'umd',
        esModule: false,
        globals: {
            react: 'React',
            'react-dom': 'ReactDOM',
        },
    },
    plugins,
}

export default [buildEsm, buildUmd]
