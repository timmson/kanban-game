package ru.timmson.kanban.game.model;

import java.util.function.IntFunction;

import static ru.timmson.kanban.game.model.Card.*;
import static ru.timmson.kanban.game.model.Stage.*;

public class CardFactory {

    public static Card createCardF(IntFunction<Integer> value, Estimation... estimations) {
        return new Card(CARD_TYPE_F, value, estimations);
    }

    public static Card createCardI(IntFunction<Integer> value, Estimation... estimations) {
        return new Card(CARD_TYPE_I, value, estimations);
    }

    public static Card createCardE(IntFunction<Integer> value, Estimation... estimations) {
        return new Card(CARD_TYPE_E, value, estimations);
    }

    public static Card createCardS(IntFunction<Integer> value, Estimation... estimations) {
        return new Card(CARD_TYPE_S, value, estimations);
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
