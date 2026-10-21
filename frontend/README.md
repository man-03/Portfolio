# manoj.dossier frontend

Next.js portfolio and admin studio for the existing Spring Boot API in `backend/`. All frontend code lives in this folder.

## Requirements

- Node.js 20 or newer (this project was set up with Node.js 24)
- npm
- The Spring Boot API on `http://localhost:8080`
- The dev server on port **3000**. The backend CORS policy allows `http://localhost:3000` only.

No global tools were installed or upgraded.

## Setup

```bash
cd frontend
npm install
copy .env.example .env.local
```

Set `NEXT_PUBLIC_PORTFOLIO_USERNAME` in `.env.local` to the admin username (`adminUser`), not the login email. Restart the dev server after changing it.

```bash
npm run dev
```

Open `http://localhost:3000`. Admin sign-in is at `http://localhost:3000/login`. Password reset links from the API use `http://localhost:3000/reset-password?token=...`.

## Scripts

- `npm run dev` — development server on port 3000
- `npm run lint` — ESLint
- `npm run typecheck` — TypeScript
- `npm run build` — production build
- `npm run start` — production server on port 3000

## API notes

No API documentation Word file was present in the workspace. Requests follow the Spring controllers and DTOs.

- Public portfolio: `POST /api/public/{userName}`
- Public resume file: `GET /api/public/{userName}/resume`
- Public message: `POST /api/public/contact`
- Login: `POST /api/auth/login` with `{ email, password }`, response `{ token, userName }`
- Authenticated calls send `Authorization: Bearer <token>`
- The token is kept in `sessionStorage` for the browser tab. The API does not use auth cookies.

### Section visibility

The backend has no visibility flag. Sections with no content are omitted from the public page, including their headings. Profile, address, and contact must all exist or the public load fails.

### Other backend limits

- Address is created and updated only as part of the profile payload. There is no working standalone address write endpoint.
- Skills are saved as one aggregate. Existing ids are updated, missing ids are created, and omitted ids are deleted.
- Resume uploads accept a single PDF in the multipart field `file`.
- `AdminLinkService.updateLink` updates the entity in memory and does not call `save`, and the method is not transactional. Link edits may not persist until that backend method saves the entity.
- If a profile exists without an address row, `GET /api/admin/{userName}` fails with "Address Not Found" and this studio cannot attach the missing address.
