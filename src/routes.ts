import type { Express } from 'express';
import {
    AuthController,
    GymController,
    ExerciseController,
    ChallengeController,
    BadgeController,
    UserController,
    TrainingController,
    EquipmentController
} from './controllers';
import {
    AuthService,
    GymService,
    ExerciseService,
    ChallengeService,
    BadgeService,
    UserService,
    TrainingService,
    EquipmentService
} from './services';

export function registerRoutes(app: Express): void {
    const authService = new AuthService();
    const gymService = new GymService();
    const exerciseService = new ExerciseService();
    const challengeService = new ChallengeService();
    const badgeService = new BadgeService();
    const userService = new UserService();
    const trainingService = new TrainingService();
    const equipmentService = new EquipmentService();

    const authController = new AuthController(authService);
    const gymController = new GymController(gymService);
    const exerciseController = new ExerciseController(exerciseService);
    const challengeController = new ChallengeController(challengeService);
    const badgeController = new BadgeController(badgeService);
    const userController = new UserController(userService);
    const trainingController = new TrainingController(trainingService);
    const equipmentController = new EquipmentController(equipmentService);

    app.use('/api/auth', authController.buildRouter());
    app.use('/api/gyms', gymController.buildRouter());
    app.use('/api/exercises', exerciseController.buildRouter());
    app.use('/api/challenges', challengeController.buildRouter());
    app.use('/api/badges', badgeController.buildRouter());
    app.use('/api/users', userController.buildRouter());
    app.use('/api/training', trainingController.buildRouter());
    app.use('/api/equipment', equipmentController.buildRouter());
}
