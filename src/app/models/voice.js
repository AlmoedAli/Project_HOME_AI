const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");

const VoiceSchema = new mongoose.Schema(
	{
		userID: { type: ObjectId, ref: "User" },
		filePath: { type: String },
	},
	{ collection: "voice" }
);

module.exports = mongoose.model("Voice", VoiceSchema);
