# Deployment Instructions

## Backend Deployment (Render.com)

1. Create a GitHub repository and push your code
2. Sign up at [Render.com](https://render.com)
3. Create a new Web Service
4. Connect your GitHub repository
5. Configure the following settings:
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Environment Variables: None needed for now

## Frontend Deployment (Vercel)

1. Sign up at [Vercel](https://vercel.com)
2. Import your GitHub repository
3. Configure build settings:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Add Environment Variables:
   - Name: `VITE_API_URL`
   - Value: Your Render.com backend URL (e.g., https://your-backend.onrender.com)

## Local Development

1. Backend:
   ```bash
   cd backend
   npm install
   npm start
   ```

2. Frontend:
   ```bash
   npm install
   npm run dev
   ```

## Important Notes

1. After deploying the backend to Render.com, get the deployment URL
2. Update the frontend's environment variable `VITE_API_URL` in Vercel with the backend URL
3. The free tier of Render.com may have cold starts - the first request might take a few seconds
4. Make sure to update CORS settings in the backend if needed 