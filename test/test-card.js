const {expect} = require("chai");
require("mocha");

const Card = require("../src/card");

describe("Card should", () => {

	it("generate filled card when id,currentDay and working stages are given", () => {
		let card = Card.generateCard(1, 1,["someStage", "testing"]);

		expect(card).to.have.property("cardId", "S001");
		expect(card.estimations).to.have.all.keys(["someStage", "testing"]);
	});

});