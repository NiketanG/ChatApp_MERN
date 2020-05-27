const router = require("express").Router();
const auth = require("../middleware/verifyToken");
const { User } = require("../models/user");
const { Message } = require("../models/message");

router.get('/get', auth, async (req, res) => {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(400).send("User doesn't exist");
    const messages = await Message.find({ $or: [{ to: user.username }, { from: user.username }] }).sort({ time: -1 });
    res.status(200).send(messages);
});

router.get('/recents', auth, async (req, res) => {
    const currentUser = await User.findById(req.user._id).select("-password");
    if (!currentUser) return res.status(400).send("User doesn't exist");

    const messages = await Message.find({ $or: [{ to: currentUser.username }, { from: currentUser.username }] }).sort({ time: -1 });

    let users = [];
    messages.forEach(msg => {
        let user = (msg.to === currentUser.username ? (msg.from === currentUser.username ? null : msg.from) : msg.to);
        if (!(users.includes(user))) {
            users.push(user)
        }
    });

    let usersToFind = await User.find({ username: { $in: users } }).select("-password -_id -__v -email");
    res.status(200).send(usersToFind);
});

router.post('/upload_image', auth, async (req, res) => {
    const currentUser = await User.findById(req.user._id).select("-password");
    if (!currentUser) return res.status(400).send("User doesn't exist");

    console.log(req.files)
})
module.exports = router;
