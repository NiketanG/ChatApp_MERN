import React, { useState } from 'react';
import { Avatar, Button, CssBaseline, TextField, FormControlLabel, Checkbox, Grid, Box, Typography, Container, Link, CircularProgress, Snackbar } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginUser } from '../../actions';

import { socket, socketAuth } from '../../Socket';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}
function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="https://bit.ly/nikketan">
                Nikketan Gulekar
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
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    progress: {
        marginRight: theme.spacing(2),
        marginBottom: '-2px'
    }
}));

const SignIn = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setrememberMe] = useState(false);
    const [isLoggingIn, setisLogginIn] = useState(false);
    const [isLoggedIn, setisLoggedIn] = useState(false);
    const [isValidUser, setisValidUser] = useState(true);
    const classes = useStyles();
    const dispatch = useDispatch();

    const signIn = (ev) => {
        setisLogginIn(true);
        axios.post('/api/user/login', { username: username, password: password })
            .then(res => {
                if (res.status === 200) {
                    localStorage.setItem("token", res.data.token);
                    localStorage.setItem("currentUser", res.data.username);
                    dispatch(loginUser(res.data));
                    setisValidUser(true);
                    setisLoggedIn(true);
                    socketAuth();
                }
            }).catch((err) => {
                console.log(err)
                if (err.response) {
                    if (err.response.status === 401) {
                        setisValidUser(false);
                    }
                }
            });
        setisLogginIn(false);
    };


    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Snackbar
                    open={isLoggedIn}
                    autoHideDuration={6000}
                    anchorOrigin={{ "vertical": "bottom", "horizontal": "center" }}
                >
                    <Alert severity="success">
                        Signed In !
                    </Alert>
                </Snackbar>
                {isLoggedIn ? <Redirect to="/Chat" /> : null}

                <Snackbar
                    open={!isValidUser}
                    autoHideDuration={6000}
                    anchorOrigin={{ "vertical": "bottom", "horizontal": "center" }}
                >
                    <Alert severity="error">
                        Incorrect Username or Password
                    </Alert>
                </Snackbar>

                <Typography component="h1" variant="h5">Sign In</Typography>

                <form className={classes.form} method="post" onSubmit={(ev) => { ev.preventDefault(); signIn(); }}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required fullWidth
                        id="username"
                        label="Username or Email"
                        name="username"
                        autoComplete="email"
                        autoFocus
                        value={username}
                        onChange={(ev) => setUsername(ev.target.value)}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
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
                    <FormControlLabel
                        checked={rememberMe}
                        control=
                        {<Checkbox

                            color="primary" />}
                        label="Remember Me"
                        onChange={(ev) => setrememberMe(ev.target.checked)}
                    />

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >


                        {
                            isLoggingIn ? <span>< CircularProgress color="inherit" size="1rem" thickness={5} className={classes.progress} />Signing In</span> : 'Sign In'
                        }
                    </Button>

                    <Grid container>
                        <Grid item xs>
                            {/* <Link href="" variant="body2">Forgot Password?</Link> */}
                        </Grid>
                        <Grid item>
                            <Link href="/signup" variant="body2">{"Don't have an account? Sign Up"}</Link>
                        </Grid>
                    </Grid>
                </form>

            </div>
            <Box mt={8}>
                <Copyright />
            </Box>

        </Container >
    );
}

export default SignIn;