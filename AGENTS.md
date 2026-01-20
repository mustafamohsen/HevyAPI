# Hevy API - Development Rules

## Core Workflow

- **Commit after each step** - Use conventional commit messages
- **Always use bun** - Not npm/npx for package management
- **Always use biome** - For linting and formatting
- **Lint and fix after significant changes**
- **Never change linting rules**
- **100% test coverage** - Write tests, always test after changes

---

## Quick Reference

- **Install dependencies**: `bun install`
- **Build project**: `bun run build`
- **Run tests**: `bun test`
- **Format code**: `bunx biome format --write .`
- **Lint code**: `bunx biome check .`

---

## Conventional Commits

Follow [Conventional Commits](https://www.conventionalcommits.org/) format:

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation only changes
- `style:` - Formatting, missing semicolons, etc. (no code change)
- `refactor:` - Code restructuring without behavior change
- `test:` - Adding or modifying tests
- `chore:` - Maintenance tasks

Example: `feat(client): add authentication error handling`

---

## Type Safety & Explicitness

- Use explicit types for function parameters and return values when they enhance clarity
- Prefer `unknown` over `any` when the type is genuinely unknown
- Use const assertions (`as const`) for immutable values and literal types
- Leverage TypeScript's type narrowing instead of type assertions
- Use meaningful variable names instead of magic numbers - extract constants with descriptive names

---

## Modern JavaScript/TypeScript

- Use arrow functions for callbacks and short functions
- Prefer `for...of` loops over `.forEach()` and indexed `for` loops
- Use optional chaining (`?.`) and nullish coalescing (`??`) for safer property access
- Prefer template literals over string concatenation
- Use destructuring for object and array assignments
- Use `const` by default, `let` only when reassignment is needed, never `var`

---

## Async & Promises

- Always `await` promises in async functions - don't forget to use the return value
- Use `async/await` syntax instead of promise chains for better readability
- Handle errors appropriately in async code with try-catch blocks
- Don't use async functions as Promise executors

---

## Error Handling & Debugging

- Remove `console.log`, `debugger`, and `alert` statements from production code
- Throw `Error` objects with descriptive messages, not strings or other values
- Use `try-catch` blocks meaningfully - don't catch errors just to rethrow them
- Prefer early returns over nested conditionals for error cases

---

## Code Organization

- Keep functions focused and under reasonable cognitive complexity limits
- Extract complex conditions into well-named boolean variables
- Use early returns to reduce nesting
- Prefer simple conditionals over nested ternary operators
- Group related code together and separate concerns

---

## Testing

- Write assertions inside `it()` or `test()` blocks
- Avoid done callbacks in async tests - use async/await instead
- Don't use `.only` or `.skip` in committed code
- Keep test suites reasonably flat - avoid excessive `describe` nesting
- **Maintain 100% test coverage** - Run `bun test --coverage` to verify
- Test all public API methods and error paths

---

## When Biome Can't Help

Biome's linter will catch most issues automatically. Focus your attention on:

1. **Business logic correctness** - Biome can't validate your algorithms
2. **Meaningful naming** - Use descriptive names for functions, variables, and types
3. **Architecture decisions** - Component structure, data flow, and API design
4. **Edge cases** - Handle boundary conditions and error states
5. **User experience** - Accessibility, performance, and usability considerations
6. **Documentation** - Add comments for complex logic, but prefer self-documenting code

---

## Project Structure

```
src/
├── client/         # Base API client with auth and error handling
├── errors/         # Custom error classes
├── resources/      # API resource classes (workouts, routines, etc.)
├── types/          # TypeScript type definitions
└── utils/          # Utility functions
tests/              # Test files (mirrors src structure)
examples/           # Usage examples
```
