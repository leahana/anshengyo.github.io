---
layout: post
title: Codex 更新追踪
date: 2026-04-13 12:00:00 +0800
categories: [tech, tools, tracking]
tags: [codex, openai, CLI, 更新追踪]
description: 持续追踪 OpenAI Codex 的版本更新，按季度组织，记录新特性用法与关键修复。
toc: true
---

> 持续追加型文档，每次工具更新后由 AI 代理追加新批次。

---

## 2026 年

### Q2（2026-04 ~ 06）

#### 2026-04 | Model Availability Update

**信息截止**：2026-04-09 | **最新 Release**：2026-04-07

| 更新 | 日期 | 一句话 |
|------|------|--------|
| Model pool convergence | 2026-04-07 | GPT-5.4 系列成为主力，支持通过 `codex --model gpt-5.4` 使用；旧版 GPT-5.1/5.2 从 ChatGPT 登录路径移除 |
| GPT-5.4 mini 引入 | 2026-04-07 | 轻量任务、子 Agent、代码库探索更省额度，使用 `codex --model gpt-5.4-mini` |

##### 新特性用法

- **模型收敛感知**：在 Codex App 或 CLI 中，`/model` 默认列表已简化为 GPT-5.4 系列。若需使用特定旧模型或第三方模型，可通过 API key 或 provider 在 `~/.codex/config.toml` 中配置 `[model_providers.<id>]` 接入。
- **自定义 Provider 显示名**：如果输入框里出现 `my_codex` 这类名称，优先把它理解成“当前 provider 的显示名”（来自 `model_providers.<id>.name`），而不是一个独立新模型。

##### 关键 fix

- 明确了自定义 Provider 的显示名称逻辑，解决用户对模型标签的认知困惑。

---

#### 2026-04 | 0.119.0 ~ 0.121.0

**信息截止**：2026-04-17 | **最新 Release**：0.121.0（稳定版）

| 版本 | 日期 | 一句话 |
|------|------|--------|
| `0.119.0` | 2026-04-10 | 语音会话默认切到 v2 WebRTC；MCP Apps、远程工作流和 `/resume` 可用性增强 |
| `0.120.0` | 2026-04-11 | Realtime V2 开始支持后台 Agent 进度流；TUI Hook 展示更清晰 |
| `0.121.0` | 2026-04-15 | `codex marketplace add` 上线；记忆控制、MCP 元数据和安全 devcontainer 一起补齐 |

##### 新特性用法

- **安装 Marketplace**：`codex marketplace add` 现在可以直接接
  GitHub、git URL、本地目录和 `marketplace.json` 链接，适合把团队
  插件集成做成一条安装命令。
```bash
codex marketplace add https://github.com/your-org/codex-marketplace
codex marketplace add ./local-marketplace
codex marketplace add https://example.com/marketplace.json
```
- **TUI 历史检索**：在输入框按 `Ctrl+R` 可以反向搜索历史 prompt，
  已接受的 slash command 也会被本地 recall，适合反复调试长 prompt
  或命令链。
```text
Ctrl+R
# 输入关键字，回溯历史 prompt / slash command
```
- **后台 Agent 进度流**：从 `0.120.0` 开始，Realtime V2 会在任务尚未
  结束时持续回传后台 Agent 进度，跟进同一任务时不用再等整轮完成。
```text
开始长任务
查看终端里的增量进度
完成后继续 follow-up
```
- **Memory 控制**：`0.121.0` 增加了记忆模式、重置/删除与扩展清理入口，
  适合在切换项目或排查“旧偏好串味”时主动清空上下文沉淀。
```text
在 TUI / App Server 中关闭 memory
重置或删除已有 memory
清理 memory extension 残留
```

##### 关键 fix

- **MCP 与 App Server 稳定性**：`0.119.0 ~ 0.121.0` 连续修了 MCP
  清理、工具调用元数据、elicitation timeout、`fs/readDirectory`
  遇到坏 symlink 等边角问题，受影响最大的是重度 MCP / plugin 用户和
  app-server 集成方。
- **Sandbox / 权限边角**：修了 Windows elevated sandbox carveout、
  symlinked writable roots、macOS private DNS/proxy、WSL1
  bubblewrap 等问题；之前需要手动降权限或绕开目录结构的场景，
  现在更少了。
- **会话恢复与路径匹配**：修了 `resume --last`、`thread/list`、
  resume picker、当前线程恢复崩溃等问题，尤其对 Windows 路径前缀和
  长时间多线程工作流更重要。

**预发布观察**（截至 2026-04-17）：
- 2026-04-16 发布 `0.122.0-alpha.3`，GitHub 公开 release 页未展示
  详细 notes；目前只能确认它是 `0.121.0` 之后的新预发布标签，
  建议等稳定版或 compare 页面补全后再纳入正式批次。

---

#### 2026-04 | App 26.415

**信息截止**：2026-04-17 | **最新 Release**：26.415

| 更新 | 日期 | 一句话 |
|------|------|--------|
| App 26.415 | 2026-04-16 | Codex App 扩成更完整工作台：in-app browser、computer use、无项目 chats、thread automations、PR review 与 artifact viewer 同步上线 |

##### 新特性用法

- **In-app browser 验证页面**：现在可以直接在 Codex App 里打开本地
  或公网页面，在渲染结果上评论，再让 Codex 按页面级反馈继续修改，
  比“截图再转述”更顺手。
```text
打开本地预览页
直接在页面上评论问题
让 Codex 根据评论继续修正
```
- **无项目目录 Chats + Thread Automations**：现在可以先开线程做调研、
  写作、方案拆解，再决定要不要落到仓库；需要定时回来看结果时，
  可以给同一线程挂 automation，而不是新开会话重讲上下文。
```text
先开 chat 做资料整理
需要晚点跟进时，为当前线程添加 automation
```
- **PR Review + Artifact Viewer**：App 侧边栏已经能看 GitHub PR、
  review comment、改动文件和生成物预览，适合一边看 diff 一边让 Codex
  解释评论、补修改、核对 PDF / 表格 / 文档类输出。
```text
在侧边栏打开 PR 或 artifact
查看 diff / 评论 / 预览
让 Codex 继续修改或解释
```
- **Computer Use**：Codex 现在可以在 macOS 上看、点、输，适合 GUI
  Only 的原生应用测试或模拟器流程；官方说明该功能首发不在 EEA、
  英国和瑞士开放。

##### 关键 fix

- **线程与工具渲染改进**：官方在这条更新里明确提到 improved thread
  and tool rendering，长任务过程中侧边栏和工具结果的可读性更好了。
- **工作流衔接更顺**：Chats 不再要求先选项目目录，很多“先研究、后落地”
  的场景少了一次 setup 跳转，属于明显的流程摩擦修复。

---

#### 2026-04 | 0.122.0-alpha.5（预发布观察）

**信息截止**：2026-04-17 | **最新 Release**：0.122.0-alpha.5（预发布）

| 版本 | 日期 | 一句话 |
|------|------|--------|
| `0.122.0-alpha.3` | 2026-04-16 18:09 | 当天首个 `0.122.0` 预发布标签出现，但公开 release 页未附说明 |
| `0.122.0-alpha.5` | 2026-04-16 23:47 | 同日继续滚到 `alpha.5`，说明这一轮预发布仍在快速烘焙 |

##### 新特性用法

- **暂无公开新特性说明**：GitHub 公开 release 页当前只确认了更新到
  `0.122.0-alpha.5`，没有同步放出 release notes；现阶段更稳妥的做法
  是继续按 `0.121.0` 的命令集和配置使用。
```text
生产环境继续使用 0.121.0
关注下一个稳定版或 compare / notes 补全
```
- **预发布解读方式**：如果你只是追踪趋势，可以把这次变化理解成
  “`0.121.0` 之后又做了同日连续预发布”；在没有 notes 之前，
  不建议把具体功能或 fix 写成已确认结论。

##### 关键 fix

- **暂无可确认 fix 明细**：公开 release 页面没有列出 `alpha.3` 到
  `alpha.5` 的功能项或修复项，因此现阶段不能把任何 PR 直接写成已落地
  结论。
- **升级建议偏保守**：同一天从 `alpha.3` 快速推进到 `alpha.5`，
  更像预发布烘焙过程；追求稳定的用户建议等待下一个正式 release。

---

#### 2026-04 | 0.122.0-alpha.6 ~ 0.122.0-alpha.10（预发布）

**信息截止**：2026-04-19 | **最新 Release**：0.122.0-alpha.10（预发布）

| 版本 | 日期 | 一句话 |
|------|------|--------|
| `0.122.0-alpha.6` | 2026-04-17 12:36 | 预发布继续滚到 `alpha.6`，GitHub 公开 release 页仍未附 notes |
| `0.122.0-alpha.7` | 2026-04-17 16:19 | 同日继续迭代到 `alpha.7`，说明这一轮 `0.122.0` 仍在高频烘焙 |
| `0.122.0-alpha.8` | 2026-04-17 20:19 | 晚间继续推进到 `alpha.8`，主分支开始出现 thread history 与 plugin UX 相关提交 |
| `0.122.0-alpha.9` | 2026-04-17 23:17 | 同日晚间滚到 `alpha.9`，但公开 release notes 依旧缺席 |
| `0.122.0-alpha.10` | 2026-04-18 06:26 | 当前最新公开 prerelease；已能看到 marketplace remove、thread 历史分页与 `/status` 细化等信号 |

##### 新特性用法

- **移除 Marketplace 条目**：从 `#17752` 的 merged commit 可以确认，
  预发布里已经补上 remove 流程，而且 CLI 解析测试显示命令挂到
  `codex plugin marketplace remove` 命名空间下；由于稳定版 changelog
  仍写 `codex marketplace add`，这一点更适合先按“预发布观察”理解。
```bash
codex plugin marketplace remove debug
```
- **分页拉取线程与 turn 历史**：`codex-rs/app-server/README.md`
  已写明 `thread/list` 新增 `sortKey`、`sortDirection`、
  `backwardsCursor`，并补了 `thread/turns/list` 示例，做自定义历史面板
  或二次集成会更顺手。
```json
{ "method": "thread/list", "id": 20, "params": {
  "limit": 25,
  "sortKey": "updated_at",
  "sortDirection": "desc"
} }

{ "method": "thread/turns/list", "id": 24, "params": {
  "threadId": "thr_123",
  "limit": 50,
  "sortDirection": "desc"
} }
```
- **命令面板与插件目录更可见**：从 merged commit 标题可见，
  `/plugins` 正在补 inline enablement toggles 与 tabbed marketplace
  menu，`/status` 也会展示默认 reasoning；这些都属于“少切菜单、
  少猜状态”的交互收敛。
```text
/plugins
# 直接启用 / 禁用已安装插件
# 在 marketplace 标签查看可装条目

/status
# 确认当前默认 reasoning / effort
```

##### 关键 fix

- **`apply_patch` / 文件系统 helper**：`#18296` 修了 fs sandbox
  helper 对 `apply_patch` 的处理，`#18380` 又补了 exec-server 保留
  fs helper runtime env；受影响最大的是依赖 workspace-write 或
  external sandbox 的编辑流。
- **插件与跨仓来源边角**：`#18449` 补了未安装 cross-repo plugin
  read 的提示，`#17277` 和 `#18017` 则把 remote plugin fields /
  cross-repo sources 往 API 与 marketplace manifest 里推，说明
  插件来源与跨仓场景正在继续收敛。
- **信任门与执行策略**：`#14718` 修了 project hooks 与 exec policies
  的 trust-gate 判定，少一类“项目已可信却还被错误拦住”的审批摩擦。
- **启动性能**：`#18370` 把 startup skills refresh 延后，skill /
  plugin 较多的环境启动压力更小。

**主分支未发版** (截至 2026-04-19)：
- PR #18325: 回滚“只在 request 边界清空 mailbox”的尝试，说明消息边界
  处理还在继续收敛
- PR #18386: 图片输出默认改为 `high detail`，视觉结果更细，但也可能更
  耗时
- PR #18499: 当前工作目录不可用时修复 plugin cache panic，适合频繁切
  目录或清理工作区的人关注
- PR #18212: executor-backed MCP stdio 进入第 5/6 步，MCP stdio
  底层仍在继续重构

这些内容已进入主分支但尚未发版，需等待下个 Release 或自行评估源码安
装。

---

#### 2026-04 | 0.122.0-alpha.11 ~ 0.122.0-alpha.13（预发布）

**信息截止**：2026-04-21 | **最新 Release**：0.122.0-alpha.13（预发布）

| 版本 | 日期 | 一句话 |
|------|------|--------|
| `0.122.0-alpha.11` | 2026-04-19 16:41 | `0.122.0` 预发布继续滚到 `alpha.11`，公开 release notes 依旧缺席 |
| `0.122.0-alpha.12` | 2026-04-19 18:48 | 同日晚间继续推进到 `alpha.12`，说明这一轮烘焙仍在高频持续 |
| `0.122.0-alpha.13` | 2026-04-20 12:30 | 当前最新公开 prerelease；稳定版 `0.122.0` 仍未发布，官方 changelog 也还没补 CLI 新条目 |

##### 新特性用法

- **本批仍无公开 release notes**：GitHub 公开 release 页只确认
  `alpha.11 ~ alpha.13` 的 tag 和时间，OpenAI Developers 的 changelog
  截至 `2026-04-21` 仍停留在 `2026-04-16 / App 26.415`；现阶段更稳妥的
  用法仍是把这些更新视为预发布烘焙，而不是稳定命令面变更。
```text
生产环境继续使用 0.121.0
实验环境关注 alpha.13 与后续 stable release
```
- **计划实现过程更可见**：从 `#18573` 的 merged commit 可见，
  TUI 会把 plan implementation prompt 实际用了哪些 context 显示得更
  清楚；对需要核对“为什么 agent 会这样改”的人更有帮助。
```text
先让 Codex 产出 plan
进入 implementation 阶段
查看 prompt 中实际带入的 context used
```
- **多线程 / 目录切换链路继续收敛**：从对应时间窗的主分支提交可见，
  thread picker、parent thread status、cwd 不可用时的 plugin cache
  边角都在继续修；如果你经常切线程、切目录、做 side conversation，
  这批预发布更值得观察。
```text
/resume
# 查看 thread picker 的命名与提示
# 观察 side conversation 里的 parent thread status
```

##### 关键 fix

- **切目录导致的 plugin cache panic**：`#18499` 修了 cwd 不可用时的
  plugin cache panic，频繁切目录、清理工作区或从临时目录恢复的人受益
  最直接。
- **MCP stdio 改造继续前推**：`#18212` 的 executor-backed MCP stdio
  已推进到第 5/6 步，说明 MCP stdio 的执行链路还在继续收敛。
- **预发布仍偏稳定化**：到 `alpha.13` 为止，公开信息更多体现为
  TUI / thread / plugin / MCP 的可见性和边角稳定性收敛，而不是新的
  稳定大功能落地。

**主分支未发版** (截至 2026-04-21)：
- PR #18625: 新增 `codex debug models`，方便直接检查当前模型目录 /
  provider
- PR #18610: `/mcp` 增加 verbose diagnostics，定位 MCP 配置问题更
  直观
- PR #18289: app_server 开始透传 `PatchUpdated` 事件，集成侧能更早感知
  补丁更新
- PR #18646: 新增 `--ignore-user-config` 与 `--ignore-rules`，便于隔离
  “是不是本地配置导致的行为差异”
- PR #18654 / #18492 / #18274: 继续修 sub-agent exec policy、
  FS watcher 与文件系统权限 canonicalization 这类边角问题

这些内容来自 `2026-04-20` 的主分支提交，但公开 release notes 尚未说明
它们是否已经进入更晚的 prerelease；保守起见，先按“主分支未发版观察”
记录，等待下个 tag、稳定版或 compare 页面补全。

---

#### 2026-04 | 0.123.0 ~ 0.124.0（CLI Stable）

**信息截止**：2026-04-24 | **最新 Release**：0.124.0（稳定版）

本批次属于 `cli-oss / stable`；`0.123.0-alpha.6 ~ alpha.10` 与
`0.124.0-alpha.1 ~ alpha.3` 已由稳定版 release notes 回收确认。

| 版本 | 日期 | 一句话 |
|------|------|--------|
| `0.123.0` | 2026-04-23 01:26 | Bedrock provider、`/mcp verbose`、plugin MCP file shapes、realtime handoff 和远程 sandbox 配置一起落到稳定版 |
| `0.124.0` | 2026-04-23 18:29 | 快速 reasoning 调整、多环境 app-server turn、stable hooks、远程 marketplace list/read 与 Fast service tier 一起发布 |

##### 新特性用法

- **升级到稳定版 0.124.0**：官方 changelog 已给出 npm 安装方式，之前
  追 `alpha` 的环境可以先回到稳定版基线，再观察下一条 prerelease 线。
```bash
npm install -g @openai/codex@0.124.0
```
- **快速调整 reasoning**：TUI 新增 `Alt+,` 与 `Alt+.`，可以在当前会话
  里临时降低或提高 reasoning；接受模型升级后，reasoning 会重置到新
  模型默认值，避免沿用旧模型的 stale setting。
```text
Alt+,  # 降低 reasoning
Alt+.  # 提高 reasoning
```
- **MCP 诊断分层**：`0.123.0` 增加 `/mcp verbose`，日常只看 `/mcp`
  保持快速；排查 server diagnostics、resources、resource templates
  时再打开 verbose。
```text
/mcp
/mcp verbose
```
- **Hooks 进入稳定态**：`0.124.0` 把 hooks 标为 stable，并支持在
  `config.toml` 与 managed `requirements.toml` 中配置；可观察 MCP
  tools、`apply_patch` 以及长时间 Bash session。
```toml
# config.toml
# 具体 hook 结构以当前 Codex hooks 文档 / release note 为准
# 重点变化：hooks 已从实验观察点进入 stable capability
```
- **App-server 多环境 turn**：app-server session 可以管理多个环境，
  并在每个 turn 选择 environment 与 working directory，适合远程开发、
  多仓库或 monorepo 子目录定位。
```text
在 app-server client 中为 turn 指定 environment + cwd
让 Codex 在目标 workspace 内执行本轮任务
```

##### 关键 fix

- **权限与审批状态同步**：`0.124.0` 修了 side conversation 后
  `/permissions` 变更漂移，以及 Full Access 状态在 MCP approval 中的
  反映问题；多线程工作时少一类“明明改了权限但状态不一致”的摩擦。
- **远程 app-server 稳定性**：修了 websocket events 在负载下持续 draining
  和 remote worker 退出时 shutdown cleanup 失败的问题，远程工作流更稳。
- **`wait_agent` 卡顿**：修了 mailbox 已有 queued work 时仍等待新通知或
  timeout 的问题，后台 agent / sub-agent 流程更不容易假性阻塞。
- **CLI 与终端边角**：`0.123.0` 修了 rollback 后 `/copy` 复制旧响应、
  手动 shell 命令期间 follow-up 卡在 `Working`、VS Code WSL Unicode /
  dead-key 输入、proxy env 旧值恢复、`codex exec` 不继承 root flags 等
  问题。

---

#### 2026-04 | GPT-5.5 / Browser Use / Approval Review（App Product）

**信息截止**：2026-04-24 | **最新 Release**：2026-04-23 Product Update

本批次属于 `app-product`；来源为 OpenAI Developers changelog，
与 GitHub CLI release 独立记录。

| 更新 | 日期 | 一句话 |
|------|------|--------|
| GPT-5.5 in Codex | 2026-04-23 | GPT-5.5 成为 Codex 推荐模型，适合实现、重构、调试、测试、验证和知识工作产物 |
| Browser use | 2026-04-23 | Codex app 可操作 in-app browser，用于本地开发服务器和 file-backed page 的 UI 验证 |
| Automatic approval reviews | 2026-04-23 | 审批请求可先交给自动 reviewer agent，App 中展示 review 状态和风险等级 |

##### 新特性用法

- **切到 GPT-5.5**：如果模型选择器已经出现 GPT-5.5，CLI 可以直接开新
  thread 指定模型；会话中也可以用 `/model` 切换。IDE extension 和
  Codex app 则在 composer 的模型选择器中切换。
```bash
codex --model gpt-5.5
```
```text
/model
# 选择 GPT-5.5
```
- **让 Codex 操作内置浏览器**：适合本地页面验证、视觉 bug 复现、UI
  修复后的点击流检查；官方说明该能力通过 bundled Browser plugin
  运行，允许 / 阻止的网站可在 settings 中管理。
```text
启动本地开发服务器
让 Codex 在 app 内 browser 打开页面
要求它点击、复现、验证修复
```
- **自动审批 review**：配置后，符合条件的 approval prompt 会先进入
  automatic reviewer agent；执行前可在 Codex app 里查看 approved、
  denied、stopped、timed out 等状态与风险等级。
```text
触发需要审批的操作
查看 automatic review item 的 status / risk
再决定是否继续执行
```

##### 关键 fix

- **模型可见性兜底**：如果 GPT-5.5 还没出现，官方建议先升级 CLI、IDE
  extension 或 Codex app；rollout 期间继续使用 GPT-5.4。
- **浏览器权限边界更清晰**：Browser use 通过 bundled Browser plugin
  管理，并可在 settings 中审查 allow / block 网站，减少“能浏览但边界
  不透明”的不确定性。
- **审批流程更可审计**：automatic approval reviews 把 approval 前的
  reviewer 结果、状态和风险等级显式化，适合需要更严格审批留痕的团队。

---

#### 2026-04 | 0.125.0（CLI Stable）

**信息截止**：2026-04-29 | **最新 Release**：0.125.0（稳定版）

本批次属于 `cli-oss / stable`；来源为 OpenAI Developers changelog 与
GitHub Release。

| 版本 | 日期 | 一句话 |
|------|------|--------|
| `0.125.0` | 2026-04-24 | app-server Unix socket、远程插件安装/升级、权限 profile 透传、provider 模型发现、exec JSON token usage 与 rollout trace 一起落到稳定版 |

##### 新特性用法

- **升级到 0.125.0**：官方 changelog 已给出 npm 安装方式，适合需要
  app-server、远程插件或权限 profile 新接口的环境先升级到稳定版基线。
```bash
npm install -g @openai/codex@0.125.0
```
- **app-server 走 Unix socket**：app-server 集成现在支持 Unix socket
  transport，适合把本机 IDE / 桌面客户端和 Codex 后端连在同一台机器
  上，减少 TCP 端口暴露。
```text
# app-server client 侧选择 unix socket transport
# 具体 socket path / 启动参数以当前 app-server schema 为准
```
- **分页友好的 resume / fork**：`thread/resume` 和 `thread/fork`
  新增面向分页历史的参数，客户端可以先恢复线程，再按需用
  `thread/turns/list` 拉历史，避免一次性塞回完整 turns。
```json
{
  "method": "thread/fork",
  "id": 24,
  "params": {
    "threadId": "thr_123",
    "excludeTurns": true
  }
}
```
- **远程插件安装与 marketplace 升级**：app-server plugin management
  已能安装远程插件、升级已配置 marketplaces；适合团队把插件分发、
  更新和缓存收拢到 app-server 客户端流程里。
```text
在 app-server 客户端里安装 remote plugin
升级 configured marketplace
刷新插件列表并重新加载可用 MCP tools
```
- **`codex exec --json` 暴露 reasoning tokens**：程序化调用方现在能
  从 JSON usage 中拿到 reasoning-token 用量，适合 CI、批处理和成本
  观测。
```bash
codex exec --json "summarize the current diff"
```

##### 关键 fix

- **`/review` 与 TUI 退出卡死**：修了中断 `/review` 或退出 TUI 时，
  界面可能卡在 delegate startup / unsubscribe 的问题；经常跑 review
  或后台 agent 的用户体感最明显。
- **exec-server 输出丢失**：修了进程退出后 buffered output 被丢掉、
  stream closure 等待不正确的问题；依赖长命令输出和日志回放的工作流
  更稳。
- **显式 untrusted 配置**：app-server 不再把明确不可信的 project
  config 自动持久化成 trusted，降低远程/多项目场景里的信任边界漂移。
- **Windows 与配置 schema 边角**：修了多 CLI 版本、installed app
  directory、后台 PowerShell 窗口，以及 MultiAgentV2 thread limits、
  relative agent-role config path、MCP bearer token 字段和 `js_repl`
  image MIME 校验等问题。

---

#### 2026-04 | 0.126.0-alpha.1 ~ 0.126.0-alpha.11（预发布）

**信息截止**：2026-04-29 | **最新 Release**：0.126.0-alpha.11（预发布）

本批次属于 `cli-oss / prerelease`；GitHub release/tag 页面仅确认 tag
与时间，公开 release notes 尚未补全。

| 版本 | 日期 | 一句话 |
|------|------|--------|
| `0.126.0-alpha.1` | 2026-04-24 | `0.125.0` 后首个 `0.126.0` 预发布标签，公开 notes 缺席 |
| `0.126.0-alpha.2` | 2026-04-25 | 预发布继续滚动，仍只能确认 tag 与构建资产 |
| `0.126.0-alpha.3` | 2026-04-26 | alpha 线进入连续烘焙，release notes 仍未公开 |
| `0.126.0-alpha.4` | 2026-04-27 | 同一轮预发布继续推进，后续主分支出现权限、memory 与 keymap 信号 |
| `0.126.0-alpha.5` | 2026-04-27 | 该标签以 tag 页面形式出现，资产较少，仍不宜当稳定发布使用 |
| `0.126.0-alpha.6` | 2026-04-27 | alpha 继续滚动，公开页面无功能明细 |
| `0.126.0-alpha.7` | 2026-04-27 | 高频预发布继续，建议等待 stable notes 回收确认 |
| `0.126.0-alpha.8` | 2026-04-27 | 当日第四个 alpha，说明该轮仍在快速验证 |
| `0.126.0-alpha.9` | 2026-04-28 | 预发布推进到 4 月 28 日，公开 notes 仍缺席 |
| `0.126.0-alpha.10` | 2026-04-28 | alpha.10 之后主分支仅剩少量 commits，接近一轮收敛尾声 |
| `0.126.0-alpha.11` | 2026-04-28 | 当前最新公开 prerelease；尚无稳定版 `0.126.0` |

##### 新特性用法

- **暂无可确认稳定用法**：`0.126.0-alpha.*` 页面只确认预发布标签、
  时间与资产，没有正式 notes；生产环境仍建议停在 `0.125.0` 或等待
  `0.126.0` 稳定版。
```text
生产环境：使用 0.125.0
实验环境：只在可回滚机器上试 0.126.0-alpha.11
```
- **可配置 keymap 信号**：主分支 merged commit `#18593` 显示 TUI
  configurable keymap support 已进入代码线；由于 release notes 和配置
  schema 还未公开，不建议把具体 keymap TOML 写进团队默认配置。
```text
预发布观察：关注 0.126.0 stable notes / config reference
目标用途：把 TUI 快捷键改成团队或个人习惯
```
- **内置 permission profiles 信号**：主分支 commit `#19900` 显示权限
  profile 继续收敛为 built-in defaults；这和 `0.125.0` 的 permission
  profile round-trip 是同一条能力线，适合继续观察 `/permissions`
  交互和 app-server permission API 是否简化。
```text
/permissions
# 观察是否出现内置 profile / 默认 profile 选择
```
- **Memory housekeeping 信号**：`#19998`、`#20000`、`#20005` 与
  `#19990` 显示 memory 启动、清理和限流场景继续打磨；如果你经常切
  项目或使用 memories，alpha 线值得关注但不建议直接写生产流程。
```text
切换项目后检查 memory 行为
额度紧张时观察是否跳过 memory startup
```

##### 关键 fix

- **网络代理收紧**：主分支 commit `#20001` 与 `#20002` 显示 Linux
  proxy bridge helper 和 network proxy bypass 默认值在加固，受影响
  的是依赖代理、私有网络或严格网络审批的环境。
- **MCP stdio 进程泄漏**：`#19753` 修了 shutdown 时 stdio MCP server
  终止问题，避免 MCP server 残留后台进程。
- **workspace metadata 保护**：`#19846` 与 `#19847` 继续加固受保护的
  workspace metadata 路径，降低 sandbox / Seatbelt 场景中的误写风险。
- **TUI 交互边角**：`#19986` 修了空 shell mode 下 `Esc` 退出问题，
  `#19625` 修了退出时 keyboard reporting reset，终端状态更不容易被
  留坏。

**主分支未发版** (截至 2026-04-29)：
- PR #19959: 修复 log db batch flush flake；GitHub release 页面显示
  `0.126.0-alpha.11` 之后仍有 1 个 commit 进入 main。

这些内容已进入主分支但尚未发版，需等待下个 Release 或自行评估源码安
装。

---

### Q1（2026-01 ~ 03）

#### 2026-03 | CLI 0.118.0 / App Workflow Update

**信息截止**：2026-03-31 | **最新 Release**：0.118.0

| 更新 | 日期 | 一句话 |
|------|------|--------|
| CLI 0.118.0 | 2026-03-31 | 支持动态 Bearer Token 刷新；`codex exec` 支持 prompt + stdin 组合输入 |
| App Workflow | 2026-03-25 | Plugins 可安装化；线程检索增强；App ↔ VS Code 设置同步 |
| Slash Commands | 2026-03-19 | Skills 进入 `@` 菜单；新增 `/model` 快速切换命令 |

##### 新特性用法

- **动态 Token**：在 `config.toml` 中配置 `requires_openai_auth = true`，CLI 会自动 handle 短期凭证的刷新，适合企业代理环境。
```toml
# 自定义 Provider 示例
model_provider = "my_codex"
model = "gpt-5.4"

[model_providers.my_codex]
name = "my_codex"
base_url = "https://your-gateway.example/v1"
wire_api = "responses"
requires_openai_auth = true
```
- **`@` 菜单**：在 Composer 中直接输入 `@` 即可选择已安装的 Skill，无需记忆长指令。
- **Plugins 封装**：创建 `.codex-plugin/plugin.json`，可将 skill、MCP server 配置和 app 设置打包成可复用工作流，通过 marketplace 安装。
- **历史归档**：使用 sidebar 或 thread search 查找旧线程，支持一键归档本地线程，不必重复描述上下文。

##### 关键 fix

- (无重大 fix，聚焦功能增强)

#### 2026-01 ~ 02 | Harness Engineering / GPT-5.3

**信息截止**：2026-02-28 | **最新 Release**：v0.1.x (Stable Beta)

| 更新 | 日期 | 一句话 |
|------|------|--------|
| Harness Engineering | 2026-02-11 | OpenAI 发布核心宣言，定义“Humans steer. Agents execute.”协作范式 |
| GPT-5.3-codex | 2026-01-15 | 深度编码模型发布，大幅提升大规模代码重构的逻辑一致性 |
| App Server Beta | 2026-01-05 | 开启 App Server 跨端同步测试，支持多设备共享 Session 历史 |

##### 新特性用法

- **Harness 理念实践**：强化了“反馈回路”机制，Codex 开始支持在执行工具后根据输出结果自动进行第二轮推理。

##### 关键 fix

- 本批次无关键 fix

---

## 2025 年

### Q4（2025-10 ~ 12）

#### 2025-11 ~ 12 | v0.1.x Preview / MCP Integration

**信息截止**：2025-12-30 | **最新 Release**：v0.1.20

| 更新 | 日期 | 一句话 |
|------|------|--------|
| GPT-5.2-codex | 2025-12-08 | 增强多文件读写与 Context 管理能力 |
| Native MCP Support | 2025-11-15 | Codex 原生支持模型上下文协议，打通第三方工具集成 |
| Preview Launch | 2025-10-24 | Codex CLI 进入公共预览阶段 (Public Preview) |

##### 新特性用法

- **MCP 集成**：通过配置文件指定 MCP Server 路径，Codex 可以直接调用外部数据库或 API 文档工具。

##### 关键 fix

- 本批次无关键 fix

---

### Q3（2025-07 ~ 09）

#### 2025-08 ~ 09 | v0.0.x Internal Beta

**信息截止**：2025-09-30 | **最新 Release**：v0.0.88

| 更新 | 日期 | 一句话 |
|------|------|--------|
| Initial CLI Release | 2025-09-12 | 首个命令行版本下发至内测用户，支持基础文件操作 |
| GPT-5.1-codex | 2025-08-15 | 早期代码专精模型进入测试池 |

##### 新特性用法

- 本批次以内部 beta 为主，无可公开使用法。

##### 关键 fix

- 本批次未公开 fix 列表。

---

## 更新记录

| 版本 | 日期 | 说明 |
|------|------|------|
| v1.0 | 2026-04-13 | 初始版本，建立追踪框架；记录 2026-03~04 批次内容 |
| v1.1 | 2026-04-13 | 补全 2025 Q3 至 2026 Q1 历史更新，覆盖从内测到 GPT-5.4 演进全过程 |
| v1.2 | 2026-04-13 | 修正格式规范，使用 H5 标题组织批次段落；合并深度分析内容 |
| v1.3 | 2026-04-17 | 追加 0.119.0 ~ 0.121.0 稳定版增量，并补记 0.122.0-alpha.3 预发布观察 |
| v1.4 | 2026-04-17 | 追加 App 26.415 批次，并补记同日滚到 0.122.0-alpha.5 的最新预发布观察 |
| v1.5 | 2026-04-19 | 追加 0.122.0-alpha.6 ~ alpha.10 预发布批次，并补记 alpha.10 之后的主分支未发版观察 |
| v1.6 | 2026-04-21 | 追加 0.122.0-alpha.11 ~ alpha.13 预发布批次，并补记 2026-04-20 主分支的主分支未发版观察 |
| v1.7 | 2026-04-24 | 按多发布流规则追加 0.123.0 ~ 0.124.0 CLI Stable 批次，并补记 GPT-5.5、Browser use 与 automatic approval reviews 的 App/Product 更新 |
| v1.8 | 2026-04-29 | 追加 0.125.0 稳定版与 0.126.0-alpha.1 ~ alpha.11 预发布观察 |
| v1.9 | 2026-05-06 | tags 收敛（删除 GPT-5.4）、2025-Q3 批次补齐三段式占位、`(无)` 文案统一为「本批次无关键 fix」 |
