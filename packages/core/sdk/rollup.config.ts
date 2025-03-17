import resolve from "@rollup/plugin-node-resolve";
import {defineConfig} from "rollup";
import json from "@rollup/plugin-json";
import commonjs from "@rollup/plugin-commonjs";
import esbuild from 'rollup-plugin-esbuild'
import {readFileSync} from 'node:fs'

const pkg = JSON.parse(
    readFileSync(new URL('./package.json', import.meta.url)).toString(),
)
// import path from 'path'
const year = new Date().getFullYear();

const time = new Date().toLocaleString()
export default defineConfig({
    input: "./src/index.ts",
    output: [
        {
            format: "module",
            file: "lib/plum-render-api-three.js",
            // plugins: [
            // terser()
            // ]
            // banner
        },
        // {
        //     // globals: {
        //     //   "class-validator": "class-validator" // 指明 global.vue 即是外部依赖 vue
        //     // },
        //     format: "module",
        //     file: `lib/plum-render-api-three.${pkg.version}.min.js`,
        //     plugins: [
        //         // terser()
        //     ]
        // },
        // {
        //     format: 'umd',
        //     name: "plum-render-api-three",
        //     exports: "named",
        //     banner,
        //     file: "lib/plum-render-api-three.umd.js",
        // },
        // {
        //     format: "umd",
        //     name: "PlumRenderApiBabylon",
        //     exports: "named",
        //     file: `lib/plum-render-api-three.${pkg.version}.umd.min.js`,
        //     plugins: [
        //         // terser()
        //     ]
        // }
    ],
    external: ['three',"axios"],
    plugins: [
        commonjs(),
        json(),
         resolve({
            browser: true // 启用浏览器版本解析
        }),
        esbuild({
            // tsconfig: path.resolve(__dirname, './tsconfig.json'),
        }),
        // typescript()
    ],
    watch: {
        include: 'src/**', // 监听的文件
        clearScreen: false, // 设置为 false 以防止每次重建时清屏
    },
});


