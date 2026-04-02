# Azure deployment (Mission #13)

Use the workflow your instructor demonstrates in class. This repo is set up for:

- **Frontend:** Vite React app in `bookstore-client` (build output: `dist`).
- **Backend:** ASP.NET Core API in `Bookstore.Api` (SQLite file `Bookstore.sqlite` at repo root).

## SPA deep links (`/adminbooks`)

`bookstore-client/public/routes.json` tells **Azure Static Web Apps** to serve `index.html` for all routes so React Router can handle `/adminbooks`.

## CORS

Add your deployed **frontend** origin to `Bookstore.Api/appsettings.json` under `Cors:AllowedOrigins`, or override via configuration in Azure (recommended for production).

Example:

```json
"Cors": {
  "AllowedOrigins": [
    "http://localhost:5173",
    "https://<your-static-web-app>.azurestaticapps.net"
  ]
}
```

## Frontend API URL

If the browser loads the API from a **different** host than the React app, create `bookstore-client/.env.production` (or Azure pipeline env vars) with:

```env
VITE_API_BASE_URL=https://<your-api-host>
```

Rebuild the client so `import.meta.env.VITE_API_BASE_URL` is baked into the bundle.

If you use a **single origin** that proxies `/api` to the API, you can leave `VITE_API_BASE_URL` unset and keep using relative `/api` paths.

## SQLite on Azure

The API uses `Bookstore.sqlite` with a relative path from the API project. On Azure App Service, ensure the database file is deployed or switched to a persistent storage option per course instructions.

## After deploy

1. Open `https://<your-site>/adminbooks` and confirm the admin page loads (not 404).
2. Create / edit / delete a book and verify changes on the shop page.
