import { readdir, readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';

const SOURCE_ROOT = 'src';

const findSourceFiles = async (directory: string): Promise<string[]> => {
  const entries = await readdir(directory, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await findSourceFiles(path)));
      continue;
    }

    if (entry.isFile() && entry.name.endsWith('.ts')) {
      files.push(path);
    }
  }

  return files.sort((first, second) => first.localeCompare(second));
};

const readPackage = async (): Promise<{ version: string }> => {
  const packageJson = await readFile('package.json', 'utf8');
  return JSON.parse(packageJson) as { version: string };
};

const generateLlmsTxt = (version: string): string => `# Hevy API TypeScript Client

> TypeScript client library for the Hevy fitness tracking app API

Package: \`hevy-api\` v${version}
Runtime: Node.js >=20, Bun >=1.3.4
Module formats: ESM and CommonJS with TypeScript declarations
License: MIT

## Quick Start

\`\`\`typescript
import Hevy from 'hevy-api';

const client = new Hevy({
  apiKey: process.env.HEVY_API_KEY!,
});

const workouts = await client.workouts.getAll({ page: 1, pageSize: 10 });
\`\`\`

## Security Behavior

- API keys are sent with the \`api-key\` header by a request interceptor.
- Keep API keys on trusted server-side runtimes only; do not expose them in client-side bundles.
- The official origin \`https://api.hevyapp.com\` is allowed by default.
- Custom \`baseURL\` origins require \`trustBaseURL: true\` because credentials are sent to that origin.
- Trusted custom origins must use HTTPS, except HTTP loopback development hosts: \`localhost\`, \`127.0.0.1\`, and \`::1\`.
- Axios automatic redirects are disabled with \`maxRedirects: 0\` to avoid leaking credential-bearing requests to redirected destinations.
- Error objects redact the configured API key and common sensitive fields before exposing response or network metadata.
- Dynamic path segments are URL-encoded before requests are sent.

## Project Structure

\`\`\`
src/
├── client/         # Base API client with auth, baseURL trust checks, redirect hardening, and error handling
├── errors/         # Custom error classes
├── resources/      # API resource classes
├── types/          # TypeScript type definitions
├── utils/          # Path encoding and redaction helpers
└── index.ts        # Main entry point
tests/              # Bun tests
examples/           # Usage examples
\`\`\`

## Available Resources

### Workouts (\`client.workouts\`)
- \`getAll(params?)\` - Get paginated list of workouts
- \`getById(workoutId)\` - Get single workout by ID
- \`count()\` - Get total workout count
- \`getEvents(params)\` - Get workout events (updates/deletes)
- \`create(workout)\` - Create new workout
- \`update(workoutId, workout)\` - Update existing workout

### Routines (\`client.routines\`)
- \`getAll(params?)\` - Get paginated list of routines
- \`getById(routineId)\` - Get single routine by ID
- \`create(routine)\` - Create new routine
- \`update(routineId, routine)\` - Update existing routine

### Exercise Templates (\`client.exerciseTemplates\`)
- \`getAll(params?)\` - Get paginated list of exercise templates
- \`getById(exerciseTemplateId)\` - Get single exercise template
- \`create(exercise)\` - Create custom exercise template

### Routine Folders (\`client.routineFolders\`)
- \`getAll(params?)\` - Get paginated list of routine folders
- \`getById(folderId)\` - Get single routine folder
- \`create(folder)\` - Create new routine folder

### Exercise History (\`client.exerciseHistory\`)
- \`getByExerciseTemplateId(exerciseTemplateId, params?)\` - Get exercise history for an exercise template

### User (\`client.user\`)
- \`getInfo()\` - Get authenticated user info

### Body Measurements (\`client.bodyMeasurements\`)
- \`getAll(params?)\` - Get paginated body measurements
- \`create(measurement)\` - Create a body measurement
- \`getByDate(date)\` - Get a body measurement by date
- \`update(date, measurement)\` - Update a body measurement by date

## API Endpoints

- Workouts: \`GET /v1/workouts\`, \`GET /v1/workouts/{workoutId}\`, \`GET /v1/workouts/count\`, \`GET /v1/workouts/events\`, \`POST /v1/workouts\`, \`PUT /v1/workouts/{workoutId}\`
- Routines: \`GET /v1/routines\`, \`GET /v1/routines/{routineId}\`, \`POST /v1/routines\`, \`PUT /v1/routines/{routineId}\`
- Exercise templates: \`GET /v1/exercise_templates\`, \`GET /v1/exercise_templates/{exerciseTemplateId}\`, \`POST /v1/exercise_templates\`
- Routine folders: \`GET /v1/routine_folders\`, \`GET /v1/routine_folders/{folderId}\`, \`POST /v1/routine_folders\`
- Exercise history: \`GET /v1/exercise_history/{exerciseTemplateId}\`
- User: \`GET /v1/user/info\`
- Body measurements: \`GET /v1/body_measurements\`, \`POST /v1/body_measurements\`, \`GET /v1/body_measurements/{date}\`, \`PUT /v1/body_measurements/{date}\`

## Error Classes

- \`HevyAPIError\` - Base API error with status code and sanitized response data
- \`AuthenticationError\` - 401/403 authentication failures
- \`ValidationError\` - 400 validation failures with optional field errors
- \`NotFoundError\` - 404 missing resources
- \`RateLimitError\` - 429 rate limits with retry delay
- \`NetworkError\` - Network, timeout, or unexpected client errors with sanitized original error metadata
- \`ConfigurationError\` - Invalid client configuration such as untrusted custom base URLs

## Development Commands

Use Bun for package management and scripts:

- \`bun install\` - Install dependencies
- \`bun run build\` - Build ESM, CJS, and declarations
- \`bun run smoke:cjs\` - Validate CommonJS package exports
- \`bun run smoke:esm\` - Validate ESM package exports
- \`bun run lint\` - Run Biome checks
- \`bun test\` - Run tests
- \`bun run typecheck\` - Run TypeScript without emitting
- \`bun audit --production\` - Audit production dependencies
- \`bun run pack:dry-run\` - Verify npm package contents
- \`bun run docs:check\` - Verify regenerated LLM documentation is committed
- \`bun run verify:ci\` - Run release verification gates
- \`bun run llms:generate\` - Regenerate \`llms.txt\` and \`llms-full.txt\`

## Documentation Sync

\`scripts/generate-llms.ts\` deterministically regenerates this file from a stable template and regenerates \`llms-full.txt\` from the complete current \`src/**/*.ts\` source in sorted order.
`;

const generateLlmsFullTxt = async (files: string[]): Promise<string> => {
  const sections = await Promise.all(
    files.map(async (file) => {
      const normalizedPath = relative('.', file).replaceAll('\\', '/');
      const source = await readFile(file, 'utf8');
      return `## File: ${normalizedPath}\n\n\`\`\`typescript\n${source.trimEnd()}\n\`\`\``;
    }),
  );

  return `# Hevy API TypeScript Client - Full Source Code

> Complete source code for the Hevy API TypeScript client library

${sections.join('\n\n')}\n`;
};

const main = async (): Promise<void> => {
  const [{ version }, sourceFiles] = await Promise.all([readPackage(), findSourceFiles(SOURCE_ROOT)]);

  await Bun.write('llms.txt', generateLlmsTxt(version));
  await Bun.write('llms-full.txt', await generateLlmsFullTxt(sourceFiles));
};

await main();
