# Virbicoin Pool Frontend

This is the frontend application for the Virbicoin mining pool.

## Environment Variables

Copy `env.example` to `.env.local` and configure the following environment variables:

```bash
# API Endpoints
NEXT_PUBLIC_API_BASE_URL=https://api.digitalregion.jp
NEXT_PUBLIC_POOL_BASE_URL=https://pool.digitalregion.jp

# Pool Health Check URLs
NEXT_PUBLIC_POOL1_URL=https://pool1.digitalregion.jp
NEXT_PUBLIC_POOL2_URL=https://pool2.digitalregion.jp
NEXT_PUBLIC_POOL3_URL=https://pool3.digitalregion.jp
NEXT_PUBLIC_POOL4_URL=https://pool4.digitalregion.jp
NEXT_PUBLIC_POOL5_URL=https://pool5.digitalregion.jp
```

### Environment Variables Description

- `NEXT_PUBLIC_API_BASE_URL`: Base URL for the API server
- `NEXT_PUBLIC_POOL_BASE_URL`: Base URL for the pool server
- `NEXT_PUBLIC_POOL1_URL` to `NEXT_PUBLIC_POOL5_URL`: URLs for individual pool health checks

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm start
```
