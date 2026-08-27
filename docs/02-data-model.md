# Data model

Feishu integration adds eight independent 1.0 contracts for configuration, redacted auth diagnostics, permissions, API capabilities, Workspace plans, provisioning state, reconciliation and live evidence. Field identity is `logicalKey → field_id → current field_name`; current names compile record payloads while IDs detect renames and drift. Complete remote identifiers stay in project-local state.

## Authority and versioning

Each future customer project maps to one Feishu Base named `<project name>｜图文内容工作台`. Feishu owns structured business state; files and run evidence live under `CONTENT_OPS_HOME`. Every record carries Schema version and run provenance. IDs and unique keys are immutable after creation.

## 01 项目配置

Normally one active record.

Business fields: 项目名称 (primary text), 项目ID, 项目状态, 配置确认状态, 项目主体名称, 主体类型, 对外身份与基础介绍, 所属行业, 细分领域, 主营业务或核心产品, 服务地域, 价格带或客单价, 目标客户画像, 目标客户决策特征, 核心专业优势, 人格与表达优势, 内容目标, 核心内容方向, 内容风格, 表达语气, 目标平台, 当前主平台, 默认图片数量, 默认画幅比例, 视觉偏好, 私信钩子规则, 标题规则, 禁用表达, 禁用视觉, 当前行业包, 当前平台包, 操作者备注.

System fields: 记录唯一键, 配置版本, Schema版本, 最后运行ID, 创建时间, 最后更新时间, 数据来源.

## 02 痛点库

One painpoint per row.

Business fields: 痛点名称 (primary text), 痛点ID, 痛点审核状态, 业务场景, 客户类型, 客户决策阶段, 精准痛点需求, 深层焦虑, 触发事件, 主要阻碍或反对理由, 分析理由, 商业损失或现实代价, 内容切入角度, 可表达我方优势, 证据来源类型, 证据来源, 证据摘要, 证据日期, 证据可信度, 痛点优先级, 投流优先级, 后续图文状态, 关联内容, 已产出内容数, 最近内容日期, 重复风险, 备注.

Decision stages: 问题意识, 主动搜索, 方案比较, 风险评估, 购买决策, 使用体验, 复购推荐.

Evidence grades: A｜直接强证据, B｜多来源支持, C｜单一或间接证据, D｜假设待验证.

System fields: 项目ID, 记录唯一键, 研究批次ID, Schema版本, 最后运行ID, 创建时间, 最后更新时间.

## 03 内容库

One content item per row and exactly one primary painpoint.

Business fields: 内容主题 (primary text), 内容ID, 关联痛点, 内容角度, 内容结构类型, 目标客户显性需求, 客户真实焦虑, 本篇解决什么问题, 核心观点, 可提供的解决逻辑, 内容目标, 图片数量, 每张图文案, 页面结构摘要, 底图方向, 视觉方案摘要, 私信钩子, 发布标题, 标题字符数, 发布正文, 投流适配度, 投流判断理由, 内容重复风险, 内容状态, 图片生成状态, 首图确认状态, 最终确认状态, 同步状态, 输出相对路径, 最终图片, 创建来源, 备注.

Structure types: 问题拆解型, 清单型, 误区型, 案例型, 步骤型, 观点型, 对比型, 诊断型, 决策建议型, 故事型.

System fields: 项目ID, 记录唯一键, 内容指纹, 内容版本, 视觉方案版本, Style Lock版本, Schema版本, 最后运行ID, 最终定稿时间, 创建时间, 最后更新时间.

## 04 规则与反馈

One atomic rule or feedback item per row.

Business fields: 条目标题 (primary text), 规则反馈ID, 条目类型, 规则性质, 用户原话或原始来源, 结构化规则, 适用模块, 生效范围, 关联痛点, 关联内容, 优先级, 确认状态, 是否长期有效, 生效版本, 生效日期, 失效日期, 替代关系, 处理说明, 备注.

Entry types: 用户反馈, 项目长期规则, 项目禁用项, 行业规则候选, 平台规则候选, Plugin核心规则候选.

Rule natures: 偏好, 硬性要求, 禁用, 纠错, 流程建议. Scopes: 本次任务, 当前项目, 行业包候选, 平台包候选, Plugin核心候选.

System fields: 项目ID, 记录唯一键, 来源运行ID, Schema版本, 创建时间, 最后更新时间.

## Identifiers and unique keys

- Project: `PRJ-YYYYMMDD-XXXX`
- Painpoint: `P-0001`
- Content: `C-0001`
- Rule feedback: `R-0001`
- Run: `RUN-YYYYMMDD-HHMMSS-XXXX`
- Approval: `APR-YYYYMMDD-XXXX`
- Unique keys: `<project-id>::painpoint::P-0001`, `<project-id>::content::C-0001`, and `<project-id>::rule::R-0001`.

Phase 1A implements the locked project, workspace, evidence, painpoint, content, rules, write-log, capability, state-transition, and migration contracts. Phase 1B adds Visual System, Page Visual Plan, Style Lock, Generation Manifest, Render Report, QA Report, and Final Manifest. Phase 2A adds Runtime Config, normalized Platform and Industry Packs, Pack Resolution, Project Runtime Snapshot, Workflow Definition, Run Plan, Run Event, Run Checkpoint, Project Lock, and Runtime Diagnostic. Phase 2A.1 adds generic Runtime Evidence and corrects the unpublished Config/Diagnostic contracts under ADR-0014. The 46 canonical schemas live under `plugins/content-ops-studio/schemas/1.0/`; generated TypeScript is derived only from them.

Project installation data and runtime project data are distinct. The registry holds only non-secret project metadata and a project-relative root. Each Run owns immutable request input plus evolving plan, append-only events, write log, approvals, checkpoint, artifact index, errors, and result files. Runtime snapshots preserve the exact profile, Pack hashes, capabilities, and source versions seen by a Run.

Visual artifacts bind `content_version`, `copy_version`, `visual_plan_version`, `style_lock_version`, and asset version as applicable. Asset References use safe project-relative paths and lowercase SHA-256 checksums. A new finalized version receives a new manifest, directory, and asset identities; prior approved artifacts are retained. The four-table Feishu model remains unchanged and machine-readable in `templates/feishu/workspace-v1.json`.

Phase 3A expands the catalog to 66 strict Schemas. Its six additions are Project Profile Gap Report, Painpoint Research Plan, Research Source Manifest, Painpoint Scoring Record, Painpoint Research Report and Painpoint Review Batch. Existing Evidence, Painpoint, Painpoint Batch, Project Profile and Approval Event remain canonical referenced contracts. The four-table topology remains unchanged.

Phase 3B expands the catalog to 73 strict Schemas. Its seven additions are Content Creation Plan, Content Angle Decision, Content Claim Map, Content Duplication Report, Content Quality Report, Content Copy Review and Content Revision Plan. `content-record` now requires `copy_version`; visual fields remain present but empty until their later owner. One Painpoint can relate to many Contents, while each Content has one primary Painpoint.

Phase 4A expands the catalog to 81 strict Schemas. Its eight additions cover Visual Context, Direction Decision, Reference Manifest, Asset Requirements, Layout Feasibility, Quality, Handoff and Revision. Canonical Visual System/Page Visual Plan remain reused. The four-table topology and 141 Blueprint fields do not change.

# Phase 4B artifacts

The data model adds Renderer Config/Capability/Environment evidence, Template Manifest, First-Page Production Plan/Report, Review and Revision Plan. Generation/Render/QA artifacts can bind `PROGRAMMATIC_GRAPHIC`, `FIRST_PAGE`, `FPV-n` and Renderer environment. Style Lock additionally binds FPV and first-page checksum, but exists only after G4 approval.

Phase 4B-R adds 14 contracts for policy/context, routing, direction candidates and selection, batch planning, single/group quality, Host submission, Project Visual Profile, feedback, rule candidates/rules and Industry Visual Packs. Style Lock now explicitly separates locked rules, allowed variations and prohibited deviations.
