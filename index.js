import express from "express";
import cors from "cors";
import multer from "multer";
import OpenAI from "openai";

const app = express();
const upload = multer();

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function clean(text) {
  return (text || "")
    .toLowerCase()
    .replace(/[.,!?]/g, "")
    .trim();
}

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.post("/pronounce", upload.single("audio"), async (req, res) => {
  try {
    if (!req.file) {
      return res.json({ strictOk: false, error: "No audio file" });
    }

    const targetText = req.body.targetText || "";
    const language = req.body.language || "de";

    const transcription = await openai.audio.transcriptions.create({
      file: req.file.buffer,
      model: "whisper-1",
      language: "de"
    });

    const recognizedText = transcription.text;

    const strictOk = clean(recognizedText) === clean(targetText);

    res.json({
      recognizedText,
      strictOk
    });

  } catch (err) {
    console.error(err);
    res.json({
      strictOk: false,
      error: String(err)
    });
  }
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log("running on " + PORT);
});
