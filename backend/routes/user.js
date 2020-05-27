const router = require("express").Router();
const auth = require("../middleware/verifyToken");
const bcrypt = require("bcryptjs");
const { User, validate, validateLogin, validateUpdate } = require("../models/user");

router.get('/account', auth, async (req, res) => {
    const user = await User.findById(req.user._id).select("-password -_id -__v");;
    res.send(user);
})

router.post('/register', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send("Email already exists");

    let userName = await User.findOne({ username: req.body.username });
    if (userName) return res.status(400).send("Username already taken");

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    user = new User({
        name: req.body.name,
        username: req.body.username.toLowerCase(),
        email: req.body.email,
        password: hashedPassword,
        online: false
    });
    await user.save();

    const token = user.generateAuthToken();
    res.header("auth-token", token).send({
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        online: user.online
    });
});

router.post("/login", async (req, res) => {
    const { error } = validateLogin(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ $or: [{ email: req.body.email }, { username: req.body.username, }] })
    if (!user) return res.status(401).send("User doesn't exists");

    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.status(401).send("Invalid password");

    const token = user.generateAuthToken();
    res.header("auth-token", token).send({
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        token: token,
        online: user.online
    });
});

router.post('/update', auth, async (req, res) => {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(400).send("User doesn't exists");

    const { error } = validateUpdate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    var newData = req.body;

    if (newData.hasOwnProperty('oldPassword') && newData.hasOwnProperty('newPassword')) {
        const validPass = await bcrypt.compare(req.body.oldPassword, user.password);
        if (!validPass) {
            return res.status(400).send("Invalid password");
        } else if (validPass) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newData['newPassword'], salt);
            newData['password'] = hashedPassword;
        }
        delete newData['oldPassword'];
        delete newData['newPassword'];
    }
    User.updateOne({ _id: user._id }, newData, (err, raw) => {
        console.log(err)
        console.log(raw)
    })
    res.status(200).send("Account updated");
});

router.post('/get', async (req, res) => {
    let user = await User.findOne({ username: req.body.username }).select("-password -email -_id -__v");
    if (!user) return res.status(400).send("User doesn't exist");
    res.status(200).send(user);
});


router.post("/search", auth, async (req, res) => {
    //Dont show search if query is empty or less than 2 chars
    //Show users from friends list first, then global users
    let user = await User.find({
        $and: [
            {
                $or: [
                    { name: { $regex: '.*' + req.body.query + '.*', $options: 'i' } },
                    { username: { $regex: '^' + req.body.query + '.*', $options: 'i' } }
                ]
            },
            { _id: { $ne: req.user._id } }
        ]
    }).select("-password -email -_id -__v");

    if (!user) return res.status(400).send("User doesn't exists");
    res.status(200).send(user);
});


module.exports = router;