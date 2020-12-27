import { Container, Grid, LinearProgress, makeStyles, Paper, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tabs } from "@material-ui/core"
import CheckBox from "@material-ui/core/Checkbox"
import { useEffect, useState } from "react";
import { firebaseFunctions, firestoreDB } from "../..";
import TitleGrid from "./TitleGrid";
import { Link as RouterLink, useHistory } from 'react-router-dom'
import { Link } from '@material-ui/core'
import OrdersContainer from "./OrdersContainer";

const headCells = [
    { id: 'createdAt', numeric: false, label: 'Dată' },
    { id: 'id', numeric: false, label: 'Cod comandă' },
    { id: 'user', numeric: false, label: 'Client' },
    { id: 'address', numeric: false, label: 'Adresă' },
    { id: 'quantity', numeric: true, label: 'Număr produse' },
    { id: 'totalPrice', numeric: true, label: 'Total' },
];


const tabTypes = {
    pendingTab: 'pending',
    assignedTab: 'assigned',
    deliveredTab: 'delivered',
}


export default function Orders() {
    const firestore = firestoreDB
    const functions = firebaseFunctions
    const history = useHistory()
    const [tab, setTab] = useState(tabTypes.pendingTab)
    const [orders, setOrders] = useState([])
    const [isLoading, setIsLoading] = useState(false)


    const changeTab = (e, newValue) => {
        setTab(newValue)
        setOrders([])
    }

    const orderClicked = (orderID) => (e) => {
        history.push(`/comenzi/${orderID}/detalii`)
    }

    useEffect(() => {
        setIsLoading(true)
        functions.httpsCallable('riderFunctions-getOrders')({ state: tab })
            .then((response) => {
                setOrders(response.data)
                setIsLoading(false)
            })
    }, [functions, tab])

    function OrdersTableHead() {
        return (
            <TableHead>
                <TableRow>
                    {/* <TableCell >
                        <CheckBox />
                    </TableCell> */}
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

    function OrdersTableRow({ order }) {
        return (
            <TableRow
                key={order.id}
                hover
                onClick={orderClicked(order.id)}
                href='#'
            >
                {/* <TableCell>
                    <CheckBox />
                </TableCell> */}
                <TableCell>
                    {new Date(order.data.createdAt._seconds * 1000).toLocaleString('ro-RO')}
                </TableCell>
                <TableCell>
                    {order.id}
                </TableCell>
                <TableCell>
                    {`${order.data.firstName}  ${order.data.lastName}`}
                </TableCell>
                <TableCell>
                    {order.data.street}
                </TableCell>
                <TableCell align='right'>
                    {order.data.quantity}
                </TableCell>
                <TableCell align='right'>
                    {/* {order.data.totalPrice} */}
                    RON {order.data.totalPrice.toFixed(2)}
                </TableCell>
            </TableRow>
        )
    }

    function DeliveredOrdersTableFooter({ totalPrice }) {
        return (
            <TableHead>
                <TableRow>
                    <TableCell colSpan={4} />
                    <TableCell >
                        Total
                    </TableCell>
                    <TableCell align='right'>
                        RON {totalPrice.toFixed(2)}
                    </TableCell>
                </TableRow>
            </TableHead>
        )
    }

    function OrdersTable() {
        return (
            <>
                <Grid container item direction='column' >
                    <Grid item>
                        <Tabs value={tab} onChange={changeTab} variant='fullWidth' indicatorColor='primary'>
                            <Tab value={tabTypes.pendingTab} label='În așteptare' />
                            <Tab value={tabTypes.assignedTab} label='Preluate' />
                            <Tab value={tabTypes.deliveredTab} label='Livrate' />
                        </Tabs>
                    </Grid>
                    <Grid item>
                        <TableContainer>
                            <Table>
                                <OrdersTableHead />
                                <TableBody>
                                    {!!orders.length && orders.map((order) => {
                                        return <OrdersTableRow order={order} />
                                    })}
                                </TableBody>
                                {tab === tabTypes.deliveredTab && !!orders.length && <DeliveredOrdersTableFooter totalPrice={orders.reduce((acc, curr) => acc + curr.data.totalPrice, 0)} />}
                            </Table>
                        </TableContainer>
                    </Grid>
                </Grid>
            </>
        )
    }

    return (
        <OrdersContainer title='Comenzi'>
            <OrdersTable />
            {isLoading && <LinearProgress />}
        </OrdersContainer>
    )
}