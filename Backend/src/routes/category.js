import express from "express"
import { adminOnly } from "../middlewares/isAdmin.js"
import { createCategory , deleteCategory, getAllCategory} from "../controllers/category.js"

const router = express.Router()

router.post('/create-category', adminOnly, createCategory)
router.delete('/delete-category', adminOnly, deleteCategory)
router.get("/get-category", getAllCategory)

export default router