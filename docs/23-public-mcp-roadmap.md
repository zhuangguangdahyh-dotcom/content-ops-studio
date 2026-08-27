# Public MCP roadmap

Phase 2C is deliberately local. It bundles STDIO tools for supported desktop/CLI/IDE Hosts and local repository distribution. It has no public URL, remote authentication service, multi-tenant isolation, service availability objective, monitoring, incident response or public Plugin review.

A future public ChatGPT Web integration is a separate phase requiring an accepted threat model and ADRs for stable Streamable HTTP transport, independent authentication/authorization, tenant/data isolation, deployment, monitoring, availability, privacy disclosures, retention, abuse handling and public review. Local Lark CLI user OAuth and local Plugin Data cannot be silently reused as a web-service credential model.

Research, production image generation, Renderer, attachment upload and publishing also remain independent production integrations. Public MCP work must not begin by broadening the current local tool surface or adding raw execution/delete capabilities.
