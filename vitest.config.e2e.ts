import { defineConfig } from 'vitest/config';
import tsConfigPaths from 'vite-tsconfig-paths';
import swc from 'unplugin-swc';

export default defineConfig({
  plugins: [
    tsConfigPaths(),
    swc.vite({
      module: { type: 'es6' },
    }),
  ],
  test: {
    globals: true,
    include: ['**/*.e2e-spec.ts'],
    root: './',
    setupFiles: ['./test/setup-e2e.ts'],
  },
});
