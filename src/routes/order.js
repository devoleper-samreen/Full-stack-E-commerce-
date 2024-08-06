import express from "express"
import { createOrder } from "../controllers/order.js"
import { verifyjwt } from "../middlewares/verifyjwt.js"

const router = express.Router()

router.post("/create-order", verifyjwt, createOrder)