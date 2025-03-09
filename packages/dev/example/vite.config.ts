import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import {viteStaticCopy} from 'vite-plugin-static-copy'

export default defineConfig((env) => {
    const isBuild = env.command === 'build';

    let buildTargets = [
        {
            src: '../sdk/dist/hdr',
            dest: './'
        },
        {
            src: '../sdk/dist/libs',
            dest: './'
        }
    ]

    let serveTargets = [     {
        src: '../sdk/dist/**',
        dest: '/'
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


