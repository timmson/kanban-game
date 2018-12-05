module.exports = Board;

let config = {
    backlogSize: 100,
    stages: [
        {
            name: "backlog",
            diceCount: 0,
            limit: 100,
            isStart : true,
            isUnlimitedDone: false
        },
        {
            name: "analysis",
            diceCount: 3,
            limit: 3,
            isStart : false,
            isUnlimitedDone: false
        },
        {
            name: "development",
            diceCount: 2,
            limit: 2,
            isStart : false,
            isUnlimitedDone: false
        },
        {
            name: "testing",
            diceCount: 1,
            limit: 1,
            isStart : false,
            isUnlimitedDone: true
        }
    ]
};

let board = {
    columns: {},
    currentDay: 0
};

function Board(_config) {
    if (_config !== undefined) {
        config = _config;
    }

    config.stages.forEach((stage, i) => {
        board.columns[stage.name] = {
            "index": i,
            "isUnlimitedDone": stage.isUnlimitedDone,
            "limit": stage.limit,
            "dices": stage.isStart ? [] : generateDices(stage.diceCount, stage.name),
            "wip": [],
            "done": stage.isStart ? generateCards() : []
        }
    });
}

Board.prototype.view = function () {
    return board;
};

Board.prototype.turn = function () {
    board.currentDay++;

    getWorkStages().reverse().forEach(stage => {
        let card = {};
        let column = board.columns[stage];
        let index = column.index - 1;
        while (column.wip.length + (column.isUnlimitedDone ? 0 : column.done.length) < column.limit && card !== undefined) {
            card = Object.values(board.columns).filter(c => c.index === index)[0].done.shift();
            if (card !== undefined) {
                column.wip.push(card);
            }
        }

        let score = getScore(stage);

        while (score > 0 && board.columns[stage].wip.length > 0) {
            if (score < board.columns[stage].wip[0].remainings[stage]) {
                board.columns[stage].wip[0].remainings[stage] -= score;
                score = 0;
            } else {
                score -= board.columns[stage].wip[0].remainings[stage];
                board.columns[stage].wip[0].remainings[stage] = 0;
                board.columns[stage].done.push(board.columns[stage].wip.shift());
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

function generateCards() {
    let cards = [];
    for (let i = 0; i < config.backlogSize; i++) {
        let estimations = {};
        getWorkStages().forEach(stage =>
            estimations[stage] = (stage === "testing" ? getRandomInt(5, 20) : getRandomInt(1, 10))
        );
        let remainings = {};
        Object.assign(estimations, remainings);
        cards.push({
            "cardId": "S" + (i + 1).toString().padStart(3, "0"),
            "estimations": estimations,
            "remainings": remainings,
            "startDay": 0,
            "endDay": 0,
            "cycleTime": 0
        });
    }
    return cards;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}