const Card = require("../src/card");

describe("Card should", () => {

    test("generate filled card when id,currentDay and working stages are given", () => {
        let card = Card.generateCard(1, 1, ["someStage", "testing"]);

        expect(card).toHaveProperty("cardId", "S001");
        expect(card.estimations).toHaveProperty("someStage");
        expect(card.estimations).toHaveProperty("testing");
    });

});