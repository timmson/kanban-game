package ru.timmson.kanban.game.service

import org.apache.commons.lang3.Range
import org.springframework.stereotype.Service
import ru.timmson.kanban.game.generator.RandomGenerator
import ru.timmson.kanban.game.model.Card
import ru.timmson.kanban.game.model.Column
import ru.timmson.kanban.game.model.Dice
import ru.timmson.kanban.game.model.Stage
import java.util.*

@Service
class Simulation {

    fun simulate(): String {
        return simulate(1, 1, 1)
    }

    fun simulate(a: Int, d: Int, t: Int): String {
        val sb = StringBuilder()

        val tasksPerPerson = 2
        val backlogLength = 100

        val backlogQueue = LinkedList<Card>(RandomGenerator.generateCards(Card.CARD_TYPE_S, backlogLength, Range.between(1, 10),
                listOf(Stage.STAGE_ANALYSIS, Stage.STAGE_DEVELOPMENT, Stage.STAGE_TESTING)))

        val analyzingPair = getStageAndWorkers(Stage.STAGE_ANALYSIS,
                listOf(Stage.STAGE_DEVELOPMENT, Stage.STAGE_TESTING),
                a * tasksPerPerson, backlogQueue, true, a)
        val analyzing = analyzingPair.first
        val analysts = analyzingPair.second

        val developingPair = getStageAndWorkers(Stage.STAGE_DEVELOPMENT,
                listOf(Stage.STAGE_ANALYSIS, Stage.STAGE_TESTING),
                d * tasksPerPerson, analyzing.doneQueue, true, d)
        val developing = developingPair.first
        val developers = developingPair.second

        val testingPair = getStageAndWorkers(Stage.STAGE_TESTING,
                listOf(Stage.STAGE_ANALYSIS, Stage.STAGE_DEVELOPMENT),
                /*t * tasksPerPerson*/backlogLength, developing.doneQueue, false, t)
        val testing = testingPair.first
        val testers = testingPair.second

        sb.append("Day #" + "\t" + "BL" + "\t|\t" +
                "W(" + a + "/" + a * tasksPerPerson + ")\t" + "D" + "\t|\t" +
                "W(" + d + "/" + d * tasksPerPerson + ")\t" + "D" + "\t|\t" +
                "W(" + t + "/" + t * tasksPerPerson + ")\t" + "D" + "\n")

        sb.append("0" + "\t" + backlogQueue.size + "\t|\t" +
                analyzing.wipQueue.size + "\t" + analyzing.doneQueue.size + "\t|\t" +
                developing.wipQueue.size + "\t" + developing.doneQueue.size + "\t|\t" +
                testing.wipQueue.size + "\t" + testing.doneQueue.size + "\n")

        var day = 1
        val initialSize = backlogQueue.size
        while (testing.doneQueue.size < initialSize) {
            testing.handle(testers, day)
            developing.handle(developers, day)
            analyzing.handle(analysts, day)
            sb.append(day.toString() + "\t" + backlogQueue.size + "\t|\t" +
                    analyzing.wipQueue.size + "\t" + analyzing.doneQueue.size + "\t|\t" +
                    developing.wipQueue.size + "\t" + developing.doneQueue.size + "\t|\t" +
                    testing.wipQueue.size + "\t" + testing.doneQueue.size + "\n")
            day++
        }

        testing.doneQueue.sortedBy { it.cardId }.forEach { sb.append(it.cardId + "\t" + it.startDay + "\t" + it.endDay + "\t" + it.getCycleTime() + "\t" + "\n") }

        return sb.toString()
    }

    private fun getStageAndWorkers(primaryStage: Stage, slaveStage: List<Stage>, wipLimit: Int, inputQueue: LinkedList<Card>, isNotLastStage: Boolean, diceCount: Int): Pair<Column, List<Dice>> {
        return Pair(
                Column(primaryStage, wipLimit, inputQueue, isNotLastStage),
                IntRange(1, diceCount).map {
                    RandomGenerator.generateStandardDice(
                            6,
                            Range.between(4, 6), primaryStage,
                            Range.between(1, 3), slaveStage)
                }
        )
    }

}