import express from "express"
import { adminOnly } from "../middlewares/isAdmin.js"
import { createProduct, updateProduct, productPhotoUpdate, deleteProduct } from "../controllers/product.js"
import {upload} from "../middlewares/multer.js"
import {searchProduct, sortProduct} from "../controllers/searching&filtring.js"

const router = express.Router()

router.use(adminOnly)

router.post('/create-product', upload.single('photo'), createProduct)

router.patch('/update-product',updateProduct)

router.patch("/update-photo", upload.single("photo"), productPhotoUpdate)

router.delete("/delete-product", deleteProduct)


export default router