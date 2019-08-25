const {expect} = require("chai");
require("mocha");

const Dice = require("../src/dice");

describe("Dice test", () => {

    it("when dices roll then some score appears", () => {
        let score = Dice.getScore("testing", Dice.generateDices("testing", ["testing", "someStage"], 10));

        expect(score).to.be.within(1 * 10, 4 * 10);
    });

    it("when generate 10 dices then filled 10 dices is returned", () => {
        let dices = Dice.generateDices("testing", ["testing", "someStage"], 10);

        expect(dices).to.have.lengthOf(10);
    });

    it("when generate 1 dice then filled 1 dice is returned", () => {
        let dice = Dice.generateDice("testing", ["testing", "someStage"]);

        expect(dice).to.have.lengthOf(6);
    });

    it("when generate primary dice side then filled dice slide is returned", () => {
        let diceSlide = Dice.generateDiceSide("testing", "testing");

        expect(diceSlide).to.be.within(1, 4);
    });

    it("when generate secondary dice side then filled dice slide is returned", () => {
        let diceSlide = Dice.generateDiceSide("testing", "someStage");

        expect(diceSlide).to.be.within(0, 2);
    });

});