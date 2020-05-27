import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles(theme => ({
    titleBar: {
        left: '0',
        [theme.breakpoints.down('xs')]: {
            width: '100%',
        },
        width: '360px',

    },
    title: {
        flexGrow: 1
    }
}));

const ChatBar = ({ logout }) => {
    const classes = useStyles();

    return (
        <div>
            <AppBar position="fixed" className={classes.titleBar}>
                <Toolbar>
                    <Typography variant="h6" className={classes.title}>
                        Chat
                    </Typography>
                    <Button color="inherit" onClick={logout}>Log out</Button>
                </Toolbar>
            </AppBar>
        </div>
    );
};

export default ChatBar;
