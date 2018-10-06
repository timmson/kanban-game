package ru.timmson.kanban.game.model;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.Map;
import java.util.function.IntFunction;
import java.util.stream.Collectors;

public class Card {

    public static String CARD_TYPE_F = "F";

    public static String CARD_TYPE_I = "I";

    public static String CARD_TYPE_E = "E";

    public static String CARD_TYPE_S = "S";

    @Getter
    private String cardId;

    @Getter
    private String cardType;

    private Map<Stage, Integer> estimations;

    private Map<Stage, Integer> remainings;

    private IntFunction<Integer> value;

    @Getter
    @Setter
    private Integer startDay;

    @Getter
    @Setter
    private Integer endDay;

    @Builder
    Card(Integer id, String cardType, IntFunction<Integer> value, List<Work> works) {
        this.cardId = cardType + id;
        this.cardType = cardType;
        this.value = value;
        this.estimations = works.stream().collect(Collectors.toMap(Work::getStage, Work::getPoints));
        this.remainings = this.estimations;
    }

    public Integer getEstimation(Stage stage) {
        return estimations.get(stage);
    }

    public Integer getRemaining(Stage stage) {
        return remainings.get(stage);
    }

    public Integer decreaseRemaining(Stage stage, Integer points) {
        Integer remainPoints;
        if (points >= remainings.get(stage)) {
            remainPoints = points - remainings.get(stage);
            remainings.put(stage, 0);
        } else {
            remainPoints = 0;
            remainings.put(stage, remainings.get(stage) - points);
        }
        return remainPoints;
    }

    public Integer getCycleTime() throws CardNotFinishedException  {
        if (startDay == null || endDay == null) {
            throw new CardNotFinishedException();
        }
       return endDay - startDay;
    }

    public int calculateValue() throws CardNotFinishedException {
        return value.apply(getCycleTime());
    }

    @Override
    public String toString() {
        return "Card{" +
                "cardId='" + cardId + '\'' +
                ", estimations=" + estimations +
                '}';
    }
}
