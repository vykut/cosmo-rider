import { Box, Button, ButtonGroup, Grid, makeStyles, Paper, Typography } from '@material-ui/core'
import React, { useState } from 'react'
import PersonalData from './PersonalData'
import { useFirebase } from 'react-redux-firebase';

const useStyles = makeStyles((theme) => ({
    paper: {
        padding: theme.spacing(),
    },
    infoTextColor: {
        color: theme.palette.info.main
    },
    infoButtonColor: {
        color: theme.palette.info.contrastText,
        backgroundColor: theme.palette.info.main,
        "&:hover": {
            backgroundColor: theme.palette.info.dark,
            "@media (hover: none)": {
                backgroundColor: theme.palette.info.main
            }
        }
    },
    errorButtonColor: {
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

export default function AccountOverview() {
    const classes = useStyles()
    const firebase = useFirebase()

    const logout = () => {
        firebase.logout()
    }

    return (
        <>
            {/* <Container maxWidth='xs' style={{ marginTop: 24 }}> */}
            <Grid container direction='column' style={{ padding: 16 }}>
                <Grid container item justify='space-between'>
                    <Grid item>
                        <Typography variant='h3' component='div' className={classes.infoTextColor}>
                            <Box fontWeight='fontWeightBold'>
                                Contul tău
                        </Box>
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Button onClick={logout} className={classes.errorButtonColor}>
                            Deconectează-te
                        </Button>
                    </Grid>
                </Grid>
                <Grid container item>
                    <Grid item md={4} sm={12} style={{ padding: 8, width: '100%' }}>
                        <PersonalData />
                    </Grid>
                </Grid>
            </Grid>
            {/* </Container> */}
        </>
    )
}
