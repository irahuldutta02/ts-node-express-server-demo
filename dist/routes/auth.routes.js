"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controllers_1 = require("../controllers/auth.controllers");
const protectRoute_1 = require("../middlewares/protectRoute");
const authRouter = express_1.default.Router();
authRouter.get("/me", protectRoute_1.protectRoute, auth_controllers_1.getMe);
authRouter.post("/signup", auth_controllers_1.signup);
authRouter.post("/login", auth_controllers_1.login);
authRouter.get("/logout", auth_controllers_1.logout);
exports.default = authRouter;
//# sourceMappingURL=auth.routes.js.map