import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const distDir = './dist'
const indexHtml = join(distDir, 'index.html')
const version = Date.now()

let html = readFileSync(indexHtml, 'utf-8')

// 匹配 href="xxx.css" 或 src="xxx.js" 并添加 ?v= 参数（兼容 /> 和 > 结尾）
html = html.replace(/(href="[^"]+\.css)(?!\?v=)/g, `$1?v=${version}`)
html = html.replace(/(src="[^"]+\.js)(?!\?v=)/g, `$1?v=${version}`)

writeFileSync(indexHtml, html, 'utf-8')
console.log(`✅ 已添加版本参数 v=${version} 到资源引用`)
