import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import tsconfigPaths from 'vite-tsconfig-paths';
import checker from 'vite-plugin-checker';

export default defineConfig({
  /**
   * Root directory of the app
   * (index.html lives here)
   */
  root: path.resolve(__dirname, 'example'),

  plugins: [
    react({
      // Fast Refresh is enabled by default in @vitejs/plugin-react v4
      babel: {
        plugins: ['@emotion/babel-plugin'],
      },
    }),

    /**
     * Resolve TS path aliases from example/tsconfig.json
     */
    tsconfigPaths({
      projects: [path.resolve(__dirname, 'example/tsconfig.json')],
    }),

    /**
     * Run TypeScript checker using the correct tsconfig
     */
    checker({
      typescript: {
        tsconfigPath: path.resolve(__dirname, 'example/tsconfig.json'),
      },
      overlay: { initialIsOpen: false },
    }),
  ],

  /**
   * Manual aliases (kept in sync with tsconfig.json)
   */
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'example/src'),
      '@components': path.resolve(__dirname, 'example/src/components'),
      '@hooks': path.resolve(__dirname, 'example/src/hooks'),
      '@utils': path.resolve(__dirname, 'example/src/utils'),
      '@styles': path.resolve(__dirname, 'example/src/styles'),
      '@assets': path.resolve(__dirname, 'example/src/assets'),
      '@pages': path.resolve(__dirname, 'example/src/pages'),
      '@types': path.resolve(__dirname, 'example/src/types'),
    },
  },

  server: {
    host: '0.0.0.0',
    port: 3005,
    open: false,
    cors: true,
    hmr: {
      overlay: true,
    },
  },

  build: {
    /**
     * Output goes to adv-metronic/dist
     */
    outDir: path.resolve(__dirname, 'dist'),
    emptyOutDir: true,

    sourcemap: true,
    minify: 'terser',

    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },

    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'mui-vendor': ['@mui/material', '@mui/icons-material'],
          'chart-vendor': ['apexcharts', 'react-apexcharts', 'chart.js'],
          'utils-vendor': ['lodash', 'axios', 'dayjs'],
        },
      },
    },

    chunkSizeWarningLimit: 1000,
  },

  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@mui/material',
      '@mui/icons-material',
      '@emotion/react',
      '@emotion/styled',
    ],
  },

  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @import "@styles/variables.scss";
          @import "@styles/mixins.scss";
        `,
      },
    },
  },
});