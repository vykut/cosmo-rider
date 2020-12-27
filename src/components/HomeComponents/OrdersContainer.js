import { Container, Grid, makeStyles, Paper } from '@material-ui/core'
import React from 'react'
import TitleGrid from './TitleGrid'

const useStyles = makeStyles((theme) => ({
    container: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
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

export default function OrdersContainer({ children, ...props }) {
    const classes = useStyles()
    return (
        <Container maxWidth='md' className={classes.container}>
            <Paper className={classes.paper}>
                <Grid container direction='column'>
                    <TitleGrid title='Comenzi' {...props} />
                    {children}
                </Grid>
            </Paper>
        </Container>
    )
}
