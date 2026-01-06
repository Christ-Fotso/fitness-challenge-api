import { sql } from 'drizzle-orm';
import { pgTable, text, varchar, integer, timestamp, boolean, pgEnum, jsonb } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

export const roleEnum = pgEnum('role', ['super_admin', 'gym_owner', 'client']);
export const gymStatusEnum = pgEnum('gym_status', ['pending', 'approved', 'rejected']);
export const difficultyEnum = pgEnum('difficulty', ['easy', 'medium', 'hard']);
export const challengeStatusEnum = pgEnum('challenge_status', ['draft', 'active', 'completed', 'cancelled']);

export const users = pgTable('users', {
    id: varchar('id').primaryKey().default(sql`gen_random_uuid()`),
    email: text('email').notNull().unique(),
    password: text('password').notNull(),
    firstName: text('first_name').notNull(),
    lastName: text('last_name').notNull(),
    role: roleEnum('role').notNull().default('client'),
    gymId: varchar('gym_id'),
    isActive: boolean('is_active').notNull().default(true),
    createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const gyms = pgTable('gyms', {
    id: varchar('id').primaryKey().default(sql`gen_random_uuid()`),
    ownerId: varchar('owner_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    address: text('address').notNull(),
    phone: text('phone'),
    description: text('description'),
    capacity: integer('capacity').notNull(),
    imageUrl: text('image_url'),
    status: gymStatusEnum('status').notNull().default('pending'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const equipment = pgTable('equipment', {
    id: varchar('id').primaryKey().default(sql`gen_random_uuid()`),
    name: text('name').notNull(),
    description: text('description'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const gymEquipment = pgTable('gym_equipment', {
    id: varchar('id').primaryKey().default(sql`gen_random_uuid()`),
    gymId: varchar('gym_id').notNull().references(() => gyms.id, { onDelete: 'cascade' }),
    equipmentId: varchar('equipment_id').notNull().references(() => equipment.id, { onDelete: 'cascade' }),
    quantity: integer('quantity').notNull().default(1),
    createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const exercises = pgTable('exercises', {
    id: varchar('id').primaryKey().default(sql`gen_random_uuid()`),
    name: text('name').notNull(),
    description: text('description').notNull(),
    targetMuscles: text('target_muscles').array().notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const challenges = pgTable('challenges', {
    id: varchar('id').primaryKey().default(sql`gen_random_uuid()`),
    creatorId: varchar('creator_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    gymId: varchar('gym_id').references(() => gyms.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    description: text('description').notNull(),
    difficulty: difficultyEnum('difficulty').notNull(),
    durationDays: integer('duration_days').notNull(),
    objectives: jsonb('objectives').notNull(),
    exerciseIds: text('exercise_ids').array().notNull().default(sql`ARRAY[]::text[]`),
    status: challengeStatusEnum('status').notNull().default('draft'),
    imageUrl: text('image_url'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    startDate: timestamp('start_date'),
});

export const challengeParticipants = pgTable('challenge_participants', {
    id: varchar('id').primaryKey().default(sql`gen_random_uuid()`),
    challengeId: varchar('challenge_id').notNull().references(() => challenges.id, { onDelete: 'cascade' }),
    userId: varchar('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    joinedAt: timestamp('joined_at').notNull().defaultNow(),
    completedAt: timestamp('completed_at'),
    progress: integer('progress').notNull().default(0),
});

export const badges = pgTable('badges', {
    id: varchar('id').primaryKey().default(sql`gen_random_uuid()`),
    name: text('name').notNull(),
    description: text('description').notNull(),
    icon: text('icon').notNull(),
    rules: jsonb('rules').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const userBadges = pgTable('user_badges', {
    id: varchar('id').primaryKey().default(sql`gen_random_uuid()`),
    userId: varchar('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    badgeId: varchar('badge_id').notNull().references(() => badges.id, { onDelete: 'cascade' }),
    earnedAt: timestamp('earned_at').notNull().defaultNow(),
});

export const trainingSessions = pgTable('training_sessions', {
    id: varchar('id').primaryKey().default(sql`gen_random_uuid()`),
    userId: varchar('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    challengeId: varchar('challenge_id').references(() => challenges.id, { onDelete: 'set null' }),
    caloriesBurned: integer('calories_burned'),
    durationMinutes: integer('duration_minutes').notNull(),
    notes: text('notes'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const sessionExercises = pgTable('session_exercises', {
    id: varchar('id').primaryKey().default(sql`gen_random_uuid()`),
    sessionId: varchar('session_id').notNull().references(() => trainingSessions.id, { onDelete: 'cascade' }),
    exerciseId: varchar('exercise_id').notNull().references(() => exercises.id, { onDelete: 'cascade' }),
    repetitions: integer('repetitions'),
    restTimeSeconds: integer('rest_time_seconds'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const userPoints = pgTable('user_points', {
    id: varchar('id').primaryKey().default(sql`gen_random_uuid()`),
    userId: varchar('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }).unique(),
    totalPoints: integer('total_points').notNull().default(0),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
    id: true,
    createdAt: true,
}).extend({
    email: z.string().email(),
    password: z.string().min(6),
});

export const insertGymSchema = createInsertSchema(gyms).omit({
    id: true,
    createdAt: true,
    status: true,
});

export const insertExerciseSchema = createInsertSchema(exercises).omit({
    id: true,
    createdAt: true,
});

export const insertChallengeSchema = createInsertSchema(challenges).omit({
    id: true,
    createdAt: true,
    status: true,
});

export const insertBadgeSchema = createInsertSchema(badges).omit({
    id: true,
    createdAt: true,
});

export const insertTrainingSessionSchema = createInsertSchema(trainingSessions).omit({
    id: true,
    createdAt: true,
});

export const insertEquipmentSchema = createInsertSchema(equipment).omit({
    id: true,
    createdAt: true,
});

export const insertGymEquipmentSchema = createInsertSchema(gymEquipment).omit({
    id: true,
    createdAt: true,
});

export const insertSessionExerciseSchema = createInsertSchema(sessionExercises).omit({
    id: true,
    createdAt: true,
});

export const insertChallengeParticipantSchema = createInsertSchema(challengeParticipants).omit({
    id: true,
    joinedAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertGym = z.infer<typeof insertGymSchema>;
export type Gym = typeof gyms.$inferSelect;
export type InsertExercise = z.infer<typeof insertExerciseSchema>;
export type Exercise = typeof exercises.$inferSelect;
export type InsertChallenge = z.infer<typeof insertChallengeSchema>;
export type Challenge = typeof challenges.$inferSelect;
export type InsertChallengeParticipant = z.infer<typeof insertChallengeParticipantSchema>;
export type ChallengeParticipant = typeof challengeParticipants.$inferSelect;
export type InsertBadge = z.infer<typeof insertBadgeSchema>;
export type Badge = typeof badges.$inferSelect;
export type UserBadge = typeof userBadges.$inferSelect;
export type InsertTrainingSession = z.infer<typeof insertTrainingSessionSchema>;
export type TrainingSession = typeof trainingSessions.$inferSelect;
export type InsertEquipment = z.infer<typeof insertEquipmentSchema>;
export type Equipment = typeof equipment.$inferSelect;
export type InsertGymEquipment = z.infer<typeof insertGymEquipmentSchema>;
export type GymEquipment = typeof gymEquipment.$inferSelect;
export type InsertSessionExercise = z.infer<typeof insertSessionExerciseSchema>;
export type SessionExercise = typeof sessionExercises.$inferSelect;
export type UserPoints = typeof userPoints.$inferSelect;
