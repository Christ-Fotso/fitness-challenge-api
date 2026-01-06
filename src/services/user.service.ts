import { storage } from '../storage/storage';
import type { User } from '../shared/schema';

export class UserService {
    async getAllUsers(): Promise<User[]> {
        return storage.getAllUsers();
    }

    async getUser(id: string): Promise<User> {
        const user = await storage.getUser(id);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }

    async updateUserStatus(id: string, isActive: boolean): Promise<void> {
        const user = await storage.getUser(id);
        if (!user) {
            throw new Error('User not found');
        }
        await storage.updateUserStatus(id, isActive);
    }

    async deleteUser(id: string): Promise<void> {
        const user = await storage.getUser(id);
        if (!user) {
            throw new Error('User not found');
        }
        await storage.deleteUser(id);
    }

    async getUserPoints(userId: string): Promise<number> {
        return storage.getUserPoints(userId);
    }

    async getLeaderboard(limit: number = 10): Promise<Array<{ userId: string; totalPoints: number; rank: number }>> {
        return storage.getLeaderboard(limit);
    }
}
