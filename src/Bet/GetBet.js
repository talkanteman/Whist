import React, {Component} from 'react'
import './GetBet.css'
import clubSrc  from "./Club.png"
import diamondSrc from "./diamond.png"
import heartSrc from "./heart.png"
import spadeSrc from "./spade.png"

let club = <img src={clubSrc} className={'Dominant'} alt={'Club'}/>;
let diamond = <img src={diamondSrc} className={'Dominant'} alt={'Diamond'}/>;
let heart = <img src={heartSrc} className={'Dominant'} alt={'Heart'}/>;
let spade = <img src={spadeSrc} className={'Dominant'} alt={'Spade'}/>;
const dominants = {
    C: club,
    D: diamond,
    H: heart,
    S: spade
};
const shapes = [
    { value: 'C', label: 'Club' },
    { value: 'D', label: 'Diamond' },
    { value: 'H', label: 'heart' },
    { value: 'S', label: 'Spade' }
];
const user = 2;
/*
let values = [
    {value: 0, label: '0'},
    {value: 1, label: '1'},
    {value: 2, label: '2'},
    {value: 3, label: '3'},
    {value: 4, label: '4'},
    {value: 5, label: '5'},
    {value: 6, label: '6'},
    {value: 7, label: '7'},
    {value: 8, label: '8'},
    {value: 9, label: '9'},
    {value: 10, label: '10'},
    {value: 11, label: '11'},
    {value: 12, label: '12'},
    {value: 13, label: '13'}
];
let valuesBeforeDominant = [
    {value: 0, label: 'pass'},
    {value: 5, label: '5'},
    {value: 6, label: '6'},
    {value: 7, label: '7'},
    {value: 8, label: '8'},
    {value: 9, label: '9'},
    {value: 10, label: '10'},
    {value: 11, label: '11'},
    {value: 12, label: '12'},
    {value: 13, label: '13'}
];
*/
export default class GetBet extends Component {
    bets;
    turnToBet;
    constructor() {
        super();
        this.state = {
            bet: '',
            betValue: 0,
            betShape: 'C',
            display: true
        };
        this.handleShapeChange = this.handleShapeChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleValueChange = this.handleValueChange.bind(this);
        this.changeInitValue = this.changeInitValue.bind(this);
    }

    handleShapeChange(e) {
        this.setState({
            betShape: e.target.value
        })
    }
    handleValueChange(e) {
        this.setState({
            betValue: parseInt(e.target.value,10)
        })
    }
    handleSubmit() {
        this.setState({display:false});
        if (this.props.dominant !== '') {
            this.props.handleSubmit({value: this.state.betValue, shape: this.props.dominant});
        }
        else {
            this.props.handleSubmit({value: this.state.betValue, shape: this.state.betShape});
        }
    }
    changeInitValue(newValue) {
        this.setState({betValue:  newValue})
    }
    render() {
        if (!this.props.turnToBet) {
            return <div className={"GetBet"}/>
        }
        if (this.props.highestBidder === user && this.state.betValue === 0) {
            this.changeInitValue(this.props.bets[user].value)
        }
        let highestBet = 0, i=0, tempValuesBeforeDominant = [
                {value: 0, label: 'pass'},
                {value: 5, label: '5'},
                {value: 6, label: '6'},
                {value: 7, label: '7'},
                {value: 8, label: '8'},
                {value: 9, label: '9'},
                {value: 10, label: '10'},
                {value: 11, label: '11'},
                {value: 12, label: '12'},
                {value: 13, label: '13'}
            ],
            tempValues = [
                {value: 0, label: '0'},
                {value: 1, label: '1'},
                {value: 2, label: '2'},
                {value: 3, label: '3'},
                {value: 4, label: '4'},
                {value: 5, label: '5'},
                {value: 6, label: '6'},
                {value: 7, label: '7'},
                {value: 8, label: '8'},
                {value: 9, label: '9'},
                {value: 10, label: '10'},
                {value: 11, label: '11'},
                {value: 12, label: '12'},
                {value: 13, label: '13'}
            ];
        for (i; i<4; i++) {
            if (this.props.bets[i].value > highestBet)
                highestBet = this.props.bets[i].value;
        }
        if (highestBet > 0 && this.props.highestBidder === -1 && tempValuesBeforeDominant.length > (15 - highestBet)) {
            tempValuesBeforeDominant.splice(1, highestBet-5);
        }
        if (this.props.highestBidder === 2 && tempValues.length > (14 - highestBet)) {
            tempValues.splice(0, highestBet);
        }
        else if (this.props.highestBidder === 3 && tempValues.length > 13) {
            let sumOfBets = 0;
            for (i=0; i<4; i++) {
                sumOfBets += this.props.bets[i].value;
            }
            if (sumOfBets <= 13) {
                tempValues.splice(sumOfBets, 1);
            }
        }
        if (this.state.display) {
            return <div>

                <div className={"GetBet"}>
                    {this.props.highestBidder === -1? '':
                      <span>The dominant is: {dominants[this.props.dominant]}</span>}

                    <form className={"container"} onSubmit={this.handleSubmit}>
                        <label>
                            bet the number of packs:
                            {this.props.highestBidder !== -1?
                                <select value={this.state.betValue} onChange={this.handleValueChange}>
                                    {tempValues.map((value) => {
                                        return <option value={value.value} key={value.value}>{value.label}</option>
                                    })}
                                </select>:
                                <select value={this.state.betValue} onChange={this.handleValueChange}>
                                    {tempValuesBeforeDominant.map((value) => {
                                        return <option value={value.value} key={value.value}>{value.label}</option>
                                    })}
                                </select>
                            }

                        </label>
                        {this.props.highestBidder === -1 && this.state.betValue > 0?
                        <label>
                            pick your dominant shape:
                            <select value={this.state.betShape} onChange={this.handleShapeChange}>
                                {shapes.map((value) => {
                                    return <option value={value.value} key={value.value}>
                                        {value.label}
                                    </option>
                                })}
                            </select>
                        </label>:<div/>}
                        <input type="submit" value="bet"/>
                    </form>
                </div>
            </div>;
        }
        return <div className={"GetBet"}/>
    }
};