import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        name:{
            type: String,
            required: true
        },

        price:{
            type: Number,
            required: true
        },

        description:{
            type: String,
            required: true
        }, 
        photo:{
            data: Buffer,
            contentType: String
        },
        quantity:{
            type: Number,
            required: true
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category"
        }
    },
     {timestamp: true}
)

export const Product = mongoose.model("Product", productSchema);
