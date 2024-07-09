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
exports.protectRoute = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = __importDefault(require("../db/prisma"));
const protectRoute = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({
                status: 401,
                message: "Unauthorized, Token Not Found",
            });
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({
                status: 401,
                message: "Unauthorized, Token Invalid",
            });
        }
        const user = yield prisma_1.default.user.findUnique({
            where: {
                id: decoded.userId,
            },
            select: {
                id: true,
                fullName: true,
                username: true,
                gender: true,
                profilePic: true,
            },
        });
        if (!user) {
            return res.status(401).json({
                status: 401,
                message: "Unauthorized, User Not Found",
            });
        }
        req.user = user;
        next();
    }
    catch (error) {
        console.error("Error in protectRoute : ", error.message);
        return res.status(500).json({
            status: 500,
            message: error.message || "Internal Server Error",
        });
    }
});
exports.protectRoute = protectRoute;
//# sourceMappingURL=protectRoute.js.map