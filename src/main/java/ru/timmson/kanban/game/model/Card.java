package ru.timmson.kanban.game.model;

import lombok.Getter;

import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Getter
public class Card {

    public static char CARD_TYPE_F = 'F';

    public static char CARD_TYPE_I = 'I';

    public static char CARD_TYPE_E = 'E';

    public static char CARD_TYPE_S = 'S';

    private char type;

    private Map<Stage, Integer> estimations;

    Card(char type, Estimation... estimations) {
        this.type = type;
        this.estimations = Stream.of(estimations).collect(Collectors.toMap(Estimation::getStage, Estimation::getPoints));
    }

}
