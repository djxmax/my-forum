import { create } from 'zustand'
import { jwtDecode } from 'jwt-decode'

interface User {
    id: string
    username: string
    email: string
}

interface AuthState {
    user: User | null
    token: string | null
    isAuthenticated: boolean
    login: (token: string, user: User) => void
    logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
    token: localStorage.getItem('token'),
    user: localStorage.getItem('token') ? jwtDecode(localStorage.getItem('token')!) : null,
    isAuthenticated: !!localStorage.getItem('token'),

    login: (token, user) => {
        localStorage.setItem('token', token)
        set({ token, user, isAuthenticated: true })
    },

    logout: () => {
        localStorage.removeItem('token')
        set({ token: null, user: null, isAuthenticated: false })
    },
}))
