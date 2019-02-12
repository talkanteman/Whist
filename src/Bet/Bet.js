import React, {Component} from 'react'
import './Bet.css'
class Bet extends Component {
    render() {
        let bet = this.props.bet;
        if (bet === '') {
            return <div/>
        }
        return <div>
            <h4 className={"Bet"+this.props.index}>{this.props.name+"'s "}
             bet: {bet.value === 0 && this.props.trump === ''? 'pass': bet.value + bet.shape}</h4>
        </div>
    }
}
export default Bet;