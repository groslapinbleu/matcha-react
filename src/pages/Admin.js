import React from 'react';
import { withFirebase } from 'services/Firebase'
import IndigoBox from 'components/IndigoBox';
import Footer from "components/Footer";
import Header from "components/Header";
import UserItem from "components/UserItem"
import UserList from "components/UserList"

import { Switch, Route } from 'react-router-dom';

function Admin({ firebase }) {
    return (
        <div>
            <Header></Header>
            <section className="p-5 shadow">
                <IndigoBox title="Admin Page">
                    <p>This page should only be accessible to admin profiles...</p>
                    <p> Work In Progress</p>
                </IndigoBox>
            </section>
            <section className="p-5 shadow">
                <Switch>
                    <Route exact path="/admin/:id" component={UserItem} />
                    <Route exact path="/admin" component={UserList} />
                </Switch>
            </section>
            <Footer></Footer>
        </div>
    )

}

export default withFirebase(Admin)