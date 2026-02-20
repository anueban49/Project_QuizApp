import express from "express";
import cors from "cors";

const app = express();
const PORT = 4049;

app.use(express.json());
app.listen(PORT, () => {
  console.log("example app listening on port 4049");
});
