function getRandomNum(start, end, toFixed) {
	var num = Math.random(),
		temp = arguments.length;

	if (temp === 0) {
		return num;
	} else if (temp === 1) {
		end = start;
		start = 0;
	}
	if (!toFixed) {
		toFixed = Math.max(
			(start + ".").split(".")[1].length,
			(end + ".").split(".")[1].length
		)
	}

	if (end < start) {
		temp = end;
		end = start;
		start = temp;
	}

	temp = Math.pow(10, toFixed);
	num = ((start * temp + num * ((end - start) * temp + 1)) >> 0) / temp;
	return num;
};

exports.getRandomNum = getRandomNum;