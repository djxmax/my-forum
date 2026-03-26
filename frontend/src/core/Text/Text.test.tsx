import { render, screen } from '@testing-library/react'
import { Text } from './index'

describe('Text', () => {
    it('renders as <p> by default', () => {
        render(<Text>Hello</Text>)
        expect(screen.getByText('Hello').tagName).toBe('P')
    })

    it('renders as <h1> for title variant', () => {
        render(<Text variant="title">Title</Text>)
        expect(screen.getByText('Title').tagName).toBe('H1')
    })

    it('renders as <h2> for subtitle variant', () => {
        render(<Text variant="subtitle">Subtitle</Text>)
        expect(screen.getByText('Subtitle').tagName).toBe('H2')
    })

    it('renders as <h3> for label variant', () => {
        render(<Text variant="label">Label</Text>)
        expect(screen.getByText('Label').tagName).toBe('H3')
    })

    it('applies custom className', () => {
        render(<Text className="custom-class">Content</Text>)
        expect(screen.getByText('Content')).toHaveClass('custom-class')
    })

    it('renders children', () => {
        render(<Text>Mon texte</Text>)
        expect(screen.getByText('Mon texte')).toBeInTheDocument()
    })
})
