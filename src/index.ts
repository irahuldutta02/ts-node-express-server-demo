import express from "express";
import { PORT } from "./config/server.config";

const app = express();

app.get("/", (req, res) => {
  return res.status(200).json({
    status: 200,
    message: "Server is up and running!",
  });
});

app.listen(PORT, () => {
  return console.log(`Server is listening on ${PORT}`);
});
