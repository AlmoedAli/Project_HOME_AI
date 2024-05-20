const house = require("../../models/house");

class ProfileController {
	async index(req, res) {
		const user = req.session.user;
		const houses = (await house.find({ UserID: user._id })).map((h) => {
			return { name: h.Name, address: h.Address };
		});
		res.render("user/profile", {
			layout: "main",
			user: user,
			houses: houses,
		});
	}
}

module.exports = new ProfileController();
