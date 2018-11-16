package ru.timmson.kanban.game.model

class Stage private constructor(stage: String) {

    companion object {
        @JvmField val STAGE_BACKLOG = Stage("B")

        @JvmField val STAGE_ANALYSIS = Stage("A")

        @JvmField val STAGE_DEVELOPMENT = Stage("D")

        @JvmField val STAGE_TESTING = Stage("T")

        @JvmField val STAGE_RELEASE = Stage("R")
    }
}