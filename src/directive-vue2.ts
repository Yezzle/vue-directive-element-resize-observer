import type { ResizeOptions } from './types'
import { parseRules } from './utils'
import { observerManager } from './observer-manager'

/**
 * Vue2指令绑定接口
 */
interface Vue2DirectiveBinding {
  value: ResizeOptions
  oldValue?: ResizeOptions
  expression?: string
  arg?: string
  modifiers?: Record<string, boolean>
}

/**
 * 创建Vue2兼容的尺寸响应式指令
 * @returns Vue2指令对象
 */
export function createVue2Directive() {
  return {
    bind(el: HTMLElement, binding: Vue2DirectiveBinding) {
      const options = binding.value
      
      if (!options) {
        console.warn('v-resize: 缺少必要的配置')
        return
      }
      
      // 解析规则（如果提供）
      const parsedRules = options.rules ? parseRules(options.rules) : []
      
      // 使用共享的观察器管理器
      observerManager.addElement(
        el, 
        parsedRules, 
        options.callback,
        options.debounce
      )
    },
    
    update(el: HTMLElement, binding: Vue2DirectiveBinding) {
      const options = binding.value
      
      if (!options) {
        return
      }
      
      // 重新解析规则（如果提供）
      const parsedRules = options.rules ? parseRules(options.rules) : []
      
      // 更新元素的规则和回调
      observerManager.updateElement(
        el, 
        parsedRules, 
        options.callback,
        options.debounce
      )
    },
    
    unbind(el: HTMLElement) {
      // 从观察器管理器中移除元素
      observerManager.removeElement(el)
    }
  }
} 