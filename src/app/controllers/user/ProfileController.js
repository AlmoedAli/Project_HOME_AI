const voice = require("../../models/voice");
const { unlink } = require("fs");

class ProfileController {
	async index(req, res) {
		const user = req.session.user;
		const result = await voice.findOne({ userID: user._id });
		res.render("user/profile", {
			layout: "main",
			user: user,
			voicePath: result?.filePath,
		});
	}

	async addVoice(req, res) {
		const result = await voice.create({
			userID: req.session.user._id,
			filePath: `sounds/samples/${req.file.filename}`,
		});
		res.status(201).json(result);
	}

	async removeVoice(req, res) {
		const result = await voice.findOneAndDelete({
			userID: req.session.user._id,
		});
		unlink(`src/public/${result.filePath}`, (err) => {
			if (err) throw err;
		});
		res.status(200).json(result);
	}
}

module.exports = new ProfileController();
