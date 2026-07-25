# Roadmap & Contributing 🗺️

This document outlines the strategic future development vision for **Portfolio V3**, current performance optimization benchmarks, and guidelines for open-source contributors and collaborators.

---

## 🧭 Project Roadmap & Future Enhancements

We are continually iterating on **Portfolio V3** to push the boundaries of modern web design and full-stack performance. Here is our prioritized feature pipeline:

### Phase 1: Core Experience (Completed ✅)
- [x] Implement Liquid Glassmorphism styling tokens in Tailwind CSS V4.
- [x] Build decoupled MERN stack architecture with modular Express backend.
- [x] Integrate GSAP & ScrollTrigger parallax animations and Bento Grid layouts.
- [x] Construct secure Admin Dashboard with JWT auth for real-time CRUD management.
- [x] Setup Cloudinary automated CDN pipeline for project and certificate media.

### Phase 2: Performance & Interactivity (In Progress 🚧)
- [ ] **AI-Powered Assistant Integration**: Embed an interactive chatbot trained on Rumman's resume, project repositories, and technical skills to answer recruiter queries in real-time.
- [ ] **Dynamic Theme Engine**: Expand beyond dark frosted glass to support custom theme palettes (e.g., Cyberpunk Neon, Minimalist Monochrome, Solarized Amber).
- [ ] **Advanced Analytics Dashboard**: Integrate Web Vitals tracking and custom visitor telemetry into the `/admin` dashboard to monitor page engagement and geographic reach.
- [ ] **Automated CI/CD Workflows**: Add GitHub Actions for automated linting, Jest backend testing, and zero-downtime staging deployments.

### Phase 3: Expansion Modules (Planned 📅)
- [ ] **Technical Blog / Articles Module**: Add a markdown-powered blogging engine with code syntax highlighting for publishing technical tutorials and engineering case studies.
- [ ] **Interactive Code Sandbox**: Allow visitors to preview micro-components or algorithms directly inside project detail cards.

---

## ⚡ Performance Optimization Benchmarks

To maintain a **100 Lighthouse Performance Score**, all new components and modules must adhere to these optimization guidelines:

1. **Image Optimization**: Never serve raw multi-megabyte PNGs. Ensure all uploaded media is streamed through Cloudinary with `q_auto,f_auto` parameters to serve compressed WebP/AVIF formats.
2. **Code Splitting**: Use React `lazy()` and `Suspense` for heavy admin dashboard pages (`/admin/*`) so public visitors do not download admin bundle JS chunks.
3. **Database Caching**: Maintain Mongoose connection caching in serverless functions to eliminate database handshake latency on cold starts.

---

## 🤝 Contributing Guidelines

We welcome pull requests, bug reports, and design suggestions! If you wish to contribute to **Portfolio V3**:

1. **Fork the Repository**: Create a personal fork on GitHub.
2. **Create a Feature Branch**:
   ```bash
   git checkout -b feature/amazing-new-feature
   ```
3. **Commit Your Changes**: Use semantic commit messages:
   ```bash
   git commit -m "feat(ui): add glowing border micro-animation to Bento cards"
   ```
4. **Push to the Branch**:
   ```bash
   git push origin feature/amazing-new-feature
   ```
5. **Open a Pull Request**: Describe your changes, attach before/after screenshots, and reference any relevant issue tickets.

---
<div align="center">
  <i>Thank you for helping make Portfolio V3 better! ⭐ Star the repo if you found this project helpful.</i>
</div>
