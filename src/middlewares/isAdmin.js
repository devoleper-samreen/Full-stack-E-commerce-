import { User } from "../models/user.js"

 const adminOnly = async (req, res, next) => {
    
    const { id } = req.query;

    if(!id){
        console.log("login kar pehle")
        return next()
    }

    const user = await User.findById(id) 
    
    if(!user){
        console.log("fake id deta hain saale")
        return next()
    }

    if(user.role !== "admin"){
        console.log("you are not admin")
        return next()
    }

    next()
}

export {adminOnly}

