# Bookstore (IS 413 – Missions 11–13)

This project is an online bookstore app built with:

- `.NET 10` ASP.NET Core Web API
- `React + Vite + TypeScript`
- `SQLite` database (`Bookstore.sqlite`)
- `Bootstrap` for styling

**Git branch for Mission #13 Phase #6:** `phase-6`

## Features

**Shop (`/`):**

- Pagination (default 5 books per page) with clickable page numbers
- User-selectable page size
- Sorting by book title (A to Z / Z to A)
- Category filtering (pagination updates for the selected categories)
- Session-persistent shopping cart (Bootstrap **Offcanvas**) with cart summary

**Admin (`/adminbooks`):**

- Add, update, and delete books via the API (`POST`, `PUT`, `DELETE`)
- List books in a table with Edit / Delete actions

**Azure / SPA routing:**

- `bookstore-client/public/routes.json` configures fallback to `index.html` so deep links like `/adminbooks` work on **Azure Static Web Apps**.

## Project structure

- `Bookstore.Api` — Backend API and EF Core data access
- `bookstore-client` — Frontend React app
- `Bookstore.sqlite` — SQLite database used by the API
- `bootstrap.md` — Notes on bonus Bootstrap features (Mission #12)
- `AZURE_DEPLOY.md` — Deployment checklist and configuration notes (Mission #13)

## Prerequisites

- .NET SDK 10+
- Node.js 22+ and npm

## How to run locally

Run the API and client in separate terminals.

### 1) Start the API

```bash
cd Bookstore.Api
dotnet run
```

The API runs at `http://localhost:5000` (see `Properties/launchSettings.json`).

### 2) Start the React client

```bash
cd bookstore-client
npm install
npm run dev
```

The client runs at `http://localhost:5173`.

- Shop: [http://localhost:5173/](http://localhost:5173/)
- Admin: [http://localhost:5173/adminbooks](http://localhost:5173/adminbooks)

### Optional: API base URL (cross-origin)

For production, if the React site and API use different hosts, set `VITE_API_BASE_URL` before building the client. See `bookstore-client/.env.example`.

## Useful commands

### Backend

```bash
cd Bookstore.Api
dotnet build
```

### Frontend

```bash
cd bookstore-client
npm run lint
npm run build
npm run format
```

## Configuration notes

- **CORS:** Allowed origins are listed in `Bookstore.Api/appsettings.json` under `Cors:AllowedOrigins`. Add your **Azure static site URL** there when you deploy.
- **Local dev:** The Vite dev server proxies `/api` to `http://localhost:5000` (`bookstore-client/vite.config.ts`).
- **Deployed site URL:** After you deploy, paste your public URL in Learning Suite. (Placeholder: _add your Azure URL here once deployed_.)

## Notes

- Bonus Bootstrap feature documentation (Offcanvas + Tooltips) is in `bootstrap.md`.
