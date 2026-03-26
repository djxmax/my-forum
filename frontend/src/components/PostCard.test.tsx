import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PostCard } from './PostCard'
import { Post } from '../entities'

const mockPost: Post = {
    id: 'post-1',
    title: 'Mon Post',
    text: 'Contenu du post',
    author: { id: 'user-1', username: 'alice' },
    createdAt: '2024-01-01T10:00:00.000Z',
}

describe('PostCard', () => {
    it('renders post title and text', () => {
        render(<PostCard post={mockPost} />)
        expect(screen.getByText('Mon Post')).toBeInTheDocument()
        expect(screen.getByText('Contenu du post')).toBeInTheDocument()
    })

    it('renders author username', () => {
        render(<PostCard post={mockPost} />)
        expect(screen.getByText(/alice/)).toBeInTheDocument()
    })

    it('does not show delete button when onDelete is not provided', () => {
        render(<PostCard post={mockPost} />)
        expect(screen.queryByText('Supprimer le post')).not.toBeInTheDocument()
    })

    it('shows delete button when onDelete is provided', () => {
        render(<PostCard post={mockPost} onDelete={vi.fn()} />)
        expect(screen.getByText('Supprimer le post')).toBeInTheDocument()
    })

    it('opens confirm modal when delete button is clicked', async () => {
        const user = userEvent.setup()
        render(<PostCard post={mockPost} onDelete={vi.fn()} />)
        await user.click(screen.getByText('Supprimer le post'))
        expect(screen.getByText('Supprimer ce post ? Cette action est irréversible.')).toBeInTheDocument()
    })

    it('calls onDelete after confirmation', async () => {
        const user = userEvent.setup()
        const onDelete = vi.fn()
        render(<PostCard post={mockPost} onDelete={onDelete} />)
        await user.click(screen.getByText('Supprimer le post'))
        await user.click(screen.getByRole('button', { name: 'Supprimer' }))
        expect(onDelete).toHaveBeenCalledTimes(1)
    })

    it('does not call onDelete when cancelling', async () => {
        const user = userEvent.setup()
        const onDelete = vi.fn()
        render(<PostCard post={mockPost} onDelete={onDelete} />)
        await user.click(screen.getByText('Supprimer le post'))
        await user.click(screen.getByRole('button', { name: 'Annuler' }))
        expect(onDelete).not.toHaveBeenCalled()
        expect(screen.queryByText('Supprimer ce post ? Cette action est irréversible.')).not.toBeInTheDocument()
    })

    it('calls onClick when card is clicked', async () => {
        const user = userEvent.setup()
        const onClick = vi.fn()
        render(<PostCard post={mockPost} onClick={onClick} />)
        await user.click(screen.getByText('Mon Post'))
        expect(onClick).toHaveBeenCalledTimes(1)
    })
})
