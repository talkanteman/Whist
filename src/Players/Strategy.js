
export function choseCard (cards, table, bets, packages, index, cardsThatPlayed) {
    let tableCards = table.cards, rotationShape = table.rotationShape,
        trump = table.trump;
    let cardsByShape = splitCardsByShape(cards);
    if (underGame(bets, packages, table.numOfRotation)) {
        if (mustTakeAll(table.numOfRotation, bets[index], packages[index])) {
            if (firstToPlay(rotationShape)) {
                return getTheHighestCard(cards);
            }
            if (canTakeThisPack(cards, tableCards, rotationShape, trump)) {
                if (lastToPlay(table)) {
                    return getTheLowestCardThatTake(cards, tableCards, rotationShape, trump);
                }
                return getTheHighestCard(cards, rotationShape, trump);
            }
            return getIndexOfLowestCard(cards, table);
        }
        if (finishToTake(bets[index], packages[index])) {
            return getIndexOfLowestCard(cards, table);
        }
        if (firstToPlay(rotationShape)) {
            return getIndexOfLowestCard(cards, table);
        }
        if (lastToPlay(table)) {
            if (canILossOnPurpose(cards, tableCards, cardsThatPlayed, rotationShape, trump)) {
                return cards.indexOf(getTheHighestCardThatDoNotTakeThePack(cards, tableCards, rotationShape, trump));
            }
            return getTheHighestCard(cards, rotationShape, trump);
        }
        if (canILossOnPurpose(cards, tableCards, cardsThatPlayed, rotationShape, trump)) {
            return cards.indexOf(getTheHighestCardThatDoNotTakeThePack(cards, tableCards, rotationShape, trump));
        }
        return getTheHighestCard(cards, rotationShape, trump);
    }
    // "over" game
    if (finishToTake(bets[index], packages[index])) {
        if (firstToPlay(rotationShape))
            return getIndexOfLowestCard(cards, table);
        if (canILossOnPurpose(cards, tableCards, cardsThatPlayed, rotationShape, trump)) {
            return cards.indexOf(getTheHighestCardThatDoNotTakeThePack(cards, tableCards, rotationShape, trump));
        }
        return getTheHighestCard(cards, rotationShape, trump);
    }
    if (firstToPlay(rotationShape)) {
        return getIndexOfLowestCard(cards, table);
    }
    if (lastToPlay(table)) {
        if (canTakeThisPack(cards, tableCards, rotationShape, trump)) {
            return getTheLowestCardThatTake(cards, tableCards, rotationShape, trump);
        }
        return getIndexOfLowestCard(cards, table);
    }
    if (canTakeThisPack(cards, tableCards, rotationShape, trump)) {
        if (doIHaveSureTake(cards, tableCards, cardsThatPlayed, rotationShape, trump)) {
            if (haveThisShape(cards, rotationShape)) {
                return cards.indexOf(cardsByShape[rotationShape][cardsByShape[rotationShape].length-1]);
            }
            if (haveThisShape(cards, trump)) {
                return cards.indexOf(cardsByShape[trump][cardsByShape[trump].length-1]);
            }
        }
        // ToDo //to check if the rest of the players wants to take
        return getTheLowestCardThatTake(cards, tableCards, rotationShape, trump);
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

let underGame = function (bets, packages, numOfRotation) {
    let i, sumOfNeedToTake = 0;
    for (i=0; i<bets.length; i++) {
        sumOfNeedToTake += bets[i].value - packages[i];
    }

    return sumOfNeedToTake<13-numOfRotation;
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

let getHighestCardOnTheTable = function (tableCards, rotationShape, trump) {
    let highestCard = '', i;
    for (i=0; i<tableCards.length; i++) {
        if (compareByTrump(tableCards[i], highestCard, rotationShape, trump) === 1) {
            highestCard = tableCards[i];
        }
    }
    return highestCard;
};

let getIndexOfLowestCard = function (cards, table) {
    let cardsByShape = splitCardsByShape(cards),
        rotationShape = table.rotationShape, trump = table.trump;
    if (haveThisShape(cards, rotationShape)) {
        return cards.indexOf(cardsByShape[rotationShape][0]);
    }
    let numOfClubs = 'C' === rotationShape? 0: 'C' === trump? 0: cardsByShape['C'].length,
        numOfDiamonds = 'D' === rotationShape? 0: 'D' === trump? 0: cardsByShape['D'].length,
        numOfHearts = 'H' === rotationShape? 0: 'H' === trump? 0: cardsByShape['H'].length,
        numOfSpades = 'S' === rotationShape? 0: 'S' === trump? 0: cardsByShape['S'].length;
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
        return cards.indexOf(cardsByShape[trump][0]);
    }
    return cards.indexOf(cardsByShape['S'][0]);
};

let canTakeThisPack = function (cards, tablesCards, rotationShape, trump) {
    let splitCards = splitCardsByShape(cards),
        haveThisShape = splitCards[rotationShape].length > 0,
        highestCard = getHighestCardOnTheTable(tablesCards, rotationShape, trump);
    if (haveThisShape) {
        let rotationShapeCards = splitCards[rotationShape];
        return compareByTrump(rotationShapeCards[rotationShapeCards.length-1],highestCard,rotationShape,trump)===1;
    }
    else {
        let trumpShapeCards = splitCards[trump];
        return trumpShapeCards.length >0?
            compareByTrump(trumpShapeCards[trumpShapeCards.length-1],highestCard,rotationShape,trump)===1:
            false;
    }
};

let getTheHighestCardThatDoNotTakeThePack = function (cards, tableCards, rotationShape, trump) {
    let splitCards = splitCardsByShape(cards), tempCard, i=0,
        highestCardOnTheTable = getHighestCardOnTheTable(tableCards,rotationShape,trump);
    if (splitCards[rotationShape].length>0) {
        while (i < splitCards[rotationShape].length
        && compareByTrump(splitCards[rotationShape][i],highestCardOnTheTable,rotationShape,trump)===-1) {
            i++;
        }
        return i===0? '' : splitCards[rotationShape][i-1];
    }
    if (splitCards[trump].length>0 && haveThisShape(tableCards, trump)) {
        i=0;
        while (i < splitCards[trump].length
        && compareByTrump(splitCards[trump][i],highestCardOnTheTable,rotationShape,trump)===-1) {
            i++;
        }
        if (i>0) {
            return splitCards[trump][i-1];
        }
    }
    let clubCard = 'C'===rotationShape?'': 'C'===trump?'': splitCards.C.length===0?'': splitCards.C[splitCards.C.length-1],
        diamondCard = 'D'===rotationShape?'': 'D'===trump?'': splitCards.D.length===0?'': splitCards.D[splitCards.D.length-1],
        heartCard = 'H'===rotationShape?'': 'H'===trump?'': splitCards.H.length===0?'': splitCards.H[splitCards.H.length-1],
        spadeCard = 'S'===rotationShape?'': 'S'===trump?'': splitCards.S.length===0?'': splitCards.S[splitCards.S.length-1];
    tempCard = getHighestCardOnTheTable([clubCard,diamondCard,heartCard,spadeCard],rotationShape,trump);
    return tempCard;
};

let getTheLowestCardThatTake = function (cards, tableCards, rotationShape, trump) {
    let i, highestCard = getHighestCardOnTheTable(tableCards, rotationShape, trump),
        cardsByShape = splitCardsByShape(cards);
    if (haveThisShape(cards, rotationShape)) {
        for (i=0; i<cardsByShape[rotationShape].length; i++) {
            if (compareByTrump(cardsByShape[rotationShape][i],highestCard,rotationShape,trump)===1) {
                return cards.indexOf(cardsByShape[rotationShape][i]);
            }
        }
    }
    for (i=0; i<cardsByShape[trump].length; i++) {
        if (compareByTrump(cardsByShape[trump][i],highestCard,rotationShape,trump)===1) {
            return cards.indexOf(cardsByShape[trump][i]);
        }
    }
};

let doIHaveSureTake = function (cards, tableCards, cardsThatPlayed, rotationShape, trump) {
    if (!canTakeThisPack(cards,tableCards,rotationShape,trump)) {
        return false;
    }
    let numOfPlayersThatPlayed = 4, numOfHigherCards = 0, i,
        splitCards = splitCardsByShape(cards),
        haveThisShape = rotationShape===''? true: splitCards[rotationShape].length > 0,
        haveTrump = splitCards[trump].length > 0;
    for (i=0; i<tableCards.length; i++) {
        if (tableCards[i] === '') {
            numOfPlayersThatPlayed--;
        }
    }
    if (numOfPlayersThatPlayed === 3) {
        return true;
    }
    if (haveThisShape) {
        if (trump !== 'NT' && cardsThatPlayed[trump].length + splitCards[trump].length !== 13) {
            //ToDo //if the rest of the player have the shape we good
            return false;
        }
        let myHighestCard = splitCards[rotationShape][splitCards[rotationShape].length-1];
        for (i=0; i<cardsThatPlayed[rotationShape].length; i++) {
            if (compareByTrump(myHighestCard,cardsThatPlayed[rotationShape][i],rotationShape,trump)===1) {
                numOfHigherCards++;
            }
        }
        //ToDo
        return 14-getTheCardsValue(myHighestCard) === numOfHigherCards;
    }
    if (haveTrump) {
        let myHighestTrump = splitCards[trump][splitCards[trump].length-1];
        for (i=0; i<cardsThatPlayed[trump].length; i++) {
            if (compareByTrump(myHighestTrump,cardsThatPlayed[trump][i],rotationShape,trump)===1) {
                numOfHigherCards++;
            }
        }
        //ToDo
        return 14-getTheCardsValue(myHighestTrump) === numOfHigherCards;
    }
    return false;
};

let canILossOnPurpose =  function (cards, tableCards, cardsThatPlayed, rotationShape, trump) {
    let splitCards = splitCardsByShape(cards), i, j,
        highestCardOnTable = getHighestCardOnTheTable(tableCards, rotationShape, trump);
    if (splitCards[rotationShape].length>0) {
        for (i=0; i<splitCards[rotationShape].length; i++) {
            if (compareByTrump(splitCards[rotationShape][i],highestCardOnTable,rotationShape,trump)===-1)
                return true;
        }
        return false;
    }
    let clean = cleanCards(cards);
    if (clean.length === splitCards[trump].length) {
        for (i=0; i<splitCards[trump].length; i++) {
            for (j=0; j<tableCards.length; j++) {
                if (compareByTrump(splitCards[trump][i],tableCards[j],rotationShape,trump)===-1)
                    return true;
            }
        }
        return false;
    }
    return true;
};

let getTheHighestCard = function(cards, rotationShape, trump) {
    let i, highestCard = '', index;

    if (rotationShape!=='' && haveThisShape(cards, rotationShape)) {
        let cardsByShape = splitCardsByShape(cards);
        return cards.indexOf(cardsByShape[rotationShape][cardsByShape[rotationShape].length-1]);
    }
    for (i=0; i<cards.length; i++) {
        if (compareByTrump(cards[i],highestCard, rotationShape, trump)>0){
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

let compareByTrump = function(card1, card2, rotationShape, trump) {
    if (card1 === '') {
        return -1;
    }
    if (card2 === '') {
        return 1;
    }
    let card1Shape = card1[card1.length-1], card2Shape = card2[card2.length-1];
    switch (card1Shape) {
        case trump:
            return card2Shape !== trump? 1:compareValue(card1[0],card2[0]);
        case rotationShape:
            return card2Shape === trump? -1:
                card2Shape === rotationShape? compareValue(card1[0],card2[0]):1;
        default:
            return card2Shape === trump? -1:
                card2Shape === rotationShape? -1:
                    compareValue(card1[0],card2[0]);
    }
};

export function splitCardsByShape(cards) {
    let tempCards = {
        'C': [],
        'D': [],
        'H': [],
        'S': [],
        'NT': []
    };
    let i;
    for (i=0; i<cards.length; i++) {
        if (cards[i] !== '')
            tempCards[cards[i][cards[i].length-1]].push(cards[i]);
    }
    return tempCards;
}


