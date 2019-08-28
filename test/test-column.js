const {expect} = require("chai");
require("mocha");

const Column = require("../src/column");

describe("Column should", () => {


    it("have ability to move when it has no limit ", () => {
        let column = {};

        let result = Column.hasAvailableSlots(column);

        expect(result).to.be.true;
    });

    it("have ability to move it card count is lower than column limit", function () {
        let column = {
            limit: 4,
            wip: [1, 1, 1]
        };

        let result = Column.hasAvailableSlots(column);

        expect(result).to.be.true;
    });

    it("not have ability to move it card count in wip and done is equal or greater than column limit", function () {
        let column = {
            limit: 4,
            wip: [1, 1, 1],
            done: [1]
        };

        let result = Column.hasAvailableSlots(column);

        expect(result).to.be.false;
    });

    it("have 2 cards when 2 cards is in wip and done is missing", () => {
        let column = {
            wip: [1, 1]
        };

        let result = Column.countCardsIn(column);

        expect(result).to.be.eq(2);
    });

    it("have 2 cards when 1 card is in wip and 1 card is in done", () => {
        let column = {
            wip: [1],
            done: [1]
        };

        let result = Column.countCardsIn(column);

        expect(result).to.be.eq(2);
    });

    it("have opportunity to pull new card when delay is missing", () => {
        let currentDay = 7;
        let column = {

        };

        let result = Column.isDelayed(column, currentDay);

        expect(result).to.be.false;
    });

    it("have opportunity to pull new card when delay is over", () => {
        let currentDay = 14;
        let column = {
            delay: 7
        };

        let result = Column.isDelayed(column, currentDay);

        expect(result).to.be.false;
    });

    it("not have opportunity to pull new card when delay is not over", () => {
        let currentDay = 14;
        let column = {
            delay: 8
        };

        let result = Column.isDelayed(column, currentDay);

        expect(result).to.be.true;
    });


    it("not be available for pulling card from when it does have done and has dices ", () => {
        let column = {
            dices: [2]
        };

        let result = Column.isAvailableForPulling(column);

        expect(result).to.be.false;
    });

});