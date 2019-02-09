import React, { Component } from 'react';
import './App.css';
import Table from "./Table/Table";
import EnterPage from "./EnterPage/EnterPage"

class App extends Component {
    constructor() {
        super();
        this.state = {
            buttonPressed: false
        }
    }
    handleClick = () =>{
        this.setState({buttonPressed: true})
    };
    render() {
        return this.state.buttonPressed? <Table/>: <EnterPage handleClick={this.handleClick}/>;
    }
}
export default App;