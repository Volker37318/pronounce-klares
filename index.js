import express from "express";
import cors from "cors";
import multer from "multer";

const app = express();
const upload = multer();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.post("/pronounce", upload.single("audio"), (req, res) => {
  res.json({ ok: true });
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log("running on " + PORT);
});
