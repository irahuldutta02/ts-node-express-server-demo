"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const message_controllers_1 = require("../controllers/message.controllers");
const protectRoute_1 = require("../middlewares/protectRoute");
const messageRouter = express_1.default.Router();
messageRouter.get("/conversations", protectRoute_1.protectRoute, message_controllers_1.getUsersForSidebar);
messageRouter.get("/:id", protectRoute_1.protectRoute, message_controllers_1.getMessages);
messageRouter.post("/send/:id", protectRoute_1.protectRoute, message_controllers_1.sendMessage);
exports.default = messageRouter;
//# sourceMappingURL=message.routes.js.map