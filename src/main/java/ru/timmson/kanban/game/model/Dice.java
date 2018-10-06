package ru.timmson.kanban.game.model;

import lombok.Builder;
import lombok.Getter;

import java.util.List;
import java.util.Random;

public class Dice {

    @Getter
    private List<DiceSide> points;

    private Random random;

    @Builder
    Dice(List<DiceSide> points) {
        this.points = points;
        this.random = new Random();
    }

    public Integer roll(Stage stage) {
        return points.get(random.nextInt((points.size() - 1) + 1)).getPoint(stage);
    }

    @Override
    public String toString() {
        return "Dice{" +
                "points=" + points +
                '}';
    }
}
