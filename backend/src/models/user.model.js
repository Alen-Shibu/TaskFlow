import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required:true
    },
    role:{
        type: String,
        enum: ["admin","member"],
        default: "member"
    }
},
{
    timestamps: true
})

const User = mongoose.model("User",userSchema)

export default User