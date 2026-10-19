<div align="center">
  <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/terminal.svg" width="60" alt="Logo" />
  <h1 align="center">Rumman's Portfolio V3 🚀</h1>
  
  <p align="center">
    A premium, highly interactive, and fully dynamic personal portfolio web application built with the MERN stack. Designed with a breathtaking "Liquid Glass" aesthetic, seamless GSAP animations, and a powerful custom admin dashboard.
    <br />
    <br />
    <a href="https://github.com/rumman2004/Portfolio-v3"><strong>Explore the Repository »</strong></a>
    <br />
  </p>
</div>

<br />

<div align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js" />
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/GSAP-88CE02?style=for-the-badge&logo=greensock&logoColor=white" alt="GSAP" />
</div>

<br />

---

## ✨ Features

- 🎨 **Liquid Glass Aesthetic**: A highly modern UI featuring frosted glassmorphism, dynamic glowing borders, and stunning soft shadows.
- 🌀 **3D Orbital Bento Layout**: A visually striking, interactive 3D skill orbit that reacts to scroll and hover, dynamically rendering tech stack icons in concentric rings.
- 🔔 **Dynamic Live Activity**: Smoothly animated macOS-style notification drop-downs for continuous skill updates using premium spring physics.
- 📊 **Enhanced GitHub Activity**: High-contrast, dynamic contribution graph with smooth GSAP color transitions and year-selection functionality.
- ⚡ **Seamless Animations**: Fully powered by GSAP and ScrollTrigger for buttery smooth parallax scrolling, text reveals, and micro-interactions.
- 📱 **Fully Responsive**: Flawless experience across desktops, tablets, and mobile devices with intelligent adaptable layouts (like mobile-specific Bento Grids).
- 🛠️ **Custom Admin Dashboard**: Secure, hidden admin portal built entirely from scratch to easily manage projects, skills, education, experience, and direct messages.
- 🗄️ **RESTful API**: A robust Node.js and Express backend delivering optimized data fetching to the React frontend.
- 🚀 **Performance Optimized**: Uses MongoDB connection caching, efficient API routes, and optimized image rendering constraints.

---

## 🛠️ Tech Stack

### Frontend (Client)
* **Framework:** React.js (Vite)
* **Styling:** Tailwind CSS V4
* **Animations:** GSAP (GreenSock) & ScrollTrigger
* **Icons:** Lucide React
* **Routing:** React Router DOM
* **State & Fetching:** Custom Hooks & Axios

### Backend (Server)
* **Environment:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB & Mongoose
* **Security:** JSON Web Tokens (JWT), bcrypt.js
* **File Uploads:** Cloudinary (for remote image hosting) & Multer

---

## 🚀 Getting Started

The project is pinned to Node.js `22.17.1` in `.nvmrc`. Use the repository-local
lockfiles and do not install dependencies globally.

### Installation

```sh
git clone https://github.com/rumman2004/Portfolio-v3.git
cd Portfolio-v3
npm ci
npm --prefix server ci
npm --prefix client ci
cp server/.env.example server/.env
cp client/.env.example client/.env
```

Fill in the required values in `server/.env`; never commit that file. The client
only needs:

```env
VITE_API_URL=http://localhost:5000/api
```

The server environment includes `MONGO_URL`, `JWT_SECRET`, the Cloudinary
credentials and upload preset, `ADMIN_EMAIL`, and `ADMIN_PASSWORD`. Use a strong
unique admin password.

### Run locally

Start these in separate terminals from the repository root:

```sh
npm --prefix server run dev
npm --prefix client run dev
```

The Vite development server serves the frontend; the API runs on port `5000`.

### Checks

The single reproducible offline check command, after dependencies are installed, is:

```sh
npm test
```

It runs the server image-conversion tests, client lint, and the client production
build. `make test` is provided as an equivalent Unix alias.

### Docker deployment

Create and fill `server/.env`, then build and run the complete single-origin image:

```sh
docker build -t portfolio-v3 .
docker run --rm --env-file server/.env -p 5000:5000 portfolio-v3
```

The web application is available at `http://localhost:5000` and the API at
`http://localhost:5000/api`.

---

## 📂 Project Structure

```text
📦 Portfolio V3
 ┣ 📂 client                 # React Frontend Application
 ┃ ┣ 📂 src
 ┃ ┃ ┣ 📂 components         # Reusable UI elements, Admin layouts, and Glassmorphism cards
 ┃ ┃ ┣ 📂 pages              # Public pages (Home, Works, About) & Admin pages
 ┃ ┃ ┣ 📂 services           # Axios API configuration and endpoint modules
 ┃ ┃ ┗ 📂 utils              # Helper functions like Icon mapping
 ┃ ┗ 📜 vite.config.js       # Vite bundler configuration
 ┃
 ┗ 📂 server                 # Node.js + Express Backend
   ┣ 📂 src
   ┃ ┣ 📂 config             # DB Connection (w/ Caching), Cloudinary, Env Variables
   ┃ ┣ 📂 middleware         # JWT Auth protection, Error handling, Multer uploads
   ┃ ┗ 📂 modules            # Modular API routes (Projects, Skills, Notifications, etc.)
   ┗ 📜 server.js            # Main server entrypoint
```

---

## 📞 Contact

**Rumman Ahmed** - [rumman2004](https://github.com/rumman2004)

Project Link: [https://github.com/rumman2004/Portfolio-v3](https://github.com/rumman2004/Portfolio-v3)

<br />

<div align="center">
  <i>Built with ❤️ using the MERN stack</i>
</div>
