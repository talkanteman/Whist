let React    = require("react");
let expect    = require("chai").expect;
let App    = require("App");
let app = new App();

describe("Israeli Wist Game", function() {
    describe("bets", function () {
        it("User bet and player 3 bet", function () {
            let bets = app.state.bets;
            app.handleBetBeforeDominant(0);

            expect(bets[2]).to.equal("''");
            expect(bets[3]).to.equal("''");
        });
    });
});