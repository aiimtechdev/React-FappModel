import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { readdirSync } from 'fs'

const absolutePathAliases = [];
const srcPath = path.resolve('./src/');
const srcRootContent = readdirSync(srcPath, { withFileTypes: false });
srcRootContent.forEach((directory) => {
    absolutePathAliases.push({
        "find": directory.split('.')[0],
        "replacement": path.join(srcPath, directory)
    })
});

export default defineConfig(({mode}) => {
    const env = loadEnv(mode, process.cwd(), '')
    return {
        plugins: [react()],
        resolve: { alias: absolutePathAliases },
        server: {port: env.PORT}
    }
})
