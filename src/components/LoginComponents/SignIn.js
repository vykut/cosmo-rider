import { Button, Container, Grid, Link, makeStyles, TextField } from '@material-ui/core';
import React, { useState } from 'react'
import { useFirebase } from "react-redux-firebase";
import { actionTypes, timeout } from '../../utils/utils';
import GoogleButton from 'react-google-button'
import { Redirect } from 'react-router-dom';
import { useHistory } from "react-router-dom";
import { firebaseFunctions } from '../..';


export const useStyles = makeStyles((theme) => ({
    form: {
        width: '100%',
        marginTop: theme.spacing(1),
        // marginBottom: theme.spacing(),
    },
    submit: {
        margin: theme.spacing(3, 0, 3),
    },
}));


export default function SignIn({ setAlert, dispatchAction, isCreateAccountDisabled = false }) {
    const classes = useStyles();
    const firebase = useFirebase();
    const history = useHistory()

    const [form, setForm] = useState({})
    const [loading, setLoading] = useState(false)

    const onChangeForField = fieldName => ({ target }) => setForm(state => ({ ...state, [fieldName]: target.value }));

    async function handleSubmit(e) {
        e.preventDefault()

        try {
            setLoading(true)
            await firebase.login({
                email: form.email.trim(),
                password: form.password.trim()
            })
            let token = await firebase.auth().currentUser.getIdTokenResult()
            if (token.claims.admin || token.claims.rider) {
                setAlert({ severity: 'success', message: 'Te-ai conectat cu succes.' })
                timeout(500)
                    .then(() => {
                        history.push('/acasa')
                    })
            } else {
                setAlert({ severity: 'error', message: 'Nu aveți drepturile necesare pentru a accesa această pagină' })
                firebase.logout()
            }
        } catch (error) {
            setAlert({ severity: 'error', message: error.message })
        }
        setLoading(false)
    }

    async function handleGoogleSignIn() {
        firebase.login({
            provider: 'google',
            type: 'popup',
        })
            .then(resp => {
                console.log(resp)
                setAlert({ severity: 'success', message: 'Te-ai conectat cu succes.' })
            })
    }

    return (
        <Container component="main" maxWidth="xs">
            <form className={classes.form} onSubmit={handleSubmit}>
                <Grid container direction='column' justify='space-between' alignItems='center'>
                    <Grid item style={{ width: '100%' }}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            onChange={onChangeForField('email')}
                        />
                    </Grid>
                    <Grid item style={{ width: '100%' }}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Parolă"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            onChange={onChangeForField('password')}
                        />
                    </Grid>
                    <Grid item style={{ width: '100%' }}>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                            disabled={loading}
                        >
                            Intră în cont
                </Button>
                    </Grid>
                    <Grid item>
                        <GoogleButton
                            onClick={handleGoogleSignIn}
                            style={{ marginBottom: 16 }}
                        />
                    </Grid>
                </Grid>
            </form>
            <Grid container justify='flex-end'>
                <Grid item>
                    <Link variant="body2" color='error' href='#' onClick={() => { dispatchAction(actionTypes.resetPassword); setAlert({}) }}>
                        Ai uitat parola?
                        </Link>
                </Grid>
                {!isCreateAccountDisabled && <Grid item>
                    <Link variant="body2" color='primary' onClick={() => { dispatchAction(actionTypes.signUp); setAlert({}) }}>
                        Nu ai cont? Fă-ți unul acum
                        </Link>
                </Grid>}
            </Grid>

        </Container>
    )
}
