class Column {

    static hasAvailableSlots(column) {
        if (!column.limit) {
            return true;
        } else {
            return this.countCardsIn(column) < column.limit;
        }
    }

    static countCardsIn(column) {
        return column.wip.length + (column.done ? column.done.length : 0)
    }

    static isDelayed(column, currentDay) {
        return column.delay ? column.delay >= 2 && (currentDay % column.delay  !== 0) : false;
    }

    static isAvailableForPulling(column) {
        return !!(column.done || !column.dices);
    }

}

module.exports = Column;