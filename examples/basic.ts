// Example usage of Hevy API TypeScript Client

import Hevy from '../src/index';

async function main() {
  const client = new Hevy({
    apiKey: process.env.HEVY_API_KEY!,
  });

  try {
    // Get all workouts with pagination
    console.log('Fetching workouts...');
    const workouts = await client.workouts.getAll({ page: 1, pageSize: 5 });
    console.log('Page:', workouts.page, 'of', workouts.page_count);
    console.log('Workouts:', workouts.workouts.length);

    // Get workout count
    const count = await client.workouts.count();
    console.log('Total workouts:', count.workout_count);

    // Get first workout details if available
    if (workouts.workouts.length > 0) {
      const workout = await client.workouts.getById(workouts.workouts[0].id);
      console.log('First workout:', workout.title);
    }

    // Get routines
    console.log('\nFetching routines...');
    const routines = await client.routines.getAll({ page: 1, pageSize: 5 });
    console.log('Routines:', routines.routines.length);

    // Get exercise templates
    console.log('\nFetching exercise templates...');
    const templates = await client.exerciseTemplates.getAll({ page: 1, pageSize: 5 });
    console.log('Exercise templates:', templates.exercise_templates.length);

    // Get routine folders
    console.log('\nFetching routine folders...');
    const folders = await client.routineFolders.getAll({ page: 1, pageSize: 5 });
    console.log('Routine folders:', folders.routine_folders.length);

  } catch (error) {
    console.error('Error:', error);
  }
}

// Example: Creating a workout
async function createWorkoutExample() {
  const client = new Hevy({
    apiKey: process.env.HEVY_API_KEY!,
  });

  const workout = await client.workouts.create({
    workout: {
      title: 'Morning Workout 💪',
      description: 'Quick morning session',
      start_time: new Date().toISOString(),
      end_time: new Date(Date.now() + 3600000).toISOString(), // 1 hour later
      exercises: [
        {
          exercise_template_id: 'D04AC939',
          superset_id: null,
          sets: [
            {
              type: 'normal',
              weight_kg: 100,
              reps: 10,
              distance_meters: null,
              duration_seconds: null,
              custom_metric: null,
            },
          ],
        },
      ],
    },
  });

  console.log('Created workout:', workout.id);
}

// Example: Error handling
async function errorHandlingExample() {
  const client = new Hevy({
    apiKey: 'invalid-key',
  });

  try {
    await client.workouts.getAll();
  } catch (error) {
    if (error.name === 'AuthenticationError') {
      console.log('Please check your API key');
    } else if (error.name === 'NetworkError') {
      console.log('Network issue - please check your connection');
    }
  }
}

main();
