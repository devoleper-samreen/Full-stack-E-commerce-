import { User } from "../models/user.js"
import { ApiError } from "../utils/ApiError.js"
import { AsyncHandler } from "../utils/AsyncHandler.js"
import jwt from "jsonwebtoken"

 const adminOnly =AsyncHandler ( async (req, res, next) => {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("bearer ", "")

    if(!token){
        throw new ApiError(401, "you are not login")
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

    const user = await User.findById(decoded?._id)

    if(!user){

        throw new ApiError(404, "user not found")
    }

    if(user.role !== "admin"){

        throw new ApiError(403, "you are not admin")

    }
    
    req.user = user

    next()
})

export {adminOnly}

