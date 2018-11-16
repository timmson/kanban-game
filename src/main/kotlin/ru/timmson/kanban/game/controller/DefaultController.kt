package ru.timmson.kanban.game.controller

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/")
class DefaultController {

    @GetMapping(path = ["/"])
    fun index(): String {
        return "OK"
    }

}