# Deployment & Environment Guide 🚀

This guide outlines the comprehensive procedures for running **Portfolio V3** locally for development, configuring third-party cloud integrations (MongoDB Atlas & Cloudinary), and deploying to production cloud platforms.

---

## 🔑 Environment Variables Reference

Before launching the application, you must configure environment variables for both the server and client applications.

### 1. Server Configuration (`server/.env`)
Create a `.env` file inside the `server/` directory:
```env
# Server Port Configuration
PORT=5000
NODE_ENV=development

# MongoDB Atlas Database Connection String
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/portfolio_v3?retryWrites=true&w=majority

# JWT Authentication Secret (Use a strong 64-character random alphanumeric string)
JWT_SECRET=super_secret_jwt_key_change_me_in_production
JWT_EXPIRES_IN=7d

# Cloudinary CDN Credentials (for automated image hosting)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### 2. Client Configuration (`client/.env`)
Create a `.env` file inside the `client/` directory:
```env
# Backend API Base URL (Point to localhost in dev, or Render/Heroku URL in production)
VITE_API_URL=http://localhost:5000/api
```

---

## 🛠️ Step-by-Step Local Development Setup

### Prerequisites
- **Node.js**: v18.x or v20.x LTS installed.
- **Git**: Installed and configured.

### 1. Clone & Install Dependencies
```bash
# Clone the repository
git clone https://github.com/rumman2004/Portfolio-v3.git
cd "Portfolio V3"

# Install backend server dependencies
cd server
npm install

# Install frontend client dependencies
cd ../client
npm install
```

### 2. Launch Development Servers
Open two separate terminal windows or tabs:

**Terminal 1 (Backend Server):**
```bash
cd "Portfolio V3/server"
npm run dev
# Output: Server running on port 5000 | MongoDB Connected Successfully
```

**Terminal 2 (Frontend Client):**
```bash
cd "Portfolio V3/client"
npm run dev
# Output: VITE v5.x.x ready in 300 ms | Local: http://localhost:5173/
```

---

## ☁️ Third-Party Service Setup

### 1. MongoDB Atlas Setup
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Deploy a free **M0 Cluster**.
3. Under **Database Access**, create a database user with Read/Write permissions.
4. Under **Network Access**, add `0.0.0.0/0` (or your specific server IP) to the IP Whitelist.
5. Click **Connect -> Connect your application** and copy the connection string into `server/.env` as `MONGO_URI`.

### 2. Cloudinary CDN Setup
1. Create a free account at [Cloudinary](https://cloudinary.com/).
2. Navigate to your **Programmable Media Dashboard**.
3. Copy your **Cloud Name**, **API Key**, and **API Secret** into `server/.env`.

---

## 🌍 Production Deployment Guide

### 1. Backend Deployment (Render / Railway / Heroku)
1. Connect your GitHub repository to **Render** or **Railway**.
2. Create a new **Web Service** pointing to the `server/` root directory.
3. Set the Build Command to `npm install` and Start Command to `node src/server.js`.
4. Add all environment variables from `server/.env` into the platform's Environment Settings dashboard.
5. Deploy and copy the live production server URL (e.g., `https://portfolio-v3-api.onrender.com`).

### 2. Frontend Deployment (Vercel / Netlify)
1. Connect your GitHub repository to **Vercel** or **Netlify**.
2. Set the Framework Preset to **Vite / React**.
3. Set the Root Directory to `client/`.
4. In the Environment Variables settings, add:
   - `VITE_API_URL`: Your production server API endpoint (e.g., `https://portfolio-v3-api.onrender.com/api`).
5. Click **Deploy**. Your liquid glass portfolio is now live worldwide!
