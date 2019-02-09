export function divideCard() {
    let deckCards = [],
        cards = [[],[],[],[]];
    for (let i = 1; i < 14; i++) {
        switch (i) {
            case 1:
                deckCards.push("AC");
                deckCards.push("AD");
                deckCards.push("AH");
                deckCards.push("AS");
                break;
            case 11:
                deckCards.push("JC");
                deckCards.push("JD");
                deckCards.push("JH");
                deckCards.push("JS");
                break;
            case 12:
                deckCards.push("QC");
                deckCards.push("QD");
                deckCards.push("QH");
                deckCards.push("QS");
                break;
            case 13:
                deckCards.push("KC");
                deckCards.push("KD");
                deckCards.push("KH");
                deckCards.push("KS");
                break;
            default:
                deckCards.push(i.toString() + "C");
                deckCards.push(i.toString() + "D");
                deckCards.push(i.toString() + "H");
                deckCards.push(i.toString() + "S");
        }
    }
    let numOfCards = 52;
    while (numOfCards > 0) {
        for (let i = 0; i < 4; i++) {
            let index = Math.floor(Math.random() * numOfCards);
            let tempCard = deckCards[index];
            cards[i].push(tempCard);
            deckCards.splice(index, 1);
            numOfCards--
        }
    }
    for(let i=0; i<4; i++) {
        cards[i] = sort(cards[i]);
    }
    return cards;
}

export function sort(cards) {
    let min, tempCards =[], len = cards.length;
    for (let i=0; i<len; i++) {
        min = 0;
        for (let j = 0; j < cards.length; j++) {
            if(compare(cards[min], cards[j]) === 1) {
                min = j;
            }
        }
        tempCards.push(cards[min]);
        cards.splice(min,1);
    }
    return tempCards;
}
//compare between two cards, return 1 if x > y and -1 if y > x
export function compare(x, y) {
    let xShape = x[x.length -1];
    let yShape = y[y.length -1];
    let xValue = x[0];
    let yValue = y[0];
    switch (xShape) {
        case "C":
            if (yShape !== "C")
                return -1;
            return compareValue(xValue, yValue);
        case "D":
            if (yShape === "C")
                return 1;
            if (yShape === "D")
                return compareValue(xValue, yValue);
            return -1;
        case "S":
            if (yShape === "H")
                return -1;
            if (yShape === "S")
                return compareValue(xValue, yValue);
            return 1;
        default:
            if (yShape === "H")
                return compareValue(xValue, yValue);
            return 1;
    }
}

function compareValue(xValue, yValue) {
    switch (xValue) {
        case "1":
            if (yValue === "J" || yValue === "Q" || yValue === "K" || yValue === "A")
                return -1;
            return 1;
        case "J":
            if (yValue === "Q" || yValue === "K" || yValue === "A")
                return -1;
            return 1;
        case "Q":
            if (yValue === "K" || yValue === "A")
                return -1;
            return 1;
        case "K":
            if (yValue === "A")
                return -1;
            return 1;
        case "A":
            return 1;
        default:
            if (yValue === "1" || yValue === "J" || yValue === "Q" || yValue === "K" || yValue === "A")
                return -1;
            if (xValue < yValue)
                return -1;
            return 1;
    }
}
export function initDominant(players) {
    let bets = [{value: '', shape: ''},{value: '', shape: ''},{value: '', shape: ''},{value: '', shape: ''}],
        dominant , i;
    for (i=0; i<4; i++) {
        bets[i] = players[i].bet;
    }
    dominant = {value: 0, shape: ''};
    for (i=0; i<4; i++) {
        if (!isNaN(bets[i].value)) {
            if (bets[i].value > dominant.value)
                dominant = bets[i];
            else if (bets[i].value === dominant.value && bets[i].shape > dominant.shape)
                dominant = bets[i];
        }
    }
    return dominant.shape;
}

/* init the player */
export function initGame(cards) {
    let tempPlayers = [
        {cards: cards[0], bet: {value: '', shape: ''}, packs: 0},
        {cards: cards[1], bet: {value: '', shape: ''}, packs: 0},
        {cards: cards[2], bet: {value: '', shape: ''}, packs: 0},
        {cards: cards[3], bet: {value: '', shape: ''}, packs: 0}
    ];
    return tempPlayers;
}
/* get the winner card */
export function getWinner(cardsValue, dominant, roundShape) {
    let max = cardsValue[0];
    let winner = 0, i;
    for (i=1; i<4; i++){
        if(compareByDominant(cardsValue[i], max, dominant, roundShape) === 1) {
            max = cardsValue[i];
            winner = i;
        }
    }
    return winner;
}
export function compareByDominant(card1, card2, dominant, roundShape){
    let card1Value = card1.substring(0, 1),
        card1Shape = card1.substring(card1.length - 1, card1.length),
        card2Value = card2.substring(0, 1),
        card2Shape = card2.substring(card2.length - 1, card2.length);
    if(card1Shape === dominant) {
        if(card2Shape === dominant) {
            return compareValue(card1Value,card2Value);
        }
        return 1;
    }
    if(card2Shape === dominant) {
        return - 1;
    }
    if(card1Shape === roundShape) {
        if(card2Shape === roundShape) {
            return compareValue(card1Value,card2Value);
        }
        return 1;
    }
    if(card2Shape === roundShape) {
        return -1;
    }
    return compareValue(card1Value,card2Value);
}

export function gameOver(points) {
    let i =0;
    while (i < 4 && points[i] < 100) {
        i++;
    }
    return i;
}