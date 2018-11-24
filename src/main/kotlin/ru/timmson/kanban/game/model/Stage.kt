package ru.timmson.kanban.game.model

data class Stage constructor(var stage: String) {

    companion object {
        @JvmField
        val STAGE_BACKLOG = Stage("backlog")

        @JvmField
        val STAGE_ANALYSIS = Stage("analysis")

        @JvmField
        val STAGE_DEVELOPMENT = Stage("development")

        @JvmField
        val STAGE_TESTING = Stage("testing")

        @JvmField
        val STAGE_RELEASE = Stage("release")
    }

    override fun toString(): String = stage

}