package ru.timmson.kanban.game.model

import org.apache.commons.lang3.Range
import ru.timmson.kanban.game.generator.RandomGenerator
import java.util.*

class Board(board: BoardConfiguration) {

    private val tasksPerPerson = 2
    private val backlogLength = 100

    private var currentDay = 0

    private val backlogQueue: LinkedList<Card>
    private val analyzingPair: Pair<Column, List<Dice>>
    private val developingPair: Pair<Column, List<Dice>>
    private val testingPair: Pair<Column, List<Dice>>
    private val pairs: List<Pair<Column, List<Dice>>>

    init {
        backlogQueue = LinkedList(RandomGenerator.generateCards(Card.CARD_TYPE_S, backlogLength, Range.between(1, 10),
                listOf(Stage.STAGE_ANALYSIS, Stage.STAGE_DEVELOPMENT, Stage.STAGE_TESTING)))

        analyzingPair = getStageAndWorkers(Stage.STAGE_ANALYSIS,
                listOf(Stage.STAGE_DEVELOPMENT, Stage.STAGE_TESTING),
                board.a * tasksPerPerson, backlogQueue, true, board.a)

        developingPair = getStageAndWorkers(Stage.STAGE_DEVELOPMENT,
                listOf(Stage.STAGE_ANALYSIS, Stage.STAGE_TESTING),
                board.d * tasksPerPerson, analyzingPair.first.doneQueue, true, board.d)

        testingPair = getStageAndWorkers(Stage.STAGE_TESTING,
                listOf(Stage.STAGE_ANALYSIS, Stage.STAGE_DEVELOPMENT),
                board.t * tasksPerPerson, developingPair.first.doneQueue, false, board.t)

        pairs = listOf(analyzingPair, developingPair, testingPair)
    }


    fun work(): BoardSnapshot {
        currentDay++
        pairs.asReversed().forEach { it -> it.first.handle(it.second, currentDay) }
        return snapshot()
    }

    fun snapshot(): BoardSnapshot {
        return BoardSnapshot(
                mapOf(
                        Pair("backlog", ColumnSnapshot(emptyList(), backlogQueue.size, emptyList(), backlogQueue)),
                        Pair("analysis", ColumnSnapshot(analyzingPair.second, analyzingPair.first.wipLimit, analyzingPair.first.wipQueue, analyzingPair.first.doneQueue)),
                        Pair("development", ColumnSnapshot(developingPair.second, developingPair.first.wipLimit, developingPair.first.wipQueue, developingPair.first.doneQueue)),
                        Pair("testing", ColumnSnapshot(testingPair.second, testingPair.first.wipLimit, testingPair.first.wipQueue, testingPair.first.doneQueue))
                ),
                currentDay
        )
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