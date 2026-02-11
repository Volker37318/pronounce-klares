import express from "express";
import cors from "cors";
import multer from "multer";

const app = express();
const upload = multer({ limits: { fileSize: 25 * 1024 * 1024 } });

/* =====================================================
   ✅ CORS – EXTREM WICHTIG
   erlaubt NUR deine Netlify Domain
===================================================== */

const allowedOrigins = [
  "https://klares-deutsch-im-job.netlify.app",
  "http://localhost:8888",
  "http://127.0.0.1:8888"
];

app.use(cors({
  origin: function(origin, cb){
    if(!origin || allowedOrigins.includes(origin)){
      cb(null, true);
    } else {
      cb(null, true); // für Tests erstmal offen
    }
  },
  methods:["GET","POST","OPTIONS"],
  allowedHeaders:["Content-Type","x-pronounce-secret"]
}));

app.options("*", cors());

/* =====================================================
   HEALTH CHECK (Koyeb braucht das!)
===================================================== */

app.get("/health", (req,res)=>{
  res.json({ ok:true });
});

/* =====================================================
   🎤 /pronounce (Dummy Version – zum Testen)
   später kannst du Azure / Whisper einbauen
===================================================== */

app.post("/pronounce", upload.single("audio"), async (req,res)=>{

  const target = req.body.targetText || "";

  // 👉 erstmal nur Testantwort
  res.json({
    strictOk: true,
    recognizedText: target,
    overallAccuracy: 100
  });

});

/* =====================================================
   SERVER START
===================================================== */

const PORT = process.env.PORT || 8000;

app.listen(PORT, ()=>{
  console.log("pronounce-klares running on port", PORT);
});

