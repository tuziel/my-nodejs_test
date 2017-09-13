/**
 * 从给定范围中返回一个随机数
 *
 *     random.number()
 *     random.number(end)
 *     random.number(start, end)
 *     random.number(start, end, toFixed)
 *
 * @param {number} start 设置范围的开始值
 * @param {number} end 设置范围的结束值
 * @param {number} toFixed 设置保留的小数位数
 * @returns {number} 返回一个随机数
*/
function number(start, end, toFixed) {
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

	// temp = [];
	// toFixed = Math.max(
	// 	(temp[2] = ((temp[0] = Math.abs(start)) + ".").split("."))[1].length,
	// 	(temp[3] = ((temp[1] = Math.abs(end)) + ".").split("."))[1].length,
	// 	toFixed || 0
	// );

	// try {
	// 	// 参数大于1e17
	// 	if (Math.max(temp[0], temp[1]) >= 1e9) {
	// 		throw 1;
	// 	}
	// 	// 有效数字大于18
	// 	if (Math.max(temp[2][0].length, temp[3][0].length) + toFixed > 9) {
	// 		throw 2;
	// 	}
	// } catch (err) {
	// 	if (err === 1) {
	// 		throw new RangeError("random.number() arguments must less than 1e9");
	// 	}
	// 	if (err === 2) {
	// 		throw new RangeError("random.number() significant digits of arguments must less than 10");
	// 	}
	// }

	temp = Math.pow(10, toFixed);

	num = ((start * temp + num * ((end - start) * temp + 1)) >> 0) / temp;

	return num;
}

/**
 * 从指定字符集中返回随机字符串
 *
 *     random.string(limit)
 *     random.string(null, limit)
 *     random.string(chars, limit)
 *
 * @param {string} chars 指定的字符集
 * @param {number} limit 设置返回字符串的长度
 * @returns {string} 返回一个随机字符串
 */
function string(chars, limit) {
	!chars && (chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ");
	var length = chars.length,
		string = "";

	!limit && (limit = 1);
	for (; limit > 0; limit--) {
		string += chars[Math.floor(Math.random() * length)];
	}
	return string;
}

/**
 * 从指定数组中返回随机元素
 *
 *     random.element(array)
 *     random.element(array, count)
 *
 * @param {array} array 指定的数组
 * @param {number} count 设置返回元素的个数
 * @returns {any} 返回随机元素，个数大于1时将返回一个数组
 */
function element(array, count) {
	var length = array.length,
		elms = [];

	!count && (count = 1);
	for (; count > 0; count--) {
		elms.push(array[Math.floor(Math.random() * length)]);
	}

	if (elms.length <= 1) {
		return elms[0];
	}

	return elms;
}

/**
 * 从指定数组中返回一个不重复的乱序数组
 *
 *     random.string(array)
 *     random.string(array, count)
 *
 * @param {array} array 指定的数组
 * @param {number} count 设置返回元素的个数，超出指定数组长度时将按数组长度返回
 * @returns {array} 返回一个乱序数组
 */
function shuffle(array, count) {
	var length = array.length,
		elms = [],
		arrTemp;

	arrTemp = array.map(function (elm) {
		return elm;
	});

	if (!count || count > length) {
		count = length;
	}
	for (; count > 0; count-- , length--) {
		elms.push(arrTemp.splice(Math.floor(Math.random() * length), 1)[0]);
	}

	return elms;
}

module.exports = {
	number: number,
	element: element,
	string: string,
	shuffle: shuffle
};