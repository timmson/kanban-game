const Util = require("./util");

class Card {

    static generateCard(id, currentDay, workingStages) {
        let estimations = {};
        workingStages.forEach(stage =>
            estimations[stage] = (stage === "testing" ? Util.getRandomInt(5, 15) : Util.getRandomInt(2, 10))
        );
        return {
            "cardId": "S" + id.toString().padStart(3, "0"),
            "estimations": estimations,
            "remainings": Object.assign({}, estimations),
            "startDay": currentDay,
            "endDay": 0,
            "cycleTime": 0
        };
    }

}

module.exports = Card;