import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import compression from 'vite-plugin-compression';

export default defineConfig({
  plugins: [
    react(),
    compression({
      algorithm: 'gzip',
      ext: '.gz',
      threshold: 256, // Сжимать файлы >256 байт
    }),
  ],
  build: {
    minify: 'esbuild', // Быстрая минификация
    sourcemap: false, // Отключение sourcemaps
    target: 'esnext', // Современные браузеры
    rollupOptions: {
      output: {
        manualChunks: {
          'mui': ['@mui/material', '@mui/icons-material'],
          'react-icons': ['react-icons/ai', 'react-icons/bi'],
          'vendor': ['react', 'react-dom', 'react-router-dom'],
          'redux': ['react-redux', '@reduxjs/toolkit'],
          'toastify': ['react-toastify'],
        },
      },
      // Усиление tree-shaking
      treeshake: {
        moduleSideEffects: false, // Предполагаем, что у модулей нет побочных эффектов
        tryCatchDeoptimization: false,
      },
    },
  },
});