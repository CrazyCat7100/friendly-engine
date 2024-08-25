import express from "express";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Connect to MongoDB with the hardcoded URI
mongoose
  .connect("mongodb+srv://1:1@leaderboard.orui4.mongodb.net/?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("Error connecting to MongoDB:", error));

// Middleware
app.use(express.static(path.join(__dirname, "static")));
app.set("view engine", "ejs");
app.use(express.json()); // Built-in JSON parser

// Define a schema and model
const ScoreSchema = new mongoose.Schema({
  username: String,
  score: Number,
});

const Score = mongoose.model("Score", ScoreSchema);

// Routes
app.get("/", async (req, res) => {
  try {
    const topScores = await Score.find().sort({ score: -1 }).limit(10);
    res.render("index", { topScores });
  } catch (error) {
    console.error("Error fetching scores:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/score", async (req, res) => {
  const { username, score } = req.body;

  if (!username || score === undefined) {
    return res.status(400).json({ success: false, message: "Invalid data" });
  }

  try {
    const user = await Score.findOne({ username });
    if (user) {
      if (user.score < score) {
        await Score.updateOne({ username }, { score });
      }
      return res.json({ success: true });
    }
    const newScore = new Score({ username, score });
    await newScore.save();
    res.json({ success: true });
  } catch (error) {
    console.error("Error saving score:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Start the server
const PORT = 1000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
