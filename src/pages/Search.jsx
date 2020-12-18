import React, { Component } from 'react';
import MatchaBox from '../components/MatchaBox';
import { withFirebase } from '../services/Firebase'
import Footer from "../components/Footer";
import Header from "../components/Header";
import UserSearchList from 'components/UserSearchList';


class Search extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchstring: ''
        };
        this.handleChange = this.handleChange.bind(this);

    }


    handleChange(event) {
        this.setState({
          [event.target.name]: event.target.value
        });
      }

    render() {
        return (


            <div>
                <Header></Header>
                <section className="p-5 shadow">
                    <MatchaBox title="Search criteria">
                        <form>
                            <input type="text" placeholder="Enter search string" value={this.state.searchstring} onChange={this.handleChange}></input>
                        </form>
                    </MatchaBox>
                    <MatchaBox title="Search Results">
                        <UserSearchList></UserSearchList>
                    </MatchaBox>
                </section>
                <Footer></Footer>
            </div>
        )
    }
}

export default withFirebase(Search)