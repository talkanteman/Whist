import React, { Component } from 'react';
import './App.css';
import Table from "./Table/Table";
import EnterPage from "./EnterPage/EnterPage"

class App extends Component {
    constructor() {
        super();
        this.state = {
            buttonPressed: false
        }
    }
    handleClick = () =>{
        this.setState({buttonPressed: true})
    };
    render() {
        return this.state.buttonPressed? <Table/>: <EnterPage handleClick={this.handleClick}/>;
    }
}
export default App;



/*import {user} from './Players/User';
import Player from './Players/Player';
import GetBet from './Bet/GetBet';
import Table from "./Table/Table";
import Name from "./Names/Name";
import EndGame from "./Table/EndGame";
import {divideCard, initGame, getWinner, gameOver, sort} from './Cards/HandleCards';
import {choseCard, haveThisShape} from "./Players/Strategy";
import {compareBet, getBet, getBetWithDominant, getHighestBet} from './Bet/PlayerBet';
import Bet from "./Bet/Bet";
import StartGame from "./Table/StartGame";
import User from "./Players/User";

class App extends Component {
    constructor() {
        super();
        this.state = {
            players: initGame(divideCard()),
            bets: ['','','',''],
            table: {dominant: '', numOfRotation: 0, rotationShape: '', cardsValues: ['','','',''], numOfTurns: 0, winner: 5},
            cardsThatPlayed: {'C':[], 'D':[], 'H':[], 'S':[]},
            tableCards: [],
            points: [0,0,0,0],
            betRotation: 0,
            showBet: true,
            end: false,
            userTurn: false,
            userTurnToBet: false,
            gameOver: false,
            numOfGame: 0,
            highestBidder: -1,
            winner: 5
        };
        this.handleBetBeforeDominant = this.handleBetBeforeDominant.bind(this);
        this.handleBetWithDominant = this.handleBetWithDominant.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleUserBetSubmit = this.handleUserBetSubmit.bind(this);
        this.handleRotation = this.handleRotation.bind(this);
        this.endRotation = this.endRotation.bind(this);
        this.startRotation = this.startRotation.bind(this);
        this.initRound = this.initRound.bind(this);
        this.startNewGame = this.startNewGame.bind(this);
    }

    handleBetBeforeDominant(index) {
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
                table.dominant = playersBets[highestBidder].shape;
                let tempHighestBet = playersBets[highestBidder];
                for (i=0; i<4; i++) {
                    playersBets[i] = '';
                }
                playersBets[highestBidder] = tempHighestBet;
                this.setState({table: table, highestBidder: highestBidder, bets: playersBets});
                setTimeout(()=>{this.handleBetWithDominant(highestBidder);},150);
            }
            else if (index === (firstToBet + 3)%4 && highestBidder === -1) {
                this.setState({highestBidder: firstToBet});
                setTimeout(()=>{this.handleBetWithDominant(firstToBet);},150);
            }
            else {
                setTimeout(()=>{this.handleBetBeforeDominant((index+1)%4);},150);
            }
        }
        else {
            for (i=0; i<4; i++) {
                playersBets[i] = '';
            }
            playersBets[index] = bet;
            this.setState({bets: playersBets});
            setTimeout(()=>{this.handleBetBeforeDominant((index+1)%4);},150);
        }
    }

    handleBetWithDominant(index) {
        let i, bet, sumOfBets = 0, playersBets = this.state.bets,
            table = this.state.table,
            firstToBet = this.state.highestBidder,
            cards = this.state.players[index].cards;
        if (index === 2) {
            this.setState({userTurnToBet: true});
            return;
        }
        bet = getBetWithDominant(cards, table.dominant, playersBets);
        if (index === firstToBet && compareBet(bet, playersBets[firstToBet]) > 0) {
            playersBets[index] = bet;
        }
        else if (index === (firstToBet + 3)%4) {
            for (i=0; i<4; i++) {
                if (i !== index) {
                    sumOfBets += playersBets[i].value;
                }
            }
            playersBets[index] = sumOfBets + bet.value === 13? {value: bet.value+1, shape: bet.shape}: bet;
            this.setState({bets: playersBets, showBet: false});
            if (index+1 !== 2) {
                setTimeout(()=>{this.handleRotation((index+1)%4);},200);
            }
            else {
                this.setState({userTurn: true});
            }
            return;
        }
        else {
            playersBets[index] = bet;
        }
        this.setState({bets: playersBets});
        setTimeout(()=>{this.handleBetWithDominant((index+1)%4);},150);
    }

    handleUserBetSubmit(bet) {
        let table = this.state.table, bets = this.state.bets,
            high = 0, i,
            players = this.state.players,
            betRotation = this.state.betRotation;
        players[2].bet = bet;

        if (this.state.userTurnToBet) {
            betRotation++;
            if (table.dominant === '') {
                high = getHighestBet(bets);
                if (bet.value !== 0) {
                    for (i=0; i<4; i++) {
                        bets[i] = '';
                    }
                    bets[2] = bet;
                    this.setState({betRotation: betRotation, bets: bets});
                    setTimeout(()=>{this.handleBetBeforeDominant(3);},150);
                    return;
                }
                if (3 === high) {
                    table.dominant = bets[high].shape;
                    let tempHighestBet = bets[high];
                    for (i=0; i<4; i++) {
                        bets[i] = '';
                    }
                    bets[high] = tempHighestBet;
                    this.setState({betRotation: betRotation, table: table, highestBidder: high, bets: bets});
                    setTimeout(()=>{this.handleBetWithDominant(3);},150);
                    return;
                }
                setTimeout(()=>{this.handleBetBeforeDominant(3);},150);
            }
            else {
                bets[2] = bet;
                this.setState({bets: bets});
                if (bets[3] === '') {
                    setTimeout(()=>{this.handleBetWithDominant(3);},150);
                }
                else {
                    this.setState({showBet: false});
                    setTimeout(()=>{this.handleRotation(3);},150);
                }
            }
        }
    }

    handleRotation(index) {
        let players = this.state.players, chose,
            table = this.state.table,
            bets = this.state.bets,
            tableCards = this.state.tableCards;
        chose = choseCard(players, table, bets, index);
        if (table.rotationShape === '') {
            table.rotationShape = players[index].cards[chose][players[index].cards[chose].length-1];
        }
        tableCards[index] = players[index].cards[chose];
        table.cardsValues[index] = players[index].cards[chose];
        players[index].cards.splice(chose,1,"");
        table.numOfTurns++;

        this.setState({tableCards: tableCards, table: table});
        if (table.numOfTurns === 4) {
            setTimeout(()=>this.endRotation(),1000);
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
            userCard = players[2].cards[index],
            tableCards = this.state.tableCards;
        if (this.state.userTurn) {
            if (table.rotationShape === '') {
                table.rotationShape = userCard[userCard.length-1];
            }
            if (!haveThisShape(players[2].cards, table.rotationShape) || userCard[userCard.length-1] === table.rotationShape) {
                players[2].cards.splice(index,1,"");
                table.numOfTurns++;
                table.cardsValues[2] = userCard;
                tableCards[2] = userCard;
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
            tableCards = this.state.tableCards,
            cardsPlayed = this.state.cardsThatPlayed,
            tempCard,
            i;
        table.winner = getWinner(tableCards, table.dominant, table.rotationShape);
        players[table.winner].packs++;
        table.numOfTurns = 0;
        table.rotationShape = '';
        table.numOfRotation++;
        table.cardsValues = ['', '', '', ''];
        for (i=0; i<4; i++) {
            tempCard = tableCards[i];
            cardsPlayed[tempCard[tempCard.length-1]].push(tempCard);
            if (cardsPlayed[tempCard[tempCard.length-1]].length>1)
                cardsPlayed[tempCard[tempCard.length-1]] = sort(cardsPlayed[tempCard[tempCard.length-1]]);
        }
        this.setState({end:true});
        setTimeout(()=>{
            this.setState({end: false, table: table});
            this.setState({players: players, cardsThatPlayed: cardsPlayed});
            tableCards = ['','','',''];
            this.setState({tableCards: tableCards});
            this.startRotation();
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
/*
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
                    sumOfBets>13? prev[i] + 25:
                        prev[i] + 50;
            }
            else {
                points[i] =
                    bet !== packs? prev[i] - Math.abs(bet-packs)*10:
                        (prev[i] + packs*packs +10);
            }
        }
        console.log("prev" + prev);
        console.log("user packs: " + players[2].packs);
        console.log("user bet: " + bets[2].value);
        console.log(points);
        i = gameOver(points);
        if (i < 4) {
            this.setState({gameOver: true, winner: i})
        }
        else {
            let numOfGame = this.state.numOfGame + 1;
            this.setState({
                players: initGame(divideCard()),
                bets: ['','','',''],
                table: {dominant: '', numOfRotation: 0, rotationShape: '', cardsValues: ['','','',''], numOfTurns: 0, winner: 5},
                cardsThatPlayed: {'C':[], 'D':[], 'H':[], 'S':[]},
                tableCards: [],
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
            this.handleBetBeforeDominant(numOfGame%4);
        }
    }

    startNewGame() {
        this.setState({
            players: initGame(divideCard()),
            bets: ['','','',''],
            table: {dominant: '', numOfRotation: 0, rotationShape: '', cardsValues: ['','','',''], numOfTurns: 0, winner: 5},
            cardsThatPlayed: {'C':[], 'D':[], 'H':[], 'S':[]},
            tableCards: [],
            points: [0,0,0,0],
            betRotation: 1,
            showBet: true,
            end: false,
            userTurn: false,
            gameOver: false,
            numOfGame: 0,
            highestBidder: -1,
            winner: 5
        });
        this.handleBetBeforeDominant(0);
    }
    render() {
        let players = this.state.players,
            points = this.state.points,
            table = this.state.table,
            names = ["Aviv", "Alon", "Ofek", "Noa"],
            bets = this.state.bets,
            showBet = this.state.showBet;

        return (
            this.state.gameOver?
                <div>
                    <EndGame winner={names[this.state.table.winner]} handleClick={this.startNewGame}/>
                </div>:
                <div className="App">
                    <GetBet handleSubmit={this.handleUserBetSubmit} turnToBet={this.state.userTurnToBet}
                            names={names} bets={bets} dominant={table.dominant} key={this.state.betRotation}
                            highestBidder={this.state.highestBidder}/>
                    <Player cards={players[0].cards} pos={"Up"}/>
                    <Name   name={"Aviv"} pos={"Up"} packs={players[0].packs} points={points[0]} bet={bets[0]}/>
                    {showBet? <Bet    name={"Aviv"} bet={bets[0]} dominant={table.dominant} index={0}/>:<div/>}
                    <Player cards={players[1].cards} pos={"Right"}/>
                    <Name   name={"Alon"} pos={"Right"} packs={players[1].packs} points={points[1]} bet={bets[1]}/>
                    {showBet? <Bet    name={"Alon"} bet={bets[1]} dominant={table.dominant} index={1}/>:<div/>}
                    <User   cards={players[2].cards} onClick={this.handleClick}/>
                    <Name   name={"Ofek"}  pos={"User"} packs={players[2].packs} points={points[2]} bet={bets[2]}/>
                    <Player cards={players[3].cards} pos={"Left"}/>
                    <Name   name={"Noa"}  pos={"Left"} packs={players[3].packs} points={points[3]} bet={bets[3]}/>
                    {showBet? <Bet    name={"Noa"} bet={bets[3]} dominant={table.dominant} index={3}/>:<div/>}
                    <Table  cards={this.state.tableCards} end={this.state.end} winner={names[table.winner]}/>
                    <StartGame betRotation={this.state.betRotation} handleClick={()=>{this.handleBetBeforeDominant(0)}}/>
                </div>
        );
    }
}

export default App;
*/