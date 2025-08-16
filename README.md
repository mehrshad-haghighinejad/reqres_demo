# ReqRes Admin Panel (Test Project)

This is a small admin panel built with **React, TailwindCSS, and React Router** that interacts with the [ReqRes API](https://reqres.in/).  
It was created as a **test/demo project** to showcase authentication, user management, and basic CRUD-like interactions.

## Features

- 🔐 Simple authentication (login/logout)
- 👤 List users, create new ones, edit, and delete
- 📄 Pagination with sync to query params (`?page`)
- 🎨 TailwindCSS styling for a clean UI
- ⚡ Flash messages for create/delete feedback

## Tech Stack

- **React 18**
- **React Router v6**
- **TailwindCSS**
- **Axios** for API requests

## Running the Project

### 1. Clone the repo

```bash
git clone https://github.com/your-username/reqres-admin.git
cd reqres-admin
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the dev server

```bash
npm run dev
```

The app will be available at http://localhost:5173 (if using Vite).

## Authentication Note

For testing purposes, authentication state is stored in localStorage.
This is not secure for real applications — in a production scenario, you would use:

- JWT tokens (stored in httpOnly cookies for security)
- Session management on the server
- Proper API authentication and refresh token handling

## API

This project uses the free public API: ReqRes.
It provides a limited mock backend for users, login, and CRUD-like endpoints.
