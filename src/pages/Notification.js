import React, { Component } from 'react';
import MatchaBox from '../components/MatchaBox';
import { withFirebase } from '../services/Firebase'
import Footer from "../components/Footer";
import Header from "../components/Header";


class Notification extends Component {
    constructor(props) {
        super(props);
        this.state = {
            anything: ''
        };
    
      }



    render() {
        return (


            <div>
                <Header></Header>
                <section className="p-5 shadow">
                    <MatchaBox title="Notification Page">
                        <p>Work In Progress</p>

                    </MatchaBox>
                </section>
                <Footer></Footer>
            </div>
        )
    }
}

export default withFirebase(Notification)