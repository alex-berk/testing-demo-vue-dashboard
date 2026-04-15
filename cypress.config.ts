import { defineConfig } from 'cypress';
import { visualEvalPlugin } from 'cypress-visual-eval';
import viteConfig from './vite.config.js';

export default defineConfig({
  video: false,
  env: {
    apiUrl: 'http://127.0.0.1:4000',
  },
  e2e: {
    baseUrl: 'http://127.0.0.1:5173',
    setupNodeEvents(on, config) {
      visualEvalPlugin(on, config, {
        provider: 'openai',
        debug: true,
      });

      return config;
    },
  },
  component: {
    devServer: {
      framework: 'vue',
      bundler: 'vite',
      viteConfig: {
        ...viteConfig,
        server: {
          ...viteConfig.server,
          host: '127.0.0.1',
          port: 5174,
          strictPort: false,
        },
      },
    },
  },
});
