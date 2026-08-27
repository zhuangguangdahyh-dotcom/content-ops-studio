# Phase 4B-R.1 Project Visual Profile granularity

The additive strict Profile contract supports:

- identity/version/maturity: profile ID/version, COLD_START, LEARNING, MATURE, REVIEW_REQUIRED;
- sources and subjects: asset, background, realism, photography, illustration, character, space and product preferences;
- composition: composition, focal priority, whitespace and density;
- typography: general typography, font family, title/body size, weight, line height, tracking and alignment;
- color/effects: base/accent/contrast, effects, shadow, gradient, mask, border, corner and texture;
- production: formal/image text policies, page/candidate counts, batch preferences and quality thresholds;
- learning: approved/rejected reference elements, MUST/MUST_NOT/PREFER/AVOID rules, confirmed feedback refs, rule-version refs, exceptions and review reasons;
- audit: created/updated timestamps and Schema version.

Legacy `maturity: UNMATURE` remains readable. New strategy behavior normalizes work into the four-state R.1 maturity model. New fields are additive, and enum expansion is conservatively classified as potentially breaking for unknown consumers.
