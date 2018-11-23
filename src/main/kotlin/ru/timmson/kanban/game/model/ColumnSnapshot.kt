package ru.timmson.kanban.game.model

data class ColumnSnapshot(var workers: List<Dice>, var wip: List<Card>, var done: List<Card>)