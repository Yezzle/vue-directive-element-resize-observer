import type { DirectiveBinding } from 'vue'
import type { ResizeOptions } from './types'
import { parseRules } from './utils'
import { observerManager } from './observer-manager'

/**
 * 创建尺寸响应式指令
 * @returns Vue3指令对象
 */
export function createDirective() {
  return {
    mounted(el: HTMLElement, binding: DirectiveBinding<ResizeOptions>) {
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
    
    updated(el: HTMLElement, binding: DirectiveBinding<ResizeOptions>) {
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
    
    unmounted(el: HTMLElement) {
      // 从观察器管理器中移除元素
      observerManager.removeElement(el)
    }
  }
} 