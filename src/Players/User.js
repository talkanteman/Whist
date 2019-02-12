import React, {Component} from 'react'
import UserCard from "../Cards/UserCard";

class User extends Component {

    haveThisShape(cards, shape) {
        if (shape==='')
            return false;
        let i=0;
        while (i<13 && cards[i].substring(cards[i].length-1) !== shape)
            i++;
        return i<13;
    }
    render() {
        let userHaveThisShape = this.haveThisShape(this.props.cards, this.props.rotationShape);
        return <div className={"User"}>
            {this.props.cards.map((value, index)=>{
                return value!==""?
                <UserCard key={index} index={index} className={"UserCard U"+index} src={value} userHaveThisShape={userHaveThisShape}
                             onClick={this.props.onClick} userTurn={this.props.userTurn} rotationShape={this.props.rotationShape}/>:
                    <div/>
            })}
        </div>
    }
}

export default User;