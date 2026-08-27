# Phase 4B-R.2.2 commercial-space calibration Round 3

## Shared calibration copy

- Title: `门店老板，\n你的门头在劝退顾客吗`
- Supporting copy: `先查品类、定位、入口这3处`
- Renderer owns all formal Chinese text.
- Canvas: 1242×1660, with real 310×414 and 186×248 Renderer outputs.

## Candidate G

- ID: `CCC-CAL-SPACE-001-G`
- Direction: `BREATHABLE_EDITORIAL`
- Composition: `CROP_LAYERED`
- Text region: `CENTER_LEFT_BREATHING_FIELD`
- Asset structure: one master plus one restrained same-source crop
- Reading path: title → storefront → supporting copy
- Full SHA-256: `4183fa2a38b6f3eec02188206560bf3f5c0415551d536da9ea5ccde6326665b4`
- 310 SHA-256: `c9530b9e37cd389fda79e7ef13b575ff349984cca34ef9a93aa359c00ea68f27`
- 186 SHA-256: `874e94c9e453750a60bbc4917450a41cc6bc3a01061a42822991ccd6291b461e`
- Resolved font / weight: Songti SC / 700
- Title bbox: x 250, y 142, w 930, h 355.640625
- Supporting bbox: x 312, y 574, w 760, h 74.234375
- Minimum gap: 76.36 px; title line height: 118.56 px; ratio: 0.644; tracking: -3 px
- Container padding: not applicable; no typography container
- Scores: Click 94, Semantic 93, Painpoint 93, Image 94, Editorial 93, Integration 92, Locale 95
- Spatial / Breathing / Thumbnail / Actual Pixels: PASS / PASS / PASS / PASS
- Retained aesthetic risk: the deliberately large pale translucent editorial field still requires Operator taste judgment. It is not a defect or reusable template.

## Candidate H

- ID: `CCC-CAL-SPACE-001-H`
- Direction: `SPATIAL_TENSION_MINIMAL`
- Composition: `ASYMMETRIC_NEGATIVE_SPACE`
- Text region: `CENTER_RIGHT_NATURAL_NEGATIVE_SPACE`
- Asset structure: one uninterrupted full storefront scene
- Reading path: architectural edge → title → recessed entrance
- Full SHA-256: `d673b0f03bbd12757de8b31cba51b443b1ab5f5c262d0e5a13ee1489ef5e9714`
- 310 SHA-256: `0592e44a0d2c9ee9a8a40434b101b9ac9af57e2cc06e1d9483fcb0a1b717bfb1`
- 186 SHA-256: `4a0e2e370b41d0dbbba6a3a75209ff96b4fa63eef38b73812f7261cab9d7f2b7`
- Resolved font / weight: Songti SC / 700
- Title bbox: x 330, y 944, w 860, h 352.21875
- Supporting bbox: x 340, y 1372, w 850, h 74.234375
- Minimum gap: 75.78 px; title line height: 117.42 px; ratio: 0.645; tracking: -3 px
- Container padding: not applicable; no typography container
- Scores: Click 92, Semantic 92, Painpoint 91, Image 92, Editorial 91, Integration 91, Locale 95
- Spatial / Breathing / Thumbnail / Actual Pixels: PASS / PASS / PASS / PASS
- Retained aesthetic risk: the road-surface negative-space solution is restrained and legible but cooler and more austere.

## Set and workflow state

- Candidate Set Diversity: `91`
- Round 1 A/B/C: `PRESERVED`
- Round 2 D/E/F: `PRESERVED`
- Round 3 G/H: `GENERATED`
- Formal FPV: `0`
- G4: `0`
- Style Lock: `0`
- Remaining pages: `0`
- Feishu writes: `0`
- Selection: `AWAITING_USER_SELECTION`

CR04 and CR05 remain preserved as failed calibration attempts. CR04 exposed insufficient title size at the actual thumbnail. CR05 exposed a semantic line break in H's supporting copy. CR06 is the first final passing attempt; no prior run was overwritten.
