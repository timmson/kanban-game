package ru.timmson.kanban.game.model

import ru.timmson.kanban.game.model.Card.Companion.CARD_TYPE_E
import ru.timmson.kanban.game.model.Card.Companion.CARD_TYPE_F
import ru.timmson.kanban.game.model.Card.Companion.CARD_TYPE_I
import ru.timmson.kanban.game.model.Card.Companion.CARD_TYPE_S
import ru.timmson.kanban.game.model.Stage.Companion.STAGE_ANALYSIS
import ru.timmson.kanban.game.model.Stage.Companion.STAGE_DEVELOPMENT
import ru.timmson.kanban.game.model.Stage.Companion.STAGE_TESTING
import java.util.*

class CardFactory {
    companion object {
        @JvmStatic
        fun f(id: Int?, value: (Int) -> Int, vararg works: Work): Card {
            return createCard(id, CARD_TYPE_F, value, *works)
        }

        @JvmStatic
        fun i(id: Int?, value: (Int) -> Int, vararg works: Work): Card {
            return createCard(id, CARD_TYPE_I, value, *works)
        }

        @JvmStatic
        fun e(id: Int?, value: (Int) -> Int, vararg works: Work): Card {
            return createCard(id, CARD_TYPE_E, value, *works)
        }

        @JvmStatic
        fun s(id: Int?, value: (Int) -> Int, vararg works: Work): Card {
            return createCard(id, CARD_TYPE_S, value, *works)
        }

        private fun createCard(id: Int?, cardType: String, value: (Int) -> Int, vararg works: Work): Card {
            return Card(id!!, cardType, value, listOf(*works))
        }

        @JvmStatic
        fun a(points: Int?): Work {
            return createWork(STAGE_ANALYSIS, points)
        }

        @JvmStatic
        fun d(points: Int?): Work {
            return createWork(STAGE_DEVELOPMENT, points)
        }

        @JvmStatic
        fun t(points: Int?): Work {
            return createWork(STAGE_TESTING, points)
        }

        private fun createWork(stage: Stage, points: Int?): Work {
            return Work(stage, points)
        }

        @JvmStatic
        fun dice(vararg diceSides: DiceSide): Dice {
            return Dice(Arrays.asList(*diceSides))
        }

        @JvmStatic
        fun side(vararg works: Work): DiceSide {
            return DiceSide(Arrays.asList(*works))
        }
    }
}