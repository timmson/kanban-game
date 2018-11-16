package ru.timmson.kanban.game.model

class DiceSide(works: List<Work>) {

    private var points = mapOf<Stage?, Int?>()

    init {
        points = works.map { it.stage to it.points }.toMap()
    }

    fun getPoint(stage: Stage): Int? {
        return points[stage]
    }
}