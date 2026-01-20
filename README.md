# Hevy API TypeScript Client

A comprehensive TypeScript API client for the [Hevy fitness tracking app](https://api.hevyapp.com/docs/).

## Installation

```bash
npm install hevy-api
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

## API Key

Get your API key from [Hevy Settings](https://hevy.com/settings?developer). The API is only available to Hevy Pro users.

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
