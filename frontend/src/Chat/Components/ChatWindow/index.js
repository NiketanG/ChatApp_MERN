import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import axios from 'axios';
import ScrollToBottom from 'react-scroll-to-bottom';

import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";
import Backdrop from '@material-ui/core/Backdrop';
import AttachmentIcon from '@material-ui/icons/Attachment';
import Typography from "@material-ui/core/Typography";

import TitleBar from "./TitleBar";
import { socket, socketAuth } from '../../../Socket';
import { addMessage } from '../../../actions';

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
    },
    titleBar: {

        alignSelf: 'flex-start',
    },
    sendMessageContainer: {
        alignSelf: 'flex-end',
        display: "flex",
        backgroundColor: "snow",
        padding: theme.spacing(2, 2, 6, 2),
        boxSizing: "border-box",
        [theme.breakpoints.down('xs')]: {
            width: '100vw'
        },
        width: "100%",
        height: "40px",
    },
    sendField: {
        marginRight: theme.spacing(1),
        flexGrow: 1,

    },
    sendButton: {
        borderRadius: "20px",
        height: "40px",
        width: "40px"
    },
    toolbar: theme.mixins.toolbar,
    messageContainer: {
        width: "100%",
        padding: theme.spacing(2),
        overflowY: 'auto',
        flexGrow: 1
    },
    message: {
        width: "100%",
        display: "block"
    },
    sender: {
        margin: theme.spacing(0.5, 0)
    },
    time: {
        margin: theme.spacing(0.5, 0)
    },
    messageText: {
        backgroundColor: "rgba(0,0,0,0.1)",
        padding: theme.spacing(1, 2),
        borderRadius: "20px"
    },
    messageBox: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        maxWidth: "100%",
        overflowX: "auto"
    },
    ownMessageBox: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        maxWidth: "100%",
        overflowX: "auto"
    },
    imageContainer: {
        width: "250px",
        margin: theme.spacing(2),
    },
    image: {
        borderRadius: "10px",
        maxWidth: "250px",
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
    viewImage: {
        maxWidth: '90vw',
        maxHeight: '90vh'
    }
}));

const Message = ({ sender, message, time }) => {
    const currentUser = useSelector(state => state.session.currentUser.username);

    const classes = useStyles();

    return (
        <div className={classes.message}>
            <div className={sender === currentUser ? (classes.ownMessageBox) : (classes.messageBox)}>
                <Typography color="textSecondary" variant="body2" className={classes.sender}>{sender === currentUser ? "You" : sender}</Typography>
                <Typography className={classes.messageText}>{message}</Typography>
                <Typography variant="body2" color="textSecondary" className={classes.time}>{new Date(time).toLocaleString()}</Typography>
            </div>
        </div>
    );
};

const Image = ({ sender, imageURL, time }) => {
    const currentUser = useSelector(state => state.session.currentUser.username);
    const [openImage, setOpenImage] = useState(false)
    const handleImageClose = (state) => {
        setOpenImage(state);
    };
    const classes = useStyles();
    return (
        <div className={classes.message}>
            <div className={sender === currentUser ? (classes.ownMessageBox) : (classes.messageBox)}>
                <Typography color="textSecondary" variant="body2" className={classes.sender}>{sender === currentUser ? "You" : sender}</Typography>
                <div className={classes.imageContainer}>

                    <img
                        className={classes.image}
                        src={imageURL}
                        alt={`Image sent by ${sender}`}
                        onClick={() => setOpenImage(true)}
                    />
                </div>
                <Typography variant="body2" color="textSecondary" className={classes.time}>{new Date(time).toLocaleString()}</Typography>
                {openImage ?
                    <ViewImage imageURL={imageURL} handleClose={handleImageClose} /> : null}
            </div>
        </div>
    );
};

const ViewImage = ({ imageURL, handleClose }) => {
    const classes = useStyles();
    const handleImageClose = () => {
        handleClose(false);
    };
    return (
        <div>
            <Backdrop className={classes.backdrop} open={true} onClick={handleImageClose}>
                <img src={imageURL} className={classes.viewImage} />
            </Backdrop>
        </div>

    )
}
const ChatWindow = ({ username, closeChat }) => {
    const classes = useStyles();

    const token = localStorage.getItem('token')
    const currentUser = useSelector(state => state.session.currentUser.username);
    const messageStore = useSelector(state => state.messages.messages);
    const dispatch = useDispatch();

    const [name, setName] = useState(username);
    const [online, setOnline] = useState(false);
    const [message, setMessage] = useState('');
    const [IsTyping, setIsTyping] = useState(false);
    const [messageList, setMessageList] = useState([]);
    const sendImage = useRef(null);
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        if (messageStore.length !== 0) {
            var tempMsg = messageStore.sort(function (a, b) { return new Date(a.time) - new Date(b.time) });
            add_Message(tempMsg.filter(obj => (obj.from === username && obj.to === currentUser) || (obj.to === username && obj.from === currentUser)));
        }

        axios.post('/api/user/get', { "username": username }).then(res => {
            setOnline(res.data.online);
            setName(res.data.name);
        });

        socket.on('TYPING', data => {
            setIsTyping(true)
        });
        socket.on('STOPPED_TYPING', data => {
            setIsTyping(false)
        });

    }, [username, messageStore]);

    const add_Message = (data) => {
        setMessageList(oldArray => data);
    };

    const sendMessage = () => {
        if (message.length > 0) {
            const msg = { "to": username, "from": currentUser, "message": message, "time": new Date().toISOString() }
            dispatch(addMessage(msg));
            socket.emit('SEND_MESSAGE', msg);
            setMessage('')
        }
    };

    const checkKeyPress = (e) => {
        if (e.which === 13) {
            sendMessage();
        }
    }

    const Typing = (e) => {
        setMessage(e);
        socket.emit('TYPING', username);
    }

    const selectImage = () => {
        sendImage.current.click();
    }

    const imageSelected = (event) => {
        event.stopPropagation();
        event.preventDefault();
        var file = event.target.files[0];

        var formData = new FormData();
        formData.append("file", file)
        formData.append("upload_preset", "chat_app")
        axios.post("https://api.cloudinary.com/v1_1/nikketan/image/upload", formData).then(res => {
            const msg = { "to": username, "from": currentUser, "type": "image", "message": res.data.secure_url, "time": new Date().toISOString() }
            dispatch(addMessage(msg));
            socket.emit('SEND_MESSAGE', msg);
            setMessage('')
        }).catch(err => {
            console.log(err)
        })


    }

    return (
        <div className={classes.root}>
            <TitleBar name={name} username={username} closeChat={closeChat} className={classes.titleBar} />
            <div className={classes.toolbar} />



            <ScrollToBottom className={classes.messageContainer}>

                {messageList.map(message => {
                    if (message.type === "image") {
                        return (<Image sender={message.from} imageURL={message.message} time={message.time} key={message.message} />)
                    } else {
                        return (
                            <Message sender={message.from} time={message.time} message={message.message} key={message.time} />
                        );
                    }
                })}

            </ScrollToBottom>

            <div className={classes.sendMessageContainer}>
                {/* <Button size="small">
                    <MoodRoundedIcon fontSize="large" />
                </Button> */}

                <div className={classes.sendField}>
                    <TextField
                        fullWidth
                        id="message-box"
                        label="Send a Message"
                        variant="outlined"
                        size="small"
                        value={message}
                        onChange={ev => Typing(ev.target.value)} onKeyPress={checkKeyPress}
                    />
                </div>
                <Button size="small" onClick={selectImage}>
                    <input
                        type='file'
                        id='file'
                        accept="image/*"
                        ref={sendImage} style={{ display: 'none' }}
                        onChange={(event) => imageSelected(event)}
                    />
                    <AttachmentIcon fontSize="large" />
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    className={classes.sendButton}
                    onClick={sendMessage}
                >
                    <Icon fontSize="small">send</Icon>
                </Button>
            </div>
        </div>
    );
};
export default ChatWindow;
