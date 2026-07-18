<script setup>
import { ref } from 'vue'
import { apiModules } from '../data/apiData'
import { useRouter } from 'vue-router'

const router = useRouter()
const searchQuery = ref('')

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
</script>

<template>
  <div class="home-container">
    <div class="hero">
      <h1>🐉 青龙面板 API 文档</h1>
      <p class="subtitle">Qinglong Panel API Documentation</p>
      <p class="desc">完整的青龙面板 Open API 接口文档，涵盖定时任务、订阅管理、环境变量、配置文件、脚本管理、依赖管理、日志管理和系统设置等全部模块。</p>
      
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
</style>
