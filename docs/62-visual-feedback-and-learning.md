# Visual feedback and learning

Feedback is classified as Quality Defect, Production Feedback, Visual Preference or Project/Domain Constraint and defaults to the smallest applicable scope. Rule types are MUST, MUST_NOT, PREFER, AVOID, positive reference and negative reference.

Learning requires Feedback Event → Rule Candidate → explicit Operator-confirmed versioned Rule. Only explicit Visual Preference or Project/Domain Constraint feedback is eligible for Rule Candidate creation. Quality Defect, Tool/System Defect and current-work Production Feedback remain in their local scope and are not long-term rule candidates. G4 creates only a set Style Lock; G5 records only the approved set reference. Rules can be superseded, disabled or forgotten from active resolution without deleting audit history.

Explicit confirmation creates a new Project Visual Profile version; COLD_START normally becomes LEARNING, while maturity may reach MATURE only after sufficient compatible evidence. A CURRENT_SET override is resolved above Profile defaults for that Run without changing Profile, Pack or global preference. Revoke creates a disabled rule version and a new Profile version; later Runs exclude it while historic Runs remain bound to their earlier Profile. Forget retains a hashed audit tombstone rather than deleting history.
