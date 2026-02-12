import express from "express";
import cors from "cors";
import multer from "multer";
import OpenAI from "openai";
import { Readable } from "stream";

const app = express();
const upload = multer();

app.use(cors());

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
      return res.json({ strictOk: false, error: "No audio file received" });
    }

    const targetText = req.body.targetText || "";

    // 👇 Buffer in Stream umwandeln (wichtig!)
    const audioStream = Readable.from(req.file.buffer);

    const transcription = await openai.audio.transcriptions.create({
      file: audioStream,
      model: "whisper-1",
      language: "de",
    });

    const recognizedText = transcription.text;

    const strictOk = clean(recognizedText) === clean(targetText);

    res.json({
      recognizedText,
      strictOk,
    });

  } catch (err) {
    console.error(err);
    res.json({
      strictOk: false,
      error: String(err),
    });
  }
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log("running on " + PORT);
});
