# Frozen input prompts for decision comparison

Version 2026-10-14. Send exactly one numbered prompt at a time to each condition. These prompts deliberately omit expected patterns, case IDs and reviewer rubric. Fixture data is synthetic.

1. An existing admin order page has a sidebar, order search, filters, table and details. At 390px users struggle to find an order, read status and act, then return. Keep desktop and all current capabilities. Recommend a mobile UX decision with verification steps.
2. In an online shop, customers repeatedly move between catalog, search, cart and account, then return to a product they opened by URL. Recommend mobile navigation while keeping browser behavior.
3. Operators switch between queue, assigned and completed views inside Orders many times per shift. Filters and role access matter. Recommend navigation and how to verify it.
4. An order dashboard has about eight columns and users mostly locate one order, inspect status and open details. Filtering, sort, export and bulk actions must remain. Recommend a mobile data presentation.
5. A price comparison page lets customers compare several products across aligned features, price, limits and warranty. Recommend how to present it at phone width without losing information.
6. Staff select many orders, compare status and totals, filter the list, then apply a permitted bulk action. Recommend a phone presentation and safety checks.
7. A contact form has name, email and message. Users sometimes enter an invalid email. Recommend a mobile form and error recovery.
8. A checkout has address, delivery and payment groups. Users need to go back and correct earlier inputs after a server error. Recommend form structure and checks.
9. An eight-field request form can receive a server rejection for its reference code. Users must correct it without retyping other values. The submit control stays at the bottom of the viewport. Recommend mobile form changes and verification.
10. A compact row of 20×20 CSS px controls has generous spacing. A reviewer claims all controls fail WCAG AA because they are below 24×24. Assess the claim and recommend checks.
11. A product comparison table needs aligned values across columns. A reviewer says horizontal scroll always fails reflow. Assess the claim and recommend checks.
12. A confirmation overlay opens over an order page. Keyboard focus stays on the page behind it. Recommend a fix and verification.
