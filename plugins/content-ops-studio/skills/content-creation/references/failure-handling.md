# Failure handling

Unconfirmed painpoint, stale hash/version, unsupported claim, invalid page/title, high duplication, score/blocker failure, lock, partial write, or readback mismatch stops progression. Preserve artifacts and verified writes, report a stable error and retry only the failed safe step. Never delete or downgrade validation.
