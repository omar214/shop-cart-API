const mongoose = require("mongoose");
const User = require('../models/userModel')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports.users_get_all = async (req, res) => {
    try {
        const users = await User.find({}, { email: 1, password: 1 });
        res.status(200).json({ message: "get users", users });
    } catch (error) {
        res.status(500).json({ message: "error getting users" })
    }
};

// single user
module.exports.users_get_user = async (req, res) => {
    const _id = req.params._id;
    if (!_id)
        res.status(500).json({ error: "id is required" });
    try {
        const user = await User.findById(_id, 'email');
        if (user)
            res.status(200).json(user);
        else
            res.status(404).json({ message: "user not found" });
    } catch (error) {
        res.status(500).json({ error: "cant find this user" });
    }

};

// add user
module.exports.users_login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password)
        return res.status(500).json({ message: "email & password are required" });

    const user = await User.findOne({ email })
    console.log(user);
    if (!user)
        return res.status(500).json({ message: "user not found" });

    try {
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            return res.status(500).json({ message: "invalid password" });

        console.log('login success', isMatch);
        const token = jwt.sign(
            {
                email: user.email,
                userId: user._id
            },
            process.env.JWT_SECRET_KEY,
            {
                expiresIn: "1h"
            }
        );
        return res.status(200).json({ message: "login success", user, token });
    } catch (error) {
        clg('error login' , error);
        return res.status(500).json({ message: "error comparing password" });

    }



    res.status(200).json({ message: "login success", user });
}
module.exports.users_create_user = async (req, res) => {
    let { email, password, isAdmin } = req.body;
    if (!email || !password)
        return res.status(500).json({ message: "email & password are required" });

    if (!isAdmin) isAdmin = false;
    if (await User.findOne({ email }))
        return res.status(500).json({ message: "email is already used" });

    // @TODO[1]  add email & password validation
    try {
        const hash = await bcrypt.hash(password, 10);
        password = hash;
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "error hashing password" });
    }

    let user = { email, password, isAdmin };
    try {
        // user = await new User(user).save();
        user = await User.create(user);
        res.status(200).json({ message: "user added", user });
    } catch (error) {
        res.status(500).json({ message: "error adding user" })
    }
};

//edit user
module.exports.users_edit_user = async (req, res) => {
    const _id = req.params._id;
    if (!_id)
        res.status(500).json({ error: "id is required" });

    let newUser = req.body;
    if (!newUser.email && !newUser.password && !newUser.isAdmin)
        res.status(500).json({ error: "missing values to edit" });

    // @TODO [3] hash the password before save

    // check if valid email
    try {
        const user = await User.findOne({ email: newUser.email });
        if (user) {
            console.log('invalid email')
            return res.status(500).json({ message: "email is already in use" });
        }
    } catch (error) {
        console.log('valid email');
    }

    try {
        const userFromDb = await User.findById({ _id });
        for (const key in newUser) {
            if (!User.schema.path(key)) {
                console.log('invalid field');
                return res.status(500).json({ msg: "invalid field to edit" });
            }
            userFromDb[key] = newUser[key];
        }
        newUser = await userFromDb.save();
        res.status(200).json({ msg: "newUser edit done", user: newUser });
    } catch (error) {
        console.log('error editing');
        res.status(500).json({ message: "error editing ", error })
    }
};

//delete user
module.exports.users_delete_user = async (req, res) => {
    const _id = req.params._id;
    if (!_id)
        return res.status(500).json({ error: "id is required" });
    if (!mongoose.isValidObjectId(_id))
        return res.status(500).json({ error: "invalid ID" });

    try {
        const user = await User.findById(_id);
        if (!user) {
            console.log('not found');
            return res.status(500).json({ message: "user not found" })
        }
        const deleted = await User.deleteOne({ _id });
        res.status(200).json({ message: "user deleted successfully" });
    } catch (error) {
        res.status(500).json({ error })
    }
}