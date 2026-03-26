import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { Button } from '../core/Button'

export default function Navbar() {
    const navigate = useNavigate()
    const { user, isAuthenticated, logout } = useAuthStore()

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <nav className="bg-white shadow-sm sticky top-0 z-10">
            <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
                <Link to="/" className="text-xl font-bold text-primary-600">
                    MyForum
                </Link>
                <div className="flex items-center gap-4">
                    {isAuthenticated ? (
                        <>
                            <span className="text-sm text-gray-600">Bonjour, {user?.username}</span>
                            <Button size="sm" onClick={handleLogout}>
                                Déconnexion
                            </Button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="text-sm text-gray-600 hover:text-primary-600">
                                Connexion
                            </Link>
                            <Button size="sm" onClick={() => navigate('/register')}>
                                S'inscrire
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    )
}
