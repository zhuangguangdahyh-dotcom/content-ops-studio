# @content-ops/image-adapters

Text-free background-generation contracts with capability probing, validation, generate/regenerate, inspection, and cancellation. `MockImageGenerationAdapter` and `PromptOnlyImageGenerationAdapter` are network-free, generate no image bytes, return no fabricated image path, and leave work pending for tests or explicit external execution.

Phase 4A may declare `GENERATED_BACKGROUND` as a future asset requirement but does not invoke this package. Image models never receive final Chinese title/body/table ownership.

Phase 4B-R adds `HostNativeImageGenerationBridge`, capability/request/submission validation, real-file inspection, atomic materialization and SHA-256 hashing. It also defines Project, Evidence, Programmatic Graphic, Pure Typography and Mixed Asset adapters. The Host performs generation; this package never calls an image API or asks for an API key. Production never falls back to Mock.
