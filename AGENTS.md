# French learning project conventions

This directory is the React app root. Run app commands from here.

## Required code-style skills

Read and apply the relevant local skills before changing code:

- [Basic syntax](skills/basic-syntax/SKILL.md).
- [Naming](skills/naming/SKILL.md).
- [Import/export](skills/import-export/SKILL.md).
- [Components](skills/components/SKILL.md).
- [Defensive programming](skills/defensive-programming/SKILL.md).
- [Comments](skills/comments/SKILL.md).
- [Tests](skills/tests/SKILL.md) when changing tests.
- [TypeScript](skills/typescript/SKILL.md) when writing TypeScript.
- [Git and commit guidelines](skills/git-and-commit-guidelines/SKILL.md) when committing.

These skills were copied from `/Users/ladeologun/Desktop/trezor/trezor-suite/skills`.
Apply their general conventions. Trezor-specific monorepo packages, crypto naming,
Redux infrastructure, Yarn/Nx commands, and native app tooling do not apply here.
This app currently uses JavaScript, React, Vite, npm, and Node's test runner.
Keep assertions compatible with that test runner rather than introducing Jest
or Trezor workspace dependencies. Use strict assertions for expected values.

## Formatting

The root `.prettierrc` and `.editorconfig` are copied from Trezor Suite. Use
four spaces, single quotes, semicolons, and a 100-character print width.
Use descriptive names, named exports, explicit boolean render conditions,
and object parameters for helpers with more than two inputs. Keep components
in separate files with related state, effects, callbacks, and derived values grouped.
Validate external or persisted data at its boundary. Use explicit result objects
for expected failures; catch exceptions only at browser/storage/JSON boundaries.

## Verification

- `npm run format` applies formatting to the project and local skills.
- `npm run format:check` verifies formatting.
- `npm test` checks lesson, quiz, and progress behavior.
- `npm run build` checks the production build.

Do not publish or upload project source without explicit user approval for that
destination. Local editing, formatting, builds, and tests are authorized.
