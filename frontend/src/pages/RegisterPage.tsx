import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import Button from '../components/Button';
import Card from '../components/Card';
import Input from '../components/Input';
import Select from '../components/Select';

type RegisterPageProps = {
    onNavigate: (page: 'home' | 'login' | 'dashboard') => void;
    onRegister: () => void;
};

export default function RegisterPage({ onNavigate, onRegister }: RegisterPageProps) {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        role: 'client',
        gymId: '',
    });
    const [gyms, setGyms] = useState<any[]>([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [loadingGyms, setLoadingGyms] = useState(true);

    useEffect(() => {
        loadGyms();
    }, []);

    const loadGyms = async () => {
        try {
            const data = await api.getGyms();
            setGyms(data);
        } catch (err) {
            console.error('Erreur chargement salles:', err);
        } finally {
            setLoadingGyms(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (formData.role === 'client' && !formData.gymId) {
            setError('Veuillez sélectionner une salle de sport');
            setLoading(false);
            return;
        }

        try {
            const data = await api.register(formData);
            if (data.accessToken) {
                localStorage.setItem('token', data.accessToken);
                localStorage.setItem('user', JSON.stringify(data.user));
                onRegister();
            } else {
                setError(data.message || 'Erreur lors de l\'inscription');
            }
        } catch (err: any) {
            setError(err.message || 'Une erreur est survenue');
        } finally {
            setLoading(false);
        }
    };

    const gymOptions = gyms.map((gym) => ({
        value: gym.id,
        label: `${gym.name} - ${gym.address}`,
    }));

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 py-12 px-4">
            <div className="max-w-2xl mx-auto">
                <Card className="space-y-6">
                    {/* Header */}
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-2">Créer un compte</h2>
                        <p className="text-gray-300">Rejoins la communauté Fitness Challenge</p>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg">
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Type de compte */}
                        <div className="space-y-3">
                            <label className="block text-white font-medium">
                                Type de compte <span className="text-red-400">*</span>
                            </label>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, role: 'client', gymId: '' })}
                                    className={`p-4 rounded-lg border-2 transition-all text-left ${formData.role === 'client'
                                            ? 'border-blue-500 bg-blue-500/20 shadow-lg'
                                            : 'border-white/20 bg-white/5 hover:border-white/40'
                                        }`}
                                >
                                    <div className="font-semibold text-white mb-1">Client</div>
                                    <div className="text-sm text-gray-300">Je veux m'entraîner</div>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, role: 'gym_owner', gymId: '' })}
                                    className={`p-4 rounded-lg border-2 transition-all text-left ${formData.role === 'gym_owner'
                                            ? 'border-blue-500 bg-blue-500/20 shadow-lg'
                                            : 'border-white/20 bg-white/5 hover:border-white/40'
                                        }`}
                                >
                                    <div className="font-semibold text-white mb-1">Propriétaire</div>
                                    <div className="text-sm text-gray-300">J'ai une salle de sport</div>
                                </button>
                            </div>
                        </div>

                        {/* Informations personnelles */}
                        <div className="grid md:grid-cols-2 gap-4">
                            <Input
                                label="Prénom"
                                value={formData.firstName}
                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                required
                            />
                            <Input
                                label="Nom"
                                value={formData.lastName}
                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                required
                            />
                        </div>

                        <Input
                            label="Adresse email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="exemple@email.com"
                            required
                        />

                        <Input
                            label="Mot de passe"
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            placeholder="Minimum 8 caractères"
                            required
                        />

                        {/* Sélection salle (si client) */}
                        {formData.role === 'client' && (
                            <>
                                {loadingGyms ? (
                                    <div className="text-gray-300 py-4">Chargement des salles disponibles...</div>
                                ) : gyms.length === 0 ? (
                                    <div className="bg-yellow-500/10 border border-yellow-500/50 text-yellow-200 px-4 py-3 rounded-lg">
                                        Aucune salle disponible pour le moment
                                    </div>
                                ) : (
                                    <Select
                                        label="Salle de sport"
                                        value={formData.gymId}
                                        onChange={(value) => setFormData({ ...formData, gymId: value })}
                                        options={gymOptions}
                                        required
                                        placeholder="Choisir une salle..."
                                    />
                                )}
                            </>
                        )}

                        <Button type="submit" disabled={loading} size="lg">
                            {loading ? 'Création du compte...' : 'Créer mon compte'}
                        </Button>
                    </form>

                    {/* Footer */}
                    <div className="pt-4 border-t border-white/10 text-center space-y-3">
                        <p className="text-gray-300 text-sm">
                            Vous avez déjà un compte ?{' '}
                            <button
                                type="button"
                                onClick={() => onNavigate('login')}
                                className="text-blue-400 hover:text-blue-300 font-medium"
                            >
                                Se connecter
                            </button>
                        </p>
                    </div>
                </Card>
            </div>
        </div>
    );
}
