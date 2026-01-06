import { Router, type Request, type Response } from 'express';
import { UserService } from '../services';

export class UserController {
    constructor(private readonly userService: UserService) { }

    buildRouter(): Router {
        const router = Router();

        router.get('/', async (_req: Request, res: Response) => {
            try {
                const users = await this.userService.getAllUsers();
                const usersWithoutPasswords = users.map(({ password, ...user }) => user);
                res.json(usersWithoutPasswords);
            } catch (error) {
                res.status(500).json({ error: (error as Error).message });
            }
        });

        router.get('/:id', async (req: Request, res: Response) => {
            try {
                const user = await this.userService.getUser(req.params.id);
                const { password, ...userWithoutPassword } = user;
                res.json(userWithoutPassword);
            } catch (error) {
                res.status(404).json({ error: (error as Error).message });
            }
        });

        router.patch('/:id/status', async (req: Request, res: Response) => {
            try {
                const { isActive } = req.body;
                await this.userService.updateUserStatus(req.params.id, isActive);
                res.json({ message: 'User status updated successfully' });
            } catch (error) {
                res.status(400).json({ error: (error as Error).message });
            }
        });

        router.delete('/:id', async (req: Request, res: Response) => {
            try {
                await this.userService.deleteUser(req.params.id);
                res.json({ message: 'User deleted successfully' });
            } catch (error) {
                res.status(400).json({ error: (error as Error).message });
            }
        });

        router.get('/:id/points', async (req: Request, res: Response) => {
            try {
                const points = await this.userService.getUserPoints(req.params.id);
                res.json({ points });
            } catch (error) {
                res.status(500).json({ error: (error as Error).message });
            }
        });

        router.get('/leaderboard/top', async (req: Request, res: Response) => {
            try {
                const limit = parseInt(req.query.limit as string) || 10;
                const leaderboard = await this.userService.getLeaderboard(limit);
                res.json(leaderboard);
            } catch (error) {
                res.status(500).json({ error: (error as Error).message });
            }
        });

        return router;
    }
}
