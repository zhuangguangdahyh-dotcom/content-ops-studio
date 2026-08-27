# Product definition

## Positioning

Content Ops Studio is a project-centered, multi-industry content-operations Plugin. It accumulates Subject information, Audience painpoints, evidence, content assets, visual rules, approval history, and feedback so an Operator can produce coherent long-term image-post content.

It is not merely a Xiaohongshu copy generator or an AI image tool. The intended lifecycle is:

project setup → source collection → Feishu workspace → Audience research → painpoint library → painpoint approval → content strategy → copy → visual system → first page → first-page approval → remaining pages → QA → archive → Feishu synchronization → project learning → recovery.

## V1 scope

The only supported platform design is Xiaohongshu image posts. The architecture leaves extension points for other platforms without implementing them. Industry packs are `generic` and `commercial-interior`; both are scaffolds, not completed knowledge bases.

V1 excludes video, auto-publishing, comment or direct-message automation, ad-account management, real ad-data feedback, bulk multi-platform publishing, dozens of industry templates, self-modifying core Skills, and unapproved bulk image generation.

## Roles

- **Operator**: installs, manages, and operates the Plugin.
- **Subject**: the person, company, organization, store, or product represented by content.
- **Audience**: the people the content should influence, serve, or convert.

## Bootstrap boundary

Version 0.1.0 defines contracts, state and approval protocols, Adapter interfaces, mocks, deterministic utilities, and validation. It performs no production business workflow or external operation.
