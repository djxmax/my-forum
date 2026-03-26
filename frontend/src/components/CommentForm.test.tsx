import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CommentForm } from './CommentForm'

describe('CommentForm', () => {
    const defaultProps = {
        value: '',
        onChange: vi.fn(),
        onSubmit: vi.fn(),
        isPending: false,
    }

    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('renders textarea and submit button', () => {
        render(<CommentForm {...defaultProps} />)
        expect(screen.getByPlaceholderText('Écrire un commentaire...')).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Commenter' })).toBeInTheDocument()
    })

    it('calls onChange when user types', async () => {
        const user = userEvent.setup()
        render(<CommentForm {...defaultProps} />)
        await user.type(screen.getByPlaceholderText('Écrire un commentaire...'), 'Bonjour')
        expect(defaultProps.onChange).toHaveBeenCalled()
    })

    it('button is disabled when value is empty', () => {
        render(<CommentForm {...defaultProps} value="" />)
        expect(screen.getByRole('button')).toBeDisabled()
    })

    it('button is disabled when isPending', () => {
        render(<CommentForm {...defaultProps} value="texte" isPending={true} />)
        expect(screen.getByRole('button')).toBeDisabled()
    })

    it('button is enabled when value is provided and not pending', () => {
        render(<CommentForm {...defaultProps} value="mon commentaire" />)
        expect(screen.getByRole('button')).not.toBeDisabled()
    })

    it('shows "Envoi..." when isPending', () => {
        render(<CommentForm {...defaultProps} value="texte" isPending={true} />)
        expect(screen.getByRole('button', { name: 'Envoi...' })).toBeInTheDocument()
    })

    it('calls onSubmit when button clicked', async () => {
        const user = userEvent.setup()
        render(<CommentForm {...defaultProps} value="mon commentaire" />)
        await user.click(screen.getByRole('button'))
        expect(defaultProps.onSubmit).toHaveBeenCalledTimes(1)
    })
})
