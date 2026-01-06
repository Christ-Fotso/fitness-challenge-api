import { storage } from '../storage/storage';
import type { InsertTrainingSession, TrainingSession, InsertSessionExercise, SessionExercise } from '../shared/schema';

export class TrainingService {
    async createTrainingSession(sessionData: InsertTrainingSession): Promise<TrainingSession> {
        return storage.createTrainingSession(sessionData);
    }

    async getUserTrainingSessions(userId: string): Promise<TrainingSession[]> {
        return storage.getUserTrainingSessions(userId);
    }

    async addExerciseToSession(sessionExerciseData: InsertSessionExercise): Promise<SessionExercise> {
        const session = await storage.getUserTrainingSessions(sessionExerciseData.sessionId);
        if (!session) {
            throw new Error('Training session not found');
        }
        return storage.createSessionExercise(sessionExerciseData);
    }

    async getSessionExercises(sessionId: string): Promise<SessionExercise[]> {
        return storage.getSessionExercises(sessionId);
    }
}
