import logo from '../../assets/logo-app-bar-cosmo-market.svg';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { Button, capitalize, Grid, Link, Typography } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { isEmpty } from 'react-redux-firebase';
import AccountCircle from '@material-ui/icons/AccountCircle';
import { useHistory } from 'react-router-dom';


const useStyles = makeStyles((theme) => ({
    logo: {
        height: 45,
        margin: theme.spacing()
    },

    toolbar: {
        display: 'flex',
        alignContent: 'center',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        [theme.breakpoints.down(400)]: {
            justifyContent: 'center',
        },
        padding: theme.spacing(),
    },
    button: {
        padding: theme.spacing(1, 3),
        textTransform: 'none',
    },
    label: {
        marginRight: theme.spacing(2),
        [theme.breakpoints.down('sm')]: {
            display: 'none',
        },
    },
}));

export default function Header() {
    const classes = useStyles();
    const profile = useSelector(state => state.firebase.profile)
    const history = useHistory()

    return (
        <>
            <AppBar position="sticky" >
                <Toolbar className={classes.toolbar}>
                    <Grid container justify='space-between' alignItems='center'>
                        <Grid item>
                            <Link href='/acasa'>
                                <img src={logo} alt='logo' className={classes.logo} />
                            </Link>
                        </Grid>
                        {!isEmpty(profile) && <Grid item>
                            <Button
                                disableElevation
                                color='inherit'
                                size='large'
                                className={classes.button}
                                onClick={() => history.push('/contul-meu')}
                            >
                                <Typography variant='body1' className={classes.label}>
                                    {`Salut, ${capitalize(profile.firstName)}`}
                                </Typography>
                                <AccountCircle />
                            </Button>
                        </Grid>}
                    </Grid>
                </Toolbar>
            </AppBar>
        </>
    );
}


