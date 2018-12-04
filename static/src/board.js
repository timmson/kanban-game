module.exports = Board;

let backlogSize = 100;

function Board(a, d, t) {
    this.analystCount = (a !== undefined ? a : 1);
    this.developerCount = (d !== undefined ? d : 1);
    this.testerCount = (t !== undefined ? t : 1);
    this.board = initBoard();
}

Board.prototype.view = function () {
    return this.board;
};

Board.prototype.turn = function () {
    //some magic
    return this.view();
};

function initBoard() {
    return {
        "columns": {
            "backlog": {
                "workers": [],
                "limit": backlogSize,
                "wip": [],
                "done": [
                    {
                        "cardId": "S001",
                        "estimations": {
                            "analysis": 5,
                            "development": 8,
                            "testing": 11
                        },
                        "remainings": {
                            "analysis": 5,
                            "development": 8,
                            "testing": 11
                        },
                        "startDay": 0,
                        "endDay": 0,
                        "cycleTime": 0
                    }
                ]
            },
            "analysis": {
                "workers": [],
                "limit": 2,
                "wip": [],
                "done": []
            },
            "development": {
                "workers": [],
                "limit": 2,
                "wip": [],
                "done": []
            },
            "testing": {
                "workers": [],
                "limit": 2,
                "wip": [],
                "done": []
            },
        },
        currentDay: 0
    };
}