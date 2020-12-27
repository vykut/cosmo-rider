import { Box, Button, ButtonGroup, Grid, LinearProgress, makeStyles, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { firebaseFunctions, firestoreDB } from '../..'
import OrdersContainer from './OrdersContainer'
import { useDialog } from '../../contexts/DialogContext'
import { useSnackbar } from 'notistack'

const useStyles = makeStyles((theme) => ({
    paper: {
        padding: theme.spacing(2)
    },
    errorButton: {
        color: theme.palette.error.contrastText,
        backgroundColor: theme.palette.error.main,
        "&:hover": {
            backgroundColor: theme.palette.error.dark,
            "@media (hover: none)": {
                backgroundColor: theme.palette.error.main
            }
        }
    },
}))

export default function OrderDetails() {
    const classes = useStyles()
    const firestore = firestoreDB
    const { orderID } = useParams()
    const dialog = useDialog()

    const [order, setOrder] = useState({})
    const [user, setUser] = useState({})
    const [address, setAddress] = useState({})
    const [productsInOrder, setProductsInOrder] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        //fetch order
        setIsLoading(true)
        let orderRef = firestore.collection('orders').doc(orderID)
        let orderUnsubscribe = orderRef
            .onSnapshot((docSnapshot) => {
                setOrder({ id: docSnapshot.id, data: docSnapshot.data() })
                setIsLoading(false)
            })

        return () => {
            orderUnsubscribe()
        }

    }, [firestore, orderID])

    useEffect(() => {
        if (order.data && order.data.addressID) {
            let addressUnsubscribe = firestore.collection('addresses').doc(order.data.addressID)
                .onSnapshot((addressDoc) => {
                    setAddress({ id: addressDoc.id, data: addressDoc.data() })
                })
            return () => {
                addressUnsubscribe()
            }
        }
    }, [firestore, order.data])

    useEffect(() => {
        if (order.data && order.data.userID) {
            let userUnsubscribe = firestore.collection('users').doc(order.data.userID)
                .onSnapshot((userDoc) => {
                    setUser({ id: userDoc.id, data: userDoc.data() })
                })
            return () => {
                userUnsubscribe()
            }
        }
    }, [firestore, order.data])

    useEffect(() => {
        if (order.data) {
            let orderRef = firestore.collection('orders').doc(orderID)
            let productsInOrderUnsubscribe = orderRef.collection('products')
                .onSnapshot((productsSnapshot) => {
                    var docs = []
                    productsSnapshot.forEach((productDoc) => {
                        docs.push({ id: productDoc.id, data: productDoc.data() })
                    })
                    setProductsInOrder(docs)
                })
            return () => {
                productsInOrderUnsubscribe()
            }
        }
    }, [firestore, order.data, orderID])

    const orderDate = () => {
        let createdAt = order.data.createdAt
        let date = new Date(createdAt.seconds * 1000)
        let localeDate = date.toLocaleString('ro-RO')
        return localeDate
    }

    function OrderHeader({ date, state, id }) {
        return (
            <Grid container item justify='space-between' className={classes.paper}>
                <Grid item>
                    <Typography>
                        Dată: {date}
                    </Typography>
                </Grid>
                <Grid item>
                    <Typography>
                        Status: {state === 'pending' ? 'În așteptare' : state === 'assigned' ? 'Preluată' : 'Livrată'}
                    </Typography>
                </Grid>
                <Grid item>
                    <Typography>
                        ID comandă: {id}
                    </Typography>
                </Grid>
            </Grid>
        )
    }

    function OrderCustomerDetails({ user, address }) {
        return (
            <>
                <Grid container item justify='space-between' className={classes.paper}>
                    <Grid container item direction='column' xs>

                        <Grid item>
                            <Typography component='div'>
                                <Box fontWeight='fontWeightBold'>
                                    Client
                            </Box>
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Typography>
                                {`${user.data.firstName} ${user.data.lastName}`}
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Typography>
                                Telefon: {user.data.phone}
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Typography>
                                Email: {user.data.email}
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid container item direction='column' xs>
                        <Grid item>
                            <Typography component='div' align='right'>
                                <Box fontWeight='fontWeightBold'>
                                    Adresă livrare
                        </Box>
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Typography align='right'>
                                Strada: {address.data.street}
                            </Typography>
                        </Grid>
                        {address.data.number && <Grid item>
                            <Typography align='right'>
                                Nr: {address.data.number}
                            </Typography>
                        </Grid>}
                        {address.data.block && <Grid item>
                            <Typography align='right'>
                                Bloc/ scara: {address.data.block}
                            </Typography>
                        </Grid>}
                        {address.data.floor && <Grid item>
                            <Typography align='right'>
                                Etaj: {address.data.floor}
                            </Typography>
                        </Grid>}
                        {address.data.apartment && <Grid item>
                            <Typography align='right'>
                                Apartament: {address.data.apartment}
                            </Typography>
                        </Grid>}
                        {address.data.intercom && <Grid item>
                            <Typography align='right'>
                                Interfon: {address.data.intercom}
                            </Typography>
                        </Grid>}
                    </Grid>
                </Grid>
            </>
        )
    }

    function OrderProducts({ productsInOrder }) {
        const [products, setProducts] = useState([])
        const [isLoading, setIsLoading] = useState(false)
        useEffect(() => {
            var promises = []
            setIsLoading(true)
            let productsRef = firestore.collection('products')
            productsInOrder.forEach((product) => {
                promises.push(productsRef.doc(product.id).get())
            })
            Promise.all(promises)
                .then((productsSnapshot) => {
                    var docs = []
                    productsSnapshot.forEach((productDoc) => {
                        docs.push({ id: productDoc.id, data: productDoc.data() })
                    })
                    setProducts(docs)
                    setIsLoading(false)
                })
        }, [productsInOrder])

        return (
            <>
                <Grid item className={classes.paper}>
                    <Typography component='div'>
                        <Box fontWeight='fontWeightBold'>
                            Produse
                        </Box>
                    </Typography>
                </Grid>
                <Grid item>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>
                                        Produs
                                    </TableCell>
                                    <TableCell align='right'>
                                        Preț bucată
                                    </TableCell>
                                    <TableCell align='right'>
                                        Cantitate
                                    </TableCell>
                                    <TableCell align='right'>
                                        Preț total
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {!!productsInOrder.length && !!products.length && productsInOrder.map((product, index) => {
                                    return <TableRow key={product.id}>
                                        <TableCell>
                                            <Button style={{ textTransform: 'none' }} color='primary' onClick={() => dialog.showDialog(product.id)}>
                                                {products[index].data.name}
                                            </Button>
                                        </TableCell>
                                        <TableCell align='right'>
                                            RON {products[index].data.price}
                                        </TableCell>
                                        <TableCell align='right'>
                                            {product.data.quantity}
                                        </TableCell>
                                        <TableCell align='right'>
                                            RON {product.data.price.toFixed(2)}
                                        </TableCell>
                                    </TableRow>
                                })}
                                {isLoading && <LinearProgress />}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </>
        )
    }

    function OrderNotes({ notes }) {
        return (
            <>
                <Grid item className={classes.paper}>
                    <Typography component='div'>
                        <Box fontWeight='fontWeightBold'>
                            Note
                        </Box>
                    </Typography>
                </Grid>
                <Grid item className={classes.paper}>
                    <Typography>
                        {notes}
                    </Typography>
                </Grid>
            </>
        )
    }

    function OrderTotal({ totalPrice }) {
        return (
            <>
                <Grid item className={classes.paper}>
                    <Typography component='div'>
                        <Box fontWeight='fontWeightBold'>
                            Total
                        </Box>
                    </Typography>
                </Grid>
                <Grid item>
                    <TableContainer>
                        <Table>
                            <TableBody>
                                <TableRow>
                                    <TableCell>
                                        Subtotal produse
                                    </TableCell>
                                    <TableCell align='right'>
                                        RON {totalPrice.toFixed(2)}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>
                                        Cost livrare
                                    </TableCell>
                                    <TableCell align='right'>
                                        RON 10
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell variant='head' >
                                        Total
                                    </TableCell>
                                    <TableCell align='right' variant='head'>
                                        RON {(totalPrice + 10).toFixed(2)}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </>
        )
    }

    function OrderActions({ orderID, state }) {
        const classes = useStyles()
        const { enqueueSnackbar } = useSnackbar()
        const functions = firebaseFunctions
        const [isLoading, setIsLoading] = useState(false)
        const acceptOrder = async () => {
            setIsLoading(true)
            functions.httpsCallable('riderFunctions-assignOrder')({ orderID: orderID })
                .then(({ data }) => {
                    setIsLoading(false)
                    if (data.result) {
                        enqueueSnackbar(data.result, { variant: 'success' })
                    } else if (data.error) {
                        enqueueSnackbar(data.error, { variant: 'error' })
                    }
                })
        }

        const completeOrder = async () => {
            setIsLoading(true)
            functions.httpsCallable('riderFunctions-completeOrder')({ orderID: orderID })
                .then(({ data }) => {
                    setIsLoading(false)
                    if (data.result) {
                        enqueueSnackbar(data.result, { variant: 'success' })
                    } else if (data.error) {
                        enqueueSnackbar(data.error, { variant: 'error' })
                    }
                })
        }

        const cancelDelivery = async () => {
            setIsLoading(true)
            functions.httpsCallable('riderFunctions-cancelDelivery')({ orderID: orderID })
                .then(({ data }) => {
                    setIsLoading(false)
                    if (data.result) {
                        enqueueSnackbar(data.result, { variant: 'success' })
                    } else if (data.error) {
                        enqueueSnackbar(data.error, { variant: 'error' })
                    }
                })
        }

        return (
            <Grid container item justify='flex-end' className={classes.paper}>
                {state === 'pending' && <Grid item>
                    <Button onClick={acceptOrder} color='primary' variant='contained' disabled={isLoading}>
                        Acceptă comanda
                    </Button>
                </Grid>}
                {state === 'assigned' &&
                    <Grid item>
                        <ButtonGroup>
                            <Button onClick={cancelDelivery} className={classes.errorButton} variant='contained' disabled={isLoading}>
                                Anulează livrarea
                            </Button>
                            <Button onClick={completeOrder} color='primary' variant='contained' disabled={isLoading}>
                                Finalizează comanda
                            </Button>
                        </ButtonGroup>
                    </Grid>}
                {/* {state === 'delivered' && <Grid item>
                    <Button onClick={acceptOrder} color='primary' variant='contained'>
                        Acceptă comanda
                    </Button>
                </Grid>} */}
            </Grid>
        )
    }

    return (
        <>
            { order.id && <OrdersContainer title='Detalii comandă' showBack={true}>
                <OrderHeader date={orderDate()} state={order.data.state} id={order.id} />
                {user.data && address.data && <OrderCustomerDetails user={user} address={address} />}
                {productsInOrder.length && <OrderProducts productsInOrder={productsInOrder} />}
                {order.data.notes && <OrderNotes notes={order.data.notes} />}
                <OrderTotal totalPrice={order.data.totalPrice} />
                <OrderActions orderID={order.id} state={order.data.state} />
            </OrdersContainer>}
            {isLoading && <LinearProgress />}
        </>
    )
}