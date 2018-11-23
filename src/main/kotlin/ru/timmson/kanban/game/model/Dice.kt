package ru.timmson.kanban.game.model

import java.util.*

data class Dice(val points: List<DiceSide>) {

    private val random = Random()

    fun roll(stage: Stage): Int? {
        return points[random.nextInt(points.size - 1 + 1)].getPoint(stage)
    }

    override fun toString(): String {
        return "Dice{" +
                "points=" + points +
                '}'.toString()
    }
}