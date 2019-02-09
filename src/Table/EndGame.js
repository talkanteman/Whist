import React, {Component} from 'react'
import './Table.css'
class EndGame extends Component {
    render() {
        return <div className={"End"}>
            <h3>
                game over
                the winner is {this.props.winner}
            </h3>
            <button onClick={this.props.handleClick}>click here to start a new game</button>
        </div>
    }
}
export default EndGame