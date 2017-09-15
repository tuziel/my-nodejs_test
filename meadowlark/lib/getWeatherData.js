function getWeatherData() {
	return {
		locations: [
			{
				name: "广州",
				url: "https://www.wunderground.com/weather/cn/guangzhou",
				iconUrl: "http://icons-ak.wxug.com/i/c/k/cloudy.gif",
				weather: "阴",
				temp: "12.3℃"
			},
			{
				name: "深圳",
				url: "https://www.wunderground.com/weather/cn/shenzhen",
				iconUrl: "http://icons-ak.wxug.com/i/c/k/partlycloudy.gif",
				weather: "多云",
				temp: "12.8℃"
			},
			{
				name: "广州",
				url: "https://www.wunderground.com/weather/cn/shanghai",
				iconUrl: "http://icons-ak.wxug.com/i/c/k/rain.gif",
				weather: "小雨",
				temp: "12.8℃"
			}
		]
	};
}

module.exports = getWeatherData;