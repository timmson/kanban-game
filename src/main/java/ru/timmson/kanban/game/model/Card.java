package ru.timmson.kanban.game.model;

import lombok.Getter;
import lombok.Setter;

import java.util.Map;
import java.util.function.IntFunction;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class Card {

    public static char CARD_TYPE_F = 'F';

    public static char CARD_TYPE_I = 'I';

    public static char CARD_TYPE_E = 'E';

    public static char CARD_TYPE_S = 'S';

    @Getter
    private char type;

    @Getter
    private Map<Stage, Integer> estimations;

    private IntFunction<Integer> value;

    @Getter
    @Setter
    private Integer startDay;

    @Getter
    @Setter
    private Integer endDay;

    Card(char type, IntFunction<Integer> value, Estimation... estimations) {
        this.type = type;
        this.value = value;
        this.estimations = Stream.of(estimations).collect(Collectors.toMap(Estimation::getStage, Estimation::getPoints));
    }

    public int calculateValue() throws CardNotFinishedException {
        if (startDay == null || endDay == null) {
            throw new CardNotFinishedException();
        }
        return value.apply(endDay - startDay);
    }


}
