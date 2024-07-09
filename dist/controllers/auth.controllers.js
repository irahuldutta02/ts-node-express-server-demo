"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.login = exports.signup = void 0;
const prisma_1 = __importDefault(require("../db/prisma"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const generateToken_1 = require("../utils/generateToken");
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
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fullName, username, password, confirmPassword, gender } = req.body;
        if (!fullName || !username || !password || !confirmPassword || !gender) {
            return res.status(400).json({
                status: 400,
                message: `${!fullName ? "fullName" : ""} , ${!username ? "username" : ""} , ${!password ? "password" : ""} , ${!confirmPassword ? "confirmPassword" : ""} , ${!gender ? "gender" : ""} is required`,
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
                message: "Password should be at least 6 characters, at most 16 characters, at least one number, one lowercase and one uppercase letter",
            });
        }
        if (gender !== "male" && gender !== "female") {
            return res.status(400).json({
                status: 400,
                message: "Gender should be 'male' or 'female' only",
            });
        }
        const user = yield prisma_1.default.user.findUnique({ where: { username } });
        if (user) {
            return res.status(400).json({
                status: 400,
                message: "Username already exists",
            });
        }
        const salt = yield bcryptjs_1.default.genSalt(10);
        const hashedPassword = yield bcryptjs_1.default.hash(password, salt);
        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;
        const newUser = yield prisma_1.default.user.create({
            data: {
                fullName,
                username,
                password: hashedPassword,
                gender,
                profilePic: gender === "male" ? boyProfilePic : girlProfilePic,
            },
        });
        if (newUser) {
            (0, generateToken_1.generateToken)(newUser.id, res);
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
        }
        else {
            return res.status(400).json({
                status: 400,
                message: "User not created",
            });
        }
    }
    catch (error) {
        console.error("Error is signup : ", error.message);
        return res.status(500).json({
            status: 500,
            message: error.message || "Internal Server Error",
        });
    }
});
exports.signup = signup;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({
                status: 400,
                message: `${!username ? "username" : ""} , ${!password ? "password" : ""} is required`,
            });
        }
        const user = yield prisma_1.default.user.findUnique({ where: { username } });
        if (!user) {
            return res.status(400).json({
                status: 400,
                message: "User not found",
            });
        }
        const isMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                status: 400,
                message: "Invalid password",
            });
        }
        (0, generateToken_1.generateToken)(user.id, res);
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
    }
    catch (error) {
        console.error("Error in login : ", error.message);
        return res.status(500).json({
            status: 500,
            message: error.message || "Internal Server Error",
        });
    }
});
exports.login = login;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.clearCookie("jwt");
        return res.status(200).json({
            status: 200,
            message: "Logout successful",
        });
    }
    catch (error) {
        console.error("Error in logout : ", error.message);
        return res.status(500).json({
            status: 500,
            message: error.message || "Internal Server Error",
        });
    }
});
exports.logout = logout;
//# sourceMappingURL=auth.controllers.js.map