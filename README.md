# Taban Uncle Records

## Local development

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env.local` if it does not exist. Update existing `.env.local` files to use the `MYSQL_*` settings from `.env.example` and remove the old PostgreSQL `DATABASE_URL`.
3. Generate two different random values by running `node -e "console.log(require('node:crypto').randomBytes(32).toString('base64url'))"` twice. Set them as `ADMIN_SESSION_SECRET` and `ADMIN_SETUP_TOKEN` in `.env.local`.
4. Start the local MySQL database with `docker compose up -d mysql`.
5. Apply the database migrations with `npm run db:deploy`.
6. Start the app with `npm run dev`, then visit `/admin/setup` and choose the admin email and password.

The first successful admin setup creates a private admin account and adds source-linked Pojulu artist, song, performance, and music-collection features. Setup is then locked; use `/admin/login` for future sessions. Sessions expire after eight hours. Never commit `.env.local` or share the setup token.

For Vercel and TiDB Cloud deployment, see [DEPLOYMENT.md](./DEPLOYMENT.md).

The first account is a Senior Admin. Senior Admins can create Publisher accounts from the admin publishing desk using a unique email and an initial password of at least 14 characters. Share that password with the publisher through a secure channel. Publishers can manage website publishing and operations, but cannot manage accounts. Senior Admins can deactivate and reactivate Publisher access; deactivation immediately blocks API access. Existing admin accounts are migrated as Senior Admins.

The admin area manages artist/channel profiles, photos, songs, performances, and culture stories. YouTube links show an in-form thumbnail and playable preview; published features appear on Artists & Culture, while homepage promotion is controlled separately. YouTube video URLs use YouTube's privacy-enhanced player and YouTube-provided thumbnails by default. Only upload images or paste links that you have permission to publish.

The studio admin also manages USD service rates, news and insights, and upcoming events. Leave a price blank to show “Request a quote.” Admins can upload JPEG, PNG, and WebP images up to 5 MB. Local uploads use `public/uploads`; production uploads go directly to Vercel Blob and require `BLOB_READ_WRITE_TOKEN`. Set `NEXT_PUBLIC_BOOKING_EMAIL` and `NEXT_PUBLIC_WHATSAPP_NUMBER` in the deployment environment to enable direct booking links. The call button uses `NEXT_PUBLIC_CALL_NUMBER` when set, otherwise it uses the WhatsApp number. The booking form also accepts an optional callback number, visible to admins in the booking inbox.

The admin publishing desk also manages team profiles and portfolio projects. Upload actual portraits for each person (sample team records do not include personal photos), add project cover images, save a record as a draft, and publish it when it is ready. Published team profiles appear on the About and Artists pages; published portfolio projects appear on Portfolio, and projects marked “Feature on homepage” also appear in Selected Stories. The Team & Portfolio database migration seeds the existing sample entries so they remain visible after applying migrations.

Signed-in Senior Admins and Publishers can review the latest booking enquiries and update their status in the admin publishing desk. Booking requests remain stored in MySQL; the inbox shows the newest 100 requests.

When a request is approved, the site sends a confirmation email through Resend if `RESEND_API_KEY` and a Resend-verified `BOOKING_FROM_EMAIL` are configured. If they are not configured or delivery fails, the booking remains approved, the inbox displays the email status, and admins can retry or open a prefilled email/WhatsApp message. Automatic WhatsApp delivery is not enabled; WhatsApp messages must be sent manually unless an approved WhatsApp Business provider and customer opt-in are configured.

The Visual Collections page features published photography and videography projects. On the Artists page, published songs are listed newest first; add producers and keyboardists, guitarists, and other session musicians in the admin Team & Portfolio manager, assign their section, and upload their portraits to display them in the appropriate directory.

The homepage festival emblem at `public/images/pojulu-cultural-festival.jpg` is the public profile image from the [Pojulu Cultural Festival Facebook page](https://www.facebook.com/profile.php?id=61585510990428&sk=photos), used with the page owner's permission and linked from the hero. The public page response exposed its logo rather than album photographs; upload additional permission-cleared photos from the admin panel. Hero photography is stored locally from the studio's existing Unsplash image sources so the slides do not depend on third-party image loading.

The starter archive links to [Pojulu PPP’s public channel](https://www.youtube.com/@pojuluppp), its video title credit for Lucia Hilary on [“NGAZI TI NGUNU”](https://www.youtube.com/watch?v=XOqkFRet3AQ), a [traditional dance performance](https://www.youtube.com/watch?v=rDseg1prBsA), a [Pojulu music collection](https://www.youtube.com/watch?v=-BCE9SGY5wA), its [Boy Lax collection](https://www.youtube.com/watch?v=bnNj962P99k), and a [Pojulu culture festival feature](https://www.youtube.com/watch?v=lQSjVgtWhMc) published by 64 Tribes Media Production. Credits follow public channel/video metadata; artist biographies and viral/popularity claims are not independently asserted.

The booking form and cultural CMS store data in MySQL. `npm run db:migrate` creates and applies development migrations; `npm run db:deploy` applies committed migrations in other environments. `npm run build` generates the Prisma client before building Next.js. The local MySQL credentials in `.env.example` and `docker-compose.yml` are for development only; configure private MySQL credentials in the deployment environment.
