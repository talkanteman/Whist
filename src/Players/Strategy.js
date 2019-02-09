
export function choseCard (cards, table, bets, packages, index, cardsThatPlayed) {
    let tableCards = table.cards, rotationShape = table.rotationShape,
        dominant = table.dominant;
    let cardsByShape = splitCardsByShape(cards);
    if (underGame(bets)) {
        if (mustTakeAll(table.numOfRotation, bets[index], packages)) {
            if (firstToPlay(rotationShape)) {
                return getTheHighestCard(cards);
            }
            if (canTakeThisPack(cards, tableCards, rotationShape, dominant)) {
                if (lastToPlay(table)) {
                    return getTheLowestCardThatTake(cards, tableCards, rotationShape, dominant);
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
            if (canILossOnPurpose(cards, tableCards, cardsThatPlayed, rotationShape, dominant)) {
                return getTheHighestCardThatDoNotTakeThePack(cards, tableCards, rotationShape, dominant);
            }
            return getTheHighestCard(cards, rotationShape, dominant);
        }
        if (canILossOnPurpose(cards, tableCards, cardsThatPlayed, rotationShape, dominant)) {
            return getTheHighestCardThatDoNotTakeThePack(cards, tableCards, rotationShape, dominant);
        }
        return getTheHighestCard(cards, rotationShape, dominant);
    }
    // "over" game
    if (finishToTake(bets[index], packages)) {
        if (firstToPlay(rotationShape))
            return getIndexOfLowestCard(cards, table);
        if (canILossOnPurpose(cards, tableCards, cardsThatPlayed, rotationShape, dominant)) {
            return cards.indexOf(getTheHighestCardThatDoNotTakeThePack(cards, tableCards, rotationShape, dominant));
        }
        return getTheHighestCard(cards, rotationShape, dominant);
    }
    if (firstToPlay(rotationShape)) {
        return getIndexOfLowestCard(cards, table);
    }
    if (lastToPlay(table)) {
        if (canTakeThisPack(cards, tableCards, rotationShape, dominant)) {
            return getTheLowestCardThatTake(cards, tableCards, rotationShape, dominant);
        }
        return getIndexOfLowestCard(cards, table);
    }
    if (canTakeThisPack(cards, tableCards, rotationShape, dominant)) {
        if (doIHaveSureTake(cards, tableCards, cardsThatPlayed, rotationShape, dominant)) {
            if (haveThisShape(cards, rotationShape)) {
                return cards.indexOf(cardsByShape[rotationShape][cardsByShape[rotationShape].length-1]);
            }
            if (haveThisShape(cards, dominant)) {
                return cards.indexOf(cardsByShape[dominant][cardsByShape[dominant].length-1]);
            }
        }
        // ToDo //to check if the rest of the players wants to take
        return getTheLowestCardThatTake(cards, tableCards, rotationShape, dominant);
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

let getHighestCardOnTheTable = function (tableCards, rotationShape, dominant) {
    let highestCard = '', i;
    for (i=0; i<tableCards.length; i++) {
        if (compareByDominant(tableCards[i], highestCard, rotationShape, dominant) === 1) {
            highestCard = tableCards[i];
        }
    }
    return highestCard;
};

let getIndexOfLowestCard = function (cards, table) {
    let cardsByShape = splitCardsByShape(cards),
        rotationShape = table.rotationShape, dominant = table.dominant;
    if (haveThisShape(cards, rotationShape)) {
        return cards.indexOf(cardsByShape[rotationShape][0]);
    }
    let numOfClubs = 'C' === rotationShape? 0: 'C' === dominant? 0: cardsByShape['C'].length,
        numOfDiamonds = 'D' === rotationShape? 0: 'D' === dominant? 0: cardsByShape['D'].length,
        numOfHearts = 'H' === rotationShape? 0: 'H' === dominant? 0: cardsByShape['H'].length,
        numOfSpades = 'S' === rotationShape? 0: 'S' === dominant? 0: cardsByShape['S'].length;
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
        return cards.indexOf(cardsByShape[dominant][0]);
    }
    return cards.indexOf(cardsByShape['S'][0]);
};

let canTakeThisPack = function (cards, tablesCards, rotationShape, dominant) {
    let splitCards = splitCardsByShape(cards),
        haveThisShape = splitCards[rotationShape].length > 0,
        highestCard = getHighestCardOnTheTable(tablesCards, rotationShape, dominant);
    if (haveThisShape) {
        let rotationShapeCards = splitCards[rotationShape];
        return compareByDominant(rotationShapeCards[rotationShapeCards.length-1],highestCard,rotationShape,dominant)===1;
    }
    else {
        let dominantShapeCards = splitCards[dominant];
        return dominantShapeCards.length >0?
            compareByDominant(dominantShapeCards[dominantShapeCards.length-1],highestCard,rotationShape,dominant)===1:
            false;
    }
};

let getTheHighestCardThatDoNotTakeThePack = function (cards, tableCards, rotationShape, dominant) {
    let splitCards = splitCardsByShape(cards), tempCard, i=0,
        highestCardOnTheTable = getHighestCardOnTheTable(tableCards,rotationShape,dominant);
    if (splitCards[rotationShape].length>0) {
        while (i < splitCards[rotationShape].length
        && compareByDominant(splitCards[rotationShape][i],highestCardOnTheTable,rotationShape,dominant)===-1) {
            i++;
        }
        return i===0? '' : splitCards[rotationShape][i-1];
    }
    if (splitCards[dominant].length>0 && haveThisShape(tableCards, dominant)) {
        i=0;
        while (i < splitCards[dominant].length
        && compareByDominant(splitCards[dominant][i],highestCardOnTheTable,rotationShape,dominant)===-1) {
            i++;
        }
        if (i>0) {
            return splitCards[dominant][i-1];
        }
    }
    let clubCard = 'C'===rotationShape?'': 'C'===dominant?'': splitCards.C.length===0?'': splitCards.C[splitCards.C.length-1],
        diamondCard = 'D'===rotationShape?'': 'D'===dominant?'': splitCards.D.length===0?'': splitCards.D[splitCards.D.length-1],
        heartCard = 'H'===rotationShape?'': 'H'===dominant?'': splitCards.H.length===0?'': splitCards.H[splitCards.H.length-1],
        spadeCard = 'S'===rotationShape?'': 'S'===dominant?'': splitCards.S.length===0?'': splitCards.S[splitCards.S.length-1];
    tempCard = getHighestCardOnTheTable([clubCard,diamondCard,heartCard,spadeCard],rotationShape,dominant);
    return tempCard;
};

let getTheLowestCardThatTake = function (cards, tableCards, rotationShape, dominant) {
    let i, highestCard = getHighestCardOnTheTable(tableCards, rotationShape, dominant),
        cardsByShape = splitCardsByShape(cards);
    if (haveThisShape(cards, rotationShape)) {
        for (i=0; i<cardsByShape[rotationShape].length; i++) {
            if (compareByDominant(cardsByShape[rotationShape][i],highestCard,rotationShape,dominant)===1) {
                return cards.indexOf(cardsByShape[rotationShape][i]);
            }
        }
    }
    for (i=0; i<cardsByShape[dominant].length; i++) {
        if (compareByDominant(cardsByShape[dominant][i],highestCard,rotationShape,dominant)===1) {
            return cards.indexOf(cardsByShape[dominant][i]);
        }
    }
};

let doIHaveSureTake = function (cards, tableCards, cardsThatPlayed, rotationShape, dominant) {
    if (!canTakeThisPack(cards,tableCards,rotationShape,dominant)) {
        return false;
    }
    let numOfPlayersThatPlayed = 4, numOfHigherCards = 0, i,
        splitCards = splitCardsByShape(cards),
        haveThisShape = rotationShape===''? true: splitCards[rotationShape].length > 0,
        haveDominant = splitCards[dominant].length > 0;
    for (i=0; i<tableCards.length; i++) {
        if (tableCards[i] === '') {
            numOfPlayersThatPlayed--;
        }
    }
    if (numOfPlayersThatPlayed === 3) {
        return true;
    }
    if (haveThisShape) {
        if (cardsThatPlayed[dominant].length + splitCards[dominant].length !== 13) {
            //ToDo //if the rest of the player have the shape we good
            return false;
        }
        let myHighestCard = splitCards[rotationShape][splitCards[rotationShape].length-1];
        for (i=0; i<cardsThatPlayed[rotationShape].length; i++) {
            if (compareByDominant(myHighestCard,cardsThatPlayed[rotationShape][i],rotationShape,dominant)===1) {
                numOfHigherCards++;
            }
        }
        //ToDo
        return 14-getTheCardsValue(myHighestCard) === numOfHigherCards;
    }
    if (haveDominant) {
        let myHighestDominant = splitCards[dominant][splitCards[dominant].length-1];
        for (i=0; i<cardsThatPlayed[dominant].length; i++) {
            if (compareByDominant(myHighestDominant,cardsThatPlayed[dominant][i],rotationShape,dominant)===1) {
                numOfHigherCards++;
            }
        }
        //ToDo
        return 14-getTheCardsValue(myHighestDominant) === numOfHigherCards;
    }
    return false;
};

let canILossOnPurpose =  function (cards, tableCards, cardsThatPlayed, rotationShape, dominant) {
    let splitCards = splitCardsByShape(cards), i, j,
        highestCardOnTable = getHighestCardOnTheTable(tableCards, rotationShape, dominant);
    if (splitCards[rotationShape].length>0) {
        for (i=0; i<splitCards[rotationShape].length; i++) {
            if (compareByDominant(splitCards[rotationShape][i],highestCardOnTable,rotationShape,dominant)===-1)
                return true;
        }
        return false;
    }
    let clean = cleanCards(cards);
    if (clean.length === splitCards[dominant].length) {
        for (i=0; i<splitCards[dominant].length; i++) {
            for (j=0; j<tableCards.length; j++) {
                if (compareByDominant(splitCards[dominant][i],tableCards[j],rotationShape,dominant)===-1)
                    return true;
            }
        }
        return false;
    }
    return true;
};

let getTheHighestCard = function(cards, rotationShape, dominant) {
    let i, highestCard = '', index;

    if (rotationShape!=='' && haveThisShape(cards, rotationShape)) {
        let cardsByShape = splitCardsByShape(cards);
        return cards.indexOf(cardsByShape[rotationShape][cardsByShape[rotationShape].length-1]);
    }
    for (i=0; i<cards.length; i++) {
        if (compareByDominant(cards[i],highestCard, rotationShape, dominant)>0){
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

let compareByDominant = function(card1, card2, rotationShape, dominant) {
    if (card1 === '') {
        return -1;
    }
    if (card2 === '') {
        return 1;
    }
    let card1Shape = card1[card1.length-1], card2Shape = card2[card2.length-1];
    switch (card1Shape) {
        case dominant:
            return card2Shape !== dominant? 1:compareValue(card1[0],card2[0]);
        case rotationShape:
            return card2Shape === dominant? -1:
                card2Shape === rotationShape? compareValue(card1[0],card2[0]):1;
        default:
            return card2Shape === dominant? -1:
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


