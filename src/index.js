import express from "express";

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Basic Route
app.get("/", (req, res) => {
    res.send("Server is running 🚀");
});

// Another Route
app.get("/api", (req, res) => {
    res.json({ message: "Hello from API" });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});