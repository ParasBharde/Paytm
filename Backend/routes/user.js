const express = require("express");
const { User, Account } = require("../db");
const zod = require("zod");
const { JWT_SECRET } = require("../config");
const  jwt  = require("jsonwebtoken");
const { authMiddleware } = require("../middleware");
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

const updatebodySchema = zod.object({
    fullname: zod.string().optional(),
    password: zod.string().optional()
})

router.post("/signup", async (req, res) => {
    const { success } = signUpSchema.safeParse(req.body)
    if (!success) {
        return res.json({
            message: "Email ALready Taken / Incorrect Input"
        })
    }

    const existingUser = User.findOne({
        username: req.body.username
    })
    console.log('existingUser',existingUser)
  
    if (existingUser) {
        return res.json({
            message: "Email ALready Taken"
        })
    }

    const dbUser = await User.create({
        username: req.body.username,
        password: req.body.password,
        fullname: req.body.fullname,
    });
    console.log('dbUser',dbUser)

    const userId = dbUser._id

    await Account.create({
        userId: userId,
        balance: 1 + Math.random() * 10000
    })

    const token = jwt.sign({
         userId
    }, JWT_SECRET)
    res.json({
        message: "User Created Successfully",
        token: token
    })
})

router.post("/signin", async (req, res) => {
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
            userId:checkUser._id,
            token: token
        })
    }

    res.status(411).json({
        message: "Error While logging in"
    })
})

router.put('/update-user', authMiddleware, async (req, res) => {
    try {
        const { success } = updatebodySchema.safeParse(req.body);
        if (!success) {
            return res.status(411).json({
                message: "Error while updating information"
            });
        }

        // Use findOneAndUpdate to update the user based on the userId
        const updatedUser = await User.findOneAndUpdate(
            { _id: req.userId }, // query condition
            { $set: req.body },   // update with the request body
            { new: true }         // return the updated document
        );

        if (!updatedUser) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.json({
            message: "Updated successfully",
            user: updatedUser
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
});

router.get("/allusers", async (req, res) => {
    const filter = req.query.filter || "";
    const users = await User.find({ 
        $or: [{
            fullname : {
                "$regex" : filter
            }
        }]
    })
    
    res.json({
        user: users.map(user => ({
            username: user.username,
            fullname: user.fullname,
            _id: user._id
        }))
    })
})

module.exports = router