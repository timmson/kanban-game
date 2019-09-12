//const Util = require("./util");
const Dice = require("./dice");
const Card = require("./card");
const Column = require("./column");

class Board {

	constructor(_config) {
		if (_config !== undefined) {
			this.config = _config;
		}

		this.board = {
			columns: {},
			utilization: {},
			currentDay: 0,
			currentCardNumber: 0,
		};

		this.config.stages.forEach((stage, i) => {
			this.board.columns[stage.name] = {
				"index": i,
				"wip": []
			};

			if (stage.isInnerDone) {
				this.board.columns[stage.name].done = [];
			}

			this.updateColumn(stage, this.board.columns[stage.name]);

			if (i === 0) {
				while (this.board.columns[stage.name].wip.length < this.board.columns[stage.name].limit) {
					this.board.columns[stage.name].wip.push(this.generateCard());
				}
			}

		});
	}

	updatedConfig(config) {
		config.stages.forEach(stage => this.updateColumn(stage, this.board.columns[stage.name]));
	}

	updateColumn(stage, column) {
		if (stage.limit !== undefined) {
			column.limit = stage.limit;
		}
		if (stage.diceCount !== undefined) {
			column.dices = Dice.generateDices(stage.name, this.getWorkStages(), stage.diceCount);
		}
		if (stage.delay !== undefined) {
			column.delay = stage.delay;
		}
	}

	view() {
		return this.board;
	}

	turn() {
		this.board.currentDay++;

		this.config.stages.map(stage => stage.name).reverse().forEach(stage => {
			let column = this.board.columns[stage];
			this.move(new Column(column));

			if (stage === "deployed") {
				this.board.columns[stage].wip.filter(card => card.endDay === 0).forEach(card => {
					card.endDay = this.board.currentDay;
				});
			}

			if (column.dices !== undefined) {
				let score = Dice.getScore(stage, this.board.columns[stage].dices);

				this.board.utilization[stage] = {average: score};

				while (score > 0 && column.wip.length > 0) {
					if (score < column.wip[0].remainings[stage]) {
						column.wip[0].remainings[stage] -= score;
						score = 0;
					} else {
						score -= column.wip[0].remainings[stage];
						column.wip[0].remainings[stage] = 0;
						if (column.done !== undefined) {
							column.done.push(column.wip.shift());
						} else {
							Object.values(this.board.columns).filter(c => c.index === column.index + 1)[0].wip.push(column.wip.shift());
						}
					}
				}

				this.board.utilization[stage] = {average: Math.floor((1 - (score / this.board.utilization[stage].average)) * 100)};
			}
		});

		return this.view();
	}

	move(column) {
		let card = {};
		while (column.hasAvailableSlots() && card !== undefined) {
			let previousColumn = this.getPreviousColumn(column.getIndex());

			if (column.isDelayed(this.board.currentDay) || (previousColumn !== undefined && !new Column(previousColumn).isAvailableForPulling())) {
				card = undefined;
			} else {
				card = (previousColumn !== undefined ? (previousColumn.done !== undefined ? previousColumn.done.shift() : previousColumn.wip.shift()) : this.generateCard());
				if (card !== undefined) {
					column.pull(card);
				}
			}

		}
	}

	getPreviousColumn(index) {
		return Object.values(this.board.columns).filter(c => c.index === index - 1)[0];
	}

	getWorkStages() {
		return this.config.stages.filter(stage => stage.diceCount > 0).map(stage => stage.name);
	}

	generateCard() {
		this.board.currentCardNumber++;
		return Card.generateCard(this.board.currentCardNumber, this.board.currentDay, this.getWorkStages());
	}
}

module.exports = Board;