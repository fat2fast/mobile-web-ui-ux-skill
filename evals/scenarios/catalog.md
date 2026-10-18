# Catalog — source-owned evaluation contract

Status: authored before implementation; focused catalog/contrast/accessibility run passed 17 tests on 2026-10-17. Authoritative clean nine-project verification remains pending. This fictional local evaluation catalog is the app's official dataset, not fetched stock or a mock API. No checkout, discount, reservation, backend or stock mutation.

Shopper task: browse portable power stations, filter, compare exact attributes, then recover the complete listing. Frequent mobile browse/filter is an evaluation assumption. Baseline and candidate own the same six product records and handlers. Source module `src/catalog-data.js` is copied byte-identically into both apps; tests reject drift. Product illustration alt text describes the named product.

| ID | Product | Price minor units / currency | Availability | Capacity | Weight | Category |
| --- | --- | --- | --- | --- | --- | --- |
| FIELD-01 | Field 600 portable power station | 79900 USD | In stock | 600 Wh | 7.5 kg | Portable |
| FIELD-02 | Field 1000 extended expedition battery with distinguishing suffix North | 109900 USD | Preorder | 1000 Wh | 12 kg | Portable |
| HOME-01 | Home 1500 backup station | 159950 USD | In stock | 1500 Wh | 18 kg | Backup |
| HOME-02 | Home 2000 backup station | 219900 USD | Unavailable | 2000 Wh | 24 kg | Backup |
| FIELD-03 | Field 300 compact station | 39900 USD | In stock | 300 Wh | 4 kg | Portable |
| HOME-03 | Home 3000 modular station | 299900 USD | Preorder | 3000 Wh | 31 kg | Backup |

Search is case-insensitive over ID/name. Category and In stock only filters intersect with search. Sort is stable by price ascending or name, with ID tie-break. Reset clears filters and restores price order; it retains comparison selection. Applied filters are visible; zero matches offers Reset filters. Selection has no arbitrary cap, survives filtering/sorting/reset, and can be removed independently. Comparison is shown for two or more selected products, with exact price/currency/capacity/weight/availability and aligned row labels. No purchase eligibility is inferred from availability. Reload resets all in-memory state.

Baseline desktop table and controls work; on phones the wide toolbar/table reproduces discoverability/sideways-scroll friction. Candidate keeps desktop table, adapts browsing to a labeled compact image-led list, and uses a contained semantic comparison table where alignment matters. Both preserve all data/rules. Normal/empty/selected are real states; there is no asynchronous loading, server error, role restriction or theme switch to simulate.

Acceptance: at 320/390px browse → intersect filters → select at least two → sort/reset → compare/remove; exact values/units and long-name suffix accessible; keyboard labels/focus; no document horizontal overflow in candidate, with purposeful comparison-container scroll. At 1280px preserve desktop table and all operations. Rendered contrast and scoped accessibility use current-run native attachments. Handcrafted fixture correctness does not establish agent effectiveness or ecommerce conversion gains.
