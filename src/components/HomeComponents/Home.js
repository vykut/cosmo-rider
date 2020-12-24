import React, { useEffect, useReducer } from 'react'
import { useSnackbar } from 'notistack'
import { timeout } from '../../utils/utils'
import Header from '../HeaderComponents/Header'
import { Box, Container, Divider, Grid, IconButton, makeStyles, Paper, Tab, Table, TableCell, TableContainer, TableHead, TableRow, Tabs, Typography } from '@material-ui/core'
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { CheckBox } from '@material-ui/icons'


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


const headCells = [
    { id: 'createdAt', numeric: false, label: 'Dată' },
    { id: 'id', numeric: false, label: 'Cod comandă' },
    { id: 'user', numeric: false, label: 'Client' },
    { id: 'address', numeric: false, label: 'Adresă' },
    { id: 'quantity', numeric: true, label: 'Număr produse' },
    { id: 'totalPrice', numeric: true, label: 'Total (RON)' },
];


const viewTypes = {
    orders: 'Comenzi',
    order: 'Comandă',
    product: 'Produs',
}
const tabTypes = {
    pending: 'pending',
    assigned: 'assigned',
    completed: 'completed',
}

function homeReducer(state, action) {
    switch (action.type) {
        case viewTypes.orders:
            return { orders: true, order: false, product: false, showHeader: false, title: action.type }
        case viewTypes.order:
            return { orders: false, order: true, product: false, showHeader: false, title: action.type }
        case viewTypes.product:
            return { orders: false, order: false, product: true, showHeader: false, title: action.type }
        case tabTypes[action.type]:
            return { ...state, tabType: action.type }
        default:
            console.log(`Unhandled type: ${action.type}`)
    }
}

function useHome({ reducer = homeReducer } = {}) {
    const [{ orders, order, product, showHeader, title, tabType }, dispatch] = useReducer(reducer, {
        orders: true,
        order: false,
        product: false,
        showHeader: false,
        title: viewTypes.orders,
        tabType: tabTypes.pending
    })

    const showOrders = () => dispatch({ type: viewTypes.orders })
    const showOrder = () => dispatch({ type: viewTypes.order })
    const showProduct = () => dispatch({ type: viewTypes.product })
    const changeTab = (e, newValue) => dispatch({ type: newValue })
    // const dispatchAction = (actionType) => dispatch({ type: actionType })

    return { orders, order, product, title, showHeader, tabType, showOrders, showOrder, showProduct, changeTab }
}

export default function Home() {
    const { enqueueSnackbar } = useSnackbar()
    const classes = useStyles()
    const { orders, order, product, showHeader, title, tabType, showOrders, showOrder, showProduct, changeTab, } = useHome()

    const goBack = () => {
        if (product) {
            showOrders()
        } else {
            showOrder()
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

    function Orders() {

        function OrdersTableHead() {
            return (
                <TableHead>
                    <TableRow>
                        <TableCell >
                            <CheckBox />
                        </TableCell>
                        {headCells.map((cell) => {
                            return <TableCell
                                key={cell.id}
                                align={cell.numeric ? 'right' : 'left'}
                            >
                                {cell.label}
                            </TableCell>
                        })}
                    </TableRow>
                </TableHead>
            )
        }

        return (
            <>
                <Grid container item direction='column' >
                    <Grid item>
                        <Tabs value={tabType} onChange={changeTab} variant='fullWidth' indicatorColor='primary'>
                            <Tab value={tabTypes.pending} label='În așteptare' />
                            <Tab value={tabTypes.assigned} label='Preluate' />
                            <Tab value={tabTypes.completed} label='Livrate' />
                        </Tabs>
                    </Grid>
                    <Grid item>
                        <TableContainer>
                            <Table>
                                <OrdersTableHead />
                            </Table>
                        </TableContainer>
                    </Grid>
                </Grid>
            </>
        )
    }

    return (
        <>
            <Header />
            <Container maxWidth='md' className={classes.container}>
                <Paper className={classes.paper}>
                    <Grid container direction='column'>
                        <TitleGrid />

                        {orders && <Orders />}
                    </Grid>
                </Paper>
            </Container>
        </>

    )
}
