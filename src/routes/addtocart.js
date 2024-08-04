import express from "express"
import {addToCart} from "../controllers/addToCart.js"

const router = express.Router()


router.get("/add-to-cart", addToCart)


export default router