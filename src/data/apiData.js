// 青龙面板 API 文档数据

export const apiModules = [
  {
    id: 'preparation',
    name: '准备工作',
    icon: '🚀',
    description: '创建应用、获取 Token、请求接口的完整流程',
    baseUrl: '/open',
    apis: [
      {
        title: '创建应用',
        method: '',
        path: '系统设置 → 应用设置 → 添加应用',
        description: '在青龙面板中选择模块权限，生成 client_id 和 client_secret',
        params: [],
        body: null,
        response: null,
        note: '这两个凭证是后续获取 Token 的必需参数。'
      },
      {
        title: '获取 Token',
        method: 'GET',
        path: '/open/auth/token',
        description: '使用 client_id 和 client_secret 获取访问令牌',
        params: [
          { name: 'client_id', type: 'string', required: true, desc: '创建应用时生成的 Client ID' },
          { name: 'client_secret', type: 'string', required: true, desc: '创建应用时生成的 Client Secret' }
        ],
        body: null,
        response: `{
  "code": 200,
  "data": {
    "token": "xxxxxx",
    "token_type": "Bearer",
    "expiration": 1237889999
  }
}`,
        note: 'token: 访问令牌；token_type: 固定为 Bearer；expiration: 令牌过期时间戳'
      },
      {
        title: '请求接口',
        method: '',
        path: '/open/*',
        description: '获取 Token 后，使用该 Token 调用其他 API 接口',
        params: [],
        body: null,
        response: null,
        note: `请求头需携带 \`Authorization: Bearer {token}\`

示例：
\`\`\`bash
curl 'http://[host]:[port]/open/env?t=1730550435755' \\
  -H 'Accept: application/json' \\
  -H 'Authorization: Bearer {token}'
\`\`\``
      }
    ]
  },
  {
    id: 'crontab',
    name: '定时任务',
    icon: '⏰',
    description: '定时任务的增删改查、运行控制、视图管理等',
    baseUrl: '/crons',
    apis: [
      {
        title: '获取任务列表',
        method: 'GET',
        path: '/crons/',
        description: '获取所有定时任务列表',
        params: [],
        body: null,
        response: null,
        note: ''
      },
      {
        title: '获取任务详情',
        method: 'GET',
        path: '/crons/detail',
        description: '获取指定任务的详细信息',
        params: [],
        body: null,
        response: null,
        note: '推测通过查询参数传递任务ID'
      },
      {
        title: '获取单个任务',
        method: 'GET',
        path: '/crons/:id',
        description: '获取指定ID的任务信息',
        params: [
          { name: 'id', type: 'number', required: true, desc: '任务ID（路径参数）' }
        ],
        body: null,
        response: null,
        note: ''
      },
      {
        title: '创建任务',
        method: 'POST',
        path: '/crons/',
        description: '创建一个新的定时任务',
        params: [],
        body: `{
  "command": "string",         // 执行的命令（必填）
  "schedule": "string",        // cron表达式（必填）
  "name": "string",            // 任务名称（可选）
  "labels": ["string"],        // 标签（可选）
  "sub_id": "number",          // 子任务ID（可选）
  "extra_schedules": [],       // 额外的定时规则（可选）
  "task_before": "string",     // 前置任务（可选）
  "task_after": "string"       // 后置任务（可选）
}`,
        response: null,
        note: ''
      },
      {
        title: '更新任务',
        method: 'PUT',
        path: '/crons/',
        description: '更新指定任务的信息',
        params: [],
        body: `{
  "id": "number",              // 任务ID（必填）
  "command": "string",         // 执行的命令（必填）
  "schedule": "string",        // cron表达式（必填）
  "name": "string",            // 任务名称（可选）
  "labels": ["string"],        // 标签（可选）
  "sub_id": "number",          // 子任务ID（可选）
  "extra_schedules": [],       // 额外的定时规则（可选）
  "task_before": "string",     // 前置任务（可选）
  "task_after": "string"       // 后置任务（可选）
}`,
        response: null,
        note: ''
      },
      {
        title: '删除任务',
        method: 'DELETE',
        path: '/crons/',
        description: '删除指定的任务（支持批量）',
        params: [],
        body: '[1, 2, 3]  // 任务ID数组',
        response: null,
        note: ''
      },
      {
        title: '运行任务',
        method: 'PUT',
        path: '/crons/run',
        description: '手动运行指定的任务（支持批量）',
        params: [],
        body: '[1, 2, 3]  // 任务ID数组',
        response: null,
        note: ''
      },
      {
        title: '停止任务',
        method: 'PUT',
        path: '/crons/stop',
        description: '停止正在运行的任务（支持批量）',
        params: [],
        body: '[1, 2, 3]  // 任务ID数组',
        response: null,
        note: ''
      },
      {
        title: '禁用任务',
        method: 'PUT',
        path: '/crons/disable',
        description: '禁用指定的任务（支持批量）',
        params: [],
        body: '[1, 2, 3]  // 任务ID数组',
        response: null,
        note: ''
      },
      {
        title: '启用任务',
        method: 'PUT',
        path: '/crons/enable',
        description: '启用指定的任务（支持批量）',
        params: [],
        body: '[1, 2, 3]  // 任务ID数组',
        response: null,
        note: ''
      },
      {
        title: '置顶任务',
        method: 'PUT',
        path: '/crons/pin',
        description: '将指定任务置顶（支持批量）',
        params: [],
        body: '[1, 2, 3]  // 任务ID数组',
        response: null,
        note: ''
      },
      {
        title: '取消置顶',
        method: 'PUT',
        path: '/crons/unpin',
        description: '取消任务的置顶状态（支持批量）',
        params: [],
        body: '[1, 2, 3]  // 任务ID数组',
        response: null,
        note: ''
      },
      {
        title: '添加标签',
        method: 'POST',
        path: '/crons/labels',
        description: '向指定任务添加标签',
        params: [],
        body: `{
  "ids": [1, 2, 3],           // 任务ID数组（必填）
  "labels": ["tag1", "tag2"]   // 标签数组（必填）
}`,
        response: null,
        note: ''
      },
      {
        title: '删除标签',
        method: 'DELETE',
        path: '/crons/labels',
        description: '从指定任务中删除标签',
        params: [],
        body: `{
  "ids": [1, 2, 3],           // 任务ID数组（必填）
  "labels": ["tag1", "tag2"]   // 标签数组（必填）
}`,
        response: null,
        note: ''
      },
      {
        title: '更新任务状态',
        method: 'PUT',
        path: '/crons/status',
        description: '更新任务的状态信息',
        params: [],
        body: `{
  "ids": [1, 2, 3],                       // 任务ID数组（必填）
  "status": "string",                      // 状态（必填）
  "pid": "string",                         // 进程ID（可选）
  "log_path": "string",                    // 日志路径（可选）
  "last_running_time": "number",           // 最后运行时间（可选）
  "last_execution_time": "number"          // 最后执行时间（可选）
}`,
        response: null,
        note: ''
      },
      {
        title: '获取任务日志',
        method: 'GET',
        path: '/crons/:id/log',
        description: '获取指定任务的执行日志',
        params: [
          { name: 'id', type: 'number', required: true, desc: '任务ID（路径参数）' }
        ],
        body: null,
        response: null,
        note: ''
      },
      {
        title: '获取任务日志列表',
        method: 'GET',
        path: '/crons/:id/logs',
        description: '获取指定任务的所有日志记录',
        params: [
          { name: 'id', type: 'number', required: true, desc: '任务ID（路径参数）' }
        ],
        body: null,
        response: null,
        note: ''
      },
      {
        title: '导入定时任务',
        method: 'GET',
        path: '/crons/import',
        description: '从 crontab 导入定时任务',
        params: [],
        body: null,
        response: null,
        note: ''
      },
      {
        title: '获取视图列表',
        method: 'GET',
        path: '/crons/views',
        description: '获取所有定时任务视图',
        params: [],
        body: null,
        response: null,
        note: ''
      },
      {
        title: '创建视图',
        method: 'POST',
        path: '/crons/views',
        description: '创建新的定时任务视图',
        params: [],
        body: `{
  "name": "string",              // 视图名称（必填）
  "sorts": [],                   // 排序规则（可选）
  "filters": [],                 // 过滤规则（可选）
  "filterRelation": "string"     // 过滤关系（可选）
}`,
        response: null,
        note: ''
      },
      {
        title: '更新视图',
        method: 'PUT',
        path: '/crons/views',
        description: '更新指定视图的信息',
        params: [],
        body: `{
  "id": "number",                // 视图ID（必填）
  "name": "string",              // 视图名称（必填）
  "sorts": [],                   // 排序规则（可选）
  "filters": [],                 // 过滤规则（可选）
  "filterRelation": "string"     // 过滤关系（可选）
}`,
        response: null,
        note: ''
      },
      {
        title: '删除视图',
        method: 'DELETE',
        path: '/crons/views',
        description: '删除指定的视图（支持批量）',
        params: [],
        body: '[1, 2, 3]  // 视图ID数组',
        response: null,
        note: ''
      },
      {
        title: '移动视图位置',
        method: 'PUT',
        path: '/crons/views/move',
        description: '移动视图在列表中的位置',
        params: [],
        body: `{
  "fromIndex": "number",         // 原位置（必填）
  "toIndex": "number",           // 目标位置（必填）
  "id": "number"                 // 视图ID（必填）
}`,
        response: null,
        note: ''
      },
      {
        title: '禁用视图',
        method: 'PUT',
        path: '/crons/views/disable',
        description: '禁用指定的视图（支持批量）',
        params: [],
        body: '[1, 2, 3]  // 视图ID数组',
        response: null,
        note: ''
      },
      {
        title: '启用视图',
        method: 'PUT',
        path: '/crons/views/enable',
        description: '启用指定的视图（支持批量）',
        params: [],
        body: '[1, 2, 3]  // 视图ID数组',
        response: null,
        note: ''
      }
    ]
  },
  {
    id: 'subscription',
    name: '订阅管理',
    icon: '📥',
    description: '订阅的创建、运行、启停等操作',
    baseUrl: '/subscriptions',
    apis: [
      {
        title: '获取订阅列表',
        method: 'GET',
        path: '/subscriptions/',
        description: '获取所有订阅列表',
        params: [
          { name: 'searchValue', type: 'string', required: false, desc: '搜索关键词' },
          { name: 'ids', type: 'string', required: false, desc: '订阅ID列表' }
        ],
        body: null,
        response: null,
        note: ''
      },
      {
        title: '创建订阅',
        method: 'POST',
        path: '/subscriptions/',
        description: '创建一个新的订阅任务',
        params: [],
        body: `{
  "type": "string",              // 订阅类型（必填）
  "schedule": "string",          // 定时计划/cron表达式（可选）
  "interval_schedule": {         // 间隔计划（可选）
    "type": "string",
    "value": "number"
  },
  "name": "string",              // 名称（可选）
  "url": "string",               // 订阅地址（必填）
  "whitelist": "string",         // 白名单（可选）
  "blacklist": "string",         // 黑名单（可选）
  "branch": "string",            // 分支（可选）
  "dependences": "string",       // 依赖（可选）
  "pull_type": "string",         // 拉取类型（可选）
  "pull_option": {},             // 拉取选项（可选）
  "extensions": "string",        // 扩展（可选）
  "sub_before": "string",        // 执行前脚本（可选）
  "sub_after": "string",         // 执行后脚本（可选）
  "schedule_type": "string",     // 计划类型（必填）
  "alias": "string",             // 别名（必填）
  "proxy": "string",             // 代理（可选）
  "autoAddCron": false,          // 自动添加定时任务（可选）
  "autoDelCron": false           // 自动删除定时任务（可选）
}`,
        response: null,
        note: ''
      },
      {
        title: '运行订阅',
        method: 'PUT',
        path: '/subscriptions/run',
        description: '批量运行订阅',
        params: [],
        body: '[1, 2, 3]  // 订阅ID数组',
        response: null,
        note: ''
      },
      {
        title: '停止订阅',
        method: 'PUT',
        path: '/subscriptions/stop',
        description: '批量停止订阅',
        params: [],
        body: '[1, 2, 3]  // 订阅ID数组',
        response: null,
        note: ''
      },
      {
        title: '禁用订阅',
        method: 'PUT',
        path: '/subscriptions/disable',
        description: '批量禁用订阅',
        params: [],
        body: '[1, 2, 3]  // 订阅ID数组',
        response: null,
        note: ''
      },
      {
        title: '启用订阅',
        method: 'PUT',
        path: '/subscriptions/enable',
        description: '批量启用订阅',
        params: [],
        body: '[1, 2, 3]  // 订阅ID数组',
        response: null,
        note: ''
      },
      {
        title: '获取订阅日志',
        method: 'GET',
        path: '/subscriptions/:id/log',
        description: '获取指定订阅的日志信息',
        params: [
          { name: 'id', type: 'number', required: true, desc: '订阅ID（路径参数）' }
        ],
        body: null,
        response: null,
        note: ''
      },
      {
        title: '获取订阅日志列表',
        method: 'GET',
        path: '/subscriptions/:id/logs',
        description: '获取指定订阅的日志列表',
        params: [
          { name: 'id', type: 'number', required: true, desc: '订阅ID（路径参数）' }
        ],
        body: null,
        response: null,
        note: ''
      },
      {
        title: '更新订阅状态',
        method: 'PUT',
        path: '/subscriptions/status',
        description: '批量更新订阅状态',
        params: [],
        body: `{
  "ids": [1, 2, 3],              // 订阅ID数组（必填）
  "status": "string",            // 状态（必填）
  "pid": "string",               // 进程ID（可选）
  "log_path": "string"           // 日志路径（可选）
}`,
        response: null,
        note: ''
      }
    ]
  },
  {
    id: 'env',
    name: '环境变量',
    icon: '🔧',
    description: '环境变量的增删改查、批量操作等',
    baseUrl: '/envs',
    apis: [
      {
        title: '获取环境变量列表',
        method: 'GET',
        path: '/envs/',
        description: '获取所有环境变量列表',
        params: [
          { name: 'searchValue', type: 'string', required: false, desc: '搜索关键词' }
        ],
        body: null,
        response: null,
        note: ''
      },
      {
        title: '获取单个环境变量',
        method: 'GET',
        path: '/envs/:id',
        description: '获取指定ID的环境变量详情',
        params: [
          { name: 'id', type: 'number', required: true, desc: '环境变量ID（路径参数）' }
        ],
        body: null,
        response: null,
        note: ''
      },
      {
        title: '创建环境变量',
        method: 'POST',
        path: '/envs/',
        description: '批量创建环境变量',
        params: [],
        body: `[{
  "name": "string",              // 变量名（必填，以字母或下划线开头，只能包含字母、数字和下划线）
  "value": "string",             // 变量值（必填）
  "remarks": "string"            // 备注（可选）
}]`,
        response: null,
        note: ''
      },
      {
        title: '更新环境变量',
        method: 'PUT',
        path: '/envs/',
        description: '更新指定环境变量',
        params: [],
        body: `{
  "id": "number",                // 环境变量ID（必填）
  "name": "string",              // 变量名（必填）
  "value": "string",             // 变量值（必填）
  "remarks": "string"            // 备注（可选）
}`,
        response: null,
        note: ''
      },
      {
        title: '删除环境变量',
        method: 'DELETE',
        path: '/envs/',
        description: '批量删除环境变量',
        params: [],
        body: '[1, 2, 3]  // 环境变量ID数组',
        response: null,
        note: ''
      },
      {
        title: '移动环境变量位置',
        method: 'PUT',
        path: '/envs/:id/move',
        description: '移动环境变量的位置',
        params: [
          { name: 'id', type: 'number', required: true, desc: '环境变量ID（路径参数）' }
        ],
        body: `{
  "fromIndex": "number",         // 原位置索引（必填）
  "toIndex": "number"            // 目标位置索引（必填）
}`,
        response: null,
        note: ''
      },
      {
        title: '禁用环境变量',
        method: 'PUT',
        path: '/envs/disable',
        description: '批量禁用环境变量',
        params: [],
        body: '[1, 2, 3]  // 环境变量ID数组',
        response: null,
        note: ''
      },
      {
        title: '启用环境变量',
        method: 'PUT',
        path: '/envs/enable',
        description: '批量启用环境变量',
        params: [],
        body: '[1, 2, 3]  // 环境变量ID数组',
        response: null,
        note: ''
      },
      {
        title: '批量更新变量名',
        method: 'PUT',
        path: '/envs/name',
        description: '批量更新环境变量的变量名',
        params: [],
        body: `{
  "ids": [1, 2, 3],              // 环境变量ID数组（必填）
  "name": "string"               // 新的变量名（必填）
}`,
        response: null,
        note: ''
      },
      {
        title: '上传环境变量文件',
        method: 'POST',
        path: '/envs/upload',
        description: '通过文件上传环境变量',
        params: [],
        body: 'Content-Type: multipart/form-data\n字段: env (JSON文件)\n文件格式：每条数据必须包含 name 和 value 字段',
        response: null,
        note: '使用 multer 处理文件上传'
      }
    ]
  },
  {
    id: 'config',
    name: '配置文件',
    icon: '⚙️',
    description: '配置文件的查看与编辑',
    baseUrl: '/configs',
    apis: [
      {
        title: '获取示例文件列表',
        method: 'GET',
        path: '/configs/sample',
        description: '获取系统预设的示例配置文件列表',
        params: [],
        body: null,
        response: `{
  "code": 200,
  "data": "SAMPLE_FILES"
}`,
        note: ''
      },
      {
        title: '获取配置文件列表',
        method: 'GET',
        path: '/configs/files',
        description: '获取所有可用的配置文件列表',
        params: [],
        body: null,
        response: `{
  "code": 200,
  "data": [
    { "title": "string", "value": "string" }
  ]
}`,
        note: ''
      },
      {
        title: '获取文件详情',
        method: 'GET',
        path: '/configs/detail',
        description: '获取指定配置文件的内容',
        params: [
          { name: 'path', type: 'string', required: true, desc: '文件路径（查询参数）' }
        ],
        body: null,
        response: null,
        note: ''
      },
      {
        title: '保存配置文件',
        method: 'POST',
        path: '/configs/save',
        description: '保存配置文件内容',
        params: [],
        body: `{
  "name": "string",               // 文件名（必填）
  "content": "string"             // 文件内容（必填）
}`,
        response: `{
  "code": 200,
  "message": "保存成功"
}`,
        note: ''
      },
      {
        title: '获取指定文件',
        method: 'GET',
        path: '/configs/:file',
        description: '通过文件名直接获取配置文件内容',
        params: [
          { name: 'file', type: 'string', required: true, desc: '配置文件名称（路径参数）' }
        ],
        body: null,
        response: null,
        note: ''
      }
    ]
  },
  {
    id: 'script',
    name: '脚本管理',
    icon: '📜',
    description: '脚本的上传、编辑、删除、运行等操作',
    baseUrl: '/scripts',
    apis: [
      {
        title: '获取脚本列表',
        method: 'GET',
        path: '/scripts/',
        description: '获取所有脚本列表（排除黑名单文件夹）',
        params: [
          { name: 'path', type: 'string', required: false, desc: '脚本路径' }
        ],
        body: null,
        response: null,
        note: '目录优先排序'
      },
      {
        title: '获取脚本详情',
        method: 'GET',
        path: '/scripts/detail',
        description: '获取指定脚本的详细内容',
        params: [
          { name: 'file', type: 'string', required: true, desc: '文件名（查询参数）' },
          { name: 'path', type: 'string', required: false, desc: '脚本路径' }
        ],
        body: null,
        response: null,
        note: ''
      },
      {
        title: '上传/创建脚本',
        method: 'POST',
        path: '/scripts/',
        description: '上传或创建新脚本',
        params: [],
        body: `Content-Type: multipart/form-data
{
  "filename": "string",          // 文件名（必填）
  "file": "File",                // 上传的文件（可选）
  "path": "string",              // 文件路径（可选）
  "content": "string",           // 文件内容（可选）
  "originFilename": "string",    // 原文件名（可选）
  "directory": "string"          // 目录名（可选）
}`,
        response: null,
        note: '使用 multer 中间件处理文件上传'
      },
      {
        title: '更新脚本内容',
        method: 'PUT',
        path: '/scripts/',
        description: '更新指定脚本的内容',
        params: [],
        body: `{
  "filename": "string",          // 文件名（必填）
  "path": "string",              // 文件路径（可选）
  "content": "string"            // 文件内容（必填）
}`,
        response: null,
        note: ''
      },
      {
        title: '删除脚本',
        method: 'DELETE',
        path: '/scripts/',
        description: '删除指定脚本',
        params: [],
        body: `{
  "filename": "string",          // 文件名（必填）
  "path": "string",              // 文件路径（可选）
  "type": "string"               // 类型（可选）
}`,
        response: null,
        note: ''
      },
      {
        title: '下载脚本',
        method: 'POST',
        path: '/scripts/download',
        description: '下载指定脚本文件',
        params: [],
        body: `{
  "filename": "string",          // 文件名（必填）
  "path": "string"               // 文件路径（可选）
}`,
        response: null,
        note: ''
      },
      {
        title: '运行脚本',
        method: 'PUT',
        path: '/scripts/run',
        description: '运行指定脚本',
        params: [],
        body: `{
  "filename": "string",          // 文件名（必填）
  "content": "string",           // 文件内容（可选）
  "path": "string"               // 文件路径（可选）
}`,
        response: null,
        note: ''
      },
      {
        title: '停止脚本',
        method: 'PUT',
        path: '/scripts/stop',
        description: '停止正在运行的脚本',
        params: [],
        body: `{
  "filename": "string",          // 文件名（必填）
  "path": "string",              // 文件路径（可选）
  "pid": "number"                // 进程ID（可选）
}`,
        response: null,
        note: ''
      },
      {
        title: '重命名脚本',
        method: 'PUT',
        path: '/scripts/rename',
        description: '重命名指定脚本',
        params: [],
        body: `{
  "filename": "string",          // 原文件名（必填）
  "path": "string",              // 文件路径（可选）
  "newFilename": "string"        // 新文件名（必填）
}`,
        response: null,
        note: ''
      }
    ]
  },
  {
    id: 'dependence',
    name: '依赖管理',
    icon: '📦',
    description: '依赖包的安装、卸载、重装等操作',
    baseUrl: '/dependencies',
    apis: [
      {
        title: '获取依赖列表',
        method: 'GET',
        path: '/dependencies/',
        description: '获取所有依赖项列表',
        params: [],
        body: null,
        response: null,
        note: ''
      },
      {
        title: '获取单个依赖',
        method: 'GET',
        path: '/dependencies/:id',
        description: '获取指定ID的依赖详情',
        params: [
          { name: 'id', type: 'number', required: true, desc: '依赖ID（路径参数）' }
        ],
        body: null,
        response: null,
        note: ''
      },
      {
        title: '创建依赖',
        method: 'POST',
        path: '/dependencies/',
        description: '创建一个或多个新的依赖项',
        params: [],
        body: `[{
  "name": "string",               // 依赖包名称（必填）
  "type": "number",               // 依赖类型（必填，如 npm/pip 等）
  "remark": "string"              // 备注（可选）
}]`,
        response: null,
        note: ''
      },
      {
        title: '更新依赖',
        method: 'PUT',
        path: '/dependencies/',
        description: '更新指定依赖的信息',
        params: [],
        body: `{
  "id": "number",                 // 依赖ID（必填）
  "name": "string",               // 依赖名称（可选）
  "type": "number",               // 依赖类型（可选）
  "remark": "string"              // 备注（可选）
}`,
        response: null,
        note: ''
      },
      {
        title: '删除依赖',
        method: 'DELETE',
        path: '/dependencies/',
        description: '批量删除依赖项',
        params: [],
        body: '[1, 2, 3]  // 依赖ID数组',
        response: null,
        note: ''
      },
      {
        title: '强制删除依赖',
        method: 'DELETE',
        path: '/dependencies/force',
        description: '强制批量删除依赖项',
        params: [],
        body: '[1, 2, 3]  // 依赖ID数组',
        response: null,
        note: ''
      },
      {
        title: '重新安装依赖',
        method: 'PUT',
        path: '/dependencies/reinstall',
        description: '批量重新安装依赖项',
        params: [],
        body: '[1, 2, 3]  // 依赖ID数组',
        response: null,
        note: ''
      },
      {
        title: '取消安装',
        method: 'PUT',
        path: '/dependencies/cancel',
        description: '批量取消正在安装的依赖项',
        params: [],
        body: '[1, 2, 3]  // 依赖ID数组',
        response: null,
        note: ''
      }
    ]
  },
  {
    id: 'log',
    name: '日志管理',
    icon: '📋',
    description: '日志文件的查看与管理',
    baseUrl: '/logs',
    apis: [
      {
        title: '获取日志列表',
        method: 'GET',
        path: '/logs/',
        description: '获取所有可访问的日志文件列表（排除黑名单文件）',
        params: [],
        body: null,
        response: null,
        note: ''
      },
      {
        title: '获取日志详情',
        method: 'GET',
        path: '/logs/detail',
        description: '获取指定日志文件的详细内容',
        params: [
          { name: 'path', type: 'string', required: false, desc: '日志路径' },
          { name: 'file', type: 'string', required: false, desc: '文件名' }
        ],
        body: null,
        response: null,
        note: '访问受限的日志返回 403 错误'
      },
      {
        title: '获取指定日志文件',
        method: 'GET',
        path: '/logs/:file',
        description: '通过文件名直接获取指定日志文件的内容',
        params: [
          { name: 'path', type: 'string', required: false, desc: '日志路径' }
        ],
        body: null,
        response: null,
        note: 'file 为 URL 路径参数'
      }
    ]
  },
  {
    id: 'system',
    name: '系统设置',
    icon: '🖥️',
    description: '系统信息、配置、更新、通知等操作',
    baseUrl: '/system',
    apis: [
      {
        title: '获取系统信息',
        method: 'GET',
        path: '/system/',
        description: '返回系统初始化状态和版本信息',
        params: [],
        body: null,
        response: `{
  "code": 200,
  "data": {
    "isInitialized": "boolean",
    "version": "string",
    "publishTime": "number",
    "branch": "string",
    "changeLog": "string",
    "changeLogLink": "string"
  }
}`,
        note: ''
      },
      {
        title: '获取系统配置',
        method: 'GET',
        path: '/system/config',
        description: '获取系统配置信息',
        params: [],
        body: null,
        response: null,
        note: ''
      },
      {
        title: '更新日志清理频率',
        method: 'PUT',
        path: '/system/config/log-remove-frequency',
        description: '更新日志清理频率',
        params: [],
        body: `{
  "logRemoveFrequency": "number|null"
}`,
        response: null,
        note: ''
      },
      {
        title: '更新定时任务并发数',
        method: 'PUT',
        path: '/system/config/cron-concurrency',
        description: '更新定时任务并发数',
        params: [],
        body: `{
  "cronConcurrency": "number|null"
}`,
        response: null,
        note: ''
      },
      {
        title: '更新依赖代理',
        method: 'PUT',
        path: '/system/config/dependence-proxy',
        description: '更新依赖代理设置',
        params: [],
        body: `{
  "dependenceProxy": "string|null"
}`,
        response: null,
        note: ''
      },
      {
        title: '更新 Node 镜像',
        method: 'PUT',
        path: '/system/config/node-mirror',
        description: '更新 Node 镜像源',
        params: [],
        body: `{
  "nodeMirror": "string|null"
}`,
        response: null,
        note: ''
      },
      {
        title: '更新 Python 镜像',
        method: 'PUT',
        path: '/system/config/python-mirror',
        description: '更新 Python 镜像源',
        params: [],
        body: `{
  "pythonMirror": "string|null"
}`,
        response: null,
        note: ''
      },
      {
        title: '更新 Linux 镜像',
        method: 'PUT',
        path: '/system/config/linux-mirror',
        description: '更新 Linux 镜像源',
        params: [],
        body: `{
  "linuxMirror": "string|null"
}`,
        response: null,
        note: ''
      },
      {
        title: '检查系统更新',
        method: 'PUT',
        path: '/system/update-check',
        description: '检查是否有系统更新',
        params: [],
        body: null,
        response: null,
        note: ''
      },
      {
        title: '执行系统更新',
        method: 'PUT',
        path: '/system/update',
        description: '执行系统更新操作',
        params: [],
        body: null,
        response: null,
        note: ''
      },
      {
        title: '重载系统',
        method: 'PUT',
        path: '/system/reload',
        description: '重载系统',
        params: [],
        body: `{
  "type": "string|null"           // 重载类型（可选）
}`,
        response: null,
        note: ''
      },
      {
        title: '发送通知',
        method: 'PUT',
        path: '/system/notify',
        description: '发送系统通知（支持多种通知方式）',
        params: [],
        body: `{
  "title": "string",              // 通知标题（必填）
  "content": "string",            // 通知内容（必填）
  "notificationInfo": {           // 可选通知配置
    "type": "gotify|goCqHttpBot|serverChan|pushDeer|bark|chat|telegramBot|dingtalkBot|weWorkBot|weWorkApp|aibotk|iGot|pushPlus|wePlusBot|email|pushMe|feishu|webhook|Chronocat|ntfy|wxPusherBot"
    // 各类型对应具体参数见下方说明
  }
}`,
        response: null,
        note: `支持的通知类型：gotify, goCqHttpBot, serverChan, pushDeer, bark, chat, telegramBot, dingtalkBot, weWorkBot, weWorkApp, aibotk, iGot, pushPlus, wePlusBot, email, pushMe, feishu, webhook, Chronocat, ntfy, wxPusherBot`
      },
      {
        title: '运行命令',
        method: 'PUT',
        path: '/system/command-run',
        description: '在服务器上运行指定命令',
        params: [],
        body: `{
  "command": "string"             // 要执行的命令
}`,
        response: null,
        note: '响应头包含 Content-type: application/octet-stream 和 QL-Task-Pid: <进程ID>'
      },
      {
        title: '停止命令',
        method: 'PUT',
        path: '/system/command-stop',
        description: '停止正在运行的命令',
        params: [],
        body: `{
  "command": "string",            // 要停止的命令（可选）
  "pid": "number"                 // 进程ID（可选）
}`,
        response: null,
        note: ''
      },
      {
        title: '导出系统数据',
        method: 'PUT',
        path: '/system/data/export',
        description: '导出系统全部数据',
        params: [],
        body: null,
        response: null,
        note: ''
      },
      {
        title: '导入系统数据',
        method: 'PUT',
        path: '/system/data/import',
        description: '导入系统数据',
        params: [],
        body: 'Content-Type: multipart/form-data\n字段: data (文件)',
        response: null,
        note: ''
      },
      {
        title: '获取系统日志',
        method: 'GET',
        path: '/system/log',
        description: '获取系统日志',
        params: [
          { name: 'startTime', type: 'string', required: false, desc: '开始时间' },
          { name: 'endTime', type: 'string', required: false, desc: '结束时间' },
          { name: 't', type: 'string', required: false, desc: '类型' }
        ],
        body: null,
        response: null,
        note: ''
      },
      {
        title: '删除系统日志',
        method: 'DELETE',
        path: '/system/log',
        description: '删除系统日志',
        params: [],
        body: null,
        response: null,
        note: ''
      }
    ]
  }
];

// 通用说明
export const commonInfo = {
  errorHandling: `所有接口遵循统一的错误处理模式：
- 错误会传递给下一个中间件处理
- **成功响应格式**: \\\`{ "code": 200, "data": ... }\\\`
- 错误日志由 **Winston logger** 处理`,
  notes: `1. **参数验证**: 所有路由都使用 **celebrate/Joi** 进行参数验证
2. **Cron 表达式验证**: cron 表达式会通过 **cron-parser** 库进行有效性验证
3. **批量操作**: 批量操作接口（如运行、停止、删除等）都接受**ID数组**作为请求体
4. **安全限制**: 部分文件路径受黑名单限制，无法访问`
};
