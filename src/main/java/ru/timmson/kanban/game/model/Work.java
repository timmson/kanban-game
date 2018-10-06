package ru.timmson.kanban.game.model;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class Work {

    private Stage stage;

    private Integer points;

}
