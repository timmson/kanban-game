package ru.timmson.kanban.game;

import org.apache.commons.lang3.Range;
import ru.timmson.kanban.game.model.*;

import java.util.Arrays;
import java.util.Comparator;
import java.util.LinkedList;

import static ru.timmson.kanban.game.generator.RandomGenerator.generateCards;
import static ru.timmson.kanban.game.generator.RandomGenerator.generateStandardDice;
import static ru.timmson.kanban.game.model.Card.CARD_TYPE_S;

public class Game {

    public static void main(String[] args) throws Exception {
        LinkedList<Card> backlogQueue = new LinkedList<>(generateCards(CARD_TYPE_S, 100, Range.between(1, 10), Stage.STAGE_ANALYSIS, Stage.STAGE_DEVELOPMENT, Stage.STAGE_TESTING));

        Column analyzing = Column.builder().stage(Stage.STAGE_ANALYSIS).wipLimit(10).toDoQueue(backlogQueue).isOutputQueueLimited(true).build();
        Dice analyst = generateStandardDice(6, Range.between(4, 6), Stage.STAGE_ANALYSIS, Range.between(1, 3), Stage.STAGE_DEVELOPMENT, Stage.STAGE_TESTING);

        Column developing = Column.builder().stage(Stage.STAGE_DEVELOPMENT).wipLimit(10).toDoQueue(analyzing.getDoneQueue()).isOutputQueueLimited(true).build();
        Dice developer = generateStandardDice(6, Range.between(4, 6), Stage.STAGE_DEVELOPMENT, Range.between(1, 3), Stage.STAGE_ANALYSIS, Stage.STAGE_TESTING);

        Column testing = Column.builder().stage(Stage.STAGE_TESTING).wipLimit(10).toDoQueue(developing.getDoneQueue()).isOutputQueueLimited(false).build();
        Dice tester = generateStandardDice(6, Range.between(4, 6), Stage.STAGE_TESTING, Range.between(1, 3), Stage.STAGE_ANALYSIS, Stage.STAGE_DEVELOPMENT);


        int day = 1;
        int initialSize = backlogQueue.size();
        while (testing.getDoneQueue().size() < initialSize) {
            testing.handle(Arrays.asList(tester), day);
            developing.handle(Arrays.asList(developer), day);
            analyzing.handle(Arrays.asList(analyst), day);
            System.out.println(day + "\t" + backlogQueue.size() + "\t|\t" +
                    analyzing.getWipSize() + "\t" + analyzing.getDoneQueue().size() + "\t|\t" +
                    developing.getWipSize() + "\t" + developing.getDoneQueue().size() + "\t|\t" +
                    testing.getWipSize() + "\t" + testing.getDoneQueue().size());
            day++;
        }

        testing.getDoneQueue().stream().sorted(Comparator.comparing(Card::getCardId)).forEach(i -> {
            try {
                System.out.println(i.getCardId()+ "\t" + i.getStartDay() + "\t" + i.getEndDay() + "\t" + i.getCycleTime() + "\t");
            } catch (CardNotFinishedException e) {
                e.printStackTrace();
            }
        });
    }

}
