import express from "express";
import { registerUser, loginUser, logoutUser, forgetPassword, resetPassword, updateProfile, viewUserProfile} from "../controllers/user.js";
import { verifyjwt } from "../middlewares/verifyjwt.js"

const router = express.Router();

router.post("/register", registerUser)
router.post("/login", loginUser)
router.post("/logout", verifyjwt, logoutUser)
router.post("/forget-password", forgetPassword)
router.post("/reset-password", resetPassword)
router.patch("/update-profile", verifyjwt, updateProfile)
router.get("/view-profile", verifyjwt, viewUserProfile)

export default router