import express from "express"
import {searchProduct, sortProduct} from "../controllers/searching&filtring.js"

const router = express.Router()

//search
router.get("/search-product", searchProduct)

//sort
router.get("/sort-product", sortProduct)


export default router