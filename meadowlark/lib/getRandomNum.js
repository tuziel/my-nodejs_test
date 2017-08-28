function getRandomNum(start, end, toFixed) {
	var num = Math.random(),
		temp = arguments.length;

	if (temp === 0) {
		return num;
	} else if (temp === 1) {
		end = start;
		start = 0;
	}

	if (end < start) {
		temp = end;
		end = start;
		start = temp;
	}

	toFixed = Math.max(
		(start + ".").split(".")[1].length,
		(end + ".").split(".")[1].length,
		toFixed || 0
	);

	temp = Math.pow(10, Math.min(toFixed, 9));

	num = ((start * temp + num * ((end - start) * temp + 1)) >> 0) / temp;

	return num;
}

exports.getRandomNum = getRandomNum;