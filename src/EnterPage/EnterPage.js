import React, {Component} from 'react';
import './EnterPage.css'
class EnterPage extends Component {
    constructor() {
        super();
        this.state = {
            mouseOver: false
        }
    }

    handleClick = (event)=>{
        this.props.handleClick(event);
    };

    onMouseOver = ()=>{
        this.setState({
            mouseOver: !this.state.mouseOver
        })
    };
    render() {
        return this.state.mouseOver?
            <div>
                <h3 className={"headLine"}> The Israeli Wist Game </h3>
                <button className={"OnMouseOver"} onMouseEnter={this.onMouseOver} onMouseLeave={this.onMouseOver} onClick={this.handleClick}>
                    please press on the button
                    <br/>
                    to start a new game</button>
            </div>:
            <div>
                <h3 className={"headLine"}> The Israeli Wist Game </h3>
                <button className={"Enter"} onMouseOver={this.onMouseOver} onClick={this.handleClick}>please press on the button
                    <br/>
                    to start a new game</button>
            </div>;
    }
}

export default EnterPage;