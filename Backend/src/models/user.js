import mongoose from "mongoose";
import validator from "validator"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const userSchema = new mongoose.Schema(
    {
    name: {
        type: String,
        required: [true, "please enter name"]
    },

    email: {
        type: String,
        unique: [true, "email already exist"],
        required: [true, "please enter email"],
        //validate: validator.default.isEmail,
    },
    password: {
        type: String,
        required: [true,"please enter your password" ]
    },
    gender: {
        type: String,
        enum: ["male", "female"],
        required: [true, "please enter your gender"]
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user"
    }
    }, 
    {
        timestamps: true,
    }
);

//**************************************************/

userSchema.pre("save", async function(next){
    if ( this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10)
    }
    next()
})

//***************************************************/

userSchema.methods.isPasswordCorrect = async function(password){
    return  bcrypt.compare(password, this.password)
}

//***************************************************/

userSchema.methods.generateAccessToken = function(){
    
    return jwt.sign(
        {
            _id: this._id,
            name: this.name,
            email: this.email
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: '1h'
        }
    )
}

//*****************************************************/

userSchema.methods.generateRefereshToken = function(){

    return jwt.sign(
        {
            _id: this._id,
            name: this.name,
            email: this.email
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: '10d'
        }
    )

    //*************************************************/
}

const User = mongoose.model("User", userSchema);

export {User}