import express from "express"
import {addToCart, removeFromCart, getCartItems} from "../controllers/cart.js"

const router = express.Router()


router.post("/add-to-cart", addToCart)
router.delete("/delete-to-cart", removeFromCart)
router.get("/get-cart-items", getCartItems)


export default router