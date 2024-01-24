import { MongoClient } from "mongodb";
import '../loadEnv.js';

const client = new MongoClient(process.env.MONGODB_URI);

// Create a single-field index on class_id 
const createIndexOnClassId = async (db) => {
  try {
    // Create a single-field index on class_id
    await db.collection("grades").createIndex({ class_id: 1 });

    console.log("Index created successfully on class_id");
  } catch (error) {
    console.error("Error creating index:", error);
  }
};

// Create a single-field index on learner_id
const createIndexOnLearnerId = async (db) => {
  try {
    // Create a single-field index on class_id
    await db.collection("grades").createIndex({ learner_id: 1 });

    console.log("Index created successfully on learner_id");
  } catch (error) {
    console.error("Error creating index:", error);
  }
};

// Create a compound index on learner_id and class_id, 
// in that order, both ascending.
const createCompoundIndex = async (db) => {
  try {
    // Create a compound index on learner_id and class_id
    await db.collection("grades").createIndex({ learner_id: 1, class_id: 1 });

    console.log("Compound index created successfully on learner_id and class_id");
  } catch (error) {
    console.error("Error creating compound index:", error);
  }
};

// Define the validation rules
const validationRules = {
  $jsonSchema: {
    bsonType: "object",
    required: ["class_id", "learner_id"],
    properties: {
      class_id: {
        bsonType: "int",
        minimum: 0,
        maximum: 300,
        description: "class_id must be an integer between 0 and 300, inclusive.",
      },
      learner_id: {
        bsonType: "int",
        minimum: 0,
        description: "learner_id must be an integer greater than or equal to 0.",
      },
    },
  },
};

let conn;
try {
  conn = await client.connect();
  console.log("Connected to MongoDB!");
} catch (e) {
  console.error(e);
}

let db = conn.db("sample_training");

try {
  // Apply the validation rules to the grades collection
  await db.command({
    collMod: "grades",
    validator: validationRules,
    validationAction: "warn",
  });
  console.log("Validation rules applied successfully.");
} catch (error) {
  console.error("Error applying validation rules:", error);
}

// Call the function to create the index on class_id
await createIndexOnClassId(db);

// Call the function to create the index on learner_id
await createIndexOnLearnerId(db);

// Call the function to create the compound index
await createCompoundIndex(db);

export default db;