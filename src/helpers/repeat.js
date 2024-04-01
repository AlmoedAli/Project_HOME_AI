let repeat = function (n, block) {
	let res = "";
	for (let i = 0; i < n; i++) res += block.fn(i);
	return res;
};

module.exports = repeat;
