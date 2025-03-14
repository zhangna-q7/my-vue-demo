import { createApp } from 'vue'
import App from './App.vue'

import VConsole from 'vconsole'
// 创建 vConsole 实例
const vConsole = new VConsole();

vConsole.setOption('show', true); // 在开发环境下显示 vConsole
// Above the createApp() line
import { defineCustomElements } from '@ionic/pwa-elements/loader';
defineCustomElements(window);
createApp(App).mount('#app')
