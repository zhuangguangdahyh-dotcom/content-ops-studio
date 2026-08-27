# Cover conversion, thumbnail clarity, and semantic relevance

Phase 4B-R.2 separates an image-post cover's conversion job from both publish metadata and page-one content copy. The runtime now treats `publish_title`, `cover_primary_hook`, `cover_secondary_line`, `cover_supporting_copy`, and `page_1_content_copy` as distinct, version-bound fields. A Cover Copy Package must pass a new G3 whenever its approved text changes.

## Account goal and cover objective

Account Goal describes the account's business purpose; Cover Objective describes what one cover must accomplish. The initial goals are lead generation, brand building, knowledge education, product sales, community, and portfolio showcase. Cover objectives include audience filtering, direct Painpoint or Value, risk warning, decision checklist, result evidence, and brand statement.

Lead generation requires a specific Subject, Audience, Painpoint or Value, supported promise, and decision context. A generic professional-services Subject returns `COVER_CONTEXT_INSUFFICIENT` and one concrete clarification question. The system must not continue with a universal abstract poster.

## Xiaohongshu policy

Platform Pack 1.1.0 adds a conversion-cover policy while retaining a loadable 1.0.0 snapshot. Lead-generation hooks should normally use 6–16 visible characters, never exceed 20, and use at most three lines. Secondary copy uses at most two lines. Renderer owns all final Chinese text.

True-size QA requires both 310×414 and 186×248 PNGs. The primary hook remains the first visual focus, one click message is legible, the background does not compete, and no paragraph-like supporting copy is introduced.

Click Clarity uses a 100-point model: target customer 25, Painpoint or Value 25, one-second comprehension 20, thumbnail legibility 20, and content-promise alignment 10. Lead generation requires 85.

Semantic Relevance uses industry 20, business scene 20, Painpoint 20, content Value 15, Project/Subject 15, and Audience recognition 10. Lead generation requires 80. Decorative-only backgrounds are blocked. Abstract visuals remain possible only when the Project permits them, the semantic relation is explicit, the Audience can recognize it, and the Operator has not rejected it.

All successful QA results remain pending Operator judgment. No score creates G3, G4, Style Lock, or candidate selection.

## Revision and learning

First-Page Review retains its original primary `revision_classification` and adds optional `revision_routes`. A checksum-bound G4 REVISE may route simultaneously to copy and global visual direction while preserving the reviewed FPV. REVISE creates no Style Lock.

Project learning, Industry Pack rules, and Global User Preferences remain separate. An explicit Operator global instruction can create confirmed versioned Global Visual Rules without an intermediate candidate, but production feedback about one asset remains at minimum scope unless separately confirmed.

## Calibration evidence

The fictional `CAL-COMMERCIAL-SPACE-001` project uses `COMMERCIAL_SPACE_HOSPITALITY + SPACE_IDENTITY`, Xiaohongshu, and lead generation. It contains no real customer data and performs no Feishu write. Three materially different candidates use Host-native text-free storefront scenes and Renderer-owned Chinese. Full previews, both thumbnail sizes, three contact sheets, contract reports, actual visual inspection, and deterministic replay are retained outside the repository. Candidate generation stops at `CALIBRATION_COVER_SELECTION / AWAITING_USER_SELECTION`.
