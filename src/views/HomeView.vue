<script setup>
import { ref, computed } from 'vue'
import { apiModules } from '../data/apiData'
import { useRouter } from 'vue-router'

const router = useRouter()
const searchQuery = ref('')
const totalApis = computed(() => apiModules.reduce((sum, mod) => sum + mod.apis.length, 0))

const filteredModules = computed(() => {
  const q = searchQuery.value.toLowerCase().trim()
  if (!q) return apiModules
  return apiModules.filter(mod =>
    mod.name.toLowerCase().includes(q) || mod.description.toLowerCase().includes(q) ||
    mod.apis.some(api => api.title.toLowerCase().includes(q) || api.description.toLowerCase().includes(q))
  )
})

function goToModule(id) { router.push(`/api/${id}`) }
</script>

<template>
  <div class="home">
    <div class="hero">
      <h1>🐉 青龙面板 API 文档</h1>
      <p class="subtitle">Qinglong Panel API Documentation</p>
      <p class="desc">完整的青龙面板 Open API 接口文档，与 <a href="https://qinglong.online/api/index" target="_blank">官方文档</a> 完全同步。</p>
      <div class="stats">
        <div class="stat"><span class="stat-num">{{ apiModules.length }}</span><span class="stat-label">模块</span></div>
        <div class="stat"><span class="stat-num">{{ totalApis }}</span><span class="stat-label">接口</span></div>
        <div class="stat"><span class="stat-num">100%</span><span class="stat-label">覆盖官方</span></div>
      </div>
      <div class="search-box">
        <input v-model="searchQuery" type="text" placeholder="搜索模块或接口..." class="search-input" />
        <span class="search-icon">🔍</span>
      </div>
      <div class="links">
        <a href="https://github.com/whyour/qinglong" target="_blank" class="link">GitHub</a>
        <a href="https://qinglong.online" target="_blank" class="link">官方文档</a>
        <a href="https://t.me/jiao_long" target="_blank" class="link">Telegram</a>
      </div>
    </div>
    <div class="grid">
      <div v-for="m in filteredModules" :key="m.id" class="card" @click="goToModule(m.id)">
        <div class="card-icon">{{ m.icon }}</div>
        <h3>{{ m.name }}</h3>
        <p>{{ m.description }}</p>
        <span class="count">{{ m.apis.length }} 个接口</span>
      </div>
      <div v-if="!filteredModules.length" class="no-result"><p>😕 没有找到匹配的模块</p></div>
    </div>
    <footer class="footer"><p>基于 Vue 3 + Vite | 数据来源: <a href="https://qinglong.online" target="_blank">qinglong.online</a></p></footer>
  </div>
</template>

<style scoped>
.home { max-width: 1200px; margin: 0 auto; padding: 2rem; }
.hero { text-align: center; padding: 3rem 0; border-bottom: 1px solid var(--border-color); margin-bottom: 2rem; }
.hero h1 { font-size: 2.2rem; margin-bottom: .5rem; background: linear-gradient(135deg,#667eea,#764ba2); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.subtitle { font-size: 1.1rem; color: var(--text-secondary); margin-bottom: .5rem; }
.desc { color: var(--text-muted); max-width: 600px; margin: 0 auto 1.5rem; line-height: 1.7; }
.stats { display: flex; justify-content: center; gap: 2.5rem; margin: 1.5rem auto; padding: 1rem 1.5rem; background: var(--bg-card); border-radius: 12px; max-width: 500px; border: 1px solid var(--border-color); box-shadow: 0 2px 6px rgba(0,0,0,.04); }
.stat { text-align: center; }
.stat-num { display: block; font-size: 1.8rem; font-weight: 700; background: linear-gradient(135deg,#667eea,#764ba2); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.stat-label { font-size: .82rem; color: var(--text-muted); }
.search-box { position: relative; max-width: 450px; margin: 0 auto 1.5rem; }
.search-input { width: 100%; padding: .75rem 1rem .75rem 2.6rem; border: 2px solid var(--border-color); border-radius: 10px; font-size: 1rem; background: var(--bg-secondary); color: var(--text-primary); box-sizing: border-box; transition: all .3s; }
.search-input:focus { outline: none; border-color: #667eea; box-shadow: 0 0 0 3px rgba(102,126,234,.1); }
.search-icon { position: absolute; left: .9rem; top: 50%; transform: translateY(-50%); font-size: 1rem; }
.links { display: flex; justify-content: center; gap: .75rem; flex-wrap: wrap; }
.link { color: #667eea; text-decoration: none; padding: .35rem .9rem; border: 1px solid var(--border-color); border-radius: 18px; font-size: .88rem; transition: all .3s; }
.link:hover { background: #667eea; color: #fff; border-color: #667eea; }
.grid { display: grid; grid-template-columns: repeat(auto-fill,minmax(260px,1fr)); gap: 1.25rem; padding: 1rem 0; }
.card { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 14px; padding: 1.4rem; cursor: pointer; transition: all .3s; position: relative; overflow: hidden; }
.card::before { content:''; position: absolute; top:0; left:0; right:0; height: 3px; background: linear-gradient(135deg,#667eea,#764ba2); transform: scaleX(0); transition: transform .3s; }
.card:hover { transform: translateY(-3px); box-shadow: 0 6px 20px rgba(102,126,234,.12); border-color: #667eea; }
.card:hover::before { transform: scaleX(1); }
.card-icon { font-size: 2.2rem; margin-bottom: .7rem; }
.card h3 { font-size: 1.1rem; margin-bottom: .4rem; color: var(--text-primary); }
.card p { color: var(--text-muted); font-size: .88rem; line-height: 1.5; margin-bottom: .8rem; }
.count { display: inline-block; background: var(--bg-secondary); padding: .2rem .55rem; border-radius: 10px; font-size: .78rem; color: var(--text-secondary); }
.no-result { text-align: center; padding: 3rem; color: var(--text-muted); grid-column: 1/-1; }
.footer { text-align: center; padding: 1.5rem 0; margin-top: 1.5rem; border-top: 1px solid var(--border-color); color: var(--text-muted); font-size: .88rem; }
.footer a { color: #667eea; text-decoration: none; }
@media (max-width:768px) { .hero h1 { font-size: 1.7rem; } .grid { grid-template-columns: 1fr; } .stats { gap: 1.5rem; } }
</style>
