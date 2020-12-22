import React, { useEffect } from 'react'
import { useSnackbar } from 'notistack'
import { timeout } from '../../utils/utils'


export default function Home() {
    const { enqueueSnackbar } = useSnackbar()

    useEffect(() => {
        timeout(1000)
            .then(() => {
                enqueueSnackbar('Snackbarul lui dumnezeu', { variant: 'success' })
                enqueueSnackbar('Snackbarul lui dumnezeu', { variant: 'info' })
                enqueueSnackbar('Snackbarul lui dumnezeu', { variant: 'warning' })
                enqueueSnackbar('Snackbarul lui dumnezeu', { variant: 'error' })
                enqueueSnackbar('Snackbarul lui dumnezeu', { variant: 'error' })
                enqueueSnackbar('Snackbarul lui dumnezeu', { variant: 'error' })
                enqueueSnackbar('Snackbarul lui dumnezeu', { variant: 'error' })
            })

    }, [enqueueSnackbar])
    return (
        <div>
            Home
        </div>
    )
}
