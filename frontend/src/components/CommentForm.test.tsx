import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CommentForm } from './CommentForm'

describe('CommentForm', () => {
    const defaultProps = {
        onSubmit: vi.fn(),
        isPending: false,
    }

    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('renders textarea and submit button', () => {
        render(<CommentForm {...defaultProps} />)
        expect(screen.getByPlaceholderText('Contenu du commentaire')).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Publier' })).toBeInTheDocument()
    })

    it('button is disabled when isPending', () => {
        render(<CommentForm {...defaultProps} isPending={true} />)
        expect(screen.getByRole('button')).toBeDisabled()
    })

    it('button is enabled when not pending', () => {
        render(<CommentForm {...defaultProps} />)
        expect(screen.getByRole('button')).not.toBeDisabled()
    })

    it('shows "Publication..." when isPending', () => {
        render(<CommentForm {...defaultProps} isPending={true} />)
        expect(screen.getByRole('button', { name: 'Publication...' })).toBeInTheDocument()
    })

    it('calls onSubmit with text when form is submitted with valid content', async () => {
        const user = userEvent.setup()
        render(<CommentForm {...defaultProps} />)
        await user.type(screen.getByPlaceholderText('Contenu du commentaire'), 'Mon commentaire valide')
        await user.click(screen.getByRole('button'))
        expect(defaultProps.onSubmit).toHaveBeenCalledWith('Mon commentaire valide', expect.any(Function))
    })

    it('does not call onSubmit when text is too short', async () => {
        const user = userEvent.setup()
        render(<CommentForm {...defaultProps} />)
        await user.type(screen.getByPlaceholderText('Contenu du commentaire'), 'court')
        await user.click(screen.getByRole('button'))
        expect(defaultProps.onSubmit).not.toHaveBeenCalled()
    })
})
