import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    server: {
        host: '0.0.0.0',
        port: 6010
    },
    publicDir:"../../public",
    plugins: [react()],
})
