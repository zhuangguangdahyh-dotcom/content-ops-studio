# ADR-0017: Feishu field identity and record writes

Status: Accepted  
Date: 2026-08-24

## Decision

`logicalKey` is the stable Plugin identity, `field_id` is the stable remote identity, and `field_name` is mutable display state. Field maps persist all three plus type snapshot, mapping version and last verification time. Official record payloads are keyed by current `field_name`; every write resolves the current name through the verified `field_id`. A rename refreshes the name snapshot and is not treated as a new field. Missing IDs and type drift block writes.

Ordinary reruns never overwrite user-managed notes or approved values. Relation values compile as official record-ID arrays. Field update is full replacement in the official API and is therefore excluded from automatic repair.

## Consequences

Chinese field renames do not break identity or cause duplicates. Mapping verification adds a read before sensitive writes, but prevents stale-name writes and silent schema drift.
