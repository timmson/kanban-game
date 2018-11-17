package ru.timmson.kanban.game.controller

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import ru.timmson.kanban.game.model.Simulation
import java.lang.StringBuilder

@RestController
@RequestMapping("/")
class DefaultController(private val sim: Simulation) {

    @GetMapping
    fun index(@RequestParam(required = false) a: Int?,
              @RequestParam(required = false) d: Int?,
              @RequestParam(required = false) t: Int?): String {
        return "<pre>" + sim.simulate(a ?: 1, d ?: 1, t ?: 1) + "</pre>"
    }

}