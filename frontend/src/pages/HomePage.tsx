import { Activity, Trophy, TrendingUp, ArrowRight } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';

type PageProps = {
    onNavigate: (page: 'home' | 'login' | 'register' | 'dashboard') => void;
};

export default function HomePage({ onNavigate }: PageProps) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
            {/* Navigation */}
            <nav className="container mx-auto px-6 py-4">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-white">Fitness Challenge</h1>
                    <button
                        onClick={() => onNavigate('login')}
                        className="text-white hover:text-blue-300 transition-colors font-medium"
                    >
                        Connexion
                    </button>
                </div>
            </nav>

            {/* Hero */}
            <div className="container mx-auto px-6 py-20">
                <div className="max-w-4xl mx-auto text-center space-y-8">
                    <h2 className="text-5xl md:text-6xl font-bold text-white leading-tight">
                        Transforme ta routine fitness
                    </h2>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                        Rejoins une communauté, relève des défis et progresse à ton rythme
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button onClick={() => onNavigate('register')} size="lg">
                            Commencer gratuitement
                            <ArrowRight className="ml-2 w-5 h-5 inline" />
                        </Button>
                        <button
                            onClick={() => onNavigate('login')}
                            className="px-8 py-4 text-lg text-white border-2 border-white/30 rounded-lg hover:border-white/60 hover:bg-white/5 transition-all font-medium"
                        >
                            Se connecter
                        </button>
                    </div>
                </div>

                {/* Features */}
                <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto mt-20">
                    <Card hover>
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-blue-500/20 rounded-lg">
                                <Activity className="w-6 h-6 text-blue-400" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white mb-2">
                                    Suivi personnalisé
                                </h3>
                                <p className="text-gray-300 text-sm">
                                    Enregistre tes séances d'entraînement et visualise ta progression au fil du temps
                                </p>
                            </div>
                        </div>
                    </Card>

                    <Card hover>
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-purple-500/20 rounded-lg">
                                <Trophy className="w-6 h-6 text-purple-400" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white mb-2">
                                    Défis communautaires
                                </h3>
                                <p className="text-gray-300 text-sm">
                                    Participe aux défis de ta salle ou crée les tiens pour motiver ton entourage
                                </p>
                            </div>
                        </div>
                    </Card>

                    <Card hover>
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-green-500/20 rounded-lg">
                                <TrendingUp className="w-6 h-6 text-green-400" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white mb-2">
                                    Système de points
                                </h3>
                                <p className="text-gray-300 text-sm">
                                    Gagne des points à chaque séance et grimpe dans le classement de ta salle
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Footer */}
            <footer className="container mx-auto px-6 py-8 mt-20 border-t border-white/10">
                <div className="text-center text-gray-400 text-sm">
                    <p>&copy; 2026 Fitness Challenge. Tous droits réservés.</p>
                </div>
            </footer>
        </div>
    );
}
