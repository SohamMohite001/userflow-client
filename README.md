# UserFlow — Frontend (Client)

The frontend application for **UserFlow**, built with React 18, Vite, Tailwind CSS, and Lucide React. Designed for seamless deployment on **Netlify** and integration with the UserFlow backend API on Railway.

---

## Features

- **Authentication**: JWT-based session management using browser `sessionStorage`.
- **Dashboard**: Real-time user management interface with skeleton loaders, total registered count, and system security cards.
- **Add User Modal**: Accessible modal dialog with client-side validation, password visibility toggle, loading states, and duplicate email error display.
- **Responsive Design**: Professional UI built with Tailwind CSS, fully responsive across mobile, tablet, and desktop devices.
- **Native Fetch API**: Zero external HTTP dependencies like Axios.

---

## Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

---

## Local Development Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment variables**:
   Create a `.env` file in this directory based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

3. **Set your backend API URL**:
   In `.env`:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
   *(For development with your local backend).*

4. **Start the development server**:
   ```bash
   npm run dev
   ```
   Access the app at `http://localhost:5173`.

5. **Build for production**:
   ```bash
   npm run build
   ```

---

## Deployment on Netlify

### Step 1: Push to GitHub
Push this directory as its own GitHub repository (e.g., `userflow-client`).

### Step 2: Import into Netlify
1. Log in to [Netlify](https://app.netlify.com/).
2. Click **Add new site** > **Import an existing project**.
3. Select **GitHub** and choose your `userflow-client` repository.

### Step 3: Configure Build Settings
Netlify will auto-detect Vite, but ensure the following:
- **Build command**: `npm run build`
- **Publish directory**: `dist`

### Step 4: Configure Environment Variables
Under **Site configuration** > **Environment variables**, add:
- `VITE_API_URL`: The URL of your deployed Railway backend ending with `/api`
  *(e.g., `https://userflow-server.up.railway.app/api`)*

### Step 5: Deploy
Click **Deploy site**.

> **Important**: In Vite, environment variables prefixed with `VITE_` are bundled during build time. Whenever you change `VITE_API_URL` on Netlify, trigger a **Clear cache and deploy site** from Netlify's Deploys tab.

---

## Folder Structure

```text
client/
├── public/
│   └── _redirects        # Netlify SPA redirect rules
├── src/
│   ├── components/
│   │   ├── AddUserModal.jsx
│   │   ├── Navbar.jsx
│   │   └── UserTable.jsx
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   └── Login.jsx
│   ├── services/
│   │   └── api.js
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .env.example
├── .gitignore
├── index.html
├── package.json
└── vite.config.js
```
