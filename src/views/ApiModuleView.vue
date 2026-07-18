<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { apiModules } from '../data/apiData'

const router = useRouter()
const route = useRoute()
const activeModuleId = ref(apiModules[0]?.id || '')
const selectedApi = ref(null)

onMounted(() => {
  if (route.params.moduleId && apiModules.find(m => m.id === route.params.moduleId)) {
    activeModuleId.value = route.params.moduleId
  }
})

const activeModule = computed(() => apiModules.find(m => m.id === activeModuleId.value))

function selectApi(api) { selectedApi.value = api }
function goBack() { router.push('/') }
function methodClass(method) { return `method-${method.toLowerCase()}` }

function renderNote(text) {
  if (!text) return ''
  return text.replace(/```(\w*)\n([\s\S]*?)```/g,'<pre class="code-inline"><code>$2</code></pre>')
    .replace(/`([^`]+)`/g,'<code class="code-inline">$1</code>')
    .replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>').replace(/\n/g,'<br/>')
}
</script>

<template>
  <div class="page">
    <div class="header">
      <button class="back-btn" @click="goBack">← 返回首页</button>
      <h1>📚 API 接口文档</h1>
      <span class="total">共 {{ apiModules.length }} 个模块 · {{ apiModules.reduce((s,m)=>s+m.apis.length,0) }} 个接口</span>
    </div>

    <div class="tabs">
      <button v-for="m in apiModules" :key="m.id" :class="['tab', {active: activeModuleId===m.id}]" @click="activeModuleId=m.id;selectedApi=null">
        <span class="tab-icon">{{ m.icon }}</span>
        <span class="tab-name">{{ m.name }}</span>
        <span class="tab-count">{{ m.apis.length }}</span>
      </button>
    </div>

    <div class="panel" v-if="activeModule">
      <aside class="sidebar">
        <div class="side-header">
          <h3>{{ activeModule.name }} · {{ activeModule.apis.length }} 个接口</h3>
          <span class="base-url">基础路径：<code>{{ activeModule.baseUrl }}</code></span>
        </div>
        <div class="api-list">
          <div v-for="(api, i) in activeModule.apis" :key="i" :class="['api-item', {active: selectedApi===api}]" @click="selectApi(api)">
            <span v-if="api.method" class="badge" :class="methodClass(api.method)">{{ api.method }}</span>
            <span class="api-title">{{ api.title }}</span>
          </div>
        </div>
      </aside>
      <main class="content">
        <div v-if="selectedApi" class="detail">
          <div class="detail-header">
            <h2>{{ selectedApi.title }}</h2>
            <div class="meta">
              <span v-if="selectedApi.method" class="tag" :class="methodClass(selectedApi.method)">{{ selectedApi.method }}</span>
              <code class="path">{{ selectedApi.path }}</code>
            </div>
          </div>
          <p class="desc">{{ selectedApi.description }}</p>
          <div v-if="selectedApi.params?.length" class="section">
            <h3>📋 请求参数</h3>
            <div class="table-wrap">
              <table class="table">
                <thead><tr><th>参数名</th><th>类型</th><th>必填</th><th>说明</th></tr></thead>
                <tbody>
                  <tr v-for="(p, idx) in selectedApi.params" :key="idx">
                    <td><code>{{ p.name }}</code></td>
                    <td><span class="type-badge">{{ p.type }}</span></td>
                    <td><span v-if="p.required" class="req">必填</span><span v-else class="opt">可选</span></td>
                    <td>{{ p.desc }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div v-if="selectedApi.body" class="section"><h3>📤 请求体 (Body)</h3><pre class="code-block"><code>{{ selectedApi.body }}</code></pre></div>
          <div v-if="selectedApi.response" class="section"><h3>📥 响应示例</h3><pre class="code-block"><code>{{ selectedApi.response }}</code></pre></div>
          <div v-if="selectedApi.note" class="section"><h3>💡 注意事项</h3><div class="note" v-html="renderNote(selectedApi.note)"></div></div>
        </div>
        <div v-else class="empty"><p>👈 请从左侧选择一个 API 接口</p></div>
      </main>
    </div>
  </div>
</template>

<style scoped>
.page { display:flex; flex-direction:column; height:calc(100vh - 60px); overflow:hidden; }
.header { background:var(--bg-card); border-bottom:1px solid var(--border-color); padding:.8rem 2rem; display:flex; align-items:center; gap:1.5rem; flex-shrink:0; }
.back-btn { background:transparent; border:1px solid var(--border-color); padding:.4rem 1rem; border-radius:8px; cursor:pointer; color:var(--text-secondary); transition:all .3s; font-size:.9rem; white-space:nowrap; }
.back-btn:hover { background:var(--bg-secondary); color:var(--text-primary); }
.header h1 { font-size:1.2rem; color:var(--text-primary); margin:0; }
.total { font-size:.85rem; color:var(--text-muted); white-space:nowrap; margin-left:auto; }
.tabs { display:flex; gap:.5rem; overflow-x:auto; padding:0 2rem; border-bottom:2px solid var(--border-color); flex-shrink:0; background:var(--bg-card); }
.tabs::-webkit-scrollbar { height:0; }
.tab { display:inline-flex; align-items:center; gap:.5rem; padding:.7rem 1.1rem; background:transparent; border:none; border-bottom:3px solid transparent; color:var(--text-secondary); font-size:.9rem; font-weight:500; cursor:pointer; transition:all .2s; white-space:nowrap; margin-bottom:-2px; }
.tab:hover { color:#667eea; }
.tab.active { color:#667eea; border-bottom-color:#667eea; }
.tab-icon { font-size:1rem; }
.tab-name { font-weight:600; }
.tab-count { background:rgba(102,126,234,.1); color:#667eea; font-size:.7rem; font-weight:600; padding:.08rem .4rem; border-radius:10px; min-width:1.2rem; text-align:center; }
.panel { display:flex; flex:1; overflow:hidden; background:var(--bg-card); }
.sidebar { width:280px; border-right:1px solid var(--border-color); overflow-y:auto; flex-shrink:0; background:var(--bg-secondary); }
.side-header { padding:1rem; border-bottom:1px solid var(--border-color); position:sticky; top:0; background:var(--bg-secondary); z-index:1; }
.side-header h3 { margin:0 0 .5rem; font-size:.88rem; color:var(--text-primary); }
.base-url { font-size:.76rem; color:var(--text-secondary); }
.base-url code { background:rgba(102,126,234,.08); padding:.1rem .4rem; border-radius:4px; color:#667eea; font-size:.76rem; }
.api-list { padding:.5rem; }
.api-item { padding:.65rem 1rem; border-radius:8px; cursor:pointer; transition:all .2s; display:flex; align-items:center; gap:.5rem; font-size:.86rem; color:var(--text-primary); }
.api-item:hover { background:rgba(102,126,234,.05); }
.api-item.active { background:rgba(102,126,234,.1); color:#667eea; font-weight:500; }
.badge { font-size:.66rem; padding:.1rem .35rem; border-radius:4px; font-weight:600; flex-shrink:0; }
.method-get{background:#27ae60;color:#fff} .method-post{background:#e67e22;color:#fff} .method-put{background:#3498db;color:#fff} .method-delete{background:#e74c3c;color:#fff}
.api-title { overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.content { flex:1; overflow-y:auto; padding:1.8rem; background:var(--bg-card); }
.detail { max-width:900px; margin:0 auto; }
.detail-header { margin-bottom:1.5rem; }
.detail-header h2 { margin:0 0 1rem; color:var(--text-primary); font-size:1.45rem; }
.meta { display:flex; align-items:center; gap:1rem; flex-wrap:wrap; }
.tag { font-size:.8rem; padding:.25rem .5rem; border-radius:6px; font-weight:600; }
.path { background:rgba(102,126,234,.08); padding:.28rem .7rem; border-radius:6px; color:#667eea; font-size:.86rem; }
.desc { color:var(--text-secondary); font-size:1rem; line-height:1.7; margin-bottom:2rem; }
.section { margin-bottom:1.8rem; }
.section h3 { font-size:1.02rem; color:var(--text-primary); margin-bottom:.8rem; padding-bottom:.4rem; border-bottom:1px solid var(--border-color); }
.table-wrap { overflow-x:auto; }
.table { width:100%; border-collapse:collapse; font-size:.86rem; }
.table th { background:var(--bg-secondary); padding:.65rem 1rem; text-align:left; color:var(--text-secondary); font-weight:600; border-bottom:2px solid var(--border-color); }
.table td { padding:.65rem 1rem; border-bottom:1px solid var(--border-color); color:var(--text-primary); }
.table tr:hover td { background:var(--bg-secondary); }
.table code { color:#667eea; font-size:.86rem; }
.type-badge { background:var(--bg-secondary); padding:.1rem .4rem; border-radius:4px; font-size:.76rem; color:var(--text-secondary); }
.req { background:rgba(231,76,60,.1); color:#e74c3c; padding:.1rem .4rem; border-radius:4px; font-size:.76rem; font-weight:500; }
.opt { background:rgba(52,152,219,.1); color:#3498db; padding:.1rem .4rem; border-radius:4px; font-size:.76rem; font-weight:500; }
.code-block { background:#f8f9fa; color:#2d3748; padding:1.1rem; border-radius:8px; overflow-x:auto; font-size:.82rem; line-height:1.6; border:1px solid var(--border-color); }
.note { background:rgba(102,126,234,.05); border-left:4px solid #667eea; padding:1rem 1.15rem; border-radius:0 8px 8px 0; color:var(--text-primary); font-size:.9rem; line-height:1.8; }
.note :deep(.code-inline) { background:rgba(102,126,234,.08); padding:.1rem .35rem; border-radius:4px; font-size:.82rem; color:#667eea; }
.note :deep(pre.code-inline) { background:#f8f9fa; color:#2d3748; padding:.85rem; border-radius:6px; overflow-x:auto; margin:.4rem 0; border:1px solid var(--border-color); }
.note :deep(pre.code-inline code) { background:transparent; padding:0; color:inherit; }
.empty { display:flex; align-items:center; justify-content:center; height:100%; color:var(--text-muted); font-size:1rem; }
@media (max-width:768px) { .header { padding:.8rem 1rem; gap:1rem; } .tabs { padding:0 1rem; } .panel { flex-direction:column; } .sidebar { width:100%; max-height:220px; border-right:none; border-bottom:1px solid var(--border-color); } .content { padding:1rem; } .total { display:none; } }
</style>
