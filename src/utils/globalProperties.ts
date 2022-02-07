import { App } from 'vue'
import mitt, { Emitter } from 'mitt'
const emitter: Emitter<any> = mitt<any>()

const install = (app: App): void => {
  app.config.globalProperties.emitter = emitter
  app.provide('emitter', app.config.globalProperties.emitter)
}
export default {
  install
}
