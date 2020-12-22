import { Box, Container, Grid, Link, makeStyles, Typography } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import React, { useState, useReducer } from 'react';
import ResetPassword from './ResetPassword';
import SignIn from './SignIn';
import SignUp from './SignUp';
import logo from '../../assets/logo-cosmo-market.svg'
import { actionTypes, websiteAddress } from '../../utils/utils';


export const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
  },
  loginLogo: {
    margin: theme.spacing(3, 0),
    width: '80%',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  alert: {
    margin: theme.spacing(0, 1, 2),
  },
}));

const titles = {
  login: 'Conectează-te',
  resetPassword: 'Recuperare parolă',
  signUp: 'Creează cont',
}

function loginReducer(state, action) {
  switch (action.type) {
    case actionTypes.login:
      return { login: true, resetPassword: false, signUp: false, title: titles.login }
    case actionTypes.resetPassword:
      return { login: false, resetPassword: true, signUp: false, title: titles.resetPassword }
    case actionTypes.signUp:
      return { login: false, resetPassword: false, signUp: true, title: titles.signUp }
    default:
      console.log(`Unhandled type: ${action.type}`)
  }
}

function useLogin({ reducer = loginReducer } = {}) {
  const [{ login, resetPassword, signUp, title }, dispatch] = useReducer(reducer, { login: true, resetPassword: false, signUp: false, title: titles.login })

  const loginAction = () => dispatch({ type: actionTypes.login })
  const resetPasswordAction = () => dispatch({ type: actionTypes.resetPassword })
  const signUpAction = () => dispatch({ type: actionTypes.signUp })
  const dispatchAction = (actionType) => dispatch({ type: actionType })

  return { login, resetPassword, signUp, title, loginAction, resetPasswordAction, signUpAction, dispatchAction }
}


export default function LoginLogic() {
  const classes = useStyles();
  const { login, resetPassword, signUp, title, loginAction, resetPasswordAction, signUpAction, dispatchAction } = useLogin()

  const [alert, setAlert] = useState({
    message: '',
    severity: 'error'
  })

  function Copyright() {
    return (
      <Typography variant="body2" color="textSecondary" align="center">
        {'Copyright © '}
        <Link color="inherit" href={websiteAddress}>
          {websiteAddress}
        </Link>
        {' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    );
  }

  return (
    <Container maxWidth="sm">
      <Grid container direction='column' justify='center' spacing={2}>
        <Grid item className={classes.loginLogo}>
          <img src={logo} alt='logo' />
        </Grid>
        <Grid item>
          <Typography variant='h4' align='center' component='div'>
            <Box fontWeight='fontWeightBold'>
              {title}
            </Box>
          </Typography>
        </Grid>
        {
          alert.message && <Grid item>
            <Alert variant="filled" severity={alert.severity} className={classes.alert}>
              {alert.message}
            </Alert>
          </Grid>
        }
        {login && <Grid item><SignIn setAlert={setAlert} dispatchAction={dispatchAction} isCreateAccountDisabled={true} /></Grid>}
        {resetPassword && <Grid item><ResetPassword setAlert={setAlert} dispatchAction={dispatchAction} /></Grid>}
        {signUp && <Grid item><SignUp setAlert={setAlert} dispatchAction={dispatchAction} /></Grid>}
        <Grid item>
          <Box mt={8}>
            <Copyright />
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}