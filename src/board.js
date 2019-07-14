module.exports = Board;

let config = {};

let board = {};

function Board(_config) {
    if (_config !== undefined) {
        config = _config;
    }

    board = {
        columns: {},
        currentDay: 0,
        currentCardNumber: 0
    };

    config.stages.forEach((stage, i) => {
        board.columns[stage.name] = {
            "index": i,
            "wip": []
        };
        if (stage.isInnerDone) {
            board.columns[stage.name].done = [];
        }
        this.updateColumn(stage, board.columns[stage.name]);

        if (i === 0) {
            while (board.columns[stage.name].wip.length < board.columns[stage.name].limit) {
                board.columns[stage.name].wip.push(generateCard());
            }
        }

    });
}

Board.prototype.updatedConfig = function (config) {
    config.stages.forEach(stage => this.updateColumn(stage, board.columns[stage.name]));
};

Board.prototype.updateColumn = function (stage, column) {
    if (stage.limit !== undefined) {
        column.limit = stage.limit;
    }
    if (stage.diceCount !== undefined) {
        column.dices = generateDices(stage.diceCount, stage.name);
    }
    if (stage.delay !== undefined) {
        column.delay = stage.delay;
    }
};

Board.prototype.view = function () {
    return board;
};

Board.prototype.turn = function () {
    board.currentDay++;

    board.currentDayUtilization = {}
    config.stages.map(stage => stage.name).reverse().forEach(stage => {
        let column = board.columns[stage];
        move(column);

        if (stage === "deployed") {
            board.columns[stage].wip.filter(card => card.endDay === 0).forEach(card => {
                card.endDay = board.currentDay;
            });
        }

        if (column.dices !== undefined) {
            let score = getScore(stage);

            board.currentDayUtilization[stage] = score;

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
                        Object.values(board.columns).filter(c => c.index === column.index + 1)[0].wip.push(column.wip.shift());
                    }
                }
            }

            board.currentDayUtilization[stage] = Math.floor((1 - (score / board.currentDayUtilization[stage])) * 100);
        }
    });

    return this.view();
};

function move(column) {
    let card = {};
    while ((column.limit !== undefined ? (column.wip.length + (column.done !== undefined ? column.done.length : 0) < column.limit) : true) && card !== undefined) {
        let previousColumn = Object.values(board.columns).filter(c => c.index === column.index - 1)[0];
        if ((column.delay !== undefined && column.delay >= 2 && board.currentDay % column.delay !== 0) || (previousColumn !== undefined && previousColumn.done === undefined && previousColumn.dices !== undefined)) {
            card = undefined;
        } else {
            card = (previousColumn !== undefined ? (previousColumn.done !== undefined ? previousColumn.done.shift() : previousColumn.wip.shift()) : generateCard());
            if (card !== undefined) {
                column.wip.push(card);
            }
        }
    }
}

function getScore(type) {
    let count = 0;
    board.columns[type].dices.forEach(dice => {
        count += dice[getRandomInt(0, 5)][type];
    });
    return count;
}

function getWorkStages() {
    return config.stages.filter(stage => stage.diceCount > 0).map(stage => stage.name);
}

function generateDices(count, type) {
    let dice = [];
    for (let i = 0; i < 6; i++) {
        let diceSide = {};
        getWorkStages().forEach(stage =>
            diceSide[stage] = generateDiceSide(stage, type)
        );
        dice.push(diceSide);
    }

    let dices = [];
    for (let i = 0; i < count; i++) {
        dices.push(dice);
    }
    return dices;
}

function generateDiceSide(stage, type) {
    return (stage === type) ? getRandomInt(1, 4) : getRandomInt(0, 2)
}

function generateCard() {
    let estimations = {};
    getWorkStages().forEach(stage =>
        estimations[stage] = (stage === "testing" ? getRandomInt(5, 15) : getRandomInt(2, 10))
    );
    board.currentCardNumber++;
    return {
        "cardId": "S" + board.currentCardNumber.toString().padStart(3, "0"),
        "estimations": estimations,
        "remainings": Object.assign({}, estimations),
        "startDay": board.currentDay,
        "endDay": 0,
        "cycleTime": 0
    };
}


function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}