import { createApp } from 'vue'
import App from './App.vue'

// Above the createApp() line
import { defineCustomElements } from '@ionic/pwa-elements/loader';
defineCustomElements(window);
createApp(App).mount('#app')
