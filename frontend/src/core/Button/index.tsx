import React from 'react'
import cx from 'classnames'

type Sizes = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

type Props = React.JSX.IntrinsicElements['button'] & {
    size?: Sizes
}

const sizes: Record<Sizes, string> = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-2 py-1 text-sm',
    md: 'px-2.5 py-1.5 text-sm',
    lg: 'px-3 py-2 text-sm',
    xl: 'px-3.5 py-2.5 text-sm',
}

export function Button({ size = 'md', children, className, ...rest }: Props) {
    return (
        <button
            type="button"
            className={cx(
                'rounded bg-primary-600 font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:bg-primary-300 disabled:cursor-not-allowed',
                sizes[size],
                className
            )}
            {...rest}
        >
            {children}
        </button>
    )
}
