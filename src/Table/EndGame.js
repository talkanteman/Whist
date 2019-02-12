import React, {Component} from 'react'
import './Table.css'
class EndGame extends Component {
    render() {
        return <div className={"End"}>
            <h3 className={"H"}>game over <br/>
                the winner is... {this.props.winner}!</h3>
            <button onClick={this.props.handleClick} className={"Button"}>click here to start a new game</button>
        </div>
    }
}
export default EndGame