import React from 'react'
import cx from 'classnames'
import { Justify, justifyMap } from '../types'

type Sizes = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12

type Props = React.JSX.IntrinsicElements['div'] & {
    spacing?: Sizes
    justify?: Justify
}

const sizes: Record<Sizes, string> = {
    '1': 'space-y-1',
    '2': 'space-y-2',
    '3': 'space-y-3',
    '4': 'space-y-4',
    '5': 'space-y-5',
    '6': 'space-y-6',
    '7': 'space-y-7',
    '8': 'space-y-8',
    '9': 'space-y-9',
    '10': 'space-y-10',
    '11': 'space-y-11',
    '12': 'space-y-12',
}

export function Stack({ spacing = 2, justify, children, className, ...rest }: Props) {
    return (
        <div className={cx('flex flex-col flex-wrap', sizes[spacing], justify ? justifyMap[justify] : undefined, className)} {...rest}>
            {children}
        </div>
    )
}
