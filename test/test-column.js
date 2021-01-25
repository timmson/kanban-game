const Column = require("../src/column");

describe("Column should", () => {


	test("have ability to move when it has no limit ", () => {
		let column = new Column({});

		let result = column.hasAvailableSlots();

		expect(result).toBeTruthy();
	});

	test("have ability to move it card count is lower than column limit", function () {
		let column = new Column({
			limit: 4,
			wip: [1, 1, 1]
		});

		let result = column.hasAvailableSlots();

		expect(result).toBeTruthy();
	});

	test("not have ability to move it card count in wip and done is equal or greater than column limit", function () {
		let column = new Column({
			limit: 4,
			wip: [1, 1, 1],
			done: [1]
		});

		let result = column.hasAvailableSlots();

		expect(result).toBeFalsy();
	});

	test("have 2 cards when 2 cards is in wip and done is missing", () => {
		let column = new Column({
			wip: [1, 1]
		});

		let result = column.countCardsIn();

		expect(result).toEqual(2);
	});

	test("have 2 cards when 1 card is in wip and 1 card is in done", () => {
		let column = new Column({
			wip: [1],
			done: [1]
		});

		let result = column.countCardsIn();

		expect(result).toEqual(2);
	});

	test("have opportunity to pull new card when delay is missing", () => {
		let currentDay = 7;
		let column = new Column({});

		let result = column.isDelayed(currentDay);

		expect(result).toBeFalsy();
	});

	test("have opportunity to pull new card when delay is over", () => {
		let currentDay = 14;
		let column = new Column({
			delay: 7
		});

		let result = column.isDelayed(currentDay);

		expect(result).toBeFalsy();
	});

	test("not have opportunity to pull new card when delay is not over", () => {
		let currentDay = 14;
		let column = new Column({
			delay: 8
		});

		let result = column.isDelayed(currentDay);

		expect(result).toBeTruthy();
	});


	test("not be available for pulling card from when it does have done and has dices ", () => {
		let column = new Column({
			dices: [2]
		});

		let result = column.isAvailableForPulling();

		expect(result).toBeFalsy();
	});

	test("return own index", () => {
		let column = new Column({
			index: 1
		});

		let result = column.getIndex();

		expect(result).toEqual(1);
	});

	test("increase cards count in wip when push new one", () => {
		let column = new Column({
			wip: [1],
		});

		column.pull(1);
		let result = column.get().wip.length;

		expect(result).toEqual(2);
	});

});