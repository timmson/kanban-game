package ru.timmson.kanban.game.model;

import org.junit.Before;
import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static ru.timmson.kanban.game.model.Card.CARD_TYPE_S;
import static ru.timmson.kanban.game.model.CardFactory.*;

public class CardTest {

    private Card card;

    @Before
    public void setUp() throws Exception {
        card = Card.builder().id(1).cardType(CARD_TYPE_S).value(ct -> 21 - ct * 2)
                .estimations(A(10), D(11), T(0)).build();
    }

    @Test
    public void test() throws Exception {
        assertEquals("S1", card.getCardId());
        assertEquals(CARD_TYPE_S, card.getCardType());
        card.setStartDay(1);
        card.setEndDay(9);
        assertEquals(5, card.calculateValue());
    }

    @Test(expected = CardNotFinishedException.class)
    public void calculateValue() throws Exception {
        card.calculateValue();
    }
}