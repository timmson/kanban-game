const {expect} = require("chai");
require("mocha");

const Board = require("../src/board");

describe("Test1", () => {

    let config = {
        stages: [
            {
                name: "someStage",
                diceCount: 2
            },
            {
                name: "testing",
                diceCount: 2
            }
        ]
    };

    let board = new Board(config);

    it("when generate dices then filled dices is returned", ()=> {
        let dices = board.generateDices(10, "testing");

        expect(dices).to.have.lengthOf(10);
    });

    it("when generate primary dice side then filled dice slide is returned",() =>{
        let diceSlide = board.generateDiceSide("testing", "testing");

        expect(diceSlide).to.be.within(1,4);
    });

    it("when generate secondary dice side then filled dice slide is returned",() =>{
        let diceSlide = board.generateDiceSide("testing", "someStage");

        expect(diceSlide).to.be.within(0,2);
    });

    it("when generate card then filled card is returned", () => {
        let card = board.generateCard();

        expect(card).to.have.property("cardId", "S001");
        expect(card.estimations).to.have.all.keys(["someStage", "testing"]);
    });

    it("when random calls then it generates any number between min and max", () => {
        let result = board.getRandomInt(10, 16);

        expect(result).to.be.within(9, 16);
    });
});