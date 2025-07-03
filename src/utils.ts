import type { SizableClassRule, ParsedRule } from './types'

// 解析规则的正则表达式
const RULE_REGEX = /(gt|lt)-(\d+)/

/**
 * 解析尺寸规则
 * @param rules 原始规则对象
 * @returns 解析后的规则数组
 */
export function parseRules(rules: SizableClassRule): ParsedRule[] {
  const parsedRules: ParsedRule[] = []
  
  for (const [property, className] of Object.entries(rules)) {
    const match = property.match(RULE_REGEX)
    if (match) {
      const [, operator, valueStr] = match
      const value = parseInt(valueStr, 10)
      
      if (!isNaN(value)) {
        parsedRules.push({
          property,
          operator: operator as 'gt' | 'lt',
          value,
          className
        })
      }
    }
  }
  
  return parsedRules
}

/**
 * 应用尺寸规则到元素
 * @param element 目标元素
 * @param rules 解析后的规则
 * @param width 当前宽度
 */
export function applyRules(
  element: HTMLElement,
  rules: ParsedRule[],
  width: number
): void {
  // 移除所有规则相关的class
  rules.forEach(rule => {
    element.classList.remove(rule.className)
  })
  
  // 应用满足条件的规则
  rules.forEach(rule => {
    const shouldApply = rule.operator === 'gt' 
      ? width > rule.value 
      : width < rule.value
    
    if (shouldApply) {
      element.classList.add(rule.className)
    }
  })
} 