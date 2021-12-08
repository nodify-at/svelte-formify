import svelte from "rollup-plugin-svelte";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

const production = !process.env.ROLLUP_WATCH;

export default {
    input: 'src/index.ts',
    output: {
        sourcemap: true,
        format: 'iife',
        name: 'app',
        file: 'public/build/bundle.js'
    },
    plugins: [
        svelte({
            compilerOptions: {
                // enable run-time checks when not in production
                dev: !production
            }
        }),
        // If you have external dependencies installed from
        // npm, you'll most likely need these plugins. In
        // some cases you'll need additional configuration -
        // consult the documentation for details:
        // https://github.com/rollup/plugins/tree/master/packages/commonjs
        resolve({
            browser: true,
            dedupe: ['svelte']
        }),
        commonjs()
    ]
};