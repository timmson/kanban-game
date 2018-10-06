package ru.timmson.kanban.game.model;

import lombok.Builder;
import lombok.ToString;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@ToString
public class DiceSide {

    private Map<Stage, Integer> points;

    @Builder
    DiceSide(List<Work> works) {
        this.points = works.stream().collect(Collectors.toMap(Work::getStage, Work::getPoints));
    }

    public Integer getPoint(Stage stage) {
        return points.get(stage);
    }

}