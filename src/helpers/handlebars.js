const repeat = require("./repeat");
const readSVG = require("./readSVG");

var register = function (Handlebars) {
	var helpers = {
		math: function (lvalue, operator, rvalue, options) {
			lvalue = parseFloat(lvalue);
			rvalue = parseFloat(rvalue);

			return {
				"+": lvalue + rvalue,
				"-": lvalue - rvalue,
				"*": lvalue * rvalue,
				"/": lvalue / rvalue,
				"%": lvalue % rvalue,
			}[operator];
		},
		repeat,
		readSVG,
		print: function (value) {
			// console.log(value);
		},
	};

	if (Handlebars && typeof Handlebars.registerHelper === "function") {
		for (var prop in helpers) {
			Handlebars.registerHelper(prop, helpers[prop]);
		}
	} else {
		return helpers;
	}
};

module.exports.register = register;
module.exports.repeat = repeat;
module.exports.readSVG = readSVG;
module.exports.helpers = register(null);
