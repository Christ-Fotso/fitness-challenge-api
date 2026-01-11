import { useState } from 'react';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';

type Page = 'home' | 'login' | 'register' | 'dashboard';

function App() {
    const [currentPage, setCurrentPage] = useState<Page>('home');
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const handleAuth = () => {
        setIsAuthenticated(true);
        setCurrentPage('dashboard');
    };

    const renderPage = () => {
        switch (currentPage) {
            case 'home':
                return <HomePage onNavigate={setCurrentPage} />;

            case 'login':
                return (
                    <LoginPage
                        onNavigate={setCurrentPage}
                        onLogin={handleAuth}
                    />
                );

            case 'register':
                return (
                    <RegisterPage
                        onNavigate={setCurrentPage}
                        onRegister={handleAuth}
                    />
                );

            case 'dashboard':
                return isAuthenticated ? (
                    <DashboardPage
                        onLogout={() => {
                            setIsAuthenticated(false);
                            setCurrentPage('home');
                        }}
                    />
                ) : (
                    <LoginPage
                        onNavigate={setCurrentPage}
                        onLogin={handleAuth}
                    />
                );

            default:
                return <HomePage onNavigate={setCurrentPage} />;
        }
    };

    return <div className="app">{renderPage()}</div>;
}

export default App;
