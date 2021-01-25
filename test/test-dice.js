const Dice = require("../src/dice");

describe("Dice(s) should", () => {

	test("return score when roll", () => {
		let score = Dice.getScore("testing", Dice.generateDices("testing", ["testing", "someStage"], 10));

		expect(score).toBeGreaterThanOrEqual(10);
		expect(score).toBeLessThanOrEqual(4 * 10);
	});

	test("be generated when stage,working stage and count are given", () => {
		let dices = Dice.generateDices("testing", ["testing", "someStage"], 10);

		expect(dices).toHaveLength(10);
	});

	test("be generated at once when stage and working stage are given", () => {
		let dice = Dice.generateDice("testing", ["testing", "someStage"]);

		expect(dice).toHaveLength(6);
	});

	test("generate primary dice slide with score 1:4 when stage and working stage are equal", () => {
		let diceSlide = Dice.generateDiceSide("testing", "testing");

		expect(diceSlide).toBeGreaterThanOrEqual(1);
		expect(diceSlide).toBeLessThanOrEqual(4);
	});

	test("generate primary dice slide with score 0:2 when stage and working stage are not  equal", () => {
		let diceSlide = Dice.generateDiceSide("testing", "someStage");

		expect(diceSlide).toBeGreaterThanOrEqual(0);
		expect(diceSlide).toBeLessThanOrEqual(2);
	});

});