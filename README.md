# ☀️ SolarSciencePortal - Solar EPC Project & Employee Tracking System

**SolarSciencePortal** is a fullstack enterprise management and milestone tracking system designed specifically for rooftop solar installation and EPC (Engineering, Procurement, and Construction) companies.

It bridges the gap between **Operations Management (Admin)**, **Field Technicians & Engineers**, and **Solar Customers** with real-time updates, automated task assignment alerts, and a complete historical audit trail.

---

## 🚀 Key Modules & Capabilities

### 1. 🛡️ Admin Operations Command Center (`/admin`)
- **Rooftop Contract Registration**: Onboard new solar projects with system capacity (kW), panel specifications, inverter models, site address, and client details.
- **Milestone Dispatcher**: Assign technicians to specific installation stages.
- **⚡ Instant Notification Alert**: Automatically creates an in-app task notification in the technician's mobile portal.
- **📲 Direct WhatsApp Dispatch**: Generates a 1-click WhatsApp message pre-filled with customer address, capacity, and milestone task details to alert the employee instantly.
- **Active Site Monitoring**: Live progress bar (0% - 100%) tracking stages from Survey to Net-Metering.

### 2. 👷 Field Technician Mobile App (`/employee`)
- **Quick Staff Access**: Field employees (Surveyor, Electrician, Structure Tech, Liaison Officer, etc.) log in via mobile number and PIN.
- **🔔 In-App Notification Center**: Instant alerts for newly assigned site jobs with address and contact.
- **Milestone Checklist**: Step-by-step Standard Operating Procedure (SOP) checklist on site.
- **Photo & Metric Proof Submission**: Upload site photos, record electrical readings (e.g. earthing resistance, inverter serial number), and mark stages complete.
- **Automatic Advancement**: Marking a stage complete advances the project to the next stage in real-time.

### 3. 🔍 Customer Live Installation Tracker (`/track`)
- **Client Transparency**: Homeowners and commercial clients enter their mobile number or project code (e.g. `9810012345` or `SP-2026-101`).
- **Domino's / Amazon Style 8-Step Tracker**: Visual status timeline showing completed, in-progress, and upcoming stages.
- **Assigned Technician Card**: View the exact name, technical role, and direct call button for the technician currently handling their site.
- **Rooftop Photo Gallery**: Real-time gallery of verified photos taken on their rooftop during installation.

### 4. 📜 Historical Work & Audit Trail (`/admin/history`)
*(Specially built for Operations Auditing)*
- **Complete Timeline Archive**: Search and filter past work by Project, Employee, Date, or Action type.
- **Technician Attribution**: See exactly which technician completed each task, what time they completed it, and what remarks they entered.
- **Photo Proof Archive**: Click-to-expand verified photos uploaded from the site.

---

## 🏗️ The 8 Real-World Solar Installation Milestones

| Stage # | Milestone Title | Key Staff Role | Key On-Site Deliverable |
| :---: | :--- | :--- | :--- |
| **1** | **Site Survey & Rooftop Feasibility** | Site Surveyor | Shadow analysis, roof measurement, sanctioned load verification. |
| **2** | **System Design & 3D Engineering** | Solar Design Engineer | 3D CAD layout, Single Line Diagram (SLD), customer sign-off. |
| **3** | **DISCOM / Net-Metering Application** | Liaisoning Officer | Grid feasibility submission, subsidy registration on PM Surya Ghar portal. |
| **4** | **Material Procurement & Delivery** | Warehouse Manager | Dispatch of panels, inverter, mounting rails, and DC cables. |
| **5** | **Mechanical Structure Assembly** | Structure Technician | Roof anchoring, HDG structure assembly, panel clamping at tilt angle. |
| **6** | **Electrical Cabling & Inverter Setup** | Solar Electrician | DC string conduits, ACDB/DCDB boxes, inverter mounting, 3 earthing pits. |
| **7** | **DISCOM Inspection & Net-Meter** | Liaisoning Officer | Electricity board inspector visit, bidirectional net meter installation. |
| **8** | **Commissioning, App Setup & Handover**| Commissioning Engineer | Grid sync, Wi-Fi data-logger app on customer phone, warranty handover. |

---

## 🛠️ Technology Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router, Server & Client Components)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with custom Solar Amber theme
- **Icons**: [Lucide React](https://lucide.dev/)
- **Database**: Zero-dependency persistent JSON engine (`data/db.json`) + [Prisma ORM](https://www.prisma.io/) schema ready for PostgreSQL/SQLite
- **Language**: TypeScript & Modern React

---

## ⚡ Quick Start Guide (Windows)

### Option 1: Double-Click Launcher
Simply double click `start.bat` in the project root!

### Option 2: Command Line
```powershell
# 1. Navigate to the project directory
cd C:\Users\dell\.gemini\antigravity\scratch\solarscienceportal

# 2. Run the development server
npm run dev
# OR: node ./node_modules/next/dist/bin/next dev -p 3000
```

Open your browser at **[http://localhost:3000](http://localhost:3000)**

---

## 🐘 PostgreSQL Database Setup (Prisma ORM)

For complete step-by-step instructions on connecting PostgreSQL (Neon, Supabase, or Local), see **[POSTGRES_SETUP.md](file:///C:/Users/dell/.gemini/antigravity/scratch/solarscienceportal/POSTGRES_SETUP.md)**.

```bash
# 1. Put your database connection URL in .env
DATABASE_URL="postgresql://user:password@host:5432/db?sslmode=require"

# 2. Push tables to PostgreSQL
npx prisma db push

# 3. Seed initial solar projects and staff records
npm run db:seed

# 4. Open visual database GUI
npx prisma studio
```

---

## 📱 Default Demo Credentials & Sample Accounts

### Admin & Staff Accounts
- **Admin Hub**: Navigate to `/admin`
- **Vikram Singh** (*Solar Electrician*): Phone `9875566778` • PIN `1234`
- **Amit Sharma** (*Site Surveyor*): Phone `9871122334` • PIN `1234`
- **Suresh Kumar** (*Structure Tech*): Phone `9874455667` • PIN `1234`
- **Neha Verma** (*Design Engineer*): Phone `9872233445` • PIN `1234`
- **Rajesh Meena** (*Liaisoning Officer*): Phone `9873344556` • PIN `1234`

### Sample Customer Live Tracking
- **Ramesh Chandra Sharma (5.0 kW Rooftop)**: Search Phone `9810012345` or Code `SP-2026-101`
- **Sunita Singhania (10.0 kW Rooftop)**: Search Phone `9820054321` or Code `SP-2026-102`

---

## 🌐 Production Deployment Guide

For full step-by-step instructions with Render, Vercel, Railway, or VPS, see **[DEPLOYMENT.md](file:///C:/Users/dell/.gemini/antigravity/scratch/solarscienceportal/DEPLOYMENT.md)**.

### Quick Deploy to Vercel:
1. Push this repository to GitHub.
2. Import project into [Vercel](https://vercel.com).
3. Framework preset will automatically detect **Next.js**.
4. Click **Deploy**!

### Quick Deploy to Render (Recommended for persistent database):
1. Connect GitHub to [Render.com](https://render.com).
2. Create **Web Service** with build command `npm install && npm run build` and start command `npm start`.
