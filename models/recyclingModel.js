const mongoose = require("mongoose");

const recyclingSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    contactNumber: {
      type: Number,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["Plastic", "Paper", "Glass", "Metal", "Electronics", "Organic Waste", "Textiles"], // Added enum for recycling types
    },
    file: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Recycling = mongoose.model("Recycling", recyclingSchema);

module.exports = Recycling;