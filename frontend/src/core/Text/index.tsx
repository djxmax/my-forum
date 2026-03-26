type Variant = 'title' | 'subtitle' | 'paragraph' | 'label'

type Props = {
    children?: React.ReactNode
    className?: string
    variant?: Variant
}

function getTag(variant: Variant) {
    switch (variant) {
        case 'title':
            return 'h1'
        case 'subtitle':
            return 'h2'
        case 'paragraph':
            return 'p'
        case 'label':
            return 'h3'
    }
}

const styles: Record<Variant, string> = {
    title: 'text-3xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white',
    subtitle: 'text-lg font-semibold leading-6 text-gray-900 dark:text-white',
    paragraph: 'text-base leading-7 text-gray-700 dark:text-gray-300',
    label: 'text-sm font-medium leading-6 text-gray-900 dark:text-gray-200',
}

export function Text({ variant = 'paragraph', children, className }: Props) {
    const As = getTag(variant)
    return <As className={[styles[variant], className].filter(Boolean).join(' ')}>{children}</As>
}
