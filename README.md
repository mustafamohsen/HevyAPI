# Hevy API TypeScript Client

[![NPM Version](https://img.shields.io/npm/v/hevy-api)](https://www.npmjs.com/package/hevy-api)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A comprehensive TypeScript API client for the [Hevy fitness tracking app](https://www.hevyapp.com/).

> Disclaimer: This is an unofficial community project and is not affiliated with, endorsed by, or supported by Hevy.

## About Hevy

[Hevy](https://www.hevyapp.com/) is the #1 workout tracker app with 10+ million athletes worldwide. It's designed to help you log workouts, build routines, track progress, and stay motivated through community features.

**Key Stats:**
- 10+ million athletes
- 4.9 App Store & 4.9 Google Play (365,000+ ratings)
- Available on iOS, Android, Apple Watch, WearOS, and Web

**What Hevy Offers:**
- **Workout Logging:** Intuitive tracking with routines, rest timers, various set types, supersets, and RPE
- **Progress Tracking:** Advanced charts, personal records, 1RM calculations, monthly reports, muscle analysis, and body measurements
- **Social Features:** Follow athletes, like/comment on workouts, share routines, leaderboards, and discovery feed
- **Exercise Library:** Comprehensive exercise database with custom exercise support

## What You Can Do With This API

This client provides programmatic access to Hevy's core features:

- **Workout Management:** Create, read, update workouts and track workout events
- **Routines:** Build and manage workout routines with folders
- **Exercise Templates:** Access the exercise library and create custom exercises
- **Progress Analysis:** Retrieve exercise history and body measurements to analyze progress over time
- **User Info:** Fetch authenticated user profile details
- **Integration:** Build custom dashboards, analytics tools, or integrate Hevy data into other applications

## Installation

> **Note:** The Hevy API is only available to [Hevy Pro](https://www.hevyapp.com/pro/) subscribers.

```bash
npm install hevy-api
```

The package supports native ESM imports and CommonJS `require`:

```typescript
import Hevy from 'hevy-api';
```

```javascript
const { default: Hevy } = require('hevy-api');
```

## Quick Start

```typescript
import Hevy from 'hevy-api';

const client = new Hevy({
  apiKey: process.env.HEVY_API_KEY!,
});

// Get all workouts
const workouts = await client.workouts.getAll({ page: 1, pageSize: 10 });
console.log(workouts);

// Get a single workout
const workout = await client.workouts.getById('workout-id');

// Create a new workout
const newWorkout = await client.workouts.create({
  workout: {
    title: 'My Workout',
    start_time: '2024-01-01T10:00:00Z',
    end_time: '2024-01-01T11:00:00Z',
    exercises: [],
  },
});
```

## API Reference

### Workouts

- `workouts.getAll(params?)` - Get paginated list of workouts
- `workouts.getById(workoutId)` - Get single workout by ID
- `workouts.count()` - Get total workout count
- `workouts.getEvents(params)` - Get workout events (updates/deletes)
- `workouts.create(workout)` - Create new workout
- `workouts.update(workoutId, workout)` - Update existing workout

### Routines

- `routines.getAll(params?)` - Get paginated list of routines
- `routines.getById(routineId)` - Get single routine by ID
- `routines.create(routine)` - Create new routine
- `routines.update(routineId, routine)` - Update existing routine

### Exercise Templates

- `exerciseTemplates.getAll(params?)` - Get paginated list of exercise templates
- `exerciseTemplates.getById(exerciseTemplateId)` - Get single exercise template
- `exerciseTemplates.create(exercise)` - Create custom exercise template

### Routine Folders

- `routineFolders.getAll(params?)` - Get paginated list of routine folders
- `routineFolders.getById(folderId)` - Get single routine folder
- `routineFolders.create(folder)` - Create new routine folder

### Exercise History

- `exerciseHistory.getByExerciseTemplateId(exerciseTemplateId, params?)` - Get exercise history

### User

- `user.getInfo()` - Get authenticated user info

### Body Measurements

- `bodyMeasurements.getAll(params?)` - Get paginated body measurements
- `bodyMeasurements.create(bodyMeasurement)` - Create a body measurement for a date
- `bodyMeasurements.getByDate(date)` - Get a body measurement by `YYYY-MM-DD` date
- `bodyMeasurements.update(date, bodyMeasurement)` - Update a body measurement by date

## Error Handling

```typescript
import Hevy, {
  AuthenticationError,
  ValidationError,
  NotFoundError,
  RateLimitError,
  NetworkError,
} from 'hevy-api';

try {
  const workout = await client.workouts.getById('invalid-id');
} catch (error) {
  if (error instanceof AuthenticationError) {
    console.error('Invalid API key');
  } else if (error instanceof ValidationError) {
    console.error('Invalid request:', error.fieldErrors);
  } else if (error instanceof NotFoundError) {
    console.error('Resource not found');
  } else if (error instanceof RateLimitError) {
    console.error('Rate limited. Retry after:', error.retryAfter, 'ms');
  } else if (error instanceof NetworkError) {
    console.error('Network error:', error.message);
  }
}
```

## API Key and Security

Get your API key from [Hevy Settings > Developer](https://hevy.com/settings?developer).

Keep Hevy API keys on trusted server-side runtimes only. Do not expose them in browsers, mobile apps, public repositories, client-side bundles, logs, telemetry, or other user-accessible environments.

The client sends API keys only to the official Hevy API origin (`https://api.hevyapp.com`) by default. If you intentionally use a proxy, mock server, localhost, or any other custom `baseURL`, opt in explicitly:

```typescript
const client = new Hevy({
  apiKey: process.env.HEVY_API_KEY!,
  baseURL: 'http://localhost:3000',
  trustBaseURL: true,
});
```

Custom `baseURL` origins must use HTTPS when `trustBaseURL: true` is set. Trusted HTTP custom origins are allowed only for loopback development hosts (`localhost`, `127.0.0.1`, and `::1`). Credential-bearing requests also disable automatic redirects (`maxRedirects: 0`) so the `api-key` header is not forwarded to redirected destinations.

Errors redact configured API key values and common sensitive fields such as authorization headers, tokens, passwords, and secrets before exposing response or network error metadata. Dynamic path segments such as IDs and measurement dates are URL-encoded before requests are sent.

For complete API documentation, visit the [Hevy API Documentation](https://api.hevyapp.com/docs/).

## Documentation for AI/LLM Context

This project includes `llms.txt` and `llms-full.txt` files designed to provide AI assistants and LLMs with comprehensive context about the codebase:

- **llms.txt** - High-level overview, API endpoints, types, error handling, and development workflow
- **llms-full.txt** - Complete source code of all `src/` files for full context

These files are useful for:
- AI coding assistants that need to understand the library structure
- Documentation generation tools
- Code analysis and refactoring with full context

## License

MIT
