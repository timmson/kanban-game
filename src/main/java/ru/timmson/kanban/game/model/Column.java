package ru.timmson.kanban.game.model;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.LinkedList;
import java.util.List;

public class Column {

    @Getter
    private Stage stage;

    private LinkedList<Card> toDoQueue;

    private LinkedList<Card> wipQueue;

    @Getter
    private LinkedList<Card> doneQueue;

    @Getter
    @Setter
    private Integer wipLimit;

    @Getter
    private Boolean isOutputQueueLimited;

    @Builder
    Column(LinkedList<Card> toDoQueue, Stage stage, Integer wipLimit, Boolean isOutputQueueLimited) {
        this.stage = stage;
        this.toDoQueue = toDoQueue;
        this.wipQueue = new LinkedList<>();
        this.doneQueue = new LinkedList<>();
        this.wipLimit = wipLimit;
        this.isOutputQueueLimited = isOutputQueueLimited;
    }

    public Integer getWipSize() {
        return this.wipQueue.size();
    }

    public void handle(List<Dice> dices, Integer currentDay) {
        Integer points = dices.stream().mapToInt(dice -> dice.roll(stage)).sum();
        pull(currentDay);
        Card card = !wipQueue.isEmpty() ? wipQueue.getFirst() : null;
        while (card != null && points > 0) {
            points = card.decreaseRemaining(stage, points);
            if (card.getRemaining(stage) == 0) {
                if (stage.equals(Stage.STAGE_TESTING)) {
                    card.setEndDay(currentDay);
                }
                doneQueue.push(wipQueue.pop());
                pull(currentDay);
                card = !wipQueue.isEmpty() ? wipQueue.getFirst() : null;
            }
        }
        pull(currentDay);
    }

    private void pull(Integer currentDay) {
        while (wipLimit > (wipQueue.size() + (isOutputQueueLimited ? doneQueue.size() : 0)) && !toDoQueue.isEmpty()) {
            Card newCard = toDoQueue.pop();
            if (stage.equals(Stage.STAGE_ANALYSIS)) {
                newCard.setStartDay(currentDay);
            }
            wipQueue.push(newCard);
        }
    }
}
