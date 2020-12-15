import React, { Component } from 'react';
import MatchaBox from '../components/MatchaBox';
import { withFirebase } from '../services/Firebase'
import Footer from "../components/Footer";
import Header from "../components/Header";
import RadioButton from 'components/RadioButton';
import { regions } from 'models/UserData'

class Notification extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedElement: 0
        };
    
        this.bringItOn = this.bringItOn.bind(this);
      }

    bringItOn = (name, val) => {
        console.log("received name = " + name + " value=" + val)
        this.setState({selectedElement: val})
    }

    render() {
        return (


            <div>
                <Header></Header>
                <section className="p-5 shadow">
                    <MatchaBox title="Notification Page">
                        <p>Work In Progress</p>
                        <RadioButton
                            selectedElement={this.state.selectedElement}
                            arrayValues={regions}
                            name="gender"
                            className="mr-5"
                            onSelect={this.bringItOn}
                        ></RadioButton>
                        <p>Vous avez sélectionné {regions[this.state.selectedElement]}</p>
                    </MatchaBox>
                </section>
                <Footer></Footer>
            </div>
        )
    }
}

export default withFirebase(Notification)