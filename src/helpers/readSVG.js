const path = require("path");
const fs = require("fs");

function readSVG(iconName) {
	let dir = path.join(__dirname, "/..", "assets", "svg", iconName + ".svg");
	return fs.readFileSync(dir, "utf8");
}

module.exports = readSVG;
