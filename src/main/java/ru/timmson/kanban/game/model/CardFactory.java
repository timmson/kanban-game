package ru.timmson.kanban.game.model;

import java.util.Arrays;
import java.util.List;
import java.util.function.IntFunction;

import static ru.timmson.kanban.game.model.Card.*;
import static ru.timmson.kanban.game.model.Stage.*;

public class CardFactory {

    //////////////////////Cards///////////////////////////////////

    public static Card F(Integer id, IntFunction<Integer> value,  Work... works) {
        return createCard(id, CARD_TYPE_F, value, Arrays.asList(works));
    }

    public static Card I(Integer id, IntFunction<Integer> value, Work... works) {
        return createCard(id, CARD_TYPE_I, value, Arrays.asList(works));
    }

    public static Card E(Integer id, IntFunction<Integer> value, Work... works) {
        return createCard(id, CARD_TYPE_E, value, Arrays.asList(works));
    }

    public static Card S(Integer id, IntFunction<Integer> value, Work... works) {
        return createCard(id, CARD_TYPE_S, value, Arrays.asList(works));
    }

    private static Card createCard(Integer id, String cardType, IntFunction<Integer> value, List<Work> works) {
        return new Card(id, cardType, value, works);
    }


    //////////////////////Works///////////////////////////////////

    public static Work A(Integer points) {
        return createWork(STAGE_ANALYSIS, points);
    }

    public static Work D(Integer points) {
        return createWork(STAGE_DEVELOPMENT, points);
    }

    public static Work T(Integer points) {
        return createWork(STAGE_TESTING, points);
    }

    private static Work createWork(Stage stage, Integer points) {
        return new Work(stage,points);
    }


    //////////////////////Dice///////////////////////////////////

    public static Dice DICE(DiceSide... diceSides) {
        return new Dice(Arrays.asList(diceSides));
    }

    public static DiceSide SIDE(Work... works) {
        return new DiceSide(Arrays.asList(works));
    }
}
