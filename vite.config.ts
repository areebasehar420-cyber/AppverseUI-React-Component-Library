import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: 'src/index.ts',
      formats: ['es', 'cjs'],
      fileName: (format) => `appverse-ui.${format === 'es' ? 'js' : 'cjs'}`,
    },
    rollupOptions: { external: ['react', 'react-dom', 'react/jsx-runtime', 'react-hook-form'] },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
    css: false,
    coverage: { provider: 'v8', include: ['src/components/**', 'src/hooks/**'], exclude: ['**/*.stories.tsx', '**/*.test.tsx', '**/index.ts'] },
  },
});
