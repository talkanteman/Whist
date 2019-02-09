/* get the first bet to determine the dominant */
import {splitCardsByShape} from "../Players/Strategy"

export function getBetWithDominant(cards, dominant, bets) {
    let betValue = 0,i, j =0, sumOfBets=0,
        splitCards = splitCardsByShape(cards);
    betValue += getBetByShape(splitCards['C']);
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
    return {value: betValue, shape: dominant};
}

let getBetByShape = function (cards) {
    let counter = 0;
    if (cards.length===0) {
        return counter;
    }
    counter += haveAce(cards);
    if (counter === 1)
        counter += haveJack(cards);
    counter += haveKing(cards);
    counter += haveQueen(cards);
    if (counter > 1 && cards.length>4)
        counter += haveThisNumber(cards, "1");
    if (counter>3 && cards.length>5)
        counter += haveThisNumber(cards, "9");
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
    let AClub = false, KClub = false, QClub = false, JClub = false,
        ADiamond = false, KDiamond = false, QDiamond = false, JDiamond = false,
        AHeart = false, KHeart = false, QHeart = false, JHeart = false,
        ASpade = false, KSpade = false, QSpade = false, JSpade = false;
    let CStart, CEnd = 0,
        DStart, DEnd = 0,
        HStart, HEnd = 0,
        SStart, SEnd = 0;
    let club = 0, diamond = 0, heart = 0, spade = 0;
    let i, bet = 0, shape = 'C';
    for (i=0; i<13; i++) {
        switch (cards[i][cards[i].length-1]) {
            case 'C':
                CEnd++;
                DEnd++;
                HEnd++;
                SEnd++;
                break;
            case 'D':
                DEnd++;
                HEnd++;
                SEnd++;
                break;
            case 'S':
                HEnd++;
                SEnd++;
                break;
            case 'H':
                HEnd++;
                break;
            default:
        }
    }
    CStart = 0;
    DStart = CEnd;
    HStart = DEnd;
    SStart = HEnd;
    for (i=CStart; i<CEnd; i++) {
        switch (cards[i][0]) {
            case 'J':
                JClub = true;
                break;
            case 'Q':
                QClub = true;
                break;
            case 'K':
                KClub = true;
                club++;
                bet++;
                break;
            case 'A':
                AClub = true;
                club++;
                bet++;
                break;
            default:
        }
    }
    if ((KClub || AClub || CEnd-CStart>3) && QClub){
        club++;
        bet++;
    }
    if (club > 1 && CEnd-CStart>3 && JClub) {
        club++;
        bet++;
    }
    for (i=DStart; i<DEnd; i++) {
        switch (cards[i][0]) {
            case 'J':
                JDiamond = true;
                break;
            case 'Q':
                QDiamond = true;
                break;
            case 'K':
                KDiamond = true;
                diamond++;
                bet++;
                break;
            case 'A':
                ADiamond = true;
                diamond++;
                bet++;
                break;
            default:
        }
    }
    if ((KDiamond || ADiamond || DEnd-DStart>3) && QDiamond){
        diamond++;
        bet++;
    }
    if (diamond > 1 && DEnd-DStart>3 && JDiamond) {
        diamond++;
        bet++;
    }
    for (i=HStart; i<HEnd; i++) {
        switch (cards[i][0]) {
            case 'J':
                JHeart = true;
                break;
            case 'Q':
                QHeart = true;
                break;
            case 'K':
                KHeart = true;
                heart++;
                bet++;
                break;
            case 'A':
                AHeart = true;
                heart++;
                bet++;
                break;
            default:
        }
    }
    if ((KHeart || AHeart || HEnd-HStart>3) && QHeart){
        heart++;
        bet++;
    }
    if (heart > 1 && HEnd-HStart>3 && JHeart) {
        heart++;
        bet++;
    }
    for (i=SStart; i<SEnd; i++) {
        switch (cards[i][0]) {
            case 'J':
                JSpade = true;
                break;
            case 'Q':
                QSpade = true;
                break;
            case 'K':
                KSpade = true;
                spade++;
                bet++;
                break;
            case 'A':
                ASpade = true;
                spade++;
                bet++;
                break;
            default:
        }
    }
    if ((KSpade || ASpade || SEnd-SStart>3) && QSpade){
        spade++;
        bet++;
    }
    if (spade > 1 && SEnd-SStart>3 && JSpade) {
        spade++;
        bet++;
    }
    let shapeToBet = club, numOfThisShape = CEnd-CStart;
    if (diamond > shapeToBet || (diamond === shapeToBet && DEnd-DStart > numOfThisShape)) {
        shape = 'D';
        shapeToBet = diamond;
        numOfThisShape = DEnd-DStart;
    }
    if (heart > shapeToBet || (heart === shapeToBet && HEnd-HStart > numOfThisShape)){
        shape = 'H';
        shapeToBet = heart;
        numOfThisShape = HEnd-HStart
    }
    if (spade > shapeToBet || (spade === HEnd-HStart && SEnd-SStart > numOfThisShape))
        shape = 'S';
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
    let i=array.length, jack=0;
    if (i>0 && array[i-1][0] === 'J')
        jack++;
    else
    if (i>1 && array[i-2][0] === 'J')
        jack++;
    if (i>2 && array[i-3][0] === 'J')
        jack++;
    if (i>3 && array[i-4][0] === 'J')
        jack++;
    return jack;
};
let haveThisNumber = function (array, num) {
    let i;
    for (i=0; i< array.length; i++) {
        if (array[i][0]===num)
            return 1;
    }
    return 0;
};