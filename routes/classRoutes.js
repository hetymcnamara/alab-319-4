import express from "express";
import db from "../db/conn.js";

const router = express.Router();


// Get a class's grade data
router.get("/:id", async (req, res) => {
    let collection = await db.collection("grades");
    let query = { class_id: Number(req.params.id) };
  
    // Check for learner_id parameter
    if (req.query.learner) query.learner_id = Number(req.query.learner);
  
    let result = await collection.find(query).limit(5).toArray();
  
    if (!result) res.send("Not found").status(404);
    else res.send(result).status(200);
});
  
// Update a class id
router.patch("/:id", async (req, res) => {
    let collection = await db.collection("grades");
    let query = { class_id: Number(req.params.id) };

    let result = await collection.updateMany(query, {
        $set: { class_id: req.body.class_id }
    });

    if (!result) res.send("Not found").status(404);
    else res.send(result).status(200);
});
  
// Delete a class
router.delete("/:id", async (req, res) => {
    let collection = await db.collection("grades");
    let query = { class_id: Number(req.params.id) };

    let result = await collection.deleteMany(query);

    if (!result) res.send("Not found").status(404);
    else res.send(result).status(200);
});
  

export default router;