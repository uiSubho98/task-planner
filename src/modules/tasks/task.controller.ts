import { Request, Response } from "express";

import { ObjectId } from "bson";
import { ApiError } from "../../utils/ApiError";
import { ApiResponse } from "../../utils/ApiResponse";
import { asyncHandler } from "../../utils/AsyncHandler";
import { Task } from "./task.model";
import { TaskPriority } from "./task.interface";
import { TaskStatus } from "./task.interface";

const createTask = asyncHandler(async (req: Request, res: Response) => {
  const {
    task_id,
    task_description,
    task_deadline_date,
    task_assignedTo,
    task_priority,
    task_comments,
    task_status,
  } = req.body.payload;

  console.log(req.body);

  if (
    !(
      task_id &&
      task_description &&
      task_deadline_date &&
      task_assignedTo &&
      task_priority &&
      task_status
    )
  ) {
    const missingFields = [];
    if (!task_id) missingFields.push("task_id");
    if (!task_description) missingFields.push("task_description");
    if (!task_deadline_date) missingFields.push("task_deadline_date");
    if (!task_assignedTo) missingFields.push("task_assignedTo");
    if (!task_priority) missingFields.push("task_priority");
    if (!task_status) missingFields.push("task_status");

    throw new ApiError(
      400,
      `Missing required fields: ${missingFields.join(", ")}`
    );
  }

  const existedTask = await Task.findOne({ task_id });
  console.log(existedTask);
  if (existedTask) {
    throw new ApiError(400, `Task Already exists: ${task_id}`);
  }

  const comments = task_comments || [];

  const newTask = await Task.create({
    task_id,
    task_description,
    task_deadline_date,
    task_createdBy: req.body.user._id,
    task_assignedTo,
    task_priority,
    task_comments: comments,
    task_status,
  });
  return res
    .status(200)
    .json(new ApiResponse(200, newTask, "Task Created Successfully"));
});

const addComment = asyncHandler(async (req: Request, res: Response) => {
  const { task_id, task_comment } = req.body.payload;
  console.log(req.body);
  if (!task_id) {
    throw new ApiError(400, "Task Id is required");
  }
  if (!task_comment) {
    throw new ApiError(400, "Comment is required");
  }

  if (req.body.user._id !== task_comment.userId) {
    throw new ApiError(400, "Access Denied");
  }

  const task = await Task.updateOne(
    { task_id },
    {
      $push: {
        task_comments: {
          userId: task_comment.userId,
          comment: task_comment.comment,
          createdAt: task_comment.createdAt,
        },
      },
    },
    { new: true }
  );
  if (!task) {
    throw new ApiError(404, `Task not found with ID: ${task_id}`);
  }
  return res
    .status(200)
    .json(new ApiResponse(200, task, "Comment Added Successfully"));
});

const findTaskByAssignedTo = asyncHandler(
  async (req: Request, res: Response) => {
    const user_id = req.params.id;
    if (!user_id) {
      throw new ApiError(400, "Invalid User Id");
    }
    try {
      const tasks = await Task.find({ task_assignedTo: new ObjectId(user_id) });
      return res
        .status(200)
        .json(new ApiResponse(200, tasks, "Task Fetched Successfully"));
    } catch (error) {
      // console.error(error);
      throw new ApiError(400, "Something went wrong while searching task");
    }
  }
);
const findAllTasks = asyncHandler(async (_, res: Response) => {
  const tasks = await Task.find({});
  return res
    .status(200)
    .json(new ApiResponse(200, tasks, "Tasks Fetched Successfully"));
});

const updateTaskPriority = asyncHandler(async (req: Request, res: Response) => {
  const { priority, task_id } = req.body.payload;
  // console.log(req.body.user._id);
  if (!(priority && task_id)) {
    throw new ApiError(400, "All Field Required");
  }
  const task = await Task.findOne({ task_id });
  if (!task) {
    throw new ApiError(400, "Task not found");
  }
  // console.log(task.task_createdBy);

  if (req.body.user._id.toString() !== task.task_createdBy.toString()) {
    throw new ApiError(400, "Access Denied");
  }

  const allowedPriorities = Object.values(TaskPriority);

  if (!allowedPriorities.includes(priority)) {
    throw new ApiError(400, "Invalid task priority");
  }
  const updatedTask = await Task.findOneAndUpdate(
    { task_id },
    { task_priority: priority },
    { new: true }
  );

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedTask, "Task Priority Updated Successfully")
    );
});

const updateTaskStatus = asyncHandler(async (req: Request, res: Response) => {
  const { task_status, task_id } = req.body.payload;
  // console.log(req.body.user._id);
  if (!(task_status && task_id)) {
    throw new ApiError(400, "All Field Required");
  }
  const task = await Task.findOne({ task_id });
  if (!task) {
    throw new ApiError(400, "Task not found");
  }
  // console.log(task.task_createdBy);

  if (req.body.user._id.toString() !== task.task_assignedTo.toString()) {
    throw new ApiError(400, "Access Denied");
  }

  const allowedPriorities = Object.values(TaskStatus);

  if (!allowedPriorities.includes(task_status)) {
    throw new ApiError(
      400,
      `Invalid task status ${task_status} ${allowedPriorities}`
    );
  }
  const updatedTask = await Task.findOneAndUpdate(
    { task_id },
    { task_status },
    { new: true }
  );

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedTask, "Task Status Updated Successfully")
    );
});

const deleteTask = asyncHandler(async (req: Request, res: Response) => {
  const { task_id } = req.body.payload;
  if (task_id.trim() === "" || !task_id) {
    throw new ApiError(400, "Task Id is required");
  }
  const task = await Task.findOne({ task_id });
  if (!task) {
    throw new ApiError(400, "Task not found");
  }
  if (req.body.user._id.toString() !== task.task_createdBy.toString()) {
    throw new ApiError(400, "Access Denied");
  }
  await Task.deleteOne({ task_id });
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Task Deleted SuccessFully"));
});

export {
  createTask,
  addComment,
  findTaskByAssignedTo,
  findAllTasks,
  updateTaskPriority,
  updateTaskStatus,
  deleteTask,
};
