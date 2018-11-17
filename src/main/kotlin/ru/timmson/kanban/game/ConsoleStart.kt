package ru.timmson.kanban.game

import org.apache.commons.lang3.Range
import ru.timmson.kanban.game.generator.RandomGenerator.Companion.generateCards
import ru.timmson.kanban.game.generator.RandomGenerator.Companion.generateStandardDice
import ru.timmson.kanban.game.model.Card
import ru.timmson.kanban.game.model.Card.Companion.CARD_TYPE_S
import ru.timmson.kanban.game.model.Column
import ru.timmson.kanban.game.model.Stage
import java.util.*

fun main(args: Array<String>) {

    val backlogQueue = LinkedList<Card>(generateCards(CARD_TYPE_S, 100, Range.between(1, 10), Stage.STAGE_ANALYSIS, Stage.STAGE_DEVELOPMENT, Stage.STAGE_TESTING))

    val analyzing = Column(Stage.STAGE_ANALYSIS, 10, backlogQueue, true)
    val analyst = generateStandardDice(6, Range.between(4, 6), Stage.STAGE_ANALYSIS, Range.between(1, 3), Stage.STAGE_DEVELOPMENT, Stage.STAGE_TESTING)

    val developing = Column(Stage.STAGE_DEVELOPMENT, 10, analyzing.doneQueue, true)
    val developer = generateStandardDice(6, Range.between(4, 6), Stage.STAGE_DEVELOPMENT, Range.between(1, 3), Stage.STAGE_ANALYSIS, Stage.STAGE_TESTING)

    val testing = Column(Stage.STAGE_TESTING, 10, developing.doneQueue, false)
    val tester = generateStandardDice(6, Range.between(4, 6), Stage.STAGE_TESTING, Range.between(1, 3), Stage.STAGE_ANALYSIS, Stage.STAGE_DEVELOPMENT)


    println("Start first day!!!")

    var day = 1
    var initialSize = backlogQueue.size
    while (testing.doneQueue.size < initialSize) {
        testing.handle(listOf(tester), day)
        developing.handle(listOf(developer), day)
        analyzing.handle(listOf(analyst), day)
        println(day.toString() + "\t" + backlogQueue.size + "\t|\t" +
                analyzing.getWipSize() + "\t" + analyzing.doneQueue.size + "\t|\t" +
                developing.getWipSize() + "\t" + developing.doneQueue.size + "\t|\t" +
                testing.getWipSize() + "\t" + testing.doneQueue.size)
        day++
    }

    testing.doneQueue.sortedBy { it.cardId }.forEach { println(it.cardId + "\t" + it.startDay + "\t" + it.endDay + "\t" + it.getCycleTime() + "\t") }

}