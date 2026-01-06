import { Router, type Request, type Response } from 'express';
import { EquipmentService } from '../services';
import { insertEquipmentSchema, insertGymEquipmentSchema } from '../shared/schema';

export class EquipmentController {
    constructor(private readonly equipmentService: EquipmentService) { }

    buildRouter(): Router {
        const router = Router();

        router.get('/', async (_req: Request, res: Response) => {
            try {
                const equipment = await this.equipmentService.getAllEquipment();
                res.json(equipment);
            } catch (error) {
                res.status(500).json({ error: (error as Error).message });
            }
        });

        router.get('/:id', async (req: Request, res: Response) => {
            try {
                const equipment = await this.equipmentService.getEquipment(req.params.id);
                res.json(equipment);
            } catch (error) {
                res.status(404).json({ error: (error as Error).message });
            }
        });

        router.post('/', async (req: Request, res: Response) => {
            try {
                const equipmentData = insertEquipmentSchema.parse(req.body);
                const equipment = await this.equipmentService.createEquipment(equipmentData);
                res.status(201).json(equipment);
            } catch (error) {
                res.status(400).json({ error: (error as Error).message });
            }
        });

        router.patch('/:id', async (req: Request, res: Response) => {
            try {
                await this.equipmentService.updateEquipment(req.params.id, req.body);
                res.json({ message: 'Equipment updated successfully' });
            } catch (error) {
                res.status(400).json({ error: (error as Error).message });
            }
        });

        router.delete('/:id', async (req: Request, res: Response) => {
            try {
                await this.equipmentService.deleteEquipment(req.params.id);
                res.json({ message: 'Equipment deleted successfully' });
            } catch (error) {
                res.status(400).json({ error: (error as Error).message });
            }
        });

        router.post('/gym', async (req: Request, res: Response) => {
            try {
                const gymEquipmentData = insertGymEquipmentSchema.parse(req.body);
                const gymEquipment = await this.equipmentService.addGymEquipment(gymEquipmentData);
                res.status(201).json(gymEquipment);
            } catch (error) {
                res.status(400).json({ error: (error as Error).message });
            }
        });

        router.get('/gym/:gymId', async (req: Request, res: Response) => {
            try {
                const equipment = await this.equipmentService.getGymEquipment(req.params.gymId);
                res.json(equipment);
            } catch (error) {
                res.status(500).json({ error: (error as Error).message });
            }
        });

        router.delete('/gym/:gymId/:equipmentId', async (req: Request, res: Response) => {
            try {
                await this.equipmentService.removeGymEquipment(req.params.gymId, req.params.equipmentId);
                res.json({ message: 'Equipment removed from gym successfully' });
            } catch (error) {
                res.status(400).json({ error: (error as Error).message });
            }
        });

        return router;
    }
}
