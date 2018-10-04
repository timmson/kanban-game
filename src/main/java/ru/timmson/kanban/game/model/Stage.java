package ru.timmson.kanban.game.model;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor(access = AccessLevel.PACKAGE)
public class Stage {

    public static char STAGE_TYPE_ANALYSIS = 'A';

    public static char STAGE_TYPE_DEVELOPMENT = 'D';

    public static char STAGE_TYPE_TESTING = 'T';

    private char type;

}
