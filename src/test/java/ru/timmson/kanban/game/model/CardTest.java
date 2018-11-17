package ru.timmson.kanban.game.model;

import org.junit.Before;
import org.junit.Test;

import java.util.Arrays;

import static org.junit.Assert.assertEquals;
import static ru.timmson.kanban.game.model.Card.CARD_TYPE_S;
import static ru.timmson.kanban.game.model.CardFactory.*;

public class CardTest {

    private Card card;

    @Before
    public void setUp() throws Exception {
        card = new Card(1, CARD_TYPE_S, ct -> 21 - ct * 2, Arrays.asList(a(10), d(11), t(0)));
    }

    @Test
    public void test() throws Exception {
        assertEquals("S001", card.getCardId());
        assertEquals(CARD_TYPE_S, card.getCardType());
        card.setStartDay(1);
        card.setEndDay(9);
        assertEquals(5, card.calculateValue());
    }

    @Test
    public void testCalculateValue() throws Exception {
        card.calculateValue();
    }

}