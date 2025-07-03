const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

// 确保dist目录存在
const distDir = path.join(__dirname, 'dist')
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true })
}

// 编译TypeScript
console.log('编译TypeScript...')
try {
  execSync('npx tsc', { stdio: 'inherit' })
  console.log('TypeScript编译完成')
} catch (error) {
  console.error('TypeScript编译失败:', error.message)
  process.exit(1)
}

// 复制package.json到dist目录
console.log('复制package.json...')
const packageJson = require('./package.json')
const distPackageJson = {
  ...packageJson,
  main: 'index.js',
  types: 'index.d.ts',
  files: ['*.js', '*.d.ts', 'src/**/*.js', 'src/**/*.d.ts']
}
fs.writeFileSync(
  path.join(distDir, 'package.json'),
  JSON.stringify(distPackageJson, null, 2)
)

// 复制src目录到dist（如果需要）
const srcDir = path.join(__dirname, 'src')
const distSrcDir = path.join(distDir, 'src')
if (fs.existsSync(srcDir)) {
  console.log('复制src目录...')
  if (!fs.existsSync(distSrcDir)) {
    fs.mkdirSync(distSrcDir, { recursive: true })
  }
  
  // 复制编译后的文件
  const files = fs.readdirSync(srcDir)
  files.forEach(file => {
    if (file.endsWith('.js') || file.endsWith('.d.ts')) {
      fs.copyFileSync(
        path.join(srcDir, file),
        path.join(distSrcDir, file)
      )
    }
  })
}

console.log('构建完成！') 