# Media Permission Matrix

| Role | Upload | Edit Metadata | Review | Publish | Archive | View Private |
| --- | --- | --- | --- | --- | --- | --- |
| Owner | Yes | Yes | Yes | Yes | Yes | Yes |
| Administrator | Yes | Yes | Yes | Yes | Yes | Yes |
| Editor | Yes | Yes | Limited | No by default | No by default | Assigned |
| Contributor | Yes, review only | Own or assigned draft | No | No | No | Own or assigned |
| Reviewer | No by default | Review fields | Yes | Return or approve workflow | No | Assigned |
| Viewer | No | No | No | No | No | Explicit only |
| Public visitor | No | No | No | No | No | Published public only |

Server actions enforce permissions through `requireLegacyProfilePermission`. Database rows remain scoped by `workspace_id` and `legacy_profile_id`.
