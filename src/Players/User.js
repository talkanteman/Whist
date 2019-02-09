import React, {Component} from 'react'
import UserCard from "../Cards/UserCard";

class User extends Component {

    haveThisShape(cards, shape) {
        let i=0;
        while (i<13 && cards[i].substring(cards[i].length-1) !== shape)
            i++;
        return i<13;
    }
    render() {
        let haveThisShape = this.haveThisShape(this.props.cards, this.props.rotationShape);
        return <div className={"User"}>
            {this.props.cards.map((value, index)=>{
                return <UserCard key={index} index={index} className={"UserCard U"+index} src={value} haveThisShape={haveThisShape}
                             onClick={this.props.onClick} userTurn={this.props.userTurn} rotationShape={this.props.rotationShape}/>;
            })}
        </div>
    }
}

export default User;