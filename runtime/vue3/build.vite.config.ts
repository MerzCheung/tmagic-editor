/*
 * Tencent is pleased to support the open source community by making TMagicEditor available.
 *
 * Copyright (C) 2021 THL A29 Limited, a Tencent company.  All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import path from 'path';

import { defineConfig } from 'vite';
import legacy from '@vitejs/plugin-legacy';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
// @ts-ignore
import externalGlobals from 'rollup-plugin-external-globals';

export default defineConfig(({ mode }) => {
  if (['value', 'config', 'event'].includes(mode)) {
    const capitalToken = mode.charAt(0).toUpperCase() + mode.slice(1);
    return {
      build: {
        cssCodeSplit: false,
        sourcemap: true,
        minify: false,
        target: 'esnext',
        outDir: `entry-dist/${mode}-entry`,

        lib: {
          entry: `.tmagic/${mode}-entry.ts`,
          name: `magicPreset${capitalToken}s`,
          fileName: 'index',
          formats: ['umd'],
        },
      },
    };
  }

  if (['page', 'playground', 'page:admin', 'playground:admin'].includes(mode)) {
    const [type, isAdmin] = mode.split(':');
    const base = isAdmin ? `/runtime/${type}/` : `/tmagic-editor/playground/runtime/vue3/${type}`;
    const outDir = isAdmin
      ? path.resolve(process.cwd(), `./admin-dist/${type}`)
      : path.resolve(process.cwd(), `./dist/${type}`);
    return {
      plugins: [
        vue(),
        vueJsx(),
        legacy({
          targets: ['defaults', 'not IE 11'],
        }),
        externalGlobals({ vue: 'Vue' }, { exclude: [`./${type}/index.html`] }),
      ],

      root: `./${type}/`,

      base,

      build: {
        emptyOutDir: true,
        sourcemap: true,
        outDir,
      },
    };
  }

  return {};
});