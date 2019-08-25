const {expect} = require("chai");
require("mocha");

const Card = require("../src/card");

describe("Card test", () => {

    it("when generate card then filled card is returned", () => {
        let card = Card.generateCard(1, 1,["someStage", "testing"]);

        expect(card).to.have.property("cardId", "S001");
        expect(card.estimations).to.have.all.keys(["someStage", "testing"]);
    });

});