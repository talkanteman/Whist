import React, {Component} from 'react'
import './Table.css'
class StartGame extends Component {
    render() {
        return this.props.betRotation === 0?
            <div className={"End"}>
                <button onClick={this.props.handleClick}>click here to start a new game</button>
            </div>:
            <div/>
    }
}
export default StartGame