import { Router, type Request, type Response } from 'express';
import { AuthService } from '../services';
import { insertUserSchema } from '../shared/schema';

export class AuthController {
    constructor(private readonly authService: AuthService) { }

    buildRouter(): Router {
        const router = Router();

        router.post('/register', async (req: Request, res: Response) => {
            try {
                const userData = insertUserSchema.parse(req.body);
                const result = await this.authService.register(userData);
                res.json(result);
            } catch (error) {
                res.status(400).json({ error: (error as Error).message });
            }
        });

        router.post('/login', async (req: Request, res: Response) => {
            try {
                const { email, password } = req.body;
                const result = await this.authService.login(email, password);
                res.json(result);
            } catch (error) {
                res.status(401).json({ error: (error as Error).message });
            }
        });

        return router;
    }
}
