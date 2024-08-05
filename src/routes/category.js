import express from "express"
import { adminOnly } from "../middlewares/isAdmin.js"
import { createCategory } from "../controllers/category.js"

const router = express.Router()

router.use(adminOnly)

router.post('/create-category', createCategory)

export default router