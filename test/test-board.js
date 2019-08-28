const {expect} = require("chai");
require("mocha");

const Board = require("../src/board");
const Column = require("../src/column");

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

    it("when move card on column the move next as possible", () => {
        let result = board.view();

        let result2 = board.move(new Column(result.columns["testing"]));
    });

    /*it("when view calls then current board is returned", () => {
        let result = board.turn();
    });*/

});