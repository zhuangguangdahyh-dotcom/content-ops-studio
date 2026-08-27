# Layout feasibility and copy fidelity

Per-page planning counts Unicode code points, estimates lines/density, checks text regions, hierarchy, contrast and Safe Area, and chooses a declared overflow strategy. This is a planning estimate, not a Renderer measurement. EXCESSIVE density or unsafe geometry blocks finalization.

Approved copy uses exact NFKC snapshots/hashes. Wrapping, emphasis and Text Layer division may change only presentation; no word may be rewritten, omitted or added. Copy or page-count drift returns `CONTENT_REVISION_REQUIRED` and a new G3 path.
