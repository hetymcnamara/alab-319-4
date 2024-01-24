import express from "express";
import db from "../db/conn.js";
import { ObjectId } from "mongodb";

const router = express.Router();

// Create a single grade entry
router.post("/", async (req, res) => {
  let collection = db.collection("grades");
  let newDocument = req.body;

  // rename fields for backwards compatibility
  if (newDocument.student_id) {
    newDocument.learner_id = newDocument.student_id;
    delete newDocument.student_id;
  }

  let result = await collection.insertOne(newDocument);
  res.send(result).status(204);
});

// Get a single grade entry
router.get("/:id", async (req, res) => {
  let collection = db.collection("grades");
  let query = { _id: new ObjectId(req.params.id) };
  let result = await collection.findOne(query);

  if (!result) res.send("Not found").status(404);
  else res.send(result).status(200);
});


// Get all grades
router.get('/', async (req, res) => {
    let collection = db.collection("grades");
    let result = await collection.find({}).limit(5).toArray();
    console.log(result)
    res.send(result).status(200);
});

// Add a score to a grade entry
router.patch("/:id/add", async (req, res) => {
  let collection = db.collection("grades");
  let query = { _id: ObjectId(req.params.id) };

  let result = await collection.updateOne(query, {
    $push: { scores: req.body }
  });

  if (!result) res.send("Not found").status(404);
  else res.send(result).status(200);
});

// Remove a score from a grade entry
router.patch("/:id/remove", async (req, res) => {
  let collection = db.collection("grades");
  let query = { _id: ObjectId(req.params.id) };

  let result = await collection.updateOne(query, {
    $pull: { scores: req.body }
  });

  if (!result) res.send("Not found").status(404);
  else res.send(result).status(200);
});

// Delete a single grade entry
router.delete("/:id", async (req, res) => {
  let collection = db.collection("grades");
  let query = { _id: ObjectId(req.params.id) };
  let result = await collection.deleteOne(query);

  if (!result) res.send("Not found").status(404);
  else res.send(result).status(200);
});

export default router;