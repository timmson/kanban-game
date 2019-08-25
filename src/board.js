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
            column.dices = this.generateDices(stage.diceCount, stage.name);
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
            this.move(column);

            if (stage === "deployed") {
                this.board.columns[stage].wip.filter(card => card.endDay === 0).forEach(card => {
                    card.endDay = this.board.currentDay;
                });
            }

            if (column.dices !== undefined) {
                let score = this.getScore(stage);

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
        while ((column.limit !== undefined ? (column.wip.length + (column.done !== undefined ? column.done.length : 0) < column.limit) : true) && card !== undefined) {
            let previousColumn = Object.values(this.board.columns).filter(c => c.index === column.index - 1)[0];
            if ((column.delay !== undefined && column.delay >= 2 && this.board.currentDay % column.delay !== 0) || (previousColumn !== undefined && previousColumn.done === undefined && previousColumn.dices !== undefined)) {
                card = undefined;
            } else {
                card = (previousColumn !== undefined ? (previousColumn.done !== undefined ? previousColumn.done.shift() : previousColumn.wip.shift()) : this.generateCard());
                if (card !== undefined) {
                    column.wip.push(card);
                }
            }
        }
    }

    getScore(type) {
        let count = 0;
        this.board.columns[type].dices.forEach(dice => {
            count += dice[this.getRandomInt(0, 5)][type];
        });
        return count;
    }

    getWorkStages() {
        return this.config.stages.filter(stage => stage.diceCount > 0).map(stage => stage.name);
    }

    generateDices(count, type) {
        let dice = [];
        for (let i = 0; i < 6; i++) {
            let diceSide = {};
            this.getWorkStages().forEach(stage =>
                diceSide[stage] = this.generateDiceSide(stage, type)
            );
            dice.push(diceSide);
        }

        let dices = [];
        for (let i = 0; i < count; i++) {
            dices.push(dice);
        }
        return dices;
    }

    generateDiceSide(stage, type) {
        return (stage === type) ? this.getRandomInt(1, 4) : this.getRandomInt(0, 2)
    }

    generateCard() {
        let estimations = {};
        this.getWorkStages().forEach(stage =>
            estimations[stage] = (stage === "testing" ? this.getRandomInt(5, 15) : this.getRandomInt(2, 10))
        );
        this.board.currentCardNumber++;
        return {
            "cardId": "S" + this.board.currentCardNumber.toString().padStart(3, "0"),
            "estimations": estimations,
            "remainings": Object.assign({}, estimations),
            "startDay": this.board.currentDay,
            "endDay": 0,
            "cycleTime": 0
        };
    }


    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }
}

module.exports = Board;