package ru.timmson.kanban.game.model;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class Estimation {

    private Stage stage;

    private Integer points;

}
