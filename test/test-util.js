const {expect} = require("chai");
require("mocha");

const Util = require("../src/util");

describe("Util test", () => {

    it("when random calls then it generates any number between min and max", () => {
        let result = Util.getRandomInt(10, 16);

        expect(result).to.be.within(9, 16);
    });

});