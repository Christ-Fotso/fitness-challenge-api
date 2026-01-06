import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { storage } from '../storage/storage';
import type { InsertUser, User } from '../shared/schema';

export interface AuthTokens {
    accessToken: string;
    user: Omit<User, 'password'>;
}

export class AuthService {
    private readonly jwtSecret: string;

    constructor() {
        this.jwtSecret = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
    }

    async register(userData: InsertUser): Promise<AuthTokens> {
        const existingUser = await storage.getUserByEmail(userData.email);
        if (existingUser) {
            throw new Error('User already exists');
        }

        if (userData.role === 'client') {
            if (!userData.gymId) {
                throw new Error('Gym selection is required for clients');
            }

            const gym = await storage.getGym(userData.gymId);
            if (!gym) {
                throw new Error('Selected gym does not exist');
            }

            if (gym.status !== 'approved') {
                throw new Error('Selected gym is not approved');
            }
        }

        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const user = await storage.createUser({
            ...userData,
            password: hashedPassword,
        });

        const { password, ...userWithoutPassword } = user;
        const accessToken = this.generateToken(user.id, user.role);

        return {
            accessToken,
            user: userWithoutPassword,
        };
    }

    async login(email: string, password: string): Promise<AuthTokens> {
        const user = await storage.getUserByEmail(email);
        if (!user) {
            throw new Error('Invalid credentials');
        }

        if (!user.isActive) {
            throw new Error('Account is deactivated');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid credentials');
        }

        const { password: _, ...userWithoutPassword } = user;
        const accessToken = this.generateToken(user.id, user.role);

        return {
            accessToken,
            user: userWithoutPassword,
        };
    }

    generateToken(userId: string, role: string): string {
        return jwt.sign({ userId, role }, this.jwtSecret, { expiresIn: '7d' });
    }

    verifyToken(token: string): { userId: string; role: string } {
        try {
            return jwt.verify(token, this.jwtSecret) as { userId: string; role: string };
        } catch {
            throw new Error('Invalid token');
        }
    }
}
