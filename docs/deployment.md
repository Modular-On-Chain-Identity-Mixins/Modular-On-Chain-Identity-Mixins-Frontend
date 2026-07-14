# Deployment

## GitHub Pages (Recommended)

The project includes a CI/CD pipeline that auto-deploys to GitHub Pages.

### Setup

1. Go to repo Settings → Pages
2. Source: **GitHub Actions**
3. Push to `main` → deploy workflow runs automatically

### Manual Build

```bash
npm install
cp .env.example .env   # fill in contract IDs
npm run build           # outputs to dist/
```

Serve `dist/` with any static server:

```bash
npx serve dist -l 3000
```

## Docker

```bash
docker build -t compliance-kit .
docker run -p 8080:80 compliance-kit
```

The Docker image uses nginx:alpine with:
- SPA routing (all paths → index.html)
- Security headers (X-Frame-Options, X-Content-Type-Options, Referrer-Policy)
- Gzip compression
- Cache-control for assets

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `VITE_IDENTITY_REGISTRY_ID` | Yes | Soroban contract ID |
| `VITE_TOKEN_CONTRACT_ID` | Yes | Soroban contract ID |
| `VITE_NETWORK` | No | TESTNET or MAINNET |

## Custom Domain

1. Add CNAME record pointing to `<org>.github.io`
2. Create `public/CNAME` file with your domain
3. Update `public/sitemap.xml` URLs
