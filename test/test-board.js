const {expect} = require("chai");
require("mocha");

const Board = require("../src/board");

describe("Board test", () => {

    let config = {
        stages: [
            {
                name: "someStage",
                diceCount: 2
            },
            {
                name: "testing",
                diceCount: 2
            },
            {
                name: "done"
            }
        ]
    };

    let board = new Board(config);

    it("when view calls then current board is returned", () => {
        let result = board.view();
    });

    /*it("when view calls then current board is returned", () => {
        let result = board.turn();
    });*/

});