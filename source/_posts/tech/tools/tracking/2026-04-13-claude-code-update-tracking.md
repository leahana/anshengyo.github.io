---
layout: post
title: Claude Code 更新追踪
date: 2026-04-13 12:00:00 +0800
categories: [tech, tools, tracking]
tags: [claude-code, anthropic, CLI, 更新追踪]
description: 持续追踪 Claude Code CLI 的版本更新，按季度组织，记录新特性用法与关键修复。
toc: true
---

> 持续追加型文档，每次工具更新后由 AI 代理追加新批次。
> 主文章参见：{% post_link tech/ai/2026-03-13-claude-code-cli-vibecoding-guide 'Claude Code Vibecoding 指南' %}

---

## 2025 年

### Q4（2025-10 ~ 12）

#### 待补录 | vX.X.X ~ vX.X.X

> 占位，待补录。信号来源：[Anthropic Docs](https://docs.anthropic.com/en/release-notes/claude-code) / [GitHub CHANGELOG](https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md)

---

### Q3（2025-07 ~ 09）

#### 待补录 | 含首次公开发布

> 占位，待补录。Claude Code 首次公开发布约在此季度。

---

### Q2（2025-04 ~ 06）

#### 待补录 | 内测 / 早期版本

> 占位，待补录（如有公开版本）。

---

## 2026 年

### Q2（2026-04 ~ 06）

#### 2026-04 | v2.1.89 ~ v2.1.97

**信息截止**：2026-04-09 | **最新 Release**：v2.1.97

| 版本 | 日期 | 一句话 |
|------|------|--------|
| `v2.1.97` | 2026-04-08 | `NO_FLICKER` 新增 `Ctrl+O` Focus View，状态栏支持 `refreshInterval`，`/agents` 显示子 Agent 数量；集中修了 `--resume`、权限、MCP reconnect、429 重试和 CJK 输入问题 |
| `v2.1.96` | 2026-04-08 | 快速修复 `v2.1.94` 引入的 Bedrock `403 "Authorization header is missing"` 回归 |
| `v2.1.94` | 2026-04-07 | 新增 Amazon Bedrock Mantle 支持；默认 effort 提升为 `high`；插件技能名优先用 frontmatter `name` |
| `v2.1.92` | 2026-04-04 | 新增交互式 Bedrock 配置向导；`/cost` 显示按模型和 cache hit 的拆分；`/release-notes` 变为交互式；移除 `/tag` 和 `/vim` |
| `v2.1.91` | 2026-04-02 | MCP 工具结果持久化上限可放宽；新增 `disableSkillShellExecution`；插件支持 `bin/` 可执行文件 |
| `v2.1.90` | 2026-04-01 | 新增 `/powerup` 交互式教学入口；离线时保留旧 marketplace cache |
| `v2.1.89` | 2026-04-01 | `CLAUDE_CODE_NO_FLICKER=1` 正式提供无闪烁界面；`PreToolUse` hooks 新增 `defer`；`@` 提示支持命名 subagents |

##### 新特性用法

- `NO_FLICKER` 界面：`export CLAUDE_CODE_NO_FLICKER=1` 后启动，按 `Ctrl+O` 打开 Focus View，把 prompt / 工具摘要 / 最终响应整理成更易扫读的结构
- `/powerup` + `/release-notes` + `/cost` + `/effort`：快速摸清新能力、查版本、看成本、调推理强度的固定组合
- Bedrock Mantle：`export CLAUDE_CODE_USE_MANTLE=1` 后启动，在登录界面选 `3rd-party platform`，走交互式配置向导
- 插件 `bin/` 目录：插件现在可打包可执行文件，直接从 Bash tool 调用，越来越接近可复用工具包
- `@` 命名 subagent：composer 输入 `@` 可直接选命名 subagent，减少记忆负担

##### 关键 fix

- `--resume` 恢复链路多版本持续修复（v2.1.97 集中处理）
- CJK 输入法问题（v2.1.97）
- MCP reconnect 稳定性（v2.1.97）
- Bedrock `403` 鉴权回归（v2.1.96 修复 v2.1.94 引入的问题）
- 429 重试逻辑（v2.1.97）

#### 2026-04 | v2.1.98 ~ v2.1.108

**信息截止**：2026-04-15 | **最新 Release**：v2.1.108

| 版本 | 日期 | 一句话 |
|------|------|--------|
| `v2.1.108` | 2026-04-12 | 支持 `ENABLE_PROMPT_CACHING_1H` 环境变量；新增 `/recap` 总结功能；模型支持调用内置斜杠命令 |
| `v2.1.107` | 2026-04-11 | 修复变音符号丢失问题；`/undo` 正式更名为 `/rewind` 别名；优化 Bash 工具对注释结尾环境文件的处理 |
| `v2.1.100` | 2026-04-10 | 优化企业级 TLS 代理支持（默认信任 OS CA）；区分 Rate Limits 与 Plan Limits 提示 |
| `v2.1.98` | 2026-04-09 | 补全 Google Vertex AI 交互配置向导；支持 `CLAUDE_CODE_PERFORCE_MODE` |

##### 新特性用法

- **提示词缓存控制**：设置 `export ENABLE_PROMPT_CACHING_1H=1`。在支持的平台上，这会将缓存 TTL 延长至 1 小时，显著降低长会话的推理成本。
- **会话回顾 (Recap)**：输入 `/recap` 或在长时间离开后返回会话，Claude 会自动总结上下文。可在 `/config` 中设置自动触发。
- **内置命令工具化**：Claude 现在可以将 `/init`、`/review` 等斜杠命令视为“工具”直接调用，无需用户手动输入。
- **Perforce 模式**：设置 `export CLAUDE_CODE_PERFORCE_MODE=1` 后，Claude 编辑只读文件会触发 `p4 edit` 提示，适配 P4 工作流。
- **OS CA 证书支持**：默认信任系统根证书，解决了企业网络环境下 TLS 代理导致的连接问题。

##### 关键 fix

- **变音符号丢失**：修复了在特定终端环境下，响应中的重音符号、分音符号被截断的 Bug (v2.1.107)。
- **环境文件空输出**：修复了当 `.zprofile` 等文件以 `#` 注释结尾时，Bash 工具执行返回空结果的问题 (v2.1.107)。
- **频率限制区分**：现在能准确告知用户是触及了服务器频率限制 (529) 还是个人计划额度限制。
- **Vertex AI 向导**：修正了配置流中 GCP 项目 ID 识别不准确的问题 (v2.1.98)。

#### 2026-04 | v2.1.109 ~ v2.1.114

**信息截止**：2026-04-19 | **最新 Release**：v2.1.114

| 版本 | 日期 | 一句话 |
|------|------|--------|
| `v2.1.114` | 2026-04-18 | 修复 agent team 队友请求工具权限时权限对话框崩溃的问题 |
| `v2.1.113` | 2026-04-17 | 改用原生二进制分发（per-platform optional dep）；新增 `sandbox.network.deniedDomains`；Bash 安全规则覆盖 `env`/`sudo`/`watch` 包装；subagent 卡住 10 分钟自动失败 |
| `v2.1.112` | 2026-04-16 | 修复 auto 模式下 `claude-opus-4-7 temporarily unavailable` |
| `v2.1.111` | 2026-04-16 | 新增 `xhigh` effort 档位；`/effort` 无参打开滑块；`/ultrareview` 云端并行评审；Auto 模式对 Max 订阅开放；Windows 灰度推出 PowerShell 工具 |
| `v2.1.110` | 2026-04-15 | 新增 `/tui` 无闪烁全屏命令；`Ctrl+O` 改为切换 verbose transcript，`/focus` 切换 focus 视图；Remote Control 推送通知 |
| `v2.1.109` | 2026-04-15 | 扩展思考指示器加入轮转进度提示 |

##### 新特性用法

- **原生二进制分发**（v2.1.113）：CLI 通过平台 optional dependency 拉取原生 Claude Code 二进制，启动更快。无需额外配置；`pnpm i -g @anthropic-ai/claude-code` 时自动选择匹配平台的包。
- **网络拒绝域名**（v2.1.113）：在更宽的 allowlist 之上单独阻断域名。

  ```json
  {
    "sandbox": {
      "network": {
        "deniedDomains": ["pastebin.com", "*.untrusted.example"]
      }
    }
  }
  ```

- **`/tui` 无闪烁全屏**（v2.1.110）：取代 `CLAUDE_CODE_NO_FLICKER=1` 的临时方案。在会话内输入 `/tui` 即可切换；持久化到 settings：

  ```json
  { "tui": true, "autoScrollEnabled": true }
  ```

  `Ctrl+O` 现在用于切换 verbose 模式，原 Focus View 改为 `/focus` 命令。
- **`/ultrareview` 并行代码评审**（v2.1.111）：云端 fan-out 多个评审 agent 并行检查当前 diff，对话框内显示 diffstat 与动画状态。直接输入 `/ultrareview` 触发；适合 PR 自审。
- **`xhigh` effort 与 Auto 模式**（v2.1.111）：Opus 4.7 新增介于 `high` 与 `max` 之间的 `xhigh` 档位；Max 订阅默认可用 Auto 模式（不再需要 `--enable-auto-mode`）。`/effort` 无参打开交互滑块。
- **PowerShell 工具（Windows）**（v2.1.111）：灰度推出。强制开启 / 关闭：`set CLAUDE_CODE_USE_POWERSHELL_TOOL=1`（或 `=0` 禁用）。
- **`/loop` 流控增强**（v2.1.113）：`Esc` 取消待触发的 wakeup；transcript 中显示 `Claude resuming /loop wakeup`。
- **多行输入 readline 兼容**（v2.1.113）：`Ctrl+A`/`Ctrl+E` 跳转到逻辑行首/尾；Windows 下 `Ctrl+Backspace` 删除前一个词。

##### 关键 fix

- **Opus 4.7 auto 模式不可用**（v2.1.112）：修复 `claude-opus-4-7 temporarily unavailable` 错误，影响所有 auto 模式用户。
- **Bedrock Opus 4.7 thinking 报错**（v2.1.113）：修复通过 Bedrock ARN 调用 Opus 4.7 时返回 `thinking.type.enabled not supported`。
- **MCP 并发调用看门狗**（v2.1.113）：修复一个工具的 watchdog 可能被另一个并发调用解除，导致超时不生效。
- **`dangerouslyDisableSandbox` 越权**（v2.1.113）：修复设置该开关后部分场景未触发权限提示就直接执行。以前需要手动 review 每次调用。
- **Bash 安全规则增强**（v2.1.113）：deny 规则现在能匹配 `env`/`sudo`/`watch`/`ionice`/`setsid` 包装的命令；`Bash(find:*)` 不再自动批准 `find -exec`/`-delete`；macOS 下 `/private/{etc,var,tmp,home}` 视为危险删除目标。以前可能被 wrapper 命令绕过。
- **Subagent 卡死无提示**（v2.1.113）：subagent 在流中停滞 10 分钟会以明确错误失败，不再无限挂起。
- **PermissionRequest hook updatedInput 未复检**（v2.1.110）：修复 hook 修改后的输入未重新走 deny 规则的安全漏洞。
- **agent team 权限对话框崩溃**（v2.1.114）：队友请求工具权限时主端崩溃，已修复。
- **Markdown 表格 inline code 含 `|`**（v2.1.113）：修复 transcript 渲染破裂。
- **`/effort auto` 确认文案错误**（v2.1.113）：以前误导用户以为切到了固定档位。

#### 2026-04 | v2.1.116 ~ v2.1.119

**信息截止**：2026-04-24 | **最新 Release**：v2.1.119

| 版本 | 日期 | 一句话 |
|------|------|--------|
| `v2.1.119` | 2026-04-23 | `/config` 设置写入 settings.json；新增 `prUrlTemplate`/`CLAUDE_CODE_HIDE_CWD`；`--from-pr` 多平台；Hooks 新增 `duration_ms`；集中修复 40+ Bug |
| `v2.1.118` | 2026-04-23 | Vim 可视模式上线；`/cost`+`/stats` 合并为 `/usage`；自定义主题系统；Hooks 直调 MCP 工具；新增 `DISABLE_UPDATES` 与 WSL 托管设置继承 |
| `v2.1.117` | 2026-04-22 | Opus 4.7 上下文修正为 1M；Pro/Max 默认 effort 升为 `high`；原生构建 Glob/Grep 换用 bfs/ugrep；MCP 并发启动 |
| `v2.1.116` | 2026-04-20 | 大会话 `/resume` 提速 67%；MCP 多服务器并发启动；思考进度内联显示；sandbox `rm` 危险路径安全加固 |

##### 新特性用法

- **Vim 可视模式**（v2.1.118）：在 Vim 模式下，`v` 进入字符可视模式，`V` 进入行可视模式，支持选区操作（`y` 复制、`d` 删除等），与标准 Vim 行为一致。

- **`/usage` 合并 `/cost` + `/stats`**（v2.1.118）：`/cost` 和 `/stats` 已合并为统一入口 `/usage`，分 Tab 展示费用明细与会话统计。两个旧命令仍可作为快捷方式跳转到对应 Tab。

- **自定义主题**（v2.1.118）：在会话内输入 `/theme` 创建或切换主题；也可手动编辑 `~/.claude/themes/<name>.json`；插件可在自身的 `themes/` 目录下打包并分发主题文件。

- **Hooks 直调 MCP 工具**（v2.1.118）：hooks 配置新增 `type: "mcp_tool"`，可直接触发 MCP 工具，无需启动子进程。

  ```json
  {
    "hooks": {
      "PostToolUse": [{
        "type": "mcp_tool",
        "server": "my-server",
        "tool": "notify",
        "input": { "message": "Tool finished in {{duration_ms}}ms" }
      }]
    }
  }
  ```

- **`DISABLE_UPDATES` 完全锁版本**（v2.1.118）：比 `DISABLE_AUTOUPDATER` 更严格，连 `claude update` 手动命令也一并阻断，适合 CI/CD 或企业受控环境。

  ```bash
  export DISABLE_UPDATES=1
  ```

- **`prUrlTemplate` 自定义 PR 链接**（v2.1.119）：将 footer PR 徽章指向内网 CR 系统，支持 `{owner}`、`{repo}`、`{pr}` 占位符。

  ```json
  // ~/.claude/settings.json
  {
    "prUrlTemplate": "https://cr.internal.example.com/{owner}/{repo}/pull/{pr}"
  }
  ```

- **`CLAUDE_CODE_HIDE_CWD`**（v2.1.119）：隐藏启动 logo 中的工作目录路径，适合截图或录屏。

  ```bash
  export CLAUDE_CODE_HIDE_CWD=1
  ```

- **`--from-pr` 多平台支持**（v2.1.119）：现在接受 GitLab MR、Bitbucket PR 和 GitHub Enterprise PR URL，不再局限于 github.com。

  ```bash
  claude --from-pr https://gitlab.com/mygroup/myrepo/-/merge_requests/42
  claude --from-pr https://bitbucket.org/team/repo/pull-requests/7
  ```

- **Hooks `duration_ms`**（v2.1.119）：`PostToolUse` / `PostToolUseFailure` hook 输入新增 `duration_ms` 字段，记录工具执行耗时（不含权限提示与 PreToolUse 耗时），可用于性能监控与日志。

- **Opus 4.7 上下文窗口修正**（v2.1.117）：修正前 Claude Code 误以为 Opus 4.7 上下文为 200K，导致 `/context` 百分比虚高并过早触发 autocompact；现已正确使用 1M 窗口。

- **Pro/Max 默认 effort 升为 `high`**（v2.1.117）：Opus 4.6 与 Sonnet 4.6 在 Pro/Max 订阅下默认从 `medium` 提升为 `high`，无需手动设置即可获得更强推理。

- **大会话 `/resume` 性能优化**（v2.1.116）：40MB+ 大会话文件恢复速度提升最高 67%；多个死 fork 条目也不再拖慢加载。

- **思考进度内联展示**（v2.1.116）：扩展思考期间 spinner 内联显示「still thinking → thinking more → almost done thinking」进度，替换了旧的独立提示行。

##### 关键 fix

- **Opus 4.7 上下文百分比虚高**（v2.1.117）：误将 200K 作为窗口计算，`/context` 显示异常且过早 autocompact；已修正为 1M。
- **OAuth Token 中途失效**（v2.1.117）：Plain-CLI 会话中 access token 过期时不再报「Please run /login」，改为自动刷新。
- **`WebFetch` 超大 HTML 挂起**（v2.1.117）：代理返回超大 HTML 时不再无限等待，转换前已截断。
- **Bedrock 应用推理 Profile 400**（v2.1.117）：通过应用推理 Profile 调 Opus 4.7（关闭 thinking 时）返回 400 的问题已修复。
- **sandbox `rm` 危险路径绕过**（v2.1.116）：sandbox 自动授权不再豁免对 `/`、`$HOME` 等关键目录的 `rm`/`rmdir`，防止沙箱规则被绕过。
- **Ctrl+Z 挂起终端**（v2.1.116）：通过 `npx`/`bun run` 等包装启动时，`Ctrl+Z` 不再导致终端卡死。
- **Kitty 协议快捷键失效**（v2.1.116）：`Ctrl+-` 撤销、`Cmd+Left/Right` 行首/尾跳转在 iTerm2、Ghostty、WezTerm 等终端已修复。
- **MCP OAuth 多处竞态**（v2.1.118）：跨进程刷新锁失效、keychain 并发写入覆盖、服务端吊销前本地仍继续使用等多个 OAuth 竞态问题集中修复。
- **credential 写入崩溃**（v2.1.118）：Linux/Windows 下写 `~/.claude/.credentials.json` 崩溃已修复。
- **Glob/Grep 原生构建消失**（v2.1.119）：Bash 工具被 permissions 拒绝时，Glob 与 Grep 工具不再同时消失。
- **自动模式干扰 plan 模式**（v2.1.119）：auto 模式不再注入「Execute immediately」指令覆盖 plan 模式行为。
- **Agent worktree 重用旧工作区**（v2.1.119）：`isolation: "worktree"` 的 Agent tool 不再跨 session 复用过期 worktree。
- **`TaskList` 顺序不稳定**（v2.1.119）：改为按 Task ID 排序，不再受文件系统顺序影响。
- **`/export` 显示错误模型**（v2.1.119）：现在正确显示会话实际使用模型，而非当前默认模型。
- **`/plan` 进入模式失效**（v2.1.119）：`/plan` 与 `/plan open` 现在能正确作用于已存在的 plan。
- **skills 在 autocompact 后重复执行**（v2.1.119）：autocompact 前已调用的 skill 不再在下一条用户消息时被重新触发。

#### 2026-04 | v2.1.120 ~ v2.1.122

**信息截止**：2026-04-29 | **最新 Release**：v2.1.122

| 版本 | 日期 | 一句话 |
|------|------|--------|
| `v2.1.122` | 2026-04-28 | Bedrock service tier、MCP `httpHeaders` 动态命令、企业托管策略、非信任工作区自动拒绝、hook/model 元数据与 session 搜索 |
| `v2.1.121` | 2026-04-25 | `.mcp.json` 支持 HTTP/SSE transport；新增危险 HTTP/OAuth MCP 开关；PowerShell 解析与大消息渲染优化 |
| `v2.1.120` | 2026-04-24 | AWS Bearer Token、Bedrock ARN 推断、MCP progress/header substitution、Agent tool allow/deny、Windows sandbox；同日出现 resume 启动崩溃并回滚 |

##### 新特性用法

- **Bedrock service tier（v2.1.122）**：企业或 Bedrock 用户可用环境变量选择
  service tier，适合在成本、吞吐与延迟之间做受控切换。

  ```bash
  export ANTHROPIC_BEDROCK_SERVICE_TIER="<bedrock-service-tier>"
  claude
  ```

- **HTTP/SSE MCP 配置（v2.1.121+）**：`.mcp.json` 可直接声明 HTTP/SSE
  server；v2.1.122 的 `httpHeaders` 还支持通过 shell 命令动态取值，避免把
  token 明文写死在配置里。

  ```json
  {
    "mcpServers": {
      "internal-api": {
        "type": "sse",
        "url": "https://mcp.internal.example.com/sse",
        "httpHeaders": {
          "Authorization": "Bearer $(security find-generic-password -s mcp-token -w)"
        }
      }
    }
  }
  ```

- **Agent tool 权限收口（v2.1.120）**：Agent tool 支持 `allowedTools` 与
  `disallowedTools`，可以把子任务限制在只读、审查或指定工具集合中。

  ```json
  {
    "allowedTools": ["Read", "Grep", "Glob"],
    "disallowedTools": ["Bash(rm:*)", "Bash(curl:*)"]
  }
  ```

- **企业策略与不可信工作区（v2.1.122）**：新增 enterprise managed
  policies，并可按用户设置自动拒绝 untrusted workspace 的权限请求，适合
  团队把敏感仓库和外部仓库分层管理。
- **Hook / SDK 元数据补强（v2.1.120~122）**：`UserPromptSubmit` 新增
  `session_id`，`TurnStart` / `Stop` 新增 model 信息，`precompact` 新增
  `model_context_window` 与 `transcript_path`；`tokenUsage` 进入 SDK progress
  events，方便做会话审计与成本统计。
- **搜索与提及体验（v2.1.122）**：内置 slash commands 支持 session
  search；`@` mention 支持行范围，例如 `@src/service.ts:80-140`。
- **Windows / PowerShell 线（v2.1.120~122）**：PowerShell 命令解析增强、
  Windows sandbox 进入实验阶段，并开始灰度将 PowerShell 作为默认 shell。

##### 关键 fix

- **v2.1.120 resume 崩溃**：官方状态页记录 `--resume`、`--continue` 与
  `/resume` 在 v2.1.120 启动崩溃，并通过自动更新把受影响客户端迁回
  v2.1.119；若仍卡在该版本，优先升级到 v2.1.121+，临时止血可 pin
  `@anthropic-ai/claude-code@2.1.119`。
- **MCP HTTP / OAuth 稳定性**：v2.1.121 修复 HTTP server 权限、Docker /
  DevContainer MCP auth、OAuth 过期崩溃；v2.1.122 继续修复 OAuth token
  refresh、plugin-scoped MCP tools、带 `.` 或 `/` 的 MCP tool name。
- **session / transcript 可靠性**：v2.1.122 为 JSONL 写入增加跨实例锁，
  防止 session 文件损坏；并修复 compaction 后 transcript 重复消息。
- **Bash / shell snapshot**：修复
  `CLAUDE_BASH_MAINTAIN_PROJECT_WORKING_DIR=1` 下 `cd` 被送进持久 shell、
  shell snapshot 性能、detached process 命令执行和慢 MCP server 启动。
- **plan / diff / symlink / PowerShell**：修复取消 plan mode 误取消当前请求、
  `/diff` 遇到非法 HEAD 崩溃、symlink loop、PowerShell background task 与
  worktree git branch 显示问题。
- **原生安装与自动更新**：修复 native install 的 npm autodetect、
  auto-updater、`claude --version` 支持与 `--uninstall` 原生安装脚本路径。

#### 2026-05 | v2.1.128 ~ v2.1.143

**信息截止**：2026-05-15 | **最新 Release**：v2.1.143

| 版本 | 日期 | 一句话 |
|------|------|--------|
| `v2.1.143` | 2026-05-15 | 插件依赖强校验、`/plugin` 市场显示上下文成本、`worktree.bgIsolation = "none"` 与 PowerShell 默认策略补强一起落地 |
| `v2.1.142` | 2026-05-14 | `claude agents` 新增一组后台会话分发参数，Fast mode 默认切到 Opus 4.7 |
| `v2.1.141` | 2026-05-13 | hooks JSON 新增 `terminalSequence`，`claude agents --cwd` 与 `/feedback` 附近会话打包一起补上 |
| `v2.1.139` | 2026-05-11 | `claude agents` 研究预览上线，`/goal` 让 Claude 跨 turn 持续推进任务，agent view 开始成型 |
| `v2.1.128` | 2026-05-06 | `/color` 随机色、`/mcp` 工具计数、`.zip` 插件归档与 channels 控制台鉴权一起补齐 |

##### 新特性用法

- **Agent View + `/goal`**：如果你要把长任务拆成多个后台 session，
  现在可以先开 `claude agents` 看全局，再配合 `/goal` 让当前会话围着一个
  完成条件持续推进，而不是每轮都手工提醒。
- **插件依赖可视化与强校验**：`v2.1.143` 后，禁用某个插件前会先检查
  是否还有依赖它的已启用插件；启用时则会自动拉起传递依赖，适合团队共用插件栈。
- **背景会话直接写工作副本**：当 repo 不适合大量 worktree 时，可在
  `settings.json` 里显式打开：

  ```json
  {
    "worktree": {
      "bgIsolation": "none"
    }
  }
  ```

- **Hook 直达终端通知**：`terminalSequence` 让 hook 可以发桌面通知、
  改窗口标题或触发 bell，更适合做长任务完成提醒。

##### 关键 fix

- 背景会话在 `/bg`、分离、休眠唤醒之后会更稳定地保留 model、effort、
  `--mcp-config`、`--settings` 与 `--plugin-dir`。
- 删除 agent view 会话时，transcript 清理和 worktree 清理逻辑更一致，
  减少“列表删了但本地残留”的混乱状态。
- `git worktree remove` 失败后不再回退到 `rm -rf`，避免误删 gitignored
  或进行中的文件。
- 修复了损坏的 `.credentials.json`、PowerShell 启动、右键粘贴、
  stop-hook 死循环和 macOS 受保护目录读取等稳定性问题。

---

### Q1（2026-01 ~ 03）

#### 2026-03 | v2.1.66 ~ v2.1.87

**信息截止**：2026-03-29 | **最新 Release**：v2.1.87

| 版本 | 日期 | 一句话 |
|------|------|--------|
| `v2.1.87` | 2026-03-29 | 优化大型代码库的索引性能；`/cost` 精度提升 |
| `v2.1.85` | 2026-03-26 | **Hooks 成熟**：支持条件 `if` 字段，实现更复杂的自动化流控 |
| `v2.1.84` | 2026-03-26 | 新增 `TaskCreated` / `WorktreeCreate` hook；企业级 `allowedChannelPlugins` 设置 |
| `v2.1.83` | 2026-03-25 | 新增 `CwdChanged` / `FileChanged` hook；支持 `/` 键进行 transcript 全文搜索 |
| `v2.1.81` | 2026-03-20 | **Channels 预览**：引入 `--channels` 研究预览，支持并发会话 |
| `v2.1.80` | 2026-03-19 | Skills/Commands 支持 `effort` frontmatter；插件市场支持 `settings` 源 |
| `v2.1.75` | 2026-03-13 | **语音模式**：稳定性大幅增强，解决长对话音频截断问题 |
| `v2.1.68` | 2026-03-04 | **MCP OAuth**：全面支持 RFC 9728，打通第三方工具授权链路 |

##### 新特性用法

- **条件 Hooks**：在 `CLAUDE.md` 的 hooks 定义中新增 `if: "shell command"` 字段，仅当命令返回 0 时触发 hook。
- **Transcript 搜索**：在交互界面按下 `/` 键，可快速搜索当前会话的历史上下文，对长 Vibecoding session 非常友好。
- **Channels 预览**：通过 `claude --channels` 启动，允许在同一个项目目录下开启多个互不干扰的推理通道。

##### 关键 fix

- 并发会话下的 Token 刷新与重新鉴权逻辑修复 (v2.1.81)
- 改进空闲 75 分钟后的超时提示，防止不必要的 Token 消耗 (v2.1.84)
- `CLAUDE_CODE_SUBPROCESS_ENV_SCRUB` 环境污染清理 (v2.1.83)

#### 2026-02 | v2.1.30 ~ v2.1.63

**信息截止**：2026-02-28 | **最新 Release**：v2.1.63

| 版本 | 日期 | 一句话 |
|------|------|--------|
| `v2.1.53` | 2026-02-25 | 安全加固批次：插件隔离增强，防止恶意脚本越权 |
| `v2.1.45` | 2026-02-17 | **插件系统引入**：正式支持从 GitHub/NPM 安装第三方 Plugins |
| `v2.1.41` | 2026-02-13 | 大幅改进 Session Resume 稳定性，减少恢复时的 Context 丢失 |
| `v2.1.30` | 2026-02-03 | **Hooks 基础系统**：首次引入 `PreToolUse` 等生命周期钩子 |

##### 新特性用法

- **插件安装**：支持 `/plugin install <repo>`，开启了 Claude Code 的生态扩展能力。
- **Session 恢复**：`--resume` 成为默认推荐的故障恢复手段，内部优化了状态持久化层。

#### 2026-01 | v2.1.1 ~ v2.1.29

**信息截止**：2026-01-31 | **最新 Release**：v2.1.29

| 版本 | 日期 | 一句话 |
|------|------|--------|
| `v2.1.20` | 2026-01-27 | 优化文件读取工具的 Chunking 策略，支持超大文件扫描 |
| `v2.1.11` | 2026-01-17 | 进入 v2.1 稳定版序列；全新的交互式登录流 |
| `v2.1.1` | 2026-01-07 | **v2.1 时代开启**：首个正式 v2.1 发布；核心架构重构，推理速度与准确度显著提升 |

---

## 更新记录

| 版本 | 日期 | 说明 |
|------|------|------|
| v1.0 | 2026-04-13 | 初始版本，建立追踪框架；迁移 v2.1.89~v2.1.97 批次；Q1 占位 |
| v1.1 | 2026-04-13 | 补录 Q1 2026 批次（v2.1.1~v2.1.88）；新增 2025 年占位结构 |
| v1.2 | 2026-04-14 | 核对 GitHub Releases API 实际日期；修正不存在的版本号（v2.1.0/v2.1.10/v2.1.40/v2.1.88）及错误日期 |
| v1.3 | 2026-04-15 | 增量追踪至 v2.1.108（更正此前误报的 v2.2）；新增 1H 缓存控制、会话总结、OS CA 支持 |
| v1.4 | 2026-04-19 | 增量追踪至 v2.1.114；新增原生二进制分发、`/tui`、`/ultrareview`、`xhigh` effort、PowerShell 工具，以及 Bash/sandbox 安全加固批次 |
| v1.5 | 2026-04-24 | 增量追踪至 v2.1.119；新增 Vim 可视模式、自定义主题、Hooks 直调 MCP 工具、`/usage` 合并、Opus 4.7 1M 上下文修正、多平台 `--from-pr`、`prUrlTemplate`/`CLAUDE_CODE_HIDE_CWD` |
| v1.6 | 2026-04-29 | 增量追踪至 v2.1.122；补记 v2.1.120 resume 崩溃回滚、HTTP/SSE MCP、Bedrock service tier、企业托管策略与 hook/model 元数据 |
| v1.7 | 2026-05-06 | 全量结构对齐：tags 标准化为 kebab-case、frontmatter 同步至 v4.4 规范、复核占位章节 |
| v1.8 | 2026-05-18 | 追踪至 v2.1.143；补入 agents、goal、插件依赖与后台会话更新 |
