module.exports = Board;

let backlogSize = 5;

function Board(a, d, t) {
    this.board = initBoard(
        (a !== undefined ? a : 1),
        (d !== undefined ? d : 1),
        (t !== undefined ? t : 1)
    );
}

Board.prototype.view = function () {
    console.log(this.board);
    return this.board;
};

Board.prototype.turn = function () {
    //some magic
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
                "workers": getWorkers(a, "analysis"),
                "limit": 2 * a,
                "wip": [],
                "done": []
            },
            "development": {
                "workers": getWorkers(a, "development"),
                "limit": 2 * d,
                "wip": [],
                "done": []
            },
            "testing": {
                "workers": getWorkers(a, "testing"),
                "limit": 2 * t,
                "wip": [],
                "done": []
            },
        },
        currentDay: 0
    };
}

function getWorkers(count, type) {
    let dice = [];
    for (let i = 0; i < 6; i++) {
        dice.push(
            {
                "analysis": getDiceSide("analysis", type),
                "development": getDiceSide("development", type),
                "testing": getDiceSide("testing", type),
            }
        )
    }

    let workers = [];
    for (let i = 0; i < count; i++) {
        workers.push(dice);
    }
    return workers;
}

function getDiceSide(work, type) {
    return (work === type) ? getRandomInt(3, 6) : getRandomInt(1, 3)
}

function generateCards(count) {
    let cards = [];
    for (let i = 0; i < count; i++) {
        let estimations = {
            "analysis": getRandomInt(1, 10),
            "development": getRandomInt(1, 10),
            "testing": getRandomInt(5, 20),
        };
        cards.push({
            "cardId": "S" + i.toString().padStart(3, "0"),
            "estimations": estimations,
            "remainings": estimations,
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