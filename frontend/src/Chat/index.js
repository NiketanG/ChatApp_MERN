import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';

import CssBaseline from '@material-ui/core/CssBaseline';

import axios from 'axios';

import { socket, socketAuth } from '../Socket';
import ChatList from "./Components/ChatList";
import ChatWindow from "./Components/ChatWindow";

import { useDispatch, useSelector } from 'react-redux';
import { loginUser, addMessage, clearMessages } from '../actions';
import { Typography, Hidden } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    content: {
        flexGrow: 1,
        boxSizing: 'border-box',
        [theme.breakpoints.down('xs')]: {
            maxWidth: '100vw'
        },
        maxWidth: 'calc(100vw - 360px)',
    },
    NoChatSelected: {
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center'
    },
}));

const NoChatSelected = () => {
    const classes = useStyles();
    return (
        <div className={classes.NoChatSelected}>
            <Typography className={classes.NoChatSelectedText} variant="h5">Select a User from the List, or Search using Username to Chat.</Typography>

        </div>
    )
}

const Chat = () => {
    const [chatSelected, setChatSelected] = useState("")
    const [recents, setRecents] = useState([])

    const [loggedIn, setIsLoggedIn] = useState(true);
    const currentUser = localStorage.getItem('currentUser')

    const token = localStorage.getItem('token')
    const dispatch = useDispatch();
    const messageStore = useSelector(state => state.messages.messages);

    const classes = useStyles();

    const selectChat = (user) => {
        setChatSelected(user);
    }
    const closeChat = () => {
        setChatSelected("");
    }

    useEffect(() => {
        socketAuth();
        if (token !== null) {
            axios.get('/api/user/account', { headers: { "auth-token": token } })
                .then(res => {
                    if (res.status === 200) {
                        localStorage.setItem("currentUser", res.data.username)
                        setIsLoggedIn(true);
                        dispatch(loginUser({ ...res.data, 'token': token }));
                    }
                }).catch((err) => {
                    console.log(err)
                    if (err.response) {
                        console.log(err.response)
                        setIsLoggedIn(false);
                    }
                });

            axios.get('/api/chats/get', { headers: { "auth-token": token } }).then(res => {
                if (res.status === 200) {
                    // setMessages(res.data);
                    var msg = res.data
                    msg.map(msg => {
                        if (messageStore.some(obj => obj.to === msg.to && obj.from === msg.from && obj.message === msg.message && obj.time === msg.time)) {
                            console.log("Message already in msgstore")
                        } else {
                            dispatch(addMessage(msg))
                        }
                    });

                }
            }).catch((err) => {
                console.log(err)
                if (err.response) {
                    console.log(err.response);
                }
            });
        } else {
            setIsLoggedIn(false)
        }

        socket.on('RECEIVE_MESSAGE', data => {
            dispatch(addMessage(data));
        });

    }, [token]);


    useEffect(() => {
        if (currentUser !== null) {
            let userList = []
            var tempMsg = messageStore.sort(function (a, b) { return new Date(a.time) - new Date(b.time) }).reverse();
            tempMsg.forEach(msg => {
                const user = msg.to === currentUser ? msg.from : msg.to
                if (!(userList.find(el => el.user === user))) {
                    userList.push({ user: user })
                }
            });
            setRecents(userList);
        }
    }, [messageStore]);

    return (
        <div className={classes.root}>
            {!loggedIn ? <Redirect to="/Home" /> : null}
            <CssBaseline />

            {chatSelected !== "" ?
                <Hidden xsDown>
                    <ChatList recents={recents} selectChat={selectChat} className={classes.chatList} />
                </Hidden>
                :
                <ChatList recents={recents} selectChat={selectChat} className={classes.chatList} />
            }


            <main className={classes.content}>

                {chatSelected === '' ?
                    <Hidden xsDown>
                        <NoChatSelected />
                    </Hidden>
                    :
                    <ChatWindow username={chatSelected} closeChat={closeChat} />}
            </main>

        </div>
    )

};


export default Chat;