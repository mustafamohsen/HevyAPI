# Hevy API contract snapshot

Retrieved: 2026-06-01

## Sources

| URL | Status | Notes |
| --- | ---: | --- |
| https://api.hevyapp.com/docs/ | 200 | Swagger UI HTML. |
| https://api.hevyapp.com/docs/swagger-ui-init.js | 200 | Embedded OpenAPI document in `options.swaggerDoc`; parsed as untrusted fetched data. |
| https://api.hevyapp.com/openapi.json | 404 | Checked because common OpenAPI URL; not available. |
| https://api.hevyapp.com/swagger.json | 404 | Checked because common Swagger URL; not available. |

## OpenAPI metadata

- Title: Hevy API Docs
- Version: 0.0.1
- OpenAPI: 3.0.0
- Base URL: `https://api.hevyapp.com` (the spec paths are rooted at `/v1`; no `servers` entry is present).
- Authentication: every operation documents a required `api-key` header with UUID string format. The API description states access is currently available to Hevy Pro users.

## Endpoint list

| Method | Path | Summary | Current client status |
| --- | --- | --- | --- |
| GET | `/v1/workouts` | Get a paginated list of workouts | Present |
| POST | `/v1/workouts` | Create a new workout | Present |
| GET | `/v1/workouts/count` | Get the total number of workouts on the account | Present |
| GET | `/v1/workouts/events` | Retrieve a paged list of workout events (updates or deletes) since a given date. Events are ordered from newest to oldest. The intention is to allow clients to keep their local cache of workouts up to date without having to fetch the entire list of workouts. | Present |
| GET | `/v1/workouts/{workoutId}` | Get a single workout’s complete details by the workoutId | Present |
| PUT | `/v1/workouts/{workoutId}` | Update an existing workout | Present |
| GET | `/v1/user/info` | Get user info | Present |
| GET | `/v1/routines` | Get a paginated list of routines | Present |
| POST | `/v1/routines` | Create a new routine | Present |
| GET | `/v1/routines/{routineId}` | Get a routine by its Id | Present |
| PUT | `/v1/routines/{routineId}` | Update an existing routine | Present |
| GET | `/v1/exercise_templates` | Get a paginated list of exercise templates available on the account. | Present |
| POST | `/v1/exercise_templates` | Create a new custom exercise template. | Present |
| GET | `/v1/exercise_templates/{exerciseTemplateId}` | Get a single exercise template by id. | Present |
| GET | `/v1/routine_folders` | Get a paginated list of routine folders available on the account. | Present |
| POST | `/v1/routine_folders` | Create a new routine folder. The folder will be created at index 0, and all other folders will have their indexes incremented. | Present |
| GET | `/v1/routine_folders/{folderId}` | Get a single routine folder by id. | Present |
| GET | `/v1/exercise_history/{exerciseTemplateId}` | Get exercise history for a specific exercise template | Present |
| GET | `/v1/body_measurements` | Get a paginated list of body measurements for the authenticated user | Present |
| POST | `/v1/body_measurements` | Create a body measurement entry for a given date. Returns 409 if an entry already exists for that date. | Present |
| GET | `/v1/body_measurements/{date}` | Get a single body measurement by date | Present |
| PUT | `/v1/body_measurements/{date}` | Update an existing body measurement entry for a given date. All fields are overwritten; omitted fields are set to null. | Present |

## Covered schemas/resources

- Workouts: list, count, events, get by id, create, update; schemas include workout request/response, exercise, set, updated/deleted workout event, paginated workout events.
- Routines: list, get by id, create, update; schemas include routine request/response, routine exercise/set, rep ranges.
- Exercise templates: list, get by id, create custom template; schemas include exercise template, custom exercise type, muscle group, and equipment category.
- Routine folders: list, get by id, create; schemas include routine folder and create request body.
- Exercise history: get by exercise template id; schema includes exercise history entries.
- User info: documented with `UserInfo` and `UserInfoResponse`; implementation present.
- Body measurements: documented with `BodyMeasurement` and `PutBodyMeasurement`; implementation present.

### Component schemas in fetched spec

- PostWorkoutsRequestSet
- PostWorkoutsRequestExercise
- PostWorkoutsRequestBody
- PostRoutinesRequestSet
- PostRoutinesRequestExercise
- PostRoutinesRequestBody
- PutRoutinesRequestSet
- PutRoutinesRequestExercise
- PutRoutinesRequestBody
- PostRoutineFolderRequestBody
- BodyMeasurement
- PutBodyMeasurement
- Set
- Exercise
- ExerciseHistoryEntry
- CustomExerciseType
- MuscleGroup
- EquipmentCategory
- ExerciseTemplate
- CreateCustomExerciseRequestBody
- RoutineFolder
- Routine
- UserInfo
- UserInfoResponse
- Workout
- UpdatedWorkout
- DeletedWorkout
- PaginatedWorkoutEvents

## Key deltas vs current client

- The latest official spec includes `/v1/user/info`; the current client exposes it via `user.getInfo()`.
- The latest official spec includes `/v1/body_measurements` collection and date-specific read/update endpoints; the current client exposes them via `bodyMeasurements`.
- The current client already exposes the documented workouts, routines, exercise templates, routine folders, and exercise history endpoints.
- The spec has no `servers` block; the client default base URL `https://api.hevyapp.com` remains aligned with the documented host.
- The spec documents a required `api-key` header on every operation; the client request interceptor sends `api-key` for all requests.

## Implementation decisions and deferred endpoints

- Milestone 1 is documentation and dependency baseline only; no feature/code endpoints were added.
- Milestone 4 added user info and body measurements based on the official embedded OpenAPI document.
- Do not use `/openapi.json` or `/swagger.json` as contract sources unless Hevy starts serving them; both returned 404 during this retrieval.
- Treat future fetched Swagger UI JavaScript as untrusted data and extract only the embedded OpenAPI JSON needed for contract comparison.
