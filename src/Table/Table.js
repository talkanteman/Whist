import React, {Component} from 'react'
import Card from "../Cards/Card";
import './Table.css';

import '../App.css';
import Player from '../Players/Player';
import GetBet from '../Bet/GetBet';
import Name from "../Names/Name";
import EndGame from "../Table/EndGame";
import {divideCard, initGame, getWinner, gameOver, sort} from '../Cards/HandleCards';
import {choseCard, haveThisShape} from "../Players/Strategy";
import {compareBet, getBet, getBetWithTrump, getHighestBet} from '../Bet/PlayerBet';
import Bet from "../Bet/Bet";
import User from "../Players/User";

class Table extends Component {
    constructor(props) {
        super(props);
        this.state = {
            players: initGame(divideCard()),
            bets: ['','','',''],
            table: {trump: '', numOfRotation: 0, rotationShape: '', cards: ['','','',''], numOfTurns: 0, winner: 5},
            cardsThatPlayed: {'C':[], 'D':[], 'H':[], 'S':[], 'NT':[]},
            points: [0,0,0,0],
            betRotation: 0,
            showBet: true,
            end: false,
            userTurn: false,
            userTurnToBet: false,
            gameOver: false,
            numOfGame: 0,
            highestBidder: -1,
            winner: 5,
            newGame: true
        };
        this.handleBetBeforeTrump = this.handleBetBeforeTrump.bind(this);
        this.handleBetWithTrump = this.handleBetWithTrump.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleUserBetSubmit = this.handleUserBetSubmit.bind(this);
        this.handleRotation = this.handleRotation.bind(this);
        this.endRotation = this.endRotation.bind(this);
        this.startRotation = this.startRotation.bind(this);
        this.initRound = this.initRound.bind(this);
        this.startNewGame = this.startNewGame.bind(this);
    }

    handleBetBeforeTrump(index) {
        let bet, i, playersBets = this.state.bets, highestBidder = getHighestBet(playersBets),
            table = this.state.table,
            firstToBet = this.state.numOfGame%4,
            betRotation = this.state.betRotation,
            cards = this.state.players[index].cards;
        if (index === 2) {
            this.setState({userTurnToBet: true});
            return;
        }
        betRotation++;
        this.setState({betRotation: betRotation});
        bet = getBet(cards);
        playersBets[index] = bet.value < 5? {value: 0, shape: ''}:
            highestBidder < 0? bet:
                compareBet(bet, playersBets[highestBidder])===1? bet: {value: 0, shape: ''};
        if (playersBets[index].value === 0) {
            if (highestBidder === (index+1)%4) {
                table.trump = playersBets[highestBidder].shape;
                let tempHighestBet = playersBets[highestBidder];
                for (i=0; i<4; i++) {
                    playersBets[i] = '';
                }
                playersBets[highestBidder] = tempHighestBet;
                this.setState({table: table, highestBidder: highestBidder, bets: playersBets});
                setTimeout(()=>{this.handleBetWithTrump(highestBidder);},200);
            }
            else if (index === (firstToBet + 3)%4 && highestBidder === -1) {
                table.trump = 'NT';
                for (i=0; i<4; i++) {
                    playersBets[i] = '';
                }
                this.setState({highestBidder: firstToBet, table: table, bets: playersBets});
                setTimeout(()=>{this.handleBetWithTrump(firstToBet);},200);
            }
            else {
                setTimeout(()=>{this.handleBetBeforeTrump((index+1)%4);},200);
            }
        }
        else {
            playersBets[index] = bet;
            this.setState({bets: playersBets});
            setTimeout(()=>{this.handleBetBeforeTrump((index+1)%4);},200);
        }
    }

    handleBetWithTrump(index) {
        let i, bet, sumOfBets = 0, playersBets = this.state.bets,
            table = this.state.table,
            firstToBet = this.state.highestBidder,
            cards = this.state.players[index].cards;
        if (index === 2) {
            this.setState({userTurnToBet: true});
            return;
        }
        bet = getBetWithTrump(cards, table.trump, playersBets);
        if (index === firstToBet) {
            if (compareBet(bet, playersBets[firstToBet]) > 0)
                playersBets[index] = bet;
        }
        else {
            if (index === (firstToBet + 3) % 4) {
                for (i = 0; i < 4; i++) {
                    if (i !== index) {
                        sumOfBets += playersBets[i].value;
                    }
                }
                playersBets[index] = sumOfBets + bet.value === 13 ? {value: bet.value + 1, shape: bet.shape} : bet;
                this.setState({bets: playersBets, showBet: false});
                if (index + 1 !== 2) {
                    setTimeout(() => {
                        this.handleRotation((index + 1) % 4);
                    }, 200);
                }
                else {
                    this.setState({userTurn: true});
                }
                return;
            }
            else {
                playersBets[index] = bet;
            }
        }
        this.setState({bets: playersBets});
        setTimeout(()=>{this.handleBetWithTrump((index+1)%4);},200);
    }

    handleUserBetSubmit(bet) {
        let table = this.state.table, bets = this.state.bets,
            high = 0, i,
            players = this.state.players,
            firstToBet = this.state.numOfGame%4,
            betRotation = this.state.betRotation;
        players[2].bet = bet;

        if (this.state.userTurnToBet) {
            betRotation++;
            if (table.trump === '') {
                high = getHighestBet(bets);
                if (bet.value !== 0) {
                    for (i=0; i<4; i++) {
                        bets[i] = '';
                    }
                    bets[2] = bet;
                    this.setState({betRotation: betRotation, bets: bets});
                    setTimeout(()=>{this.handleBetBeforeTrump(3);},200);
                    return;
                }
                if (3 === high) {
                    table.trump = bets[high].shape;
                    let tempHighestBet = bets[high];
                    for (i=0; i<4; i++) {
                        bets[i] = '';
                    }
                    bets[high] = tempHighestBet;
                    this.setState({betRotation: betRotation, table: table, highestBidder: high, bets: bets});
                    setTimeout(()=>{this.handleBetWithTrump(3);},200);
                    return;
                }
                if (3 === firstToBet && -1 === high) {
                    table.trump = 'NT';
                    for (i=0; i<4; i++) {
                        bets[i] = '';
                    }
                    this.setState({highestBidder: firstToBet, table: table, bets: bets});
                    setTimeout(()=>{this.handleBetWithTrump(firstToBet);},200);
                }
                setTimeout(()=>{this.handleBetBeforeTrump(3);},200);
            }
            else {
                bets[2] = bet;
                this.setState({bets: bets});
                if (bets[3] === '') {
                    setTimeout(()=>{this.handleBetWithTrump(3);},200);
                }
                else {
                    this.setState({showBet: false});
                    setTimeout(()=>{this.handleRotation(3);},200);
                }
            }
        }
    }

    handleRotation(index) {
        let players = this.state.players, chose, packages=[], i,
            cardsThatPlayed = this.state.cardsThatPlayed,
            table = this.state.table,
            bets = this.state.bets;
        for (i=0; i<players.length; i++) {
            packages.push(players[i].packs);
        }

        chose = choseCard(players[index].cards, table, bets, packages, index, cardsThatPlayed);
        if (table.rotationShape === '') {
            table.rotationShape = players[index].cards[chose][players[index].cards[chose].length-1];
        }
        table.cards[index] = players[index].cards[chose];
        players[index].cards.splice(chose,1,"");
        table.numOfTurns++;

        this.setState({table: table});
        if (table.numOfTurns === 4) {
            setTimeout(()=>this.endRotation(),500);
        }
        else {
            switch (index) {
                case 3:
                    setTimeout(()=>{this.handleRotation(0);},200);
                    break;
                case 1:
                    this.setState({userTurn: true});
                    break;
                default:
                    setTimeout(()=>{this.handleRotation(index+1);},200);
            }
        }
    }


    handleClick(index) {
        let players = this.state.players,
            table = this.state.table,
            userCard = players[2].cards[index];
        if (this.state.userTurn) {
            if (table.rotationShape === '') {
                table.rotationShape = userCard[userCard.length-1];
            }
            if (!haveThisShape(players[2].cards, table.rotationShape) || userCard[userCard.length-1] === table.rotationShape) {
                players[2].cards.splice(index,1,"");
                table.numOfTurns++;
                table.cards[2] = userCard;
                this.setState({table:table,userTurn: false});

                if (table.numOfTurns !== 4) {
                    setTimeout(()=>{this.handleRotation(3);},200);
                }
                else {
                    setTimeout(()=>this.endRotation(),1000);

                }
            }
        }
    }

    endRotation() {
        let table = this.state.table,
            players = this.state.players,
            cardsPlayed = this.state.cardsThatPlayed,
            tempCard,
            i;
        table.winner = getWinner(table.cards, table.trump, table.rotationShape);
        players[table.winner].packs++;
        table.numOfTurns = 0;
        table.rotationShape = '';
        table.numOfRotation++;
        for (i=0; i<4; i++) {
            tempCard = table.cards[i];
            cardsPlayed[tempCard[tempCard.length-1]].push(tempCard);
            if (cardsPlayed[tempCard[tempCard.length-1]].length>1)
                cardsPlayed[tempCard[tempCard.length-1]] = sort(cardsPlayed[tempCard[tempCard.length-1]]);
        }
        table.cards = ['', '', '', ''];
        this.setState({end:true, players: players, cardsThatPlayed: cardsPlayed, table: table});
        setTimeout(()=>{
            this.setState({end: false});
        }, 600);
        setTimeout(()=>{
            this.startRotation()
        }, 1000);
    }

    startRotation() {
        if(this.state.table.numOfRotation === 13) {
            this.initRound();
        }
        else {
            this.setState({end: false});
            if (this.state.table.winner !== 2)
                this.handleRotation(this.state.table.winner);
            else
                this.setState({userTurn: true});
        }
    }
    /*
        after 13 rotations we update the points and divide a new card.
        if one of the players reach 100 point he win
     */
    initRound() {
        let players = this.state.players, i, prev = this.state.points, points = [],
            bets = this.state.bets,
            sumOfBets = 0;
        for (i=0; i<4; i++) {
            sumOfBets += bets[i].value;
        }
        for (i=0; i<4; i++) {
            let bet = bets[i].value, packs = players[i].packs;
            if (bet === 0) {
                points[i] = packs>0? prev[i] - 30 + (packs-1)*10:
                    sumOfBets>13? prev[i] + 25: prev[i] + 50;
            }
            else {
                points[i] =
                    bet !== packs? prev[i] - Math.abs(bet-packs)*10:
                        (prev[i] + packs*packs +10);
            }
        }
        i = gameOver(points);
        if (i < 4) {
            this.setState({gameOver: true, winner: i})
        }
        else {
            let numOfGame = this.state.numOfGame + 1;
            this.setState({
                players: initGame(divideCard()),
                bets: ['','','',''],
                table: {trump: '', numOfRotation: 0, rotationShape: '', cards: ['','','',''], numOfTurns: 0, winner: 5},
                cardsThatPlayed: {'C':[], 'D':[], 'H':[], 'S':[]},
                points: points,
                betRotation: 1,
                showBet: true,
                end: false,
                userTurn: false,
                gameOver: false,
                numOfGame: numOfGame,
                highestBidder: -1,
                winner: 5
            });
            this.handleBetBeforeTrump(numOfGame%4);
        }
    }

    startNewGame() {
        this.setState({
            players: initGame(divideCard()),
            bets: ['','','',''],
            table: {trump: '', numOfRotation: 0, rotationShape: '', cards: ['','','',''], numOfTurns: 0, winner: 5},
            cardsThatPlayed: {'C':[], 'D':[], 'H':[], 'S':[]},
            points: [0,0,0,0],
            betRotation: 1,
            showBet: true,
            end: false,
            userTurn: false,
            gameOver: false,
            numOfGame: 0,
            highestBidder: -1,
            winner: 5,
            newGame: false
        });
        this.handleBetBeforeTrump(0);
    }
    render() {
        if (this.state.newGame) {
            this.setState({newGame: false});
            this.handleBetBeforeTrump(0)
        }
        let players = this.state.players,
            points = this.state.points,
            table = this.state.table,
            names = ["Aviv", "Alon", "Ofek", "Noa"],
            bets = this.state.bets,
            showBet = this.state.showBet;


        return (
            this.state.gameOver ?
                <div>
                    <EndGame winner={names[this.state.table.winner]} handleClick={this.startNewGame}/>
                </div> :
                <div className="App">
                    <GetBet handleSubmit={this.handleUserBetSubmit} turnToBet={this.state.userTurnToBet}
                            names={names} bets={bets} trump={table.trump} key={this.state.betRotation}
                            highestBidder={this.state.highestBidder}/>
                    <Player cards={players[0].cards} pos={"Up"}/>
                    <Name name={"Aviv"} pos={"Up"} packs={players[0].packs} points={points[0]} bet={bets[0]}/>
                    {showBet ? <Bet name={"Aviv"} bet={bets[0]} trump={table.trump} index={0}/> : <div/>}
                    <Player cards={players[1].cards} pos={"Right"}/>
                    <Name name={"Alon"} pos={"Right"} packs={players[1].packs} points={points[1]} bet={bets[1]}/>
                    {showBet ? <Bet name={"Alon"} bet={bets[1]} trump={table.trump} index={1}/> : <div/>}
                    <User cards={players[2].cards} onClick={this.handleClick} userTurn={this.state.userTurn} rotationShape={table.rotationShape}/>
                    <Name name={"Ofek"} pos={"User"} packs={players[2].packs} points={points[2]} bet={bets[2]}/>
                    <Player cards={players[3].cards} pos={"Left"}/>
                    <Name name={"Noa"} pos={"Left"} packs={players[3].packs} points={points[3]} bet={bets[3]}/>
                    {showBet ? <Bet name={"Noa"} bet={bets[3]} trump={table.trump} index={3}/> : <div/>}
                    <TableCards cards={this.state.table.cards} end={this.state.end} winner={names[table.winner]}/>
                </div>
        );
    }
}


class TableCards extends Component {


    render() {
        if (this.props.end) {
            return <div className={"Winner"}>
                <h3>
                    the winner of this round is {this.props.winner}
                </h3>
            </div>
        }
        return <div className={"Table"}>
            {this.props.cards.map((value, index)=>{
                return <Card key={index} table={true} index={index} className={"Card"+index} src={value}/>;
            })}
        </div>
    }
}
export default Table;