# Contract

Inputs bind one confirmed Project Profile version, Platform Pack version, Industry Pack version, project ID, Run ID, requested count, source mix, hypothesis policy and score policy. Outputs are strict `painpoint-research-plan`, `research-source-manifest`, `evidence-record`, `painpoint-scoring-record`, `painpoint-research-report`, `painpoint-batch`, and `painpoint-review-batch` artifacts.

Every candidate starts pending, belongs to one Research Batch, references retained evidence, uses one stable record unique key, and reports its actual count. A G2 approval fact never replaces item decisions; both are required.
