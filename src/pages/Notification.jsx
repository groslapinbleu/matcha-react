import React, { Component } from 'react';
import MatchaBox from '../components/MatchaBox';
import { withFirebase } from '../services/Firebase'
import Footer from "../components/Footer";
import Header from "../components/Header";
import Dropdown from 'components/Dropdown';
import { regions } from 'models/UserData'


class Notification extends Component {
    constructor(props) {
        console.log("Notification constructor")
        super(props);
        this.state = {
            selectedElement: 0
        };

    }

    handleChangeDropdown = (name, value) => {
        console.log("name=" + name + " value=" + value)
    }

    render() {
        return (


            <div>
                <Header></Header>
                <section className="p-5 shadow">
                    <MatchaBox title="Notification Page">
                        <p>Work In Progress</p>
                        <Dropdown
                            selectedElement={this.state.selectedElement}
                            elementList={regions}
                            name="region"
                            className="mr-5"
                            onSelect={this.handleChangeDropdown}
                            >
                        </Dropdown>
                    </MatchaBox>
                </section>
                <Footer></Footer>
            </div>
        )
    }
}

export default withFirebase(Notification)