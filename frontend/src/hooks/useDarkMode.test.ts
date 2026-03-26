import { renderHook, act } from '@testing-library/react'
import { useDarkMode } from './useDarkMode'

describe('useDarkMode', () => {
    beforeEach(() => {
        localStorage.clear()
        document.documentElement.classList.remove('dark')
    })

    it('is light mode by default', () => {
        const { result } = renderHook(() => useDarkMode())
        expect(result.current.isDark).toBe(false)
    })

    it('is dark mode when localStorage has "dark"', () => {
        localStorage.setItem('theme', 'dark')
        const { result } = renderHook(() => useDarkMode())
        expect(result.current.isDark).toBe(true)
    })

    it('toggle switches isDark to true', () => {
        const { result } = renderHook(() => useDarkMode())
        act(() => result.current.toggle())
        expect(result.current.isDark).toBe(true)
    })

    it('adds "dark" class to documentElement when isDark', () => {
        const { result } = renderHook(() => useDarkMode())
        act(() => result.current.toggle())
        expect(document.documentElement.classList.contains('dark')).toBe(true)
    })

    it('removes "dark" class when toggled back to light', () => {
        localStorage.setItem('theme', 'dark')
        const { result } = renderHook(() => useDarkMode())
        act(() => result.current.toggle())
        expect(document.documentElement.classList.contains('dark')).toBe(false)
    })

    it('saves theme to localStorage on toggle', () => {
        const { result } = renderHook(() => useDarkMode())
        act(() => result.current.toggle())
        expect(localStorage.getItem('theme')).toBe('dark')
        act(() => result.current.toggle())
        expect(localStorage.getItem('theme')).toBe('light')
    })
})
