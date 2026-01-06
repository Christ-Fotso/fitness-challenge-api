import { storage } from '../storage/storage';
import type { InsertGym, Gym } from '../shared/schema';

export class GymService {
    async getAllGyms(): Promise<Gym[]> {
        return storage.getAllGyms();
    }

    async getGym(id: string): Promise<Gym> {
        const gym = await storage.getGym(id);
        if (!gym) {
            throw new Error('Gym not found');
        }
        return gym;
    }

    async getGymsByOwner(ownerId: string): Promise<Gym[]> {
        return storage.getGymsByOwner(ownerId);
    }

    async getGymsByStatus(status: 'pending' | 'approved' | 'rejected'): Promise<Gym[]> {
        return storage.getGymsByStatus(status);
    }

    async createGym(gymData: InsertGym): Promise<Gym> {
        return storage.createGym(gymData);
    }

    async updateGym(id: string, gymData: Partial<InsertGym>): Promise<void> {
        const gym = await storage.getGym(id);
        if (!gym) {
            throw new Error('Gym not found');
        }
        await storage.updateGym(id, gymData);
    }

    async approveGym(id: string): Promise<void> {
        const gym = await storage.getGym(id);
        if (!gym) {
            throw new Error('Gym not found');
        }
        await storage.updateGymStatus(id, 'approved');
    }

    async rejectGym(id: string): Promise<void> {
        const gym = await storage.getGym(id);
        if (!gym) {
            throw new Error('Gym not found');
        }
        await storage.updateGymStatus(id, 'rejected');
    }

    async deleteGym(id: string): Promise<void> {
        const gym = await storage.getGym(id);
        if (!gym) {
            throw new Error('Gym not found');
        }
        await storage.deleteGym(id);
    }
}
