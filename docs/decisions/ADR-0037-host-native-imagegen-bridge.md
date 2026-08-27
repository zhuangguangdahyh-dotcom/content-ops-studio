# ADR-0037: Host-native ImageGen bridge

- Status: Accepted
- Date: 2026-08-25

## Decision

The default generated-image path is a Host-native ImageGen bridge. Ordinary Operators do not provide an API key: the Skill invokes the Host capability, while MCP and Runtime only validate requests, inspect and materialize returned local files, calculate checksums, persist manifests, and preserve attempts. MCP never calls an arbitrary image API.

A Host result is accepted only when it resolves to a real readable image that can be copied into Project Home and read back. Conversation-only or temporary URLs are not durable assets. The model name remains null unless the Host explicitly reports it. An unsafe or impossible handoff returns `HOST_IMAGE_ASSET_UNMATERIALIZABLE`.

If Host ImageGen is unavailable, Production reports that capability accurately and may use a genuinely applicable non-generated channel. It never claims an AI result and never falls back to Mock. Third-party image APIs and credentials are outside this phase.
