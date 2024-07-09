"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const server_config_1 = require("./config/server.config");
// import authRouter from "./routes/auth.routes";
// import messageRouter from "./routes/message.routes";
// import cookieParser from "cookie-parser";
// import cors from "cors";
const app = (0, express_1.default)();
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(express.text());
// app.use(cookieParser());
// app.use(
//   cors({
//     origin: true,
//     methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
//     credentials: true,
//   })
// );
app.get("/", (req, res) => {
    return res.status(200).json({
        status: 200,
        message: "Server is up and running!",
    });
});
// app.use("/api/auth", authRouter);
// app.use("/api/messages", messageRouter);
app.listen(server_config_1.PORT, () => {
    console.log(`Server is running on port ${server_config_1.PORT}`);
});
//# sourceMappingURL=index.js.map