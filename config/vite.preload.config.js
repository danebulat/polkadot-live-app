// Copyright 2024 @polkadot-live/polkadot-live-app authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { chrome } from '../.electron-vendors.cache.json';
import { defineConfig } from 'vite';
import { external } from '../vite.base.config';
import { join } from 'path';

const PACKAGE_ROOT = join(__dirname, '../');
const PROJECT_ROOT = PACKAGE_ROOT;

/**
 * @type {import('vite').UserConfig}
 * @see https://vitejs.dev/config/
 */
export default defineConfig({
  mode: process.env.MODE,
  root: PACKAGE_ROOT,
  envDir: PROJECT_ROOT,
  build: {
    ssr: true,
    sourcemap: 'inline',
    target: `chrome${chrome}`,
    outDir: 'dist/preload',
    assetsDir: '.',
    minify: process.env.MODE !== 'development',
    lib: {
      entry: join(PACKAGE_ROOT, 'src', 'preload.ts'),
    },
    rollupOptions: {
      external,
      output: [
        {
          // ESM preload scripts must have the .mjs extension unless `sandboxed` is `true`.
          // https://www.electronjs.org/docs/latest/tutorial/esm#esm-preload-scripts-must-have-the-mjs-extension
          entryFileNames: '[name].cjs',
          format: 'cjs',
          // It should not be split chunks.
          inlineDynamicImports: true,
          chunkFileNames: '[name].cjs',
          assetFileNames: '[name].[ext]',
        },
      ],
    },
    emptyOutDir: true,
    reportCompressedSize: false,
  },
});
