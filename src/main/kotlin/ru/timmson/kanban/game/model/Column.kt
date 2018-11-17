package ru.timmson.kanban.game.model

import java.util.*

class Column(var stage: Stage, var wipLimit: Int, private val toDoQueue: LinkedList<Card>, val isOutputQueueLimited: Boolean) {

    private val wipQueue = LinkedList<Card>()

    val doneQueue = LinkedList<Card>()

    fun getWipSize(): Int {
        return wipQueue.size
    }

    fun handle(dices: List<Dice>, currentDay: Int) {
        var points = dices.sumBy { dice -> dice.roll(stage)!! }
        pull(currentDay)
        var card = (if (!wipQueue.isEmpty()) wipQueue.first else null)
        while (card != null && points > 0) {
            points = card.decreaseRemaining(stage, points)!!
            if (card.getRemaining(stage) == 0) {
                if (stage == Stage.STAGE_TESTING) {
                    card.endDay = currentDay;
                }
                doneQueue.push(wipQueue.pop())
                pull(currentDay)
                card = (if (!wipQueue.isEmpty()) wipQueue.first else null)
            }
        }
    }

    fun pull(currentDay: Int) {
        while (wipLimit > wipQueue.size + (if (isOutputQueueLimited) doneQueue.size else 0) && !toDoQueue.isEmpty()) {
            val card = toDoQueue.pop()
            if (stage == Stage.STAGE_ANALYSIS) {
                card.startDay = currentDay
            }
            wipQueue.push(card)
        }
    }

}