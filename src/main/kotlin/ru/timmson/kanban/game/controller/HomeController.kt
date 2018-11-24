package ru.timmson.kanban.game.controller

import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping

@Controller
@RequestMapping("/home")
class HomeController {

    @GetMapping
    fun index(): String {
        return "static/index.html"
    }

}