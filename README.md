# TrustBank Private Wealth - Frontend

A high-performance, secure, and aesthetically polished banking dashboard designed for high-net-worth individuals. This application demonstrates a modern React architecture with a focus on security simulation, responsive design, and AI integration.

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
- **Session Management**: Auto-timeout and secure routing (simulated).
- **Tech Stack**: React 19, TypeScript, Tailwind CSS, Lucide Icons, Recharts.

## 🛠️ Setup & Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/trustbank-frontend.git
   cd trustbank-frontend
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment**
   Create a `.env` file in the root:
   ```env
   # API Key is injected by the runtime in this demo, 
   # but for local dev:
   VITE_GEMINI_API_KEY=your_api_key_here
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```

## 🎨 Design System

- **Primary Color**: Corporate Navy (`#0a192f`) - Represents stability and security.
- **Accent Color**: Wealth Gold (`#eab308`) - Represents value and premium status.
- **Typography**: `Inter` for UI elements, `Playfair Display` for headers and numerical assets.

## 📦 Project Structure

```
src/
 ├── components/       # UI Components (Dashboard, Layout, Transactions)
 ├── services/         # API Integrations (Gemini AI)
 ├── types.ts          # TypeScript Definitions
 ├── constants.ts      # Mock Data & Configuration
 ├── App.tsx           # Main Router & State
 └── index.tsx         # Entry Point
```

---
*© 2024 TrustBank Private Wealth. All rights reserved.*