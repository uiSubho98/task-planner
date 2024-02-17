import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getAllLoginUsers,
  getAllUsers,
  findUserById,
} from "../modules/users/user.controller";
import verifyJWT from "../middlewares/auth.middleware";
const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/all-login-users").get(verifyJWT, getAllLoginUsers);
router.route("/get-all-users").get(verifyJWT, getAllUsers);
router.route("/:id").get(verifyJWT, findUserById);
router.route("/logout").post(verifyJWT, logoutUser);

export default router;
