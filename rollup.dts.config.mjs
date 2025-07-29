import dts from 'rollup-plugin-dts';

export default {
  input: 'dist/index.d.ts',
  output: {
    file: 'dist/bundled.d.ts',
    format: 'es'
  },
  plugins: [dts()],
  external: ['luxon']
};