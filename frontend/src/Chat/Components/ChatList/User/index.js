import React from "react";
import { deepOrange, deepPurple } from "@material-ui/core/colors";

import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Avatar from "@material-ui/core/Avatar";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({

    divider: {
        margin: theme.spacing(1)
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
const User = ({ user, handleListItemClick }) => {
    const classes = useStyles();

    return (
        <div>
            <ListItem button onClick={() => handleListItemClick(user)}>
                <ListItemIcon>
                    <Avatar className={classes.purple} alt={user.toUpperCase()}>{user.charAt(0).toUpperCase()}</Avatar>
                </ListItemIcon>
                <ListItemText primary={user} />
            </ListItem>
            <Divider className={classes.divider} />
        </div>
    );
};

export default User;
