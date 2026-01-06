import { storage } from '../storage/storage';
import type { InsertChallenge, Challenge } from '../shared/schema';

export class ChallengeService {
    async getAllChallenges(): Promise<Challenge[]> {
        return storage.getAllChallenges();
    }

    async getChallenge(id: string): Promise<Challenge> {
        const challenge = await storage.getChallenge(id);
        if (!challenge) {
            throw new Error('Challenge not found');
        }
        return challenge;
    }

    async getChallengesByCreator(creatorId: string): Promise<Challenge[]> {
        return storage.getChallengesByCreator(creatorId);
    }

    async getChallengesByGym(gymId: string): Promise<Challenge[]> {
        return storage.getChallengesByGym(gymId);
    }

    async getChallengesByStatus(status: 'draft' | 'active' | 'completed' | 'cancelled'): Promise<Challenge[]> {
        return storage.getChallengesByStatus(status);
    }

    async createChallenge(challengeData: InsertChallenge): Promise<Challenge> {
        if (challengeData.gymId) {
            const gym = await storage.getGym(challengeData.gymId);
            if (!gym) {
                throw new Error('Gym not found');
            }
        }
        return storage.createChallenge(challengeData);
    }

    async updateChallenge(id: string, challengeData: Partial<InsertChallenge>): Promise<void> {
        const challenge = await storage.getChallenge(id);
        if (!challenge) {
            throw new Error('Challenge not found');
        }
        await storage.updateChallenge(id, challengeData);
    }

    async updateChallengeStatus(id: string, status: 'draft' | 'active' | 'completed' | 'cancelled'): Promise<void> {
        const challenge = await storage.getChallenge(id);
        if (!challenge) {
            throw new Error('Challenge not found');
        }
        await storage.updateChallengeStatus(id, status);
    }

    async deleteChallenge(id: string): Promise<void> {
        const challenge = await storage.getChallenge(id);
        if (!challenge) {
            throw new Error('Challenge not found');
        }
        await storage.deleteChallenge(id);
    }

    async joinChallenge(challengeId: string, userId: string): Promise<void> {
        const challenge = await storage.getChallenge(challengeId);
        if (!challenge) {
            throw new Error('Challenge not found');
        }
        await storage.joinChallenge(challengeId, userId);
    }

    async getChallengeParticipants(challengeId: string): Promise<number> {
        return storage.getChallengeParticipants(challengeId);
    }

    async getUserChallenges(userId: string): Promise<Challenge[]> {
        return storage.getUserChallenges(userId);
    }
}
