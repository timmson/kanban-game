package ru.timmson.kanban.game.generator;

import org.apache.commons.lang3.Range;
import ru.timmson.kanban.game.model.*;

import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;
import java.util.stream.IntStream;
import java.util.stream.Stream;

public class RandomGenerator {

    private static Random random = new Random();

    static public Dice generateStandardDice(Integer count, Range<Integer> primaryRange, Stage primaryStage, Range<Integer> secondaryRange, Stage... secondaryStages) {
        return Dice.builder().points(
                IntStream.rangeClosed(1, count).boxed().map(i ->
                            DiceSide.builder().works(
                                    Stream.concat(
                                            Stream.of(createWork(primaryStage, primaryRange)),
                                            Stream.of(secondaryStages).map(stage -> createWork(stage, secondaryRange)))
                                            .collect(Collectors.toList()))
                                    .build()
                ).collect(Collectors.toList())

        ).build();
    }

    static public List<Card> generateCards(String cardType, Integer count, Range<Integer> range, Stage... stages) {
        return IntStream.rangeClosed(1, count).boxed().map(i ->
                Card.builder()
                        .cardType(cardType)
                        .id(i)
                        .value(ct -> 1)
                        .works(
                                Stream.of(stages).map(stage -> createWork(stage, range))
                                        .collect(Collectors.toList())
                        ).build()

        ).collect(Collectors.toList());
    }

    static private Work createWork(Stage stage, Range<Integer> range) {
        return Work.builder()
                .stage(stage)
                .points(random.nextInt(range.getMaximum() + 1 - range.getMinimum()) + range.getMinimum()).build();
    }

}
