# Dense data decisions

First identify whether users scan records, compare columns, filter, or act on a selection. Inventory identity, mandatory fields, sorting, filtering, export, bulk actions and per-record permissions before changing presentation.

| Conditions | Candidate and trade-off | Reject when |
| --- | --- | --- |
| Scan individual records by identity/status | Mobile list or cards with labeled details; faster scan | Side-by-side comparison or dense bulk editing dominates |
| Aligned cross-record comparison | Horizontal table with visible row identity and explicit scroll affordance | Context or actions disappear without a recovery path |
| Dense table with a few mobile priorities | Priority summary plus full details route | Any mandatory field becomes unreachable |
| Filter-heavy workflow | Compact filter panel with visible active filters/reset | Filter state becomes hidden or requires repeated navigation |
| Multi-select and bulk action | Table or selection mode with selection count and clear action | Cards drop selection, sort, or safe bulk affordance |

Preserve meaningful row identity, units, money/date formatting, data semantics, sort/filter/export and actions. If cards replace table markup, associate each value with a visible/accessible label. Horizontal scrolling may be appropriate for genuinely two-dimensional data; test row context and keyboard reachability. Record the choice via the [decision contract](../decision-contract.md).
