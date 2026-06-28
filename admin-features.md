# Admin Features

This document describes the admin panel responsibilities for the portfolio backend and the key data required for each management screen.

## Admin Scope

The admin can manage:

- Profile / hero content
- Projects
- Skills
- Certificates
- Social media links
- Contact messages

The admin can also:

- Log in and log out
- View the current admin profile
- Bootstrap the first admin account from environment variables
- Control publish visibility for content
- Order content for the public site

## Admin Profile

### Purpose

Controls the site-wide identity shown on the homepage and contact sections.

### Key fields

- `name`
- `role`
- `headline`
- `shortBio`
- `about`
- `location`
- `email`
- `resumeUrl`
- `profileImage`
- `heroImage`
- `socialLinks`
- `stats`
- `isAvailable`

### What the admin can change

- Main display name
- Job title or role label
- Hero headline
- Short bio for intro sections
- Long about paragraph
- Location
- Public contact email
- Resume link
- Profile and hero images
- Footer / social profile links
- Statistic blocks such as projects, experience, or clients
- Availability status

### Important behavior

- This content should be editable from one admin screen.
- The homepage should fall back to default profile data if no record exists.
- URLs should be validated before saving.
- Social links should be stored as repeatable items.
- Stats should be editable as repeatable label/value pairs.

## Project Management

### Purpose

Controls the main portfolio case studies shown in the work section and on detail pages.

### Key fields

- `title`
- `slug`
- `category`
- `shortDescription`
- `description`
- `heroImage`
- `gallery`
- `techStack`
- `liveUrl`
- `githubUrl`
- `featured`
- `order`
- `problem`
- `solution`
- `results`
- `isPublished`

### What the admin can create

- A featured case study for the homepage
- A project detail page with a unique slug
- A gallery of screenshots or mockups
- Short summary text for cards or preview blocks
- Full case study content for the detail page

### Form sections

#### Basic info

- Title
- Category
- Short description
- Slug, if custom routing is needed

#### Visuals

- Hero image
- Gallery images

#### Technical details

- Tech stack tags
- Live URL
- GitHub URL

#### Case study content

- Problem statement
- Solution summary
- Results or outcome

#### Display controls

- Featured toggle
- Publish toggle
- Order number

### Important behavior

- Title should generate slug automatically if no slug is provided.
- Slug must stay unique.
- Featured projects should appear first in the homepage section.
- Order controls manual sorting in the public list.
- Images should be uploaded separately through the file upload flow when that is added.
- Public routes should only show published projects.

### Recommended admin validation

- Title required
- Short description required
- Description should support richer content than the short description
- Live URL and GitHub URL should be valid absolute URLs
- Tech stack should be a repeatable list of strings

## Skill Management

### Purpose

Controls the skills and technology labels displayed in the profile, skill strip, or expertise sections.

### Key fields

- `name`
- `category`
- `icon`
- `level`
- `order`
- `isFeatured`
- `isPublished`

### What the admin can create

- Skill items such as React, Node.js, MongoDB, Tailwind CSS, GSAP, etc.
- Category labels such as Frontend, Backend, Animation, Database, or Tools
- Skill level values for visual bars or badges
- Featured skills for homepage highlights

### Form sections

#### Skill basics

- Name
- Category
- Icon name or icon key if used

#### Skill metadata

- Level from 0 to 100
- Order
- Featured toggle
- Publish toggle

### Important behavior

- Skills should be sorted by order first, then name.
- Featured skills should be used for summaries or key sections.
- Level should stay in the 0-100 range.
- The admin should be able to hide a skill without deleting it.

## Certificate Management

### Purpose

Controls education, certifications, and achievement records.

### Key fields

- `title`
- `slug`
- `issuer`
- `issuedAt`
- `credentialId`
- `credentialUrl`
- `image`
- `skills`
- `order`
- `isFeatured`
- `isPublished`

### What the admin can create

- Course completion certificates
- Professional certifications
- Achievement records
- Credential verification links

### Form sections

#### Certificate basics

- Title
- Issuer
- Issue date

#### Verification details

- Credential ID
- Credential URL

#### Visuals and tags

- Certificate image
- Related skills/tags

#### Display controls

- Featured toggle
- Order number
- Publish toggle

### Important behavior

- Slug can be auto-generated from title and issuer.
- Public certificate listings should only show published items.
- Featured certificates should be prioritized where needed.
- Credential URL should be optional but valid if present.

## Social Media Management

### Purpose

Controls the external links shown in the portfolio header, footer, and contact areas.

### Key fields

- `platform`
- `label`
- `url`
- `icon`
- `order`
- `isPublished`

### What the admin can create

- GitHub link
- LinkedIn link
- Behance link
- X/Twitter link
- Instagram link
- Dribbble link
- Personal website links

### Form sections

#### Social link basics

- Platform name
- Optional display label
- URL

#### Display metadata

- Icon name or icon key
- Order
- Publish toggle

### Important behavior

- URL must be a valid absolute URL.
- Links should be sorted by order.
- Platform name is required.
- Hidden links should not appear on the public site.

## Experience Management

### Purpose

Controls the professional and volunteer experience timeline.

### Key fields

- `company`
- `position`
- `startDate`
- `endDate`
- `current`
- `description`
- `technologies`
- `order`
- `isPublished`

### What the admin can create

- Work history entries
- Volunteer experience entries

### Important behavior

- Experiences should be sorted by order, then by start date.
- Current experiences should not require an end date.

## Hackathon Management

### Purpose

Controls the hackathon participation and achievements records.

### Key fields

- `title`
- `slug`
- `organization`
- `date`
- `projectTitle`
- `description`
- `technologies`
- `achievement`
- `link`
- `image`
- `order`
- `isFeatured`
- `isPublished`

### What the admin can create

- Hackathon entries with specific achievements (e.g., 1st Place)
- Links to projects built during the hackathon

### Important behavior

- Slug should be auto-generated from title.
- Featured hackathons can be highlighted on the main page.

## Education Management

### Purpose

Controls the academic education and degrees history.

### Key fields

- `institution`
- `degree`
- `fieldOfStudy`
- `startDate`
- `endDate`
- `current`
- `grade`
- `activities`
- `description`
- `order`
- `isPublished`

### What the admin can create

- University degrees, high school, or bootcamp records

### Important behavior

- Educations should be sorted by order, then by start date.
- Current educations should not require an end date.

## Contact Messages

### Purpose

Lets the admin review and manage incoming visitor messages.

### Key fields

- `name`
- `email`
- `subject`
- `message`
- `status`
- `createdAt`

### Admin actions

- View all messages
- Mark messages as `new`
- Mark messages as `read`
- Mark messages as `replied`
- Archive messages
- Delete spam or duplicate messages

### Message workflow

1. Visitor submits the contact form.
2. Message is stored in MongoDB.
3. Optional email notification is sent through Nodemailer if email config exists.
4. Admin reviews the message in the dashboard.
5. Admin updates status or deletes the message.

### Important behavior

- New messages should default to `new`.
- Admin should be able to sort by newest first.
- Replies should be trackable through status updates.

## Login And Session

### Current admin auth flow

- Login with email and password
- JWT token is issued
- Token is stored in a secure cookie
- `Authorization: Bearer <token>` is also accepted
- `GET /api/admin/me` returns the current admin profile

### Admin session tasks

- Login
- Logout
- View current session profile

## Admin Panel Screens

Recommended screens for the frontend admin dashboard:

- Login
- Dashboard overview
- Profile editor
- Projects list
- Project create/edit form
- Skills list
- Skill create/edit form
- Certificates list
- Certificate create/edit form
- Social links list
- Social link create/edit form
- Experience list
- Experience create/edit form
- Hackathons list
- Hackathon create/edit form
- Education list
- Education create/edit form
- Messages inbox
- Message detail view

## Field Quality Rules

- Titles should be short and clear
- URLs must include protocol
- Description fields should be editable as plain text or rich text depending on the UI decision
- Repeatable fields should be handled with add/remove controls
- Publish toggles should be available on every content type
- Order fields should allow manual public sorting

## Still Needed Later

- File upload and Cloudinary integration for project/certificate/profile images
- Rich text editor support for long descriptions if desired
- Slug uniqueness checks in the admin UI
- Form validation and error messages on the frontend
- Dashboard analytics or counts if needed

