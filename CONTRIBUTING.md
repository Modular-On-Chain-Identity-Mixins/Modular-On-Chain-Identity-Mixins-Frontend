# Contributing

## Getting Started

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/my-feature`)
3. Install dependencies (`npm install`)
4. Start the dev server (`npm run dev`)

## Pull Requests

- Keep PRs focused on a single concern.
- Include a clear description of the change and its motivation.
- Reference any related issues.
- Ensure the build passes: `npm run build && npm test`.

## Coding Standards

- **TypeScript**: Strict mode enabled. Avoid `any` where possible.
- **Components**: Default exports for pages, named exports for everything else.
- **Styling**: Tailwind CSS with the project's dark theme tokens. Use `clsx` for conditional classes.
- **State**: Zustand for global state, React hooks for local state.
- **Linting**: Run `npm run lint` before committing (oxlint).

## Commit Messages

Use conventional commits:
- `feat:` new feature
- `fix:` bug fix
- `refactor:` code restructuring
- `docs:` documentation changes
- `test:` test additions/changes
- `chore:` tooling, config, CI

## Testing

- Unit tests live in `src/test/` and use Vitest.
- Integration tests render full components with mocked stores.
- E2E tests are in `e2e/` and use Playwright.
- Run all tests: `npm test`
- Run E2E tests: `npm run test:e2e`

## Code of Conduct

Be respectful, constructive, and inclusive.
