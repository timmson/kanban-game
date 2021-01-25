const Util = require("../src/util");

describe("Util should", () => {

	test("return random number in range 10:16", () => {
		let result = Util.getRandomInt(10, 16);

		expect(result).toBeGreaterThanOrEqual(9);
		expect(result).toBeLessThanOrEqual(16);
	});

});