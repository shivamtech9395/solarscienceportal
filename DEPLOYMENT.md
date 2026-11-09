# 🚀 SolarSciencePortal - Production Deployment Guide

A step-by-step guide to deploying **SolarSciencePortal** live on the internet so your customers, field technicians, and admin team can access it from anywhere on mobile and desktop.

---

## 📋 Pre-Deployment: Push to GitHub

Before deploying to any cloud provider, push your project to a GitHub repository:

```bash
cd C:\Users\dell\.gemini\antigravity\scratch\solarscienceportal

# Initialize git repository (if not already done)
git init

# Add all files (respecting .gitignore)
git add .

# Commit changes
git commit -m "Initial commit of SolarSciencePortal 2.0"

# Connect to your GitHub repository
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/solarscienceportal.git
git push -u origin main
```

---

## 🌟 Option 1: Render.com (Recommended for Free & Persistent Storage)

Render allows running the full Node.js server with permanent file persistence for your `data/db.json`.

1. Go to **[Render.com](https://render.com/)** and sign in with GitHub.
2. Click **New +** -> Select **Web Service**.
3. Choose your `solarscienceportal` GitHub repository.
4. Fill in the service settings:
   - **Name**: `solarscienceportal`
   - **Region**: Singapore or Frankfurt (close to India)
   - **Branch**: `main`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Instance Type**: Free
5. Click **Create Web Service**!
6. Render will build and deploy your project in 2-3 minutes. You will get a live URL like:  
   👉 `https://solarscienceportal.onrender.com`

---

## ⚡ Option 2: Vercel (Fastest & Global Edge CDN)

Vercel is the creator of Next.js and provides instant serverless deployments.

1. Go to **[Vercel.com](https://vercel.com/)** and log in with GitHub.
2. Click **Add New...** -> **Project**.
3. Import the `solarscienceportal` repository.
4. Vercel automatically detects **Next.js** framework preset.
5. Click **Deploy**.
6. Within 60 seconds, your site is live globally on a free domain like:  
   👉 `https://solarscienceportal.vercel.app`

*(Note: For permanent client data storage on Vercel serverless, you can connect a free Postgres database like Vercel Postgres, Supabase, or Neon via Prisma).*

---

## 🚂 Option 3: Railway.app

1. Go to **[Railway.app](https://railway.app/)** and connect GitHub.
2. Click **New Project** -> **Deploy from GitHub repo**.
3. Select `solarscienceportal`.
4. Railway will automatically detect Next.js and launch the container.
5. In Settings, click **Generate Domain** to get your public live link!

---

## 🖥️ Option 4: Self-Hosted VPS (Ubuntu / Hostinger / AWS EC2)

If you have your own Linux VPS with a custom domain (e.g. `www.yourcompany.com`):

```bash
# 1. Update and install Node.js 20+ and PM2
sudo apt update && sudo apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs git
sudo npm install -g pm2

# 2. Clone your repository
git clone https://github.com/YOUR_USERNAME/solarscienceportal.git
cd solarscienceportal

# 3. Install & Build
npm install
npm run build

# 4. Start production process with PM2
pm2 start npm --name "solarscience" -- start

# 5. Enable auto-restart on server reboot
pm2 startup
pm2 save
```

Setup Nginx reverse proxy to forward port 80/443 to `http://localhost:3000` with SSL via Certbot.

---

## 🧪 Production Verification Checklist

Once live:
- [ ] Open your live URL on mobile and test the Hindi/English welcome voice.
- [ ] Test Customer Tracker by searching phone number `9810012345`.
- [ ] Submit a test 5-star customer review.
- [ ] Log in as Staff (`9875566778` / `1234`) and verify your profile and completed work history.
- [ ] Log in as Admin (`admin123`), create a new solar contract, and test WhatsApp dispatch alert.
