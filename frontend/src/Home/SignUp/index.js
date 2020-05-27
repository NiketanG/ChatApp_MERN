import React, { useState } from 'react';
import { Avatar, Button, CssBaseline, TextField, Grid, Box, Typography, Container, Link, CircularProgress, Snackbar } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import { Redirect } from 'react-router-dom';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="https://material-ui.com/">
                Your Website
        </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    progress: {
        marginRight: theme.spacing(2),
        marginBottom: '-2px'
    }
}));

const SignUp = () => {
    const classes = useStyles();
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    //const [confirmPassword, setConfirmPassword] = useState('');
    const [isSigningUp, setisSigningUp] = useState(false);
    const [signedUp, setsignedUp] = useState(false)
    const [error, seterror] = useState('');

    const signUp = (ev) => {
        setisSigningUp(true);
        axios.post('/api/user/register', { email: email, name: name, username: username, password: password })
            .then(res => {
                if (res.status === 200) {
                    setsignedUp(true);
                }
            }).catch((err) => {
                if (err.response) {
                    if (err.response.status === 401) {
                        seterror(err.response.data);
                        setsignedUp(false);
                    }
                    console.log(err.response.data)
                }
            });
        setisSigningUp(false);
    };

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign up
                </Typography>

                <Snackbar
                    open={signedUp}
                    autoHideDuration={6000}
                    anchorOrigin={{ "vertical": "bottom", "horizontal": "center" }}
                >
                    <Alert severity="success">
                        Signed Up !
                    </Alert>
                </Snackbar>

                {signedUp ? <Redirect to="/Login" /> : null}
                <Snackbar
                    open={error === '' ? false : true}
                    autoHideDuration={6000}
                    anchorOrigin={{ "vertical": "bottom", "horizontal": "center" }}
                >
                    <Alert severity="error">
                        {error}
                    </Alert>
                </Snackbar>
                <form className={classes.form} method="post" onSubmit={(ev) => { ev.preventDefault(); signUp(); }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                autoComplete="name"
                                name="name"
                                variant="outlined"
                                required
                                fullWidth
                                id="name"
                                label="Name"
                                autoFocus
                                value={name}
                                onChange={(ev) => setName(ev.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                autoComplete="username"
                                name="username"
                                variant="outlined"
                                required
                                fullWidth
                                id="username"
                                label="Username"
                                value={username}
                                onChange={(ev) => setUsername(ev.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="email"
                                type="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                value={email}
                                onChange={(ev) => setEmail(ev.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                value={password}
                                onChange={(ev) => setPassword(ev.target.value)}
                            />
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        {
                            isSigningUp ? <span>< CircularProgress color="inherit" size="1rem" thickness={5} className={classes.progress} />Signing Up</span> : 'Sign Up'
                        }
                    </Button>
                    <Grid container justify="flex-end">
                        <Grid item>
                            <Link href="/login" variant="body2">
                                Already have an account? Sign in
                                </Link>
                        </Grid>
                    </Grid>
                </form>
            </div>
            <Box mt={5}>
                <Copyright />
            </Box>
        </Container >
    );
}
export default SignUp;