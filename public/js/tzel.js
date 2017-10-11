(function (golbal) {
	var tzel = {
		formatStr: formatStr,
		escapeHTML: escapeHTML,
		param2json: param2json
	};

	/**
	 * 格式化输出
	 * @param {string} str 字符串模板
	 * @param {string} arguments 替换参数中指定的值
	 *
	 * > formatStr("today is %s", new Date(2017,0,1));
	 * < "today is Sun Jan 01 2017 00:00:00 GMT+0800 (中国标准时间)"
	 */
	function formatStr(str) {
		var args = arguments,
			index = 1,
			strTemp;

		strTemp = str.replace(/%./g, function (matcher) {
			var key = matcher[1];

			if (key === "%") {
				return "%";
			} else if (key === "s") {
				return args[index++];
			}

			return matcher;
		});

		return strTemp;
	}

	/**
	 * 将特殊字符转成转义字符
	 * @param {string} str 待转码字符串
	 *
	 * > escapeHTML("<script>alert()</script>");
	 * < "&lt;script&gt;alert()&lt;&#47script&gt;"
	 */
	function escapeHTML(str) {
		var CHAR = {
				"&": "&amp;",
				"<": "&lt;",
				">": "&gt;",
				"\"": "&quot;",
				"\\": "&#92;",
				"/": "&#47"
			},
			pattern = /[&<>"\\/]/g;

		return str.replace(pattern, function (matcher) {
			return CHAR[matcher];
		});
	}

	/**
	 * 将formData字符串转为json
	 * @param {string} param 待转换的formData字符串
	 *
	 * > param2json("a=1&b=2");
	 * < Object {a: "1", b: "2"}
	 */
	function param2json(param) {
		var json = {},
			// matcher => (&)(key)=(val)
			pattern = /(^|\?|&)+(.*?)=(.*?)(?=&|$)/g,
			$key = 2,
			$val = 3,
			matcher;

		while ((matcher = pattern.exec(param)) !== null) {
			json[matcher[$key]] = matcher[$val] || "";
		}

		return json;
	}

	golbal.tzel = tzel;
})(window);