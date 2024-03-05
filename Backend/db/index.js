const mongoose = require("moongoose");

mongoose.connect("mongodb://localhost:27017/paytm");

const userSchema = mongoose.Schema({
    username: {
        type:String,
        required:true,
        unique: true,
        trim: true,
        lowercase: true,
        minLength: 3,
        maxLength: 30
    },
    password:{
        type:String,
        required:true,
        minLength:6
    },
    fullName: {
        type : String,
        required: true,
        trim: true,
        maxLength: 50
    },
})

const User = mongoose.model("User",userSchema)

module.exports = {
    User
}


