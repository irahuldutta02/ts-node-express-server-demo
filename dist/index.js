"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const server_config_1 = require("./config/server.config");
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
// import messageRouter from "./routes/message.routes";
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.text());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: true,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    credentials: true,
}));
app.get("/", (req, res) => {
    return res.status(200).json({
        status: 200,
        message: "Server is up and running!",
    });
});
app.use("/api/auth", auth_routes_1.default);
// app.use("/api/messages", messageRouter);
app.listen(server_config_1.PORT, () => {
    console.log(`Server is running on port ${server_config_1.PORT}`);
});
//# sourceMappingURL=index.js.map