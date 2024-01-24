import express from "express";
import db from "../db/conn.js";

const router = express.Router();

// Create a GET route at /grades/stats
router.get("/", async (req, res) => {
    try {
        let collection = db.collection("grades");
        const pipeline = [
          {
            $unwind: "$scores",
          },
          {
            $group: {
              _id: null,
              totalLearners: { $sum: 1 },
              above70Avg: {
                $sum: {
                  $cond: {
                    if: {
                      $gt: [
                        {
                          $avg: "$scores.score",
                        },
                        70,
                      ],
                    },
                    then: 1,
                    else: 0,
                  },
                },
              },
            },
          },
          {
            $project: {
              _id: 0,
              totalLearners: 1,
              above70Avg: 1,
              percentageAbove70: {
                $multiply: [
                  { 
                    $divide: [
                      "$above70Avg", 
                      "$totalLearners"
                    ], 
                  },
                  100,
                ],
              },
            },
          },
        ];       

        // Log intermediate results
        console.log("Before aggregation:", pipeline);
        // Execute the aggregation pipeline
        const result = await collection.aggregate(pipeline).toArray();
        // Log the result
        console.log("Aggregation result:", result);
        // Respond with the result
        console.log("Single result:", result[0]);
        res.json(result[0]);
    } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).send("Internal Server Error");
    }
});


// Define the GET route at /grades/stats/:id
router.get("/:id", async (req, res) => {
  try {
    const classId = parseInt(req.params.id);

    // Aggregation pipeline to get the required information for a specific class_id
    const pipeline = [
      {
        $match: { "class_id": classId },
      },
      {
        $unwind: "$scores",
      },
      {
        $group: {
          _id: "$_id",
          totalLearners: { $sum: 1 },
          above70Avg: {
            $sum: {
              $cond: [{ $gt: ["$scores.score", 70] }, 1, 0],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          totalLearners: 1,
          above70Avg: 1,
          percentageAbove70: {
            $multiply: [
              { $divide: ["$above70Avg", "$totalLearners"] },
              100,
            ],
          },
        },
      },
    ];

    // Execute the aggregation pipeline
    const result = await db.collection("grades").aggregate(pipeline).toArray();

    // Respond with the result
    res.json(result[0]);
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).send("Internal Server Error");
  }
});

export default router;