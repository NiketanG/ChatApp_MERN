var express = require("express");
var app = express();
const server = require("http").Server(app)
const dotenv = require("dotenv");
var io = require('socket.io')(server);
const mongoose = require("mongoose");
const Users = require("./models/user").User;
const Message = require("./models/message").Message;
const userRoute = require("./routes/user");
const msgRoute = require("./routes/chat");
const jwt = require("jsonwebtoken");

const path = require('path');
app.use(express.static(path.join(__dirname, '../frontend/build')))

dotenv.config();

mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false }, () => {
    console.log("Connected to DB")
});

app.use(express.json());
app.use("/api/user", userRoute);
app.use("/api/chats", msgRoute);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'))
});

app.get('/Home', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'))
});

app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'))
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'))
});


app.get('/Chat', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'))
});


server.listen(process.env.PORT || 8000, () => {
    console.clear();
    console.log("Server is up and running on Port", process.env.PORT || 8000);
})

io.on('connection', async (socket) => {
    let clientId = socket.handshake.headers['auth-token'];
    let validToken;
    try {
        validToken = jwt.verify(clientId, process.env.SECRET_KEY);
        console.log(validToken, "IN")
    } catch (err) {
        console.log("Invalid Token")
        socket.disconnect()
        return;
    }

    const user = await Users.findByIdAndUpdate(validToken._id, { online: true }).select("-password");
    socket.join(user.username);

    socket.on('SEND_MESSAGE', async (data) => {
        var message;
        if (data.type === "image") {
            message = new Message({
                to: data.to,
                from: data.from,
                type: "image",
                message: data.message,
                time: data.time,
                read: false
            })
        } else {
            message = new Message({
                to: data.to,
                from: data.from,
                message: data.message,
                time: data.time,
                read: false
            });
        }

        await message.save();


        socket.to(data.to).emit('RECEIVE_MESSAGE', data);
    });

    socket.on('TYPING', (data) => {
        socket.to(data).emit('TYPING', data);
    });

    socket.on('STOPPED_TYPING', (data) => {
        socket.to(data).emit('STOPPED_TYPING', data);
    });

    socket.on("disconnect", async (data) => {
        const user = await Users.findByIdAndUpdate(validToken._id, { online: false }).select("-password");
        console.log(validToken, "OUT")
    });
});

