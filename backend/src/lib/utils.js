import jwt from 'jsonwebtoken'

export const generateToken = (user,res) => {
    try {
    //userId is taken as payload - unique identifier
    const token = jwt.sign({userId: user._id, role: user.role},process.env.JWT_SECRET,{
        expiresIn: "7d"
    })

    res.cookie("jwt",token,{
        maxAge:7*24*60*60*1000,

        //The other options are to enhance safety
        httpOnly:true,
        sameSite:"none",
        secure:process.env.NODE_ENV === "development" ? false:true
    })
} catch (error) {
    console.log('Error in generateToken utils')
    return res.status(500).json({message:"Internal Server Error"})
}
}