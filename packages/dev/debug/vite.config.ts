import {defineConfig} from 'vite';
import path from 'path';
import fs from 'fs';

// 获取 src 目录下所有 HTML 文件的函数
const getHtmlFiles = (dir) => {
    return fs.readdirSync(dir)
        .filter(file => file.endsWith('.html'))
        .reduce((acc, file) => {
            const key = path.basename(file, '.html'); // 使用文件名（不带扩展名）作为键
            acc[key] = path.resolve(dir, file); // 为每个 HTML 文件创建一个条目
            return acc;
        }, {});
};

const htmlFiles = getHtmlFiles(path.resolve(__dirname, 'src')); // 指定你的 src 目录
console.log(htmlFiles)
export default defineConfig({
    // root: path.resolve(__dirname, "src"),
    publicDir: "../../public",
    server: {
        host: '0.0.0.0',
        port: 4030,
    },
    build: {
        rollupOptions: {
            input: {
                ...htmlFiles, // 将 HTML 文件展开到 input 对象中
                // index: path.resolve(__dirname, 'src/index.html'),
            }
        },
        lib: {
            entry: '../plum-render-api-babylon/src/index.ts',
            name: 'Counter',
            fileName: 'counter',
        },
    },
});