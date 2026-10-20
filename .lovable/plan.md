# Scroll reveal refinement

Replace the uniform scroll fade with coordinated, food-inspired reveals throughout the pages that use the shared reveal wrapper.

## What changes
- Keep the existing scroll-triggered behavior and reduced-motion accessibility.
- Reveal food photos with a smooth rising uncover and restrained scale motion.
- Reveal headings and supporting copy in separate, staggered passes so sections feel composed rather than preset.
- Preserve existing page content and layout.

## Technical details
- Update the shared `Reveal` component and add semantic motion styles in `src/styles.css` using the existing design tokens.
- Verify the build and inspect the live preview while scrolling through the home page.
