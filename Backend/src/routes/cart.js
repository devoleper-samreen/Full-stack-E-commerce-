import express from "express"
import {addToCart, removeFromCart} from "../controllers/cart.js"

const router = express.Router()


router.get("/add-to-cart", addToCart)

router.delete("/delete-to-cart", removeFromCart)


export default router