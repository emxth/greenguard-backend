const express = require("express");
const Recycling = require("../models/recyclingModel"); // Fixed model import
const upload = require("../middleware/requirePhoto"); // Fixed middleware import

const router = express.Router();

// Route for Save a new Recycling Entry
router.post("/", upload.single("file"), async (request, response) => {
  try {
    if (
      !request.body.name ||
      !request.body.email ||
      !request.body.contactNumber ||
      !request.body.location ||
      !request.body.type
    ) {
      return response.status(400).send({
        message:
          "Send all required fields: name, email, contactNumber, location, type",
      });
    }
    const newEntry = {
      name: request.body.name,
      email: request.body.email,
      contactNumber: request.body.contactNumber,
      location: request.body.location,
      type: request.body.type,
      file: request.file ? request.file.filename : null, // Handle file upload if present
    };

    const entry = await Recycling.create(newEntry);

    return response.status(201).send(entry);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Route for Get All Recycling Entries from database
router.get("/", async (request, response) => {
  try {
    const entries = await Recycling.find({});

    return response.status(200).json({
      count: entries.length,
      data: entries,
    });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Route for Get One Recycling Entry from database by id
router.get("/:id", async (request, response) => {
  try {
    const { id } = request.params;

    const entry = await Recycling.findById(id);

    if (!entry) {
      return response
        .status(404)
        .json({ message: "Recycling entry not found" });
    }

    return response.status(200).json(entry);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Route for Update a Recycling Entry
router.put("/:id", upload.single("file"), async (request, response) => {
  try {
    if (
      !request.body.name ||
      !request.body.email ||
      !request.body.contactNumber ||
      !request.body.location ||
      !request.body.type
    ) {
      return response.status(400).send({
        message:
          "Send all required fields: name, email, contactNumber, location, type",
      });
    }

    const { id } = request.params;
    const { name, email, contactNumber, location, type } = request.body;
    const file = request.file ? request.file.filename : null;

    const result = await Recycling.findByIdAndUpdate(id, {
      name,
      email,
      contactNumber,
      location,
      type,
      ...(file && { file }), // Only update file if a new one is uploaded
    }, { new: true }); // Added { new: true } to return the updated document

    if (!result) {
      return response
        .status(404)
        .json({ message: "Recycling entry not found" });
    }

    return response
      .status(200)
      .send({ message: "Recycling entry updated successfully", data: result });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Route for Delete a Recycling Entry
router.delete("/:id", async (request, response) => {
  try {
    const { id } = request.params;

    const result = await Recycling.findByIdAndDelete(id);

    if (!result) {
      return response
        .status(404)
        .json({ message: "Recycling entry not found" });
    }

    return response
      .status(200)
      .send({ message: "Recycling entry deleted successfully" });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

module.exports = router;