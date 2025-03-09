import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import {viteStaticCopy} from 'vite-plugin-static-copy'

export default defineConfig((env) => {
    const isBuild = env.command === 'build';

    let buildTargets = [
        // {
        //     src: '../../core/sdk/dist/@babylonjs',
        //     dest: './'
        // },
        {
            src: '../../core/sdk/dist/hdr',
            dest: './'
        },
        {
            src: '../../core/sdk/dist/particleTexture',
            dest: './'
        },
        {
            src: '../../core/sdk/dist/texture',
            dest: './'
        },
        {
            src: '../../core/sdk/dist/wasm',
            dest: './'
        },
        {
            src: '../../core/sdk/dist/plum-render-babylon-sdk.js',
            dest: './'
        }
    ]

    let serveTargets = [{
        src: '../../core/sdk/dist/**',
        dest: ''
    }]

    return {
        server: {
            host: '0.0.0.0',
            port: 4050,
        },
        plugins: [vue(),
            viteStaticCopy({
                targets: isBuild ? buildTargets : serveTargets,
            })
        ],
        assetsInclude: ['src/**/*.html']
    }
})


