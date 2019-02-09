/* get the first bet to determine the tramp */
import {splitCardsByShape} from "../Players/Strategy"

export function getBetWithTramp(cards, tramp, bets) {
    let betValue = 0,i, j =0, sumOfBets=0,
        splitCards = splitCardsByShape(cards);
    betValue += getBetByShape(splitCards['C'], 'C', tramp);
    betValue += getBetByShape(splitCards['D']);
    betValue += getBetByShape(splitCards['S']);
    betValue += getBetByShape(splitCards['H']);
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
    return {value: betValue, shape: tramp};
}

let getBetByShape = function (cards, shape, tramp) {
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
    if (shape===tramp && cards.length>counter+4) {
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
    let splitCards = splitCardsByShape(cards);

    let AClub = 0, KClub = 0, QClub = 0, JClub = 0,
        ADiamond =  0, KDiamond = 0, QDiamond =  0, JDiamond = 0,
        AHeart =  0, KHeart = 0, QHeart =  0, JHeart = 0,
        ASpade =  0, KSpade = 0, QSpade =  0, JSpade = 0;
    if (splitCards['C'].length>0) {
        AClub = haveAce(splitCards['C']);
        KClub = haveKing(splitCards['C']);
        QClub = haveQueen(splitCards['C']);
        JClub = haveJack(splitCards['C']);
    }
    if (splitCards['D'].length>0) {
        ADiamond =  haveAce(splitCards['D']);
        KDiamond = haveKing(splitCards['D']);
        QDiamond =  haveQueen(splitCards['D']);
        JDiamond = haveJack(splitCards['D']);
    }
    if (splitCards['H'].length>0) {
        AHeart =  haveAce(splitCards['H']);
        KHeart = haveKing(splitCards['H']);
        QHeart =  haveQueen(splitCards['H']);
        JHeart = haveJack(splitCards['H']);
    }
    if (splitCards['S'].length>0) {
        ASpade =  haveAce(splitCards['S']);
        KSpade = haveKing(splitCards['S']);
        QSpade =  haveQueen(splitCards['S']);
        JSpade = haveJack(splitCards['S']);
    }
    let club, diamond, heart, spade;
    let i, bet = 0, shape = 'C';


    club = AClub + KClub;
    if ((club>0 || splitCards['C'].length>3)){
        club+=QClub;
    }
    if (club > 1 && splitCards['C'].length>3) {
        club+=JClub;
    }
    if (splitCards['C'].length>club+3)
        club = splitCards['C'].length-4;
    bet+=club;
    diamond = ADiamond + KDiamond;
    if ((diamond>0 || splitCards['D'].length>3)){
        diamond+=QDiamond;
    }
    if (diamond > 1 && splitCards['D'].length>3) {
        diamond+=JDiamond;
    }
    if (splitCards['D'].length>diamond+3)
        diamond = splitCards['D'].length-4;
    bet+=diamond;
    heart = AHeart + KHeart;
    if ((heart>0 || splitCards['H'].length>3)){
        heart+=QHeart;
    }
    if (heart > 1 && splitCards['H'].length>3) {
        heart+=JHeart;
    }
    if (splitCards['H'].length>heart+3)
        heart = splitCards['H'].length-4;
    bet+=heart;
    spade = ASpade + KSpade;
    if ((spade>0 || splitCards['S'].length>3)){
        spade+=QSpade;
    }
    if (spade > 1 && splitCards['S'].length>3) {
        spade+=JSpade;
    }
    if (splitCards['S'].length>spade+3)
        spade = splitCards['S'].length-4;
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
    return {value: bet+1, shape: shape};
}

export function compareBet(betA, betB) {
    return betA === ''? (betB === ''? 0: -1):
        betB === ''? 1:
        betA.value > betB.value? 1:
        betA.value < betB.value? -1:
        betA.shape > betB.shape? 1:
        betA.shape < betB.shape? -1:0;
}
let haveAce = function (array) {
    let ace=0;
    if (array[array.length-1][0] === 'A')
        ace++;
    return ace;
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