# Seller brand assets

The November 1, 2026 supplied masters are kept in `assets/seller-brand/`:
`transparent/` is the nonbackground export; `background/` retains the supplied background export.
Use transparent blue artwork on light surfaces and white artwork on dark surfaces.
Export names are historical: `White.png` is the blue full wordmark, `Blue.png` is the white full wordmark,
`Black & White Stamp (2).png` is the blue symbol, and `Black & White Stamp.png` is the white symbol.

Optimized web assets and opaque mask-safe icons are in `public/brand/*-v5.*`.
Regenerate with `cd ../store && node scripts/render-brand.mjs --landing`. The versioned URLs refresh previously cached branding.
Primary color: `#2563EB`; hover: `#1D4ED8`; selection background: `#EFF6FF`.
Merchant-owned Store logos, saved custom colors and tenant-specific app icons remain merchant-owned.
No tenant data migration is needed. Deploy the Store backend default with the storefront/Admin color defaults.
