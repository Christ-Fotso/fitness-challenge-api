const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = {
    async register(userData: {
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        role: string;
        gymId?: string;
    }) {
        const res = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
        });
        return res.json();
    },

    async login(email: string, password: string) {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        return res.json();
    },

    async getGyms() {
        const res = await fetch(`${API_URL}/gyms`);
        return res.json();
    },

    async getChallenges(token?: string) {
        const headers: HeadersInit = token
            ? { Authorization: `Bearer ${token}` }
            : {};
        const res = await fetch(`${API_URL}/challenges`, { headers });
        return res.json();
    },

    async getMyProfile(token: string) {
        const res = await fetch(`${API_URL}/users/me`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.json();
    },

    async getLeaderboard() {
        const res = await fetch(`${API_URL}/users/leaderboard`);
        return res.json();
    },
};
