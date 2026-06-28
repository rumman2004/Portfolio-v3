# Design System: Minimalist White Theme

## Overview
This design system defines a minimalist, highly editorial, typography-driven aesthetic for a modern developer portfolio. It combines extreme negative space, stark contrast, and massive typography to create a premium feel.

## Colors
- **Primary Background:** `#ffffff` (White)
- **Secondary Background:** `#fafafa` (Off-white)
- **Primary Text:** `#09090b` (Zinc 950 - near black)
- **Muted Text:** `#71717a` (Zinc 500)
- **Borders:** `#e4e4e7` (Zinc 200)
- **Accent:** `#000000` (Pure Black)

## Typography
- **Headings (Display):** Playfair Display, Serif. Used for massive, editorial titles and hero sections.
- **Body & UI (Sans):** Inter, Sans-serif. Used for all paragraphs, metadata, buttons, and navigation.

## Component Specifications

### 1. Hero Section
- **Layout:** Centered or heavily left-aligned. Minimal elements.
- **Typography:** Display font, extremely large (e.g. 144px / 9rem), uppercase, with tight tracking.
- **Elements:** Large Title, small supporting paragraph (muted text), and a minimal "View Work" outline button.

### 2. About / Two-Column Section
- **Layout:** Grid layout (12 columns).
- **Left Column (4 cols):** Small uppercase eyebrow text (e.g., "ABOUT ME"), followed by a medium-large Display heading.
- **Right Column (8 cols):** Readable, relaxed body paragraphs. Contains a numerical stats grid (Years Experience, Projects, Clients) using Display font for the numbers.

### 3. Project Cards (Work Showcase)
- **Layout:** Edge-to-edge or large inset cards. 
- **Style:** No visible borders, rely on the image mockup to define the card boundaries.
- **Typography:** Project title in Display font, metadata (tech stack) in small uppercase Sans-serif.

### 4. Buttons
- **Primary:** Transparent background, 1px solid black border, black text. Uppercase, wide tracking, bold sans-serif font. Hover state inverts to black background, white text.
- **Secondary:** Transparent background, transparent border, muted text. Hover state turns text to black.

### 5. Navigation
- **Layout:** Fixed top, flex-between.
- **Style:** Mix-blend-mode difference, ensuring it is always visible over light or dark sections.
- **Links:** Uppercase, tracking-wider, small font size.

### 6. Badges / Tags
- **Style:** Small text, uppercase, monospace or sans-serif, separated by bullets (`·`) or simple light gray borders. No heavy colored backgrounds.
