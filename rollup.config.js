import peerDepsExternal from 'rollup-plugin-peer-deps-external'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from 'rollup-plugin-typescript2'
import scss from 'rollup-plugin-scss'
import json from '@rollup/plugin-json'
import autoprefixer from 'autoprefixer'
import postcss from 'postcss'

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
    scss({
      failOnError: true,
      outputStyle: 'compressed',
      prefix: `@use '../../../assets/mixins' as *;`,
      processor: (css) =>
        postcss({
          extensions: ['scss'],
          plugins: [autoprefixer],
        })
          .process(css)
          .then((result) => result.css),
    }),
    json(),
  ],
  external: ['react', 'react-dom'],
}
