import express from "express";
import { matchRouter } from "./routes/matches.js";


const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Basic Route
app.get("/", (req, res) => {
    res.send("Server is running 🚀");
});

app.use('/matches', matchRouter)

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});