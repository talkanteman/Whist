
export function choseCard (cards, table, bets, packages, index, cardsThatPlayed) {
    let tableCards = table.cards, rotationShape = table.rotationShape,
        tramp = table.tramp;
    let cardsByShape = splitCardsByShape(cards);
    if (underGame(bets)) {
        if (mustTakeAll(table.numOfRotation, bets[index], packages)) {
            if (firstToPlay(rotationShape)) {
                return getTheHighestCard(cards);
            }
            if (canTakeThisPack(cards, tableCards, rotationShape, tramp)) {
                if (lastToPlay(table)) {
                    return getTheLowestCardThatTake(cards, tableCards, rotationShape, tramp);
                }
                return getTheHighestCard(cards);
            }
            return getIndexOfLowestCard(cards, table);
        }
        if (finishToTake(bets[index], packages)) {
            return getIndexOfLowestCard(cards, table);
        }
        if (firstToPlay(rotationShape)) {
            return getIndexOfLowestCard(cards, table);
        }
        if (lastToPlay(table)) {
            if (canILossOnPurpose(cards, tableCards, cardsThatPlayed, rotationShape, tramp)) {
                return cards.indexOf(getTheHighestCardThatDoNotTakeThePack(cards, tableCards, rotationShape, tramp));
            }
            return getTheHighestCard(cards, rotationShape, tramp);
        }
        if (canILossOnPurpose(cards, tableCards, cardsThatPlayed, rotationShape, tramp)) {
            return cards.indexOf(getTheHighestCardThatDoNotTakeThePack(cards, tableCards, rotationShape, tramp));
        }
        return getTheHighestCard(cards, rotationShape, tramp);
    }
    // "over" game
    if (finishToTake(bets[index], packages)) {
        if (firstToPlay(rotationShape))
            return getIndexOfLowestCard(cards, table);
        if (canILossOnPurpose(cards, tableCards, cardsThatPlayed, rotationShape, tramp)) {
            return cards.indexOf(getTheHighestCardThatDoNotTakeThePack(cards, tableCards, rotationShape, tramp));
        }
        return getTheHighestCard(cards, rotationShape, tramp);
    }
    if (firstToPlay(rotationShape)) {
        return getIndexOfLowestCard(cards, table);
    }
    if (lastToPlay(table)) {
        if (canTakeThisPack(cards, tableCards, rotationShape, tramp)) {
            return getTheLowestCardThatTake(cards, tableCards, rotationShape, tramp);
        }
        return getIndexOfLowestCard(cards, table);
    }
    if (canTakeThisPack(cards, tableCards, rotationShape, tramp)) {
        if (doIHaveSureTake(cards, tableCards, cardsThatPlayed, rotationShape, tramp)) {
            if (haveThisShape(cards, rotationShape)) {
                return cards.indexOf(cardsByShape[rotationShape][cardsByShape[rotationShape].length-1]);
            }
            if (haveThisShape(cards, tramp)) {
                return cards.indexOf(cardsByShape[tramp][cardsByShape[tramp].length-1]);
            }
        }
        // ToDo //to check if the rest of the players wants to take
        return getTheLowestCardThatTake(cards, tableCards, rotationShape, tramp);
    }
    if (haveThisShape(cards, rotationShape)) {
        return cards.indexOf(cardsByShape[rotationShape][0]);
    }
    return getIndexOfLowestCard(cards, table);
}

let cleanCards = function (cards) {
    let i, temp =[];
    for (i=0; i<cards.length; i++) {
        if (cards[i] !== '')
            temp.push(cards[i])
    }
    return temp;
};

let underGame = function (bets) {
    let i, sumOfBets = 0;
    for (i=0; i<bets.length; i++) {
        sumOfBets += bets[i].value;
    }
    return sumOfBets<13;
};

export function haveThisShape (cards, shape) {
    if (shape === '')
        return false;
    let i=0,have = false;
    while (i<cards.length && !have) {
        if (cards[i][cards[i].length-1] === shape)
            have = true;
        i++;
    }
    return have;
}

let mustTakeAll = function (numOfRotation, bet, packages) {
    return bet.value - packages === 14 - numOfRotation;
};

let finishToTake = function (bet, packages) {
    return bet.value <= packages;
};

let firstToPlay = function (rotationShape) {
    return ''===rotationShape;
};

let lastToPlay = function (table) {
    let i, numOfCards=0;
    for (i=0; i<table.cards.length; i++) {
        if (table.cards[i] !== '')
            numOfCards++;
    }
    return 3===numOfCards;
};

let getHighestCardOnTheTable = function (tableCards, rotationShape, tramp) {
    let highestCard = '', i;
    for (i=0; i<tableCards.length; i++) {
        if (compareByTramp(tableCards[i], highestCard, rotationShape, tramp) === 1) {
            highestCard = tableCards[i];
        }
    }
    return highestCard;
};

let getIndexOfLowestCard = function (cards, table) {
    let cardsByShape = splitCardsByShape(cards),
        rotationShape = table.rotationShape, tramp = table.tramp;
    if (haveThisShape(cards, rotationShape)) {
        return cards.indexOf(cardsByShape[rotationShape][0]);
    }
    let numOfClubs = 'C' === rotationShape? 0: 'C' === tramp? 0: cardsByShape['C'].length,
        numOfDiamonds = 'D' === rotationShape? 0: 'D' === tramp? 0: cardsByShape['D'].length,
        numOfHearts = 'H' === rotationShape? 0: 'H' === tramp? 0: cardsByShape['H'].length,
        numOfSpades = 'S' === rotationShape? 0: 'S' === tramp? 0: cardsByShape['S'].length;
    if (numOfClubs > numOfDiamonds && numOfClubs > numOfHearts && numOfClubs > numOfSpades) {
        return cards.indexOf(cardsByShape['C'][0]);
    }
    if (numOfDiamonds > numOfHearts && numOfDiamonds > numOfSpades) {
        return cards.indexOf(cardsByShape['D'][0]);
    }
    if (numOfHearts > numOfSpades) {
        return cards.indexOf(cardsByShape['H'][0]);
    }
    if (numOfSpades===0) {
        return cards.indexOf(cardsByShape[tramp][0]);
    }
    return cards.indexOf(cardsByShape['S'][0]);
};

let canTakeThisPack = function (cards, tablesCards, rotationShape, tramp) {
    let splitCards = splitCardsByShape(cards),
        haveThisShape = splitCards[rotationShape].length > 0,
        highestCard = getHighestCardOnTheTable(tablesCards, rotationShape, tramp);
    if (haveThisShape) {
        let rotationShapeCards = splitCards[rotationShape];
        return compareByTramp(rotationShapeCards[rotationShapeCards.length-1],highestCard,rotationShape,tramp)===1;
    }
    else {
        let trampShapeCards = splitCards[tramp];
        return trampShapeCards.length >0?
            compareByTramp(trampShapeCards[trampShapeCards.length-1],highestCard,rotationShape,tramp)===1:
            false;
    }
};

let getTheHighestCardThatDoNotTakeThePack = function (cards, tableCards, rotationShape, tramp) {
    let splitCards = splitCardsByShape(cards), tempCard, i=0,
        highestCardOnTheTable = getHighestCardOnTheTable(tableCards,rotationShape,tramp);
    if (splitCards[rotationShape].length>0) {
        while (i < splitCards[rotationShape].length
        && compareByTramp(splitCards[rotationShape][i],highestCardOnTheTable,rotationShape,tramp)===-1) {
            i++;
        }
        return i===0? '' : splitCards[rotationShape][i-1];
    }
    if (splitCards[tramp].length>0 && haveThisShape(tableCards, tramp)) {
        i=0;
        while (i < splitCards[tramp].length
        && compareByTramp(splitCards[tramp][i],highestCardOnTheTable,rotationShape,tramp)===-1) {
            i++;
        }
        if (i>0) {
            return splitCards[tramp][i-1];
        }
    }
    let clubCard = 'C'===rotationShape?'': 'C'===tramp?'': splitCards.C.length===0?'': splitCards.C[splitCards.C.length-1],
        diamondCard = 'D'===rotationShape?'': 'D'===tramp?'': splitCards.D.length===0?'': splitCards.D[splitCards.D.length-1],
        heartCard = 'H'===rotationShape?'': 'H'===tramp?'': splitCards.H.length===0?'': splitCards.H[splitCards.H.length-1],
        spadeCard = 'S'===rotationShape?'': 'S'===tramp?'': splitCards.S.length===0?'': splitCards.S[splitCards.S.length-1];
    tempCard = getHighestCardOnTheTable([clubCard,diamondCard,heartCard,spadeCard],rotationShape,tramp);
    return tempCard;
};

let getTheLowestCardThatTake = function (cards, tableCards, rotationShape, tramp) {
    let i, highestCard = getHighestCardOnTheTable(tableCards, rotationShape, tramp),
        cardsByShape = splitCardsByShape(cards);
    if (haveThisShape(cards, rotationShape)) {
        for (i=0; i<cardsByShape[rotationShape].length; i++) {
            if (compareByTramp(cardsByShape[rotationShape][i],highestCard,rotationShape,tramp)===1) {
                return cards.indexOf(cardsByShape[rotationShape][i]);
            }
        }
    }
    for (i=0; i<cardsByShape[tramp].length; i++) {
        if (compareByTramp(cardsByShape[tramp][i],highestCard,rotationShape,tramp)===1) {
            return cards.indexOf(cardsByShape[tramp][i]);
        }
    }
};

let doIHaveSureTake = function (cards, tableCards, cardsThatPlayed, rotationShape, tramp) {
    if (!canTakeThisPack(cards,tableCards,rotationShape,tramp)) {
        return false;
    }
    let numOfPlayersThatPlayed = 4, numOfHigherCards = 0, i,
        splitCards = splitCardsByShape(cards),
        haveThisShape = rotationShape===''? true: splitCards[rotationShape].length > 0,
        haveTramp = splitCards[tramp].length > 0;
    for (i=0; i<tableCards.length; i++) {
        if (tableCards[i] === '') {
            numOfPlayersThatPlayed--;
        }
    }
    if (numOfPlayersThatPlayed === 3) {
        return true;
    }
    if (haveThisShape) {
        if (cardsThatPlayed[tramp].length + splitCards[tramp].length !== 13) {
            //ToDo //if the rest of the player have the shape we good
            return false;
        }
        let myHighestCard = splitCards[rotationShape][splitCards[rotationShape].length-1];
        for (i=0; i<cardsThatPlayed[rotationShape].length; i++) {
            if (compareByTramp(myHighestCard,cardsThatPlayed[rotationShape][i],rotationShape,tramp)===1) {
                numOfHigherCards++;
            }
        }
        //ToDo
        return 14-getTheCardsValue(myHighestCard) === numOfHigherCards;
    }
    if (haveTramp) {
        let myHighestTramp = splitCards[tramp][splitCards[tramp].length-1];
        for (i=0; i<cardsThatPlayed[tramp].length; i++) {
            if (compareByTramp(myHighestTramp,cardsThatPlayed[tramp][i],rotationShape,tramp)===1) {
                numOfHigherCards++;
            }
        }
        //ToDo
        return 14-getTheCardsValue(myHighestTramp) === numOfHigherCards;
    }
    return false;
};

let canILossOnPurpose =  function (cards, tableCards, cardsThatPlayed, rotationShape, tramp) {
    let splitCards = splitCardsByShape(cards), i, j,
        highestCardOnTable = getHighestCardOnTheTable(tableCards, rotationShape, tramp);
    if (splitCards[rotationShape].length>0) {
        for (i=0; i<splitCards[rotationShape].length; i++) {
            if (compareByTramp(splitCards[rotationShape][i],highestCardOnTable,rotationShape,tramp)===-1)
                return true;
        }
        return false;
    }
    let clean = cleanCards(cards);
    if (clean.length === splitCards[tramp].length) {
        for (i=0; i<splitCards[tramp].length; i++) {
            for (j=0; j<tableCards.length; j++) {
                if (compareByTramp(splitCards[tramp][i],tableCards[j],rotationShape,tramp)===-1)
                    return true;
            }
        }
        return false;
    }
    return true;
};

let getTheHighestCard = function(cards, rotationShape, tramp) {
    let i, highestCard = '', index;

    if (rotationShape!=='' && haveThisShape(cards, rotationShape)) {
        let cardsByShape = splitCardsByShape(cards);
        return cards.indexOf(cardsByShape[rotationShape][cardsByShape[rotationShape].length-1]);
    }
    for (i=0; i<cards.length; i++) {
        if (compareByTramp(cards[i],highestCard, rotationShape, tramp)>0){
            highestCard = cards[i];
            index = i;
        }
    }
    return index;
};

let getTheCardsValue = function(card) {
    switch (card[0]) {
        case 'A':
            return 14;
        case 'K':
            return 13;
        case 'Q':
            return 12;
        case 'J':
            return 11;
        case '1':
            return 10;
        default:
            return parseInt(card[0],10);
    }
};

let compareValue = function(card1, card2) {
    let card1Value = getTheCardsValue(card1),
        card2Value = getTheCardsValue(card2);
    return card1Value>card2Value? 1:
        card1Value<card2Value? -1:0;
};

let compareByTramp = function(card1, card2, rotationShape, tramp) {
    if (card1 === '') {
        return -1;
    }
    if (card2 === '') {
        return 1;
    }
    let card1Shape = card1[card1.length-1], card2Shape = card2[card2.length-1];
    switch (card1Shape) {
        case tramp:
            return card2Shape !== tramp? 1:compareValue(card1[0],card2[0]);
        case rotationShape:
            return card2Shape === tramp? -1:
                card2Shape === rotationShape? compareValue(card1[0],card2[0]):1;
        default:
            return card2Shape === tramp? -1:
                card2Shape === rotationShape? -1:
                    compareValue(card1[0],card2[0]);
    }
};

export function splitCardsByShape(cards) {
    let tempCards = {
        'C': [],
        'D': [],
        'H': [],
        'S': []
    };
    let i;
    for (i=0; i<cards.length; i++) {
        if (cards[i] !== '')
            tempCards[cards[i][cards[i].length-1]].push(cards[i]);
    }
    return tempCards;
}


