import { Schema, model, Types } from "mongoose";
import { ITask, TaskPriority } from "./task.interface";

const taskSchema = new Schema<ITask>({
  task_id: {
    type: String,
    required: true,
  },
  task_description: {
    type: String,
    required: true,
  },
  task_deadline_date: {
    type: String,
    required: true,
  },
  task_createdBy: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  task_assignedTo: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  task_comments: {
    type: String,
  },
  task_priority: {
    type: String,
    enum: Object.values(TaskPriority),
    requried: true,
  },
});

const Task = model<ITask>("Task", taskSchema);

export { Task };
