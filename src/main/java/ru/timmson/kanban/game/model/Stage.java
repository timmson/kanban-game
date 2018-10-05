package ru.timmson.kanban.game.model;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class Stage {

    public static Stage STAGE_ANALYSIS = new Stage("A");

    public static Stage STAGE_DEVELOPMENT = new Stage("D");

    public static Stage STAGE_TESTING = new Stage("T");

    private String type;

}
