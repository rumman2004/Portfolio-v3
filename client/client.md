# Client Architecture & Folder Structure

This document outlines the frontend (`client`) architecture for the Portfolio v3 application. The project is built using Vite, React, Tailwind CSS, and GSAP.

The directory structure is strictly feature-based and separates public-facing UI components from internal admin panel components.

## Directory Tree

```text
client/
├── public/                 # Static assets (favicons, manifest, direct image links)
├── src/
│   ├── assets/             # Global assets like local fonts, global styles, or SVG icons
│   │
│   ├── components/         # All React components
│   │   ├── animations/     # Animation components (Bento UI style, GSAP/Framer Motion)
│   │   ├── common/         # Shared wrappers and blocks (PageHeader, ProtectedRoute, Section)
│   │   ├── features/       # Domain-specific components for the Admin Panel (See details below)
│   │   ├── layouts/        # High-level layouts that wrap pages (PublicLayout, AdminLayout)
│   │   ├── sections/       # Large, full-page public UI blocks (HeroSection, ProjectSection)
│   │   └── UI/             # Reusable UI atoms (Button, Card, Input, Badge, Textarea)
│   │
│   ├── hooks/              # Custom React hooks (e.g., useAuth.js, useFetch.js)
│   │
│   ├── pages/              # Route-level page components
│   │   ├── admin/          # Admin panel pages (HomeDashboard, Login, Skills, ProjectsWorks, etc.)
│   │   └── public/         # Public site pages (Home, About, Contact, Works)
│   │
│   ├── routes/             # Router configurations (AdminRoutes.jsx, PublicRoutes.jsx)
│   │
│   ├── services/           # API integration functions (experienceServices.js, etc.)
│   │
│   ├── App.jsx             # Main application entry point that initializes the Router
│   ├── index.css           # Global CSS, Tailwind directives, and font imports
│   └── main.jsx            # React DOM rendering point
│
├── .env                    # Environment variables (e.g., VITE_API_URL)
├── package.json            # Dependencies and npm scripts
├── tailwind.config.js      # Tailwind theme configuration (colors, fonts, extensions)
└── vite.config.js          # Vite configuration and plugins
```

## Detailed Breakdown: `features/` Folder

The `features/` directory is organized by domain models. Each domain folder contains the specific CRUD (Create, Read, Update, Delete) components needed for the Admin Dashboard to manage that specific data.

Most folders follow a standardized pattern:
- **`[Domain]Card.jsx`**: A small, reusable UI component used to display a single item in a list (e.g., a small row or box showing a project's name with edit/delete buttons).
- **`[Domain]List.jsx`**: A component that fetches and renders a grid or list of `[Domain]Card` components.
- **`[Domain]Form.jsx`**: The core form containing all inputs needed to create or edit the item.
- **`Edit[Domain].jsx`**: A wrapper component that fetches an existing item by ID and passes its data into `[Domain]Form` for editing.

### Directory Contents:

- **`admin/`**
  - `Dashboard.jsx`: Admin dashboard overview component.
  - `DataTable.jsx`: A reusable, generic table component for displaying list data.
  - `LoginForm.jsx`: Admin authentication form.
  - `ProfileEditor.jsx`: Component to edit the admin's profile information.

- **`certificates/`**
  - `CertificateCard.jsx`, `CertificatesList.jsx`
  - `CertificateForm.jsx`, `EditCertificate.jsx`

- **`contact/`**
  - `ContactForm.jsx`: Component to submit a contact request.
  - `MessageDetail.jsx`: Admin view to read a full message.
  - `MessagesInbox.jsx`: Admin view to list all received contact messages.

- **`education/`**
  - `EducationCard.jsx`, `EducationList.jsx`
  - `EducationForm.jsx`, `EditEduacation.jsx`

- **`experience/`**
  - `ExperienceForm.jsx`, `ExperienceList.jsx`

- **`hackathon/`**
  - `HackathonCard.jsx`, `HackathonsList.jsx`
  - `HackathonForm.jsx`, `EditHackathon.jsx`

- **`projects/`**
  - `ProjectCard.jsx`, `ProjectList.jsx`, `ProjectsList.jsx`
  - `ProjectForm.jsx`, `EditProject.jsx`
  - `ProjectCaseStudy.jsx`: Specialized component to manage long-form case study data.
  - `ProjectImageCard.jsx`: Specialized component to manage project image uploads.

- **`skills/`**
  - `SkillCard.jsx`, `SkillsList.jsx`
  - `SkillForm.jsx`, `EditSkill.jsx`
  - `SkillImagesSelection.jsx`: Specialized component for managing skill SVG icons.

- **`socialmedia/`**
  - `SocialMediaCard.jsx`, `SocialLinksList.jsx`
  - `SocialLinkForm.jsx`: Admin form to manage social links (GitHub, LinkedIn, etc.).


## Architectural Rules

1. **Sections vs. Features:**
   - **`components/sections/`**: Used *only* for the large, animated sections that make up the public landing pages (e.g., `HeroSection`, `ContactSection`).
   - **`components/features/`**: Used *only* for specific domain logic and smaller components, primarily the Forms and Cards used in the Admin Dashboard to manage data.

2. **Pages vs. Components:**
   - Files in `pages/` should contain very little logic and styling. They should simply import `layouts/` and assemble the required `sections/` or `features/`.

3. **UI Directory:**
   - The `UI/` folder is for "dumb" atomic components. A `Button` or an `Input` shouldn't know anything about "Projects" or "Education". They just receive props and render styles.

4. **Services:**
   - All Axios/Fetch calls to the backend API should be written in the `services/` directory, rather than being hardcoded directly into the React components. Components should import these service functions.
