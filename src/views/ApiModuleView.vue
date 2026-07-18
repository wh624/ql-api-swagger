<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { apiModules } from '../data/apiData'

const router = useRouter()
const route = useRoute()

const currentModule = ref(null)
const selectedApi = ref(null)
const activeSection = ref('overview')

onMounted(() => {
  const module = apiModules.find(m => m.id === route.params.moduleId)
  if (module) {
    currentModule.value = module
    if (module.apis.length > 0) {
      selectedApi.value = module.apis[0]
    }
  }
})

function selectApi(api) {
  selectedApi.value = api
  activeSection.value = 'apis'
}

function goBack() {
  router.push('/')
}

const methodClass = (method) => {
  const classes = {
    'GET': 'method-get',
    'POST': 'method-post',
    'PUT': 'method-put',
    'DELETE': 'method-delete'
  }
  return classes[method] || ''
}
</script>

<template>
  <div v-if="currentModule" class="module-page">
    <!-- 顶部导航 -->
    <div class="module-header">
      <button class="back-btn" @click="goBack">← 返回首页</button>
      <div class="module-title">
        <span class="module-icon">{{ currentModule.icon }}</span>
        <div>
          <h1>{{ currentModule.name }}</h1>
          <p>{{ currentModule.description }}</p>
        </div>
      </div>
      <div class="base-url">
        基础路径：<code>{{ currentModule.baseUrl }}</code>
      </div>
    </div>

    <!-- 主体内容 -->
    <div class="module-body">
      <!-- 左侧：API 列表 -->
      <aside class="api-sidebar">
        <div class="sidebar-header">
          <h3>接口列表 ({{ currentModule.apis.length }})</h3>
        </div>
        <div class="api-list">
          <div
            v-for="(api, index) in currentModule.apis"
            :key="index"
            class="api-item"
            :class="{ active: selectedApi === api }"
            @click="selectApi(api)"
          >
            <span v-if="api.method" class="method-badge" :class="methodClass(api.method)">
              {{ api.method }}
            </span>
            <span class="api-item-title">{{ api.title }}</span>
          </div>
        </div>
      </aside>

      <!-- 右侧：API 详情 -->
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

          <!-- 请求参数 -->
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
                  <tr v-for="(param, idx) in selectedApi.params" :key="idx">
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

          <!-- 请求体 -->
          <div v-if="selectedApi.body" class="detail-section">
            <h3>📤 请求体 (Body)</h3>
            <pre class="code-block"><code>{{ selectedApi.body }}</code></pre>
          </div>

          <!-- 响应示例 -->
          <div v-if="selectedApi.response" class="detail-section">
            <h3>📥 响应示例</h3>
            <pre class="code-block"><code>{{ selectedApi.response }}</code></pre>
          </div>

          <!-- 说明 -->
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

  <div v-else class="loading">
    <p>加载中...</p>
  </div>
</template>

<script>
export default {
  methods: {
    renderNote(text) {
      if (!text) return ''
      // 简单的 markdown 转 HTML
      return text
        .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre class="inline-code"><code>$2</code></pre>')
        .replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>')
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        .replace(/\n/g, '<br/>')
    }
  }
}
</script>

<style scoped>
.module-page {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 60px);
  overflow: hidden;
}

.module-header {
  background: var(--bg-card);
  border-bottom: 1px solid var(--border-color);
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  gap: 2rem;
  flex-shrink: 0;
}

.back-btn {
  background: transparent;
  border: 1px solid var(--border-color);
  padding: 0.4rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  color: var(--text-secondary);
  transition: all 0.3s;
  font-size: 0.9rem;
}

.back-btn:hover {
  background: var(--bg-secondary);
  color: var(--text-primary);
}

.module-title {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
}

.module-title .module-icon {
  font-size: 2rem;
}

.module-title h1 {
  font-size: 1.5rem;
  margin: 0;
  color: var(--text-primary);
}

.module-title p {
  margin: 0.25rem 0 0;
  color: var(--text-muted);
  font-size: 0.9rem;
}

.base-url {
  font-size: 0.9rem;
  color: var(--text-secondary);
  white-space: nowrap;
}

.base-url code {
  background: var(--bg-secondary);
  padding: 0.2rem 0.6rem;
  border-radius: 4px;
  color: #667eea;
}

.module-body {
  display: flex;
  flex: 1;
  overflow: hidden;
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
}

.sidebar-header h3 {
  margin: 0;
  font-size: 0.95rem;
  color: var(--text-secondary);
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
  background: var(--bg-card);
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
  background: var(--bg-secondary);
  padding: 0.3rem 0.8rem;
  border-radius: 6px;
  color: #667eea;
  font-size: 0.9rem;
}

.api-description {
  color: var(--text-muted);
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
  background: rgba(231, 76, 60, 0.15);
  color: #e74c3c;
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
}

.optional-badge {
  background: rgba(52, 152, 219, 0.15);
  color: #3498db;
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
}

.code-block {
  background: #1e1e2e;
  color: #cdd6f4;
  padding: 1.25rem;
  border-radius: 8px;
  overflow-x: auto;
  font-size: 0.85rem;
  line-height: 1.6;
  border: 1px solid var(--border-color);
}

.note-box {
  background: var(--bg-secondary);
  border-left: 4px solid #667eea;
  padding: 1rem 1.25rem;
  border-radius: 0 8px 8px 0;
  color: var(--text-primary);
  font-size: 0.9rem;
  line-height: 1.8;
}

.note-box :deep(.inline-code) {
  background: var(--bg-card);
  padding: 0.15rem 0.4rem;
  border-radius: 4px;
  font-size: 0.85rem;
  color: #667eea;
}

.note-box :deep(pre.inline-code) {
  background: #1e1e2e;
  color: #cdd6f4;
  padding: 1rem;
  border-radius: 6px;
  overflow-x: auto;
  margin: 0.5rem 0;
}

.no-selection {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--text-muted);
  font-size: 1.1rem;
}

.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  color: var(--text-muted);
}

@media (max-width: 768px) {
  .module-body {
    flex-direction: column;
  }
  
  .api-sidebar {
    width: 100%;
    max-height: 200px;
    border-right: none;
    border-bottom: 1px solid var(--border-color);
  }
  
  .module-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
  
  .api-content {
    padding: 1rem;
  }
}
</style>
