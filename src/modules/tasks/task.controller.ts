import { Request, Response } from "express";
import { ApiError } from "../../utils/ApiError";
import { asyncHandler } from "../../utils/AsyncHandler";
import { Task } from "./task.model";

const createTask = asyncHandler(async (req: Request, res: Response) => {
  const {
    task_id,
    task_description,
    task_deadline_date,
    task_createdBy,
    task_assignedTo,
    task_priority,
    task_comments,
  } = req.body;

  if (
    !(
      task_id &&
      task_description &&
      task_deadline_date &&
      task_createdBy &&
      task_assignedTo &&
      task_priority
    )
  ) {
    throw new ApiError(400, "All Fields are Required");
  }

  const newTask = await Task.create({
    task_id,
    task_description,
    task_deadline_date,
    task_createdBy,
    task_assignedTo,
    task_priority,
    task_comments,
  });
  return res
    .status(200)
    .json(new ApiResponse(200, newTask, "Task Created Successfully"));
});
