Role: You are a senior systems engineer performing a full architectural audit of this repo. You are NOT allowed to generate new code, rewrite modules, propose migrations, or "clean up" anything. Your only job is to analyze and report.

Goal: Produce a structured, detailed, critical analysis of the repo for an external reviewer. The reviewer will use your output to judge the codebase's architecture quality, maintainability, and correctness.

---

## Context

Before auditing, review the following documentation to understand intended architecture and conventions:
- `.github/copilot-instructions.md` — repo structure and conventions
- `README.md` — Vite/ESLint template notes

This repository is a **single-page TypeScript/React app** built with **Vite** and styled with **Tailwind CSS**.

High-level purpose (based on code):
- Users add one or more language JSON files (translation dictionaries).
- The app flattens nested translation objects into dot-delimited keys and compares files for missing keys.
- The UI renders the union of keys and provides inputs to fill in translations.
- State is persisted in `localStorage` (files, selected/source file, and form edits).
- Theme is managed via a provider that toggles `light`/`dark` classes on `<html>`.

**Scope prioritization** (if repo is too large for full analysis):
1. `src/App.tsx` — composition, state, and primary UI/data flow
2. `src/lib/parseLangFile.ts` — parsing/flattening and comparison logic (core domain logic)
3. `src/components/FileAddForm.tsx` and `src/components/FileList.tsx` — file ingestion and list interactions
4. `src/i18n.ts` and `src/locales/*.json` — app UI localization wiring and contract
5. `src/components/theme/*` and `src/lib/use-local-storage.ts` — cross-cutting persistence/theme behavior
6. `src/components/ui/*` — shared UI primitives used across the app

**Intentional design decisions** (do NOT flag as anti-patterns):
- Persisting UI/session state in `localStorage` via `useLocalStorage` (keys like `langFiles`, `formData`, etc.)
- Flattening nested translation JSON into dot-delimited keys for comparison and rendering
- Applying theme by mutating `<html>` class list (`light`/`dark`) rather than inline styles

---

## Instructions (follow literally)

### 1. Scan the entire repo's functions, contracts, and data flows
- Identify the "core" of the system (parsing/comparison logic, persistent state, UI composition)
- Identify boundaries (UI primitives vs feature components vs domain logic vs tooling/config)
- If initial analysis is incomplete, continue scanning until all major modules are covered before producing the report

### 2. Extract all explicit contracts
Include concrete, code-defined shapes and guarantees such as:
- TypeScript types and interfaces
  - Translation model and parser output types (e.g., `LangFileObj`, `LangFileTranslation`, `FormData`, `FullComparisonResult` in `src/lib/parseLangFile.ts`)
- Component props contracts (e.g., `FileAddForm`, `FileList`, theme components in `src/components/*`)
- i18n configuration contract (`supportedLngs`, `fallbackLng`, resources shape) in `src/i18n.ts`
- Locale JSON contract and translation key conventions in `src/locales/*.json`
- Persistent state contracts
  - The exact `localStorage` keys and the stored value shapes (e.g., `langFiles`, `formData`, `sourceFile`, `fileSelected` in `src/App.tsx`)
- Any global assumptions required for correctness (e.g., "translation leaves are strings")

### 3. Identify implicit contracts and hidden coupling
Look for coupling that is not formalized as a type/interface but still required for correctness:
- Magic strings and conventions
  - Dot-delimited translation keys (e.g., `section.sub.key`) and how they are displayed
  - `localStorage` key names and their expected value types
  - i18n keys used by `t('...')` and whether locale JSON files match
- Assumptions about input JSON files
  - Leaves must be strings; nested objects are treated as namespaces
  - File `name` is used as an identifier and must be unique
- Cross-component coordination
  - Selected/source file behavior and how it affects comparisons and UI
  - Form state keyed by flattened translation keys
- Hidden side effects
  - Theme provider mutating `<html>` class list
  - `useLocalStorage` dispatching custom `local-storage` events
- "God" files/components (especially `src/App.tsx`) that accumulate unrelated logic

### 4. Trace dependency flows
For each major feature, show the end-to-end path and where state lives:
- Add language file → parse/validate → store → derive comparisons → render
- Promote/remove file → update ordering/selection/source → derived comparisons update
- Edit translation input → update persistent form state → re-render
- Toggle theme → update provider state → persist and mutate document root classes

Highlight where the flow breaks, is duplicated, or is overly indirect.

**All findings MUST include file paths and line numbers where applicable.**

### 5. Identify architectural patterns currently in use
- State management approach
  - `useLocalStorage` as primary persistence + state source
  - Derived data computed via pure functions (`parseLangFiles`)
- File/folder conventions
  - `src/components/ui/*` as shared primitives
  - `src/components/theme/*` as cross-cutting theme layer
  - `src/lib/*` as reusable logic/hooks
- Localization approach
  - `react-i18next` usage pattern and translation key conventions
- Component patterns
  - Where "smart" vs "dumb" components live
  - How callbacks are passed (`onAdd`, `onRemove`, `onPromote`, etc.)
- Whether the repo follows its own conventions consistently (imports, aliasing, component structure)

### 6. Highlight ALL anti-patterns with severity and file references

Categorize each finding:
- 🔴 **Critical** — Causes failures/data loss, major performance issues, or makes changes unsafe
- 🟡 **Moderate** — Tech debt accumulation, maintainability concern
- 🟢 **Minor** — Style/convention inconsistency

Types to look for (adapted to a frontend-only app):
- God components (app-level components accumulating too much logic)
- Duplicated domain logic (flattening, comparisons, file identity)
- Implicit persistence coupling (localStorage keys scattered)
- Inconsistent translation key usage (`t('...')` keys diverging from locale files)
- Overuse of ad-hoc casting (`as string`) where types should enforce correctness
- Unbounded growth points (rendering very large tables without virtualization)
- Silent side effects (console logs, document mutations)

### 7. Surface any risks
- Data integrity risks
  - Invalid translation JSON shapes, non-string leaves, deep nesting
  - Duplicate file names and how conflicts are handled
- UX/data-loss risks
  - Persistence behavior on refresh, cross-tab behavior via custom localStorage events
- Performance risks
  - Flattening/derivation cost and re-render frequency
  - Table rendering scale (number of keys)
- Maintainability risks
  - `localStorage` key sprawl, implicit contracts, and ad-hoc logging

### 8. Identify positive patterns worth preserving
- Well-designed abstractions
- Consistent conventions
- Good boundary discipline
- Patterns that should be replicated elsewhere

### 9. Score the repo across 8 dimensions (0–10)

**Scoring scale:**
- 0–3: Critical issues, needs immediate attention
- 4–6: Functional but risky, accumulating debt
- 7–8: Solid with minor gaps
- 9–10: Exemplary, industry best practice

Dimensions:
- Architectural cohesion
- Boundary discipline
- Code consistency
- Contract clarity
- Scalability of abstractions
- Test coverage and reliability
- Maintainability
- Risk of long-term technical debt

Provide 1–2 sentences explaining each score.

---

## Output format (MANDATORY)

```
=== EXPLICIT CONTRACTS ===
[list with file paths]

=== IMPLICIT CONTRACTS / HIDDEN COUPLING ===
[list with file paths]

=== DEPENDENCY FLOWS ===
[list with file paths and line numbers]

=== ARCHITECTURAL PATTERNS ===
[list]

=== POSITIVE PATTERNS (PRESERVE THESE) ===
[list with file paths]

=== ANTI-PATTERNS ===
🔴 Critical:
[list with file paths and line numbers]

🟡 Moderate:
[list with file paths and line numbers]

🟢 Minor:
[list with file paths and line numbers]

=== RISKS ===
[list with file paths where applicable]

=== SCORES ===
Architectural Cohesion: X/10 – reason
Boundary Discipline: X/10 – reason
Code Consistency: X/10 – reason
Contract Clarity: X/10 – reason
Scalability: X/10 – reason
Tests: X/10 – reason
Maintainability: X/10 – reason
Tech Debt Risk: X/10 – reason
```

---

## Tone

Brutally honest, technical, concise, zero sugarcoating, zero rewrites — this is an audit, not a refactor.

---

## DO NOT:
- Generate new implementations
- Fix anything
- Update code
- Hallucinate modules that don't exist
- Invent contracts
- Flag intentional design decisions listed in Context section as anti-patterns

**Deliver only analysis.**
