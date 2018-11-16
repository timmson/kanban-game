package ru.timmson.kanban.game

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
open class Game

fun main(args: Array<String>) {
    runApplication<Game>(*args)
}