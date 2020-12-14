import React from 'react';
import IndigoBox from '../components/IndigoBox';
import { withFirebase } from '../services/Firebase'
import Footer from "../components/Footer";
import Header from "../components/Header";
import RadioButton from 'components/RadioButton';
import { genders } from 'models/UserData'

function Notification({ firebase }) {
    const bringItOn = (val) => {
        console.log("received value " + val)
    }
    return (


        <div>
            <Header></Header>
            <section className="p-5 shadow">
                <IndigoBox title="Notification Page">
                    <p>Work In Progress</p>
                    <RadioButton
                        selectedElement={1}
                        arrayValues={genders}
                        name="gender"
                        className="mr-5"
                        onSelect={bringItOn}
                    ></RadioButton>
                </IndigoBox>
            </section>
            <Footer></Footer>
        </div>
    )
}

export default withFirebase(Notification)