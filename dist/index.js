"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const server_config_1 = require("./config/server.config");
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const message_routes_1 = __importDefault(require("./routes/message.routes"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(express.text());
// app.use(cookieParser());
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
app.use("/api/messages", message_routes_1.default);
app.listen(server_config_1.PORT, () => {
    console.log(`Server is running on port ${server_config_1.PORT}`);
});
//# sourceMappingURL=index.js.map