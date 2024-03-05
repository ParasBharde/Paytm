const express = require("express");
const { User } = require("../db");
const zod = require("zod");
const { JWT_SECRET } = require("../config");
const { jwt } = require("jsonwebtoken");
const router = express.Router();

const signUpSchema = zod.object({
    username: zod.string().email(),
    fullname: zod.string(),
    password: zod.string()
})

const signInSchema = zod.object({
    username: zod.string().email(),
    password: zod.string()
})

router.post("signup", async (req, res) => {
    const body = req.body;
    const { success } = signUpSchema.safeParse(body)
    if (!success) {
        return res.json({
            message: "Email ALready Taken / Incorrect Input"
        })
    }

    const existingUser = User.findOne({
        username: body.username
    })
    if (existingUser._id) {
        return res.json({
            message: "Email ALready Taken"
        })
    }

    const dbUser = await User.create(body);
    const token = jwt.sign({
        userId: dbUser._id
    }, JWT_SECRET)
    res.json({
        message: "User Created Successfully",
        token: token
    })
})

router.post("signin", async (req, res) => {
    const body = req.body;
    const { success } = signInSchema.safeParse(body)

    if (!success) {
        return res.status(411).json({
            message: "Incorrect inputs"
        })
    }

    const checkUser = await User.findOne({
        username: body.username,
        password: body.password
    })

    if (checkUser) {
        const token = jwt.sign({
            userId: checkUser._id
        }, JWT_SECRET)

        res.json({
            username: body.username,
            password: body.password,
            token: token
        })
    }

    res.status(411).json({
        message:"Error While logging in"
    })
})

module.exports = router