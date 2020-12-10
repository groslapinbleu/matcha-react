import React from 'react';
import { withFirebase } from '../services/Firebase'


function AdminPage(props) {
    return (
        <div className="flex h-screen justify-center items-center">
            <h1 className="font-bold">Admin Page: </h1>
            <p>This page should only be accessible to admin profiles... Work In Progress</p>
        </div>
    );
}

export default withFirebase(AdminPage)