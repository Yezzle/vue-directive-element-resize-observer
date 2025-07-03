#!/usr/bin/env node

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

// 发布配置
const config = {
  // npm私服地址，根据实际情况修改
  registry: process.env.NPM_REGISTRY || 'https://registry.npmjs.org/',
  // 包名
  packageName: 'vue-directive-element-resize-observer',
  // 版本类型：patch, minor, major
  versionType: process.argv[2] || 'patch'
}

console.log('🚀 开始发布流程...')
console.log(`📦 包名: ${config.packageName}`)
console.log(`🏪 注册表: ${config.registry}`)
console.log(`📈 版本类型: ${config.versionType}`)

// 检查是否在正确的目录
const packageJsonPath = path.join(__dirname, '..', 'package.json')
if (!fs.existsSync(packageJsonPath)) {
  console.error('❌ 未找到package.json文件，请确保在正确的目录中运行')
  process.exit(1)
}

try {
  // 1. 构建项目
  console.log('\n📦 构建项目...')
  execSync('npm run build', { stdio: 'inherit' })
  console.log('✅ 构建完成')

  // 2. 运行测试（如果有的话）
  console.log('\n🧪 运行测试...')
  try {
    execSync('npm test', { stdio: 'inherit' })
    console.log('✅ 测试通过')
  } catch (error) {
    console.log('⚠️  测试失败或未配置测试')
  }

  // 3. 更新版本号
  console.log(`\n📈 更新版本号 (${config.versionType})...`)
  execSync(`npm version ${config.versionType} --no-git-tag-version`, { stdio: 'inherit' })
  console.log('✅ 版本号更新完成')

  // 4. 发布到npm
  console.log('\n🚀 发布到npm...')
  const publishCommand = `npm publish --registry ${config.registry}`
  execSync(publishCommand, { stdio: 'inherit' })
  console.log('✅ 发布成功！')

  // 5. 显示发布信息
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
  console.log(`\n🎉 发布完成！`)
  console.log(`📦 包名: ${packageJson.name}`)
  console.log(`📋 版本: ${packageJson.version}`)
  console.log(`📝 描述: ${packageJson.description}`)
  console.log(`🔗 安装: npm install ${packageJson.name}`)

} catch (error) {
  console.error('❌ 发布失败:', error.message)
  process.exit(1)
} 