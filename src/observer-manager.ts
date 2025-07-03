import type { ParsedRule, ResizeInfo } from './types'
import { applyRules } from './utils'

// 元素信息接口
interface ElementInfo {
  element: HTMLElement
  rules: ParsedRule[]
  callback?: (info: ResizeInfo) => void
  debounce?: number
  lastWidth: number
  lastHeight: number
  debounceTimer?: number
}

// ResizeObserver管理器
class ResizeObserverManager {
  private observer: ResizeObserver | null = null
  private elementMap = new Map<HTMLElement, ElementInfo>()
  private isObserving = false

  /**
   * 添加元素到观察列表
   */
  addElement(
    element: HTMLElement, 
    rules: ParsedRule[], 
    callback?: (info: ResizeInfo) => void,
    debounce?: number
  ): void {
    const initialWidth = element.offsetWidth
    const initialHeight = element.offsetHeight
    
    this.elementMap.set(element, {
      element,
      rules,
      callback,
      debounce,
      lastWidth: initialWidth,
      lastHeight: initialHeight
    })

    // 初始化应用规则
    if (rules.length > 0) {
      applyRules(element, rules, initialWidth)
    }

    // 初始化执行回调
    if (callback) {
      const initialInfo: ResizeInfo = {
        width: initialWidth,
        height: initialHeight,
        contentRect: new DOMRect(0, 0, initialWidth, initialHeight),
        borderBoxSize: [{ inlineSize: initialWidth, blockSize: initialHeight }],
        contentBoxSize: [{ inlineSize: initialWidth, blockSize: initialHeight }],
        devicePixelContentBoxSize: [{ inlineSize: initialWidth, blockSize: initialHeight }]
      }
      callback(initialInfo)
    }

    // 如果还没有开始观察，则开始观察
    if (!this.isObserving) {
      this.startObserving()
    }
  }

  /**
   * 更新元素的规则和回调
   */
  updateElement(
    element: HTMLElement, 
    rules: ParsedRule[], 
    callback?: (info: ResizeInfo) => void,
    debounce?: number
  ): void {
    const info = this.elementMap.get(element)
    if (info) {
      info.rules = rules
      info.callback = callback
      info.debounce = debounce
      
      // 立即应用新规则
      if (rules.length > 0) {
        const width = element.offsetWidth
        applyRules(element, rules, width)
      }
      
      // 立即执行回调
      if (callback) {
        const width = element.offsetWidth
        const height = element.offsetHeight
        const resizeInfo: ResizeInfo = {
          width,
          height,
          contentRect: new DOMRect(0, 0, width, height),
          borderBoxSize: [{ inlineSize: width, blockSize: height }],
          contentBoxSize: [{ inlineSize: width, blockSize: height }],
          devicePixelContentBoxSize: [{ inlineSize: width, blockSize: height }]
        }
        callback(resizeInfo)
      }
    }
  }

  /**
   * 移除元素
   */
  removeElement(element: HTMLElement): void {
    const info = this.elementMap.get(element)
    if (info && info.debounceTimer) {
      clearTimeout(info.debounceTimer)
    }
    
    this.elementMap.delete(element)
    
    // 如果没有元素了，停止观察
    if (this.getElementCount() === 0) {
      this.stopObserving()
    }
  }

  /**
   * 开始观察
   */
  private startObserving(): void {
    if (this.observer) {
      return
    }

    this.observer = new ResizeObserver((entries) => {
      // 批量处理所有变化
      this.handleResize(entries)
    })

    // 观察所有已添加的元素
    for (const info of this.elementMap.values()) {
      this.observer.observe(info.element)
    }

    this.isObserving = true
  }

  /**
   * 停止观察
   */
  private stopObserving(): void {
    if (this.observer) {
      this.observer.disconnect()
      this.observer = null
      this.isObserving = false
    }
  }

  /**
   * 处理尺寸变化
   */
  private handleResize(entries: ResizeObserverEntry[]): void {
    entries.forEach(entry => {
      const info = this.elementMap.get(entry.target as HTMLElement)
      if (!info) return

      const newWidth = entry.contentRect.width
      const newHeight = entry.contentRect.height
      
      // 检查尺寸是否真的发生了变化
      if (Math.abs(newWidth - info.lastWidth) < 1 && Math.abs(newHeight - info.lastHeight) < 1) {
        return
      }

      info.lastWidth = newWidth
      info.lastHeight = newHeight

      // 创建尺寸信息对象
      const resizeInfo: ResizeInfo = {
        width: newWidth,
        height: newHeight,
        contentRect: entry.contentRect,
        borderBoxSize: entry.borderBoxSize,
        contentBoxSize: entry.contentBoxSize,
        devicePixelContentBoxSize: entry.devicePixelContentBoxSize
      }

      // 处理防抖
      if (info.debounce && info.debounce > 0) {
        if (info.debounceTimer) {
          clearTimeout(info.debounceTimer)
        }
        
        info.debounceTimer = window.setTimeout(() => {
          // 应用规则
          if (info.rules.length > 0) {
            applyRules(info.element, info.rules, newWidth)
          }
          
          // 执行回调
          if (info.callback) {
            info.callback(resizeInfo)
          }
          
          info.debounceTimer = undefined
        }, info.debounce)
      } else {
        // 应用规则
        if (info.rules.length > 0) {
          applyRules(info.element, info.rules, newWidth)
        }
        
        // 执行回调
        if (info.callback) {
          info.callback(resizeInfo)
        }
      }
    })
  }

  /**
   * 获取当前观察的元素数量
   */
  getElementCount(): number {
    return this.elementMap.size
  }

  /**
   * 清理所有资源
   */
  destroy(): void {
    // 清理所有定时器
    for (const info of this.elementMap.values()) {
      if (info.debounceTimer) {
        clearTimeout(info.debounceTimer)
      }
    }
    
    this.stopObserving()
    this.elementMap.clear()
  }
}

// 创建全局单例
export const observerManager = new ResizeObserverManager()

// 导出管理器类（用于测试）
export { ResizeObserverManager } 