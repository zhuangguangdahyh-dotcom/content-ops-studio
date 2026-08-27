# Working-tree baselines

The Phase 1B, Phase 2A.1 and Phase 2B JSON manifests are deterministic, read-only audit snapshots of their uncommitted repository states. Each contains paths, SHA-256 hashes, sizes, categories, exclusions and one aggregate hash; none contains file bodies, absolute user paths or remote identifiers, and none replaces Git history. Baseline creation refuses to overwrite an existing manifest.
