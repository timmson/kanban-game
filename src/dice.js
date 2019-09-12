const Util = require("./util");

class Dice {

	static getScore(type, dices) {
		return dices.reduce((count, dice) => count += dice[Util.getRandomInt(0, 5)][type], 0);
	}

	static generateDices(type, workingStages, count) {
		let dice = [];
		for (let i = 0; i < 6; i++) {
			let diceSide = {};
			workingStages.forEach(stage =>
				diceSide[stage] = Dice.generateDiceSide(stage, type)
			);
			dice.push(diceSide);
		}

		let dices = [];
		for (let i = 0; i < count; i++) {
			dices.push(dice);
		}
		return dices;
	}

	static generateDice(type, workingStages) {
		let dice = [];
		for (let i = 0; i < 6; i++) {
			let diceSide = {};
			workingStages.forEach(stage =>
				diceSide[stage] = Dice.generateDiceSide(stage, type)
			);
			dice.push(diceSide);
		}
		return dice;
	}

	static generateDiceSide(stage, type) {
		return (stage === type) ? Util.getRandomInt(1, 4) : Util.getRandomInt(0, 2);
	}
}

module.exports = Dice;