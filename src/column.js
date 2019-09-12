class Column {

	constructor(column) {
		this.column = column;
	}

	hasAvailableSlots() {
		if (!this.column.limit) {
			return true;
		} else {
			return this.countCardsIn(this.column) < this.column.limit;
		}
	}

	countCardsIn() {
		return this.column.wip.length + (this.column.done ? this.column.done.length : 0);
	}

	isDelayed(currentDay) {
		return this.column.delay ? this.column.delay >= 2 && (currentDay % this.column.delay !== 0) : false;
	}

	isAvailableForPulling() {
		return !!(this.column.done || !this.column.dices);
	}

	getIndex() {
		return this.column.index;
	}

	pull(card) {
		this.column.wip.push(card);
	}

	get() {
		return this.column;
	}

}

module.exports = Column;