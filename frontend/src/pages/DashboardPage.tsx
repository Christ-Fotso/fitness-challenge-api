import { useEffect, useState } from 'react';
import { api } from '../lib/api';

type DashboardPageProps = {
    onLogout: () => void;
};

export default function DashboardPage({ onLogout }: DashboardPageProps) {
    const [user, setUser] = useState<any>(null);
    const [challenges, setChallenges] = useState<any[]>([]);
    const [leaderboard, setLeaderboard] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            const token = localStorage.getItem('token');
            const userData = localStorage.getItem('user');

            if (userData) {
                setUser(JSON.parse(userData));
            }

            try {
                const [challengesData, leaderboardData] = await Promise.all([
                    api.getChallenges(token || undefined),
                    api.getLeaderboard(),
                ]);
                setChallenges(challengesData.slice(0, 3));
                setLeaderboard(leaderboardData.slice(0, 5));
            } catch (err) {
                console.error('Erreur chargement données:', err);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        onLogout();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
                <div className="text-white text-2xl">Chargement...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
            <nav className="bg-black/30 backdrop-blur-lg border-b border-white/10">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold">💪 Fitness Challenge</h1>
                    <div className="flex items-center gap-4">
                        <span>Bonjour, {user?.firstName} !</span>
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg"
                        >
                            Déconnexion
                        </button>
                    </div>
                </div>
            </nav>

            <div className="container mx-auto px-4 py-8">
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Statistiques */}
                    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
                        <h2 className="text-2xl font-bold mb-4">📊 Mes Statistiques</h2>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span>Points totaux:</span>
                                <span className="font-bold text-yellow-400">0</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Défis actifs:</span>
                                <span className="font-bold text-green-400">0</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Badges:</span>
                                <span className="font-bold text-purple-400">0</span>
                            </div>
                        </div>
                    </div>

                    {/* Classement */}
                    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
                        <h2 className="text-2xl font-bold mb-4">🏆 Classement</h2>
                        <div className="space-y-2">
                            {leaderboard.map((entry, index) => (
                                <div
                                    key={entry.userId}
                                    className="flex items-center gap-3 p-2 bg-white/5 rounded"
                                >
                                    <span className="text-2xl">
                                        {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '🔹'}
                                    </span>
                                    <span className="flex-1">
                                        {entry.firstName} {entry.lastName}
                                    </span>
                                    <span className="font-bold text-yellow-400">
                                        {entry.totalPoints} pts
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Défis */}
                    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 md:col-span-2">
                        <h2 className="text-2xl font-bold mb-4">🎯 Défis disponibles</h2>
                        <div className="grid md:grid-cols-3 gap-4">
                            {challenges.length > 0 ? (
                                challenges.map((challenge) => (
                                    <div
                                        key={challenge.id}
                                        className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors"
                                    >
                                        <h3 className="font-bold mb-2">{challenge.title}</h3>
                                        <p className="text-sm text-gray-300 mb-3">
                                            {challenge.description}
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs bg-purple-500/30 px-2 py-1 rounded">
                                                {challenge.difficulty}
                                            </span>
                                            <button className="text-xs bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded">
                                                Rejoindre
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-gray-400 col-span-3 text-center py-8">
                                    Aucun défi disponible pour le moment
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
