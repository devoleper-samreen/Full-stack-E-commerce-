import {AsyncHandler} from "../utils/AsyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {User} from "../models/user.js"


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
        secure: false
    }

    res.status(200).cookie("accessToken", accessToken, options).cookie("refereshToken", refereshToken, options).json(
        new ApiResponse(200, loggedIn, "user logged in successfully")
    )

} )

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
        secure: false
    }

    return res.status(200).clearCookie("accessToken", options).clearCookie("refreshToken", options).json(
        new ApiResponse(200, {}, "user loggout seccessfully"
    ))
 
})

export {registerUser, loginUser, logoutUser}

