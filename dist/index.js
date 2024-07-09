"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const server_config_1 = require("./config/server.config");
const app = (0, express_1.default)();
app.get("/", (req, res) => {
    return res.status(200).json({
        status: 200,
        message: "Server is up and running!",
    });
});
app.listen(server_config_1.PORT, () => {
    return console.log(`Server is listening on ${server_config_1.PORT}`);
});
//# sourceMappingURL=index.js.map