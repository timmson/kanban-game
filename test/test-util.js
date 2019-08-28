const {expect} = require("chai");
require("mocha");

const Util = require("../src/util");

describe("Util should", () => {

    it("return random number in range 10:16", () => {
        let result = Util.getRandomInt(10, 16);

        expect(result).to.be.within(9, 16);
    });

});