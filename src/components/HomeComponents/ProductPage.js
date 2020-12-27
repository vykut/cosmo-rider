import { Box, Container, Divider, Grid, makeStyles, Paper, Typography } from '@material-ui/core'
import React from 'react'
import { isEmpty, isLoaded, useFirestoreConnect } from 'react-redux-firebase';
import { useSelector } from 'react-redux';

const useStyles = makeStyles((theme) => ({
    paper: {
        padding: theme.spacing(2),
    },
    infoPalette: {
        color: theme.palette.info.main,
    },
    image: {
        display: 'block',
        maxHeight: 600,
        maxWidth: 600,
        [theme.breakpoints.down('xs')]: {
            maxHeight: 300,
            maxWidth: 300,
        },
        width: 'auto',
        height: 'auto',
        margin: 'auto',
    },
}))

export default function ProductPage({ productID }) {
    const classes = useStyles()

    useFirestoreConnect({
        collection: 'products',
        doc: productID
    })

    const product = useSelector((state) => state.firestore.data.products && state.firestore.data.products[productID])

    return (
        <>
            {isLoaded(product) && !isEmpty(product) && <Container maxWidth='md' style={{ marginBottom: 24, marginTop: 24 }}>
                <Paper className={classes.paper}>
                    <Grid container direction="column" justify='center' spacing={4}>
                        <Grid item>
                            {/* {title} */}
                            <Typography variant='h4' color='primary' align='center'>
                                <Box fontWeight='fontWeightMedium'>
                                    {product.name}
                                </Box>
                            </Typography>
                        </Grid>
                        <Grid item>
                            <img src={product.image} alt={product.name} className={classes.image} />
                        </Grid>
                    </Grid>
                    <Grid item style={{ marginTop: 16, marginBottom: 16 }}>
                        {/* separator toolbar?*/}
                        <Divider />
                    </Grid>
                    <Grid container direction='column' item spacing={2}>
                        {/* <Grid item> */}
                        {/* categorie */}
                        {/* Categorie: {product.category} */}
                        {/* </Grid> */}
                        <Grid item>
                            {/* descriere */}
                                Descriere: {product.description}
                        </Grid>
                        <Grid item>
                            {/* id produs */}
                            ID: {productID}
                        </Grid>
                        <Grid item>
                            {/* disclaimer */}
                            <Typography variant='caption'>
                                Informația afișată poate fi incompletă sau neactualizată. Consultați întotdeauna produsul fizic pentru cele mai exacte informații și avertismente. Pentru mai multe informații contactați vânzătorul sau producătorul.
                            </Typography>
                        </Grid>
                    </Grid>
                </Paper>
            </Container >}
        </>
    )
}
