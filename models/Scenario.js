const mongoose = require("mongoose");
const characterSchema = require("./Character");
const Schema = mongoose.Schema;

const scenarioSchema = new Schema(
  {
    id: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      requried: false,
      ref: "User",
    },
    characters: [characterSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Scenario", scenarioSchema);
