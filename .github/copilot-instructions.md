# Copilot Instructions for langParser

## Project Overview
- **Framework:** React + TypeScript, built with Vite for fast development and HMR.
- **UI:** Uses Tailwind CSS for styling and custom UI components in `src/components/ui/`.
- **Localization:** Language files are managed in `src/locales/` and parsed via `src/lib/parseLangFile.ts`.
- **Theme:** Theme management is handled in `src/components/theme/`.

## Key Patterns & Conventions
- **Component Structure:**
  - All major UI elements are in `src/components/ui/` (e.g., `button.tsx`, `card.tsx`).
  - Forms and lists (e.g., `FileAddForm.tsx`, `FileList.tsx`) follow controlled component patterns.
- **State & Storage:**
  - Use React hooks for state management.
  - Persistent state (e.g., theme, language) uses `src/lib/use-local-storage.ts`.
- **Localization:**
  - Language files (`en.json`, `es.json`) are loaded and parsed using `parseLangFile.ts`.
  - i18n logic is centralized in `src/i18n.ts`.
- **Theme Toggle:**
  - Theme switching is handled by `ThemeToggle.tsx` and `theme-provider.tsx`.
- **Commits:**
  - Follow conventional commit messages (e.g., `feat:`, `fix:`, `docs:`).

## Developer Workflows
- **Build:**
  - Run `npm install` then `npm run dev` for local development.
  - Vite config is in `vite.config.ts`.
- **Linting:**
  - ESLint config is in `eslint.config.js`.
  - For type-aware linting, update `parserOptions` and use recommended type-checked configs (see README for details).
- **Testing:**
  - No explicit test setup detected; add tests in `src/` and document conventions if introduced.
- **Debugging:**
  - Use Vite's HMR and browser devtools for debugging React components.

## Integration Points
- **External Dependencies:**
  - React, Vite, Tailwind CSS, ESLint, Babel/SWC (for Fast Refresh).
- **Custom Utilities:**
  - Utility functions in `src/lib/utils.ts`.

## Examples
- To add a new language, place a JSON file in `src/locales/` and update `src/i18n.ts`.
- To create a new UI component, follow the pattern in `src/components/ui/` and use Tailwind classes.
- To persist user settings, use the hook from `src/lib/use-local-storage.ts`.

## References
- See [README.md](../../README.md) for ESLint and setup details.
- Key files: `src/App.tsx`, `src/i18n.ts`, `src/components/`, `src/lib/`, `vite.config.ts`, `eslint.config.js`.

## AI / Agent Usage Guidelines
- When generating planning documents or code, put all ephemeral files in a separate folder named `ai-context/`.
- Do not commit code unless explicitly instructed.