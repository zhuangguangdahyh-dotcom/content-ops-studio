# Phase 4B-R.2.2 typography spatial regression matrix

| Case                                      | Expected                                   | Result   |
| ----------------------------------------- | ------------------------------------------ | -------- |
| Historical F immutable checksum           | Preserve original bytes                    | PASS     |
| Historical F former typography policy     | Preserve former PASS evidence              | PASS     |
| Historical F new spatial gate             | Block `TEXT_REGION_COLLISION`              | PASS     |
| Historical D bounded positive             | Title integrity only, no template learning | PASS     |
| Text/text bounding-box overlap            | `TEXT_TEXT_OVERLAP`                        | PASS     |
| Visually close text regions               | `TEXT_REGION_COLLISION`                    | PASS     |
| Text over graphic                         | `TEXT_GRAPHIC_OCCLUSION`                   | PASS     |
| Insufficient relative padding             | `INSUFFICIENT_CONTAINER_PADDING`           | PASS     |
| Line/glyph collision                      | `LINE_GLYPH_COLLISION`                     | PASS     |
| Forced tracking / inserted Chinese spaces | `FORCED_TRACKING_DISTORTION`               | PASS     |
| Orphan Chinese character line             | `ORPHAN_CHARACTER_BREAK`                   | PASS     |
| Competing primary text                    | `COMPETING_PRIMARY_TEXT`                   | PASS     |
| Forced dense compression                  | `DENSITY_FORCED_COMPRESSION`               | PASS     |
| Weak relative breathing room              | `TYPOGRAPHIC_BREATHING_ROOM_WEAK`          | PASS     |
| Valid dense composition                   | Pass                                       | PASS     |
| Valid image/text interlock                | Pass                                       | PASS     |
| Interlock with actual text overlap        | Block                                      | PASS     |
| Cover copy cannot fit                     | Cover Copy Revision                        | PASS     |
| Page copy cannot fit                      | Page Composition Revision                  | PASS     |
| G/H material diversity                    | At least 85                                | PASS, 91 |
| Industry/Profile isolation                | No mutation or regression                  | PASS     |
| Visual score invocation                   | Only after both pre-score gates pass       | PASS     |

Focused suite: 22 cases, 22 passed, 0 failed.
