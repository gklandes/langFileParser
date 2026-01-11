# langFileParser

A small React app for comparing i18n JSON language files.

You can import multiple locale JSON files, the app will flatten nested objects into dot-delimited keys (e.g. `app.title`), compute the union of keys across all files, and show which files are missing which keys.

In production, this app is intended to be a completely self-contained, local app (no external data processing). Users can access it as a web page and interact with it, without any local data being processed outside of the local environment.

## How to use

1. Start the app (local development) / Load the app in browser (deployed).
2. Click **Add file** and import one or more `.json` translation files.
3. Use **Set base** to promote a file as the “base” (first in the list).
4. The file list shows a “missing” count per file.
5. The main table lists all keys and provides inputs to edit translation values.

Notes:
- Imported files and edits are persisted in the browser via `localStorage`.
- Duplicate filenames are rejected (you’ll see a toast).

Reset / clear data:
- To reset the app state, clear site data for this origin (Chrome: DevTools → Application → Storage → “Clear site data”).
- Or manually remove these `localStorage` keys: `langFiles`, `formData`, `sourceFile`, `fileSelected`.

## Development

```bash
npm install
npm run dev
```

Other scripts:

```bash
npm run build
npm run preview
npm run lint
```

## Project structure (high-signal)

- Core parsing/comparison logic: `src/lib/parseLangFile.ts` (`parseLangFiles`, flattening)
- Persistent state helper: `src/lib/use-local-storage.ts`
- App composition/state wiring: `src/App.tsx`
- File ingestion UI: `src/components/FileAddForm.tsx` (FileReader + JSON.parse)
- File list UI/actions: `src/components/FileList.tsx`
- i18n wiring: `src/i18n.ts` and `src/locales/*.json`
- Theme provider + toggle: `src/components/theme/*`

## Tech stack

- Vite + React + TypeScript
- Tailwind CSS + Radix UI primitives (in `src/components/ui/*`)
- `react-i18next` for UI localization
- `sonner` for toast notifications
