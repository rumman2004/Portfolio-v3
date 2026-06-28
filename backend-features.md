# Backend Features

This file tracks the backend foundation and the module-by-module work already implemented for the portfolio API.

## Foundation

- Environment loading and validation in `src/config/env.js`
- MongoDB connection helper in `src/config/db.js`
- Express application setup in `app.js`
- Central 404 and error handling in `src/middleware/errorMiddleware.js`
- Admin authentication middleware in `src/middleware/authMiddleware.js`
- Server bootstrap and graceful shutdown in `server.js`

## 1. Admin / Auth

### Files

- `src/modules/admin/admin.model.js`
- `src/modules/admin/admin.services.js`
- `src/modules/admin/admin.controller.js`
- `src/modules/admin/admin.routes.js`

### Tasks performed

- Created admin user schema
- Added password hashing with `bcryptjs`
- Added password comparison helper
- Added JWT token signing
- Added bootstrap admin creation from `.env`
- Added login endpoint
- Added logout endpoint
- Added authenticated `me` endpoint
- Added admin protection middleware support

### Responsibilities

- `model`: store admin credentials and login state
- `service`: login flow, token generation, profile sanitizing, bootstrap admin creation
- `controller`: HTTP request and response handling
- `routes`: expose `/api/admin/login`, `/api/admin/logout`, `/api/admin/me`

## 2. Public / Profile

### Files

- `src/modules/public/public.model.js`
- `src/modules/public/public.services.js`
- `src/modules/public/public.controller.js`
- `src/modules/public/public.routes.js`

### Tasks performed

- Created editable profile schema for hero/about/social/stats data
- Added default fallback profile data
- Added public profile read endpoint
- Added admin profile update endpoint

### Responsibilities

- `model`: store site-wide profile and hero content
- `service`: fetch fallback profile or persist updates
- `controller`: public read and admin update endpoints
- `routes`: expose `/api/public/profile`

## 3. Projects

### Files

- `src/modules/projects/project.model.js`
- `src/modules/projects/project.services.js`
- `src/modules/projects/project.controller.js`
- `src/modules/projects/project.routes.js`

### Tasks performed

- Created project schema with slug generation
- Added fields for category, description, screenshots, stack, links, and ordering
- Added public list endpoint
- Added featured projects endpoint
- Added project detail-by-slug endpoint
- Added admin list endpoint
- Added create, update, and delete endpoints

### Responsibilities

- `model`: store project case-study content
- `service`: query/filter projects and manage CRUD
- `controller`: request handling for public/admin project APIs
- `routes`: expose `/api/projects`

## 4. Skills

### Files

- `src/modules/skills/skills.model.js`
- `src/modules/skills/skills.services.js`
- `src/modules/skills/skills.controller.js`
- `src/modules/skills/skills.routes.js`

### Tasks performed

- Created skill schema with category, level, and ordering
- Added public skill list endpoint
- Added featured skill list endpoint
- Added admin list endpoint
- Added create, update, and delete endpoints

### Responsibilities

- `model`: store skill entries
- `service`: query/filter and mutate skills
- `controller`: HTTP layer for skills
- `routes`: expose `/api/skills`

## 5. Contact / Messages

### Files

- `src/modules/contact/contact.model.js`
- `src/modules/contact/contact.services.js`
- `src/modules/contact/contact.controller.js`
- `src/modules/contact/contact.routes.js`
- `src/services/emailServices.js`

### Tasks performed

- Created contact message schema
- Added public contact submission endpoint
- Added message persistence
- Added optional email notification through Nodemailer
- Added admin message list endpoint
- Added message status update endpoint
- Added message delete endpoint

### Responsibilities

- `model`: store incoming contact requests
- `service`: create message records and trigger email notification
- `controller`: public submit and admin message management
- `routes`: expose `/api/contact`

## 6. Certificates

### Files

- `src/modules/certificates/certificate.model.js`
- `src/modules/certificates/certificate.services.js`
- `src/modules/certificates/certificate.controller.js`
- `src/modules/certificates/certificate.routes.js`

### Tasks performed

- Created certificate schema with slug support
- Added public list endpoint
- Added certificate-by-slug endpoint
- Added admin list endpoint
- Added create, update, and delete endpoints

### Responsibilities

- `model`: store certificates and credential metadata
- `service`: query and mutate certificate records
- `controller`: HTTP layer for certificate APIs
- `routes`: expose `/api/certificates`

## 7. Social Media

### Files

- `src/modules/socialmedia/socialmedia.model.js`
- `src/modules/socialmedia/socialmedia.services.js`
- `src/modules/socialmedia/socialmedia.controller.js`
- `src/modules/socialmedia/socialmedia.routes.js`

### Tasks performed

- Created social link schema
- Added public social link list endpoint
- Added admin list endpoint
- Added create, update, and delete endpoints

### Responsibilities

- `model`: store platform links for the portfolio
- `service`: query and mutate social links
- `controller`: HTTP layer for social APIs
- `routes`: expose `/api/social-media`

## 8. Experience

### Files

- `src/modules/Experience/experience.model.js`
- `src/modules/Experience/experience.service.js`
- `src/modules/Experience/experience.controller.js`
- `src/modules/Experience/experience.routes.js`

### Tasks performed

- Created experience schema
- Added public list endpoint
- Added admin list endpoint
- Added create, update, and delete endpoints

### Responsibilities

- `model`: store professional and volunteer experience entries
- `service`: query/filter and mutate experience records
- `controller`: HTTP layer for experience APIs
- `routes`: expose `/api/experience`

## 9. Hackathon

### Files

- `src/modules/hackathon/hackathon.model.js`
- `src/modules/hackathon/hackathon.service.js`
- `src/modules/hackathon/hackathon.controller.js`
- `src/modules/hackathon/hackathon.routes.js`

### Tasks performed

- Created hackathon schema with slug support
- Added public list endpoint
- Added featured hackathon list endpoint
- Added hackathon-by-slug endpoint
- Added admin list endpoint
- Added create, update, and delete endpoints

### Responsibilities

- `model`: store hackathon participation records
- `service`: query/filter and mutate hackathon records
- `controller`: HTTP layer for hackathon APIs
- `routes`: expose `/api/hackathon`

## 10. Education

### Files

- `src/modules/education/education.model.js`
- `src/modules/education/education.service.js`
- `src/modules/education/education.controller.js`
- `src/modules/education/education.routes.js`

### Tasks performed

- Created education schema
- Added public list endpoint
- Added admin list endpoint
- Added create, update, and delete endpoints

### Responsibilities

- `model`: store education records and academic achievements
- `service`: query/filter and mutate education records
- `controller`: HTTP layer for education APIs
- `routes`: expose `/api/education`

## API Summary

### Public routes

- `GET /api/health`
- `GET /api/public/profile`
- `GET /api/projects`
- `GET /api/projects/featured`
- `GET /api/projects/:slug`
- `GET /api/skills`
- `GET /api/skills/featured`
- `POST /api/contact`
- `GET /api/certificates`
- `GET /api/certificates/:slug`
- `GET /api/social-media`
- `GET /api/experience`
- `GET /api/experience/:id`
- `GET /api/hackathon`
- `GET /api/hackathon/featured`
- `GET /api/hackathon/:slug`
- `GET /api/education`
- `GET /api/education/:id`

### Admin routes

- `POST /api/admin/login`
- `POST /api/admin/logout`
- `GET /api/admin/me`
- `PATCH /api/public/profile`
- `GET /api/projects/admin/all`
- `POST /api/projects`
- `PATCH /api/projects/:id`
- `DELETE /api/projects/:id`
- `GET /api/skills/admin/all`
- `POST /api/skills`
- `PATCH /api/skills/:id`
- `DELETE /api/skills/:id`
- `GET /api/contact/messages`
- `PATCH /api/contact/messages/:id`
- `DELETE /api/contact/messages/:id`
- `GET /api/certificates/admin/all`
- `POST /api/certificates`
- `PATCH /api/certificates/:id`
- `DELETE /api/certificates/:id`
- `GET /api/social-media/admin/all`
- `POST /api/social-media`
- `PATCH /api/social-media/:id`
- `DELETE /api/social-media/:id`
- `GET /api/experience/admin/all`
- `POST /api/experience`
- `PATCH /api/experience/:id`
- `DELETE /api/experience/:id`
- `GET /api/hackathon/admin/all`
- `POST /api/hackathon`
- `PATCH /api/hackathon/:id`
- `DELETE /api/hackathon/:id`
- `GET /api/education/admin/all`
- `POST /api/education`
- `PATCH /api/education/:id`
- `DELETE /api/education/:id`

## Remaining Backend Work

- File upload and Cloudinary integration for images
- Seed data for initial content
- Input validation layer for request payloads
- Admin refresh/token strategy if needed
- Better error mapping for duplicate key and validation failures
- MongoDB startup verification against Atlas
- Tests for routes, services, and middleware

