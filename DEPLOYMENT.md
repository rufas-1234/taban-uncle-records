# Deploying to Vercel with TiDB Cloud

The app uses Prisma with MySQL and is configured for TiDB Cloud's MySQL-compatible endpoint. Vercel serves the Next.js app; TiDB Cloud stores bookings, admin accounts, and CMS content. Uploaded admin images are stored in Vercel Blob so they persist across deployments.

## 1. Create the TiDB Cloud database

Create a TiDB Cloud Serverless cluster and a database for the app. Copy the cluster endpoint, database name, user, and password from TiDB Cloud's connection details. TiDB Cloud uses port `4000` and requires TLS.

## 2. Configure Vercel environment variables

Import the project into Vercel and add these server-side environment variables for Production and Preview:

```text
MYSQL_HOST=<TiDB Cloud endpoint>
MYSQL_PORT=4000
MYSQL_DATABASE=<database name>
MYSQL_USER=<TiDB Cloud username>
MYSQL_PASSWORD=<TiDB Cloud password>
ADMIN_SESSION_SECRET=<random secret, at least 32 characters>
ADMIN_SETUP_TOKEN=<different random token, at least 32 characters>
```

Also configure the site's public booking variables and, if booking confirmation email is wanted, `RESEND_API_KEY` and `BOOKING_FROM_EMAIL`. Add a Vercel Blob store to the project; its `BLOB_READ_WRITE_TOKEN` is required for admin image uploads in production.

Generate the admin secret values locally with:

```powershell
node -e "console.log(require('node:crypto').randomBytes(32).toString('base64url'))"
```

Run this twice and use the two different values. Never commit or share the database password, setup token, or session secret.

## 3. Apply the MySQL schema

From the project directory, set the same TiDB Cloud values in your local PowerShell session, then run:

```powershell
$env:MYSQL_HOST = "<TiDB Cloud endpoint>"
$env:MYSQL_PORT = "4000"
$env:MYSQL_DATABASE = "<database name>"
$env:MYSQL_USER = "<TiDB Cloud username>"
$env:MYSQL_PASSWORD = "<TiDB Cloud password>"
$env:NODE_ENV = "production"
npm run db:deploy
```

The migration creates the MySQL schema and the existing starter pricing, team, and portfolio records. It does not create an administrator; create the first one at `/admin/setup` after deployment using `ADMIN_SETUP_TOKEN`.

## 4. Deploy the site

Connect the repository to Vercel and deploy with the default Next.js settings. The existing build script generates Prisma Client and builds Next.js. Vercel automatically configures `NODE_ENV=production`; the MySQL adapter verifies TLS certificates for the TiDB Cloud connection.

After the first deployment, visit `/admin/setup` to create the Senior Admin account. Setup is then locked; sign in at `/admin/login`.

## Local development

Copy `.env.example` to `.env.local`, generate local admin secrets, and start MySQL with `docker compose up -d mysql`. Apply migrations with `npm run db:deploy`, then start the app with `npm run dev`. The example database credentials are for local development only.

## Existing PostgreSQL data

Changing the database provider does not copy data out of the previous PostgreSQL/Prisma Dev database. Its data remains untouched. Export and migrate any existing admin accounts, bookings, or CMS edits separately before switching production traffic to TiDB Cloud.

## Image storage

Production image uploads use Vercel Blob. Local uploads continue to use `public/uploads`, which is suitable for development but is not persistent storage on Vercel. Existing local upload files must be uploaded to Blob or another persistent image host before their database records are used in production.
