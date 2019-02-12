/* get the first bet to determine the trump */
import {splitCardsByShape} from "../Players/Strategy"

export function getBetWithTrump(cards, trump, bets) {
    let betValue = 0,i, j =0, sumOfBets=0,
        splitCards = splitCardsByShape(cards);
    betValue += getBetByShape(splitCards['C'], 'C', trump);
    betValue += getBetByShape(splitCards['D'], 'D', trump);
    betValue += getBetByShape(splitCards['S'], 'S', trump);
    betValue += getBetByShape(splitCards['H'], 'H', trump);
    for (i=0; i<4; i++) {
        if (bets[i] !== '')
            j++;
    }
    if (j === 3) {
        for (i=0; i<4; i++) {
            if (bets[i] !== '')
                sumOfBets+=bets.value;
        }
    }
    if (sumOfBets+betValue===13)
        betValue++;
    return {value: betValue, shape: trump};
}

let getBetByShape = function (cards, shape, trump) {
    let counter = 0;
    if (cards.length===0) {
        return counter;
    }
    counter += haveAce(cards);
    counter += haveKing(cards);
    if (counter>0 && cards.length>3)
        counter += haveJack(cards);
    counter += haveQueen(cards);
    if (counter>1 && cards.length>4)
        counter += haveThisNumber(cards, "1");
    if (counter>3 && cards.length>5)
        counter += haveThisNumber(cards, "9");
    if (shape===trump && cards.length>counter+4) {
        counter = cards.length-4;
    }
    else if (cards.length>counter+5) {
        counter = cards.length-5;
    }
    return counter;
};
export function getHighestBet(bets) {
    let i, high = 0;
    for (i=1; i<4; i++) {
        if (compareBet(bets[i], bets[high]) > 0)
            high = i;
    }
    high = compareBet(bets[high], {value:0, shape:''}) > 0? high:-1;
    return high;
}

export function getBet(cards) {
    let splitCards = splitCardsByShape(cards),
        club, diamond, heart, spade,
        i, bet, shape;

    club = getBetByShapeBeforeTrumpSet(splitCards['C']);
    bet = club;
    diamond = getBetByShapeBeforeTrumpSet(splitCards['D']);
    bet+=diamond;
    heart = getBetByShapeBeforeTrumpSet(splitCards['H']);
    bet+=heart;
    spade = getBetByShapeBeforeTrumpSet(splitCards['S']);
    bet+=spade;
    let numToBet =[club, diamond, heart, spade], shapes = ['C','D','H','S'],
        lengths = [splitCards['C'].length,splitCards['D'].length,splitCards['H'].length,splitCards['S'].length];
    let shapeToBet = 0, numOfThisShape = 0;
    for (i=0; i<4; i++) {
        if ((numToBet[i] > shapeToBet) || (numToBet[i]===shapeToBet && lengths[i]>numOfThisShape)) {
            shape = shapes[i];
            shapeToBet = numToBet[i];
            numOfThisShape = lengths[i];
        }
    }
    return {value: bet, shape: shape};
}
let getBetByShapeBeforeTrumpSet = function (cards) {
    let counter = 0;
    if (cards.length===0) {
        return counter;
    }
    counter += haveAce(cards);
    counter += haveKing(cards);
    if (counter>0 && cards.length>3)
        counter += haveJack(cards);
    counter += haveQueen(cards);
    if (counter>1 && cards.length>4)
        counter += haveThisNumber(cards, "1");
    if (counter>3 && cards.length>5)
        counter += haveThisNumber(cards, "9");

    return counter;
};

export function compareBet(betA, betB) {
    return betA === ''? (betB === ''? 0: -1):
        betB === ''? 1:
        betA.value > betB.value? 1:
        betA.value < betB.value? -1:
        betA.shape > betB.shape? 1:
        betA.shape < betB.shape? -1:0;
}
let haveAce = function (array) {
    return (array[array.length-1][0] === 'A')? 1:0;
};
let haveKing = function (array) {
    let i=array.length, king=0;
    if (i>0 && array[i-1][0] === 'K')
        king++;
    else
    if (i>1 && array[i-2][0] === 'K')
        king++;
    return king;
};
let haveQueen = function (array) {
    let i=array.length, queen=0;
    if (i>0 && array[i-1][0] === 'Q')
        queen++;
    else
    if (i>1 && array[i-2][0] === 'Q')
        queen++;
    if (i>2 && array[i-3][0] === 'Q')
        queen++;
    return queen;
};
let haveJack = function (array) {
    let i;
    for (i=0; i< array.length; i++) {
        if (array[i][0]==='J')
            return 1;
    }
    return 0;
};
let haveThisNumber = function (array, num) {
    let i;
    for (i=0; i< array.length; i++) {
        if (array[i][0]===num)
            return 1;
    }
    return 0;
};