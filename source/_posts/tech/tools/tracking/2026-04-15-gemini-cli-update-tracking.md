---
layout: post
title: Google Gemini CLI 更新追踪
date: 2026-04-15 12:00:00 +0800
categories: [tech, tools, tracking]
tags: [gemini-cli, google, CLI, 更新追踪]
description: 持续追踪 Google Gemini CLI 的版本更新，记录新特性用法与关键修复。
toc: true
---

> 持续追加型文档，每次工具更新后由 AI 代理追加新批次。
> 主文章参见：{% post_link tech/tools/2026-04-02-gemini-cli-sandbox-and-ghostty-isolation 'Gemini CLI Sandbox vs. Ghostty' %}

---

## 2026 年

### Q2（2026-04 ~ 06）

#### 2026-04 | v0.37.0 ~ v0.37.1

**信息截止**：2026-04-15 | **最新 Release**：v0.37.1

| 版本 | 日期 | 一句话 |
|------------|------|--------|
| `v0.37.1` | 2026-04-09 | 动态沙箱扩展、Chapters 叙事流、浏览器 Agent 增强 |
| `v0.37.0` | 2026-04-08 | 初始 v0.37 特性集发布，上下文压缩与后台内存服务 |
| `v0.38.0-p0` | 2026-04-08 | (Preview) 上下文压缩、后台任务监控、计划模式安全增强 |

##### 新特性用法

- **动态沙箱扩展 (Dynamic Sandbox Expansion)**：
  在 Linux 和 Windows 上实现了动态沙箱扩展和 Git worktree 支持，增强了在受限/隔离环境中的开发灵活性。

  ```bash
  # 开启沙箱并结合 Git Worktree 进行大规模重构
  gemini -s -w "Refactor legacy modules with isolation"
  ```

- **章节式叙事流 (Chapters Narrative Flow)**：
  引入了基于工具的主题分组（“Chapters”），将 Agent 的交互按意图和工具使用进行逻辑分组，长会话结构更清晰。

- **增强型浏览器 Agent**：
  新增了持久化会话管理和动态只读工具发现，支持沙箱感知的初始化。

- **上下文压缩服务 (Context Compression Service)**：
  自动优化长对话中的 Token 使用，并落地了后台内存服务，用于自动提取和管理 Skill。

##### 关键 fix

- **计划模式 (Plan Mode) 安全硬化**：Plan Mode 现在默认开启，并在调用 `activate_skill` 或 `web_fetch` 等敏感工具时强制要求用户确认。
- **Linux 沙箱崩溃修复**：修复了因 `ARG_MAX` 限制导致的崩溃问题。
- **Windows 安全修复**：解决了 Windows 下的符号链接绕过漏洞。
- **交互优化**：支持 Windows 终端 Ctrl+Backspace 删除单词，改进工具确认界面的选择布局。

#### 2026-04 | v0.38.0 ~ v0.38.2（CLI Stable）

**信息截止**：2026-04-21 | **最新 Release**：v0.38.2

| 版本 | 日期 | 一句话 |
|------|------|--------|
| `v0.38.2` | 2026-04-21 | 进程清理加固与 SSL 错误重试优化 |
| `v0.38.1` | 2026-04-17 | 修复 `/skills reload` 后的斜杠命令显示问题 |
| `v0.38.0` | 2026-04-15 | 稳定版发布：持久审批策略、后台进程监控、终端缓冲区模式 |

##### 新特性用法

- **上下文感知持久审批 (Context-Aware Policy Approval)**：支持在特定上下文（如特定目录或任务）下授予工具持久审批权限，大幅减少重复确认。
- **后台进程监控 (Background Process Monitoring)**：新增工具集用于检查、监控和管理后台运行的异步 Shell 进程。
- **终端缓冲区模式 (Terminal Buffer Mode)**：可选的渲染模式，解决部分终端下的界面闪烁问题。
- **`/memory` 审查命令**：新增收件箱式命令，用于统一审查和管理 Agent 自动提取的技能。

##### 关键 fix

- **SSL 状态机加固**：优化了流式传输期间针对 OpenSSL 3.x 异常错误的重试逻辑。
- **沙箱清理优化**：确保在所有异常退出路径下都能强制清理沙箱进程。
- **YOLO 模式保护**：修复了在特定配置合并时导致 YOLO 模式被降级为普通模式的漏洞。

---

#### 2026-04 | v0.40.0-nightly.20260424（Nightly）

**信息截止**：2026-04-24 | **最新 Release**：v0.40.0-nightly.20260424（预发布，不建议生产使用）

| 版本 | 日期 | 一句话 |
|------|------|--------|
| `v0.40.0-nightly.20260424` | 2026-04-24 | 离线搜索支持（内建 ripgrep）、技能提取证据要求 |

##### 新特性用法

- **离线搜索增强**：SEA（单可执行应用）现在捆绑了 `ripgrep` 二进制文件，支持在无网络环境下执行高性能搜索。

```bash
# nightly 安装（不建议生产环境使用）
npm install -g @google/gemini-cli@0.40.0-nightly.20260424
```

##### 关键 fix

- 本批次无已公开 fix 列表（预发布观察）。

#### 2026-04 ~ 05 | v0.39.0 ~ v0.42.0（CLI Stable）

**信息截止**：2026-05-12 | **最新 Release**：v0.42.0

| 版本 | 日期 | 一句话 |
|------|------|--------|
| `v0.42.0` | 2026-05-12 | 内置 agent skills 正式进入发布流，技能反馈更透明，忽略规则缓存与重试机制继续补强 |
| `v0.40.0` | 2026-04-28 | 内置 ripgrep 提供离线搜索；引入 GitHub 风格色弱主题；MCP resource tools 与四层 memory 管理一起落地 |
| `v0.39.0` | 2026-04-23 | 新增 `/memory` inbox 命令；Plan Mode 对技能激活改为显式确认；ContextManager 解耦并修复内存泄漏/PTy 耗尽 |

##### 新特性用法

- **`/memory` 收口技能记忆**：`v0.39.0` 后可以直接在会话里打开
  `/memory`，查看本轮抽取出的 skill 片段并做补丁式修正，减少技能越用越飘。
- **离线搜索 + MCP 资源组合**：`v0.40.0` 把内置 `rg` 和 MCP resource
  tools 一起补上后，本地代码搜索和外部资源查询不再完全依赖联网环境。

  ```bash
  gemini
  # 会话内先用 rg 找本地代码，再调用 MCP resource tool 取补充上下文
  ```

- **内置 agent skills**：`v0.42.0` 开始，内置技能进入主发布流，适合把常见
  拆解动作直接交给 CLI，而不是每次重复手写长提示词。

##### 关键 fix

- `v0.39.0` 修复了 ContextManager 相关的内存泄漏和 PTY 耗尽问题。
- `v0.40.0` 把忽略规则缓存与重试机制继续补强，减少离线搜索和上下文抽取
  的抖动。
- `v0.42.0` 继续修复 subagent delegation、Unicode 字符崩溃与 sticky
  header 回归。

---

## 更新记录

| 版本 | 日期 | 说明 |
|------|------|------|
| v1.0 | 2026-04-15 | 初始版本，记录 2026-04 核心更新内容 |
| v1.1 | 2026-04-15 | 修复主文章 `post_link` 链接解析失败问题 |
| v1.2 | 2026-04-24 | 增加 v0.38.x 稳定版及后续更新，补充持久审批与进程监控特性 |
| v1.3 | 2026-04-29 | 回填漏写的更新记录行（补记 v1.2 条目中含 v0.40.0-nightly 内容） |
| v1.4 | 2026-05-06 | 全量结构对齐：channel 拆批（CLI Stable / Nightly）、tags 标准化、date 统一 12:00:00、表头分隔符规范化 |
| v1.5 | 2026-05-18 | 追加 v0.39.0~v0.42.0 稳定版更新；修正 frontmatter tags |
