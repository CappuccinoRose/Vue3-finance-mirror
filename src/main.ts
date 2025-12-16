import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import App from './App.vue'
import router from './router'
import '@/assets/styles/global.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
const app = createApp(App)

// 注册 Element Plus 图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.config.warnHandler = (msg, instance, trace) => {
  // 检查警告信息
  if (msg.includes('onUnmounted is called when there is no active component instance')) {
    return
  }
  // 其他警告正常显示
  console.warn(msg, trace)
}
app.use(createPinia())
app.use(router)
app.use(ElementPlus, {
  locale: zhCn,
})

app.mount('#app')
