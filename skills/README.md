# Project skills

These are local copies from
`/Users/ladeologun/Desktop/trezor/trezor-suite/skills`.
They are available without needing the original Trezor checkout.

[Project instructions](../AGENTS.md) tell future contributors to read and apply
these skills when relevant.

## Applied to the current app

| Skill                                                   | What it covers                                                             |
| ------------------------------------------------------- | -------------------------------------------------------------------------- |
| [Basic syntax](basic-syntax/SKILL.md)                   | Spacing, conditionals, boolean rendering, and named function arguments.    |
| [Naming](naming/SKILL.md)                               | Descriptive identifiers and boolean names.                                 |
| [Import/export](import-export/SKILL.md)                 | Named exports and direct module imports.                                   |
| [Components](components/SKILL.md)                       | Separate React components and consistent component organization.           |
| [Defensive programming](defensive-programming/SKILL.md) | Validate saved progress and return explicit results for expected failures. |
| [Comments](comments/SKILL.md)                           | Clear comments with consistent capitalization and punctuation.             |
| [Tests](tests/SKILL.md)                                 | Behavior-focused tests and colocated `__tests__` folders.                  |

## Available for future work

| Skill                                                           | When to use it                                           |
| --------------------------------------------------------------- | -------------------------------------------------------- |
| [TypeScript](typescript/SKILL.md)                               | When adding TypeScript; the current app uses JavaScript. |
| [Git and commit guidelines](git-and-commit-guidelines/SKILL.md) | When creating commits or pull requests.                  |

## Formatting and project-specific scope

The project root contains `.prettierrc`, `.editorconfig`, and `.prettierignore`.
From the app root, run `npm run format` to apply formatting or
`npm run format:check` to verify it.

Use the general conventions from these skills. Trezor-specific workspace
packages, cryptocurrency rules, Redux infrastructure, and Yarn/Nx commands do
not apply to this standalone React app. Follow `../AGENTS.md` for those local
adaptations, including JavaScript test filenames and Node's test runner.
