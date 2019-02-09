import React, { Component } from 'react';
import packOfCards from './ImgSource';
import './Card.css'
import playerCard from "./cards_back.png"

class Card extends Component {
    constructor() {
        super();
        this.state = {
            mouseOver: false
        }
    }
    onMouseOver = ()=>{
        this.setState({mouseOver: !this.state.mouseOver})
    };
    render () {
        let src = packOfCards(this.props.src),
            alt = this.props.src,
            className = this.state.mouseOver? "UserCardOver U"+this.props.index :this.props.className;
        return <div className={className}> {
                this.props.user?
                <img src={src} alt={alt} className={className} onMouseEnter={this.onMouseOver} onMouseLeave={this.onMouseOver}
                     onClick={()=>this.props.onClick(this.props.index)}/>:
                this.props.table?
                <img src={src} alt={alt} className={className}/>:
                this.props.src === ""?
                <div className={className}/>:
                <img src={playerCard} alt={alt} className={className}/>
            }
        </div>;
    }
}

export default Card;