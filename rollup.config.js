/* eslint-env node */
import babel from "rollup-plugin-babel"
import resolve from "rollup-plugin-node-resolve"
import commonjs from "rollup-plugin-commonjs"
import { eslint } from "rollup-plugin-eslint"
import replace from "rollup-plugin-replace"
import { terser } from "rollup-plugin-terser"

// postcss & plugins
import postcss from "rollup-plugin-postcss"
import sugarss from "sugarss"
import stylelint from "stylelint"
import tailwind from "tailwindcss"
import atImport from "postcss-import"
import cssnext from "postcss-cssnext"
import nested from "postcss-nested"
import cssnano from "cssnano"

const postcssPlugins = [
  stylelint(),
  atImport(),
  tailwind("./tailwind.js"),
  nested(),
  cssnext({
    features: {
      nesting: false
    }
  }),
]

const rollupPlugins = [
  eslint(),
  postcss({
    plugins: postcssPlugins,
    parser: sugarss
  }),
  babel(),
  resolve({
    browser: true,
  }),
  commonjs(),
  replace({
    exclude: "node_modules/**",
    ENV: JSON.stringify(process.env.NODE_ENV || "development"),
  })
]

if (process.env.NODE_ENV === "production") {
  postcssPlugins.push(cssnano())
  rollupPlugins.push(terser())
}

const config = {
  input: "src/static/main.js",
  output: {
    file: "dist/static/main.min.js",
    sourcemap: "inline",
    format: "umd",
    name: "betterpron2",
  },
  watch: {
    exclude: [ "node_modules/**", "build/**" ]
  },
  plugins: rollupPlugins
}

export default config
