const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');


const JWT_SECRET = 'Syed123good';

// ROUTE 1: create a user using: POST "/api/auth/createuser". no login require Authantication

router.post('/createuser', [
    // if there are errors, return bad request and also error

    body('name', 'Enter Valid Name').isLength({ min: 5 }),
    body('email', 'Enter a valid Email').isEmail(),
    body('password', 'Password Must be be atleat 5 character').isLength({ min: 5 }),
], async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
    }
    try {
        // check email already exist or not
        let user = await User.findOne({ email: req.body.email });
        // console.log(user)
        if (user) {
            return res.status(400).json({ success, error: "Sorry a user with this email already exists" })
        }

        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);


        // create a new user
        user = await User.create({
            name: req.body.name,
            password: secPass,
            email: req.body.email,
        })

        const data = {
            user: {

                id: user.id
            }
        }

        const authtoken = jwt.sign(data, JWT_SECRET)

        // res.json({ user })
        success = true;
        res.json({ success, authtoken })
    }
    catch (error) {
        console.error(error.message)
        res.status(500).send("Internal Server Error");
    }
})

// ROUTE 2: Authenticate a user using POST "/api/auth/login", 

router.post('/login', [
    body('email', 'Enter a Valid Email').isEmail(),
    body('password', 'Password Cannot be blank').exists(),
], async (req, res) => {
    let success = false
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "Please try to login with correct credentials" })
        }
        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            success = false
            return res.status(404).json({ success, error: "Please try to login with correct credentials" })
        }
        const data = {
            user: {

                id: user.id
            }
        }

        const authtoken = jwt.sign(data, JWT_SECRET);
        success = true
        res.json({ success, authtoken })

    } catch (error) {
        console.error(error.message)
        res.status(500).send("Internal Server Error");
    }

})

// ROUTE 3: Get Loggedin User Detail using POST "/api/auth/getuser", Login Required

router.post('/getuser', fetchuser, async (req, res) => {
    try {
        userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        res.send(user)
    }
    catch (error) {
        console.error(error.message)
        res.status(500).send("Internal Server Error");
    }
})

module.exports = router