import React from 'react'
import cx from 'classnames'
import { Stack } from '../Stack'
import { Text } from '../Text'

type Props = React.JSX.IntrinsicElements['input'] & {
    label?: string
    labelLeft?: boolean
}

export function Checkbox({ className, label, id, ...props }: Props) {
    return (
        <Stack spacing={1}>
            {label && (
                <label htmlFor={id}>
                    <Text variant="label">{label}</Text>
                </label>
            )}
            <input id={id} {...props} className={cx('h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-600', className)} type="checkbox" />
        </Stack>
    )
}
