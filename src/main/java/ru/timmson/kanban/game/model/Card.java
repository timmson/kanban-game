package ru.timmson.kanban.game.model;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.Map;
import java.util.function.IntFunction;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class Card {

    public static String CARD_TYPE_F = "F";

    public static String CARD_TYPE_I = "I";

    public static String CARD_TYPE_E = "E";

    public static String CARD_TYPE_S = "S";

    @Getter
    private String cardId;

    @Getter
    private String cardType;

    @Getter
    private Map<Stage, Integer> estimations;

    private IntFunction<Integer> value;

    @Getter
    @Setter
    private Integer startDay;

    @Getter
    @Setter
    private Integer endDay;

    @Builder
    Card(Integer id, String cardType, IntFunction<Integer> value, Estimation... estimations) {
        this.cardId = cardType + id;
        this.cardType = cardType;
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
