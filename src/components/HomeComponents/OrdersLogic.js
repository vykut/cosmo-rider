import React, { useEffect, useReducer } from 'react'
import { useSnackbar } from 'notistack'
import { Box, Container, Divider, Grid, IconButton, makeStyles, Paper, Tab, Table, TableCell, TableContainer, TableHead, TableRow, Tabs, Typography } from '@material-ui/core'
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Orders from './OrdersView'


const useStyles = makeStyles((theme) => ({
    container: {
        marginTop: theme.spacing(2),
    },
    paper: {
        // padding: theme.spacing(2),
        borderColor: '#e0e0e3',
        borderWidth: '1px',
        borderStyle: 'solid',

    },
    titleGrid: {
        padding: theme.spacing(2),
        marginBottom: theme.spacing(2),
    },
}))



const viewTypes = {
    ordersView: 'Comenzi',
    orderView: 'Comandă',
    productView: 'Produs',
}

function homeReducer(state, action) {
    switch (action.type) {
        case viewTypes.ordersView:
            return { ordersView: true, orderView: false, productView: false, showHeader: false, title: action.type }
        case viewTypes.orderView:
            return { ordersView: false, orderView: true, productView: false, showHeader: false, title: action.type }
        case viewTypes.productView:
            return { ordersView: false, orderView: false, productView: true, showHeader: false, title: action.type }
        default:
            console.log(`Unhandled type: ${action.type}`)
    }
}

function useHome({ reducer = homeReducer } = {}) {
    const [{ ordersView, orderView, productView, showHeader, title }, dispatch] = useReducer(reducer, {
        ordersView: true,
        orderView: false,
        productView: false,
        showHeader: false,
        title: viewTypes.ordersView,
    })

    const showOrdersView = () => dispatch({ type: viewTypes.ordersView })
    const showOrderView = () => dispatch({ type: viewTypes.orderView })
    const showProductView = () => dispatch({ type: viewTypes.productView })
    // const dispatchAction = (actionType) => dispatch({ type: actionType })

    return { ordersView, orderView, productView, title, showHeader, showOrdersView, showOrderView, showProductView }
}

export default function OrdersLogic() {
    const { enqueueSnackbar } = useSnackbar()
    const classes = useStyles()
    const { ordersView, orderView, productView, showHeader, title, showOrdersView, showOrderView, showProductView, } = useHome()

    const goBack = () => {
        if (productView) {
            showOrdersView()
        } else {
            showOrderView()
        }
    }


    // useEffect(() => {
    //     timeout(1000)
    //         .then(() => {
    //             enqueueSnackbar('Snackbarul lui dumnezeu', { variant: 'success' })
    //             enqueueSnackbar('Snackbarul lui dumnezeu', { variant: 'info' })
    //             enqueueSnackbar('Snackbarul lui dumnezeu', { variant: 'warning' })
    //             enqueueSnackbar('Snackbarul lui dumnezeu', { variant: 'error' })
    //             enqueueSnackbar('Snackbarul lui dumnezeu', { variant: 'error' })
    //             enqueueSnackbar('Snackbarul lui dumnezeu', { variant: 'error' })
    //             enqueueSnackbar('Snackbarul lui dumnezeu', { variant: 'error' })
    //         })
    // }, [enqueueSnackbar])

    function TitleGrid() {
        return (
            <>
                { showHeader && <Grid container item direction='column'>
                    <Grid container item justify='space-between' alignItems='center' className={classes.titleGrid}>
                        <Grid item>
                            <IconButton className={classes.backButton} onClick={goBack}>
                                <ArrowBackIcon />
                            </IconButton>
                        </Grid>
                        <Grid item>
                            <Typography variant='h5' color='textPrimary'>
                                <Box fontWeight='fontWeightBold'>
                                    {title}
                                </Box>
                            </Typography>
                        </Grid>
                        {/* <Grid item>
                    <IconButton onClick={props.onClose} className={classes.closeButton}>
                        <CloseIcon />
                    </IconButton>
                </Grid> */}
                    </Grid>
                    <Divider />
                </Grid>
                }
            </>
        )
    }



    return (
        <>
            <Container maxWidth='md' className={classes.container}>
                <Paper className={classes.paper}>
                    <Grid container direction='column'>
                        <TitleGrid />
                        {ordersView && <Orders showOrder={showOrderView} />}
                    </Grid>
                </Paper>
            </Container>

        </>

    )
}
