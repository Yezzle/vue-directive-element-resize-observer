import { createDirective } from './src/directive'
import { createVue2Directive } from './src/directive-vue2'

// 导出指令
export const vResize = createDirective()

// 导出类型
export type { ResizeOptions, SizableClassRule, ResizeInfo } from './src/types'

// Vue3插件安装函数
export default {
  install(app: any) {
    // 检查是否为Vue3
    if (app.directive) {
      app.directive('resize', vResize)
    }
  }
}

// Vue2插件安装函数
export const Vue2Plugin = {
  install(Vue: any) {
    Vue.directive('resize', createVue2Directive())
  }
}

// 命名导出
export { createDirective, createVue2Directive } 