package ru.timmson.kanban.game.model;

import static ru.timmson.kanban.game.model.Card.*;
import static ru.timmson.kanban.game.model.Stage.STAGE_TYPE_ANALYSIS;
import static ru.timmson.kanban.game.model.Stage.STAGE_TYPE_DEVELOPMENT;
import static ru.timmson.kanban.game.model.Stage.STAGE_TYPE_TESTING;

public class Builder {

    public static Card createCardF(Estimation... estimations) {
        return new Card(CARD_TYPE_F, estimations);
    }

    public static Card createCardI(Estimation... estimations) {
        return new Card(CARD_TYPE_I, estimations);
    }

    public static Card createCardE(Estimation... estimations) {
        return new Card(CARD_TYPE_E, estimations);
    }

    public static Card createCardS(Estimation... estimations) {
        return new Card(CARD_TYPE_S, estimations);
    }

    public static Estimation A(Integer estimation) {
        return new Estimation(new Stage(STAGE_TYPE_ANALYSIS), estimation);
    }

    public static Estimation D(Integer estimation) {
        return new Estimation(new Stage(STAGE_TYPE_DEVELOPMENT), estimation);
    }

    public static Estimation T(Integer estimation) {
        return new Estimation( new Stage(STAGE_TYPE_TESTING), estimation);
    }
}
