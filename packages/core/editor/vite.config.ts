import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from "@tailwindcss/vite";
import ElementPlus from 'unplugin-element-plus/vite'
import {viteStaticCopy} from "vite-plugin-static-copy";
export default defineConfig((env) => {
    const isBuild = env.command === 'build';
    let buildTargets = [
        {
            src: '../sdk/public/hdr',
            dest: './'
        },
        {
            src: '../sdk/public/libs',
            dest: './'
        }
    ]

    let serveTargets = [     {
        src: '../sdk/public/**',
        dest: '/'
    }]
    return {
        server:{
            port: 4010
        },
        plugins: [tailwindcss(),
            ElementPlus({}),

            vue(), viteStaticCopy({
            targets: isBuild ? buildTargets : serveTargets,
        })],
    }

})

