<script setup>
import { ref, computed } from 'vue'
import { apiModules } from '../data/apiData'
import { useRouter } from 'vue-router'

const router = useRouter()
const searchQuery = ref('')
const showApifoxModal = ref(false)
const totalApis = computed(() => apiModules.reduce((sum, mod) => sum + mod.apis.length, 0))

const openApiUrl = `${window.location.origin}${window.location.pathname}openapi.json`

const filteredModules = computed(() => {
  const q = searchQuery.value.toLowerCase().trim()
  if (!q) return apiModules
  return apiModules.filter(mod =>
    mod.name.toLowerCase().includes(q) || mod.description.toLowerCase().includes(q) ||
    mod.apis.some(api => api.title.toLowerCase().includes(q) || api.description.toLowerCase().includes(q))
  )
})

function goToModule(id) { router.push(`/api/${id}`) }

function copyOpenApiUrl() {
  navigator.clipboard.writeText(openApiUrl).then(() => {
    alert(`OpenAPI URL 已复制到剪贴板！\n\n${openApiUrl}\n\n在 Apifox 中选择「导入数据」→「URL」粘贴即可。`)
  })
}

function downloadOpenApi() {
  const link = document.createElement('a')
  link.href = openApiUrl
  link.download = 'qinglong-openapi.json'
  link.click()
}
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
      <button class="apifox-btn" @click="showApifoxModal=true">
        <span class="apifox-icon">🦊</span><span>导入到 Apifox</span>
      </button>
      <p class="apifox-hint">支持 OpenAPI 3.0 格式，一键导入所有 {{ totalApis }} 个接口</p>
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
    <!-- Apifox Modal -->
    <div v-if="showApifoxModal" class="modal-overlay" @click.self="showApifoxModal=false">
      <div class="modal-content">
        <div class="modal-header">
          <h2>🦊 导入到 Apifox</h2>
          <button class="modal-close" @click="showApifoxModal=false">×</button>
        </div>
        <div class="modal-body">
          <p class="modal-desc">青龙面板全部 {{ totalApis }} 个 API 接口已生成 OpenAPI 3.0 规范文件，可通过以下任一方式导入：</p>
          <div class="import-method">
            <div class="method-title"><span class="method-num">1</span><span>通过 URL 导入（推荐）</span></div>
            <p>复制下方链接，在 Apifox 中选择「导入数据」→「URL」粘贴：</p>
            <div class="url-box"><code>{{ openApiUrl }}</code><button class="copy-btn" @click="copyOpenApiUrl" title="复制">📋</button></div>
          </div>
          <div class="import-method">
            <div class="method-title"><span class="method-num">2</span><span>下载 JSON 文件后导入</span></div>
            <p>点击下方按钮下载 OpenAPI 文件，然后在 Apifox 中选择「导入数据」→「OpenAPI/Swagger」→「文件」上传：</p>
            <button class="download-btn" @click="downloadOpenApi">📥 下载 qinglong-openapi.json</button>
          </div>
          <div class="import-steps">
            <h4>📖 操作步骤：</h4>
            <ol><li>打开 Apifox，进入目标项目</li><li>点击左侧菜单「导入数据」</li><li>选择「OpenAPI/Swagger」格式</li><li>切换到「URL」标签页，粘贴上方链接（或选择「文件」上传下载的 JSON）</li><li>点击「确定」完成导入</li></ol>
          </div>
        </div>
        <div class="modal-footer"><a href="https://apifox.com" target="_blank" class="apifox-link">还没有 Apifox？ → 前往官网下载</a></div>
      </div>
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
.apifox-btn{display:inline-flex;align-items:center;gap:.5rem;background:linear-gradient(135deg,#e67e22,#d35400);color:#fff;border:none;padding:.75rem 1.5rem;border-radius:12px;font-size:1rem;font-weight:600;cursor:pointer;transition:all .3s;box-shadow:0 4px 15px rgba(230,126,34,.3)}
.apifox-btn:hover{transform:translateY(-2px);box-shadow:0 6px 20px rgba(230,126,34,.4)}
.apifox-icon{font-size:1.3rem}
.apifox-hint{font-size:.82rem;color:var(--text-muted);margin:.5rem auto 0;text-align:center}
.modal-overlay{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;z-index:1000;padding:1rem;backdrop-filter:blur(4px)}
.modal-content{background:var(--bg-card);border-radius:16px;max-width:560px;width:100%;max-height:85vh;overflow-y:auto;border:1px solid var(--border-color);box-shadow:0 20px 60px rgba(0,0,0,.15)}
.modal-header{display:flex;justify-content:space-between;align-items:center;padding:1.25rem 1.5rem;border-bottom:1px solid var(--border-color)}
.modal-header h2{margin:0;font-size:1.3rem;color:var(--text-primary)}
.modal-close{background:transparent;border:none;color:var(--text-muted);font-size:1.5rem;cursor:pointer;padding:.25rem;line-height:1;transition:color .3s}
.modal-close:hover{color:var(--text-primary)}
.modal-body{padding:1.5rem}
.modal-desc{color:var(--text-primary);margin-bottom:1.5rem;line-height:1.7}
.import-method{margin-bottom:1.2rem;padding:1rem;background:var(--bg-secondary);border-radius:8px;border:1px solid var(--border-color)}
.method-title{display:flex;align-items:center;gap:.5rem;font-weight:600;color:var(--text-primary);margin-bottom:.5rem}
.method-num{display:inline-flex;align-items:center;justify-content:center;width:1.5rem;height:1.5rem;background:#667eea;color:#fff;border-radius:50%;font-size:.8rem;font-weight:700}
.url-box{display:flex;gap:.5rem;margin-top:.5rem}
.url-box code{flex:1;background:var(--bg-secondary);padding:.6rem 1rem;border-radius:6px;font-size:.82rem;color:#667eea;overflow-x:auto;border:1px solid var(--border-color);word-break:break-all}
.copy-btn{background:var(--bg-secondary);border:1px solid var(--border-color);border-radius:6px;padding:.4rem .7rem;cursor:pointer;font-size:1rem;transition:all .3s}
.copy-btn:hover{background:var(--border-color)}
.download-btn{background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;border:none;padding:.6rem 1.2rem;border-radius:8px;font-size:.92rem;cursor:pointer;transition:all .3s;font-weight:500}
.download-btn:hover{transform:translateY(-1px);box-shadow:0 4px 12px rgba(102,126,234,.3)}
.import-steps{background:var(--bg-secondary);padding:1rem 1.2rem;border-radius:8px;margin-top:1rem;border:1px solid var(--border-color)}
.import-steps h4{margin:0 0 .75rem;color:var(--text-primary);font-size:.95rem}
.import-steps ol{margin:0;padding-left:1.2rem;color:var(--text-secondary);font-size:.9rem;line-height:1.8}
.import-steps li{margin-bottom:.25rem}
.modal-footer{padding:1rem 1.5rem;border-top:1px solid var(--border-color);text-align:center}
.apifox-link{color:var(--text-muted);font-size:.85rem}
.apifox-link:hover{color:#e67e22}
@media (max-width:768px) { .hero h1 { font-size: 1.7rem; } .grid { grid-template-columns: 1fr; } .stats { gap: 1.5rem; } }
</style>
