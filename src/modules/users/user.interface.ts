import { Document } from "mongoose";

interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  refreshToken?: string; // Add this line
  isLogin?: boolean; // Add this line
  comparePassword(password: string): Promise<boolean>;
  generateAccessToken(): string;
  generateRefreshToken(): string;
}

export default IUser;
