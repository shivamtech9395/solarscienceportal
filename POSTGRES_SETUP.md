# 🐘 PostgreSQL Database Setup Guide - SolarSciencePortal

This guide explains how to connect a **PostgreSQL** database to **SolarSciencePortal** using Prisma ORM.

---

## 🌟 Step 1: Get a Free Cloud PostgreSQL Database (Takes 2 Minutes)

You don't even need to install PostgreSQL on your computer! You can get a free, high-speed cloud PostgreSQL database in 2 minutes:

### Option A: Neon.tech (Recommended - Free & Easiest)
1. Go to **[Neon.tech](https://neon.tech/)** and click **Sign Up** (Sign in with Google or GitHub).
2. Click **Create Project** -> Name it `solarscience`.
3. You will immediately see a **Connection Details** box.
4. Copy the connection string starting with:
   ```
   postgresql://neondb_owner:xyz...@ep-pool-123.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
   ```

### Option B: Supabase (Free & Popular)
1. Go to **[Supabase.com](https://supabase.com/)** and click **Start your project**.
2. Name it `solarscience` and set a database password.
3. In **Project Settings** ➡️ **Database**, copy the **URI** connection string.

### Option C: Local PostgreSQL (If installed on your PC)
If you already have PostgreSQL installed on Windows:
```
postgresql://postgres:YOUR_PASSWORD@localhost:5432/solarscience?schema=public
```

---

## 🔑 Step 2: Paste URL into `.env` File

Open the `.env` file in the root folder of your project:
[`C:\Users\dell\.gemini\antigravity\scratch\solarscienceportal\.env`](file:///C:/Users/dell/.gemini/antigravity/scratch/solarscienceportal/.env)

Paste your connection string:

```env
DATABASE_URL="postgresql://neondb_owner:your_password@ep-xyz.aws.neon.tech/neondb?sslmode=require"
```

---

## ⚡ Step 3: Push Tables to PostgreSQL (1 Command)

Open your terminal or PowerShell in the project directory and run:

```bash
cd C:\Users\dell\.gemini\antigravity\scratch\solarscienceportal

npx prisma db push
```

**What this does:**
Prisma will automatically connect to your PostgreSQL database and create all 8 tables:
- `Employee` (Staff designations, ratings, PINs)
- `Customer` (Client profiles, phone, addresses)
- `Project` (5kW, 10kW Rooftop solar installations)
- `ProjectStage` (The 8 installation milestones)
- `StageUpdate` (Photo proof, technician remarks)
- `Notification` (In-app task alerts)
- `AuditLog` (Historical work trail)
- `Review` (Customer 5-star ratings and feedback)

---

## 🌱 Step 4: Seed Initial Data into PostgreSQL

To populate your PostgreSQL database with sample solar staff, customer installations, and reviews:

```bash
npm run db:seed
```

You will see:
```
🌱 Seeding PostgreSQL Database with SolarSciencePortal records...
✅ Created 5 Employees
✅ Created 2 Customers
🎉 PostgreSQL Database successfully seeded!
```

---

## 🖥️ Step 5: Prisma Studio (View & Edit Database Live)

Prisma includes a visual browser UI to view, edit, add, or delete database rows:

```bash
npx prisma studio
```
It will open: **`http://localhost:5555`**  
You can view all your PostgreSQL tables in a clean spreadsheet view!

---

## 🚀 Step 6: Start Your Application

```bash
npm run dev
# OR double click start.bat
```

Now your entire **SolarSciencePortal** is running on a live, production-grade **PostgreSQL** database!
