import { useAuthStore } from './authStore'

const mockUser = { id: 'user-1', username: 'alice', email: 'alice@example.com' }
const mockToken = 'mock.jwt.token'

describe('authStore', () => {
    beforeEach(() => {
        localStorage.clear()
        useAuthStore.setState({ token: null, user: null, isAuthenticated: false })
    })

    it('is not authenticated by default', () => {
        const { isAuthenticated, user, token } = useAuthStore.getState()
        expect(isAuthenticated).toBe(false)
        expect(user).toBeNull()
        expect(token).toBeNull()
    })

    it('login sets user, token and isAuthenticated', () => {
        useAuthStore.getState().login(mockToken, mockUser)
        const { isAuthenticated, user, token } = useAuthStore.getState()
        expect(isAuthenticated).toBe(true)
        expect(token).toBe(mockToken)
        expect(user).toEqual(mockUser)
    })

    it('login saves token to localStorage', () => {
        useAuthStore.getState().login(mockToken, mockUser)
        expect(localStorage.getItem('token')).toBe(mockToken)
    })

    it('logout clears user, token and isAuthenticated', () => {
        useAuthStore.getState().login(mockToken, mockUser)
        useAuthStore.getState().logout()
        const { isAuthenticated, user, token } = useAuthStore.getState()
        expect(isAuthenticated).toBe(false)
        expect(user).toBeNull()
        expect(token).toBeNull()
    })

    it('logout removes token from localStorage', () => {
        useAuthStore.getState().login(mockToken, mockUser)
        useAuthStore.getState().logout()
        expect(localStorage.getItem('token')).toBeNull()
    })
})
