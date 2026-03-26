import React from 'react'
import cx from 'classnames'
import { Stack } from '../Stack'
import { Text } from '../Text'

type Props = React.JSX.IntrinsicElements['select'] & {
    label?: string
    infoLabel?: string
    errorLabel?: string
}

export function Select({ children, className, id, label, infoLabel, errorLabel, ...props }: Props) {
    return (
        <Stack spacing={1}>
            {label && (
                <label htmlFor={id} className="block">
                    <Text variant="label">{label}</Text>
                </label>
            )}
            <select
                id={id}
                {...props}
                className={cx(
                    'mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-primary-600 sm:text-sm sm:leading-6',
                    className
                )}
            >
                {children}
            </select>
            {infoLabel && <p className="mt-2 text-sm text-gray-500">{infoLabel}</p>}
            {errorLabel && <p className="mt-2 text-sm text-red-600">{errorLabel}</p>}
        </Stack>
    )
}
