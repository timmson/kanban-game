package ru.timmson.kanban.game.generator

import org.apache.commons.lang3.Range
import ru.timmson.kanban.game.model.*
import java.util.*

class RandomGenerator {

    companion object {
        val random = Random()

        @JvmStatic fun generateStandardDice(count: Int, primaryRange: Range<Int>, primaryStage: Stage, secondaryRange: Range<Int>, vararg secondaryStages: Stage): Dice {
            return Dice(IntRange(1, count).map { DiceSide(listOf(createWork(primaryStage, primaryRange)).plus(secondaryStages.map { stage -> createWork(stage, secondaryRange) })) })
        }

        @JvmStatic fun generateCards(cardType: String, count: Int, range: Range<Int>, vararg stages: Stage): List<Card> {
            return IntRange(1, count).map { i -> Card(i, cardType, { _ -> 1 }, stages.map { stage -> createWork(stage, range) }) }
        }

        @JvmStatic private fun createWork(stage: Stage, range: Range<Int>): Work {
            return Work(stage, random.nextInt(range.maximum + 1 - range.minimum) + range.minimum)
        }
    }

}