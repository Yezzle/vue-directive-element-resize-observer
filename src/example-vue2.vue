<template>
  <div class="example-container">
    <h1>Vue Directive Element Resize Observer - Vue2 示例</h1>
    
    <!-- 基本响应式布局 -->
    <div class="demo-section">
      <h2>基本响应式布局</h2>
      <div 
        v-resize="{
          rules: {
            'gt-768': 'desktop-layout',
            'lt-768': 'mobile-layout',
            'gt-1024': 'large-screen',
            'lt-480': 'small-screen'
          }
        }"
        class="responsive-demo"
      >
        <div class="demo-content">
          <h3>响应式内容区域</h3>
          <p>当前宽度: {{ currentWidth }}px</p>
          <p>应用的类: {{ appliedClasses.join(', ') || '无' }}</p>
        </div>
      </div>
    </div>

    <!-- 回调函数示例 -->
    <div class="demo-section">
      <h2>回调函数示例</h2>
      <div 
        v-resize="{
          callback: handleResize,
          debounce: 200
        }"
        class="callback-demo"
      >
        <div class="demo-content">
          <h3>回调函数内容</h3>
          <p>当前尺寸: {{ resizeInfo.width }} × {{ resizeInfo.height }}</p>
          <p>宽高比: {{ aspectRatio.toFixed(2) }}</p>
          <p>面积: {{ area.toLocaleString() }}px²</p>
          <p>状态: {{ elementStatus }}</p>
        </div>
      </div>
    </div>

    <!-- 组合使用示例 -->
    <div class="demo-section">
      <h2>组合使用示例</h2>
      <div 
        v-resize="{
          rules: {
            'gt-768': 'desktop-theme',
            'lt-768': 'mobile-theme'
          },
          callback: handleCombinedResize,
          debounce: 100
        }"
        class="combined-demo"
      >
        <div class="demo-content">
          <h3>组合功能内容</h3>
          <p>当前宽度: {{ combinedWidth }}px</p>
          <p>当前高度: {{ combinedHeight }}px</p>
          <p>回调执行次数: {{ callbackCount }}</p>
        </div>
      </div>
    </div>

    <!-- 动态规则示例 -->
    <div class="demo-section">
      <h2>动态规则示例</h2>
      <div class="controls">
        <label>
          断点1: <input v-model.number="breakpoints[0]" type="number" min="100" max="1000" />
        </label>
        <label>
          断点2: <input v-model.number="breakpoints[1]" type="number" min="100" max="1000" />
        </label>
        <label>
          断点3: <input v-model.number="breakpoints[2]" type="number" min="100" max="1000" />
        </label>
      </div>
      <div 
        v-resize="{
          rules: dynamicRules,
          callback: handleDynamicResize,
          debounce: 100
        }"
        class="dynamic-demo"
      >
        <div class="demo-content">
          <h3>动态规则内容</h3>
          <p>当前断点: {{ breakpoints.join(', ') }}</p>
          <p>当前宽度: {{ dynamicWidth }}px</p>
          <p>匹配的规则: {{ matchedRules.join(', ') || '无' }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Vue2Example',
  data() {
    return {
      // 响应式数据
      currentWidth: 0,
      appliedClasses: [],
      breakpoints: [480, 768, 1024],

      // 回调函数相关数据
      resizeInfo: {
        width: 0,
        height: 0,
        contentRect: new DOMRect(),
        borderBoxSize: [],
        contentBoxSize: [],
        devicePixelContentBoxSize: []
      },

      // 组合使用相关数据
      combinedWidth: 0,
      combinedHeight: 0,
      callbackCount: 0,

      // 动态规则相关数据
      dynamicWidth: 0,
      matchedRules: []
    }
  },

  computed: {
    // 动态规则计算
    dynamicRules() {
      const rules = {}
      
      this.breakpoints.forEach(bp => {
        rules[`gt-${bp}`] = `gt-${bp}`
        rules[`lt-${bp}`] = `lt-${bp}`
      })
      
      return rules
    },

    // 计算属性
    aspectRatio() {
      if (this.resizeInfo.height === 0) return 0
      return this.resizeInfo.width / this.resizeInfo.height
    },

    area() {
      return this.resizeInfo.width * this.resizeInfo.height
    },

    elementStatus() {
      const { width, height } = this.resizeInfo
      if (width > 800 && height > 400) return '大尺寸'
      if (width > 500 && height > 200) return '中等尺寸'
      return '小尺寸'
    }
  },

  methods: {
    // 回调函数
    handleResize(info) {
      this.resizeInfo = info
    },

    handleCombinedResize(info) {
      this.combinedWidth = info.width
      this.combinedHeight = info.height
      this.callbackCount++
    },

    handleDynamicResize(info) {
      this.dynamicWidth = info.width
      
      // 计算匹配的规则
      const matched = []
      this.breakpoints.forEach(bp => {
        if (info.width > bp) {
          matched.push(`gt-${bp}`)
        } else {
          matched.push(`lt-${bp}`)
        }
      })
      this.matchedRules = matched
    },

    // 监听窗口大小变化
    updateWidth() {
      this.currentWidth = window.innerWidth
    },

    // 监听类名变化
    observeClassChanges() {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
            const target = mutation.target
            if (target.classList.contains('responsive-demo')) {
              this.appliedClasses = Array.from(target.classList).filter(cls => 
                cls.includes('desktop') || cls.includes('mobile') || 
                cls.includes('large') || cls.includes('small')
              )
            }
          }
        })
      })

      const demoElement = document.querySelector('.responsive-demo')
      if (demoElement) {
        observer.observe(demoElement, {
          attributes: true,
          attributeFilter: ['class']
        })
      }

      return observer
    }
  },

  mounted() {
    this.updateWidth()
    window.addEventListener('resize', this.updateWidth)
    this.classObserver = this.observeClassChanges()
  },

  beforeDestroy() {
    window.removeEventListener('resize', this.updateWidth)
    if (this.classObserver) {
      this.classObserver.disconnect()
    }
  }
}
</script>

<style scoped>
.example-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.demo-section {
  margin-bottom: 40px;
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
}

.demo-section h2 {
  margin-top: 0;
  color: #333;
}

.responsive-demo,
.callback-demo,
.combined-demo,
.dynamic-demo {
  padding: 20px;
  border: 2px solid #ddd;
  border-radius: 8px;
  transition: all 0.3s ease;
  min-height: 200px;
}

.demo-content {
  text-align: center;
}

.demo-content h3 {
  margin-top: 0;
  color: #555;
}

.controls {
  margin-bottom: 20px;
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.controls label {
  display: flex;
  align-items: center;
  gap: 8px;
}

.controls input {
  padding: 4px 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 80px;
}

/* 响应式样式 */
.desktop-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.mobile-layout {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.large-screen {
  font-size: 18px;
}

.small-screen {
  font-size: 14px;
}

.desktop-theme {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.mobile-theme {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
}

/* 动态规则样式 */
.gt-480 {
  border-color: #4CAF50;
}

.lt-480 {
  border-color: #FF9800;
}

.gt-768 {
  border-color: #2196F3;
}

.lt-768 {
  border-color: #9C27B0;
}

.gt-1024 {
  border-color: #FF5722;
}

.lt-1024 {
  border-color: #607D8B;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .controls {
    flex-direction: column;
    gap: 10px;
  }
  
  .controls label {
    justify-content: space-between;
  }
  
  .controls input {
    width: 100px;
  }
}
</style> 