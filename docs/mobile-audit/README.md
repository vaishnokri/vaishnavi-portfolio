# Mobile usability audit

Tested the local branch in headless Chromium (installed Chrome through Playwright) on 2026-09-11. These are browser-emulated CSS viewports, not physical iOS/Android device tests.

## Viewports

Each of 320, 360, 375, 390, 412, and 430px was tested at 780px height and again at 400px height. Landscape tests used 780px width with heights of 320, 360, 375, 390, 412, and 430px. Both light and dark themes: 36 combinations.

## Findings and fixes

- Navigation links were about 24px high on phones, the theme toggle was 36px square, and the home link was under 44px tall. All are now at least 44 by 44 CSS pixels.
- Contact wrapped onto a row by itself at 320px. Navigation now uses three links followed by two on narrow phones, and one evenly spaced row in landscape.
- The sticky phone header occupied about one third of a 400px-high viewport. It now scrolls away, with appropriate anchor clearance. Short viewports also omit decorative cover stamps.
- Utility text, profile labels, tags, and footer text ranged from about 11 to 13px. Meaningful HTML text is now at least 14px; prose remains approximately 15 to 16px. Tiny decorative SVG lettering and the redundant portrait registration mark retain their visual treatment.
- The decorative cover stamp preceded the introduction. Phone layouts now lead with the name and actions, with less vertical padding and full-width buttons on narrow screens.
- Profile fields use a full-width column on phones and flexible columns in landscape; the portrait is centered above the phone fields. Long values and the email button can wrap.
- Achievement names were only available as tiny curved stamp lettering or screen-reader labels. Each stamp now has a visible 14px semantic caption. A two-column phone / three-column landscape grid keeps the circles and captions separated. No baseline stamp overlap or page-wide overflow was observed.
- Remote Google Fonts with swap could change text metrics after rendering and required external requests. Native system sans and monospace stacks now render immediately without font downloads; font appearance follows the operating system.
- The skip link is clipped until focus, preserving keyboard access while preventing off-screen content from appearing in tall section captures.

## Verification

The 36-case geometry audit checked document overflow, all link/button bounding boxes (the intentionally off-screen skip link was tested separately), computed content font sizes, stamp clipping, and stamp intersection. All passed; see [metrics.json](metrics.json).

Separate mobile/touch emulation exercised all five navigation links, checked destination visibility, tapped the theme toggle, reloaded to check persistence, and used Tab/Enter to exercise the skip link in all 36 combinations. Initial layout-shift observations were zero and no HTTP/font requests were made. Screenshots used reduced motion and blocked HTTP requests for deterministic offline captures. Normal-motion checks also scrolled every project card and achievement into view at 320x400, 430x780, and 780x390 in both themes.

## Reviewed screenshots

Each sheet has six labeled columns, one per tested size, showing navigation, profile, a project card, and achievements. Original full-page captures for all 36 combinations were also retained in the session evidence folder.

- [Light portrait](review-light-portrait.png)
- [Dark portrait](review-dark-portrait.png)
- [Light short viewport](review-light-short.png)
- [Dark short viewport](review-dark-short.png)
- [Light landscape](review-light-landscape.png)
- [Dark landscape](review-dark-landscape.png)
- [Remaining project cards and contact](cards-contact.png)
