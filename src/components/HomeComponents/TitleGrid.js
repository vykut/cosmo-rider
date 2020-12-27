import { Box, Divider, Grid, IconButton, makeStyles, Typography } from '@material-ui/core'
import React from 'react'
import { useHistory } from 'react-router-dom'
import ArrowBackIcon from '@material-ui/icons/ArrowBack';


const useStyles = makeStyles((theme) => ({
    titleGrid: {
        padding: theme.spacing(2),
        // marginBottom: theme.spacing(2),
    },
}))

export default function TitleGrid({ title, showBack = false }) {
    const classes = useStyles()
    const history = useHistory()

    return (
        <Grid container item direction='column'>
            <Grid container item justify='space-between' alignItems='center' className={classes.titleGrid}>
                {showBack && <Grid item>
                    <IconButton className={classes.backButton} onClick={history.goBack} color='primary'>
                        <ArrowBackIcon />
                    </IconButton>
                </Grid>}
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
    )
}
