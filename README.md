# Property Manager - Frontend (React + Vite) for Vercel

## Deploy
1. Vercel dashboard > Add New > Project > import this folder from GitHub (or run `npx vercel --prod` inside this folder).
2. Framework Preset: Vite (build: `npm run build`, output: `dist`).
3. Environment Variable: VITE_API_URL = https://YOUR-BACKEND.vercel.app/api
4. Deploy. If you change VITE_API_URL later, redeploy so it is rebuilt in.
5. Put this frontend URL into the backend's CLIENT_URL and redeploy the backend.

## Local
    npm install
    npm run dev      (uses the proxy to http://localhost:5000)
