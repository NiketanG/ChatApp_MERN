import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { logoutUser, clearMessages } from '../../../actions';

import TextField from "@material-ui/core/TextField";
import List from '@material-ui/core/List';
import { makeStyles } from "@material-ui/core/styles";

import axios from 'axios';

import { socket, socketAuth } from '../../../Socket';
import ChatBar from "./ChatBar";
import User from "./User";

const useStyles = makeStyles(theme => ({
    root: {
        borderRight: '0.5px solid rgba(0,0,0,0.3)',
        [theme.breakpoints.down('xs')]: {
            width: '100%',
            border: 'none'
        },
        width: '360px',
        height: '100vh',
        overflowY: 'auto',

    },
    searchContainer: {
        margin: theme.spacing(1),
    },
    usersContainer: {
        padding: theme.spacing(1)
    },
    toolbar: theme.mixins.toolbar
}));

const ChatList = ({ recents, selectChat }) => {
    const classes = useStyles();
    const token = localStorage.getItem('token');
    const dispatch = useDispatch();
    const [query, setQuery] = useState('');
    const [users, setUsers] = useState([]);
    const [SearchResults, setSearchResults] = useState([]);
    const [loggedIn, setIsLoggedIn] = useState(true);

    useEffect(() => {
        setUsers(recents)
    }, [recents]);

    const handleListItemClick = (index) => {
        selectChat(index);
        setQuery("");
        setSearchResults([])
    };

    const logout = () => {
        dispatch(logoutUser());
        dispatch(clearMessages());
        socket.disconnect();
        setIsLoggedIn(false);
    };

    const search = (val) => {
        setQuery(val);
        if (val.length === 0) {
            setSearchResults([]);
        } else {
            axios.post('/api/user/search', { "query": val }, { headers: { "auth-token": token } }).then(res => {
                setSearchResults(res.data.map(el => (el.username)))

            }).catch((err) => {
                if (err.response) {
                    console.log(err.response)
                }
            });
        }
    }
    return (
        <div className={classes.root}>
            <ChatBar className={classes.appbar} logout={logout} />
            <div className={classes.toolbar} />
            <div className={classes.searchContainer}>
                <TextField
                    fullWidth
                    id="search-box"
                    label="Search"
                    variant="outlined"
                    value={query} onChange={(ev) => search(ev.target.value)}
                />
            </div>
            <div className={classes.usersContainer}>
                <List component="nav" aria-label="main mailbox folders">
                    {SearchResults.map(user => {
                        return (
                            <User user={user} handleListItemClick={handleListItemClick} key={user} />
                        );
                    })}
                    {SearchResults.length > 0 ? null :
                        (
                            users.map(user => {
                                return (
                                    <User user={user.user} handleListItemClick={handleListItemClick} key={user.user} />
                                );
                            })
                        )
                    }
                </List>
            </div>
        </div>
    );
};
export default ChatList;
