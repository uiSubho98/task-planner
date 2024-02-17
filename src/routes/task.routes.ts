import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware";
import {
  createTask,
  addComment,
  findTaskByAssignedTo,
  findAllTasks,
  updateTaskPriority,
  updateTaskStatus,
  deleteTask,
} from "../modules/tasks/task.controller";

const router = Router();

router.route("/createtask").post(verifyJWT, createTask);
router.route("/addcomment").post(verifyJWT, addComment);
router.route("/updatePriority").post(verifyJWT, updateTaskPriority);
router.route("/updateTaskStatus").post(verifyJWT, updateTaskStatus);
router.route("/deleteTask").post(verifyJWT, deleteTask);
router.route("/findTasks/:id").get(verifyJWT, findTaskByAssignedTo);
router.route("/get-all-tasks").get(verifyJWT, findAllTasks);

export default router;
