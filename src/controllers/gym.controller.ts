import { Router, type Request, type Response } from 'express';
import { GymService } from '../services';
import { insertGymSchema } from '../shared/schema';

export class GymController {
    constructor(private readonly gymService: GymService) { }

    buildRouter(): Router {
        const router = Router();

        router.get('/', async (_req: Request, res: Response) => {
            try {
                const gyms = await this.gymService.getAllGyms();
                res.json(gyms);
            } catch (error) {
                res.status(500).json({ error: (error as Error).message });
            }
        });

        router.get('/:id', async (req: Request, res: Response) => {
            try {
                const gym = await this.gymService.getGym(req.params.id);
                res.json(gym);
            } catch (error) {
                res.status(404).json({ error: (error as Error).message });
            }
        });

        router.get('/owner/:ownerId', async (req: Request, res: Response) => {
            try {
                const gyms = await this.gymService.getGymsByOwner(req.params.ownerId);
                res.json(gyms);
            } catch (error) {
                res.status(500).json({ error: (error as Error).message });
            }
        });

        router.get('/status/:status', async (req: Request, res: Response) => {
            try {
                const status = req.params.status as 'pending' | 'approved' | 'rejected';
                const gyms = await this.gymService.getGymsByStatus(status);
                res.json(gyms);
            } catch (error) {
                res.status(500).json({ error: (error as Error).message });
            }
        });

        router.post('/', async (req: Request, res: Response) => {
            try {
                const gymData = insertGymSchema.parse(req.body);
                const gym = await this.gymService.createGym(gymData);
                res.status(201).json(gym);
            } catch (error) {
                res.status(400).json({ error: (error as Error).message });
            }
        });

        router.patch('/:id', async (req: Request, res: Response) => {
            try {
                await this.gymService.updateGym(req.params.id, req.body);
                res.json({ message: 'Gym updated successfully' });
            } catch (error) {
                res.status(400).json({ error: (error as Error).message });
            }
        });

        router.patch('/:id/approve', async (req: Request, res: Response) => {
            try {
                await this.gymService.approveGym(req.params.id);
                res.json({ message: 'Gym approved successfully' });
            } catch (error) {
                res.status(400).json({ error: (error as Error).message });
            }
        });

        router.patch('/:id/reject', async (req: Request, res: Response) => {
            try {
                await this.gymService.rejectGym(req.params.id);
                res.json({ message: 'Gym rejected successfully' });
            } catch (error) {
                res.status(400).json({ error: (error as Error).message });
            }
        });

        router.delete('/:id', async (req: Request, res: Response) => {
            try {
                await this.gymService.deleteGym(req.params.id);
                res.json({ message: 'Gym deleted successfully' });
            } catch (error) {
                res.status(400).json({ error: (error as Error).message });
            }
        });

        return router;
    }
}
