package ru.timmson.kanban.game.model;

import java.util.function.IntFunction;

import static ru.timmson.kanban.game.model.Card.*;
import static ru.timmson.kanban.game.model.Stage.*;

public class CardFactory {

    public static Card createCardF(Integer id, IntFunction<Integer> value, Estimation... estimations) {
        return createCard(id, CARD_TYPE_F, value, estimations);
    }

    public static Card createCardI(Integer id, IntFunction<Integer> value, Estimation... estimations) {
        return createCard(id, CARD_TYPE_I, value, estimations);
    }

    public static Card createCardE(Integer id, IntFunction<Integer> value, Estimation... estimations) {
        return createCard(id, CARD_TYPE_E, value, estimations);
    }

    public static Card createCardS(Integer id, IntFunction<Integer> value, Estimation... estimations) {
        return createCard(id, CARD_TYPE_S, value, estimations);
    }

    private static Card createCard(Integer id, String cardType, IntFunction<Integer> value, Estimation... estimations) {
        return Card.builder().id(id).cardType(cardType).value(value).estimations(estimations).build();
    }

    public static Estimation A(Integer estimation) {
        return new Estimation(new Stage(STAGE_TYPE_ANALYSIS), estimation);
    }

    public static Estimation D(Integer estimation) {
        return new Estimation(new Stage(STAGE_TYPE_DEVELOPMENT), estimation);
    }

    public static Estimation T(Integer estimation) {
        return new Estimation(new Stage(STAGE_TYPE_TESTING), estimation);
    }
}
