import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import dts from 'rollup-plugin-dts';

export default [
  // IIFE bundle for CDN (minified)
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/blockroll.min.js',
      format: 'iife',
      name: 'BlockRoll',
      sourcemap: true,
    },
    plugins: [
      resolve({
        browser: true,
        preferBuiltins: false,
      }),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json',
        declaration: false,
      }),
      terser({
        compress: {
          drop_console: false, // Keep console.log for debugging
        },
        format: {
          comments: false,
        },
      }),
    ],
  },
  // TypeScript definitions
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.d.ts',
      format: 'es',
    },
    plugins: [dts()],
  },
];

