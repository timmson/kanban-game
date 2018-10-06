package ru.timmson.kanban.game.model;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.ToString;

@Getter
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@ToString
public class Stage {

    public static Stage STAGE_BACKLOG = new Stage("B");

    public static Stage STAGE_ANALYSIS = new Stage("A");

    public static Stage STAGE_DEVELOPMENT = new Stage("D");

    public static Stage STAGE_TESTING = new Stage("T");

    public static Stage STAGE_RELEASE = new Stage("R");

    private String type;

}
