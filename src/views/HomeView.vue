<script setup>
import { ref, computed } from 'vue'
import { apiModules } from '../data/apiData'
import { useRouter } from 'vue-router'

const router = useRouter()
const searchQuery = ref('')
const showApifoxModal = ref(false)

const totalApis = computed(() =>
  apiModules.reduce((sum, mod) => sum + mod.apis.length, 0)
)

const openApiUrl = window.location.origin + window.location.pathname.replace(/\/$/, '') + '/test1111/openapi.json'

const filteredModules = ref(apiModules)

function filterModules() {
  const query = searchQuery.value.toLowerCase().trim()
  if (!query) {
    filteredModules.value = apiModules
    return
  }
  filteredModules.value = apiModules.filter(mod =>
    mod.name.toLowerCase().includes(query) ||
    mod.description.toLowerCase().includes(query) ||
    mod.apis.some(api =>
      api.title.toLowerCase().includes(query) ||
      api.description.toLowerCase().includes(query)
    )
  )
}

function goToModule(moduleId) {
  router.push(`/api/${moduleId}`)
}

function downloadOpenApi() {
  const link = document.createElement('a')
  link.href = '/test1111/openapi.json'
  link.download = 'qinglong-openapi.json'
  link.click()
}

function copyOpenApiUrl() {
  const url = window.location.origin + window.location.pathname + '#/openapi.json'
  navigator.clipboard.writeText(url).then(() => {
    alert('OpenAPI URL 已复制到剪贴板！\n\n在 Apifox 中选择「导入数据」→「URL」粘贴即可。')
  })
}
</script>

<template>
  <div class="home-container">
    <div class="hero">
      <h1>🐉 青龙面板 API 文档</h1>
      <p class="subtitle">Qinglong Panel API Documentation</p>
      <p class="desc">完整的青龙面板 Open API 接口文档，与 <a href="https://qinglong.online/api/index" target="_blank">官方文档</a> 完全同步，涵盖 9 个模块、{{ totalApis }} 个接口的全部 API。</p>
      
      <!-- API 统计 -->
      <div class="stats-bar">
        <div class="stat-item">
          <span class="stat-num">{{ apiModules.length }}</span>
          <span class="stat-label">模块</span>
        </div>
        <div class="stat-item">
          <span class="stat-num">{{ totalApis }}</span>
          <span class="stat-label">接口</span>
        </div>
        <div class="stat-item">
          <span class="stat-num">100%</span>
          <span class="stat-label">覆盖官方文档</span>
        </div>
      </div>

      <!-- Apifox 导入按钮 -->
      <div class="apifox-section">
        <button class="apifox-btn" @click="showApifoxModal = true">
          <span class="apifox-icon">🦊</span>
          <span>导入到 Apifox</span>
        </button>
        <p class="apifox-hint">支持 OpenAPI 3.0 格式，一键导入所有 {{ totalApis }} 个接口到 Apifox</p>
      </div>

      <div class="search-box">
        <input
          v-model="searchQuery"
          @input="filterModules"
          type="text"
          placeholder="搜索 API 模块或接口..."
          class="search-input"
        />
        <span class="search-icon">🔍</span>
      </div>

      <div class="quick-links">
        <a href="https://github.com/whyour/qinglong" target="_blank" class="quick-link">
          GitHub 仓库
        </a>
        <a href="https://qinglong.online" target="_blank" class="quick-link">
          官方文档
        </a>
        <a href="https://t.me/jiao_long" target="_blank" class="quick-link">
          Telegram 频道
        </a>
      </div>
    </div>

    <div class="modules-grid">
      <div
        v-for="module in filteredModules"
        :key="module.id"
        class="module-card"
        @click="goToModule(module.id)"
      >
        <div class="module-icon">{{ module.icon }}</div>
        <h3>{{ module.name }}</h3>
        <p>{{ module.description }}</p>
        <div class="api-count">{{ module.apis.length }} 个接口</div>
      </div>

      <div v-if="filteredModules.length === 0" class="no-result">
        <p>😕 没有找到匹配的 API</p>
        <p>请尝试其他关键词</p>
      </div>
    </div>

    <!-- Apifox 导入弹窗 -->
    <div v-if="showApifoxModal" class="modal-overlay" @click.self="showApifoxModal = false">
      <div class="modal-content">
        <div class="modal-header">
          <h2>🦊 导入到 Apifox</h2>
          <button class="modal-close" @click="showApifoxModal = false">×</button>
        </div>
        
        <div class="modal-body">
          <p class="modal-desc">
            青龙面板全部 {{ totalApis }} 个 API 接口已生成 OpenAPI 3.0 规范文件，可通过以下任一方式导入到 Apifox：
          </p>

          <div class="import-method">
            <div class="method-title">
              <span class="method-num">1</span>
              <span>通过 URL 导入（推荐）</span>
            </div>
            <p>复制下方链接，在 Apifox 中选择「导入数据」→「URL」粘贴：</p>
            <div class="url-box">
              <code id="openapi-url">{{ openApiUrl }}</code>
              <button class="copy-btn" @click="copyOpenApiUrl" title="复制链接">📋</button>
            </div>
          </div>

          <div class="import-method">
            <div class="method-title">
              <span class="method-num">2</span>
              <span>下载 JSON 文件后导入</span>
            </div>
            <p>点击下方按钮下载 OpenAPI 文件，然后在 Apifox 中选择「导入数据」→「OpenAPI/Swagger」→「文件」上传：</p>
            <button class="download-btn" @click="downloadOpenApi">
              📥 下载 qinglong-openapi.json
            </button>
          </div>

          <div class="import-steps">
            <h4>📖 详细操作步骤：</h4>
            <ol>
              <li>打开 Apifox，进入目标项目</li>
              <li>点击左侧菜单「导入数据」</li>
              <li>选择「OpenAPI/Swagger」格式</li>
              <li>切换到「URL」标签页，粘贴上方链接（或选择「文件」上传下载的 JSON）</li>
              <li>点击「确定」完成导入</li>
            </ol>
          </div>
        </div>

        <div class="modal-footer">
          <a href="https://apifox.com" target="_blank" class="apifox-link">
            还没有 Apifox？ → 前往官网下载
          </a>
        </div>
      </div>
    </div>

    <footer class="home-footer">
      <p>基于 Vue 3 + Vite 构建 | 数据来源: <a href="https://qinglong.online" target="_blank">qinglong.online</a></p>
    </footer>
  </div>
</template>

<style scoped>
.home-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.hero {
  text-align: center;
  padding: 3rem 0;
  border-bottom: 1px solid var(--border-color);
  margin-bottom: 2rem;
}

.hero h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  font-size: 1.2rem;
  color: var(--text-secondary);
  margin-bottom: 1rem;
}

.desc {
  color: var(--text-muted);
  max-width: 700px;
  margin: 0 auto 2rem;
  line-height: 1.8;
}

.search-box {
  position: relative;
  max-width: 500px;
  margin: 0 auto 1.5rem;
}

.search-input {
  width: 100%;
  padding: 0.8rem 1.2rem 0.8rem 2.8rem;
  border: 2px solid var(--border-color);
  border-radius: 12px;
  font-size: 1rem;
  background: var(--bg-secondary);
  color: var(--text-primary);
  transition: all 0.3s;
  box-sizing: border-box;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.1rem;
}

.quick-links {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.quick-link {
  color: #667eea;
  text-decoration: none;
  padding: 0.4rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 20px;
  font-size: 0.9rem;
  transition: all 0.3s;
}

.quick-link:hover {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.modules-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  padding: 1rem 0;
}

.module-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
}

.module-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  transform: scaleX(0);
  transition: transform 0.3s;
}

.module-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.15);
  border-color: #667eea;
}

.module-card:hover::before {
  transform: scaleX(1);
}

.module-icon {
  font-size: 2.5rem;
  margin-bottom: 0.8rem;
}

.module-card h3 {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
}

.module-card p {
  color: var(--text-muted);
  font-size: 0.9rem;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.api-count {
  display: inline-block;
  background: var(--bg-secondary);
  padding: 0.25rem 0.6rem;
  border-radius: 12px;
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.no-result {
  text-align: center;
  padding: 3rem;
  color: var(--text-muted);
  grid-column: 1 / -1;
}

.home-footer {
  text-align: center;
  padding: 2rem 0;
  margin-top: 2rem;
  border-top: 1px solid var(--border-color);
  color: var(--text-muted);
  font-size: 0.9rem;
}

.home-footer a {
  color: #667eea;
  text-decoration: none;
}

@media (max-width: 768px) {
  .hero h1 {
    font-size: 1.8rem;
  }
  
  .modules-grid {
    grid-template-columns: 1fr;
  }
}

/* 统计栏 */
.stats-bar {
  display: flex;
  justify-content: center;
  gap: 3rem;
  margin: 1.5rem auto;
  padding: 1.5rem;
  background: var(--bg-card);
  border-radius: 12px;
  max-width: 600px;
  border: 1px solid var(--border-color);
}

.stat-item {
  text-align: center;
}

.stat-num {
  display: block;
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-label {
  font-size: 0.85rem;
  color: var(--text-muted);
}

/* Apifox 区域 */
.apifox-section {
  margin: 1.5rem auto;
  text-align: center;
}

.apifox-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #e67e22 0%, #d35400 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 15px rgba(230, 126, 34, 0.3);
}

.apifox-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(230, 126, 34, 0.4);
}

.apifox-icon {
  font-size: 1.3rem;
}

.apifox-hint {
  font-size: 0.85rem;
  color: var(--text-muted);
  margin-top: 0.5rem;
}

/* 弹窗 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
  backdrop-filter: blur(4px);
}

.modal-content {
  background: var(--bg-card);
  border-radius: 16px;
  max-width: 560px;
  width: 100%;
  max-height: 85vh;
  overflow-y: auto;
  border: 1px solid var(--border-color);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.modal-header h2 {
  margin: 0;
  font-size: 1.3rem;
  color: var(--text-primary);
}

.modal-close {
  background: transparent;
  border: none;
  color: var(--text-muted);
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.25rem;
  line-height: 1;
  transition: color 0.3s;
}

.modal-close:hover {
  color: var(--text-primary);
}

.modal-body {
  padding: 1.5rem;
}

.modal-desc {
  color: var(--text-primary);
  margin-bottom: 1.5rem;
  line-height: 1.7;
}

.import-method {
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: var(--bg-secondary);
  border-radius: 8px;
}

.method-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.method-num {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  background: #667eea;
  color: white;
  border-radius: 50%;
  font-size: 0.8rem;
  font-weight: 700;
}

.url-box {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.url-box code {
  flex: 1;
  background: var(--bg-card);
  padding: 0.6rem 1rem;
  border-radius: 6px;
  font-size: 0.85rem;
  color: #667eea;
  overflow-x: auto;
  border: 1px solid var(--border-color);
  word-break: break-all;
}

.copy-btn {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  padding: 0.4rem 0.75rem;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s;
}

.copy-btn:hover {
  background: var(--border-color);
}

.download-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 0.6rem 1.25rem;
  border-radius: 8px;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 500;
}

.download-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.import-steps {
  background: var(--bg-secondary);
  padding: 1rem 1.25rem;
  border-radius: 8px;
  margin-top: 1rem;
}

.import-steps h4 {
  margin: 0 0 0.75rem;
  color: var(--text-primary);
  font-size: 0.95rem;
}

.import-steps ol {
  margin: 0;
  padding-left: 1.25rem;
  color: var(--text-muted);
  font-size: 0.9rem;
  line-height: 1.8;
}

.import-steps li {
  margin-bottom: 0.25rem;
}

.modal-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--border-color);
  text-align: center;
}

.apifox-link {
  color: var(--text-muted);
  font-size: 0.85rem;
}

.apifox-link:hover {
  color: #e67e22;
}

@media (max-width: 600px) {
  .stats-bar {
    gap: 1.5rem;
    padding: 1rem;
  }
  
  .stat-num {
    font-size: 1.5rem;
  }
  
  .modal-content {
    max-height: 90vh;
  }
}
</style>
