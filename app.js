import express from "express";
import gradesRoutes from "./routes/grades.js";
import learnerRoutes from "./routes/learner.js"
import classRoutes from "./routes/classRoutes.js";
import statsRouter from "./routes/stats.js"

const PORT = 4040;

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Starting express mongodb app...");
});

app.use("/grades", gradesRoutes);
app.use("/grades/learner", learnerRoutes);
app.use("/grades/class", classRoutes);
app.use("/stats", statsRouter);

app.use((err, _req, res, next) => {
    res.status(500).send("Seems like we messed up somewhere...");
});
  
// Start the Express server
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});