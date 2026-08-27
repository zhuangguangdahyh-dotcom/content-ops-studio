# Phase 4B-R.2 Global User Visual Rules

Active preference: `GUVPV-1`. Each record is version 1, scope `GLOBAL_USER_PREFERENCE`, status `ACTIVE`, and was created from explicit Operator instruction rather than inferred project feedback.

- `VR-GLOBAL-COVER-CLICK` — MUST: 小红书获客型封面必须在手机信息流中快速识别，并通过精准客户、现实痛点、明确价值、风险、结果或判断中的至少一项完成点击筛选。
- `VR-GLOBAL-COVER-NO-DECORATIVE` — MUST_NOT: 不得将与行业、业务场景、客户情境、Painpoint、内容价值、项目主体或证据无直接关联的通用装饰图片作为默认封面底图。
- `VR-GLOBAL-COVER-AVOID-POSTER` — AVOID: 避免传统‘左侧小比例文字 + 右侧无关高级静物或抽象装置’的通用海报模板。
- `VR-GLOBAL-COVER-DYNAMIC-ASSET` — PREFER: 根据行业、项目、用户习惯、Painpoint、内容价值和可用资产，动态使用高质量实拍、真实项目图、人物、空间、产品、证据、业务场景、编辑设计、AI生成视觉或混合素材。
- `VR-GLOBAL-COVER-DYNAMIC-TYPE` — MUST: 封面文字的字体、字号、字重、行距、字距、对齐、颜色、留白和特效必须由项目视觉档案与单篇内容策略动态决定，并在长期使用中支持显式学习、覆盖、撤销和版本化。

The Global Runtime writes a new immutable preference version, atomically updates the active pointer and read-verifies it. No unconfirmed Rule Candidate was created. Project and Industry rules retain higher-precedence behavior where the resolver defines it; C-0001 `CURRENT_SET` feedback was not promoted.
