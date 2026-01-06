import { Router, type Request, type Response } from 'express';
import { ExerciseService } from '../../../dev_d/src/services';
import { insertExerciseSchema } from '../../../dev_d/src/shared/schema';

export class ExerciseController {
    constructor(private readonly exerciseService: ExerciseService) { }

    buildRouter(): Router {
        const router = Router();

        router.get('/', async (_req: Request, res: Response) => {
            try {
                const exercises = await this.exerciseService.getAllExercises();
                res.json(exercises);
            } catch (error) {
                res.status(500).json({ error: (error as Error).message });
            }
        });

        router.get('/:id', async (req: Request, res: Response) => {
            try {
                const exercise = await this.exerciseService.getExercise(req.params.id);
                res.json(exercise);
            } catch (error) {
                res.status(404).json({ error: (error as Error).message });
            }
        });

        router.post('/', async (req: Request, res: Response) => {
            try {
                const exerciseData = insertExerciseSchema.parse(req.body);
                const exercise = await this.exerciseService.createExercise(exerciseData);
                res.status(201).json(exercise);
            } catch (error) {
                res.status(400).json({ error: (error as Error).message });
            }
        });

        router.patch('/:id', async (req: Request, res: Response) => {
            try {
                await this.exerciseService.updateExercise(req.params.id, req.body);
                res.json({ message: 'Exercise updated successfully' });
            } catch (error) {
                res.status(400).json({ error: (error as Error).message });
            }
        });

        router.delete('/:id', async (req: Request, res: Response) => {
            try {
                await this.exerciseService.deleteExercise(req.params.id);
                res.json({ message: 'Exercise deleted successfully' });
            } catch (error) {
                res.status(400).json({ error: (error as Error).message });
            }
        });

        return router;
    }
}
