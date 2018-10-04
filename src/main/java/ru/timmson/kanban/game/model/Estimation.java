package ru.timmson.kanban.game.model;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class Estimation {

    private Stage stage;

    private Integer points;

}
