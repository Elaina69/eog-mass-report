import { resolve, join, basename } from 'node:path';
import { existsSync } from 'node:fs';
import { readFile, writeFile, cp, mkdir, rm } from 'node:fs/promises';
import { defineConfig } from 'vite';
import mkcert from 'vite-plugin-mkcert';
import fs from 'node:fs';
import archiver from "archiver"
import chalk from 'chalk';

import pkg from './package.json';
const PENGU_PATH = pkg.config.penguPath;
const PLUGIN_NAME = pkg.name;

const getIndexCode = (port: number) => (
    `await import('https://localhost:${port}/@vite/client');
    export * from 'https://localhost:${port}/src/index.ts';`
);

let port: number;
const outDir = resolve(__dirname, 'dist');
const pluginsDir = resolve(__dirname, PENGU_PATH, 'plugins', PLUGIN_NAME);

async function emptyDir(path: string) {
    if (existsSync(path)) {
        await rm(path, { recursive: true });
    }
    await mkdir(path, { recursive: true });
}

export default defineConfig((config) => ({
    define: {
        'process.env.ENV': config.command == 'build' ? '"production"' : '"development"',
        'process.env.PROD': config.command == 'build' ? 'true' : 'false',
        'process.env.DEV': config.command == 'build' ? 'false' : 'true',
    },
    build: {
        target: 'esnext',
        minify: false,
        cssMinify: false,
        rollupOptions: {
            output: {
                format: 'esm',
                entryFileNames: 'index.js',
                manualChunks: undefined,
                assetFileNames(name) {
                    if (name.name === 'style.css')
                        return 'index.css';
                    return 'assets/[name]-[hash][extname]';
                }
            },
            preserveEntrySignatures: 'strict',
            treeshake: 'smallest',
        },
        lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            fileName: 'index',
            formats: ['es'],
        },
    },
    server: {
        https: true,
        // port: 3000
    },
    publicDir: false,
    plugins: [
        mkcert(),
        // {
        //     // Because vite doesn't allow minifying of ESM, we have to do it manually
        //     name: 'minify',
        //     apply: 'build',
        //     enforce: 'post',
        //     renderChunk: {
        //         order: 'post',
        //         async handler(code, chunk, _) {
        //             if (chunk.fileName.endsWith('.js')) {
        //                 return await transform(code, { minify: true, treeShaking: true });
        //             }

        //             return code;
        //         }
        //     }
        // },
        {
            name: 'pengu-serve',
            apply: 'serve',
            enforce: 'post',
            configureServer(server) {
                server.httpServer!.once('listening', async () => {
                    // @ts-ignore
                    port = server.httpServer.address()['port'];
                    await emptyDir(pluginsDir);
                    await writeFile(join(pluginsDir, 'index.js'), getIndexCode(port));
                });
            },
            transform: (code, id) => {
                if (/\.(ts|tsx|js|jsx)$/i.test(id)) return;
                return code.replace(/\/src\//g, `https://localhost:${port}/src/`)
            },
        },
        {
            name: 'pengu-build',
            apply: 'build',
            enforce: 'post',
            async closeBundle() {
                const now = new Date();
                console.log(chalk.cyan("Build at: ") + now.toLocaleString());
            
                const indexJs = join(outDir, 'index.js');
                let count = 0;
            
                // Read and patch index.js
                let jsCode = (await readFile(indexJs, 'utf-8'))
                    .replace(/"\/assets\//g, `"//plugins/${PLUGIN_NAME}/assets/`);
            
                // Patch index.css if exists
                if (existsSync(join(outDir, 'index.css'))) {
                    const indexCss = join(outDir, 'index.css');
                    const cssCode = (await readFile(indexCss, 'utf-8'))
                        .replace(/url\(\/assets\//g, `url(./assets/`);
                    await writeFile(indexCss, cssCode);
            
                    // Import CSS module in index.js
                    jsCode = `import "./index.css";\n${jsCode}`;
                }
            
                await writeFile(indexJs, jsCode);
            
                // Add author comment block
                const Author = `/**\n* @name EOG_Mass_Report\n* @author Elaina Da Catto\n* @link https://github.com/Elaina69\n* @Nyan Meow~~~\n*/`;

                async function prependCommentToFile(filePath, commentBlock) {
                    try {
                        if (!existsSync(filePath)) {
                            console.error(chalk.red(`File not found: ${filePath}`));
                            return;
                        }
            
                        const data = await readFile(filePath, 'utf-8');
                        const updatedContent = `${commentBlock.trim()}\n\n${data}`;
                        await writeFile(filePath, updatedContent, 'utf-8');
                        //console.log(chalk.green('✔ Author name added successfully!'));
                    } catch (err) {
                        console.error(chalk.red('Error while processing the file:'), err);
                    }
                }
            
                await prependCommentToFile(indexJs, Author);
            
                // Copy output to Pengu directory
                count = 0;
                const penguInterval = setInterval(() => count += 100, 100);
                try {
                    await emptyDir(pluginsDir);
                    await cp(outDir, pluginsDir, { recursive: true });
                    console.log(chalk.green(`✔ Copy output to pengu dir completed! (in ${count / 1000}s)`));
                } catch (err) {
                    console.error(chalk.red('Error while copying to Pengu directory:'), err);
                } finally {
                    clearInterval(penguInterval);
                    count = 0;
                }
            }
        },
    ]
}));
