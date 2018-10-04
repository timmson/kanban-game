package ru.timmson.kanban.game.model;

import org.junit.Before;
import org.junit.Test;

import static ru.timmson.kanban.game.model.Builder.*;

public class CardTest {

    @Before
    public void setUp() throws Exception {

    }

    @Test
    public void test() {
      createCardE(A(10), D(11), T(0));
    }
}