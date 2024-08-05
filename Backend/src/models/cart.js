import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema(
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },
        quantity: {
            type: Number,
            default: 1,
            required: true
        }
    },
    {
        timestamps: true
    }
)

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    items: [cartItemSchema]
});

const Cart = mongoose.model("Cart", cartSchema)
const CartItem = mongoose.model("CartItem", cartItemSchema)

export {CartItem, Cart}