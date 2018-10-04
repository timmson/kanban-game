package ru.timmson.kanban.game.model;

import org.junit.Before;
import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static ru.timmson.kanban.game.model.CardFactory.*;

public class CardTest {

    private Card card;

    @Before
    public void setUp() throws Exception {
        card = createCardS(ct -> 21 - ct * 2, A(10), D(11), T(0));
    }

    @Test
    public void test() throws Exception {
        card.setStartDay(1);
        card.setEndDay(9);
        assertEquals(5, card.calculateValue());
    }

    @Test(expected = CardNotFinishedException.class)
    public void calculateValue() throws Exception {
        card.calculateValue();
    }
}