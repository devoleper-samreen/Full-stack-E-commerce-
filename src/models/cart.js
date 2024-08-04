import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema(
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product"
        },
        quantity: {
            type: Number,
            default: 1
        }
    },
    {
        timestamps: true
    }
)

const cartItem = mongoose.model("CartItem", cartItemSchema)

export {cartItem}