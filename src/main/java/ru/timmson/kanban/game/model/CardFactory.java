package ru.timmson.kanban.game.model;

import java.util.function.IntFunction;

import static ru.timmson.kanban.game.model.Card.*;
import static ru.timmson.kanban.game.model.Stage.*;

public class CardFactory {

    public static Card F(Integer id, IntFunction<Integer> value, Estimation... estimations) {
        return createCard(id, CARD_TYPE_F, value, estimations);
    }

    public static Card I(Integer id, IntFunction<Integer> value, Estimation... estimations) {
        return createCard(id, CARD_TYPE_I, value, estimations);
    }

    public static Card E(Integer id, IntFunction<Integer> value, Estimation... estimations) {
        return createCard(id, CARD_TYPE_E, value, estimations);
    }

    public static Card S(Integer id, IntFunction<Integer> value, Estimation... estimations) {
        return createCard(id, CARD_TYPE_S, value, estimations);
    }

    private static Card createCard(Integer id, String cardType, IntFunction<Integer> value, Estimation... estimations) {
        return Card.builder().id(id).cardType(cardType).value(value).estimations(estimations).build();
    }

    public static Estimation A(Integer points) {
        return createEstimation(STAGE_ANALYSIS, points);
    }

    public static Estimation D(Integer points) {
        return createEstimation(STAGE_DEVELOPMENT, points);
    }

    public static Estimation T(Integer points) {
        return createEstimation(STAGE_TESTING, points);
    }

    private static Estimation createEstimation(Stage stage, Integer points) {
        return Estimation.builder().stage(stage).points(points).build();
    }
}
