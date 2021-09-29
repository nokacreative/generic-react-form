import peerDepsExternal from 'rollup-plugin-peer-deps-external'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from 'rollup-plugin-typescript2'
import sass from 'rollup-plugin-sass'
import json from '@rollup/plugin-json'
import autoprefixer from 'autoprefixer'
import postcss from 'postcss'
import css from 'rollup-plugin-import-css'

const packageJson = require('./package.json')

export default {
  input: 'src/index.ts',
  output: [
    {
      file: packageJson.main,
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: packageJson.module,
      format: 'esm',
      sourcemap: true,
    },
  ],
  plugins: [
    peerDepsExternal(),
    resolve(),
    commonjs(),
    typescript({ useTsconfigDeclarationDir: true }),
    sass({
      output: 'dist/bundle.css',
      processor: (css) =>
        postcss({
          extensions: ['scss'],
          plugins: [autoprefixer],
        })
          .process(css)
          .then((result) => result.css),
    }),
    css({ minify: true }),
    json(),
  ],
  external: ['react', 'react-dom'],
}
