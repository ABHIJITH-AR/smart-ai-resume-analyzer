# Smart AI Resume Analyzer 📄✨

An elegant, high-performance web application designed to analyze, score, and optimize resumes using advanced AI analysis modules.

---

## 🛠️ Tech Stack

This application is built on a modern, robust full-stack software architecture:

-   **Frontend Environment**: React 18 with Vite (Single Page Application configuration)
-   **Styling Engine**: Tailwind CSS (for highly customizable utility layouts)
-   **Animations & Micro-interactions**: motion/react (for fluid page and component transitions)
-   **Data Visualization**: Recharts (for rendering dynamic AI score breakdowns and analytics)
-   **Iconography**: Lucide React
-   **Backend Server**: Node.js with Express (to handle local file storage, authentication logic, and secure endpoints)
-   **Development Build Tooling**: TypeScript Compiler (`tsc --noEmit`), Esbuild (to bundle the compliant server application)

---

## 🚀 Recent Workspace Polishing & Updates

The user interface components have been polished according to your custom preferences:
-   **My Profile** (changed from *My Core Profile*)
-   **Setting** (changed from *Account Settings*)
-   **Sign Out** (changed from *Sign Out Session*)
-   **Profile** (changed from *Profile Console*)
-   **Your Full Name** (changed from *Professional Full Name*)
-   **Your Email ID** (changed from *Account Email Index*)
-   **Update Profile** (changed from *Update Profile Metadata*)
-   **Change Password** (changed from *Change Secret Credentials*)
-   **Submit** (changed from *Save Password Credentials*)
-   **Sign In** (changed from *Sign In Instead*)
-   Simplified the left sidebar workspace layout by removing the redundant **Analysis Studio** section header.

---

## 📁 Folder Directory Structure

```bash
├── src/
│   ├── components/            # UI Views (Dashboard, Profile, Sidebar, etc.)
│   │   ├── LoginView.tsx      # Login panel
│   │   ├── RegisterView.tsx   # Account registration page
│   │   ├── Sidebar.tsx        # Left navigation deck
│   │   ├── ProfileView.tsx    # Details update view
│   │   └── ...
│   ├── App.tsx                # Main Router and Page Context Hub
│   ├── main.tsx               # Client entry-point initialization
│   └── index.css              # Tailwind CSS stylesheet imports
└── server.ts                  # Fully compliant Express development backend
```

---

## 🚀 Getting Started & Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```

### 3. Build & Production Run
```bash
# Build client and bundle backend
npm run build

# Start the Node.js production service
npm run start
```