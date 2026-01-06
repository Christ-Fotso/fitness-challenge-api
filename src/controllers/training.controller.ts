import { Router, type Request, type Response } from 'express';
import { TrainingService } from '../services';
import { insertTrainingSessionSchema, insertSessionExerciseSchema } from '../shared/schema';

export class TrainingController {
    constructor(private readonly trainingService: TrainingService) { }

    buildRouter(): Router {
        const router = Router();

        router.post('/sessions', async (req: Request, res: Response) => {
            try {
                const sessionData = insertTrainingSessionSchema.parse(req.body);
                const session = await this.trainingService.createTrainingSession(sessionData);
                res.status(201).json(session);
            } catch (error) {
                res.status(400).json({ error: (error as Error).message });
            }
        });

        router.get('/sessions/user/:userId', async (req: Request, res: Response) => {
            try {
                const sessions = await this.trainingService.getUserTrainingSessions(req.params.userId);
                res.json(sessions);
            } catch (error) {
                res.status(500).json({ error: (error as Error).message });
            }
        });

        router.post('/sessions/:sessionId/exercises', async (req: Request, res: Response) => {
            try {
                const sessionExerciseData = insertSessionExerciseSchema.parse({
                    ...req.body,
                    sessionId: req.params.sessionId,
                });
                const sessionExercise = await this.trainingService.addExerciseToSession(sessionExerciseData);
                res.status(201).json(sessionExercise);
            } catch (error) {
                res.status(400).json({ error: (error as Error).message });
            }
        });

        router.get('/sessions/:sessionId/exercises', async (req: Request, res: Response) => {
            try {
                const exercises = await this.trainingService.getSessionExercises(req.params.sessionId);
                res.json(exercises);
            } catch (error) {
                res.status(500).json({ error: (error as Error).message });
            }
        });

        return router;
    }
}
