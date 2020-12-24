import logo from '../../assets/logo-app-bar-cosmo-market.svg';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { Link } from '@material-ui/core';

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
}));

export default function Header() {
    const classes = useStyles();

    return (
        <>
            <AppBar position="sticky" >
                <Toolbar className={classes.toolbar}>
                    <Link href='/acasa'>
                        <img src={logo} alt='logo' className={classes.logo} />
                    </Link>
                </Toolbar>
            </AppBar>
        </>
    );
}


