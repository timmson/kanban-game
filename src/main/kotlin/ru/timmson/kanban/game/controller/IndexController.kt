package ru.timmson.kanban.game.controller

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import ru.timmson.kanban.game.model.Board
import ru.timmson.kanban.game.model.BoardConfiguration
import ru.timmson.kanban.game.model.BoardSnapshot

@RestController
@RequestMapping("/")
class IndexController {

    private var board: Board = Board(BoardConfiguration(1, 1, 1))


    @GetMapping("/new")
    fun new(@RequestParam(required = false) a: Int?,
            @RequestParam(required = false) d: Int?,
            @RequestParam(required = false) t: Int?): BoardSnapshot {
        board = Board(BoardConfiguration(a ?: 1, d ?: 1, t ?: 1))
        return view()
    }

    @GetMapping("/view")
    fun view(): BoardSnapshot {
        return board.snapshot()
    }

    @GetMapping("/work")
    fun work(): BoardSnapshot {
        return board.work()
    }
}