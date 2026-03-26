import React from 'react'
import { ExclamationCircleIcon } from '@heroicons/react/20/solid'
import cx from 'classnames'
import { Stack } from '../Stack'
import { Text } from '../Text'

type Props = React.JSX.IntrinsicElements['input'] & {
    label?: string
    infoLabel?: string
    errorLabel?: string
}

export function Input({ label, id, infoLabel, errorLabel, className, ...props }: Props) {
    return (
        <Stack spacing={1}>
            {label && (
                <label htmlFor={id} className="block">
                    <Text variant="label">{label}</Text>
                </label>
            )}
            <div className="mt-2 relative">
                <input
                    id={id}
                    className={cx(
                        'block w-full rounded-md border-0 pl-2 py-1.5 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 focus:outline-none',
                        errorLabel
                            ? 'text-red-900 ring-red-300 placeholder:text-red-300 focus:ring-red-500 pr-10 dark:text-red-400 dark:ring-red-500 dark:placeholder:text-red-500 dark:bg-gray-700'
                            : 'text-gray-900 ring-gray-300 placeholder:text-gray-400 focus:ring-primary-600 pr-2 dark:bg-gray-700 dark:text-white dark:ring-gray-600 dark:placeholder:text-gray-500'
                    )}
                    {...props}
                />
                {errorLabel && (
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                        <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                    </div>
                )}
            </div>
            {infoLabel && <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{infoLabel}</p>}
            {errorLabel && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errorLabel}</p>}
        </Stack>
    )
}
