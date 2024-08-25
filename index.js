import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";

let app = express();

// Connect to MongoDB
mongoose
  .connect(
    "mongodb+srv://1:1@leaderboard.orui4.mongodb.net/?retryWrites=true&w=majority&appName=leaderboard",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

// Middleware
app.use(express.static("./static"));
app.set("view engine", "ejs");
app.use(bodyParser.json());

// Define a schema and model
const Schema = mongoose.Schema;

const ScoreSchema = new Schema({
  username: String,
  score: Number,
});

const Score = mongoose.model("Score", ScoreSchema);

// Add a sample score to the database (this can be removed after testing)
const newScore = new Score({
  username: "alex",
  score: 50,
});

newScore.save();

// Routes
app.get("/", async function (req, res) {
  try {
    // Fetch top 10 scores, sorted by score in descending order
    const topScores = await Score.find().sort({ score: -1 }).limit(213049758203948);

    // Render the index.ejs and pass the topScores
    res.render("index.ejs", { topScores });
  } catch (error) {
    console.error("Error fetching scores:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Route to handle saving scores
app.post("/score", async (req, res) => {
  const { username, score } = req.body;

  if (!username || score === undefined) {
    return res.status(400).json({ success: false, message: "Invalid data" });
  }

  try {
    const user = await Score.findOne({
      username: username,
    });
    if (user) {
      if (user.score <= score) {
        return res.json(
          await Score.updateOne(
            {
              username,
            },
            {
              score: score,
            }
          )
        );
      }

      else {
        return res.json({
          success: true,
        });
      }
      

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
app.listen("1000", () => {
  console.log("Server running at http://localhost:1000");
});
