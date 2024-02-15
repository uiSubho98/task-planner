import { Router } from "express";
import { registerUser } from "../modules/users/user.controller";

const router = Router();

router.route("/register").post(registerUser);

export default router;
