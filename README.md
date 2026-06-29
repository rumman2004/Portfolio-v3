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

To get a local copy up and running, follow these simple steps.

### Prerequisites
Make sure you have Node.js and npm installed on your machine.
* npm
  ```sh
  npm install npm@latest -g
  ```

### Installation

1. **Clone the repo**
   ```sh
   git clone https://github.com/rumman2004/Portfolio-v3.git
   ```

2. **Setup the Backend**
   ```sh
   cd "Portfolio V3"/server
   npm install
   ```
   *Create a `.env` file in the `server` directory and add the following keys:*
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

3. **Setup the Frontend**
   ```sh
   cd ../client
   npm install
   ```
   *Create a `.env` file in the `client` directory and add the backend URL:*
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Run the Application Locally**
   *Start the Backend Server (from the `server` directory):*
   ```sh
   npm run dev
   ```
   *Start the Frontend App (from the `client` directory):*
   ```sh
   npm run dev
   ```

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
