import { Dialog, DialogContent, DialogTitle, Grid, IconButton, makeStyles, useTheme } from '@material-ui/core'
import React, { useContext, useState } from 'react'
import { timeout } from '../utils/utils'
import LoginLogic from '../components/LoginComponents/LoginLogic';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import CloseIcon from '@material-ui/icons/Close';
import ProductPage from '../components/HomeComponents/ProductPage';

const useStyles = makeStyles((theme) => ({
    closeButton: {
        color: theme.palette.error.main
    }
}))

const DialogContext = React.createContext()

export function useDialog() {
    return useContext(DialogContext)
}

export function DialogProvider({ children }) {
    const classes = useStyles()
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const [productDialogOpen, setProductDialogOpen] = useState(false)
    const [productID, setProductID] = useState('')

    const toggleDialog = (isOpen) => (e) => {
        if (e.type === 'keydown' && (e.key === 'Tab' || e.key === 'Shift')) {
            return
        }
        return setProductDialogOpen(isOpen)
    }


    const showDialog = (productID) => {
        setProductDialogOpen(true)
        setProductID(productID)
    }

    const hideDialog = async () => {
        await timeout(500)
        setProductDialogOpen(false)
    }

    const value = {
        showDialog,
        hideDialog,
    }


    function ProductDialog() {
        return (
            <Dialog
                maxWidth='lg'
                fullWidth
                fullScreen={fullScreen}
                open={productDialogOpen}
                onClose={toggleDialog(false)}
                PaperProps={{ style: { backgroundColor: '#f7ffff' } }}
                scroll='body'
            >
                <DialogTitle>
                    <Grid container justify='space-between' alignItems='center'>
                        <Grid item>
                            Detalii produs
                        </Grid>
                        <Grid item>
                            <IconButton onClick={toggleDialog(false)} className={classes.closeButton}>
                                <CloseIcon />
                            </IconButton>
                        </Grid>
                    </Grid>
                </DialogTitle>
                <DialogContent>
                    <ProductPage productID={productID} />
                </DialogContent>
            </Dialog >
        )
    }

    return (
        <>
            <DialogContext.Provider value={value}>
                {children}
                {productDialogOpen && <ProductDialog />}
            </DialogContext.Provider>
        </>
    )
}
