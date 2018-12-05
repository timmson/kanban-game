module.exports = Board;

let backlogSize = 10;

let stages = ["analysis", "development", "testing"];

function Board(a, d, t, cnt) {
    this.board = initBoard(
        (a !== undefined ? a : 1),
        (d !== undefined ? d : 1),
        (t !== undefined ? t : 1)
    );
    backlogSize = cnt;
}

Board.prototype.view = function () {
    console.log(this.board);
    return this.board;
};

Board.prototype.turn = function () {
    this.board.currentDay++;

    stages.reverse().forEach(stage => {
        let card = {};
        while (this.board.columns[stage].wip.length + this.board.columns[stage].done.length < this.board.columns[stage].limit && card !== undefined) {
            switch (stage) {
                case "analysis":
                    card = this.board.columns.backlog.done.shift();
                    break;
                case "development":
                    card = this.board.columns.analysis.done.shift();
                    break;
                case "testing":
                    card = this.board.columns.development.done.shift();
                    break;
            }
            if (card !== undefined) {
                this.board.columns[stage].wip.push(card);
            }
        }

        let work = getWork(this.board.columns[stage].workers, stage);

        while (work > 0 && this.board.columns[stage].wip.length > 0) {
            if (work < this.board.columns[stage].wip[0].remainings[stage]) {
                this.board.columns[stage].wip[0].remainings[stage] -= work;
                work = 0;
            } else {
                work -= this.board.columns[stage].wip[0].remainings[stage];
                this.board.columns[stage].wip[0].remainings[stage] = 0;
                this.board.columns[stage].done.push(this.board.columns[stage].wip.shift());
            }
        }
    });
    return this.view();
};


function initBoard(a, d, t) {
    return {
        "columns": {
            "backlog": {
                "workers": [],
                "limit": backlogSize,
                "wip": [],
                "done": generateCards(backlogSize)
            },
            "analysis": {
                "workers": generateDices(a, "analysis"),
                "limit": 2 * a,
                "wip": [],
                "done": []
            },
            "development": {
                "workers": generateDices(a, "development"),
                "limit": 2 * d,
                "wip": [],
                "done": []
            },
            "testing": {
                "workers": generateDices(a, "testing"),
                "limit": 2 * t,
                "wip": [],
                "done": []
            },
        },
        currentDay: 0
    };
}

function getWork(workers, type) {
    let count = 0;
    for (let i = 0; i < workers.length; i++) {
        count += workers[i][getRandomInt(0, 5)][type];
    }
    return count;
}

function generateDices(count, type) {
    let dice = [];
    for (let i = 0; i < 6; i++) {
        let diceSide = {};
        stages.forEach(stage =>
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

function generateDiceSide(work, type) {
    return (work === type) ? getRandomInt(3, 6) : getRandomInt(1, 3)
}

function generateCards(count) {
    let cards = [];
    for (let i = 0; i < count; i++) {
        let estimations = {};
        stages.forEach(stage =>
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