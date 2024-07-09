import { Request, Response } from "express";
import prisma from "../db/prisma";
import bcryptjs from "bcryptjs";
import { generateToken } from "../utils/generateToken";

// export const getMe = async (req: Request, res: Response) => {
//   try {
//     const user = await prisma.user.findUnique({
//       where: { id: req.user.id },
//       select: {
//         id: true,
//         fullName: true,
//         username: true,
//         gender: true,
//         profilePic: true,
//       },
//     });

//     if (!user) {
//       return res.status(400).json({
//         status: 400,
//         message: "User not found",
//       });
//     }

//     return res.status(200).json({
//       status: 200,
//       data: user,
//     });
//   } catch (error: any) {
//     console.error("Error in getMe : ", error.message);
//     return res.status(500).json({
//       status: 500,
//       message: error.message || "Internal Server Error",
//     });
//   }
// };

export const signup = async (req: Request, res: Response) => {
  try {
    const { fullName, username, password, confirmPassword, gender } = req.body;

    if (!fullName || !username || !password || !confirmPassword || !gender) {
      return res.status(400).json({
        status: 400,
        message: `${!fullName ? "fullName" : ""} , ${
          !username ? "username" : ""
        } , ${!password ? "password" : ""} , ${
          !confirmPassword ? "confirmPassword" : ""
        } , ${!gender ? "gender" : ""} is required`,
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        status: 400,
        message: "Password and Confirm Password should be same",
      });
    }

    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,16}$/;

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        status: 400,
        message:
          "Password should be at least 6 characters, at most 16 characters, at least one number, one lowercase and one uppercase letter",
      });
    }

    if (gender !== "male" && gender !== "female") {
      return res.status(400).json({
        status: 400,
        message: "Gender should be 'male' or 'female' only",
      });
    }

    const user = await prisma.user.findUnique({ where: { username } });

    if (user) {
      return res.status(400).json({
        status: 400,
        message: "Username already exists",
      });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
    const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

    const newUser = await prisma.user.create({
      data: {
        fullName,
        username,
        password: hashedPassword,
        gender,
        profilePic: gender === "male" ? boyProfilePic : girlProfilePic,
      },
    });

    if (newUser) {
      generateToken(newUser.id, res);

      return res.status(200).json({
        status: 200,
        message: "User created successfully",
        data: {
          id: newUser.id,
          fullName: newUser.fullName,
          username: newUser.username,
          gender: newUser.gender,
          profilePic: newUser.profilePic,
        },
      });
    } else {
      return res.status(400).json({
        status: 400,
        message: "User not created",
      });
    }
  } catch (error: any) {
    console.error("Error is signup : ", error.message);
    return res.status(500).json({
      status: 500,
      message: error.message || "Internal Server Error",
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        status: 400,
        message: `${!username ? "username" : ""} , ${
          !password ? "password" : ""
        } is required`,
      });
    }

    const user = await prisma.user.findUnique({ where: { username } });

    if (!user) {
      return res.status(400).json({
        status: 400,
        message: "User not found",
      });
    }

    const isMatch = await bcryptjs.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        status: 400,
        message: "Invalid password",
      });
    }

    generateToken(user.id, res);

    return res.status(200).json({
      status: 200,
      message: "Login successful",
      data: {
        id: user.id,
        fullName: user.fullName,
        username: user.username,
        gender: user.gender,
        profilePic: user.profilePic,
      },
    });
  } catch (error: any) {
    console.error("Error in login : ", error.message);
    return res.status(500).json({
      status: 500,
      message: error.message || "Internal Server Error",
    });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    res.clearCookie("jwt");

    return res.status(200).json({
      status: 200,
      message: "Logout successful",
    });
  } catch (error: any) {
    console.error("Error in logout : ", error.message);
    return res.status(500).json({
      status: 500,
      message: error.message || "Internal Server Error",
    });
  }
};
