import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from './index'

describe('Button', () => {
    it('renders children', () => {
        render(<Button>Valider</Button>)
        expect(screen.getByRole('button', { name: 'Valider' })).toBeInTheDocument()
    })

    it('calls onClick when clicked', async () => {
        const user = userEvent.setup()
        const onClick = vi.fn()
        render(<Button onClick={onClick}>Cliquer</Button>)
        await user.click(screen.getByRole('button'))
        expect(onClick).toHaveBeenCalledTimes(1)
    })

    it('is disabled when disabled prop is set', () => {
        render(<Button disabled>Désactivé</Button>)
        expect(screen.getByRole('button')).toBeDisabled()
    })

    it('does not call onClick when disabled', async () => {
        const user = userEvent.setup()
        const onClick = vi.fn()
        render(<Button disabled onClick={onClick}>Désactivé</Button>)
        await user.click(screen.getByRole('button'))
        expect(onClick).not.toHaveBeenCalled()
    })

    it('applies custom className', () => {
        render(<Button className="ma-classe">OK</Button>)
        expect(screen.getByRole('button')).toHaveClass('ma-classe')
    })
})
