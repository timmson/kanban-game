package ru.timmson.kanban.game.model;

import org.junit.Before;
import org.junit.Test;

import static org.junit.Assert.assertNotNull;
import static ru.timmson.kanban.game.model.CardFactory.*;

public class CardFactoryTest {

    @Before
    public void setUp() throws Exception {
    }

    @Test
    public void testCard() {
    }

    @Test
    public void testEstimation() {
    }

    @Test
    public void testDice() {
        Dice dice = DICE(
                SIDE(A(1), D(1), T(1)),
                SIDE(A(1), D(1), T(1)),
                SIDE(A(1), D(1), T(1)),
                SIDE(A(1), D(1), T(1)),
                SIDE(A(1), D(1), T(1))
        );
        assertNotNull(dice.roll(Stage.STAGE_DEVELOPMENT));
    }
}