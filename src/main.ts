import { createApp } from 'vue'
import { i18n, ElementPlus } from './plugins'
import './modules'
import registerGlobalProperties from './utils/globalProperties'
import App from './App.vue'
import router from './router'
import store from './store'
import PortalComponents from './components'
import '@/assets/styles/index.styl'
const app = createApp(App)
app.use(PortalComponents)
app.use(registerGlobalProperties)
app.use(router)
app.use(store)
app.use(i18n)
app.use(ElementPlus)
app.mount('#app')
