import { storage } from '../storage/storage';
import type { InsertEquipment, Equipment, InsertGymEquipment, GymEquipment } from '../shared/schema';

export class EquipmentService {
    async getAllEquipment(): Promise<Equipment[]> {
        return storage.getAllEquipment();
    }

    async getEquipment(id: string): Promise<Equipment> {
        const equipment = await storage.getEquipment(id);
        if (!equipment) {
            throw new Error('Equipment not found');
        }
        return equipment;
    }

    async createEquipment(equipmentData: InsertEquipment): Promise<Equipment> {
        return storage.createEquipment(equipmentData);
    }

    async updateEquipment(id: string, equipmentData: Partial<InsertEquipment>): Promise<void> {
        const equipment = await storage.getEquipment(id);
        if (!equipment) {
            throw new Error('Equipment not found');
        }
        await storage.updateEquipment(id, equipmentData);
    }

    async deleteEquipment(id: string): Promise<void> {
        const equipment = await storage.getEquipment(id);
        if (!equipment) {
            throw new Error('Equipment not found');
        }
        await storage.deleteEquipment(id);
    }

    async addGymEquipment(gymEquipmentData: InsertGymEquipment): Promise<GymEquipment> {
        const gym = await storage.getGym(gymEquipmentData.gymId);
        if (!gym) {
            throw new Error('Gym not found');
        }
        const equipment = await storage.getEquipment(gymEquipmentData.equipmentId);
        if (!equipment) {
            throw new Error('Equipment not found');
        }
        return storage.addGymEquipment(gymEquipmentData);
    }

    async getGymEquipment(gymId: string): Promise<Equipment[]> {
        return storage.getGymEquipment(gymId);
    }

    async removeGymEquipment(gymId: string, equipmentId: string): Promise<void> {
        await storage.removeGymEquipment(gymId, equipmentId);
    }
}
