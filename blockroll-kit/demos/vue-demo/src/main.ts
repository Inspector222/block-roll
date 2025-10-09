import { createApp } from 'vue';
import { BlockRollPlugin } from '@blockroll/vue-sdk';
import App from './App.vue';

const app = createApp(App);

app.use(BlockRollPlugin, {
  apiKey: import.meta.env.VITE_BLOCKROLL_API_KEY || 'demo_api_key',
  baseURL: import.meta.env.VITE_BLOCKROLL_API_URL,
  realtime: true,
});

app.mount('#app');

