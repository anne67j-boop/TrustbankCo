# TrustbankCo Private Wealth

A high-performance, secure, and aesthetically polished banking dashboard designed for high-net-worth individuals. This application demonstrates a modern React architecture with a focus on security [...]

## 🚀 Features

### 🏦 Private Wealth Dashboard
- **Aggregated Portfolio View**: Real-time visualization of assets across Checking, Savings, and Credit lines.
- **Cash Flow Analysis**: Interactive charts tracking income vs. expenses using `recharts`.
- **Responsive Design**: Fully adaptive layout for Desktop (Sidebar) and Mobile (Hamburger Menu).

### 💳 Transaction Management
- **Smart Filtering**: Filter by Income/Expense.
- **Search Capability**: Instant search across merchants, categories, and descriptions.
- **Export Ready**: UI simulation for CSV/PDF exports.

### 🤖 AI Financial Advisor (Gemini)
- **TrustBot Integration**: Powered by Google's Gemini 2.5 Flash model.
- **Context-Aware**: The AI is primed with the user's specific transaction history to answer questions like *"How much did I spend on travel?"*.
- **Secure Interface**: Chat interface styled to match the corporate security theme.

### 🔐 Security & Architecture
- **Authentication**: Simulated JWT-based login flow.
- **2FA Integration**: Google Authenticator (TOTP) support with inline QR code generation.
- **Session Management**: Auto-timeout and secure routing (simulated).
- **Tech Stack**: React 18, TypeScript, Tailwind CSS, Lucide Icons, Recharts.

## 🛠️ Setup & Deployment Instructions

### Frontend Deployment
Run the following commands in the root directory (or `trustbankco` context):

```bash
cd trustbankco
npm run build
npm run start
```
*Note: The start command uses `vite preview` with `$PORT` binding for compatibility with cloud hosts.*

Live demo: [TrustBankCo — Production](https://trustbank-co.vercel.app/)

### Backend Deployment
Run the following commands in the `trustbankco-backend` directory (if separate) or `backend` folder:

```bash
cd trustbankco-backend
npm run build
npm run postbuild
npm run start
```

## 🎨 Design System

- **Primary Color**: Corporate Navy (`#0a192f`) - Represents stability and security.
- **Accent Color**: Wealth Gold (`#eab308`) - Represents value and premium status.
- **Typography**: `Inter` for UI elements, `Playfair Display` for headers and numerical assets.

## 📦 Project Structure

```
src/
 ├── components/       # UI Components (Dashboard, Layout, Transactions, Settings)
 ├── services/         # API Integrations (Gemini AI)
 ├── types.ts          # TypeScript Definitions
 ├── constants.ts      # Mock Data & Configuration
 ├── App.tsx           # Main Router & State
 └── index.tsx         # Entry Point
 backend/
 ├── prisma/           # Database Schema (schema.prisma)
 └── package.json      # Backend Dependencies
```

---
*© 2024 TrustbankCo. All rights reserved.*
