# optimize-doc 配套：Markdown 格式检查规范

本文档是 `optimize-doc` 拆分出的格式规则文档，用来说明
Markdown / Hexo 文章在交付前应满足的格式约束。

## 文档定位

- 角色：格式规范与验收清单
- 适用阶段：文章内容基本完成后，进入最终校验时
- 对应 skill 环节：格式检查、发布前自检

## 与 skill 的关系

本文档是 `optimize-doc` 的公开配套文档之一。

- 面向对象：仓库协作者、博客维护者、需要理解规则的人
- 文档职责：解释规则和示例
- skill 职责：执行工作流、组合模板、调用检查逻辑

## 适用时机

当你在 `optimize-doc` 工作流的最后阶段检查格式合规性时，
看本文档。

- 如果你是在写新文章，先看
  [optimize-doc 配套：Markdown 起稿模板](./markdown-templates.md)
- 如果你是在增强结构和可读性，先看
  [optimize-doc 配套：Markdown 优化方法指南](./markdown-optimization-guide.md)

## 📋 目录

- [文档定位](#文档定位)
- [与-skill-的关系](#与-skill-的关系)
- [适用时机](#适用时机)
- [Front Matter 规范](#front-matter-规范)
- [Markdownlint 规范](#markdownlint-规范)
- [代码规范](#代码规范)
- [格式检查清单](#格式检查清单)
- [常见格式错误](#常见格式错误)
- [自动化检查](#自动化检查)

---

## Front Matter 规范

### 标准格式

```yaml
---
layout: post
title: 文章标题：吸引人的副标题
date: YYYY-MM-DD HH:mm:ss +0800
categories: [主分类, 子分类]
tags: [tag1, tag2, tag3]
description: 文章描述（可选，但推荐）
toc: true
---
```

### 字段说明

| 字段 | 类型 | 必填 | 说明 | 示例 |
|------|------|------|------|------|
| `layout` | string | 是 | 布局类型 | `post` |
| `title` | string | 是 | 文章标题 | `Java 并发编程实战` |
| `date` | string | 是 | 发布日期 | `2025-01-09 14:30:00 +0800` |
| `categories` | array | 是 | 分类（数组格式） | `[tech, backend]` |
| `tags` | array | 是 | 标签（数组格式） | `[Java, 并发, 多线程]` |
| `description` | string | 否 | 文章描述 | `深入理解 Java 并发编程` |
| `toc` | boolean | 否 | 是否显示目录 | `true` |

### 关键要求

**日期格式**：必须为 `YYYY-MM-DD HH:mm:ss +0800`

```yaml
date: 2025-01-09 14:30:00 +0800
```

**Categories 和 Tags**：必须使用数组格式

```yaml
categories: [设计模式]
tags: [设计模式, 创建型模式]
```

❌ **禁止使用列表格式**：

```yaml
categories:
  - 设计模式
```

**非标准字段**：禁止使用 `updated`、`modified` 等非 Hexo 标准字段。

---

## Markdownlint 规范

### 核心规则

| 规则 ID | 规则名称 | 说明 |
|---------|---------|------|
| MD001 | 标题层级递增 | 标题层级必须递增，不能跳跃 |
| MD009 | 行尾空格 | 行尾不能有多余空格 |
| MD010 | 硬制表符 | 不能使用硬制表符（Tab），应使用空格 |
| MD012 | 多个连续空行 | 不能有多个连续空行（最多一个） |
| MD013 | 行长度 | 行长度不应过长（默认要求不超过 80 字符） |
| MD022 | 标题前后空行 | 标题前后必须有空行 |
| MD024 | 禁止重复标题 | 同一文档中不能有相同级别的重复标题 |
| MD025 | 单一标题 | 文档只能有一个一级标题（`#`），Hexo 博客内容应从 H2 开始 |
| MD030 | 列表标记空格 | 列表标记后必须有空格 |
| MD031/MD032 | 列表前后空行 | 列表前后必须有空行 |
| MD036 | 强调文本作标题 | 禁止用独立的 `**粗体**` 或 `*斜体*` 行充当标题，应使用标准标题格式或融入段落 |
| MD040 | 围栏代码块语言 | 围栏代码块必须指定语言 |

### 关键规则说明

#### MD025 - 单一标题

在 Hexo 博客中，标题已在 Front Matter 中定义，内容部分不应使用 H1 标题，应从 H2（`##`）开始。

#### MD031/MD032 - 列表前后空行

列表前后必须有空行分隔。

#### MD013 - 行长度

MD013 规则要求每行不超过 80 个字符。如果行过长，可以使用以下方法处理：

- 对于代码块中的长命令，使用反斜杠 `\` 进行换行
- 对于普通文本，可以在合适的位置换行
- 可以通过配置文件调整限制（如设置为 120 字符）

#### 中英文空格规范

中文和英文、数字之间必须有空格：

- ✅ `Factory Method 模式`
- ✅ `Java 代码`
- ✅ `Python 3.8`
- ❌ `Factory Method模式`
- ❌ `Java代码`

### Markdownlint 配置

建议在项目根目录创建 `.markdownlint.json`：

```json
{
  "default": true,
  "MD013": {
    "line_length": 120,
    "code_blocks": false,
    "tables": false
  },
  "MD033": false,
  "MD041": false
}
```

---

## 代码规范

### 代码块格式

所有代码块必须包含语言标识：

````markdown
```语言
代码内容
```
````

### 常用语言标识

| 类型 | 语言标识 |
|------|---------|
| Java | `java` |
| Python | `python` |
| Bash | `bash` |
| YAML | `yaml` |
| JSON | `json` |
| Text/模板/ASCII 图表 | `text` |
| Markdown | `markdown` |
| SQL | `sql` |

### 代码规范要求

- ✅ 代码块必须有语言标识
- ✅ 代码必须完整可运行
- ✅ 包含注释说明关键逻辑
- ✅ 提供预期输出或运行结果

---

## 格式检查清单

### Front Matter 检查

- [ ] `layout: post` 存在且正确（必填）
- [ ] `title` 存在且不为空（必填）
- [ ] `date` 格式为 `YYYY-MM-DD HH:mm:ss +0800`（必填）
- [ ] `categories` 使用数组格式 `[分类]`（必填）
- [ ] `tags` 使用数组格式 `[tag1, tag2]`（必填）
- [ ] `description` 存在（推荐）
- [ ] Front Matter 以 `---` 开始和结束
- [ ] 没有非标准字段（如 `updated`、`modified` 等）

### Markdown 语法检查

- [ ] 标题层级正确（## → ### → ####）
- [ ] 列表格式正确（`-` 或 `*` 后跟空格）
- [ ] 代码块有语言标识
- [ ] 链接格式正确 `[文本](URL)`
- [ ] 图片格式正确 `![alt](URL)`
- [ ] 表格对齐正确
- [ ] 分隔线使用 `---`（三个减号）

### Markdownlint 检查

- [ ] 列表前后有空行（MD031/MD032）
- [ ] 没有重复标题（MD024）
- [ ] 文档只有一个 H1 标题或没有 H1（MD025，Hexo 博客内容应从 H2 开始）
- [ ] 中英文之间有空格
- [ ] 标题前后有空行（MD022）
- [ ] 没有多个连续空行（MD012）
- [ ] 行尾没有多余空格（MD009）
- [ ] 没有使用硬制表符（MD010）
- [ ] 标题层级递增，无跳跃（MD001）
- [ ] 没有用独立粗体/斜体行充当标题（MD036）

### 文件命名检查

- [ ] 文件名格式为 `YYYY-MM-DD-{kebab-title}.md`
- [ ] 日期部分正确（YYYY-MM-DD）
- [ ] 标题部分使用 kebab-case（小写字母和连字符）
- [ ] 文件名与 Front Matter 中的 date 一致

### 内容格式检查

- [ ] 中文和英文之间有空格
- [ ] 标点符号使用正确（中文使用中文标点）
- [ ] emoji 使用合理，不过度
- [ ] 表格对齐正确
- [ ] 代码块缩进正确
- [ ] 列表项格式统一
- [ ] 内容组织结构清晰，相关代码放在对应章节
- [ ] 使用交叉引用建立关联，避免重复内容
- [ ] 标题命名明确区分，避免歧义

---

## 常见格式错误

### 错误 1：Front Matter 格式错误

**错误**：

```yaml
categories:
  - 设计模式
tags:
  - 设计模式
  - 创建型模式
```

**正确**：

```yaml
categories: [设计模式]
tags: [设计模式, 创建型模式]
```

### 错误 2：日期格式不完整

**错误**：

```yaml
date: 2025-01-09
```

**正确**：

```yaml
date: 2025-01-09 00:00:00 +0800
```

### 错误 3：代码块缺少语言标识

**错误**：

````markdown
```
public class Test {
    // 代码
}
```
````

**正确**：

````markdown
```java
public class Test {
    // 代码
}
```
````

### 错误 4：列表前后缺少空行（MD031/MD032）

**错误**：

```markdown
## 标题
- 列表项 1
- 列表项 2
## 下一个标题
```

**正确**：

```markdown
## 标题

- 列表项 1
- 列表项 2

## 下一个标题
```

### 错误 5：文档中使用 H1 标题（MD025）

**错误**：

```markdown
---
title: 文章标题
---

# 文章标题  ❌ 重复使用 H1
```

**正确**：

```markdown
---
title: 文章标题
---

## 文章标题  ✅ 使用 H2
```

### 错误 6：独立粗体行充当标题（MD036）

**错误**：

```markdown
### 选型结论

**pyenv + Poetry + venv**

三者各司其职，无重叠也无冲突：
```

**正确**：

```markdown
### 选型结论

推荐方案为 **pyenv + Poetry + venv**，三者各司其职，无重叠也无冲突：
```

### 错误 7：中英文之间缺少空格

**错误**：

```markdown
Factory Method模式是一种创建型设计模式。
使用Java代码实现。
```

**正确**：

```markdown
Factory Method 模式是一种创建型设计模式。
使用 Java 代码实现。
```

> 💡 **提示**：更多错误示例和详细说明可参考独立文档（待模块化拆分）。

---

## 自动化检查

### 使用 Markdownlint 工具检查

**安装**：

```bash
npm install -g markdownlint-cli
```

**检查所有文件**：

```bash
markdownlint source/_posts/**/*.md
```

**自动修复（部分规则）**：

```bash
markdownlint --fix source/_posts/**/*.md
```

**检查特定文件**：

```bash
markdownlint source/_posts/design_patterns/*.md
```

### 使用脚本检查格式

**快速检查命令**：

```bash
# 检查 Front Matter 格式
grep -r "categories:" source/_posts/ | grep -v "categories: \["

# 检查日期格式
grep -r "date:" source/_posts/ | \
  grep -v "date: [0-9]\{4\}-[0-9]\{2\}-[0-9]\{2\} \
[0-9]\{2\}:[0-9]\{2\}:[0-9]\{2\} +0800"

# 检查代码块语言标识
grep -r "^```$" source/_posts/

# 检查非标准字段
grep -r "updated:" source/_posts/
grep -r "modified:" source/_posts/

# 检查缺少 layout 字段
grep -L "layout: post" source/_posts/**/*.md
```

> 💡 **提示**：完整的 Python 检查脚本可参考独立文件（待模块化拆分）。

---

## 相关文档

- [optimize-doc 配套：Markdown 起稿模板](./markdown-templates.md) - 起稿与选模板时查看
- [optimize-doc 配套：Markdown 优化方法指南](./markdown-optimization-guide.md) - 调整结构与可读性时查看

---

## 更新记录

| 版本 | 日期 | 说明 |
|------|------|------|
| v1.0 | 2025-01-09 | 初始版本 |
| v1.1 | 2025-01-09 | 补充 Markdownlint 规范、Front Matter 非标准字段检查、内容组织结构要求 |
| v1.2 | 2025-01-12 | 精简版本，删除详细示例和脚本代码，为模块化拆分做准备 |
| v1.3 | 2025-01-12 | 添加新模板文档的交叉引用 |
| v1.4 | 2026-03-23 | 新增适用时机说明，收口为格式校验入口文档 |
| v1.5 | 2026-03-23 | 调整为 optimize-doc 配套格式规范文档 |
| v1.6 | 2026-04-07 | 去掉文件名日期前缀，统一 `source/docs` 命名规范 |
