# Radix UI → Base UI (whole project)

2026-09-27 · strategy: golden pair via the shadcn CLI (`shadcn add` into a
scratch project with this repo's `components.json` and `style: base-vega`),
then per-component port of site customizations · verdict: **complete, 0
wrappers remain on Radix**.

Follows the official `migrate-radix-to-base` skill
(github.com/shadcn-ui/ui/tree/main/skills/migrate-radix-to-base).

## Changed

- `@base-ui/react@^1.8` added; every `@radix-ui/*` package removed.
- `components.json` style `new-york` → `base-vega` ("the classic shadcn/ui
  look"). `npx shadcn info` now reports `base: "base"`, so future
  `shadcn add` delivers Base UI components.
- `app/globals.css` imports `tw-animate-css` and `shadcn/tailwind.css` (the
  `data-open`/`data-horizontal`/… variants base wrappers use) in place of
  `tailwindcss-animate`; `--color-sidebar` alias added; body gets
  `position: relative`; the app root is `isolate` (Base UI setup).
- One commit per wrapper, bottom-up:

| Wrapper | Base UI part(s) | Consumer changes |
|---|---|---|
| button | `button` | site variants kept (arrow, smile, gooey*, linkHover*, shine, ringHover, expandIcon); sponsors link → `render={<Link />}` + `nativeButton={false}` |
| label, separator, checkbox, switch, slider, radio-group, scroll-area, avatar, tabs | 1:1 | none |
| popover | Portal › Positioner › Popup | sponsors radar hover trigger → `render={<div />}` |
| accordion | Content → Panel | FAQ drops `type="single" collapsible` |
| dialog, sheet | Overlay → Backdrop, Content → Popup | none |
| command | cmdk kept; Base dialog; new `input-group` | none |
| select | Viewport → List, Positioner | edit dialog labels its `SelectValue` |
| dropdown-menu | `menu` | triggers → `render={<Button />}`; label wrapped in `DropdownMenuGroup` |
| breadcrumb | `useRender` + `mergeProps` | none |
| sidebar + tooltip | `useRender`; tooltip Portal › Positioner › Popup | links → `render={<Link />}`; site layout kept (12rem, in-page, no left border) |
| field | (not Radix) | base-vega version keys choice cards off `data-checked` |
| calendar, input-otp | (not Radix) | `@radix-ui/react-icons` → lucide |

Leftover scan: `git grep -nE "radix-ui|@radix-ui" -- '*.ts' '*.tsx'` is
clean apart from the registry test's own pattern. `__tests__/primitive-seam.spec.ts`
now fails if app code imports a primitive library outside `components/ui`.

## Left alone

- `components/ui/drawer.tsx`: vaul, not Radix (`DrawerTrigger asChild` in
  the header is vaul's API).
- cmdk (command), sonner, input-otp, react-day-picker (calendar): not Radix.
- Registry items (`registry.json`): already primitive-agnostic, and verified
  to install and typecheck in radix-nova, base-nova and new-york-v4 projects.

## Behavior changes

Flagged, not patched:

- **Look**: wrappers now use base-vega's (Tailwind v4) classes instead of the
  2024 new-york ones: slightly different padding, rings and hover shades.
  Each wrapper is its own commit if one should be restyled back.
- **Tabs** activate manually: arrow keys move focus, Enter/Space selects.
- **Select** aligns the list over the trigger (`alignItemWithTrigger`
  default true) and `onValueChange` can receive `null`.
- **Accordion** allows one open item and collapsing by default.
- **Menus**: checkbox/radio items don't close on click (none used today).
- **Sidebar** no longer wraps a `TooltipProvider`; add one if
  `SidebarMenuButton tooltip=` is ever used.

## Verify by hand

- Theme switch (header): open, pick Light/Dark/System, menu closes.
- Playground: add Select, Combobox, Date Picker, Signature Pad; open each
  popup, pick a value, Escape closes, focus returns to the trigger.
- Signature Pad dialog: backdrop click and Escape close it.
- /components/*: Preview/Code tabs switch with click and keyboard.
- /templates/*: sidebar sits below the header, flow links switch previews.
- FAQ on the home page: items expand and collapse with the height animation.
