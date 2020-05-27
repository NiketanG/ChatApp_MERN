import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import { ArrowBack } from "@material-ui/icons";

import { deepOrange, deepPurple } from "@material-ui/core/colors";
import Avatar from "@material-ui/core/Avatar";

const useStyles = makeStyles(theme => ({
    titleBar: {
        [theme.breakpoints.down('xs')]: {
            width: '100vw'
        },
        width: 'calc(100vw - 360px)'
    },
    orange: {
        color: theme.palette.getContrastText(deepOrange[500]),
        backgroundColor: deepOrange[500]
    },
    purple: {
        color: theme.palette.getContrastText(deepPurple[500]),
        backgroundColor: deepPurple[500]
    }
}));

const ChatBar = ({ name, username, closeChat }) => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <AppBar position="fixed" className={classes.titleBar}>
                <Toolbar>
                    <IconButton
                        edge="start"
                        className={classes.menuButton}
                        color="inherit"
                        aria-label="menu"
                        onClick={closeChat}
                    >
                        <ArrowBack />
                    </IconButton>
                    <IconButton edge="start" className={classes.menuButton}>
                        <Avatar className={classes.orange} alt={name} >{name.charAt(0)}</Avatar>
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                        {name}
                    </Typography>
                </Toolbar>
            </AppBar>
        </div>
    );
};

export default ChatBar;
