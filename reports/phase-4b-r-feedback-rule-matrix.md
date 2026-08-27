# Phase 4B-R feedback and rule matrix

| Feedback class            | Default scope        | Rule eligible                   | Automatic confirmation |
| ------------------------- | -------------------- | ------------------------------- | ---------------------- |
| Quality Defect            | Current Element/Page | No                              | Never                  |
| Production Feedback       | Current Page/Set     | No; current-work execution only | Never                  |
| Visual Preference         | Current Set          | Candidate                       | Never                  |
| Project/Domain Constraint | Current Project      | Candidate                       | Never                  |
| Tool/System defect        | Current Element      | No                              | Never                  |

Scopes range from Current Element through Global User Preference; unspecified feedback uses the minimum scope. Rule types are MUST, MUST_NOT, PREFER, AVOID and positive/negative reference. Every confirmed Rule keeps rationale, examples, exceptions, source event, confirmation, status and version. Update, supersede, disable and forget preserve audit history. G4/G5 never auto-create a long-term preference.

The `VFE-C-0001-COMPARISON-2` event is `PRODUCTION_FEEDBACK / CURRENT_SET`, with `long_term_rule_candidate=false`. It requests complete comparison evidence only and creates no Rule Candidate.
