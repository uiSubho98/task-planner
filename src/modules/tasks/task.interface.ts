import { Document, Types, Schema } from "mongoose";
enum TaskPriority {
  LOW = "Low",
  MEDIUM = "Medium",
  HIGH = "High",
}

interface ITask extends Document {
  task_id: string;
  task_description: string;
  task_deadline_date: string;
  task_createdBy: Schema.Types.ObjectId;
  task_assignedTo: Schema.Types.ObjectId;
  task_comments?: string;
  task_priority: TaskPriority;
}

export { ITask, TaskPriority };
