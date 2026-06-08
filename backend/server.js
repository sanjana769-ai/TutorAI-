const express = require("express");
const bodyParser = require("body-parser");
const { spawn } = require("child_process");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post("/chat", (req, res) => {
    const userMessage = req.body.message;


    let result = "";

    const python = spawn("python", ["tutor.py", userMessage]);

    python.stdout.on("data", (data) => {
        result += data.toString();
    });

    python.on("close", () => {
res.json({ reply: result.trim() });
    });
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});