# Vue Directive Element Resize Observer

一个Vue3指令，用于监听DOM元素尺寸变化，支持动态添加CSS类和回调函数，实现更精细的局部响应式适配。

## 特性

- 🎯 基于ResizeObserver API，性能优异
- 📱 支持TypeScript，提供完整的类型定义
- ⚡ 支持防抖配置，避免频繁更新
- 🎨 灵活的规则配置，支持大于(gt)和小于(lt)条件
- 🧹 自动清理资源，防止内存泄漏
- 🚀 共享观察器模式，大幅提升性能
- 📞 支持回调函数，获取详细的尺寸信息
- 🔄 兼容Vue2和Vue3，一套代码多版本支持

## 安装

```bash
npm install vue-directive-element-resize-observer
```

## 使用方法

### 全局注册

#### Vue3
```typescript
import { createApp } from 'vue'
import App from './App.vue'
import ResizeObserverDirective from 'vue-directive-element-resize-observer'

const app = createApp(App)
app.use(ResizeObserverDirective)
app.mount('#app')
```

#### Vue2
```javascript
import Vue from 'vue'
import { Vue2Plugin } from 'vue-directive-element-resize-observer'

Vue.use(Vue2Plugin)

new Vue({
  el: '#app'
})
```

### 局部使用

#### Vue3
```typescript
import { vResize } from 'vue-directive-element-resize-observer'

export default {
  directives: {
    'resize': vResize
  }
}
```

#### Vue2
```javascript
import { createVue2Directive } from 'vue-directive-element-resize-observer'

export default {
  directives: {
    'resize': createVue2Directive()
  }
}
```

### 基本用法 - 动态类名

```vue
<template>
  <div 
    v-resize="{
      rules: {
        'gt-768': 'desktop-layout',
        'lt-768': 'mobile-layout',
        'gt-1024': 'large-screen',
        'lt-480': 'small-screen'
      }
    }"
    class="responsive-container"
  >
    响应式内容
  </div>
</template>

<script setup lang="ts">
// 组件逻辑
</script>

<style>
.desktop-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.mobile-layout {
  display: flex;
  flex-direction: column;
}

.large-screen {
  font-size: 18px;
}

.small-screen {
  font-size: 14px;
}
</style>
```

### 回调函数用法

```vue
<template>
  <div 
    v-resize="{
      callback: handleResize,
      debounce: 100
    }"
  >
    回调响应式内容
  </div>
</template>

<script setup lang="ts">
import type { ResizeInfo } from 'vue-directive-element-resize-observer'

const handleResize = (info: ResizeInfo) => {
  console.log('元素尺寸变化:', {
    width: info.width,
    height: info.height,
    aspectRatio: info.width / info.height
  })
}
</script>
```

### 组合使用

```vue
<template>
  <div 
    v-resize="{
      rules: {
        'gt-768': 'desktop',
        'lt-768': 'mobile'
      },
      callback: handleResize,
      debounce: 100
    }"
  >
    组合功能内容
  </div>
</template>

<script setup lang="ts">
import type { ResizeInfo } from 'vue-directive-element-resize-observer'

const handleResize = (info: ResizeInfo) => {
  // 处理尺寸变化
  console.log('尺寸变化:', info)
}
</script>
```

## API

### 指令参数

| 参数 | 类型 | 必需 | 说明 |
|------|------|------|------|
| rules | `SizableClassRule` | 否 | 尺寸规则配置对象 |
| callback | `(info: ResizeInfo) => void` | 否 | 尺寸变化回调函数 |
| debounce | `number` | 否 | 防抖延迟时间（毫秒） |

### 规则格式

规则对象的键名必须符合以下格式：
- `gt-{数字}`: 当元素宽度大于指定像素值时应用类
- `lt-{数字}`: 当元素宽度小于指定像素值时应用类

```typescript
interface SizableClassRule {
  [key: string]: string
}

// 示例
{
  'gt-768': 'desktop-class',    // 宽度 > 768px 时应用
  'lt-768': 'mobile-class',     // 宽度 < 768px 时应用
  'gt-1024': 'large-class',     // 宽度 > 1024px 时应用
  'lt-480': 'small-class'       // 宽度 < 480px 时应用
}
```

### 回调函数参数

```typescript
interface ResizeInfo {
  width: number                    // 元素宽度
  height: number                   // 元素高度
  contentRect: DOMRectReadOnly     // 内容区域尺寸
  borderBoxSize: ReadonlyArray<ResizeObserverSize>      // 边框盒尺寸
  contentBoxSize: ReadonlyArray<ResizeObserverSize>     // 内容盒尺寸
  devicePixelContentBoxSize: ReadonlyArray<ResizeObserverSize>  // 设备像素内容盒尺寸
}
```

### TypeScript 类型

```typescript
import type { ResizeOptions, SizableClassRule, ResizeInfo } from 'vue-directive-element-resize-observer'

// 使用类型
const options: ResizeOptions = {
  rules: {
    'gt-768': 'desktop',
    'lt-768': 'mobile'
  },
  callback: (info: ResizeInfo) => {
    console.log('尺寸变化:', info)
  },
  debounce: 100
}
```

## 高级用法

### 动态规则

```vue
<template>
  <div 
    v-resize="{
      rules: dynamicRules,
      callback: handleResize,
      debounce: 50
    }"
  >
    动态响应式内容
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { SizableClassRule, ResizeInfo } from 'vue-directive-element-resize-observer'

const breakpoints = ref([480, 768, 1024])
const dynamicRules = computed((): SizableClassRule => {
  const rules: SizableClassRule = {}
  
  breakpoints.value.forEach(bp => {
    rules[`gt-${bp}`] = `gt-${bp}`
    rules[`lt-${bp}`] = `lt-${bp}`
  })
  
  return rules
})

const handleResize = (info: ResizeInfo) => {
  console.log('动态规则尺寸变化:', info)
}
</script>
```

### 复杂回调处理

```vue
<template>
  <div v-resize="{ callback: handleComplexResize }">
    复杂处理内容
  </div>
</template>

<script setup lang="ts">
import type { ResizeInfo } from 'vue-directive-element-resize-observer'

const handleComplexResize = (info: ResizeInfo) => {
  const { width, height } = info
  
  // 计算宽高比
  const aspectRatio = width / height
  
  // 计算面积
  const area = width * height
  
  // 根据尺寸执行不同逻辑
  if (area > 100000) {
    console.log('大尺寸元素')
  } else if (aspectRatio > 2) {
    console.log('宽屏元素')
  } else if (aspectRatio < 0.5) {
    console.log('竖屏元素')
  }
}
</script>
```

## 性能优化

### 共享观察器模式

本组件采用共享ResizeObserver模式，相比为每个元素创建独立观察器的传统方式，具有以下优势：

- **内存占用减少**: 多个元素共享一个ResizeObserver实例
- **性能提升**: 批量处理尺寸变化，减少回调次数
- **资源管理**: 自动管理观察器生命周期，防止内存泄漏

### 性能测试

```javascript
// 在浏览器控制台中运行性能测试
import { performanceTest } from 'vue-directive-element-resize-observer/src/performance-test'

// 运行完整性能测试
performanceTest.runFullTest()

// 测试特定数量的元素
performanceTest.testObserverManagerPerformance(100)

// 测试回调函数性能
performanceTest.testCallbackPerformance(50)
```

## 注意事项

1. **浏览器兼容性**: 需要支持ResizeObserver API的现代浏览器
2. **性能考虑**: 建议使用防抖配置，避免频繁的DOM操作
3. **CSS优先级**: 动态添加的类名会覆盖原有的类，注意CSS优先级
4. **内存管理**: 指令会自动清理ResizeObserver，无需手动处理
5. **共享观察器**: 所有使用指令的元素共享同一个观察器实例，性能更优
6. **回调函数**: 回调函数会在元素尺寸变化时执行，注意性能影响
7. **Vue版本**: 支持Vue2.6+和Vue3.x，自动检测版本并使用相应的API

## 浏览器支持

- Chrome 64+
- Firefox 69+
- Safari 13.1+
- Edge 79+

## 许可证

ISC 