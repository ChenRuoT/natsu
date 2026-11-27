# Natsu i18n conventions

Hand-rolled, no dependency. Locales: `en` (source) and `zh-CN`.

## Files

- `i18n.ts` — `useT()`, `t()`, `setLocale()`, `TFunction`, `MessageKey`.
- `rich.tsx` — `richText(message, { tag: (chunk) => node })` for messages with inline markup.
- `messages/en/<area>.ts` — English source catalog, one file per area, `export const <area> = { ... } as const`.
- `messages/zh-CN/<area>.ts` — Chinese catalog, typed `Record<keyof typeof <area>, string>`, so a missing or extra key fails `tsc`.
- `messages/{en,zh-CN}/index.ts` — aggregators. **Do not edit them**; the area files already exist as stubs.
- `glossary.md` — required Chinese terminology.

Each key lives in exactly one area file. Do not reuse a key from another area; a near-duplicate string in your own area is fine, give it its own key.

## Keys

`<surface>.<component or page>.<thing>` in camelCase segments, e.g. `settings.providers.binary.pathLabel` or `sessions.composer.sendLabel`. The second segment must name the component or file, so two agents working in parallel never choose the same key.
Name the key after what the text _is_, not the English words (`...saveButton`, not `...save`).

## Using messages in React

```tsx
import { useT } from "../../../shared/i18n/i18n"; // adjust the relative path

function SomePage() {
  const t = useT(); // call inside each component that renders text
  return (
    <Row label={t("settings.x.label")} description={t("settings.x.help")} />
  );
}
```

Every component that shows text calls `useT()` itself so it re-renders when the language changes. Passing `t` down as a prop is acceptable for small helpers.

## What to translate

Translate every string a user can see or hear: text nodes, `aria-label`, `title`, `placeholder`, `alt`, button labels, toasts, inline error messages, empty states, dialog text, confirm prompts.

Do **not** translate: product and provider names (Natsu, Claude, Codex, Gemini, GitHub, GitLab, Linear, Jira, MCP, Git, SSH, OAuth…), file paths, CLI commands and flags, environment variable names, code samples, `data-*`/`id`/test hooks, `console.*` output, localStorage keys, object keys, and strings that are parsed by code rather than shown.

Existing tests assert the English text, so the English catalog value must be **byte-identical** to the original string. Never "improve" English wording.

## Dynamic text

- Interpolation uses single braces: `t("settings.x.count", { count: n })` with `"{count} projects"`. Placeholder names must be identical in every language.
- English plurals: add two keys (`...one`, `...other`) and pick with `n === 1 ? ... : ...`. Chinese has no plural, so both Chinese values are the same sentence.
- Never build a sentence by concatenating translated fragments; put the whole sentence in one message so word order can change.
- Inline markup (`<code>`, `<strong>`, links) inside a sentence: put `<tag>…</tag>` in the message and render with `richText`. Example: `"Edit <code>{file}</code> to continue"` → `richText(t("k", { file }), { code: (c) => <code>{c}</code> })`. Interpolated values go through `t` params and are inserted before tags are parsed.

## Event handlers, effects and async code

In render, use `useT()`. Inside event handlers, effects, timers and async callbacks, import the global function with an alias, `import { t as tNow } from ".../i18n"`, and call `tNow("key")`: it reads the current language when it runs. Text built this way is not re-translated if the language changes while it is on screen; that is acceptable for toasts and one-shot errors.

## Never translate (even though a user may see it)

- Text sent to an AI model or CLI: prompts, system instructions, slash-command bodies, generated commit messages, branch and ref names.
- Text that is persisted or used as an identifier: default titles saved to the database, file names, map keys, ids, storage values, event names, strings compared in code.
- Raw error text from the backend, Git, a CLI or the OS (`String(error)`, `err.message`): translate your own wrapper sentence and pass the raw text as a `{error}` parameter.
- Keep the unchanged English when unsure, and say so in your report.

## Strings outside components

A module-level constant or plain function that returns display text cannot call `useT()`. Either

1. store a `MessageKey` in the constant (`labelKey: "settings.x.label" as const satisfies MessageKey`) and call `t(labelKey)` where it renders, or
2. give the function a `t: TFunction` parameter and pass it from the component.

Do not call the global `t()` during render in components (it will not re-render on language change).

## Checklist for a finished area

- No user-visible English string literal remains in the owned files (`grep` for `>[A-Z]`, quoted strings in JSX props, `label:`/`title:`/`description:` fields).
- `npx tsc --noEmit` is clean and the area's existing vitest files still pass with English text unchanged.
- Every `zh-CN` value follows `glossary.md`.
