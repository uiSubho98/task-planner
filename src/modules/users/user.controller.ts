import bcrypt from "bcrypt";
import { Response, Request } from "express";
import { ApiError } from "../../utils/ApiError";
import { ApiResponse } from "../../utils/ApiResponse";
import { asyncHandler } from "../../utils/AsyncHandler";
import { User } from "./user.model";

const generateAccessAndRefreshToken = async (userId: string) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      // Handle the case when user is null
      throw new ApiError(404, "User not found");
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    user.isLogin = true;

    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    // Handle other errors
    throw new ApiError(500, "Something went wrong while generating tokens");
  }
};

const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  if ([name, email, password].some((elem) => elem.trim() === "")) {
    throw new ApiError(400, "All field required");
  }
  const existedUser = await User.findOne({ email });
  if (existedUser) {
    throw new ApiError(400, "User with this email already exist");
  }

  const newUser = await User.create({
    name,
    email,
    password,
  });

  const createdUser = await User.findById(newUser._id).select(
    "-password -refreshToken"
  );
  if (!createdUser) {
    throw new ApiError(400, "Something went wrong while creating user");
  }
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered successfully"));
});

const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  if ([name, email, password].some((elem) => elem.trim() === "")) {
    throw new ApiError(400, "All field required");
  }
  if (!(name && email)) {
    throw new ApiError(400, "Name or Email is required");
  }
  if (!password) {
    throw new ApiError(400, "Password is required");
  }
  const user = await User.findOne({
    $or: [{ name }, { email }],
  });
  if (!user) {
    throw new ApiError(400, "User is not registered");
  }
  console.log(password);
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new ApiError(400, "Invalid Password");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "User log in successfully"
      )
    );
});

const getAllLoginUsers = asyncHandler(async (req: Request, res: Response) => {
  const loginUsers = await User.find({ isLogin: true });
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        loginUsers,
        " All Login Users Data Fetched successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.body.user._id,
    {
      $unset: { refreshToken: 1 }, // Use $unset to remove refreshToken
      $set: { isLogin: false }, // Set isLogin to false
    },
    {
      new: true,
    }
  );
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "User log out successfully"));
});

export { registerUser, loginUser, logoutUser, getAllLoginUsers };
