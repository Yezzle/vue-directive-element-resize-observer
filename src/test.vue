<template>
  <div class="test-container">
    <h1>指令测试</h1>
    
    <div 
      v-resize="{
        rules: {
          'gt-768': 'desktop',
          'lt-768': 'mobile'
        },
        callback: handleResize
      }"
      class="test-element"
    >
      <p>测试元素 - 当前宽度: {{ width }}px</p>
      <p>当前高度: {{ height }}px</p>
      <p>应用的类: {{ classes.join(', ') || '无' }}</p>
      <p>回调执行次数: {{ callbackCount }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { ResizeInfo } from './types'

const width = ref(0)
const height = ref(0)
const classes = ref<string[]>([])
const callbackCount = ref(0)

const handleResize = (info: ResizeInfo) => {
  width.value = info.width
  height.value = info.height
  callbackCount.value++
}

onMounted(() => {
  const updateWidth = () => {
    width.value = window.innerWidth
  }
  
  updateWidth()
  window.addEventListener('resize', updateWidth)
})
</script>

<style scoped>
.test-container {
  padding: 20px;
}

.test-element {
  padding: 20px;
  border: 2px solid #ccc;
  border-radius: 8px;
  margin: 20px 0;
  transition: all 0.3s ease;
}

.desktop {
  background-color: #e3f2fd;
  border-color: #2196f3;
}

.mobile {
  background-color: #f3e5f5;
  border-color: #9c27b0;
}
</style> 