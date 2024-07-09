import express from "express";
import { login, logout, signup } from "../controllers/auth.controllers";
// import { protectRoute } from "../middlewares/protectRoute";

const authRouter = express.Router();

// authRouter.get("/me", protectRoute, getMe);
authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.get("/logout", logout);

export default authRouter;
