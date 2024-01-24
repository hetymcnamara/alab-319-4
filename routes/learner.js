import express from "express";
import db from "../db/conn.js";

const router = express.Router();


// Get route for backwards compatibility
router.get("/student/:id", async (req, res) => {
    res.redirect(`learner/${req.params.id}`);
});
  
// Get a learner's grade data
router.get("/:id", async (req, res) => {
    let collection = await db.collection("grades");
    let query = { learner_id: Number(req.params.id) };

    // Check for class_id parameter
    if (req.query.class) query.class_id = Number(req.query.class);

    let result = await collection.find(query).toArray();

    if (!result) res.send("Not found").status(404);
    else res.send(result).status(200);
});
  
// Delete a learner's grade data
router.delete("/:id", async (req, res) => {
    let collection = await db.collection("grades");
    let query = { learner_id: Number(req.params.id) };

    let result = await collection.deleteOne(query);

    if (!result) res.send("Not found").status(404);
    else res.send(result).status(200);
});

export default router;