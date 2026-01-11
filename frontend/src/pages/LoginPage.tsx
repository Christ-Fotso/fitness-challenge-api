import { useState } from 'react';
import { api } from '../lib/api';
import Button from '../components/Button';
import Card from '../components/Card';
import Input from '../components/Input';

type LoginPageProps = {
    onNavigate: (page: 'home' | 'login' | 'register' | 'dashboard') => void;
    onLogin: () => void;
};

export default function LoginPage({ onNavigate, onLogin }: LoginPageProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const data = await api.login(email, password);
            if (data.accessToken) {
                localStorage.setItem('token', data.accessToken);
                localStorage.setItem('user', JSON.stringify(data.user));
                onLogin();
            } else {
                setError(data.message || 'Identifiants incorrects');
            }
        } catch (err) {
            setError('Erreur de connexion. Vérifiez vos identifiants.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <Card className="space-y-6">
                    {/* Header */}
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-2">Connexion</h2>
                        <p className="text-gray-300">Accédez à votre espace personnel</p>
                    </div>

                    {/* Error Alert */}
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg">
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleLogin} className="space-y-5">
                        <Input
                            label="Adresse email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="votre@email.com"
                            required
                        />

                        <Input
                            label="Mot de passe"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Votre mot de passe"
                            required
                        />

                        <Button
                            type="submit"
                            disabled={loading}
                            variant="primary"
                            size="lg"
                            onClick={undefined}
                        >
                            {loading ? 'Connexion en cours...' : 'Se connecter'}
                        </Button>
                    </form>

                    {/* Footer */}
                    <div className="pt-4 border-t border-white/10 text-center space-y-3">
                        <p className="text-gray-300 text-sm">
                            Pas encore de compte ?{' '}
                            <button
                                type="button"
                                onClick={() => onNavigate('register')}
                                className="text-blue-400 hover:text-blue-300 font-medium"
                            >
                                Créer un compte
                            </button>
                        </p>
                        <button
                            type="button"
                            onClick={() => onNavigate('home')}
                            className="text-gray-400 hover:text-gray-300 text-sm"
                        >
                            Retour à l'accueil
                        </button>
                    </div>
                </Card>
            </div>
        </div>
    );
}
