const {expect} = require("chai");
require("mocha");

const Dice = require("../src/dice");

describe("Dice(s) should", () => {

	it("return score when roll", () => {
		let score = Dice.getScore("testing", Dice.generateDices("testing", ["testing", "someStage"], 10));

		expect(score).to.be.within(1 * 10, 4 * 10);
	});

	it("be generated when stage,working stage and count are given", () => {
		let dices = Dice.generateDices("testing", ["testing", "someStage"], 10);

		expect(dices).to.have.lengthOf(10);
	});

	it("be generated at once when stage and working stage are given", () => {
		let dice = Dice.generateDice("testing", ["testing", "someStage"]);

		expect(dice).to.have.lengthOf(6);
	});

	it("generate primary dice slide with score 1:4 when stage and working stage are equal", () => {
		let diceSlide = Dice.generateDiceSide("testing", "testing");

		expect(diceSlide).to.be.within(1, 4);
	});

	it("generate primary dice slide with score 0:2 when stage and working stage are not  equal", () => {
		let diceSlide = Dice.generateDiceSide("testing", "someStage");

		expect(diceSlide).to.be.within(0, 2);
	});

});