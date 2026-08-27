# Skill contracts

Phase 2C connects only `content-studio-router` and `project-initialization` to the bundled `content-ops` MCP dependency. Project initialization follows Doctor → setup if needed → plan → explicit initialize → G1 stop → explicit approval → resume → verify. Other Skills do not claim unavailable Research, image, Renderer, attachment or publishing tools.

Official `lark-shared` and `lark-base` Skills may guide Agent command choice but are not Runtime dependencies. Runtime uses only the official executable and repository-owned strict JSON contracts; official Skill source is never copied or modified.

`project-initialization` now defines DISCOVER, PROVISION, UPDATE, INSPECT, VERIFY, REPAIR and MIGRATE. It delegates network work to Runtime/Adapter, cannot read secrets, cannot bypass the live gates, and cannot approve G1. Router project intents are NEW_PROJECT, UPDATE_PROJECT, REPAIR_PROJECT, AUDIT_PROJECT and RESUME_RUN.

Eight top-level Skills split orchestration from owned side effects.

1. `content-studio-router`: resolves intent/project/state, builds envelopes, records G1–G5 approval events, resumes runs, routes minimum necessary work, and aggregates results. It creates no painpoints, copy, or images.
2. `project-initialization`: contracts for DISCOVER, PROVISION, UPDATE, REPAIR, and MIGRATE. Bootstrap performs no Feishu operation.
3. `painpoint-research`: structures evidence-backed Audience painpoints and never auto-confirms them.
4. `content-creation`: turns one confirmed painpoint into one Xiaohongshu image-post content package without generating images or overwriting approved versions.
5. `visual-planning`: converts approved copy into an executable page system without generating production images or silently rewriting copy.
6. `image-set-production`: separates image-model backgrounds from deterministic Chinese text; it cannot make remaining pages before G4.
7. `content-finalization`: requires exact G3/G4/checksum-bound G5 and current QA/Style Lock evidence, re-verifies final bytes, creates immutable Manifest/Fingerprint/Delivery/Archive artifacts, and keeps Workspace sync independent without fabricating success.
8. `project-learning`: captures raw feedback and versioned project rules without changing core Skills or packs.

Every Skill consumes a versioned task envelope, returns a task result, respects field ownership and the shared state machine, requests human approval at its boundary, and returns `BLOCKED` when a required production capability is only a scaffold.

Phase 1B formalizes ownership without enabling production side effects: `visual-planning` creates Visual Systems and Page Visual Plans; `image-set-production` creates generation records and Style Lock only after current G4; `content-finalization` owns render/QA/final-manifest preparation; `content-studio-router` alone records G4/G5 approval. Mock and prompt-only Adapters cannot turn a pending external operation into success.

Phase 2A binds those contracts to deterministic Workflow Definitions. Step handlers are dependency-injected and capability-gated. `content-studio-router` remains the only semantic owner allowed to append formal approval events. Reference handlers are fixture-only and cannot be selected by `DRY_RUN` or `PRODUCTION` as a substitute for an unavailable production Skill or Adapter.

Phase 3A makes `project-initialization` responsible for DISCOVER gaps and makes `painpoint-research` responsible for Run-bound plans, source/evidence quality, deterministic scoring, honest counts and the G2 request. Host-native research is a declared MCP dependency in `agents/openai.yaml`; the Skill still provides workflow judgment and may not invent sources or claim that the MCP server fetched them.

Phase 3B makes `content-creation` responsible for CREATE_NEW, CREATE_ALTERNATE, REVISE and AUDIT_DUPLICATION. It requires one confirmed Painpoint/problem/viewpoint, Evidence for factual Claims, 4–8 purposeful pages and the quality/duplicate gates. It writes at most one Content row per unique key and must return the exact package for explicit G3 review; it never invokes Visual Planning.

Phase 4A makes `visual-planning` responsible for PLAN, REVISE_PLAN, VALIDATE and GET_FIRST_PAGE_HANDOFF. It preserves exact copy/page count, selects an executable mode/asset strategy and stops before production. The Router sends copy/page-count edits back to Content Revision and never auto-creates G4.

# Phase 4B Skill boundary

`image-set-production` may check/setup the Renderer, plan/render/verify one Cover, show it, collect a First-Page Review and route the formal G4 event through Runtime. It must not edit approved copy/VV, call a raw browser or Lark CLI, auto-approve, generate remaining pages or invoke an image model.

Phase 4B-R extends the Skill to route six asset channels and invoke the Host-installed ImageGen capability. It must materialize results under Project Home, keep formal text Renderer-owned, show 2–3 real candidates and stop for selection. It never chooses a direction, calls an image API, requests an API key, confirms a long-term rule, or treats a quality score as approval.

# Stage 10 Finalization boundary

`content-finalization` now owns a production-capable local `FINALIZATION_AND_DELIVERY_V1` flow. It creates no copy or visual revision and makes zero ImageGen/Renderer calls. TEST fixture approvals are rejected by Production Runtime/Workspace. `FINALIZED` remains independent from Feishu metadata sync and attachment upload.
