// 尺寸信息接口
export interface ResizeInfo {
  width: number
  height: number
  contentRect: DOMRectReadOnly
  borderBoxSize: ReadonlyArray<ResizeObserverSize>
  contentBoxSize: ReadonlyArray<ResizeObserverSize>
  devicePixelContentBoxSize: ReadonlyArray<ResizeObserverSize>
}

// 尺寸规则类型
export interface SizableClassRule {
  [key: string]: string
}

// 指令选项类型
export interface ResizeOptions {
  rules?: SizableClassRule
  callback?: (info: ResizeInfo) => void
  debounce?: number
}

// 解析后的规则类型
export interface ParsedRule {
  property: string
  operator: 'gt' | 'lt'
  value: number
  className: string
}

// ResizeObserver回调参数类型
export interface ResizeObserverEntry {
  target: Element
  contentRect: DOMRectReadOnly
  borderBoxSize: ReadonlyArray<ResizeObserverSize>
  contentBoxSize: ReadonlyArray<ResizeObserverSize>
  devicePixelContentBoxSize: ReadonlyArray<ResizeObserverSize>
}

export interface ResizeObserverSize {
  inlineSize: number
  blockSize: number
} 