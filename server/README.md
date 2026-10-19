# Portfolio API

This directory contains the Express/Mongoose API for the portfolio. Image uploads for projects, certificates, and hackathons are held in memory, validated, converted to WebP with `sharp`, and then sent to Cloudinary.

Uploads accept JPEG, PNG, WebP, GIF, AVIF, TIFF, HEIF, and SVG files up to 10 MiB. Image dimensions are also bounded during decoding to protect the process from oversized image payloads.

## Requirements

- Node.js `22.17.1` (see `.nvmrc`)
- npm
- MongoDB
- Cloudinary credentials and an unsigned upload preset for image uploads

## Setup

```sh
cp .env.example .env
npm ci
```

Fill in the values in `.env`. The application requires `MONGO_URL`, `NODE_ENV`, `CLIENT_URL`, and `JWT_SECRET` to start. Cloudinary and SMTP values are needed for their respective features.

## Run

Development mode:

```sh
npm run dev
```

Production mode:

```sh
npm start
```

The default port is `5000`; set `PORT` to use another port.

## Test and checks

The offline test command is:

```sh
npm test
```

For a focused syntax check of the application entrypoints:

```sh
node --check app.js
node --check server.js
```

## Deploy

For the existing Vercel configuration, import the repository into Vercel and
configure the required environment variables in the project settings. Do not
commit credentials or install the Vercel CLI globally.

To build and run the reproducible container:

```sh
docker build -t portfolio-api .
docker run --rm --env-file .env -p 5000:5000 portfolio-api
```
