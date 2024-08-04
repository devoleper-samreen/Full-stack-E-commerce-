import express from "express";
import { registerUser, loginUser, logoutUser } from "../controllers/user.js";
import { verifyjwt } from "../middlewares/verifyjwt.js";


const router = express.Router();

router.post("/register", registerUser)

router.post("/login", loginUser)
router.post("/logout", verifyjwt, logoutUser)

export default router