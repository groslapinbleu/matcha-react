import React from 'react';
import IndigoBox from '../components/IndigoBox';
import { withFirebase } from '../services/Firebase'
import Footer from "../components/Footer";
import Header from "../components/Header";

function Notification({ firebase }) {
    return (
        <div>
            <Header></Header>
            <section className="p-5 shadow">
                <IndigoBox title="Notification Page">
                    <p>Work In Progress</p>
                </IndigoBox>
            </section>
            <Footer></Footer>
        </div>
    )
}

export default withFirebase(Notification)