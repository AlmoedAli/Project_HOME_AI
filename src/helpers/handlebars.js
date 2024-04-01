const repeat = require("./repeat");

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
module.exports.helpers = register(null);
