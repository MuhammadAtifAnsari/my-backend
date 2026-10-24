import express from "express";

const app = express();

app.get("/user", (req, res) => {
    res.json({
        message: "users fetched!",
    })
    console.log("users fetched");
});

app.get("/", (req, res) => {
    res.send("Backend is running successfully!");
});




export default app;