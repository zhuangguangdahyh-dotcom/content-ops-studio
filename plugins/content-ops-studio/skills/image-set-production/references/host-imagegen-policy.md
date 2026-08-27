# Host ImageGen policy

Use the Host-installed `$imagegen` capability for real generation/editing. Do not ask for an API key and do not call a third-party image API. Make one Host call per distinct candidate. Materialize the returned local file under Project Home immediately; validate signature, size, provenance and checksum. Reject temporary URLs and return `HOST_IMAGE_ASSET_UNMATERIALIZABLE` when no durable local asset is available. Never fall back to Mock.
