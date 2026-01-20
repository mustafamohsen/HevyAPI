export type SetType = 'warmup' | 'normal' | 'failure' | 'dropset';
export interface Set {
    index: number;
    type: SetType;
    weight_kg: number | null;
    reps: number | null;
    distance_meters: number | null;
    duration_seconds: number | null;
    rpe: number | null;
    custom_metric: number | null;
}
export interface PostWorkoutsRequestSet {
    type: SetType;
    weight_kg: number | null;
    reps: number | null;
    distance_meters: number | null;
    duration_seconds: number | null;
    custom_metric: number | null;
    rpe?: 6 | 7 | 7.5 | 8 | 8.5 | 9 | 9.5 | 10;
}
export interface RepRange {
    start: number | null;
    end: number | null;
}
export interface PostRoutinesRequestSet {
    type: SetType;
    weight_kg: number | null;
    reps: number | null;
    distance_meters: number | null;
    duration_seconds: number | null;
    custom_metric: number | null;
    rep_range?: RepRange | null;
}
export interface PutRoutinesRequestSet {
    type: SetType;
    weight_kg: number | null;
    reps: number | null;
    distance_meters: number | null;
    duration_seconds: number | null;
    custom_metric: number | null;
    rep_range?: RepRange | null;
}
export interface Exercise {
    index: number;
    title: string;
    notes: string;
    exercise_template_id: string;
    supersets_id: number | null;
    sets: Set[];
}
export interface PostWorkoutsRequestExercise {
    exercise_template_id: string;
    superset_id: number | null;
    notes?: string | null;
    sets: PostWorkoutsRequestSet[];
}
export interface PostRoutinesRequestExercise {
    exercise_template_id: string;
    superset_id?: number | null;
    rest_seconds?: number | null;
    notes?: string | null;
    sets: PostRoutinesRequestSet[];
}
export interface PutRoutinesRequestExercise {
    exercise_template_id: string;
    superset_id?: number | null;
    rest_seconds?: number | null;
    notes?: string | null;
    sets: PutRoutinesRequestSet[];
}
export interface Workout {
    id: string;
    title: string;
    routine_id?: string;
    description?: string;
    start_time: string;
    end_time: string;
    updated_at: string;
    created_at: string;
    exercises: Exercise[];
    is_private?: boolean;
}
export interface WorkoutSummary {
    workout_count: number;
}
export interface PostWorkoutsRequestBody {
    workout: {
        title: string;
        description?: string | null;
        start_time: string;
        end_time: string;
        is_private?: boolean;
        exercises: PostWorkoutsRequestExercise[];
    };
}
export interface PaginatedWorkouts {
    page: number;
    page_count: number;
    workouts: Workout[];
}
export interface UpdatedWorkout {
    type: 'updated';
    workout: Workout;
}
export interface DeletedWorkout {
    type: 'deleted';
    id: string;
    deleted_at: string;
}
export type WorkoutEvent = UpdatedWorkout | DeletedWorkout;
export interface PaginatedWorkoutEvents {
    page: number;
    page_count: number;
    events: WorkoutEvent[];
}
export interface Routine {
    id: string;
    title: string;
    folder_id?: number | null;
    updated_at: string;
    created_at: string;
    exercises: {
        index: number;
        title: string;
        rest_seconds?: string;
        notes?: string;
        exercise_template_id: string;
        supersets_id?: number | null;
        sets: {
            index: number;
            type: SetType;
            weight_kg?: number | null;
            reps?: number | null;
            rep_range?: RepRange | null;
            distance_meters?: number | null;
            duration_seconds?: number | null;
            rpe?: number | null;
            custom_metric?: number | null;
        }[];
    }[];
}
export interface PostRoutinesRequestBody {
    routine: {
        title: string;
        folder_id?: number | null;
        notes?: string;
        exercises: PostRoutinesRequestExercise[];
    };
}
export interface PutRoutinesRequestBody {
    routine: {
        title: string;
        notes?: string | null;
        exercises: PutRoutinesRequestExercise[];
    };
}
export interface PaginatedRoutines {
    page: number;
    page_count: number;
    routines: Routine[];
}
export type CustomExerciseType = 'weight_reps' | 'reps_only' | 'bodyweight_reps' | 'bodyweight_assisted_reps' | 'duration' | 'weight_duration' | 'distance_duration' | 'short_distance_weight';
export type MuscleGroup = 'abdominals' | 'shoulders' | 'biceps' | 'triceps' | 'forearms' | 'quadriceps' | 'hamstrings' | 'calves' | 'glutes' | 'abductors' | 'adductors' | 'lats' | 'upper_back' | 'traps' | 'lower_back' | 'chest' | 'cardio' | 'neck' | 'full_body' | 'other';
export type EquipmentCategory = 'none' | 'barbell' | 'dumbbell' | 'kettlebell' | 'machine' | 'plate' | 'resistance_band' | 'suspension' | 'other';
export interface ExerciseTemplate {
    id: string;
    title: string;
    type: CustomExerciseType;
    primary_muscle_group: MuscleGroup;
    secondary_muscle_groups: MuscleGroup[];
    is_custom: boolean;
}
export interface CreateCustomExerciseRequestBody {
    exercise: {
        title: string;
        exercise_type: CustomExerciseType;
        equipment_category: EquipmentCategory;
        muscle_group: MuscleGroup;
        other_muscles?: MuscleGroup[];
    };
}
export interface PaginatedExerciseTemplates {
    page: number;
    page_count: number;
    exercise_templates: ExerciseTemplate[];
}
export interface ExerciseHistoryEntry {
    workout_id: string;
    workout_title: string;
    workout_start_time: string;
    workout_end_time: string;
    exercise_template_id: string;
    weight_kg: number | null;
    reps: number | null;
    distance_meters: number | null;
    duration_seconds: number | null;
    rpe: number | null;
    custom_metric: number | null;
    set_type: SetType;
}
export interface ExerciseHistoryResponse {
    exercise_history: ExerciseHistoryEntry[];
}
export interface RoutineFolder {
    id: number;
    index: number;
    title: string;
    updated_at: string;
    created_at: string;
}
export interface PostRoutineFolderRequestBody {
    routine_folder: {
        title: string;
    };
}
export interface PaginatedRoutineFolders {
    page: number;
    page_count: number;
    routine_folders: RoutineFolder[];
}
export interface PaginationParams {
    page?: number;
    pageSize?: number;
}
export interface ApiErrorResponse {
    error: string;
}
//# sourceMappingURL=index.d.ts.map