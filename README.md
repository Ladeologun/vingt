# Vingt

Learn 20 French verbs a day with English meanings, pronunciation, examples, and interactive quizzes. Built with React and Vite.

## Features

- **Daily lessons:** 100 verbs across five sets of 20, repeating for review after day five.
- **Pronunciation:** French audio and IPA guides for each verb.
- **Examples:** Simple French sentences with English translations.
- **Practice:** Hide meanings, take quizzes, and retry missed verbs.
- **Listening practice:** Hear new sentences using today’s verbs, choose their meanings, and reveal translations and verb explanations after answering. Replay normally or slowly, show the French transcript when needed, and retry missed sentences.
- **Progress:** Track learned verbs, vocabulary quiz results, and listening scores separately.
- **Verb library:** Search by French verb or English meaning.
- **Light and dark modes:** Responsive design with a saved theme preference.

## Getting started

Use Node.js 20 or 22+ and npm.

```sh
npm install
npm run dev
```

Open the local URL printed in your terminal.

## Development commands

| Command                | Purpose                                   |
| ---------------------- | ----------------------------------------- |
| `npm run dev`          | Start the development server.             |
| `npm run build`        | Build the app into `dist/`.               |
| `npm test`             | Run the lesson, quiz, and progress tests. |
| `npm run format`       | Format the project with Prettier.         |
| `npm run format:check` | Check formatting.                         |

## How it works

Your first visit starts the lesson schedule. A new set is selected at local midnight, and the five-day collection repeats for review.

Progress and theme preferences are stored in your browser. No account, API key, or backend is required. Progress does not sync between devices, and clearing browser data resets it. The latest vocabulary quiz and listening result for each day are retained separately, including retry results.

Pronunciation uses your device’s speech synthesis, so French voice availability and quality depend on your browser and installed voices.

## Contributing

See [AGENTS.md](AGENTS.md) and the [local skills guide](skills/README.md) for coding conventions. Run the formatting check, tests, and production build before submitting changes.
