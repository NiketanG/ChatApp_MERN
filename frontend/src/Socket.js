import socketIOClient from "socket.io-client";

const socket = socketIOClient.connect('/');

// const socket = socketIOClient({
//     transportOptions: {
//         polling: {
//             extraHeaders: {
//                 'auth-token': localStorage.getItem('token')
//             }
//         }
//     }
// }).connect('/')

const socketAuth = () => {
    socket.io.opts.transportOptions = {
        polling: {
            extraHeaders: {
                'auth-token': localStorage.getItem('token')
            },
        },
    };
    socket.disconnect();
    socket.open();
}

export { socket, socketAuth }