# Feishu OpenAPI snapshot — 2026-08-24

This snapshot is the Phase 2B implementation input for Feishu China. It covers only a self-built tenant application and the Bitable APIs used by Content Ops Studio. The official documentation is JavaScript-rendered; the current official Node SDK generated source was therefore used to cross-check method names, paths, payloads, response fields, pagination, and published limits. Unknown rate limits remain runtime-confirmed instead of guessed.

## Sources

- [Bitable overview](https://open.feishu.cn/document/server-docs/docs/bitable-v1/bitable-overview)
- [Create app](https://open.feishu.cn/document/server-docs/docs/bitable-v1/app/create)
- [Get app](https://open.feishu.cn/document/server-docs/docs/bitable-v1/app/get)
- [Create table](https://open.feishu.cn/document/server-docs/docs/bitable-v1/app-table/create)
- [Batch-create tables](https://open.feishu.cn/document/server-docs/docs/bitable-v1/app-table/batch_create)
- [List tables](https://open.feishu.cn/document/server-docs/docs/bitable-v1/app-table/list)
- [Field guide](https://open.feishu.cn/document/server-docs/docs/bitable-v1/app-table-field/guide)
- [Create field](https://open.feishu.cn/document/server-docs/docs/bitable-v1/app-table-field/create)
- [List fields](https://open.feishu.cn/document/server-docs/docs/bitable-v1/app-table-field/list)
- [Update field](https://open.feishu.cn/document/server-docs/docs/bitable-v1/app-table-field/update)
- [Delete field](https://open.feishu.cn/document/server-docs/docs/bitable-v1/app-table-field/delete)
- [Create view](https://open.feishu.cn/document/server-docs/docs/bitable-v1/app-table-view/create)
- [List views](https://open.feishu.cn/document/server-docs/docs/bitable-v1/app-table-view/list)
- [Create record](https://open.feishu.cn/document/server-docs/docs/bitable-v1/app-table-record/create)
- [Batch-create records](https://open.feishu.cn/document/server-docs/docs/bitable-v1/app-table-record/batch_create)
- [Update record](https://open.feishu.cn/document/server-docs/docs/bitable-v1/app-table-record/update)
- [Batch-update records](https://open.feishu.cn/document/server-docs/docs/bitable-v1/app-table-record/batch_update)
- [Search records](https://open.feishu.cn/document/server-docs/docs/bitable-v1/app-table-record/search)
- [Tenant access token for self-built apps](https://open.feishu.cn/document/server-docs/authentication-management/access-token/tenant_access_token_internal)
- [Server SDK overview](https://open.feishu.cn/document/server-docs/server-side-sdk)
- [Official Node SDK](https://github.com/larksuite/node-sdk), generated Bitable source on `main`, and package metadata for `@larksuiteoapi/node-sdk@1.73.0`.

## Authentication and application boundary

- Region: China; API origin allowlist: `https://open.feishu.cn`.
- Supported application type: `SELF_BUILT_TENANT_APP`.
- Token endpoint: `POST /open-apis/auth/v3/tenant_access_token/internal`; body contains `app_id` and `app_secret`; response expiry metadata is authoritative.
- Tokens are bearer credentials, process-memory only, refreshed before expiry, and never persisted.
- Exact tenant and document access remain a runtime permission and folder-access check.

## API matrix

| Operation            | Method and endpoint                                    | SDK method                           | Key request/response facts                                                                      | Pagination / published batch limit                                             | Phase 2B                           |
| -------------------- | ------------------------------------------------------ | ------------------------------------ | ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ | ---------------------------------- |
| Token                | `POST /open-apis/auth/v3/tenant_access_token/internal` | SDK token manager                    | Self-built app credentials; token and expiry returned                                           | n/a                                                                            | yes                                |
| Create Base          | `POST /open-apis/bitable/v1/apps`                      | `bitable.app.create`                 | `name`, optional `folder_token`; returns app metadata and `default_table_id`                    | n/a                                                                            | yes                                |
| Get Base             | `GET /open-apis/bitable/v1/apps/:app_token`            | `bitable.app.get`                    | Returns name, revision, time zone                                                               | n/a                                                                            | yes                                |
| Create table         | `POST /open-apis/bitable/v1/apps/:app_token/tables`    | `bitable.appTable.create`            | May include name, default view, fields; returns table, view and field IDs                       | n/a                                                                            | yes                                |
| Batch-create tables  | `POST .../tables/batch_create`                         | `bitable.appTable.batchCreate`       | Names and optional initial fields                                                               | API states Base table/dashboard total <=100; batch request limit not confirmed | offline capability only            |
| List tables          | `GET .../tables`                                       | `bitable.appTable.list`              | items contain table ID, revision, name                                                          | `page_size`, `page_token`, `has_more`                                          | yes                                |
| Create field         | `POST .../tables/:table_id/fields`                     | `bitable.appTableField.create`       | `field_name`, numeric `type`, optional `property`; returns `field_id`                           | n/a                                                                            | yes                                |
| List fields          | `GET .../tables/:table_id/fields`                      | `bitable.appTableField.list`         | IDs, names, types, properties                                                                   | `page_size`, `page_token`, `has_more`                                          | yes                                |
| Update field         | `PUT .../fields/:field_id`                             | `bitable.appTableField.update`       | Full replacement of name/type/property, so never used as routine repair                         | n/a                                                                            | mapped but blocked for conflicts   |
| Delete field         | `DELETE .../fields/:field_id`                          | `bitable.appTableField.delete`       | Used only for exact platform-seeded fields in the newly created persisted default table         | n/a                                                                            | implemented offline, read-verified |
| Create view          | `POST .../tables/:table_id/views`                      | `bitable.appTableView.create`        | Direct request supports `view_name` and `view_type`; full filters are not claimed               | n/a; maximum 200 views published                                               | yes, name/type only                |
| List views           | `GET .../tables/:table_id/views`                       | `bitable.appTableView.list`          | IDs, names, types and returned properties                                                       | `page_size`, `page_token`, `has_more`                                          | yes                                |
| Create record        | `POST .../tables/:table_id/records`                    | `bitable.appTableRecord.create`      | `fields` is keyed by current field name; optional `client_token`                                | n/a                                                                            | yes                                |
| Batch-create records | `POST .../records/batch_create`                        | `bitable.appTableRecord.batchCreate` | Same field-name payload; returns records                                                        | maximum 1,000                                                                  | yes                                |
| Update record        | `PUT .../records/:record_id`                           | `bitable.appTableRecord.update`      | Incremental update; `fields` keyed by current field name                                        | n/a                                                                            | yes                                |
| Batch-update records | `POST .../records/batch_update`                        | `bitable.appTableRecord.batchUpdate` | records include record IDs and field-name maps                                                  | maximum 1,000                                                                  | yes                                |
| Search records       | `POST .../records/search`                              | `bitable.appTableRecord.search`      | filter conditions use `field_name`; preferred unique-key lookup                                 | `page_size`, `page_token`, `has_more`; limit runtime-confirmed                 | yes                                |
| Read record          | `GET .../records/:record_id`                           | `bitable.appTableRecord.get`         | Official SDK marks this historic; Phase 2B uses search by record ID/unique key for verification | n/a                                                                            | compatibility only                 |

## Field mapping

Blueprint types map before any request: TEXT/LONG_TEXT→type 1, NUMBER→2, SINGLE_SELECT→3, MULTI_SELECT→4, DATE/DATETIME→5, BOOLEAN→7, ATTACHMENT→17, RELATION→18 (SingleLink) or 21 (DuplexLink). Relation properties are compiled only after target table IDs exist. Record fields are compiled through `logicalKey → field_id → current field_name`; field IDs remain the identity and drift key.

## Limits, retry and uncertainty

- Published batch limits are stored only where the official source provides them; otherwise the machine-readable capability says `UNKNOWN_REQUIRES_RUNTIME_CONFIRMATION`.
- No fixed per-minute rate is asserted. HTTP 429 respects `Retry-After`; 408/network errors and explicit 5xx receive bounded retries; ordinary 4xx, permission failures, field conflicts and schema drift do not.
- The API creates one default table with a new Base. The table itself is retained and adopted only when unambiguously safe. Blueprint 1.1.0 may remove only its exact seeded `单选`、`日期`、`附件` auxiliary fields during the same persisted create Run; ordinary repair never deletes fields.
- Creating a view is implemented as name/type configuration. Filter/sort descriptions in the Blueprint remain declarative until a separately verified update-view capability is adopted.
- Exact runtime permissions, tenant installation, folder document access, relation reverse-field behavior, and live payload acceptance require sandbox evidence. Offline implementation is not live verification.

## Transport decision

The official Node SDK 1.73.0 covers the required Bitable methods, but it owns token caching, HTTP behavior and error logging through its client stack. Phase 2B requires a fake-clock token lifecycle, single-flight refresh, narrow endpoint allowlist, deterministic retry evidence and strict response redaction. ADR-0015 therefore selects Node 24 native `fetch` behind a narrow `FeishuTransport`; the official generated SDK remains the method/payload cross-check. No production dependency is added and SDK types do not enter Core.
