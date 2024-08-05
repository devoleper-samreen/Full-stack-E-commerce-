import { User } from "../models/user.js"
import { ApiError } from "../utils/ApiError.js"
//import { ApiResponse } from "../utils/ApiResponse.js"
import { AsyncHandler } from "../utils/AsyncHandler.js"

 const adminOnly =AsyncHandler ( async (req, res, next) => {
    
    const { id } = req.query

    if(!id){
        throw new ApiError(400, "you are not login")
    }
    

    const user = await User.findById(id)

    if(!user){
        throw new ApiError(400, "user not found")
    }

    if(user.role !== "admin"){

        throw new ApiError(400, "you are not admin")

    }

    next()
})

export {adminOnly}

