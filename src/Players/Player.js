import React, {Component} from 'react'
import Card from "../Cards/Card";

class Player extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: props.name,
            pos: props.pos
        }
    }

    render() {
        return <div className={this.state.pos}>
            {this.props.cards.map((value, index)=>{
                if (this.state.pos === "Up"){
                    return <Card key={index} className={this.state.pos+"Card U"+index} src={value}/>;
                }
                else
                    return <Card key={index} className={this.state.pos+"Card LR"+index} src={value}/>;
            })}
        </div>
    }
}

export default Player;