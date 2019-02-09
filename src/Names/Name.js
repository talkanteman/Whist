import React, {Component} from 'react'
import './Name.css'
class Name extends Component {
    render() {
        if (this.props.bet.value === undefined) {
            return <div className={this.props.pos+"Name"}>
                <h3>
                    {this.props.name}
                    <br/>{"packs: " + this.props.packs}
                    <br/>{" points: " + this.props.points}
                    <br/>{" bet: "}
                </h3>
            </div>
        }
        return <div className={this.props.pos+"Name"}>
                <h3>
                    {this.props.name}
                    <br/>{"packs: " + this.props.packs}
                    <br/>{" points: " + this.props.points}
                    <br/>{" bet: " + this.props.bet.value + this.props.bet.shape}
                </h3>
        </div>;
    }
}
export default Name;