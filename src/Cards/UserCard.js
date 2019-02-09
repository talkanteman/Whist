import React, { Component } from 'react';
import packOfCards from './ImgSource';
import './Card.css'

class UserCard extends Component {
    constructor() {
        super();
        this.state = {
            mouseOver: false
        }
    }
    onMouseEnter = ()=>{
        if (this.props.src[this.props.src.length-1] === this.props.rotationShape
            || this.props.rotationShape === '' || !this.props.haveThisShape) {
            this.setState({mouseOver: !this.state.mouseOver});
        }
    };
    onMouseLeave = ()=>{
        this.setState({mouseOver: false});
    };
    render () {
        let src = packOfCards(this.props.src),
            alt = this.props.src,
            className = this.state.mouseOver && this.props.userTurn? "UserCardOver U"+this.props.index: "UserCard U"+this.props.index;
        return <div className={className}>
            <img src={src} alt={alt} className={className} onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}
                 onClick={()=>this.props.onClick(this.props.index)}/>:
        </div>;
    }
}
export default UserCard;