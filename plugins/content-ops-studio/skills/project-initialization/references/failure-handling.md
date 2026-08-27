# Failure handling

Persist successful remote creation immediately, then read-verify. Resume from provisioning state and checkpoint. Ambiguous Base candidates block. Permission, field-type and relation conflicts do not retry. 429/408/5xx retry within the configured bound. Extra remote objects and user-managed values are preserved. Failure never rolls back by deleting history. DISCOVER with missing material fields returns questions and `ready_for_painpoint_research=false`; non-blocking gaps do not force a full questionnaire. Conflicts never become inferred facts.
