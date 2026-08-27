# Phase 4B-R MCP tool catalog

- Previous tools: 47
- Added named tools: 14
- Current computed tools: 61
- New read-only: 6
- New controlled local write: 8
- New destructive/open-world tools: 0

Read-only: get Image Production Context, plan Asset Routing, plan/get Visual Direction Candidates, list Visual Rules, and plan Full Set Production.

Controlled local writes: submit Direction Candidate Assets, select Visual Direction, submit Generated Visual Asset metadata, evaluate Image Quality, submit Visual Feedback, confirm/update Visual Rule, and evaluate Group Quality.

The specification prose says “13” once but enumerates 14 unique names. The implementation preserves every named tool. No raw prompt/image API, URL download, Browser, shell, arbitrary file, raw Feishu or delete tool was added.
