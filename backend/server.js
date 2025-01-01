

const express = require("express");
const app = express();
const port = 3000;
require("dotenv").config();
const { MongoClient } = require("mongodb");
const bodyParser = require("body-parser");
const cors = require("cors");

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// MongoDB connection setup
const url = "mongodb://localhost:27017";
const client = new MongoClient(url);
const dbName = "PassMan";

// Connect to MongoDB
client.connect();

// Get all passwords
app.get("/", async (req, res) => {
  try {
    const db = client.db(dbName);
    const collection = db.collection("passwords");
    const findResult = await collection.find({}).toArray();
    res.json(findResult);
  } catch (error) {
    console.error("Error fetching passwords:", error);
    res.status(500).send({ success: false, message: "Internal server error." });
  }
});

// Save a new password
app.post("/", async (req, res) => {
  try {
    const password = req.body;
    const db = client.db(dbName);
    const collection = db.collection("passwords");
    const findResult = await collection.insertOne(password);
    res.send({ success: true, result: findResult });
  } catch (error) {
    console.error("Error saving password:", error);
    res.status(500).send({ success: false, message: "Internal server error." });
  }
});

// Delete a password
app.delete("/", async (req, res) => {
  try {
    const password = req.body;
    const db = client.db(dbName);
    const collection = db.collection("passwords");
    const findResult = await collection.deleteOne(password);
    res.send({ success: true, result: findResult });
  } catch (error) {
    console.error("Error deleting password:", error);
    res.status(500).send({ success: false, message: "Internal server error." });
  }
});

// Update a password
app.put("/", async (req, res) => {
  try {
    console.log("Request body:", req.body);
    const { id, newSite, newUsername, newPassword } = req.body;

    // Validation to check if all fields are provided
    if (!id || !newPassword || !newSite || !newUsername) {
      return res.status(400).send({
        success: false,
        message: "Invalid request. Missing id, newPassword, newSite, or newUsername.",
      });
    }

    const db = client.db(dbName);
    const collection = db.collection("passwords");

    // Since `id` appears to be a UUID, no need to use ObjectId. Just use the `id` directly.
    const findResult = await collection.findOneAndUpdate(
      {id}, // Use the UUID directly here
      { $set: { site: newSite, username: newUsername, password: newPassword } }, // Update fields
      { returnDocument: "after" } // Return the updated document
    );

    if (!findResult.value) {
      return res.status(404).send({ success: false, message: "Password not found." });
    }

    res.send({ success: true, result: findResult.value });
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).send({ success: false, message: "Internal server error." });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
