<script setup>
import { ref, computed } from 'vue'
import { apiModules } from '../data/apiData'

const searchQuery = ref('')
const activeModuleId = ref(apiModules[0].id)
const selectedApi = ref(null)
const showApifoxModal = ref(false)

const totalApis = computed(() =>
  apiModules.reduce((sum, mod) => sum + mod.apis.length, 0)
)

const openApiUrl = window.location.origin + window.location.pathname.replace(/\/$/, '') + '/ql-api-swagger/openapi.json'

const activeModule = computed(() =>
  apiModules.find(m => m.id === activeModuleId.value)
)

const filteredModules = computed(() => {
  const query = searchQuery.value.toLowerCase().trim()
  if (!query) return apiModules
  return apiModules.filter(mod =>
    mod.name.toLowerCase().includes(query) ||
    mod.description.toLowerCase().includes(query) ||
    mod.apis.some(api =>
      api.title.toLowerCase().includes(query) ||
      api.description.toLowerCase().includes(query)
    )
  )
})

function selectApi(api) {
  selectedApi.value = api
}

function downloadOpenApi() {
  const link = document.createElement('a')
  link.href = '/ql-api-swagger/openapi.json'
  link.download = 'qinglong-openapi.json'
  link.click()
}

function copyOpenApiUrl() {
  const url = window.location.origin + window.location.pathname + '#/openapi.json'
  navigator.clipboard.writeText(url).then(() => {
    alert('OpenAPI URL 已复制到剪贴板！\n\n在 Apifox 中选择「导入数据」→「URL」粘贴即可。')
  })
}

function methodClass(method) {
  return `method-${method.toLowerCase()}`
}

function renderNote(text) {
  if (!text) return ''
  return text
    .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre class="inline-code-block"><code>$2</code></pre>')
    .replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br/>')
}
</script>

<template>
  <div class="home-container">
    <!-- Hero Section -->
    <div class="hero">
      <h1>🐉 青龙面板 API 文档</h1>
      <p class="subtitle">Qinglong Panel API Documentation</p>
      <p class="desc">完整的青龙面板 Open API 接口文档，与 <a href="https://qinglong.online/api/index" target="_blank">官方文档</a> 完全同步，涵盖 {{ apiModules.length }} 个模块、{{ totalApis }} 个接口的全部 API。</p>

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
          type="text"
          placeholder="搜索 API 模块或接口..."
          class="search-input"
        />
        <span class="search-icon">🔍</span>
      </div>

      <div class="quick-links">
        <a href="https://github.com/whyour/qinglong" target="_blank" class="quick-link">GitHub 仓库</a>
        <a href="https://qinglong.online" target="_blank" class="quick-link">官方文档</a>
        <a href="https://t.me/jiao_long" target="_blank" class="quick-link">Telegram 频道</a>
      </div>
    </div>

    <!-- Tabs Navigation -->
    <div class="tabs-wrapper">
      <div class="tabs-header">
        <button
          v-for="mod in filteredModules"
          :key="mod.id"
          :class="['tab-btn', { active: activeModuleId === mod.id }]"
          @click="activeModuleId = mod.id; selectedApi = null"
        >
          <span class="tab-icon">{{ mod.icon }}</span>
          <span class="tab-name">{{ mod.name }}</span>
          <span class="tab-count">{{ mod.apis.length }}</span>
        </button>
      </div>

      <div class="tab-content" v-if="activeModule">
        <!-- Left: API List -->
        <aside class="api-sidebar">
          <div class="sidebar-header">
            <h3>{{ activeModule.name }} · 接口列表 ({{ activeModule.apis.length }})</h3>
            <span class="base-url-badge">基础路径：<code>{{ activeModule.baseUrl }}</code></span>
          </div>
          <div class="api-list">
            <div
              v-for="(api, idx) in activeModule.apis"
              :key="idx"
              :class="['api-item', { active: selectedApi === api }]"
              @click="selectApi(api)"
            >
              <span v-if="api.method" class="method-badge" :class="methodClass(api.method)">
                {{ api.method }}
              </span>
              <span class="api-item-title">{{ api.title }}</span>
            </div>
          </div>
        </aside>

        <!-- Right: API Detail -->
        <main class="api-content">
          <div v-if="selectedApi" class="api-detail">
            <div class="api-detail-header">
              <h2>{{ selectedApi.title }}</h2>
              <div class="api-meta">
                <span v-if="selectedApi.method" class="method-tag" :class="methodClass(selectedApi.method)">
                  {{ selectedApi.method }}
                </span>
                <code class="path-tag">{{ selectedApi.path }}</code>
              </div>
            </div>

            <p class="api-description">{{ selectedApi.description }}</p>

            <div v-if="selectedApi.params && selectedApi.params.length > 0" class="detail-section">
              <h3>📋 请求参数</h3>
              <div class="params-table-wrapper">
                <table class="params-table">
                  <thead>
                    <tr>
                      <th>参数名</th>
                      <th>类型</th>
                      <th>必填</th>
                      <th>说明</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(param, pidx) in selectedApi.params" :key="pidx">
                      <td><code>{{ param.name }}</code></td>
                      <td><span class="type-badge">{{ param.type }}</span></td>
                      <td>
                        <span v-if="param.required" class="required-badge">必填</span>
                        <span v-else class="optional-badge">可选</span>
                      </td>
                      <td>{{ param.desc }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div v-if="selectedApi.body" class="detail-section">
              <h3>📤 请求体 (Body)</h3>
              <pre class="code-block"><code>{{ selectedApi.body }}</code></pre>
            </div>

            <div v-if="selectedApi.response" class="detail-section">
              <h3>📥 响应示例</h3>
              <pre class="code-block"><code>{{ selectedApi.response }}</code></pre>
            </div>

            <div v-if="selectedApi.note" class="detail-section">
              <h3>💡 注意事项</h3>
              <div class="note-box" v-html="renderNote(selectedApi.note)"></div>
            </div>
          </div>

          <div v-else class="no-selection">
            <p>👈 请从左侧选择一个 API 接口查看详情</p>
          </div>
        </main>
      </div>
    </div>

    <footer class="home-footer">
      <p>基于 Vue 3 + Vite 构建 | 数据来源: <a href="https://qinglong.online" target="_blank">qinglong.online</a></p>
    </footer>

    <!-- Apifox Modal -->
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
  </div>
</template>

<style scoped>
.home-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
}

.hero {
  text-align: center;
  padding: 2rem 0 2.5rem;
  border-bottom: 1px solid var(--border-color);
  margin-bottom: 2rem;
}

.hero h1 {
  font-size: 2.2rem;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  font-size: 1.1rem;
  color: var(--text-secondary);
  margin-bottom: 0.75rem;
}

.desc {
  color: var(--text-muted);
  max-width: 700px;
  margin: 0 auto 1.5rem;
  line-height: 1.8;
}

.stats-bar {
  display: flex;
  justify-content: center;
  gap: 3rem;
  margin: 1.5rem auto;
  padding: 1.25rem 2rem;
  background: var(--bg-card);
  border-radius: 12px;
  max-width: 600px;
  border: 1px solid var(--border-color);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
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
  gap: 1rem;
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

/* Tabs */
.tabs-wrapper {
  margin-top: 2rem;
}

.tabs-header {
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  padding-bottom: 0;
  border-bottom: 2px solid var(--border-color);
  margin-bottom: 0;
  -webkit-overflow-scrolling: touch;
}

.tabs-header::-webkit-scrollbar {
  height: 0;
}

.tab-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: transparent;
  border: none;
  border-bottom: 3px solid transparent;
  color: var(--text-secondary);
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  margin-bottom: -2px;
}

.tab-btn:hover {
  color: #667eea;
}

.tab-btn.active {
  color: #667eea;
  border-bottom-color: #667eea;
}

.tab-icon {
  font-size: 1.1rem;
}

.tab-name {
  font-weight: 600;
}

.tab-count {
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.1rem 0.5rem;
  border-radius: 10px;
  min-width: 1.5rem;
  text-align: center;
}

/* Tab Content Layout */
.tab-content {
  display: flex;
  border: 1px solid var(--border-color);
  border-top: none;
  border-radius: 0 0 12px 12px;
  overflow: hidden;
  min-height: 500px;
  max-height: calc(100vh - 400px);
  background: var(--bg-card);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.api-sidebar {
  width: 300px;
  border-right: 1px solid var(--border-color);
  overflow-y: auto;
  flex-shrink: 0;
  background: var(--bg-secondary);
}

.sidebar-header {
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
  position: sticky;
  top: 0;
  background: var(--bg-secondary);
  z-index: 1;
}

.sidebar-header h3 {
  margin: 0 0 0.5rem;
  font-size: 0.9rem;
  color: var(--text-primary);
}

.base-url-badge {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.base-url-badge code {
  background: rgba(102, 126, 234, 0.08);
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
  color: #667eea;
  font-size: 0.8rem;
}

.api-list {
  padding: 0.5rem;
}

.api-item {
  padding: 0.75rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: var(--text-primary);
}

.api-item:hover {
  background: rgba(102, 126, 234, 0.05);
}

.api-item.active {
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
  font-weight: 500;
}

.method-badge {
  font-size: 0.7rem;
  padding: 0.15rem 0.4rem;
  border-radius: 4px;
  font-weight: 600;
  flex-shrink: 0;
}

.method-get { background: #27ae60; color: white; }
.method-post { background: #e67e22; color: white; }
.method-put { background: #3498db; color: white; }
.method-delete { background: #e74c3c; color: white; }

.api-item-title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.api-content {
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
  background: var(--bg-card);
}

.api-detail {
  max-width: 900px;
  margin: 0 auto;
}

.api-detail-header {
  margin-bottom: 1.5rem;
}

.api-detail-header h2 {
  margin: 0 0 1rem;
  color: var(--text-primary);
  font-size: 1.5rem;
}

.api-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.method-tag {
  font-size: 0.85rem;
  padding: 0.3rem 0.6rem;
  border-radius: 6px;
  font-weight: 600;
}

.path-tag {
  background: rgba(102, 126, 234, 0.08);
  padding: 0.3rem 0.8rem;
  border-radius: 6px;
  color: #667eea;
  font-size: 0.9rem;
}

.api-description {
  color: var(--text-secondary);
  font-size: 1rem;
  line-height: 1.7;
  margin-bottom: 2rem;
}

.detail-section {
  margin-bottom: 2rem;
}

.detail-section h3 {
  font-size: 1.1rem;
  color: var(--text-primary);
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--border-color);
}

.params-table-wrapper {
  overflow-x: auto;
}

.params-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

.params-table th {
  background: var(--bg-secondary);
  padding: 0.75rem 1rem;
  text-align: left;
  color: var(--text-secondary);
  font-weight: 600;
  border-bottom: 2px solid var(--border-color);
}

.params-table td {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--border-color);
  color: var(--text-primary);
}

.params-table tr:hover td {
  background: var(--bg-secondary);
}

.params-table code {
  color: #667eea;
  font-size: 0.9rem;
}

.type-badge {
  background: var(--bg-secondary);
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.required-badge {
  background: rgba(231, 76, 60, 0.1);
  color: #e74c3c;
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
}

.optional-badge {
  background: rgba(52, 152, 219, 0.1);
  color: #3498db;
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
}

.code-block {
  background: #f8f9fa;
  color: #2d3748;
  padding: 1.25rem;
  border-radius: 8px;
  overflow-x: auto;
  font-size: 0.85rem;
  line-height: 1.6;
  border: 1px solid var(--border-color);
}

.note-box {
  background: rgba(102, 126, 234, 0.05);
  border-left: 4px solid #667eea;
  padding: 1rem 1.25rem;
  border-radius: 0 8px 8px 0;
  color: var(--text-primary);
  font-size: 0.9rem;
  line-height: 1.8;
}

.note-box :deep(.inline-code) {
  background: rgba(102, 126, 234, 0.08);
  padding: 0.15rem 0.4rem;
  border-radius: 4px;
  font-size: 0.85rem;
  color: #667eea;
}

.note-box :deep(pre.inline-code-block) {
  background: #f8f9fa;
  color: #2d3748;
  padding: 1rem;
  border-radius: 6px;
  overflow-x: auto;
  margin: 0.5rem 0;
  border: 1px solid var(--border-color);
}

.note-box :deep(pre.inline-code-block code) {
  background: transparent;
  padding: 0;
  color: inherit;
}

.no-selection {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--text-muted);
  font-size: 1.1rem;
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

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
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
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
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
  border: 1px solid var(--border-color);
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
  background: var(--bg-secondary);
  padding: 0.6rem 1rem;
  border-radius: 6px;
  font-size: 0.85rem;
  color: #667eea;
  overflow-x: auto;
  border: 1px solid var(--border-color);
  word-break: break-all;
}

.copy-btn {
  background: var(--bg-secondary);
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
  border: 1px solid var(--border-color);
}

.import-steps h4 {
  margin: 0 0 0.75rem;
  color: var(--text-primary);
  font-size: 0.95rem;
}

.import-steps ol {
  margin: 0;
  padding-left: 1.25rem;
  color: var(--text-secondary);
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

@media (max-width: 768px) {
  .hero h1 {
    font-size: 1.8rem;
  }

  .stats-bar {
    gap: 1.5rem;
    padding: 1rem;
  }

  .stat-num {
    font-size: 1.5rem;
  }

  .tab-content {
    flex-direction: column;
    max-height: none;
  }

  .api-sidebar {
    width: 100%;
    max-height: 250px;
    border-right: none;
    border-bottom: 1px solid var(--border-color);
  }

  .api-content {
    padding: 1rem;
  }
}
</style>
