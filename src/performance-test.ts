import { observerManager } from './observer-manager'
import type { ParsedRule, ResizeInfo } from './types'

/**
 * 性能测试工具
 */
export class PerformanceTest {
  private testElements: HTMLElement[] = []
  private startTime: number = 0

  /**
   * 创建测试元素
   */
  createTestElements(count: number): HTMLElement[] {
    const elements: HTMLElement[] = []
    
    for (let i = 0; i < count; i++) {
      const element = document.createElement('div')
      element.style.width = `${Math.random() * 1000 + 100}px`
      element.style.height = '100px'
      element.style.border = '1px solid #ccc'
      element.textContent = `Element ${i + 1}`
      
      elements.push(element)
      document.body.appendChild(element)
    }
    
    this.testElements = elements
    return elements
  }

  /**
   * 测试观察器管理器性能
   */
  testObserverManagerPerformance(elementCount: number): void {
    console.log(`🧪 开始性能测试 - ${elementCount} 个元素`)
    
    // 创建测试元素
    const elements = this.createTestElements(elementCount)
    
    // 测试规则
    const testRules: ParsedRule[] = [
      { property: 'gt-500', operator: 'gt', value: 500, className: 'large' },
      { property: 'lt-500', operator: 'lt', value: 500, className: 'small' },
      { property: 'gt-800', operator: 'gt', value: 800, className: 'xlarge' },
      { property: 'lt-300', operator: 'lt', value: 300, className: 'xsmall' }
    ]
    
    // 测试回调函数
    const testCallback = (info: ResizeInfo) => {
      // 模拟回调处理
      if (info.width > 800) {
        // console.log('Large element detected')
      }
    }
    
    // 开始计时
    this.startTime = performance.now()
    
    // 添加所有元素到观察器
    elements.forEach(element => {
      observerManager.addElement(element, testRules, testCallback, 100)
    })
    
    const addTime = performance.now() - this.startTime
    console.log(`✅ 添加 ${elementCount} 个元素耗时: ${addTime.toFixed(2)}ms`)
    
    // 测试更新性能
    this.startTime = performance.now()
    elements.forEach(element => {
      observerManager.updateElement(element, testRules, testCallback, 50)
    })
    
    const updateTime = performance.now() - this.startTime
    console.log(`✅ 更新 ${elementCount} 个元素耗时: ${updateTime.toFixed(2)}ms`)
    
    // 测试移除性能
    this.startTime = performance.now()
    elements.forEach(element => {
      observerManager.removeElement(element)
    })
    
    const removeTime = performance.now() - this.startTime
    console.log(`✅ 移除 ${elementCount} 个元素耗时: ${removeTime.toFixed(2)}ms`)
    
    // 清理测试元素
    this.cleanup()
    
    console.log(`📊 性能测试完成`)
    console.log(`📈 当前观察的元素数量: ${observerManager.getElementCount()}`)
  }

  /**
   * 测试回调函数性能
   */
  testCallbackPerformance(elementCount: number): void {
    console.log(`🧪 开始回调函数性能测试 - ${elementCount} 个元素`)
    
    const elements = this.createTestElements(elementCount)
    let callbackCount = 0
    
    const callback = (info: ResizeInfo) => {
      callbackCount++
      // 模拟复杂的回调处理
      const area = info.width * info.height
      const ratio = info.width / info.height
      if (area > 100000 && ratio > 2) {
        // console.log('Large landscape element')
      }
    }
    
    // 添加元素
    elements.forEach(element => {
      observerManager.addElement(element, [], callback, 0)
    })
    
    // 模拟尺寸变化
    elements.forEach(element => {
      element.style.width = `${Math.random() * 1000 + 100}px`
      element.style.height = `${Math.random() * 500 + 50}px`
    })
    
    // 等待一段时间让回调执行
    setTimeout(() => {
      console.log(`✅ 回调函数执行次数: ${callbackCount}`)
      
      // 清理
      elements.forEach(element => {
        observerManager.removeElement(element)
      })
      this.cleanup()
    }, 1000)
  }

  /**
   * 测试内存使用
   */
  testMemoryUsage(): void {
    if ('memory' in performance) {
      const memory = (performance as any).memory
      console.log(`💾 内存使用情况:`)
      console.log(`   - 已用堆内存: ${(memory.usedJSHeapSize / 1024 / 1024).toFixed(2)} MB`)
      console.log(`   - 总堆内存: ${(memory.totalJSHeapSize / 1024 / 1024).toFixed(2)} MB`)
      console.log(`   - 堆内存限制: ${(memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2)} MB`)
    }
  }

  /**
   * 清理测试环境
   */
  cleanup(): void {
    this.testElements.forEach(element => {
      if (element.parentNode) {
        element.parentNode.removeChild(element)
      }
    })
    this.testElements = []
  }

  /**
   * 运行完整性能测试
   */
  runFullTest(): void {
    console.log('🚀 开始完整性能测试')
    
    const testCases = [10, 50, 100, 500, 1000]
    
    testCases.forEach(count => {
      console.log(`\n--- 测试 ${count} 个元素 ---`)
      this.testObserverManagerPerformance(count)
      this.testMemoryUsage()
    })
    
    console.log('\n🎉 性能测试完成')
  }
}

// 导出测试实例
export const performanceTest = new PerformanceTest() 