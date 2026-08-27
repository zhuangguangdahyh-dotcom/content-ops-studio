# State transition matrix

Version: 1.0.0  
Machines: 11  
Transitions: 87  
Invalidation rules: 8

All state codes come from `plugins/content-ops-studio/config/status-map.json`. Approval-bound transitions are owned by `content-studio-router` and validate gate, target type, target ID, target version, decision, and deprecation status.

## config-confirmation

Initial: CONFIG_PENDING  
Terminal: none  
States: 3  
Transitions: 3

| From                   | Trigger                  | To                     | Owner Skill           | Gate            | Required context      | Invalidates                                             |
| ---------------------- | ------------------------ | ---------------------- | --------------------- | --------------- | --------------------- | ------------------------------------------------------- |
| CONFIG_PENDING         | CONFIRM_CONFIGURATION    | CONFIG_CONFIRMED       | content-studio-router | PROJECT_PROFILE | configuration_version | —                                                       |
| CONFIG_CONFIRMED       | INVALIDATE_CONFIGURATION | CONFIG_UPDATE_REQUIRED | project-learning      | —               | —                     | PAINPOINT_RESEARCH_VALIDITY, UNFINALIZED_CONTENT_REVIEW |
| CONFIG_UPDATE_REQUIRED | CONFIRM_CONFIGURATION    | CONFIG_CONFIRMED       | content-studio-router | PROJECT_PROFILE | configuration_version | —                                                       |

## content-status

Initial: CONTENT_ANALYSIS_PENDING  
Terminal: CONTENT_PUBLISHED, CONTENT_DISCARDED  
States: 11  
Transitions: 18

| From                     | Trigger                  | To                     | Owner Skill           | Gate         | Required context                                        | Invalidates                                      |
| ------------------------ | ------------------------ | ---------------------- | --------------------- | ------------ | ------------------------------------------------------- | ------------------------------------------------ |
| CONTENT_ANALYSIS_PENDING | START_CONTENT_PLANNING   | CONTENT_PLANNING       | content-creation      | —            | painpoint_review_status                                 | —                                                |
| CONTENT_PLANNING         | SUBMIT_COPY_FOR_APPROVAL | COPY_PENDING_APPROVAL  | content-creation      | —            | —                                                       | —                                                |
| COPY_PENDING_APPROVAL    | APPROVE_COPY             | COPY_APPROVED          | content-studio-router | CONTENT_COPY | content_version                                         | —                                                |
| COPY_PENDING_APPROVAL    | REQUEST_COPY_REVISION    | COPY_REVISION_REQUIRED | content-studio-router | —            | —                                                       | —                                                |
| COPY_REVISION_REQUIRED   | RESUBMIT_COPY            | COPY_PENDING_APPROVAL  | content-creation      | —            | —                                                       | VISUAL_PLAN, FIRST_PAGE_APPROVAL, FINAL_APPROVAL |
| COPY_APPROVED            | START_VISUAL_PLANNING    | VISUAL_PLANNING        | visual-planning       | —            | —                                                       | —                                                |
| VISUAL_PLANNING          | SUBMIT_FINAL_REVIEW      | FINAL_REVIEW_PENDING   | content-finalization  | —            | image_status, generated_page_count, expected_page_count | —                                                |
| FINAL_REVIEW_PENDING     | FINALIZE_CONTENT         | CONTENT_FINALIZED      | content-studio-router | FINAL_SET    | auto_qa_passed, content_version                         | —                                                |
| CONTENT_FINALIZED        | MARK_CONTENT_PUBLISHED   | CONTENT_PUBLISHED      | content-finalization  | —            | —                                                       | —                                                |
| CONTENT_ANALYSIS_PENDING | PAUSE_CONTENT            | CONTENT_PAUSED         | content-studio-router | —            | —                                                       | —                                                |
| CONTENT_PLANNING         | PAUSE_CONTENT            | CONTENT_PAUSED         | content-studio-router | —            | —                                                       | —                                                |
| COPY_PENDING_APPROVAL    | PAUSE_CONTENT            | CONTENT_PAUSED         | content-studio-router | —            | —                                                       | —                                                |
| COPY_REVISION_REQUIRED   | PAUSE_CONTENT            | CONTENT_PAUSED         | content-studio-router | —            | —                                                       | —                                                |
| COPY_APPROVED            | PAUSE_CONTENT            | CONTENT_PAUSED         | content-studio-router | —            | —                                                       | —                                                |
| VISUAL_PLANNING          | PAUSE_CONTENT            | CONTENT_PAUSED         | content-studio-router | —            | —                                                       | —                                                |
| FINAL_REVIEW_PENDING     | PAUSE_CONTENT            | CONTENT_PAUSED         | content-studio-router | —            | —                                                       | —                                                |
| CONTENT_PAUSED           | RESUME_CONTENT           | CONTENT_PLANNING       | content-studio-router | —            | —                                                       | —                                                |
| CONTENT_PAUSED           | DISCARD_CONTENT          | CONTENT_DISCARDED      | content-studio-router | —            | —                                                       | —                                                |

## final-approval

Initial: FINAL_NOT_SUBMITTED  
Terminal: FINAL_APPROVAL_APPROVED  
States: 4  
Transitions: 4

| From                    | Trigger                | To                      | Owner Skill           | Gate      | Required context                                                        | Invalidates |
| ----------------------- | ---------------------- | ----------------------- | --------------------- | --------- | ----------------------------------------------------------------------- | ----------- |
| FINAL_NOT_SUBMITTED     | SUBMIT_FINAL_VERSION   | FINAL_APPROVAL_PENDING  | content-finalization  | —         | image_status, generated_page_count, expected_page_count, auto_qa_passed | —           |
| FINAL_APPROVAL_PENDING  | APPROVE_FINAL_SET      | FINAL_APPROVAL_APPROVED | content-studio-router | FINAL_SET | content_version                                                         | —           |
| FINAL_APPROVAL_PENDING  | REQUEST_FINAL_REVISION | FINAL_REVISION_REQUIRED | content-studio-router | —         | —                                                                       | —           |
| FINAL_REVISION_REQUIRED | RESUBMIT_FINAL_VERSION | FINAL_APPROVAL_PENDING  | content-finalization  | —         | auto_qa_passed                                                          | —           |

## first-page-approval

Initial: FIRST_PAGE_NOT_SUBMITTED  
Terminal: FIRST_PAGE_APPROVAL_APPROVED, FIRST_PAGE_APPROVAL_REJECTED  
States: 5  
Transitions: 5

| From                         | Trigger                        | To                           | Owner Skill           | Gate       | Required context    | Invalidates |
| ---------------------------- | ------------------------------ | ---------------------------- | --------------------- | ---------- | ------------------- | ----------- |
| FIRST_PAGE_NOT_SUBMITTED     | SUBMIT_FIRST_PAGE_FOR_APPROVAL | FIRST_PAGE_APPROVAL_PENDING  | image-set-production  | —          | —                   | —           |
| FIRST_PAGE_APPROVAL_PENDING  | APPROVE_FIRST_PAGE             | FIRST_PAGE_APPROVAL_APPROVED | content-studio-router | FIRST_PAGE | visual_plan_version | —           |
| FIRST_PAGE_APPROVAL_PENDING  | REQUEST_FIRST_PAGE_REVISION    | FIRST_PAGE_REVISION_REQUIRED | content-studio-router | —          | —                   | —           |
| FIRST_PAGE_APPROVAL_PENDING  | REJECT_FIRST_PAGE              | FIRST_PAGE_APPROVAL_REJECTED | content-studio-router | —          | —                   | —           |
| FIRST_PAGE_REVISION_REQUIRED | RESUBMIT_FIRST_PAGE            | FIRST_PAGE_APPROVAL_PENDING  | image-set-production  | —          | —                   | —           |

## image-status

Initial: IMAGE_NOT_GENERATED  
Terminal: IMAGE_SET_GENERATED  
States: 7  
Transitions: 9

| From                        | Trigger                     | To                          | Owner Skill           | Gate       | Required context                                                           | Invalidates   |
| --------------------------- | --------------------------- | --------------------------- | --------------------- | ---------- | -------------------------------------------------------------------------- | ------------- |
| IMAGE_NOT_GENERATED         | START_FIRST_PAGE_GENERATION | FIRST_PAGE_GENERATING       | image-set-production  | —          | content_status, visual_plan_version, visual_plan_content_version           | —             |
| FIRST_PAGE_GENERATING       | SUBMIT_FIRST_PAGE           | FIRST_PAGE_PENDING_APPROVAL | image-set-production  | —          | —                                                                          | —             |
| FIRST_PAGE_GENERATING       | FAIL_IMAGE_GENERATION       | IMAGE_GENERATION_FAILED     | image-set-production  | —          | —                                                                          | —             |
| FIRST_PAGE_PENDING_APPROVAL | APPROVE_FIRST_PAGE          | FIRST_PAGE_APPROVED         | content-studio-router | FIRST_PAGE | visual_plan_version                                                        | —             |
| FIRST_PAGE_PENDING_APPROVAL | REVISE_FIRST_PAGE           | FIRST_PAGE_GENERATING       | image-set-production  | —          | —                                                                          | FIRST_PAGE_QA |
| FIRST_PAGE_APPROVED         | START_IMAGE_SET_GENERATION  | IMAGE_SET_GENERATING        | image-set-production  | —          | first_page_approval_status, style_lock_version, style_lock_content_version | —             |
| IMAGE_SET_GENERATING        | COMPLETE_IMAGE_SET          | IMAGE_SET_GENERATED         | image-set-production  | —          | —                                                                          | —             |
| IMAGE_SET_GENERATING        | FAIL_IMAGE_GENERATION       | IMAGE_GENERATION_FAILED     | image-set-production  | —          | —                                                                          | —             |
| IMAGE_GENERATION_FAILED     | RETRY_IMAGE_GENERATION      | FIRST_PAGE_GENERATING       | image-set-production  | —          | —                                                                          | —             |

## painpoint-contentization

Initial: PAINPOINT_NOT_CONTENTIZED  
Terminal: PAINPOINT_COVERED  
States: 5  
Transitions: 8

| From                          | Trigger                | To                            | Owner Skill           | Gate | Required context                                                    | Invalidates |
| ----------------------------- | ---------------------- | ----------------------------- | --------------------- | ---- | ------------------------------------------------------------------- | ----------- |
| PAINPOINT_NOT_CONTENTIZED     | CREATE_FORMAL_CONTENT  | PAINPOINT_CONTENT_IN_PROGRESS | content-creation      | —    | project_status, config_confirmation_status, painpoint_review_status | —           |
| PAINPOINT_CONTENT_IN_PROGRESS | COMPLETE_CONTENT_DRAFT | PAINPOINT_CONTENT_AVAILABLE   | content-creation      | —    | —                                                                   | —           |
| PAINPOINT_CONTENT_AVAILABLE   | CREATE_FORMAL_CONTENT  | PAINPOINT_CONTENT_IN_PROGRESS | content-creation      | —    | painpoint_review_status                                             | —           |
| PAINPOINT_CONTENT_AVAILABLE   | MARK_PAINPOINT_COVERED | PAINPOINT_COVERED             | content-finalization  | —    | —                                                                   | —           |
| PAINPOINT_NOT_CONTENTIZED     | PAUSE_PAINPOINT        | PAINPOINT_PAUSED              | content-studio-router | —    | —                                                                   | —           |
| PAINPOINT_CONTENT_IN_PROGRESS | PAUSE_PAINPOINT        | PAINPOINT_PAUSED              | content-studio-router | —    | —                                                                   | —           |
| PAINPOINT_CONTENT_AVAILABLE   | PAUSE_PAINPOINT        | PAINPOINT_PAUSED              | content-studio-router | —    | —                                                                   | —           |
| PAINPOINT_PAUSED              | RESUME_PAINPOINT       | PAINPOINT_NOT_CONTENTIZED     | content-studio-router | —    | —                                                                   | —           |

## painpoint-review

Initial: PAINPOINT_PENDING  
Terminal: PAINPOINT_REJECTED  
States: 4  
Transitions: 6

| From                        | Trigger                        | To                          | Owner Skill           | Gate       | Required context  | Invalidates                |
| --------------------------- | ------------------------------ | --------------------------- | --------------------- | ---------- | ----------------- | -------------------------- |
| PAINPOINT_PENDING           | CONFIRM_PAINPOINTS             | PAINPOINT_CONFIRMED         | content-studio-router | PAINPOINTS | painpoint_version | —                          |
| PAINPOINT_PENDING           | REQUEST_PAINPOINT_REVISION     | PAINPOINT_REVISION_REQUIRED | content-studio-router | —          | —                 | —                          |
| PAINPOINT_PENDING           | REJECT_PAINPOINTS              | PAINPOINT_REJECTED          | content-studio-router | —          | —                 | —                          |
| PAINPOINT_REVISION_REQUIRED | CONFIRM_PAINPOINTS             | PAINPOINT_CONFIRMED         | content-studio-router | PAINPOINTS | painpoint_version | —                          |
| PAINPOINT_REVISION_REQUIRED | REJECT_PAINPOINTS              | PAINPOINT_REJECTED          | content-studio-router | —          | —                 | —                          |
| PAINPOINT_CONFIRMED         | INVALIDATE_CONFIRMED_PAINPOINT | PAINPOINT_REVISION_REQUIRED | project-learning      | —          | —                 | UNFINALIZED_CONTENT_REVIEW |

## project-status

Initial: PROJECT_INITIALIZING  
Terminal: PROJECT_ARCHIVED  
States: 5  
Transitions: 7

| From                         | Trigger                         | To                           | Owner Skill            | Gate            | Required context           | Invalidates |
| ---------------------------- | ------------------------------- | ---------------------------- | ---------------------- | --------------- | -------------------------- | ----------- |
| PROJECT_INITIALIZING         | COMPLETE_PROJECT_INITIALIZATION | PROJECT_PENDING_CONFIRMATION | project-initialization | —               | —                          | —           |
| PROJECT_PENDING_CONFIRMATION | CONFIRM_PROJECT_PROFILE         | PROJECT_ACTIVE               | content-studio-router  | PROJECT_PROFILE | configuration_version      | —           |
| PROJECT_PENDING_CONFIRMATION | PAUSE_PROJECT                   | PROJECT_PAUSED               | content-studio-router  | —               | —                          | —           |
| PROJECT_ACTIVE               | PAUSE_PROJECT                   | PROJECT_PAUSED               | content-studio-router  | —               | —                          | —           |
| PROJECT_PAUSED               | RESUME_PROJECT                  | PROJECT_ACTIVE               | content-studio-router  | —               | config_confirmation_status | —           |
| PROJECT_ACTIVE               | ARCHIVE_PROJECT                 | PROJECT_ARCHIVED             | content-studio-router  | —               | —                          | —           |
| PROJECT_PAUSED               | ARCHIVE_PROJECT                 | PROJECT_ARCHIVED             | content-studio-router  | —               | —                          | —           |

## rule-status

Initial: RULE_UNCLASSIFIED  
Terminal: RULE_REJECTED, RULE_DEPRECATED  
States: 5  
Transitions: 4

| From                  | Trigger        | To                    | Owner Skill      | Gate | Required context | Invalidates |
| --------------------- | -------------- | --------------------- | ---------------- | ---- | ---------------- | ----------- |
| RULE_UNCLASSIFIED     | CLASSIFY_RULE  | RULE_PENDING_APPROVAL | project-learning | —    | —                | —           |
| RULE_PENDING_APPROVAL | ACTIVATE_RULE  | RULE_ACTIVE           | project-learning | —    | —                | —           |
| RULE_PENDING_APPROVAL | REJECT_RULE    | RULE_REJECTED         | project-learning | —    | —                | —           |
| RULE_ACTIVE           | DEPRECATE_RULE | RULE_DEPRECATED       | project-learning | —    | —                | —           |

## run-status

Initial: RUN_CREATED  
Terminal: RUN_CANCELLED, RUN_SUCCEEDED  
States: 11  
Transitions: 17

| From              | Trigger                  | To                | Owner Skill           | Gate | Required context                           | Invalidates |
| ----------------- | ------------------------ | ----------------- | --------------------- | ---- | ------------------------------------------ | ----------- |
| RUN_CREATED       | START_PREFLIGHT          | RUN_PREFLIGHT     | content-studio-router | —    | —                                          | —           |
| RUN_PREFLIGHT     | START_PAINPOINT_RESEARCH | RUNNING           | painpoint-research    | —    | project_status, config_confirmation_status | —           |
| RUN_PREFLIGHT     | PASS_PREFLIGHT           | RUNNING           | content-studio-router | —    | —                                          | —           |
| RUN_PREFLIGHT     | BLOCK_PREFLIGHT          | RUN_BLOCKED       | content-studio-router | —    | —                                          | —           |
| RUNNING           | REQUEST_APPROVAL         | AWAITING_APPROVAL | content-studio-router | —    | —                                          | —           |
| RUNNING           | COMPLETE_PARTIAL         | RUN_PARTIAL       | content-studio-router | —    | —                                          | —           |
| RUNNING           | BLOCK_RUN                | RUN_BLOCKED       | content-studio-router | —    | —                                          | —           |
| RUNNING           | DETECT_CONFLICT          | RUN_CONFLICT      | content-studio-router | —    | —                                          | —           |
| RUNNING           | FAIL_RUN                 | RUN_FAILED        | content-studio-router | —    | —                                          | —           |
| RUNNING           | CANCEL_RUN               | RUN_CANCELLED     | content-studio-router | —    | —                                          | —           |
| RUNNING           | COMPLETE_RUN             | RUN_SUCCEEDED     | content-studio-router | —    | —                                          | —           |
| AWAITING_APPROVAL | RECEIVE_APPROVAL         | RUN_RESUMING      | content-studio-router | —    | —                                          | —           |
| RUN_PARTIAL       | RESUME_RUN               | RUN_RESUMING      | content-studio-router | —    | —                                          | —           |
| RUN_BLOCKED       | RESUME_RUN               | RUN_RESUMING      | content-studio-router | —    | —                                          | —           |
| RUN_CONFLICT      | RESOLVE_CONFLICT         | RUN_RESUMING      | content-studio-router | —    | —                                          | —           |
| RUN_FAILED        | RETRY_RUN                | RUN_RESUMING      | content-studio-router | —    | —                                          | —           |
| RUN_RESUMING      | CONTINUE_RUN             | RUNNING           | content-studio-router | —    | —                                          | —           |

## sync-status

Initial: SYNC_NOT_STARTED  
Terminal: SYNC_COMPLETED  
States: 5  
Transitions: 6

| From             | Trigger       | To               | Owner Skill          | Gate | Required context | Invalidates |
| ---------------- | ------------- | ---------------- | -------------------- | ---- | ---------------- | ----------- |
| SYNC_NOT_STARTED | START_SYNC    | SYNC_IN_PROGRESS | content-finalization | —    | —                | —           |
| SYNC_IN_PROGRESS | COMPLETE_SYNC | SYNC_COMPLETED   | content-finalization | —    | —                | —           |
| SYNC_IN_PROGRESS | PARTIAL_SYNC  | SYNC_PARTIAL     | content-finalization | —    | —                | —           |
| SYNC_IN_PROGRESS | FAIL_SYNC     | SYNC_FAILED      | content-finalization | —    | —                | —           |
| SYNC_PARTIAL     | RETRY_SYNC    | SYNC_IN_PROGRESS | content-finalization | —    | —                | —           |
| SYNC_FAILED      | RETRY_SYNC    | SYNC_IN_PROGRESS | content-finalization | —    | —                | —           |
