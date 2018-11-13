package ru.timmson.kanban.game.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/")
public class DefaultController {


    @GetMapping(path = "/")
    public String index() {
        return "OK";
    }

}
