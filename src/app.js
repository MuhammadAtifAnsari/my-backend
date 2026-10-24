import express from "express";

const app = express();

app.get("/user", (req, res) => {
    res.json({
        message: "users fetched!",
    })
    console.log("users fetched");
})




export default app;