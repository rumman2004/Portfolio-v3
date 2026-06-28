# Portfolio Build Memory

## Goal

Build a dynamic portfolio website inspired by these references:

- `https://portfolio.thecodeman.cloud/`
- `https://www.behance.net/gallery/230841281/PORTFOLIO`

The site should not be a direct copy. Use the references for animation style, section flow, color mood, typography attitude, layout composition, and project representation.

## Tech Direction

- Frontend: React
- Backend: Node.js with Express
- Database: MongoDB Atlas
- Website type: Dynamic portfolio with editable content stored in the database
- Expected data: profile, hero text, skills, services, projects, project case studies, experience, testimonials, contact/social links, resume link, and site settings

## Visual Direction

The design should feel premium, bold, modern, animated, and editorial.

Core qualities:

- Large expressive typography
- Strong visual hierarchy
- Smooth scroll-based section reveals
- Animated hero area
- Rich project presentation instead of simple cards
- Warm, high-contrast palette
- Modern portfolio/case-study layout
- Clean spacing with creative asymmetry
- Professional but visually memorable

Avoid:

- Generic template look
- Plain Bootstrap-style cards
- Overuse of purple/blue gradients
- Too many floating decorative blobs
- Weak typography
- Static sections with no motion
- Copying the reference sites exactly

## Color System

Use a warm editorial palette inspired by the Behance reference direction.

Primary colors:

- Ink: `#17110d`
- Charcoal: `#211b18`
- Paper: `#f4eee2`
- Cream: `#fff8e8`
- Clay: `#c85f3f`
- Rust: `#9f3f27`
- Gold: `#d5a94b`
- Sage: `#76846b`

Supporting colors:

- Muted text: `rgba(23, 17, 13, 0.66)`
- Soft border: `rgba(23, 17, 13, 0.14)`
- Light glass: `rgba(255, 248, 232, 0.42)`
- Dark overlay: `rgba(33, 27, 24, 0.72)`

Usage:

- Background should use warm paper/cream tones.
- Main text should use ink/charcoal.
- Accent buttons and important labels should use clay/rust.
- Gold and sage should be used as secondary accent colors.
- Dark sections should use charcoal/ink backgrounds with cream text.
- Project visuals can use bold color blocks and gradients based on clay, rust, gold, sage, and charcoal.

## Typography

Use a strong pairing:

- Display font: elegant editorial serif such as `Playfair Display`, `Cormorant Garamond`, or similar
- Body/UI font: clean sans-serif such as `Inter`, `Satoshi`, `Plus Jakarta Sans`, or similar

Current preferred pairing:

- Headings: `Playfair Display`
- Body/UI: `Inter`

Typography behavior:

- Hero title should be very large and memorable.
- Use italic display words for emphasis.
- Section headings should feel editorial, not corporate.
- Body text should be readable, medium weight, and not too small.
- Labels/eyebrows should be uppercase, compact, and letter-spaced.
- Avoid negative letter spacing unless used carefully on very large sans-serif text.

Suggested sizes:

- Hero H1: `clamp(4rem, 10vw, 9rem)`
- Section H2: `clamp(3rem, 6vw, 6.5rem)`
- Project titles: `clamp(2rem, 4vw, 4.4rem)`
- Body: `1rem` to `1.2rem`
- Eyebrow labels: `0.75rem` to `0.85rem`

## Animation Details

Reference animation direction:

- Smooth entry animations
- Scroll-triggered reveal effects
- Floating hero elements
- Cursor or hover enhancements
- Marquee-style moving text
- Project cards with subtle parallax or hover movement
- Section transitions that feel fluid and polished

Recommended React animation stack:

- `framer-motion` for page/section animation
- `gsap` with `ScrollTrigger` for advanced scroll animation if needed
- CSS transitions for simple hover states

Animation patterns:

- Hero text reveals line-by-line or block-by-block on page load.
- Sections fade and move up on scroll.
- Project previews slightly scale or shift on hover.
- Floating tags or badges move slowly in the hero area.
- Marquee text loops horizontally for skills/services.
- Buttons lift slightly on hover.
- Use smooth scroll behavior.
- Use reduced-motion support for accessibility.

Timing:

- Reveal duration: `0.6s` to `0.9s`
- Ease: `cubic-bezier(0.2, 0.9, 0.2, 1)` or Framer `easeOut`
- Stagger: `0.06s` to `0.12s`
- Hover transitions: `160ms` to `240ms`
- Floating loops: `5s` to `8s`

Important:

- Animations should support the layout, not distract from content.
- Mobile animations should be lighter.
- Respect `prefers-reduced-motion`.

## Layout Details

Overall structure:

1. Sticky header
2. Hero section
3. Moving marquee/capabilities strip
4. About/introduction
5. Services or expertise
6. Selected work/projects
7. Project case-study detail pages
8. Process section
9. Experience/skills
10. Testimonials or highlights
11. Contact CTA
12. Footer

Hero:

- First screen should show the person/brand clearly.
- Use a huge headline with one emphasized italic/accent phrase.
- Include short intro text.
- Include two CTAs: view work and contact/about.
- Add animated visual area: portrait placeholder, profile card, floating skill tags, or image.

Navigation:

- Sticky rounded header with glass/blur effect.
- Links: Work, About, Services, Contact.
- CTA button: Let's Talk or Hire Me.
- Mobile should collapse into a clean menu later.

About:

- Two-column editorial layout.
- Left: heading.
- Right: short bio and stats.
- Stats can include projects, experience, technologies, or clients.

Services:

- Use horizontal rows instead of basic cards.
- Each service row should include number, title, and short explanation.
- Animate rows on scroll.

Projects:

- Use large project case-study blocks.
- Avoid small equal cards as the main representation.
- Each project should include:
  - title
  - category/type
  - short description
  - image or visual mockup
  - tech stack
  - live link
  - GitHub link
  - case study page link
- Alternate layout direction for visual rhythm.
- Project visuals should be large and image-led when real screenshots are available.

Case Studies:

- Dynamic route: `/projects/:slug`
- Include:
  - hero image
  - project overview
  - problem
  - solution
  - features
  - tech stack
  - screenshots/gallery
  - result/outcome
  - links

Process:

- Three to five clear steps.
- Use numbered blocks.
- Keep content short and scannable.

Contact:

- Strong dark CTA panel.
- Email, social links, and optional contact form.
- Form submissions should be stored in MongoDB Atlas.

## Dynamic Website Requirements

Use MongoDB Atlas for content and admin-managed data.

Suggested collections:

- `siteSettings`
- `profile`
- `skills`
- `services`
- `projects`
- `experiences`
- `testimonials`
- `contacts`

Suggested project schema:

```js
{
  title: String,
  slug: String,
  category: String,
  shortDescription: String,
  description: String,
  heroImage: String,
  gallery: [String],
  techStack: [String],
  liveUrl: String,
  githubUrl: String,
  featured: Boolean,
  order: Number,
  problem: String,
  solution: String,
  results: String,
  createdAt: Date,
  updatedAt: Date
}
```

Suggested contact schema:

```js
{
  name: String,
  email: String,
  subject: String,
  message: String,
  status: {
    type: String,
    default: "new"
  },
  createdAt: Date
}
```

## Frontend Architecture

Suggested structure:

```txt
client/
  src/
    components/
      Header.jsx
      Hero.jsx
      Marquee.jsx
      About.jsx
      Services.jsx
      ProjectShowcase.jsx
      Process.jsx
      Contact.jsx
      Footer.jsx
    pages/
      Home.jsx
      ProjectDetail.jsx
      Admin.jsx
    api/
      client.js
    data/
      fallbackContent.js
    styles/
      globals.css
      variables.css
```

Use reusable components for:

- Section heading
- Reveal wrapper
- Button
- Project card/block
- Marquee
- Skill tag
- Contact form

## Backend Architecture

Suggested structure:

```txt
server/
  src/
    config/
      db.js
    models/
      Project.js
      Service.js
      Skill.js
      Profile.js
      Contact.js
    routes/
      projects.routes.js
      services.routes.js
      profile.routes.js
      contact.routes.js
    controllers/
    middleware/
    app.js
    server.js
```

API endpoints:

- `GET /api/profile`
- `GET /api/services`
- `GET /api/skills`
- `GET /api/projects`
- `GET /api/projects/featured`
- `GET /api/projects/:slug`
- `POST /api/contact`

Optional admin endpoints later:

- `POST /api/projects`
- `PATCH /api/projects/:id`
- `DELETE /api/projects/:id`
- `PATCH /api/profile`

## Content Notes

Current placeholder identity:

- Name: Rumman Ahmed
- Role: Creative Developer / Frontend Developer
- Focus: frontend, UI motion, responsive portfolio websites, dynamic web apps

Need real content later:

- Real profile photo or generated portrait direction
- Real email address
- GitHub URL
- LinkedIn URL
- Resume URL
- Real project names
- Project screenshots
- Project descriptions
- Tech stacks
- Live and GitHub links

## Implementation Priorities

Phase 1:

- Set up React frontend and Node backend.
- Add MongoDB Atlas connection.
- Build dynamic homepage with fallback content.
- Implement core visual style and animations.

Phase 2:

- Add project detail pages.
- Add contact form connected to backend.
- Seed MongoDB with initial content.
- Improve responsive navigation.

Phase 3:

- Add admin/content editing workflow.
- Add image upload strategy.
- Add SEO metadata.
- Add performance polish.

## Design Quality Bar

Before considering the design done:

- Desktop and mobile layouts must be checked.
- No text should overflow its container.
- Hero should feel premium in the first viewport.
- Projects must look like case studies, not generic cards.
- Colors should stay consistent with the warm editorial palette.
- Animations should be smooth and not excessive.
- Contact flow should be obvious.
- Database-backed content should render with loading and error states.

