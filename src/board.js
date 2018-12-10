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
        let column = {
            "index": i,
            "wip": []
        };
        if (stage.limit !== undefined) {
            column.limit = stage.limit;
        }
        if (stage.diceCount !== undefined) {
            column.dices = generateDices(stage.diceCount, stage.name);
        }
        if (stage.isInnerDone) {
            column.done = [];
        }

        if (i === 0) {
            while (column.wip.length < column.limit) {
                column.wip.push(generateCard());
            }
        }

        board.columns[stage.name] = column;
    });
}

Board.prototype.view = function () {
    return board;
};

Board.prototype.turn = function () {
    board.currentDay++;

    config.stages.map(stage => stage.name).reverse().forEach(stage => {
        let card = {};
        let column = board.columns[stage];
        while ((column.limit !== undefined ? (column.wip.length + (column.done !== undefined ? column.done.length : 0) < column.limit) : true) && card !== undefined) {
            /*if (board.currentDay % 10 !== 0 && stage === "deployed") {
                card = undefined
            } else {*/
                let previousColumn = Object.values(board.columns).filter(c => c.index === column.index - 1)[0];
                card = previousColumn !== undefined ? (previousColumn.done !== undefined ? previousColumn.done.shift() : previousColumn.wip.shift()) : generateCard();
                if (card !== undefined) {
                    column.wip.push(card);
                }
            //}
        }

        if (column.dices !== undefined) {
            let score = getScore(stage);

            while (score > 0 && column.wip.length > 0) {
                if (score < column.wip[0].remainings[stage]) {
                    column.wip[0].remainings[stage] -= score;
                    score = 0;
                } else {
                    score -= column.wip[0].remainings[stage];
                    column.wip[0].remainings[stage] = 0;
                    if (column.done !== undefined) {
                        column.done.push(column.wip.shift());
                    }
                }
            }
        }
    });
    return this.view();
};


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
    return (stage === type) ? getRandomInt(3, 6) : getRandomInt(1, 3)
}

function generateCard() {
    let estimations = {};
    getWorkStages().forEach(stage =>
        estimations[stage] = (stage === "testing" ? getRandomInt(5, 20) : getRandomInt(1, 10))
    );
    board.currentCardNumber++;
    return {
        "cardId": "S" + board.currentCardNumber.toString().padStart(3, "0"),
        "estimations": estimations,
        "remainings": Object.assign({}, estimations),
        "startDay": 0,
        "endDay": 0,
        "cycleTime": 0
    };
}


function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}