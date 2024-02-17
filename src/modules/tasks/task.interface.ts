import { Document, Types, Schema } from "mongoose";
enum TaskPriority {
  LOW = "Low",
  MEDIUM = "Medium",
  HIGH = "High",
}
interface ITaskComment {
  userId: Schema.Types.ObjectId;
  comment: string;
  createdAt: string;
}
enum TaskStatus {
  TODO = "Todo",
  PENDING = "Pending",
  COMPLETE = "Complete",
}

interface ITask extends Document {
  task_id: string;
  task_description: string;
  task_deadline_date: string;
  task_createdBy: Schema.Types.ObjectId;
  task_assignedTo: Schema.Types.ObjectId;
  task_comments?: ITaskComment[];
  task_priority: TaskPriority;
  task_status: TaskPriority;
}

export { ITask, TaskPriority, TaskStatus };
