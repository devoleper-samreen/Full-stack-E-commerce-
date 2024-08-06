import {AsyncHandler} from "../utils/AsyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {User} from "../models/user.js"
import nodemailer from "nodemailer"
import bcrypt from "bcrypt"
import crypto from "crypto"


const generateAccessAndRefereshToken = async (userId) => {

    try {
        const user = await User.findById(userId)
        
        if (!user) {
            throw new ApiError(400, "User not found");
        }
        console.log("yes here")

        const accessToken = await user.generateAccessToken()
        const refereshToken = await 
        user.generateRefereshToken()

        user.refereshToken = refereshToken

        await user.save({validateBeforeSave: false})

        return {accessToken, refereshToken}

    } catch (error) {
        throw new ApiError(400, "something went wrong")
    }
}

//*************************************/

const registerUser = AsyncHandler(async (req, res) => {
    //read details from frontend
    //sabhi required field mili ya nahi
    //abcheck karo kya ye user pehle se exist katrta hain
    //agar karta hain to error throw karo
    //uske baad user ko create karno

    const {name, email, password, gender} = req.body
    console.log("hii here 1")

    if ( !(name || email|| password || gender)) {
        throw new ApiError(400, "all field is required")
    }

    console.log("hii here 2")

    const existUser = await User.findOne({
        email: email, 
    })

    console.log("hii here 3")

    if ( existUser) {
        throw new ApiError(400, "email is already register")
    }

    console.log("hii here 4")

    const user = await User.create({
        name: name,
        email: email,
        password: password,
        gender: gender
    })

    console.log("hii here 5")

    const createdUser = await User.findById(user._id).select("-password")
    console.log("hii here 6")
    if ( !createdUser ) {
        throw new ApiError(400, "user not create")
    }
    console.log("hii here 7")

    res.status(200).json(
        new ApiResponse(200, createdUser, "user create successfully")
    )

})

//**********************************************/

const loginUser = AsyncHandler( async (req, res) => {
    //user se email password lo
    //check karo email exist karti hain ya nahi
    //password check karo wahi diya hain jo db mein save hain
    // 
    //access and refresh token generate karo
    //cookie send kaaro and user login ho gaya

    const {email, password} = req.body

    if ( !(email && password)) {
        throw new ApiError(400, "please provide email and password")
    }

    const isExists = await User.findOne({email: email})

    if ( !isExists ) {
        throw new ApiError(400, "user not register")
    }

    const isPasswordValid = await isExists.isPasswordCorrect(password)

    if ( !isPasswordValid ) {
        throw new ApiError(400, "password is wrong")
    }

    const {accessToken, refereshToken} = await generateAccessAndRefereshToken(isExists._id)

    const loggedIn = await User.findById(isExists._id)

    const options = {
        httpOnly: true,
        secure: true
    }

    res.status(200).cookie("accessToken", accessToken, options).cookie("refereshToken", refereshToken, options).json(
        new ApiResponse(200, loggedIn, "user logged in successfully")
    )

} )

//*****************************************/

const logoutUser = AsyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refereshToken: 1 //remove this field from db
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(200).clearCookie("accessToken", options).clearCookie("refreshToken", options).json(
        new ApiResponse(200, {}, "user loggout seccessfully"
    ))
 
})

//***************************************/

const forgetPassword = AsyncHandler(async (req, res) => {
    const {email} = req.body
    
    const user = await User.findOne({email})
    console.log("yes1")

    if(!user){
        throw new ApiError(404, "user not found")
    }

    console.log("yes2")

    const token = crypto.randomBytes(32).toString("hex")

    console.log("yes3")

    user.resetPasswordToken = token
    user.resetPasswordExpires = Date.now() + 3600000

    console.log("yes4")

    await user.save({validateBeforeSave: false})

    const transporter = nodemailer.createTransport(
        {
            service: "gmail",
            auth: {
                user: process.env.EMAIL_ADMIN,
                pass: process.env.EMAIL_PASS
            }
        }
    )

    const mailOptions = {
        to: user.email,
        from: process.env.EMAIL_ADMIN,
        subject: 'Password Reset',
        text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
               Please click on the following link, or paste this into your browser to complete the process:\n\n
               http://${req.headers.host}/reset/${token}\n\n
               If you did not request this, please ignore this email and your password will remain unchanged.\n`
      }

      transporter.sendMail(mailOptions, (err) => {
        if (err) {
            console.log(err)
          return res.status(500).json(
            new ApiError(500, "Error in sending email")            
        )
        }
        res.status(200).json(
            new ApiResponse(200, {}, "Password reset link has been sent to your email")
        )
      })
})

//**********************************************/

const resetPassword = AsyncHandler(async (req, res) => {

    const {token, newPassword, confirmPassword} = req.body

    if ( newPassword != confirmPassword) {
        throw new ApiError(400, "newPassword and confirmPassword is not same")
        
    }

    const user = await User.findOne(
        {
            resetPasswordToken: token
        }
    )

    if (Date.now() > user.resetPasswordExpires) {
        throw new ApiError(400, 'Token expired');
      }

    if ( !user ) {
        throw new ApiError(400, "invalid or expires token")
    }

    user.password = await bcrypt.hash(newPassword, 10)

    user.resetPasswordToken = undefined
    user.resetPasswordExpires = undefined

    await user.save({validateBeforeSave: false})

    res.status(200).json(
        new ApiResponse(200, newPassword, "Password has been reset successfully")
    )

})

//************************************************/

const updateProfile = AsyncHandler(async (req, res) => {

    const user = req.user

    const { name, email, password, gender} = req.body

    if (name){

        user.name = name
    }

    if (email){
        user.email = email
    }

    if (password){
        user.password = password
    }

    if(gender){
        user.gender = gender
    }

    await user.save({validateBeforeSave: false})

    res.status(200).json(
        new ApiResponse(200, user, 'Profile updated successfully')
        )
})

//**************************************************/

const viewUserProfile = AsyncHandler(async (req, res) => {

    const user = req.user

    if(!user){
        throw new ApiError(400, "user profile not found")
    }

    res.status(200).json(
        new ApiResponse(200, user, "user profile view successfully")
    )
})

export {registerUser, loginUser, logoutUser, forgetPassword, resetPassword, updateProfile, viewUserProfile}

