import express from "express"
import {readLatestProduct, readAllProduct} from "../controllers/product.js"

const router = express.Router()


router.get('/latest-product', readLatestProduct)

router.get('/all-product', readAllProduct)

export default router